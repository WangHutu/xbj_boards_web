import { createApp } from 'vue'
import { createPinia } from 'pinia'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'

import './assets/reset.css'
// import './assets/main.css'

import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// import VueSocketIO from 'vue-socket.io'
// import SocketIO from 'socket.io-client'
// const socket = new VueSocketIO({
//   connection: SocketIO('http://localhost:5000'),      //使用Socket.IO-client
//   // extraHeaders: {"Access-Control-Allow-Origin": '*'},
  
// })

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')

// app.config.globalProperties.$socket = socket