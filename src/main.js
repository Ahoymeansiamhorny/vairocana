import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import '@/styles/reset.scss' // reset style sheet
import '@/styles/common.scss' // CSS common style sheet
import '@/assets/iconfont/iconfont.scss' // iconfont css
import '@/assets/fonts/font.scss' // font css

import ElementPlus from 'element-plus' // element plus

import * as Icons from '@element-plus/icons-vue' // element icons

// custom directives
import directives from '@/directives/index'

import 'element-plus/dist/index.css' // element css
import 'element-plus/theme-chalk/dark/css-vars.css' // element dark css
import '@/styles/element-dark.scss' // custom element dark css
import '@/styles/element.scss' // custom element css

import 'virtual:svg-icons-register' // svg icons

import I18n from '@/languages/index' // vue i18n

import pinia from '@/stores' // pinia store

import errorHandler from '@/utils/errorHandler' // errorHandler

const app = createApp(App)

app.config.errorHandler = errorHandler

Object.keys(Icons).forEach((key) => {
  app.component(key, Icons[key]) // register the element Icons component
})

app.use(ElementPlus).use(directives).use(router).use(I18n).use(pinia).mount('#app')
