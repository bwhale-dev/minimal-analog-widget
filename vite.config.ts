import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa' // 1. インポートを追加

export default defineConfig({
  plugins: [
    react(),
    // 2. ここにPWAの設定を追加（カンマで区切るのを忘れずに）
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: '鳩時計ウィジェット',
        short_name: '鳩時計',
        description: '癒やしのアナログ鳩時計',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-icon.png', // 後で作成するアイコン名に合わせる
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  // 3. baseはここに残したままでOKです
  base: './',
})