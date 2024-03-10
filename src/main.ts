import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

import 'virtual:svg-icons-register'

import { LoadingPlugin } from 'vue-loading-overlay'
import 'vue-loading-overlay/dist/css/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import { register } from 'swiper/element/bundle'
register()

const app = createApp(App)

const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(LoadingPlugin)

app.mount('#app')
