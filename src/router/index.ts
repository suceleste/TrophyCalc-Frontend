/**
 * Configuration principale du routeur Vue.
 */
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

// Imports des Vues (Pages)
import HomeView from '../views/HomeView.vue';
import AuthCallback from '../components/AuthCallback.vue';
import MyGamesView from '../views/MyGamesView.vue';
import DashboardView from '../views/DashboardView.vue';
import GameAchievementsView from '../views/GameAchievementsView.vue';
import SearchResultsView from '../views/SearchResultsView.vue';
import UserProfileView from '../views/UserProfileView.vue';
import NotFoundView from '../views/NotFoundView.vue';
import LegalView from '@/views/LegalView.vue';
import LeaderboardView from '@/views/LeaderboardView.vue';

/**
 * Définit toutes les routes de l'application.
 */
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'Accueil' }
  },
  {
    path: '/auth/callback',
    name: 'AuthCallback',
    component: AuthCallback,
    meta: { title: 'Connexion...' }
  },
  {
    path: '/my-games',
    name: 'my-games',
    component: MyGamesView,
    meta: { title: 'Ma Bibliothèque' }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    meta: { title: 'Tableau de Bord' }
  },
  {
    path: '/games/:app_id/achievements',
    name: 'game-achievements',
    component: GameAchievementsView,
    props: true, // Passe les paramètres d'URL (ex: app_id) comme props
    meta: { title: 'Succès du Jeu' }
  },
  {
    path: '/search',
    name: 'search-results',
    component: SearchResultsView,
    meta: { title: 'Résultats de Recherche' }
  },
  {
    path: '/profile/:steam_id_64',
    name: 'user-profile',
    component: UserProfileView,
    props: true, // Passe steam_id_64 comme prop
    meta: {
       title: 'Profil Utilisateur' }
  },
  {
    path: '/legal',
    name: 'legal',
    component: LegalView,
    meta: { title: 'Mentions Légales & Confidentialité' }
  },
  {
    path: '/:pathMatch(.*)*', // Route "catch-all" pour les 404
    name: 'NotFound',
    component: NotFoundView,
    meta: { title: '404 - Page Non Trouvée' }
  },
  {
    path: '/leaderboard',
    name: 'leaderboard',
    component: LeaderboardView,
    meta: { title: 'Leaderboard'}
  }
];

/**
 * Crée l'instance du routeur.
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

/**
 * Garde de navigation globale (afterEach)
 * Met à jour le titre de l'onglet du navigateur après chaque navigation.
 */
router.afterEach((to) => {
  // Donne un délai (tick) pour laisser aux composants le temps de définir un titre dynamique
  setTimeout(() => {
    const baseTitle = 'TrophyCalc';
    // Utilise le titre dynamique si défini par le composant, sinon le meta.title, sinon le titre de base
    if (document.title !== baseTitle && !document.title.endsWith(`- ${baseTitle}`)) {
      // Le titre a probablement été défini par un watch dans le composant, on le laisse
      return;
    }
    const newTitle = to.meta.title ? `${to.meta.title} - ${baseTitle}` : baseTitle;
    document.title = newTitle;
  }, 0);
});

export default router;
