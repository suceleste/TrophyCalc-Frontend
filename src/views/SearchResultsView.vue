<script setup lang="ts">
/**
 * Vue pour afficher les résultats d'une recherche globale (jeux et utilisateurs).
 * Récupère le terme de recherche depuis l'URL et appelle les API backend dédiées.
 */
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { RouterLink } from 'vue-router';
import type { GameSearchResult, UserSearchResult } from '@/types/index'; // Importe les contrats

// Récupère l'URL de base de l'API depuis les variables d'environnement
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const route = useRoute();

// --- STATE (Variables d'état) ---

// États pour la recherche de JEUX
const gameResults = ref<GameSearchResult[]>([]); // Typé avec le contrat
const isLoadingGames = ref(false);
const gameError = ref<string | null>(null);

// États pour la recherche d'UTILISATEURS
const userResults = ref<UserSearchResult[]>([]); // Typé avec le contrat
const isLoadingUsers = ref(false);
const userError = ref<string | null>(null);

// Terme de recherche actuel affiché sur la page
const currentQuery = ref('');

// --- ACTIONS (Fonctions) ---

/**
 * Appelle l'API backend pour rechercher des jeux Steam.
 * @param {string} query - Le terme de recherche.
 */
const fetchGameResults = async (query: string) => {
  isLoadingGames.value = true;
  gameError.value = null; // Réinitialise l'erreur
  if (import.meta.env.DEV) console.log(`[SearchResults] Recherche JEUX API pour: "${query}"`);

  try {
    const response = await axios.get<GameSearchResult[]>(`${API_BASE_URL}/search/games`, {
      params: { q: query }
    });
    gameResults.value = response.data || [];
    if (import.meta.env.DEV) console.log("[SearchResults] Résultats JEUX reçus:", gameResults.value);
  } catch (err: unknown) {
    console.error("[SearchResults] Erreur recherche JEUX API:", err);
    if (axios.isAxiosError(err) && err.response) {
      gameError.value = `Erreur (${err.response.status}): ${err.response.data.message || 'Recherche jeux échouée.'}`;
    } else {
      gameError.value = "Erreur réseau ou inconnue.";
    }
    gameResults.value = []; // Vide en cas d'erreur
  } finally {
    isLoadingGames.value = false;
  }
};

/**
 * Appelle l'API backend pour rechercher des utilisateurs de TrophyCalc.
 * @param {string} query - Le terme de recherche.
 */
const fetchUserResults = async (query: string) => {
  isLoadingUsers.value = true;
  userError.value = null; // Réinitialise l'erreur
  if (import.meta.env.DEV) console.log(`[SearchResults] Recherche UTILISATEURS API pour: "${query}"`);

  try {
    const response = await axios.get<UserSearchResult[]>(`${API_BASE_URL}/search/users`, {
      params: { q: query }
    });
    userResults.value = response.data || [];
    if (import.meta.env.DEV) console.log("[SearchResults] Résultats UTILISATEURS reçus:", userResults.value);
  } catch (err: unknown) {
    console.error("[SearchResults] Erreur recherche UTILISATEURS API:", err);
    if (axios.isAxiosError(err) && err.response) {
      userError.value = `Erreur (${err.response.status}): ${err.response.data.message || 'Recherche utilisateurs échouée.'}`;
    } else {
      userError.value = "Erreur réseau ou inconnue.";
    }
    userResults.value = []; // Vide en cas d'erreur
  } finally {
    isLoadingUsers.value = false;
  }
};

// --- OBSERVATEUR (Watch) ---

/**
 * Surveille le paramètre 'q' dans l'URL.
 * Déclenche les deux recherches (jeux et utilisateurs) si la requête est valide.
 */
watch(
  () => route.query.q, // La source à surveiller
  (newQuery) => {
    // Nettoie la query (gère le cas où c'est un tableau)
    const queryStr = Array.isArray(newQuery) ? newQuery[0] : newQuery;
    currentQuery.value = typeof queryStr === 'string' ? queryStr : ''; // Met à jour le terme affiché

    if (currentQuery.value.length >= 3) {
      // Lance les deux appels en parallèle
      fetchGameResults(currentQuery.value);
      fetchUserResults(currentQuery.value);
    } else {
      // Si la query est trop courte, on vide tout
      gameResults.value = [];
      userResults.value = [];
      gameError.value = null;
      userError.value = null;
    }
  },
  { immediate: true } // Lance les fonctions une fois au chargement initial
);

</script>

<template>
  <div class="space-y-8">
    <h1 class="text-3xl font-bold text-white mb-6">
      Résultats de recherche pour : <span class="text-purple-400">{{ currentQuery }}</span>
    </h1>

    <div v-if="currentQuery && currentQuery.length < 3" class="bg-yellow-900/50 border border-yellow-500/50 text-yellow-300 p-4 rounded-lg">
      Veuillez entrer au moins 3 caractères pour lancer la recherche.
    </div>

    <section>
      <h2 class="text-2xl font-semibold text-white border-b border-purple-500/30 pb-2 mb-4">Jeux trouvés</h2>

      <div v-if="isLoadingGames" class="text-center py-6">
        <p class="text-slate-400 animate-pulse">Recherche des jeux...</p>
      </div>

      <div v-else-if="gameError && currentQuery.length >= 3" class="bg-red-900/50 border border-red-500/50 text-red-300 p-4 rounded-lg">
        <p class="font-semibold">Erreur lors de la recherche de jeux :</p>
        <p>{{ gameError }}</p>
      </div>

      <div v-else-if="gameResults.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <RouterLink
          v-for="game in gameResults"
          :key="game.appid"
          :to="{ name: 'game-achievements', params: { app_id: game.appid } }"
          class="block bg-gray-800/60 rounded-lg overflow-hidden border border-purple-500/20 shadow-lg
                 transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/30 hover:border-purple-500/50 group"
          :title="`Voir les succès pour ${game.name}`"
        >
          <img
            :src="game.header_image"
            :alt="`Image ${game.name}`"
            class="w-full h-32 object-cover transition-opacity duration-300 group-hover:opacity-80"
            loading="lazy"
            onerror="this.style.display='none'"
          />
          <div class="p-4">
            <h3 class="font-semibold text-white truncate group-hover:text-purple-300 transition-colors" :title="game.name">
              {{ game.name }}
            </h3>
            <p class="text-xs text-slate-500">AppID: {{ game.appid }}</p>
          </div>
        </RouterLink>
      </div>

      <div v-else-if="currentQuery.length >= 3" class="text-center py-6">
        <p class="text-slate-400">Aucun jeu trouvé pour "{{ currentQuery }}".</p>
      </div>
    </section>

    <hr class="border-gray-700 my-8">

    <section>
      <h2 class="text-2xl font-semibold text-white border-b border-purple-500/30 pb-2 mb-4">Utilisateurs trouvés</h2>

      <div v-if="isLoadingUsers" class="text-center py-6">
        <p class="text-slate-400 animate-pulse">Recherche des utilisateurs...</p>
      </div>

      <div v-else-if="userError && currentQuery.length >= 3" class="bg-red-900/50 border border-red-500/50 text-red-300 p-4 rounded-lg">
        <p class="font-semibold">Erreur lors de la recherche d'utilisateurs :</p>
        <p>{{ userError }}</p>
      </div>

      <ul v-else-if="userResults.length > 0" class="space-y-3">
        <RouterLink
          v-for="user in userResults"
          :key="user.id"
          :to="{ name: 'user-profile', params: { steam_id_64: user.steam_id_64 } }"
          class="bg-gray-800/60 p-3 rounded-lg flex items-center space-x-4 border border-purple-500/20
                 transition-colors hover:bg-gray-700/50"
          :title="`Voir le profil de ${user.name}`"
        >
          <img :src="user.avatar" :alt="`Avatar de ${user.name}`" class="w-10 h-10 rounded-full flex-shrink-0 border border-gray-600"/>
          <div class="flex-grow min-w-0">
             <span class="font-medium text-white block truncate" :title="user.name">{{ user.name }}</span>
             <span class="text-xs text-slate-500 block">SteamID64: {{ user.steam_id_64 }}</span>
          </div>
        </RouterLink>
      </ul>

      <div v-else-if="currentQuery.length >= 3" class="text-center py-6">
        <p class="text-slate-400">Aucun utilisateur trouvé pour "{{ currentQuery }}".</p>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* Styles spécifiques si besoin */
</style>
