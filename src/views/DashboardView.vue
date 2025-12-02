<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAuthStore } from '@/stores/auth'; // Utilise l'alias @/
import { RouterLink } from 'vue-router';
import axios from 'axios';
import type { User, LatestAchievement, NearlyCompletedGame } from '@/types/index'; // Importe les types

// URL de base de l'API depuis les variables d'environnement
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const authStore = useAuthStore();

// --- États pour les 3 sections ---
const globalCompletion = ref<number | null>(null);
const isLoadingCompletion = ref(false);
const completionError = ref<string | null>(null);
const totalXp = ref<number | null>(null);
const gamesCompleted = ref<number | null>(null);

const latestAchievements = ref<LatestAchievement[]>([]); // Utilise le type
const isLoadingLatest = ref(false);
const latestError = ref<string | null>(null);

const nearlyCompletedGames = ref<NearlyCompletedGame[]>([]); // Utilise le type
const isLoadingNearlyCompleted = ref(false);
const nearlyCompletedError = ref<string | null>(null);

// --- Fonction pour charger la complétion globale ---
const fetchGlobalCompletion = async () => {
  if (!authStore.token) { completionError.value = "Non connecté."; isLoadingCompletion.value = false; return; }
  isLoadingCompletion.value = true;
  completionError.value = null;

  if (import.meta.env.DEV) console.log("Dashboard: Début fetchGlobalCompletion...");

  try {
    const response = await axios.get(`${API_BASE_URL}/user/stats/global-completion`, {
      headers: { 'Authorization': `Bearer ${authStore.token}`, 'Accept': 'application/json' }
    });
    globalCompletion.value = response.data.completion_percentage;
    totalXp.value = response.data.total_xp || 0;
    gamesCompleted.value = response.data.games_completed || 0;
    if (import.meta.env.DEV) console.log("Dashboard: Complétion globale reçue:", globalCompletion.value);
  } catch (err: any) {
    console.error("Dashboard: Erreur fetchGlobalCompletion:", err);
    completionError.value = "Impossible de charger.";
    globalCompletion.value = null;
  } finally {
    isLoadingCompletion.value = false;
  }
};

// --- Fonction pour charger les derniers succès ---
const fetchLatestAchievements = async () => {
  if (!authStore.token) { latestError.value = "Non connecté."; isLoadingLatest.value = false; return; }
  isLoadingLatest.value = true;
  latestError.value = null;

  if (import.meta.env.DEV) console.log("Dashboard: Début fetchLatestAchievements...");

  try {
    const response = await axios.get<LatestAchievement[]>(`${API_BASE_URL}/user/achievements/latest`, {
      headers: { 'Authorization': `Bearer ${authStore.token}`, 'Accept': 'application/json' }
    });
    latestAchievements.value = response.data || [];
    if (import.meta.env.DEV) console.log("Dashboard: Derniers succès reçus:", latestAchievements.value);
  } catch (err: any) {
    console.error("Dashboard: Erreur fetchLatestAchievements:", err);
    latestError.value = "Impossible de charger.";
    latestAchievements.value = [];
  } finally {
    isLoadingLatest.value = false;
  }
};

// --- Fonction pour charger les jeux presque terminés ---
const fetchNearlyCompletedGames = async () => {
  if (!authStore.token) { nearlyCompletedError.value = "Non connecté."; isLoadingNearlyCompleted.value = false; return; }
  isLoadingNearlyCompleted.value = true;
  nearlyCompletedError.value = null;

  if (import.meta.env.DEV) console.log("Dashboard: Début fetchNearlyCompletedGames...");

  try {
    const response = await axios.get<NearlyCompletedGame[]>(`${API_BASE_URL}/user/games/nearly-completed`, {
      headers: { 'Authorization': `Bearer ${authStore.token}`, 'Accept': 'application/json' }
    });
    nearlyCompletedGames.value = response.data || [];
    if (import.meta.env.DEV) console.log("Dashboard: Jeux presque terminés reçus:", nearlyCompletedGames.value);
  } catch (err: any) {
    console.error("Dashboard: Erreur fetchNearlyCompletedGames:", err);
    nearlyCompletedError.value = "Impossible de charger.";
    nearlyCompletedGames.value = [];
  } finally {
    isLoadingNearlyCompleted.value = false;
  }
};

// --- Observateur : Lance les TROIS fetchs quand l'utilisateur est chargé ---
watch(
  () => authStore.user, // Surveille l'objet utilisateur
  (newUser, oldUser) => {
    if (import.meta.env.DEV) {
      console.log(`Dashboard Watcher: User a changé. Ancien: ${!!oldUser}, Nouveau: ${!!newUser}`);
    }
    // Si l'utilisateur vient d'être chargé (passe de null à objet)
    if (newUser && !oldUser) {
      if (import.meta.env.DEV) {
        console.log("Dashboard Watcher: Utilisateur chargé, lancement des 3 fetchs.");
      }
      // On lance les trois appels en parallèle
      fetchGlobalCompletion();
      fetchLatestAchievements();
      fetchNearlyCompletedGames();
    }
  },
  { immediate: true } // Vérifie une fois au montage
);

// --- Fonction utilitaire pour formater la date ---
const formatTimestamp = (timestamp: number | null) => {
  if (!timestamp) return '';
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' });
};

</script>

<template>
  <div>
    <div v-if="!authStore.user && authStore.token" class="text-center py-20">
      <p class="text-slate-400 animate-pulse text-lg">Chargement de votre tableau de bord...</p>
    </div>

    <div v-else-if="authStore.isLoggedIn && authStore.user" class="space-y-10">

      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white">Bonjour, {{ (authStore.user as User).name }} !</h1>
        <p class="text-slate-400">Prêt à analyser vos trophées ?</p>
      </div>

      <section class="flex flex-col md:flex-row items-center md:space-x-8 space-y-6 md:space-y-0">

        <div class="flex items-center space-x-4 bg-gray-800/50 p-6 rounded-xl border border-purple-500/30 w-full md:w-5/12">
          <img :src="(authStore.user as User).avatar" alt="Avatar" class="w-16 h-16 rounded-lg border-2 border-gray-700"/>
          <div class=" min-w-0 flex-1">
            <h1 class="text-2xl font-bold text-white">{{ (authStore.user as User).name }}</h1>
            <a :href="(authStore.user as User).profile_url" target="_blank" class="text-sm text-purple-400 hover:underline">Voir profil Steam</a>
          </div>
        </div>

        <div class="w-full md:w-7/12 grid grid-cols-1 sm:grid-cols-2 gap-6">

          <div class="bg-gray-800/50 p-6 rounded-xl border border-purple-500/30 text-center">
            <div class="text-sm text-slate-400 uppercase tracking-wider mb-2">Complétion Globale</div>
            <div v-if="isLoadingCompletion" class="text-4xl font-extrabold text-white animate-pulse">-- %</div>
            <div v-else-if="completionError" class="text-lg font-semibold text-red-500">{{ completionError }}</div>
            <div v-else-if="globalCompletion !== null" class="text-5xl font-extrabold text-white">
              {{ globalCompletion }}<span class="text-3xl text-slate-400">%</span>
            </div>
            <div v-else class="text-lg font-semibold text-slate-500">N/A</div>
          </div>

          <div class="bg-gray-800/50 p-6 rounded-xl border border-purple-500/30 text-center">
            <div class="text-sm text-slate-400 uppercase tracking-wider mb-2">Score Total</div>
            <div v-if="isLoadingCompletion" class="text-4xl font-extrabold text-white animate-pulse">--</div>
            <div v-else-if="completionError" class="text-lg font-semibold text-red-500">{{ completionError }}</div>
            <div v-else-if="totalXp !== null"
                 class="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
              {{ (totalXp || 0).toLocaleString() }}
            </div>
            <div v-else class="text-lg font-semibold text-slate-500">N/A</div>

            <div v-if="!isLoadingCompletion && gamesCompleted !== null" class="text-sm text-slate-400 mt-2">
              {{ gamesCompleted }} jeux complétés
            </div>
          </div>

        </div>
      </section>

      <section class="bg-gray-800/50 p-4 rounded-xl border border-purple-500/30 flex flex-wrap justify-around items-center gap-4">

        <RouterLink :to="{ name: 'my-games' }" class="text-center px-4 py-2 rounded-lg hover:bg-purple-600/30 transition-colors">
          <div class="text-2xl mb-1">🎮</div>
          <div class="font-semibold text-white">Ma Bibliothèque</div>
        </RouterLink>

        <RouterLink :to="{ name: 'leaderboard' }" class="text-center px-4 py-2 rounded-lg hover:bg-purple-600/30 transition-colors">
          <div class="text-2xl mb-1">🏆</div>
          <div class="font-semibold text-white">Classement</div>
        </RouterLink>

        <div class="text-center px-4 py-2 opacity-50">
          <div class="text-2xl mb-1">🎯</div>
          <div class="font-semibold text-white">Objectifs</div>
          <div class="text-xs text-slate-500">(Bientôt)</div>
        </div>

        <div class="text-center px-4 py-2 opacity-50">
          <div class="text-2xl mb-1">📃</div>
          <div class="font-semibold text-white">Forums</div>
          <div class="text-xs text-slate-500">(Bientôt)</div>
        </div>

      </section>

      <section>
        <h2 class="text-3xl font-bold text-white mb-6">Aperçu Rapide</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div class="bg-gray-800/50 p-6 rounded-xl border border-purple-500/30">
            <h3 class="text-xl font-semibold text-white mb-4">Derniers Succès Débloqués</h3>
            <div v-if="isLoadingLatest" class="text-slate-400 animate-pulse">Chargement...</div>
            <div v-else-if="latestError" class="text-red-400">{{ latestError }}</div>
            <ul v-else-if="latestAchievements.length > 0" class="space-y-4">
              <li v-for="ach in latestAchievements" :key="`${ach.app_id}-${ach.api_name}`" class="flex items-start space-x-3 border-b border-gray-700/50 pb-3 last:border-b-0">
                <img v-if="ach.icon" :src="ach.icon" :alt="`Icône ${ach.name}`" class="w-12 h-12 flex-shrink-0 border border-slate-600 rounded" loading="lazy" onerror="this.style.display='none'"/>
                <div v-else class="w-12 h-12 flex-shrink-0 bg-gray-700 rounded border border-slate-600"></div>
                <div class="flex-grow min-w-0">
                  <RouterLink :to="{ name: 'game-achievements', params: { app_id: ach.app_id } }" class="hover:text-purple-300 transition-colors block">
                    <span class="font-semibold text-base text-white leading-tight block">{{ ach.name }}</span>
                    <span class="text-slate-400 text-xs block">{{ ach.game_name }}</span>
                  </RouterLink>
                  <span class="text-xs text-slate-500 block mt-0.5">{{ formatTimestamp(ach.unlock_time) }}</span>
                </div>
              </li>
            </ul>
            <p v-else class="text-slate-400">Aucun succès récent trouvé.</p>
          </div>

          <div class="bg-gray-800/50 p-6 rounded-xl border border-purple-500/30">
            <h3 class="text-xl font-semibold text-white mb-4">Jeux Presque Terminés (&gt;80%)</h3>
            <div v-if="isLoadingNearlyCompleted" class="text-slate-400 animate-pulse">Chargement...</div>
            <div v-else-if="nearlyCompletedError" class="text-red-400">{{ nearlyCompletedError }}</div>
            <ul v-else-if="nearlyCompletedGames.length > 0" class="space-y-3">
              <li
                v-for="game in nearlyCompletedGames"
                :key="game.app_id"
                class="text-sm border-b border-gray-700/50 pb-2 last:border-b-0"
              >
                <RouterLink :to="{ name: 'game-achievements', params: { app_id: game.app_id } }" class="flex items-center space-x-3 group">
                  <img v-if="game.icon_url" :src="game.icon_url" :alt="game.name" class="w-8 h-8 rounded flex-shrink-0"/>
                  <div v-else class="w-8 h-8 rounded bg-gray-700 flex-shrink-0"></div>
                  <div class="flex-grow min-w-0">
                    <span class="font-medium text-white group-hover:text-purple-300 transition-colors block truncate" :title="game.name">{{ game.name }}</span>
                    <span class="text-xs text-slate-400 block">
                      {{ game.unlocked }} / {{ game.total }} ({{ game.percentage }}%)
                    </span>
                  </div>
                </RouterLink>
              </li>
            </ul>
            <p v-else class="text-slate-400">Aucun jeu proche de 100% pour le moment.</p>
          </div>
        </div>
      </section>

    </div>

    <div v-else class="text-center py-20">
      <h1 class="text-2xl text-red-500 font-semibold">Accès Refusé</h1>
      <p class="text-slate-400 mt-2">Impossible de charger les données ou vous n'êtes pas connecté.</p>
    </div>
  </div>
</template>

<style scoped>
/* Styles spécifiques si besoin */
</style>
