import { cert, getApp, getApps, initializeApp, type App } from 'firebase-admin/app'
import { getAuth, type DecodedIdToken } from 'firebase-admin/auth'
import {
  getFirebaseAdminConfig,
  type FirebaseAdminConfig,
} from '../config/firebaseAdmin.ts'

const firebaseAdminAppName = 'cpsu-pdo-server'

export function getFirebaseAdminApp(config: FirebaseAdminConfig): App {
  const existingApp = getApps().find((app) => app.name === firebaseAdminAppName)
  if (existingApp) return getApp(firebaseAdminAppName)

  return initializeApp(
    {
      credential: cert({
        projectId: config.projectId,
        clientEmail: config.clientEmail,
        privateKey: config.privateKey,
      }),
      projectId: config.projectId,
    },
    firebaseAdminAppName,
  )
}

export async function verifyFirebaseIdToken(
  token: string,
  environment: NodeJS.ProcessEnv = process.env,
): Promise<DecodedIdToken> {
  const app = getFirebaseAdminApp(getFirebaseAdminConfig(environment))
  return getAuth(app).verifyIdToken(token, true)
}
