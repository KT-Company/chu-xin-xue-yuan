import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import KTUI from './components/index.js'
import router from './router/index.js'
import './style/style.css'
import './style/tailwind.css'
import './style/animate.min.css'
import '@/custom-elements/index.js'
const app = createApp(App)
const pinia = createPinia()
app.use(KTUI).use(router).use(pinia).mount('#app')

import.meta.env.MODE === 'production' && console.log(`项目最后打包时间: ${LATEST_BUILD_TIME}`)
