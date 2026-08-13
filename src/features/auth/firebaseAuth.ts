import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { z } from "zod";

const firebaseClientEnvironmentSchema = z.object({
  VITE_FIREBASE_API_KEY: z.string().trim().min(1),
  VITE_FIREBASE_AUTH_DOMAIN: z.string().trim().min(1),
  VITE_FIREBASE_PROJECT_ID: z.string().trim().min(1),
  VITE_FIREBASE_APP_ID: z.string().trim().min(1),
});

export class FirebaseConfigurationError extends Error {
  constructor() {
    super("Administrator login is not configured for this environment.");
    this.name = "FirebaseConfigurationError";
  }
}

export function getFirebaseAuth() {
  const environment = firebaseClientEnvironmentSchema.safeParse(
    import.meta.env,
  );
  if (!environment.success) throw new FirebaseConfigurationError();

  const app = getApps().length
    ? getApp()
    : initializeApp({
        apiKey: environment.data.VITE_FIREBASE_API_KEY,
        authDomain: environment.data.VITE_FIREBASE_AUTH_DOMAIN,
        projectId: environment.data.VITE_FIREBASE_PROJECT_ID,
        appId: environment.data.VITE_FIREBASE_APP_ID,
      });
  return getAuth(app);
}
