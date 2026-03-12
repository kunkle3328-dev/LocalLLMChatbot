
import { LocalModel, AppConfig, TaskType } from './types';

export const APP_NAME = "NEXUS AI";
export const TAGLINE = "Advanced AI Assistant";

export const COLORS = {
  primary: "#0ea5e9", // Cyan
  secondary: "#8b5cf6", // Purple
  accent: "#3b82f6", // Blue
  silver: "#e2e8f0",
  background: "#07070a"
};

export const AVAILABLE_MODELS: LocalModel[] = [
  {
    id: 'qwen-2.5-coder-7b',
    name: 'Nexus Core Coder',
    version: 'Q4_K_M',
    size: '4.7 GB',
    vramRequired: '5.2 GB',
    isDownloaded: true,
    role: 'Generalist',
    description: 'Premier coding workhorse. Optimized for mobile ARM64.'
  },
  {
    id: 'phi-3-mini-reasoner',
    name: 'Nexus Logic Mini',
    version: '3.8B Q4',
    size: '2.2 GB',
    vramRequired: '2.8 GB',
    isDownloaded: true,
    role: 'Reasoning',
    description: 'Planning model. Low RAM footprint for intent detection.'
  },
  { id: 'llama-3-8b-instruct', name: 'Llama 3 8B Instruct', version: 'Q4_K_M', size: '4.9 GB', vramRequired: '5.5 GB', isDownloaded: false, role: 'Generalist', description: 'Balanced general-purpose assistant.' },
  { id: 'mistral-7b-v0.3', name: 'Mistral 7B v0.3', version: 'Q4_K_M', size: '4.4 GB', vramRequired: '5.0 GB', isDownloaded: false, role: 'Generalist', description: 'Versatile and efficient model.' },
  { id: 'gemma-2-9b-it', name: 'Gemma 2 9B IT', version: 'Q4_K_M', size: '5.5 GB', vramRequired: '6.2 GB', isDownloaded: false, role: 'Generalist', description: 'Google-optimized instruction model.' },
  { id: 'deepseek-coder-6.7b', name: 'DeepSeek Coder 6.7B', version: 'Q4_K_M', size: '4.0 GB', vramRequired: '4.5 GB', isDownloaded: false, role: 'Coding', description: 'Specialized coding model.' },
  { id: 'phi-3-medium-128k', name: 'Phi-3 Medium 128k', version: 'Q4_K_M', size: '7.5 GB', vramRequired: '8.5 GB', isDownloaded: false, role: 'Reasoning', description: 'High-context reasoning model.' },
  { id: 'solar-10.7b', name: 'Solar 10.7B', version: 'Q4_K_M', size: '6.5 GB', vramRequired: '7.5 GB', isDownloaded: false, role: 'Generalist', description: 'High-performance medium model.' },
  { id: 'openchat-3.5', name: 'OpenChat 3.5', version: 'Q4_K_M', size: '4.5 GB', vramRequired: '5.0 GB', isDownloaded: false, role: 'Generalist', description: 'Fine-tuned for chat interaction.' },
  { id: 'starling-lm-7b', name: 'Starling LM 7B', version: 'Q4_K_M', size: '4.5 GB', vramRequired: '5.0 GB', isDownloaded: false, role: 'Generalist', description: 'High-quality chat model.' },
  { id: 'zephyr-7b-beta', name: 'Zephyr 7B Beta', version: 'Q4_K_M', size: '4.5 GB', vramRequired: '5.0 GB', isDownloaded: false, role: 'Generalist', description: 'Refined instruction-tuned model.' },
  { id: 'nous-hermes-2-pro', name: 'Nous Hermes 2 Pro', version: 'Q4_K_M', size: '4.5 GB', vramRequired: '5.0 GB', isDownloaded: false, role: 'Generalist', description: 'Advanced instruction-tuned model.' }
];

export const TASK_SPECIFIC_PROMPTS: Record<TaskType, string> = {
  Code: "You are an expert software engineer. Respond with clean, correct, production-quality code. Use markdown and code blocks.",
  Reasoning: "You are a careful analytical assistant. Think step by step, explain clearly, and structure your response.",
  Search: "You summarize and synthesize known information accurately and concisely.",
  Chat: "You are a helpful, friendly AI assistant. Respond naturally and clearly."
};

export const DEFAULT_CONFIG: AppConfig = {
  activeModelId: 'qwen-2.5-coder-7b',
  reasoningModelId: 'phi-3-mini-reasoner',
  quantization: '4-bit',
  profile: 'Balanced',
  useCognitiveMemory: true,
  useGpu: true,
  voiceEnabled: false,
  voiceConfig: {
    voiceName: 'Kore',
    pitch: 1.0,
    speed: 1.0
  }
};

export const STORAGE_KEYS = {
  SESSIONS: 'nexus_sessions_v1',
  CONFIG: 'nexus_config_v1',
  COGNITIVE_MEMORY: 'nexus_vault_v1'
};
