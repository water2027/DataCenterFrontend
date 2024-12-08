import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import UnoCSS from 'unocss/vite'
import { VitePWA } from 'vite-plugin-pwa'


// https://vite.dev/config/
const base = '/'
export default defineConfig({
  base,
  plugins: [
    vue(),
    vueJsx(),
    UnoCSS(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    VitePWA({
      registerType: 'autoUpdate',
      scope: base,
      srcDir: 'src',
      strategies: 'generateSW',
      manifest: {
        name: 'SSE_DATA_CENTER',
        short_name: 'DATA_CENTER',
        scope: `${base}`,
        start_url: `${base}`,
        display: 'fullscreen',
        background_color: '#000000',
        theme_color: '#ffffff',
        icons: [
          {
            src: `${base}android-chrome-192x192.png`,
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: `${base}android-chrome-512x512.png`,
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      devOptions: {
        // 开发环境是否开启 PWA
        enabled: false,
        type: 'module',
      },
      workbox: {
        globPatterns: [
          `${base}index.html`,
          `${base}favicon.ico`,
          `${base}android-chrome-192x192.png`,
          `${base}android-chrome-512x512.png`,
        ],
        skipWaiting: true,
        clientsClaim: true,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
