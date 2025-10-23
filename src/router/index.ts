// src/router/index.ts

import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import Home from '../views/HomeView.vue';
import AuthCallback from '../components/AuthCallback.vue';
import MyGamesView from '../views/MyGamesView.vue';
import DashboardView from '../views/DashboardView.vue';
import GameAchievementsView from '../views/GameAchievementsView.vue';
import SearchResultsView from '../views/SearchResultsView.vue';
import UserProfileView from '../views/UserProfileView.vue';


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/auth/callback',
    name: 'authCallback',
    component: AuthCallback
  },
  {
    path: '/my-games',
    name: 'my-games',
    component: MyGamesView,
    props: true
  },
  {
    path: '/games/:app_id/achievements',
    name: 'game-achievements',
    component: GameAchievementsView,
    props: true,
  },
  {
    path: "/dashboard",
    name: 'dashboard',
    component: DashboardView,
  },
  {
    path: '/search',
    name: 'search-results',
    component: SearchResultsView,
  },
  {
    path: '/profile/:steam_id_64',
    name: 'user-profile',
    component: UserProfileView,
    props: true
  },

];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

export default router;
