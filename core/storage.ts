export interface StorageAdapter {
  getItem<T = unknown>(key: string): Promise<T | null> | T | null;
  setItem<T = unknown>(key: string, value: T): Promise<void> | void;
  removeItem(key: string): Promise<void> | void;
}

export class MemoryStorage implements StorageAdapter {
  private readonly map = new Map<string, unknown>();

  getItem<T>(key: string): T | null {
    return (this.map.has(key) ? (this.map.get(key) as T) : null);
  }

  setItem<T>(key: string, value: T): void {
    this.map.set(key, value);
  }

  removeItem(key: string): void {
    this.map.delete(key);
  }
}

export class BrowserLocalStorage implements StorageAdapter {
  getItem<T>(key: string): T | null {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const raw = window.localStorage.getItem(key);
    if (raw == null) return null;
    try { return JSON.parse(raw) as T; } catch { return null; }
  }
  setItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.setItem(key, JSON.stringify(value));
  }
  removeItem(key: string): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    window.localStorage.removeItem(key);
  }
}
