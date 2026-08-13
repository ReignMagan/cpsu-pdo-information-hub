import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resourcesApiPlugin } from './server/dev/resourcesApiPlugin.ts'
import { adminSessionApiPlugin } from './server/dev/adminSessionApiPlugin.ts'
import { adminResourcesApiPlugin } from './server/dev/adminResourcesApiPlugin.ts'
import { uploadAuthorizeApiPlugin } from './server/dev/uploadAuthorizeApiPlugin.ts'
import { uploadCompleteApiPlugin } from './server/dev/uploadCompleteApiPlugin.ts'
import { adminOperationsApiPlugin } from './server/dev/adminOperationsApiPlugin.ts'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const serverEnvironment = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      tailwindcss(),
      resourcesApiPlugin(serverEnvironment),
      adminSessionApiPlugin(serverEnvironment),
      adminResourcesApiPlugin(serverEnvironment),
      uploadAuthorizeApiPlugin(serverEnvironment),
      uploadCompleteApiPlugin(serverEnvironment),
      adminOperationsApiPlugin(serverEnvironment),
    ],
    server: {
      host: '127.0.0.1',
      port: 5173,
      strictPort: true,
    },
  }
})
