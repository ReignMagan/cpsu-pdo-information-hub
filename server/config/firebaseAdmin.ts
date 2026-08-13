import { z } from 'zod'

const firebaseAdminEnvironmentSchema = z.object({
  FIREBASE_ADMIN_PROJECT_ID: z.string().trim().min(1),
  FIREBASE_ADMIN_CLIENT_EMAIL: z.string().trim().email(),
  FIREBASE_ADMIN_PRIVATE_KEY: z.string().trim().min(1),
})

export type FirebaseAdminConfig = {
  projectId: string
  clientEmail: string
  privateKey: string
}

export class FirebaseAdminConfigurationError extends Error {
  constructor() {
    super('Firebase Admin server configuration is incomplete or invalid.')
    this.name = 'FirebaseAdminConfigurationError'
  }
}

export function getFirebaseAdminConfig(
  environment: NodeJS.ProcessEnv = process.env,
): FirebaseAdminConfig {
  const result = firebaseAdminEnvironmentSchema.safeParse(environment)
  if (!result.success) throw new FirebaseAdminConfigurationError()

  return {
    projectId: result.data.FIREBASE_ADMIN_PROJECT_ID,
    clientEmail: result.data.FIREBASE_ADMIN_CLIENT_EMAIL,
    privateKey: result.data.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/gu, '\n'),
  }
}
