import { createContext } from "react";
import type { User } from "firebase/auth";

type AuthenticationStatus =
  | "initializing"
  | "authenticated"
  | "unauthenticated";

export type AuthContextValue = {
  user: User | null;
  status: AuthenticationStatus;
  configurationError: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
