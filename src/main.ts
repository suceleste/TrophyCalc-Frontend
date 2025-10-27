/**
 * Fichier d'entrée principal de l'application Vue.js.
 * Initialise l'application, le routeur, le store Pinia,
 * et le plugin de consentement aux cookies.
 */
import './assets/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

// Crée l'instance de l'application Vue
const app = createApp(App);

// Enregistre le store global Pinia
app.use(createPinia());

// Enregistre le routeur
app.use(router);

// Monte l'application sur l'élément #app dans index.html
app.mount('#app');
