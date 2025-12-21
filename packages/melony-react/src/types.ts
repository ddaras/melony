import { Event, Role } from "melony";

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface Message {
  role: Role;
  content: Event[];
  runId?: string;
  threadId?: string;
}

export interface ThreadData {
  id: string;
  title?: string;
  updatedAt?: Date | string;
}

export interface StarterPrompt {
  label: string;
  prompt: string;
  icon?: React.ReactNode;
}

export interface AuthService {
  getMe: () => Promise<User | null>;
  login: () => void;
  logout: () => Promise<void>;
  getToken: () => string | null;
}

export interface ThreadService {
  getThreads: () => Promise<ThreadData[]>;
  createThread?: () => Promise<string>;
  deleteThread: (id: string) => Promise<void>;
  getEvents: (threadId: string) => Promise<Event[]>;
}
