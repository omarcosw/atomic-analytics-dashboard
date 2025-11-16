/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

const DEMO_EMAIL = "demo@atomicplus.com";
const DEMO_PASSWORD = "demo123";
const DEMO_KEY = "atomic-demo-user";

const createDemoUser = (): User => {
  const timestamp = new Date().toISOString();
  return {
    id: "demo-user",
    app_metadata: { provider: "demo", providers: ["demo"] },
    user_metadata: { full_name: "Demo Atomic" },
    aud: "authenticated",
    created_at: timestamp,
    email: DEMO_EMAIL,
    email_confirmed_at: timestamp,
    phone: "",
    confirmed_at: timestamp,
    last_sign_in_at: timestamp,
    role: "authenticated",
    updated_at: timestamp,
    identities: [],
    factor_ids: [],
    is_anonymous: false,
  } as User;
};

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setSession(data.session);
        setUser(data.session.user);
      } else if (localStorage.getItem(DEMO_KEY)) {
        setSession(null);
        setUser(createDemoUser());
      }
      setIsLoading(false);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      if (currentSession) {
        localStorage.removeItem(DEMO_KEY);
        setSession(currentSession);
        setUser(currentSession.user);
      } else if (localStorage.getItem(DEMO_KEY)) {
        setSession(null);
        setUser(createDemoUser());
      } else {
        setSession(null);
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      const demoUser = createDemoUser();
      localStorage.setItem(DEMO_KEY, "true");
      setSession(null);
      setUser(demoUser);
      return { success: true };
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  };

  const signUp = async (name: string, email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  const signOut = async () => {
    if (localStorage.getItem(DEMO_KEY)) {
      localStorage.removeItem(DEMO_KEY);
      setSession(null);
      setUser(null);
      return;
    }
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
