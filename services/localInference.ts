
import { GoogleGenAI } from "@google/genai";
import { Message, AppConfig, ReasoningStep, MemoryEntry, TaskType, Plan, ToolCall } from '../types';
import { STORAGE_KEYS, TASK_SPECIFIC_PROMPTS } from '../constants';
import { appendToken } from '../app/utils/streamBuffer';

export const localInference = {
  classifyTask(prompt: string): TaskType {
    const p = prompt.toLowerCase();
    if (p.includes("write code") || p.includes("function") || p.includes("bug") || p.includes("typescript") || p.includes("rust") || p.includes("code")) {
      return 'Code';
    } else if (p.includes("why") || p.includes("explain") || p.includes("analyze") || p.includes("reason")) {
      return 'Reasoning';
    } else if (p.includes("search") || p.includes("find") || p.includes("lookup")) {
      return 'Search';
    } else {
      return 'Chat';
    }
  },

  detectToolCall(text: string): ToolCall | null {
    // Matches "tool:write_file:content" or similar structure
    if (text.includes("tool:")) {
      const parts = text.split(':');
      if (parts.length >= 3) {
        return {
          name: parts[1],
          input: parts.slice(2).join(':')
        };
      }
    }
    return null;
  },

  createPlan(prompt: string, taskType: TaskType): Plan {
    const commonSteps = ["Understand context", "Retrieve identity memory"];
    let specificSteps: string[] = [];
    
    switch (taskType) {
      case 'Code':
        specificSteps = ["Architect solution", "Implement logic", "Verify Tool Output"];
        break;
      case 'Reasoning':
        specificSteps = ["Break into logic blocks", "Analyze constraints", "Synthesize conclusion"];
        break;
      case 'Search':
        specificSteps = ["Identify keywords", "Synthesize findings"];
        break;
      default:
        specificSteps = ["Formulate response"];
    }

    return { steps: [...commonSteps, ...specificSteps] };
  },

  async learnFromInteraction(query: string, response: string): Promise<void> {
    const memory: MemoryEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.COGNITIVE_MEMORY) || '[]');
    let type: MemoryEntry['type'] = 'knowledge';
    if (response.includes('```')) type = 'style';
    if (query.toLowerCase().includes('i prefer') || query.toLowerCase().includes('use ')) type = 'preference';

    const newEntry: MemoryEntry = {
      id: Date.now().toString(),
      text: `Context: ${query.slice(0, 100)}... -> Learned: ${response.slice(0, 200)}...`,
      type,
      timestamp: Date.now(),
      importance: type === 'preference' ? 1.0 : 0.6,
      isPinned: false
    };
    
    memory.push(newEntry);
    if (memory.length > 50) memory.shift();
    localStorage.setItem(STORAGE_KEYS.COGNITIVE_MEMORY, JSON.stringify(memory));
  },

  async retrieveCognitiveMemory(query: string): Promise<string[]> {
    const memory: MemoryEntry[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.COGNITIVE_MEMORY) || '[]');
    const queryTerms = query.toLowerCase().split(' ').filter(t => t.length > 3);
    
    return memory
      .filter(entry => entry.isPinned || queryTerms.some(term => entry.text.toLowerCase().includes(term)))
      .sort((a, b) => b.importance - a.importance)
      .slice(0, 4)
      .map(e => e.text);
  },

  async streamResponse(
    config: AppConfig,
    history: Message[],
    onStepUpdate: (steps: ReasoningStep[]) => void,
    onToken: (token: string, tps: number) => void,
    onComplete: (full: string, sources: string[], toolCalls?: ToolCall[]) => void,
    onError: (err: any) => void
  ) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const userQuery = history[history.length - 1].content;

    const taskType = this.classifyTask(userQuery);
    const plan = this.createPlan(userQuery, taskType);
    const steps: ReasoningStep[] = plan.steps.map(s => ({ label: s, status: 'pending' }));

    try {
      steps[0].status = 'active';
      onStepUpdate([...steps]);
      
      await new Promise(r => setTimeout(r, 400));
      steps[0].status = 'complete';
      steps[1].status = 'active';
      onStepUpdate([...steps]);

      let personalContext = "";
      let sources: string[] = [];
      if (config.useCognitiveMemory) {
        const memory = await this.retrieveCognitiveMemory(userQuery);
        if (memory.length > 0) {
          personalContext = `USER STYLE/PREFS: ${memory.join(' | ')}`;
          sources = ["Identity Vault"];
        }
      }
      
      steps[1].status = 'complete';
      steps[2].status = 'active';
      onStepUpdate([...steps]);

      const systemInstruction = `
        SYSTEM: NeuralPulse V3 (Active Task: ${taskType}).
        MODE: ${TASK_SPECIFIC_PROMPTS[taskType]}
        PERSONAL_CONTEXT: ${personalContext || "Generic profile."}
        TOOLS: You can use tools by prefixing your response with 'tool:[name]:[input]'. Available: write_file, read_file.
      `;

      const contents = history.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const startTime = Date.now();
      let tokenCount = 0;

      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-3-pro-preview',
        contents: contents,
        config: {
          systemInstruction,
          temperature: config.profile === 'Eco' ? 0.2 : 0.8,
          thinkingConfig: { 
            thinkingBudget: config.profile === 'Performance' ? 32000 : 16000 
          }
        }
      });

      let fullText = "";
      for await (const chunk of responseStream) {
        const text = chunk.text;
        if (text) {
          fullText += text;
          tokenCount += text.length / 4;
          const elapsed = (Date.now() - startTime) / 1000;
          
          // Use our batched stream buffer for performance
          appendToken(text, (batchedText) => {
            onToken(batchedText, Math.round(tokenCount / elapsed));
          });
        }
      }

      // MARK: Tool Detection
      const toolCall = this.detectToolCall(fullText);
      let toolResults: ToolCall[] = [];
      if (toolCall) {
        toolCall.result = `Simulated execution of ${toolCall.name} success.`;
        toolResults.push(toolCall);
      }

      steps.forEach(s => s.status = 'complete');
      onStepUpdate([...steps]);
      onComplete(fullText, sources, toolResults);

      if (fullText.length > 50) {
        this.learnFromInteraction(userQuery, fullText);
      }

    } catch (err) {
      onError(err);
    }
  }
};
