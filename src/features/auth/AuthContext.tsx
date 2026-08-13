import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { AuthContext, type AuthContextValue } from "./authContextValue";
import { getFirebaseAuth } from "./firebaseAuth";

type AuthenticationStatus =
  | "initializing"
  | "authenticated"
  | "unauthenticated";

function initializeAuthentication() {
  try {
    return { auth: getFirebaseAuth(), configurationError: null };
  } catch (error) {
    return {
      auth: null,
      configurationError:
        error instanceof Error
          ? error.message
          : "Administrator login is not configured for this environment.",
    };
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [initialization] = useState(initializeAuthentication);
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthenticationStatus>(
    initialization.auth ? "initializing" : "unauthenticated",
  );

  useEffect(() => {
    if (!initialization.auth) return;
    return onAuthStateChanged(initialization.auth, (nextUser) => {
      setUser(nextUser);
      setStatus(nextUser ? "authenticated" : "unauthenticated");
    });
  }, [initialization]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      status,
      configurationError: initialization.configurationError,
      async signIn(email, password) {
        await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
      },
      async signOut() {
        await firebaseSignOut(getFirebaseAuth());
      },
    }),
    [initialization.configurationError, status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
