// src/router/index.ts

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import Home from '../views/HomeView.vue'; 
import AuthCallback from '../AuthCallback.vue'; 
import MyGamesView from '../views/MyGamesView.vue';
import DashboardView from '../views/DashboardView.vue';


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/auth/callback', 
    name: 'AuthCallback',
    component: AuthCallback 
  },
  {
    path: '/my-games',
    name: 'my-games',
    component: MyGamesView,
    props: true 
  },
  {
    path: "/dashboard",
    name: 'dashboard',
    component: DashboardView,
  },

];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;