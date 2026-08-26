import { z } from 'zod'

const serverUrlSchema = z.url().refine((value) => {
  const url = new URL(value)
  return url.protocol === 'https:' || (
    url.protocol === 'http:' &&
    ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)
  )
}, 'URL must use HTTPS. HTTP is allowed only for local development.')

const optionalServerUrlSchema = z.preprocess(
  (value) => (value === '' ? undefined : value),
  serverUrlSchema.optional(),
)

const r2EnvironmentSchema = z.object({
  R2_ACCOUNT_ID: z.string().trim().min(1),
  R2_ACCESS_KEY_ID: z.string().trim().min(1),
  R2_SECRET_ACCESS_KEY: z.string().trim().min(1),
  R2_BUCKET_NAME: z.string().trim().min(1),
  R2_ENDPOINT: optionalServerUrlSchema,
})

export type R2Config = {
  accountId: string
  accessKeyId: string
  secretAccessKey: string
  bucketName: string
  endpoint: string
}

export class R2ConfigurationError extends Error {
  constructor() {
    super('Cloudflare R2 server configuration is incomplete or invalid.')
    this.name = 'R2ConfigurationError'
  }
}

export function getR2Config(environment: NodeJS.ProcessEnv = process.env): R2Config {
  const result = r2EnvironmentSchema.safeParse(environment)
  if (!result.success) throw new R2ConfigurationError()

  const endpoint = result.data.R2_ENDPOINT ??
    `https://${result.data.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`
  const production = environment.VERCEL_ENV === 'production' || environment.NODE_ENV === 'production'
  if (production && new URL(endpoint).protocol !== 'https:') {
    throw new R2ConfigurationError()
  }

  return {
    accountId: result.data.R2_ACCOUNT_ID,
    accessKeyId: result.data.R2_ACCESS_KEY_ID,
    secretAccessKey: result.data.R2_SECRET_ACCESS_KEY,
    bucketName: result.data.R2_BUCKET_NAME,
    endpoint,
  }
}
