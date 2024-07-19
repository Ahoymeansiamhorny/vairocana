import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import vueSetupExtend from 'unplugin-vue-setup-extend-plus/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
// import { VitePWA } from 'vite-plugin-pwa'
import { createHtmlPlugin } from 'vite-plugin-html'
// import eslintPlugin from 'vite-plugin-eslint'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    createSvgIconsPlugin({
      iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
      symbolId: 'icon-[dir]-[name]'
    }),
    createHtmlPlugin({
      inject: {
        data: { title: 'CMS' } // 注入变量到 html 文件
      }
    }),
    // eslintPlugin(), // esLint 报错信息显示在浏览器界面上
    vueSetupExtend({}) // name 可以写在 script 标签上
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
