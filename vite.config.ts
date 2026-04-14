import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const serverPort = env.SERVER_PORT || '3001'

  return {
    base: '/',
    plugins: [inspectAttr(), react()],
    server: {
      proxy: {
        '/api': {
          target: `http://localhost:${serverPort}`,
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) {
              return undefined;
            }

            if (id.includes('recharts')) {
              return 'charts';
            }

            if (id.includes('@supabase')) {
              return 'supabase';
            }

            if (id.includes('react-hook-form') || id.includes('@hookform') || id.includes('zod')) {
              return 'forms';
            }

            if (id.includes('motion')) {
              return 'motion';
            }

            if (id.includes('lucide-react')) {
              return 'icons';
            }

            if (
              id.includes('@radix-ui') ||
              id.includes('embla-carousel-react') ||
              id.includes('sonner') ||
              id.includes('vaul')
            ) {
              return 'ui';
            }

            return 'vendor';
          },
        },
      },
    },
  }
});
