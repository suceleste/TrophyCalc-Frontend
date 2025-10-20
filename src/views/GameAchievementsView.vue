<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'; // Pour lire les paramètres de l'URL (app_id)
import axios from 'axios';
import { useAuthStore } from '../stores/auth'; // Pour le token

// Outils
const route = useRoute();
const authStore = useAuthStore();

// Variables d'état
const achievements = ref([]);
const gameName = ref<string | null>(null);
const totalCount = ref(0);
const unlockedCount = ref(0);
const isLoading = ref(true);
const error = ref<string | null>(null);

// Récupérer l'app_id depuis l'URL
const appId = route.params.app_id as string; // 'as string' est pour TypeScript

// Fonction pour convertir le timestamp Unix en date lisible
const formatTimestamp = (timestamp: number | null) => {
  if (!timestamp) return 'Non débloqué';
  const date = new Date(timestamp * 1000); // Le timestamp est en secondes, Date() attend des millisecondes
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
};


// Appeler l'API dès que la page est prête
onMounted(async () => {
  if (!authStore.token) {
    error.value = "Erreur: Authentification requise.";
    isLoading.value = false;
    return;
  }
  if (!appId) {
    error.value = "Erreur: ID de l'application manquant dans l'URL.";
    isLoading.value = false;
    return;
  }

  try {
    isLoading.value = true;
    error.value = null;

    const response = await axios.get(`http://127.0.0.1:8000/api/user/games/${appId}/achievements`, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Accept': 'application/json'
      }
    });

    // Mise à jour de l'état avec les données reçues
    achievements.value = response.data.achievements || [];
    gameName.value = response.data.game_name || `Jeu ${appId}`;
    totalCount.value = response.data.total_count || 0;
    unlockedCount.value = response.data.unlocked_count || 0;

  } catch (err: any) {
    console.error(`Erreur lors de la récupération des succès pour ${appId}:`, err);
    if (err.response) {
      // Gestion spécifique si l'API Steam a renvoyé une info (ex: succès non dispo)
      if (err.response.data.status === 'info') {
         error.value = err.response.data.message;
      } else {
         error.value = `Erreur API (${err.response.status}): ${err.response.data.message || 'Impossible de récupérer les succès.'}`;
      }
    } else {
      error.value = "Erreur réseau ou impossible de contacter l'API.";
    }
    achievements.value = []; // Vide la liste en cas d'erreur
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="space-y-6">
    <h1 v-if="gameName" class="text-4xl font-bold text-white">{{ gameName }} - Succès</h1>
    <h1 v-else class="text-4xl font-bold text-white animate-pulse">Chargement...</h1>

    <div v-if="!isLoading && !error && totalCount > 0" class="text-slate-400">
      Progression : {{ unlockedCount }} / {{ totalCount }} succès débloqués
      ({{ Math.round((unlockedCount / totalCount) * 100) }}%)
      </div>

    <div v-if="isLoading" class="text-center py-10">
      <p class="text-slate-400 animate-pulse text-lg">Chargement des succès...</p>
    </div>

    <div v-else-if="error" class="bg-yellow-900/50 border border-yellow-500/50 text-yellow-300 p-4 rounded-lg">
      <p class="font-semibold">Information ou Erreur :</p>
      <p>{{ error }}</p>
    </div>

    <ul v-else-if="achievements.length > 0" class="space-y-4">
      <li
        v-for="ach in achievements"
        :key="ach.api_name"
        :class="[
          'bg-gray-800/60 border rounded-lg p-4 flex items-start space-x-4 transition-opacity',
          ach.achieved
            ? 'border-green-500/40'
            : 'border-gray-700/50 opacity-60 hover:opacity-100'
        ]"
      >
        <img
          :src="ach.achieved ? ach.icon : ach.icon_gray"
          :alt="`Icône ${ach.name}`"
          class="w-16 h-16 flex-shrink-0 border border-slate-700 rounded" loading="lazy"
          onerror="this.style.display='none'" />
        <div class="flex-grow">
          <h3 :class="['text-lg font-semibold', ach.achieved ? 'text-green-300' : 'text-slate-200']">
            {{ ach.name }}
          </h3>
          <p class="text-sm text-slate-400 mt-1">
            {{ ach.description }}
          </p>
          <p v-if="ach.achieved" class="text-xs text-green-500 mt-2">
            Débloqué le : {{ formatTimestamp(ach.unlock_time) }}
          </p>
        </div>

        <span v-if="ach.achieved" class="text-green-500 text-3xl font-bold ml-4 self-center">✔</span>
      </li>
    </ul>

    <div v-else class="text-center py-10">
      <p class="text-slate-400 text-lg">Aucun succès trouvé pour ce jeu.</p>
    </div>

  </div>
</template>

<style scoped>
/* Styles spécifiques si besoin */
</style>
