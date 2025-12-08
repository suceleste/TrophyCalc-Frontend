<script setup lang="ts">
/**
 * Vue pour afficher la bibliothèque de jeux de l'utilisateur connecté.
 * Récupère les jeux depuis l'API, permet de les filtrer localement
 * et de naviguer vers la page de détails des succès.
 */
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { RouterLink } from 'vue-router';
import type { SteamGame } from '@/types/index';
import { useSeoMeta } from '@unhead/vue';

// Récupère l'URL de base de l'API depuis les variables d'environnement
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const authStore = useAuthStore();

// --- STATE (Variables d'état) ---

/**
 * Stocke la liste complète et brute des jeux reçus de l'API.
 */
const allGames = ref<SteamGame[]>([]);

/**
 * Stocke le nombre total de jeux.
 */
const gameCount = ref(0);

/**
 * Indique si l'appel API principal est en cours.
 */
const isLoading = ref(true);

/**
 * Stocke un message d'erreur en cas d'échec de l'appel API.
 */
const error = ref<string | null>(null);

/**
 * Stocke le terme de recherche entré par l'utilisateur.
 */
const searchQuery = ref('');

// --- LIFECYCLE (Au montage du composant) ---

/**
 * Au montage, vérifie l'authentification et lance la récupération des jeux.
 */
onMounted(async () => {
  if (!authStore.token) {
    error.value = "Erreur: Vous n'êtes pas connecté.";
    isLoading.value = false;
    return;
  }

  try {
    isLoading.value = true;
    error.value = null;
    const apiUrl = `${API_BASE_URL}/user/games`;

    if (import.meta.env.DEV) { // Log uniquement en développement
      console.log(`[MyGamesView] Appel de l'API: ${apiUrl}`);
    }

    // Lance l'appel API pour récupérer la liste des jeux
    // On précise à Axios le type de données attendu dans la réponse
    const response = await axios.get<{ game_count: number, games: SteamGame[] }>(apiUrl, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Accept': 'application/json'
      }
    });

    // Stocke les résultats dans l'état
    allGames.value = response.data.games || [];
    gameCount.value = response.data.game_count || 0;

    if (import.meta.env.DEV) { // Log uniquement en développement
      console.log(`[MyGamesView] ${allGames.value.length} jeux reçus et assignés.`);
    }

  } catch (err: unknown) { // Utilise 'unknown' pour un typage TypeScript plus strict
    console.error("[MyGamesView] Erreur lors de la récupération des jeux:", err);
    if (axios.isAxiosError(err) && err.response) { // Vérifie si c'est une erreur Axios
      error.value = `Erreur API (${err.response.status}): ${err.response.data.message || 'Impossible de récupérer les jeux.'}`;
    } else {
      error.value = "Erreur réseau ou impossible de contacter l'API.";
    }
    allGames.value = [];
    gameCount.value = 0;
  } finally {
    isLoading.value = false; // Le chargement est terminé (succès ou échec)
  }
});

// --- COMPUTED (Propriétés calculées) ---

/**
 * Calcule la liste des jeux à afficher en fonction du 'searchQuery'.
 * Se met à jour automatiquement quand 'allGames' ou 'searchQuery' change.
 */
const filteredGames = computed((): SteamGame[] => {
  // Si la barre de recherche est vide, retourne tous les jeux
  if (!searchQuery.value) {
    return allGames.value;
  }

  // Normalise le terme de recherche (minuscules, sans espaces superflus)
  const query = searchQuery.value.toLowerCase().trim();

  // Filtre la liste des jeux
  return allGames.value.filter(game =>
    game.name.toLowerCase().includes(query)
  );
});

useSeoMeta({
  title: 'Ma Bibliothèque - TrophyCalc',
  robots: 'noindex, nofollow'
})

</script>

<template>
  <div class="space-y-8">
    <div class="flex flex-col md:flex-row justify-between md:items-center gap-4">
      <h1 class="text-4xl font-bold text-white">Ma Bibliothèque ({{ gameCount }})</h1>

      <div class="relative w-full md:w-1/3">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Filtrer les jeux..."
          aria-label="Filtrer les jeux de ma bibliothèque"
          class="w-full bg-gray-800/50 border-2 border-gray-700 rounded-lg py-2 px-4 pl-10 text-white
                 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-300"
        />
        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <div v-if="isLoading" class="text-center py-10">
      <p class="text-slate-400 animate-pulse text-lg">Chargement de vos jeux...</p>
    </div>

    <div v-else-if="error" class="bg-red-900/50 border border-red-500/50 text-red-300 p-4 rounded-lg">
      <p class="font-semibold">Oups ! Une erreur est survenue :</p>
      <p>{{ error }}</p>
    </div>

    <div v-else>
      <div v-if="filteredGames.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        <RouterLink
          v-for="game in filteredGames"
          :key="game.app_id"
          :to="{ name: 'game-achievements', params: { app_id: game.app_id } }"
          class="block bg-gray-800/60 rounded-lg overflow-hidden border border-purple-500/20 shadow-lg
                 transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/30 hover:border-purple-500/50 group"
        >
          <img
            :src="`https://cdn.akamai.steamstatic.com/steam/apps/${game.app_id}/header.jpg`"
            :alt="`Image ${game.name}`"
            class="w-full h-32 object-cover transition-opacity duration-300 group-hover:opacity-80"
            loading="lazy"
            @error="($event.target as HTMLImageElement).style.display='none'"
          />
          <div class="p-4">
            <h3 class="font-semibold text-white truncate group-hover:text-purple-300 transition-colors" :title="game.name">
              {{ game.name }}
            </h3>
            <p class="text-sm text-slate-400 mt-1">{{ game.playtime_hours }} heures</p>
          </div>
        </RouterLink>
      </div>

      <div v-else class="text-center py-10">
        <p v-if="searchQuery" class="text-slate-400 text-lg">Aucun jeu ne correspond à votre recherche "{{ searchQuery }}".</p>
        <p v-else class="text-slate-400 text-lg">Aucun jeu trouvé dans votre bibliothèque Steam ou votre profil est peut-être privé.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Styles spécifiques si besoin */
</style>
