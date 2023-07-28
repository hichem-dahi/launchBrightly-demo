import { fileURLToPath, URL } from 'url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteS3 } from 'vite-plugin-s3';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    viteS3({
      s3Options: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: 'us-east-1'
      },
      s3UploadOptions: {
          Bucket: 'launchbrightly-demo',
      },
  }),],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
