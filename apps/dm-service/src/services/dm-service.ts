import { createClient, RedisClientType } from 'redis';
import { LlamaChatSession } from 'node-llama-cpp';
import { createLlamaService, LlamaService } from './llama-service.js';
import { DMTask } from '../types/DMTask.js';
import { TaskResult } from '../types/TaskResult.js';
import { Turn } from '../types/Turn.js';

export class DMService {
  private redis: RedisClientType;
  private llama?: LlamaService;
  private sessions: Map<string, LlamaChatSession> = new Map();
  private isRunning = false;

  constructor() {
    this.redis = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
  }

  async initialize(): Promise<void> {
    // Connect to Redis
    await this.redis.connect();
    console.log('✅ Connected to Redis');

    // Initialize Llama service
    this.llama = await createLlamaService();
    console.log('✅ Llama service initialized');

    // Set up Redis streams
    await this.setupStreams();
    console.log('✅ Redis streams configured');
  }

  private async setupStreams(): Promise<void> {
    try {
      // Create consumer group for tasks (if not exists)
      await this.redis.xGroupCreate('dm:tasks', 'dm-service', '0', { MKSTREAM: true });
    } catch (error) {
      // Group might already exist, that's ok
    }

    try {
      await this.redis.xGroupCreate('code:tasks', 'code-service', '0', { MKSTREAM: true });
    } catch (error) {
      // Group might already exist, that's ok
    }
  }

  async start(): Promise<void> {
    this.isRunning = true;
    console.log('DM Service started');

    // Start task processors
    const dmProcessor = this.processTaskStream('dm:tasks', 'dm-service');
    const codeProcessor = this.processTaskStream('code:tasks', 'code-service');

    // Wait for both processors
    await Promise.all([dmProcessor, codeProcessor]);
  }

  async stop(): Promise<void> {
    this.isRunning = false;
    if (this.llama) {
      await this.llama.cleanup();
    }
    await this.redis.disconnect();
    console.log('🛑 DM Service stopped');
  }

  private async processTaskStream(streamKey: string, groupName: string): Promise<void> {
    const consumerName = `consumer-${process.pid}`;
    
    while (this.isRunning) {
      try {
        // Read from stream
        const results = await this.redis.xReadGroup(
          groupName,
          consumerName,
          [{ key: streamKey, id: '>' }],
          { COUNT: 1, BLOCK: 1000 }
        );

        if (!results || results.length === 0) continue;

        for (const stream of results) {
          for (const message of stream.messages) {
            await this.processTask(message.id, message.message, streamKey);
            
            // Acknowledge message
            await this.redis.xAck(streamKey, groupName, message.id);
          }
        }
      } catch (error) {
        console.error(`Error processing ${streamKey}:`, error);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Back off
      }
    }
  }

  private async processTask(messageId: string, taskData: Record<string, string>, streamKey: string): Promise<void> {
    try {
      const task: DMTask = {
        id: messageId,
        type: taskData.type as 'dm',
        prompt: taskData.prompt,
        sessionId: taskData.sessionId,
        metadata: taskData.metadata ? JSON.parse(taskData.metadata) : undefined
      };

      console.log(`Processing ${task.type} task: ${task.id}`);

      let response: string;
      let session: LlamaChatSession | undefined;

      // Get or create session
      if (task.sessionId) {
        session = this.sessions.get(task.sessionId);
        if (!session) {
          if (!this.llama) {
            throw new Error('Llama service is not initialized');
          }
            await this.llama.createDMSession()
          if (session) {
            this.sessions.set(task.sessionId, session);
          }
        }
      }

      // Process task
      if (!this.llama) {
        throw new Error('Llama service is not initialized');
      }
        response = await this.llama.askDM(task.prompt, session);

      // Store turn in Redis
      await this.storeTurn({
        id: `turn:${task.id}`,
        sessionId: task.sessionId || 'anonymous',
        type: task.type,
        prompt: task.prompt,
        response,
        timestamp: Date.now(),
        metadata: task.metadata
      });

      // Publish result
      const result: TaskResult = {
        taskId: task.id,
        success: true,
        response,
        metadata: task.metadata
      };

      await this.publishResult(result);

    } catch (error) {
      console.error(`Failed to process task ${messageId}:`, error);
      
      const result: TaskResult = {
        taskId: messageId,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      await this.publishResult(result);
    }
  }

  private async storeTurn(turn: Turn): Promise<void> {
    // Store in Redis hash
    await this.redis.hSet(`turn:${turn.id}`, {
      id: turn.id,
      sessionId: turn.sessionId,
      type: turn.type,
      prompt: turn.prompt,
      response: turn.response,
      timestamp: turn.timestamp.toString(),
      metadata: turn.metadata ? JSON.stringify(turn.metadata) : ''
    });

    // Add to session timeline
    await this.redis.zAdd(`session:${turn.sessionId}:turns`, {
      score: turn.timestamp,
      value: turn.id
    });

    // Add to global timeline
    await this.redis.zAdd('turns:timeline', {
      score: turn.timestamp,
      value: turn.id
    });
  }

  private async publishResult(result: TaskResult): Promise<void> {
    await this.redis.publish('task:results', JSON.stringify(result));
  }

  // Public methods for retrieving data

  async getTurn(turnId: string): Promise<Turn | null> {
    const data = await this.redis.hGetAll(`turn:${turnId}`);
    if (!data.id) return null;

    return {
      id: data.id,
      sessionId: data.sessionId,
      type: data.type as 'dm',
      prompt: data.prompt,
      response: data.response,
      timestamp: parseInt(data.timestamp),
      metadata: data.metadata ? JSON.parse(data.metadata) : undefined
    };
  }

  async getSessionTurns(sessionId: string, limit = 50): Promise<Turn[]> {
    const turnIds = await this.redis.zRange(`session:${sessionId}:turns`, 0, limit - 1, { REV: true });
    const turns: Turn[] = [];

    for (const turnId of turnIds) {
      const turn = await this.getTurn(turnId);
      if (turn) turns.push(turn);
    }

    return turns;
  }

  async clearSession(sessionId: string): Promise<void> {
    this.sessions.delete(sessionId);
    console.log(`Cleared session: ${sessionId}`);
  }

  async getActiveSessionCount(): Promise<number> {
    return this.sessions.size;
  }
}