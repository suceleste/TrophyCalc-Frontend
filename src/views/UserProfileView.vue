<script setup lang="ts">

import { computed, ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import type { PublicUserProfile } from '@/types/index';
import { useSeoMeta } from '@unhead/vue';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Utilise defineProps pour recevoir le paramètre d'URL (grâce à `props: true` dans le routeur)
const props = defineProps<{
  steam_id_64: string;
}>();

const userProfile = ref<PublicUserProfile | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

// --- Fonctions Utilitaires ---

/**
 * Formate une date ISO (ex: "2025-10-20T12:00:00Z") en date française lisible.
 * @param {string} dateString - La date au format ISO.
 * @returns {string} - La date formatée.
 */
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
};

// --- LIFECYCLE (Au montage du composant) ---


onMounted(async () => {
  const steamId = props.steam_id_64; // Récupère le SteamID depuis les props

  if (!steamId) {
    error.value = "ID Steam manquant dans l'URL.";
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  error.value = null;
  const apiUrl = `${API_BASE_URL}/profiles/steam/${steamId}`;

  if (import.meta.env.DEV) { // Log uniquement en développement
    console.log(`[UserProfileView] Chargement du profil... Appel API: ${apiUrl}`);
  }

  try {
    // Lance l'appel API (publique, pas besoin de token)
    // On précise à Axios le type de réponse attendu (PublicUserProfile)
    const response = await axios.get<PublicUserProfile>(apiUrl, {
      headers: { 'Accept': 'application/json' }
    });

    userProfile.value = response.data; // Stocke les données

    if (import.meta.env.DEV) {
      console.log("[UserProfileView] Profil reçu avec succès:", userProfile.value);
    }

  } catch (err: unknown) { // Utilise 'unknown' au lieu de 'any' pour un typage strict
    console.error(`[UserProfileView] Erreur lors du chargement du profil ${steamId}:`, err);
    if (axios.isAxiosError(err) && err.response) { // Vérifie si c'est une erreur Axios
      if (err.response.status === 404) {
        error.value = "Utilisateur non trouvé dans TrophyCalc.";
      } else {
        error.value = `Erreur API (${err.response.status}): Impossible de charger le profil.`;
      }
    } else {
      error.value = "Erreur réseau ou inconnue.";
    }
    userProfile.value = null; // Réinitialise en cas d'erreur
  } finally {
    isLoading.value = false; // Le chargement est terminé
  }
});

useSeoMeta({
  title: computed(() => userProfile.value?.name
    ? `Profil de ${userProfile.value.name} - Stats & Succès | TrophyCalc`
    : 'Profil Joueur - TrophyCalc'),

  description: computed(() => `Regardez les statistiques de ${userProfile.value?.name || 'ce joueur'} : jeux complétés, score XP et succès rares sur Steam.`),

  // Pour éviter que Google indexe des profils vides ou buggés
  robots: computed(() => userProfile.value ? 'index, follow' : 'noindex')
})
</script>

<template>
  <div class="space-y-6">
    <div v-if="isLoading" class="text-center py-10">
      <p class="text-slate-400 animate-pulse text-lg">Chargement du profil...</p>
    </div>

    <div v-else-if="error" class="bg-red-900/50 border border-red-500/50 text-red-300 p-4 rounded-lg">
      <p class="font-semibold">Erreur :</p>
      <p>{{ error }}</p>
    </div>

    <div v-else-if="userProfile" class="flex flex-col items-center text-center p-8 bg-gray-800/50 rounded-xl border border-purple-500/30">
      <img
        :src="userProfile.avatar"
        :alt="`Avatar de ${userProfile.name}`"
        class="w-32 h-32 rounded-full mb-4 border-4 border-purple-500 shadow-lg"
      />
      <h1 class="text-4xl font-bold text-white">{{ userProfile.name }}</h1>
      <p class="text-slate-400 mt-1">
        Membre TrophyCalc depuis le {{ formatDate(userProfile.created_at) }}
      </p>
      <a :href="userProfile.profile_url" target="_blank" class="text-sm text-purple-400 hover:underline">Voir profil Steam</a>
      <div class="mt-8 border-t border-gray-700 pt-6 w-full max-w-lg">
        <h2 class="text-2xl font-semibold text-white mb-4">Statistiques Utilisateur</h2>
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-gray-700/50 p-4 rounded-lg">
            <div class="text-sm text-slate-400 uppercase">Jeux Complétés</div>
            <div class="text-3xl font-bold text-white animate-pulse">{{ userProfile.games_completed }}</div>
          </div>
          <div class="bg-gray-700/50 p-4 rounded-lg">
            <div class="text-sm text-slate-400 uppercase">Total XP</div>
            <div class="text-3xl font-bold text-white animate-pulse">{{ userProfile.total_xp}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Styles spécifiques si besoin */
</style>
