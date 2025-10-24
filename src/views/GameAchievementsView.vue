<script setup lang="ts">
/**
 * Vue pour afficher les succès d'un jeu spécifique.
 * Récupère les données depuis l'API, gère le filtrage, le tri et la recherche.
 */
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth'; // Utilise l'alias @/
import type { Achievement } from '@/types/index'; // Importe le type "contrat"

// Récupère l'URL de base de l'API depuis les variables d'environnement
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// --- Outils ---
const route = useRoute();
const authStore = useAuthStore();

// --- STATE (Variables d'état) ---
const allAchievements = ref<Achievement[]>([]); // Stocke tous les succès bruts (typé)
const gameName = ref<string | null>(null);
const totalCount = ref(0);
const unlockedCount = ref(0);
const isLoading = ref(true);
const error = ref<string | null>(null);

// Variables d'état pour les contrôles
const currentFilter = ref<'all' | 'unlocked' | 'locked'>('all');
const currentSort = ref<'default' | 'name_asc' | 'name_desc' | 'date_asc' | 'date_desc' | 'rarity_asc' | 'rarity_desc'>('default');
const searchQuery = ref('');

// Récupérer l'app_id depuis l'URL de manière sécurisée
const appId = computed(() => {
  const id = route.params.app_id;
  return Array.isArray(id) ? id[0] : id;
});

// --- Fonctions Utilitaires ---

/**
 * Formate un timestamp Unix en date française lisible.
 * @param {number | null} timestamp - Le timestamp Unix (en secondes).
 * @returns {string} - La date formatée ou 'Non débloqué'.
 */
const formatTimestamp = (timestamp: number | null): string => {
  if (!timestamp || timestamp === 0) return 'Non débloqué';
  const date = new Date(timestamp * 1000); // JS attend des millisecondes
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
};

// --- COMPUTED (Propriétés calculées) ---

/**
 * Calcule la liste des succès à afficher en fonction des filtres,
 * de la recherche et du tri sélectionnés.
 */
const displayedAchievements = computed((): Achievement[] => {
  let list: Achievement[] = [...allAchievements.value]; // Commence avec une copie

  // 1. Filtrer par statut (Tous/Débloqués/Verrouillés)
  if (currentFilter.value === 'unlocked') {
    list = list.filter(ach => ach.achieved);
  } else if (currentFilter.value === 'locked') {
    list = list.filter(ach => !ach.achieved);
  }

  // 2. Filtrer par recherche (sur le nom ou la description)
  const query = searchQuery.value.toLowerCase().trim();
  if (query) {
    list = list.filter(ach =>
      (ach.name || '').toLowerCase().includes(query) ||
      (ach.description || '').toLowerCase().includes(query)
    );
  }

  // 3. Trier la liste résultante
  // On crée une nouvelle copie pour le tri pour ne pas muter la liste filtrée
  const sortedList = [...list];
  switch (currentSort.value) {
    case 'name_asc': // A-Z
      sortedList.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      break;
    case 'name_desc': // Z-A
      sortedList.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
      break;
    case 'date_desc': // Plus récent
      sortedList.sort((a, b) => {
          const timeA = a.achieved ? a.unlock_time : -1;
          const timeB = b.achieved ? b.unlock_time : -1;
          if (timeA === -1 && timeB === -1) return (a.name || '').localeCompare(b.name || '');
          return timeB - timeA;
      });
      break;
    case 'date_asc': // Plus ancien
      sortedList.sort((a, b) => {
          const timeA = a.achieved ? a.unlock_time : Infinity;
          const timeB = b.achieved ? b.unlock_time : Infinity;
          if (timeA === Infinity && timeB === Infinity) return (a.name || '').localeCompare(b.name || '');
          return timeA - timeB;
      });
      break;
    case 'rarity_desc': // Plus rare (% ascendant)
       sortedList.sort((a, b) => {
           const percentA = a.percent ?? 101; // 101 si null (fin)
           const percentB = b.percent ?? 101;
           if (percentA === percentB) return (a.name || '').localeCompare(b.name || '');
           return percentA - percentB;
       });
       break;
    case 'rarity_asc': // Moins rare (% descendant)
       sortedList.sort((a, b) => {
           const percentA = a.percent ?? -1; // -1 si null (début)
           const percentB = b.percent ?? -1;
           if (percentA === percentB) return (a.name || '').localeCompare(b.name || '');
           return percentB - percentA;
       });
       break;
    // case 'default':
    //   L'API renvoie déjà trié par débloqué en premier,
    //   donc on n'applique pas de tri supplémentaire.
  }
  return sortedList;
});

// --- LIFECYCLE (Au montage du composant) ---

/**
 * Au montage, vérifie l'authentification et l'AppID, puis
 * lance la récupération des succès du jeu.
 */
onMounted(async () => {
  if (!authStore.token) {
    error.value = "Erreur: Authentification requise.";
    isLoading.value = false;
    return;
  }
  if (!appId.value) { // Utilise .value car appId est un computed
    error.value = "Erreur: ID de l'application manquant dans l'URL.";
    isLoading.value = false;
    return;
  }

  try {
    isLoading.value = true;
    error.value = null;
    const apiUrl = `${API_BASE_URL}/user/games/${appId.value}/achievements`;

    if (import.meta.env.DEV) {
      console.log(`[GameAchievementsView] Appel API: ${apiUrl}`);
    }

    const response = await axios.get(apiUrl, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Accept': 'application/json'
      }
    });

    // Mise à jour de l'état avec les données reçues
    // On type la réponse pour plus de sécurité
    const data = response.data as {
        status: string;
        game_name: string;
        achievements: Achievement[];
        total_count: number;
        unlocked_count: number;
        message?: string; // Pour les erreurs 'info'
    };

    if (data.status === 'success') {
        allAchievements.value = data.achievements || [];
        gameName.value = data.game_name || `Jeu ${appId.value}`;
        totalCount.value = data.total_count || 0;
        unlockedCount.value = data.unlocked_count || 0;
    } else if (data.status === 'info') {
        // Gère les cas où l'API renvoie une info (ex: pas de succès)
        error.value = data.message || 'Succès non disponibles pour ce jeu.';
        allAchievements.value = [];
    }

    if (import.meta.env.DEV) {
      console.log(`[GameAchievementsView] ${allAchievements.value.length} succès bruts reçus.`);
    }

  } catch (err: unknown) {
    console.error(`[GameAchievementsView] Erreur lors de la récupération des succès pour ${appId.value}:`, err);
    if (axios.isAxiosError(err) && err.response) {
      // Si l'API renvoie une erreur 'info' (comme profil privé)
      if (err.response.data.status === 'info') {
         error.value = err.response.data.message;
      } else {
         error.value = `Erreur API (${err.response.status}): ${err.response.data.message || 'Impossible de récupérer les succès.'}`;
      }
    } else {
      error.value = "Erreur réseau ou impossible de contacter l'API.";
    }
    allAchievements.value = [];
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="space-y-6">
    <h1 v-if="gameName" class="text-4xl font-bold text-white">{{ gameName }} - Succès</h1>
    <h1 v-else-if="isLoading" class="text-4xl font-bold text-white animate-pulse">Chargement...</h1>
    <h1 v-else class="text-4xl font-bold text-red-500">Erreur</h1>

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

    <div v-if="!isLoading && !error && totalCount > 0" class="space-y-4 border-b border-gray-700 pb-4">
      <div class="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
        <div class="flex flex-wrap gap-3">
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
        <div class="flex items-center space-x-2 flex-shrink-0">
           <label for="sort-select" class="text-sm text-slate-400">Trier par :</label>
           <select id="sort-select" v-model="currentSort" class="bg-gray-700 text-slate-300 text-sm rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-purple-500 border border-gray-600">
               <option value="default">Défaut</option>
               <option value="name_asc">Nom (A-Z)</option>
               <option value="name_desc">Nom (Z-A)</option>
               <option value="date_desc">Date (Plus récent)</option>
               <option value="date_asc">Date (Plus ancien)</option>
               <option value="rarity_desc">Rareté (Plus rare)</option>
               <option value="rarity_asc">Rareté (Moins rare)</option>
           </select>
        </div>
      </div>
      <div class="relative w-full md:w-1/2 lg:w-1/3">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Rechercher un succès..."
          aria-label="Rechercher un succès par nom ou description"
          class="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-1.5 px-4 pl-10 text-white
                 placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-300"
        />
        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>

    <div v-if="isLoading" class="text-center py-10">
      <p class="text-slate-400 animate-pulse text-lg">Chargement des succès...</p>
    </div>

    <div v-else-if="error" class="bg-yellow-900/50 border border-yellow-500/50 text-yellow-300 p-4 rounded-lg">
      <p class="font-semibold">Information ou Erreur :</p>
      <p>{{ error }}</p>
    </div>

    <ul v-else-if="displayedAchievements.length > 0" class="space-y-4">
      <li
        v-for="ach in displayedAchievements"
        :key="ach.api_name"
        :class="[
          'bg-gray-800/60 border rounded-lg p-4 flex items-start space-x-4 transition-opacity duration-300',
          ach.achieved
            ? 'border-green-500/40'
            : 'border-gray-700/50 opacity-60 hover:opacity-90'
        ]"
      >
        <img
          :src="ach.achieved ? ach.icon : ach.icon_gray"
          :alt="`Icône ${ach.name}`"
          class="w-16 h-16 flex-shrink-0 border border-slate-700 rounded"
          loading="lazy"
          onerror="this.style.display='none'"
        />

        <div class="flex-grow min-w-0">
          <h3 :class="['text-lg font-semibold truncate', ach.achieved ? 'text-green-300' : 'text-slate-200']" :title="ach.name">
            {{ ach.name }}
          </h3>
          <p class="text-sm text-slate-400 mt-1 break-words">
            {{ ach.description || 'Pas de description disponible.' }}
          </p>
          <p v-if="ach.percent !== null" class="text-xs text-amber-400 mt-1 font-medium">
             💎 Rareté : {{ ach.percent.toFixed(2) }}%
          </p>
          <p v-if="ach.achieved" class="text-xs text-green-500 mt-1">
            Débloqué le : {{ formatTimestamp(ach.unlock_time) }}
          </p>
        </div>

        <span v-if="ach.achieved" class="text-green-500 text-3xl font-bold ml-4 self-center flex-shrink-0">✔</span>
      </li>
    </ul>

    <div v-else class="text-center py-10">
       <p v-if="(currentFilter !== 'all' || currentSort !== 'default' || searchQuery ) && totalCount > 0" class="text-slate-400 text-lg">Aucun succès ne correspond à ces critères.</p>
       <p v-else class="text-slate-400 text-lg">Aucun succès trouvé pour ce jeu.</p>
     </div>

  </div>
</template>

<style scoped>
/* Style pour la flèche du <select> */
select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%239ca3af' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}
</style>
