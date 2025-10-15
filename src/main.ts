// src/main.ts

import { createApp } from 'vue'
import App from './App.vue'
import router from './router' 

const app = createApp(App)

app.use(router) 
// LA LIGNE CRITIQUE : Monter l'application sur l'élément <div id="app">
app.mount('#app')