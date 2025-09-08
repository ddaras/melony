export type ToolCall = { 
  id: string;
  name: string; 
  args?: Record<string, any>;
  status?: 'pending' | 'streaming' | 'completed' | 'error';
  inputStream?: string; // Accumulated input during streaming
};

export type ToolResult = { 
  success: boolean; 
  output?: any;
  toolCallId?: string;
};
