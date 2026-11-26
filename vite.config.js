import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    proxy: {
      '^/enquiries/[A-Za-z0-9_-]+$': {
        target: 'https://docs.google.com',
        changeOrigin: true,
        rewrite: path => path.replace('/enquiries/', '/forms/d/e/') + '/formResponse',
      },
    },
  },
})
