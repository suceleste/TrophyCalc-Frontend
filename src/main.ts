import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia' // <-- 1. ON IMPORTE LA FONCTION POUR CRÉER PINIA

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia()) // <-- 2. ON BRANCHE LE TABLEAU DE BORD À L'APPLICATION
app.use(router)

app.mount('#app')