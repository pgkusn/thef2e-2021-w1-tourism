import '@unocss/reset/tailwind.css'
import 'virtual:uno.css'

import 'virtual:svg-icons-register'

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

app.mount('#app')
