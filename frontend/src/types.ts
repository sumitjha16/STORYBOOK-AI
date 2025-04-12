// types.ts - Updated with proper backend integration types
import { ReactNode } from 'react';

export type House = 'gryffindor' | 'slytherin' | 'ravenclaw' | 'hufflepuff';

export type ResponseMode = 'freeform' | 'structured';

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: number;
}

export interface ChatRequest {
  messages: Message[];
  response_mode: ResponseMode;
  stream: boolean;
}

export interface ChatResponse {
  message: Message;
  sources: string[];
}

// Added 'spell' and 'house' to summary request types
export interface SummaryRequest {
  type: 'chapter' | 'character' | 'event' | 'location' | 'spell' | 'house';
  target: string;
  response_mode: ResponseMode;
}

export interface Summary {
  title: string;
  content: string;
  sources: Array<{ book: number; chapter: number }>;
}

export interface HealthResponse {
  version: string;
}

export interface ModeToggleProps {
  mode: ResponseMode;
  onChange: (mode: ResponseMode) => void;
}