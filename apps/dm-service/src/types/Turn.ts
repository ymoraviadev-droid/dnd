export type Turn ={
  id: string;
  sessionId: string;
  type: 'dm' | 'code';
  prompt: string;
  response: string;
  timestamp: number;
  metadata?: Record<string, any>;
}