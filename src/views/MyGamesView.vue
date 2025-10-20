<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../stores/auth'; // Ensure path is correct ('@/' or '../')
import { RouterLink } from 'vue-router';

const authStore = useAuthStore();
const allGames = ref<any[]>([]); // Stores all games fetched from API
const gameCount = ref(0);
const isLoading = ref(true);
const error = ref<string | null>(null);

// State for the search query
const searchQuery = ref('');

onMounted(async () => {
  if (!authStore.token) {
    error.value = "Erreur: Vous n'êtes pas connecté.";
    isLoading.value = false;
    return;
  }

  try {
    isLoading.value = true;
    error.value = null;

    const response = await axios.get('http://127.0.0.1:8000/api/user/games', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Accept': 'application/json'
      }
    });

    allGames.value = response.data.games || [];
    gameCount.value = response.data.game_count || 0;
    console.log('Jeux bruts reçus:', allGames.value);

  } catch (err: any) {
    console.error("Erreur récup jeux:", err);
    if (err.response) {
      error.value = `Erreur API (${err.response.status}): ${err.response.data.message || 'Impossible de récupérer les jeux.'}`;
    } else {
      error.value = "Erreur réseau ou impossible de contacter l'API.";
    }
    allGames.value = [];
    gameCount.value = 0;
  } finally {
    isLoading.value = false;
  }
});

// Computed property to filter games based on searchQuery
const filteredGames = computed(() => {
  if (!searchQuery.value) {
    return allGames.value; // Return all games if search is empty
  }
  const query = searchQuery.value.toLowerCase().trim();
  // Filter games where the name includes the search query
  return allGames.value.filter(game =>
    game.name.toLowerCase().includes(query)
  );
});

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
          class="w-full bg-gray-800/50 border-2 border-gray-700 rounded-lg py-2 px-4 pl-10 text-white
                 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-300"
        />
        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
/* Specific styles if needed */
</style>
