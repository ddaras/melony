import { Event, Role } from "melony";

export interface User {
  id?: string;
  uid: string;
  email: string;
  name?: string;
  displayName?: string;
  picture?: string;
  createdAt?: string;
  lastSignIn?: string | null;
  emailVerified?: boolean;
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

export interface ComposerOption {
  id: string;
  label: string;
  value: any;
}

export interface ComposerOptionGroup {
  id: string;
  label: string;
  options: ComposerOption[];
  type?: "single" | "multiple";
  defaultSelectedIds?: string[];
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
