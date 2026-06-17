import { createContext, useContext, createElement, type ReactNode } from "react";
import { trpc } from "@/providers/trpc";

type User = {
  id: number;
  unionId: string;
  name: string | null;
  email: string | null;
  avatar: string | null;
  role: "user" | "admin";
  phone: string | null;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const utils = trpc.useUtils();

  const { data: user, isLoading } = trpc.auth.me.useQuery(undefined, {
    retry: false,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      await utils.auth.me.invalidate();
      await utils.auth.me.reset();

      window.location.href = "/";
    },
    onError: () => {
      window.location.href = "/";
    },
  });

  function logout() {
    logoutMutation.mutate();
  }

  return createElement(
    AuthContext.Provider,
    {
      value: {
        user: user ?? null,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isLoading,
        logout,
      },
    },
    children,
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return ctx;
}