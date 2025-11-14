import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Simula localStorage para persistir sessão
const STORAGE_KEY = "atomic_fake_auth";

const getFakeUser = (): User | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
};

const setFakeUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
};

export const useAuthFake = () => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const user = getFakeUser();
    return {
      user,
      isAuthenticated: !!user,
    };
  });

  const login = (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      // Simula delay de API
      setTimeout(() => {
        // Simula validação básica
        if (!email || !password) {
          resolve({ success: false, error: "Email e senha são obrigatórios" });
          return;
        }

        const user: User = {
          id: "1",
          name: email.split("@")[0],
          email,
        };

        setFakeUser(user);
        setAuthState({ user, isAuthenticated: true });
        resolve({ success: true });
      }, 800);
    });
  };

  const register = (
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    return new Promise((resolve) => {
      // Simula delay de API
      setTimeout(() => {
        // Validações básicas
        if (!name || !email || !password) {
          resolve({ success: false, error: "Todos os campos são obrigatórios" });
          return;
        }

        if (password !== confirmPassword) {
          resolve({ success: false, error: "As senhas não coincidem" });
          return;
        }

        if (password.length < 6) {
          resolve({ success: false, error: "A senha deve ter no mínimo 6 caracteres" });
          return;
        }

        const user: User = {
          id: Date.now().toString(),
          name,
          email,
        };

        setFakeUser(user);
        setAuthState({ user, isAuthenticated: true });
        resolve({ success: true });
      }, 800);
    });
  };

  const logout = () => {
    setFakeUser(null);
    setAuthState({ user: null, isAuthenticated: false });
  };

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    login,
    register,
    logout,
  };
};
