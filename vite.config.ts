import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import path from "path"
import react from "@vitejs/plugin-react"
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      strategies: "injectManifest",
      srcDir: "src",
      filename: "sw.js",
      devOptions: {
        enabled: true,
        type: 'module',
      },
      registerType: 'autoUpdate',
      manifest: {
        name: 'My Finances App',
        short_name: 'Finances',
        theme_color: '#005014',
        icons: [
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ],
        screenshots: [
          {
            src: 'screenshot-desktop.png', 
            sizes: '2560x1440',
            type: 'image/png',
            form_factor: 'wide',
            label: 'Desktop Dashboard'
          },
          {
            src: 'screenshot-mobile.png',
            sizes: '1082x2402', // Update this to match your actual file size
            type: 'image/png',
            label: 'Mobile Transaction History'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
