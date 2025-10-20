<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '../stores/auth'; // On importe le store pour le token

const authStore = useAuthStore();
const games = ref([]); // Variable pour stocker la liste des jeux
const gameCount = ref(0); // Variable pour le nombre total de jeux
const isLoading = ref(true); // Indicateur de chargement
const error = ref<string | null>(null); // Variable pour stocker les erreurs

// Dès que la page est prête, on appelle l'API
onMounted(async () => {
  if (!authStore.token) {
    error.value = "Erreur: Vous n'êtes pas connecté.";
    isLoading.value = false;
    return;
  }

  try {
    isLoading.value = true; // Commence le chargement
    error.value = null; // Réinitialise les erreurs

    const response = await axios.get('http://127.0.0.1:8000/api/user/games', {
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Accept': 'application/json'
      }
    });

    games.value = response.data.games;
    gameCount.value = response.data.game_count;

  } catch (err: any) {
    console.error("Erreur lors de la récupération des jeux:", err);
    if (err.response) {
      error.value = `Erreur API (${err.response.status}): ${err.response.data.message || 'Impossible de récupérer les jeux.'}`;
    } else {
      error.value = "Erreur réseau ou impossible de contacter l'API.";
    }
  } finally {
    isLoading.value = false; // Termine le chargement
  }
});
</script>

<template>
  <div class="space-y-8">
    <h1 class="text-4xl font-bold text-white">Ma Bibliothèque de Jeux ({{ gameCount }})</h1>

    <div v-if="isLoading" class="text-center py-10">
      <p class="text-slate-400 animate-pulse text-lg">Chargement de vos jeux...</p>
    </div>

    <div v-else-if="error" class="bg-red-900/50 border border-red-500/50 text-red-300 p-4 rounded-lg">
      <p class="font-semibold">Oups ! Une erreur est survenue :</p>
      <p>{{ error }}</p>
    </div>

    <div v-else-if="games.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      <div
        v-for="game in games"
        :key="game.app_id"
        class="bg-gray-800/60 rounded-lg overflow-hidden border border-purple-500/20 shadow-lg
               transform transition-all duration-300 hover:scale-105 hover:shadow-purple-500/30 hover:border-purple-500/50"
      >
        <img
          :src="`https://cdn.akamai.steamstatic.com/steam/apps/${game.app_id}/header.jpg`"
          :alt="`Image ${game.name}`"
          class="w-full h-32 object-cover"
          loading="lazy"
          @error="($event.target as HTMLImageElement).style.display='none'" />
        <div class="p-4">
          <h3 class="font-semibold text-white truncate" :title="game.name">{{ game.name }}</h3>
          <p class="text-sm text-slate-400 mt-1">{{ game.playtime_hours }} heures</p>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-10">
      <p class="text-slate-400 text-lg">Aucun jeu trouvé dans votre bibliothèque Steam.</p>
    </div>
  </div>
</template>

<style scoped>
/* On peut ajouter des styles spécifiques ici si besoin */
</style>
