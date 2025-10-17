// src/router/index.ts

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

// Les imports de vos composants dans src/ (adaptez si vous utilisez des alias)
import Home from '../views/HomeView.vue'; 
import AuthCallback from '../AuthCallback.vue'; 
import Profile from '../Profile.vue'; 
import GameAchievements from '../GameAchievements.vue'; // <-- Import du nouveau composant

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/auth/callback', 
    name: 'AuthCallback',
    component: AuthCallback 
  },
  {
    path: '/profile/:steamId',
    name: 'Profile',
    component: Profile,
    props: true 
  },
  {
    // C'est la route CRITIQUE pour afficher les trophées d'un jeu
    path: '/profile/:steamId/game/:appId', 
    name: 'GameAchievements',
    component: GameAchievements,
    // On utilise les props pour passer steamId et appId au composant
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;