<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'; // Ajout de 'computed'
import { useRoute } from 'vue-router'; // Pour lire les paramètres de l'URL (app_id)
import axios from 'axios';
import { useAuthStore } from '../stores/auth'; // Pour le token

// Outils
const route = useRoute();
const authStore = useAuthStore();

// Variables d'état
const allAchievements = ref<any[]>([]); // Stocke tous les succès bruts de l'API
const gameName = ref<string | null>(null);
const totalCount = ref(0);
const unlockedCount = ref(0);
const isLoading = ref(true);
const error = ref<string | null>(null);

// État du filtre ('all', 'unlocked', 'locked')
const currentFilter = ref<'all' | 'unlocked' | 'locked'>('all');

// Récupérer l'app_id depuis l'URL
const appId = route.params.app_id as string; // 'as string' est pour TypeScript

// Fonction pour convertir le timestamp Unix en date lisible
const formatTimestamp = (timestamp: number | null) => {
  if (!timestamp) return 'Non débloqué';
  const date = new Date(timestamp * 1000); // Le timestamp est en secondes
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
};

// Propriété calculée pour afficher la liste filtrée
const filteredAchievements = computed(() => {
  if (currentFilter.value === 'unlocked') {
    // Garde seulement ceux où 'achieved' est vrai
    return allAchievements.value.filter(ach => ach.achieved);
  }
  if (currentFilter.value === 'locked') {
    // Garde seulement ceux où 'achieved' est faux
    return allAchievements.value.filter(ach => !ach.achieved);
  }
  // Par défaut ('all'), retourne toute la liste
  return allAchievements.value;
});


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
    allAchievements.value = response.data.achievements || []; // On stocke la liste brute ici
    gameName.value = response.data.game_name || `Jeu ${appId}`;
    totalCount.value = response.data.total_count || 0;
    unlockedCount.value = response.data.unlocked_count || 0;
    console.log('Succès bruts reçus:', allAchievements.value); // Log pour vérifier

  } catch (err: any) {
    console.error(`Erreur lors de la récupération des succès pour ${appId}:`, err);
    if (err.response) {
      if (err.response.data.status === 'info') {
         error.value = err.response.data.message;
      } else {
         error.value = `Erreur API (${err.response.status}): ${err.response.data.message || 'Impossible de récupérer les succès.'}`;
      }
    } else {
      error.value = "Erreur réseau ou impossible de contacter l'API.";
    }
    allAchievements.value = []; // Vide la liste en cas d'erreur
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="space-y-6">
    <h1 v-if="gameName" class="text-4xl font-bold text-white">{{ gameName }} - Succès</h1>
    <h1 v-else class="text-4xl font-bold text-white animate-pulse">Chargement...</h1>

    <div v-if="!isLoading && !error && totalCount > 0">
      <div class="flex justify-between items-center mb-1 text-sm text-slate-400">
        <span>Progression</span>
        <span>{{ unlockedCount }} / {{ totalCount }} ({{ Math.round((unlockedCount / totalCount) * 100) }}%)</span>
      </div>
      <div class="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
        <div
          class="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full transition-all duration-500 ease-out"
          :style="{ width: (totalCount > 0 ? (unlockedCount / totalCount * 100) : 0) + '%' }"
        ></div>
      </div>
    </div>

    <div v-if="!isLoading && !error && totalCount > 0" class="flex flex-wrap gap-3 border-b border-gray-700 pb-4">
      <button
        @click="currentFilter = 'all'"
        :class="['px-4 py-1.5 rounded-md text-sm font-medium transition-colors duration-200',
                 currentFilter === 'all' ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-700 text-slate-300 hover:bg-gray-600']"
      >
        Tous ({{ totalCount }})
      </button>
      <button
        @click="currentFilter = 'unlocked'"
        :class="['px-4 py-1.5 rounded-md text-sm font-medium transition-colors duration-200',
                 currentFilter === 'unlocked' ? 'bg-green-600 text-white shadow-lg' : 'bg-gray-700 text-slate-300 hover:bg-gray-600']"
      >
        Débloqués ({{ unlockedCount }})
      </button>
      <button
        @click="currentFilter = 'locked'"
        :class="['px-4 py-1.5 rounded-md text-sm font-medium transition-colors duration-200',
                 currentFilter === 'locked' ? 'bg-red-700 text-white shadow-lg' : 'bg-gray-700 text-slate-300 hover:bg-gray-600']"
      >
        Verrouillés ({{ totalCount - unlockedCount }})
      </button>
    </div>

    <div v-if="isLoading" class="text-center py-10">
      <p class="text-slate-400 animate-pulse text-lg">Chargement des succès...</p>
    </div>

    <div v-else-if="error" class="bg-yellow-900/50 border border-yellow-500/50 text-yellow-300 p-4 rounded-lg">
      <p class="font-semibold">Information ou Erreur :</p>
      <p>{{ error }}</p>
    </div>

    <ul v-else-if="filteredAchievements.length > 0" class="space-y-4">
      <li
        v-for="ach in filteredAchievements"
        :key="ach.api_name"
        :class="[
          'bg-gray-800/60 border rounded-lg p-4 flex items-start space-x-4 transition-opacity duration-300',
          ach.achieved
            ? 'border-green-500/40'
            : 'border-gray-700/50 opacity-60 hover:opacity-90' // Moins opaque au survol
        ]"
      >
        <img
          :src="ach.achieved ? ach.icon : ach.icon_gray"
          :alt="`Icône ${ach.name}`"
          class="w-16 h-16 flex-shrink-0 border border-slate-700 rounded"
          loading="lazy"
          onerror="this.style.display='none'"
        />

        <div class="flex-grow min-w-0"> <h3 :class="['text-lg font-semibold truncate', ach.achieved ? 'text-green-300' : 'text-slate-200']" :title="ach.name">
            {{ ach.name }}
          </h3>
          <p class="text-sm text-slate-400 mt-1 break-words"> {{ ach.description || 'Pas de description disponible.' }}
          </p>
          <p v-if="ach.achieved" class="text-xs text-green-500 mt-2">
            Débloqué le : {{ formatTimestamp(ach.unlock_time) }}
          </p>
        </div>

        <span v-if="ach.achieved" class="text-green-500 text-3xl font-bold ml-4 self-center flex-shrink-0">✔</span>
      </li>
    </ul>

    <div v-else class="text-center py-10">
       <p v-if="currentFilter !== 'all' && totalCount > 0" class="text-slate-400 text-lg">Aucun succès ne correspond à ce filtre.</p>
       <p v-else class="text-slate-400 text-lg">Aucun succès trouvé pour ce jeu.</p>
     </div>

  </div>
</template>

<style scoped>
/* Styles spécifiques si besoin */
</style>
