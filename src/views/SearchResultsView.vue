<script setup lang="ts">
import { ref, watch } from 'vue'; // Pas besoin de onMounted ici car watch immediate le remplace
import { useRoute } from 'vue-router';
import axios from 'axios';
import { RouterLink } from 'vue-router'; // Pour lier les jeux vers leurs succès

const route = useRoute();

// --- États pour la recherche ---
// Jeux
const gameResults = ref<any[]>([]);
const isLoadingGames = ref(false);
const gameError = ref<string | null>(null);
// Utilisateurs
const userResults = ref<any[]>([]);
const isLoadingUsers = ref(false);
const userError = ref<string | null>(null);
// Terme de recherche actuel
const currentQuery = ref('');

// --- Fonction pour chercher les JEUX ---
const fetchGameResults = async (query: string) => {
  // Vide les résultats si query invalide ou trop courte
  if (!query || query.length < 3) {
    gameResults.value = [];
    // N'affiche pas d'erreur si c'est juste trop court au chargement initial
    if (query) gameError.value = "Terme trop court (min 3 caractères).";
    return;
  }
  isLoadingGames.value = true;
  gameError.value = null; // Réinitialise l'erreur précédente
  console.log(`Recherche JEUX API pour: "${query}"`);
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/search/games', { params: { q: query } });
    gameResults.value = response.data || [];
    console.log("Résultats JEUX reçus:", gameResults.value);
  } catch (err: any) {
    console.error("Erreur recherche JEUX API:", err);
    gameError.value = `Erreur (${err.response?.status}): ${err.response?.data?.message || 'Recherche jeux échouée.'}`;
    gameResults.value = []; // Vide en cas d'erreur
  } finally {
    isLoadingGames.value = false;
  }
};

// --- Fonction pour chercher les UTILISATEURS ---
const fetchUserResults = async (query: string) => {
  if (!query || query.length < 3) {
    userResults.value = [];
    if (query) userError.value = "Terme trop court (min 3 caractères).";
    return;
  }
  isLoadingUsers.value = true;
  userError.value = null;
  console.log(`Recherche UTILISATEURS API pour: "${query}"`);
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/search/users', { params: { q: query } });
    userResults.value = response.data || [];
    console.log("Résultats UTILISATEURS reçus:", userResults.value);
  } catch (err: any) {
    console.error("Erreur recherche UTILISATEURS API:", err);
    userError.value = `Erreur (${err.response?.status}): ${err.response?.data?.message || 'Recherche utilisateurs échouée.'}`;
    userResults.value = [];
  } finally {
    isLoadingUsers.value = false;
  }
};

// --- Observateur : Lance les DEUX recherches quand l'URL change ---
watch(
  () => route.query.q, // Surveille le paramètre 'q' dans l'URL
  (newQuery) => {
    // Nettoie la query (gère le cas où c'est un tableau, ce qui arrive parfois)
    const queryStr = Array.isArray(newQuery) ? newQuery[0] : newQuery;

    // Met à jour le terme affiché
    currentQuery.value = typeof queryStr === 'string' ? queryStr : '';

    // Lance les recherches si la query est valide (au moins 3 caractères)
    if (currentQuery.value.length >= 3) {
      fetchGameResults(currentQuery.value);
      fetchUserResults(currentQuery.value);
    } else {
      // Si la nouvelle query est trop courte, vide les résultats
      gameResults.value = [];
      userResults.value = [];
      gameError.value = null;
      userError.value = null;
    }
  },
  { immediate: true } // Lance les fonctions une fois au chargement initial de la page
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
      <div v-if="isLoadingGames" class="text-center py-6"><p class="text-slate-400 animate-pulse">Recherche des jeux...</p></div>
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
      <div v-else-if="currentQuery.length >= 3" class="text-center py-6"><p class="text-slate-400">Aucun jeu trouvé pour "{{ currentQuery }}".</p></div>
    </section>

    <hr class="border-gray-700 my-8">

    <section>
      <h2 class="text-2xl font-semibold text-white border-b border-purple-500/30 pb-2 mb-4">Utilisateurs trouvés</h2>
      <div v-if="isLoadingUsers" class="text-center py-6"><p class="text-slate-400 animate-pulse">Recherche des utilisateurs...</p></div>
      <div v-else-if="userError && currentQuery.length >= 3" class="bg-red-900/50 border border-red-500/50 text-red-300 p-4 rounded-lg">
        <p class="font-semibold">Erreur lors de la recherche d'utilisateurs :</p>
        <p>{{ userError }}</p>
      </div>
      <ul v-else-if="userResults.length > 0" class="space-y-3">
        <li v-for="user in userResults" :key="user.id" class="bg-gray-800/60 p-3 rounded-lg flex items-center space-x-4 border border-purple-500/20">
          <img :src="user.avatar" :alt="`Avatar de ${user.name}`" class="w-10 h-10 rounded-full flex-shrink-0 border border-gray-600"/>
          <div class="flex-grow min-w-0">
             <span class="font-medium text-white block truncate hover:text-purple-300 transition-colors cursor-pointer" :title="user.name">{{ user.name }}</span>
             <span class="text-xs text-slate-500 block">SteamID64: {{ user.steam_id_64 }}</span>
          </div>
           </li>
      </ul>
      <div v-else-if="currentQuery.length >= 3" class="text-center py-6"><p class="text-slate-400">Aucun utilisateur trouvé pour "{{ currentQuery }}".</p></div>
    </section>

  </div>
</template>

<style scoped>
pre { white-space: pre-wrap; word-wrap: break-word; } /* Au cas où on réutilise <pre> */
</style>
