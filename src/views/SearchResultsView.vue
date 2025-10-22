<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'; // Ajoute onMounted, watch
import { useRoute } from 'vue-router';
import axios from 'axios';
import { RouterLink } from 'vue-router'; // Pour lier vers les succès

const route = useRoute();
const searchResults = ref<any[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const currentQuery = ref('');

// Fonction pour lancer la recherche API
const fetchSearchResults = async (query: string) => {
  if (!query || query.length < 3) {
    searchResults.value = []; // Vide les résultats si query invalide
    return;
  }
  isLoading.value = true;
  error.value = null;
  console.log(`Recherche API pour: "${query}"`);

  try {
    const response = await axios.get('http://127.0.0.1:8000/api/search/games', {
      params: { q: query } // Envoie le terme comme paramètre ?q=...
    });
    searchResults.value = response.data || [];
    console.log("Résultats reçus:", searchResults.value);
  } catch (err: any) {
    console.error("Erreur recherche API:", err);
    error.value = `Erreur (${err.response?.status}): ${err.response?.data?.message || 'Recherche échouée.'}`;
    searchResults.value = [];
  } finally {
    isLoading.value = false;
  }
};

// Surveille les changements dans l'URL (si l'utilisateur fait une nouvelle recherche depuis cette page)
watch(
  () => route.query.q,
  (newQuery) => {
    const queryStr = Array.isArray(newQuery) ? newQuery[0] : newQuery; // Gère le cas où q est un tableau
    if (typeof queryStr === 'string') {
      currentQuery.value = queryStr;
      fetchSearchResults(queryStr);
    }
  },
  { immediate: true } // Lance la recherche une fois au chargement initial
);

</script>

<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-bold text-white mb-6">
      Résultats de recherche pour : <span class="text-purple-400">{{ currentQuery }}</span>
    </h1>

    <div v-if="isLoading" class="text-center py-10">
      <p class="text-slate-400 animate-pulse text-lg">Recherche en cours...</p>
    </div>

    <div v-else-if="error" class="bg-red-900/50 border border-red-500/50 text-red-300 p-4 rounded-lg">
      <p class="font-semibold">Erreur :</p>
      <p>{{ error }}</p>
    </div>

    <div v-else-if="searchResults.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <RouterLink
        v-for="game in searchResults"
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

    <div v-else class="text-center py-10">
      <p class="text-slate-400 text-lg">Aucun jeu trouvé pour "{{ currentQuery }}".</p>
    </div>

  </div>
</template>
