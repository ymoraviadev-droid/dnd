import { getLlama, LlamaModel, LlamaContext, LlamaChatSession } from 'node-llama-cpp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class LlamaService {
  private dmModel: LlamaModel | null = null;
  private dmContext: LlamaContext | null = null;

  constructor(
    private dmModelPath: string,
  ) {}

  async initialize(): Promise<void> {
    const llama = await getLlama();

    console.log('Loading D&D DM model...');
    this.dmModel = await llama.loadModel({
      modelPath: this.dmModelPath,
      gpuLayers: 32 // Adjust based on your GPU memory
    });

    // Create contexts
    this.dmContext = await this.dmModel.createContext({
      contextSize: 4096,
      batchSize: 512
    });

    console.log('Models loaded successfully!');
  }

  async createDMSession(): Promise<LlamaChatSession> {
    if (!this.dmContext) throw new Error('DM model not initialized');
    
    const contextSequence = this.dmContext.getSequence();
    return new LlamaChatSession({
      contextSequence,
      systemPrompt: `You are an expert Dungeons & Dragons 2nd Edition Dungeon Master. You have deep knowledge of AD&D 2e rules, settings, and lore. 

Your role is to:
- Create engaging storylines and adventures
- Manage NPCs with distinct personalities
- Describe vivid scenes and environments  
- Apply AD&D 2e rules accurately
- Adapt to player actions creatively
- Maintain narrative consistency

Always respond in character as a DM, providing rich descriptions and clear guidance for players.`
    });
  }


  async askDM(question: string, session?: LlamaChatSession): Promise<string> {
    const dmSession = session || await this.createDMSession();
    
    const response = await dmSession.prompt(question, {
      maxTokens: 512,
      temperature: 0.8, // Higher creativity for storytelling
      topP: 0.9
    });

    return response;
  }

  async cleanup(): Promise<void> {
    // Cleanup is handled automatically by node-llama-cpp
    console.log('Llama service cleanup completed');
  }
}

// Example usage
export async function createLlamaService(): Promise<LlamaService> {
  const modelsDir = join(__dirname, '../llama-models');
  
  const service = new LlamaService(
    join(modelsDir, 'mistral-7b-instruct-v0.2.Q4_K_M.gguf'),
  );
  
  await service.initialize();
  return service;
}
