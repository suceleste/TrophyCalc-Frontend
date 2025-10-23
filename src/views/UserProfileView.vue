<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

// 1. Récupérer le steam_id_64 passé par le routeur grâce à `props: true`
const props = defineProps<{
  steam_id_64: string // Définit que le composant attend une prop 'steam_id_64' de type string
}>();

// 2. Variables d'état
const userProfile = ref<any>(null); // Pour stocker les données du profil
const isLoading = ref(true);
const error = ref<string | null>(null);

// 3. Appeler l'API au montage
onMounted(async () => {
  if (!props.steam_id_64) {
    error.value = "ID Steam manquant dans l'URL.";
    isLoading.value = false;
    return;
  }

  isLoading.value = true;
  error.value = null;
  console.log(`Profil: Chargement du profil pour ${props.steam_id_64}...`);

  try {
    const response = await axios.get(`http://127.0.0.1:8000/api/profiles/steam/${props.steam_id_64}`, {
      headers: { 'Accept': 'application/json' } // API publique, pas besoin de token ici
    });
    userProfile.value = response.data;
    console.log("Profil: Données reçues:", userProfile.value);
  } catch (err: any) {
    console.error(`Profil: Erreur chargement profil ${props.steam_id_64}:`, err);
    if (err.response?.status === 404) {
      error.value = "Utilisateur non trouvé dans TrophyCalc.";
    } else {
      error.value = "Impossible de charger le profil.";
    }
    userProfile.value = null;
  } finally {
    isLoading.value = false;
  }
});

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

    <div v-else-if="userProfile" class="flex flex-col items-center text-center">
      <img
        :src="userProfile.avatar"
        :alt="`Avatar de ${userProfile.name}`"
        class="w-32 h-32 rounded-full mb-4 border-4 border-purple-500 shadow-lg"
      />
      <h1 class="text-4xl font-bold text-white">{{ userProfile.name }}</h1>
      <p class="text-slate-400 mt-1">Membre depuis : {{ new Date(userProfile.created_at).toLocaleDateString('fr-FR') }}</p>
      <div class="mt-8 border-t border-gray-700 pt-6 w-full max-w-md">
        <h2 class="text-2xl font-semibold text-white mb-4">Statistiques (Bientôt)</h2>
        <p class="text-slate-500">(Affichage du % global, etc.)</p>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Styles spécifiques si besoin */
</style>
