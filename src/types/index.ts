// src/types/index.ts

/**
 * Définit la structure de l'objet Utilisateur
 * tel qu'il est stocké dans notre BDD et renvoyé par l'API /api/user
 */
export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  profile_url: string;
  steam_id_64: string;
  profile_updated_at: string;
  created_at: string;
  updated_at: string;
}

/**
 * Définit la structure d'un jeu dans la bibliothèque de l'utilisateur.
 * (Utilisé dans MyGamesView.vue)
 */
export interface SteamGame {
  app_id: number;
  name: string;
  playtime_hours: number;
  icon_url: string | null;
  // logo_url: string | null; // On l'avait dans le backend, on peut l'ajouter si besoin
}

/**
 * Définit la structure complète d'un succès (détails + statut joueur).
 * (Utilisé dans GameAchievementsView.vue)
 */
export interface Achievement {
  api_name: string;
  name: string;
  description: string | null;
  icon: string;
  icon_gray: string;
  hidden: boolean;
  achieved: boolean;
  unlock_time: number | null;
  percent: number | null; // Pourcentage de rareté
}

/**
 * Définit un succès récent (un Succès + infos sur le jeu).
 * (Utilisé dans DashboardView.vue)
 */
export interface LatestAchievement extends Achievement {
  // Hérite de toutes les propriétés de 'Achievement'
  app_id: number;
  game_name: string;
}

/**
 * Définit un jeu presque terminé.
 * (Utilisé dans DashboardView.vue)
 */
export interface NearlyCompletedGame {
  app_id: number;
  name: string;
  percentage: number;
  unlocked: number;
  total: number;
  icon_url: string | null;
}

/**
 * Définit un résultat de recherche de jeu global.
 * (Utilisé dans SearchResultsView.vue)
 */
export interface GameSearchResult {
  appid: number;
  name: string;
  header_image: string;
}

/**
 * Définit un résultat de recherche d'utilisateur public.
 * (Utilisé dans SearchResultsView.vue)
 */
export interface UserSearchResult {
  id: number;
  name: string;
  avatar: string;
  steam_id_64: string;
}

/**
 * Définit le profil utilisateur public.
 * (Utilisé dans UserProfileView.vue)
 */
export interface PublicUserProfile {
  id: number;
  name: string;
  avatar: string;
  steam_id_64: string;
  created_at: string; // La date d'inscription sur TrophyCalc
}
