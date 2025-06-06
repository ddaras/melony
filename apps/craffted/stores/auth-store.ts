import { create } from "zustand";
import { User, AuthChangeEvent, Session } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

interface AuthState {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

type SetState = {
  setState: (partial: Partial<AuthState>) => void;
};

export const useAuthStore = create<AuthState>((set: SetState["setState"]) => ({
  user: null,
  loading: true,
  setUser: (user: User | null) => set({ user }),
  setLoading: (loading: boolean) => set({ loading }),
  signInWithGoogle: async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  },
  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error("Error signing out:", error);
    }
  },
}));

// Initialize auth state listener
if (typeof window !== "undefined") {
  supabase.auth.onAuthStateChange(
    (event: AuthChangeEvent, session: Session | null) => {
      useAuthStore.getState().setUser(session?.user ?? null);
      useAuthStore.getState().setLoading(false);
    }
  );
}
