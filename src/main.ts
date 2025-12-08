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
import { createHead } from '@unhead/vue/client';

// Crée l'instance de l'application Vue
const app = createApp(App);
const head = createHead();
// Enregistre le store global Pinia
app.use(createPinia());
app.use(head);

// Enregistre le routeur
app.use(router);

// Monte l'application sur l'élément #app dans index.html
app.mount('#app');
