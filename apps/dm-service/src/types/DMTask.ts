
export type  DMTask ={
  id: string;
  type: 'dm';
  prompt: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}