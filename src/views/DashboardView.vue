<script setup lang="ts">
import { ref, watch } from 'vue'; // onMounted n'est plus nécessaire ici
import { useAuthStore } from '../stores/auth';
import { RouterLink } from 'vue-router';
import axios from 'axios';

const authStore = useAuthStore();

// États pour la complétion globale
const globalCompletion = ref<number | null>(null);
const isLoadingCompletion = ref(false);
const completionError = ref<string | null>(null);

// Fonction pour charger les stats (reste la même)
const fetchGlobalCompletion = async () => {
  if (!authStore.token) {
    console.error("Dashboard: fetchGlobalCompletion appelé sans token.");
    completionError.value = "Non connecté.";
    isLoadingCompletion.value = false;
    return;
  }

  isLoadingCompletion.value = true;
  completionError.value = null;
  const apiUrl = 'http://127.0.0.1:8000/api/user/stats/global-completion'; // URL dans une variable pour clarté

  try {
    // =============================================
    // LOG JUSTE AVANT L'APPEL AXIOS
    console.log(`Dashboard: Tentative d'appel à ${apiUrl} avec token...`);
    // =============================================

    const response = await axios.get(apiUrl, {
      headers: {
        'Authorization': `Bearer ${authStore.token}`,
        'Accept': 'application/json'
      }
    });

    globalCompletion.value = response.data.completion_percentage;
    console.log("Dashboard: Complétion globale reçue:", globalCompletion.value);

  } catch (err: any) {
    console.error(`Dashboard: ERREUR lors de l'appel à ${apiUrl}:`, err); // Log d'erreur amélioré
    if (err.response) {
       completionError.value = `Erreur (${err.response.status}).`;
    } else {
       completionError.value = "Erreur réseau.";
    }
    globalCompletion.value = null;
  } finally {
    isLoadingCompletion.value = false;
  }
};

// =============================================
// OBSERVATEUR CORRIGÉ : Surveille authStore.user
watch(
  () => authStore.user, // La source à surveiller est l'objet user lui-même
  (newUser, oldUser) => {
    console.log(`Dashboard Watcher: User a changé. Ancien: ${!!oldUser}, Nouveau: ${!!newUser}`); // Log

    // Si un utilisateur VIENT d'être chargé (passe de null à non-null)
    // ET qu'on n'a pas encore chargé les stats
    if (newUser && !oldUser && globalCompletion.value === null && !isLoadingCompletion.value) {
      console.log("Dashboard Watcher: Utilisateur chargé, lancement de fetchGlobalCompletion."); // Log
      fetchGlobalCompletion();
    }
  },
  { immediate: true } // immediate: true => Vérifie aussi au montage initial
);
// =============================================

</script>

<template>
  <div>
    <div v-if="authStore.isLoadingUser" class="text-center py-20">
      <p class="text-slate-400 animate-pulse text-lg">Chargement de votre tableau de bord...</p>
    </div>

    <div v-else-if="authStore.isLoggedIn && authStore.user" class="space-y-10">

      <div class="mb-8">
         <h1 class="text-4xl font-bold text-white">Bonjour, {{ authStore.user.name }} !</h1>
         <p class="text-slate-400">Prêt à analyser vos trophées ?</p>
      </div>

      <section class="flex flex-col md:flex-row items-center md:space-x-8 space-y-6 md:space-y-0">
        <div class="flex items-center space-x-4 bg-gray-800/50 p-6 rounded-xl border border-purple-500/30 w-full md:w-auto">
          <img :src="authStore.user.avatar" alt="Avatar" class="w-16 h-16 rounded-lg border-2 border-gray-700"/>
          <div>
            <h1 class="text-2xl font-bold text-white">{{ authStore.user.name }}</h1>
            <a :href="authStore.user.profile_url" target="_blank" class="text-sm text-purple-400 hover:underline">Voir profil Steam</a>
          </div>
        </div>
        <div class="bg-gray-800/50 p-6 rounded-xl border border-purple-500/30 text-center flex-grow">
          <div class="text-sm text-slate-400 uppercase tracking-wider mb-2">Complétion Globale</div>
          <div v-if="isLoadingCompletion" class="text-4xl font-extrabold text-white animate-pulse">-- %</div>
          <div v-else-if="completionError" class="text-lg font-semibold text-red-500">{{ completionError }}</div>
          <div v-else-if="globalCompletion !== null" class="text-5xl font-extrabold text-white">
            {{ globalCompletion }}<span class="text-3xl text-slate-400">%</span>
          </div>
          <div v-else class="text-lg font-semibold text-slate-500">N/A</div>
        </div>
      </section>

      <section class="bg-gray-800/50 p-4 rounded-xl border border-purple-500/30 flex justify-around items-center space-x-4">
         <RouterLink :to="{ name: 'my-games' }" class="text-center px-4 py-2 rounded-lg hover:bg-purple-600/30 transition-colors">
           <div class="text-2xl mb-1">🎮</div>
           <div class="font-semibold text-white">Ma Bibliothèque</div>
         </RouterLink>
         <div class="text-center px-4 py-2 opacity-50">
           <div class="text-2xl mb-1">🏆</div>
           <div class="font-semibold text-white">Succès Rares</div>
           <div class="text-xs text-slate-500">(Bientôt)</div>
         </div>
         <div class="text-center px-4 py-2 opacity-50">
           <div class="text-2xl mb-1">🎯</div>
           <div class="font-semibold text-white">Objectifs</div>
            <div class="text-xs text-slate-500">(Bientôt)</div>
         </div>
      </section>

      <section>
         <h2 class="text-3xl font-bold text-white mb-6">Aperçu Rapide</h2>
         <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div class="bg-gray-800/50 p-6 rounded-xl border border-purple-500/30">
                 <h3 class="text-xl font-semibold text-white mb-4">Derniers Succès Débloqués</h3>
                 <p class="text-slate-400">(Liste bientôt disponible ici...)</p>
             </div>
             <div class="bg-gray-800/50 p-6 rounded-xl border border-purple-500/30">
                 <h3 class="text-xl font-semibold text-white mb-4">Jeux Presque Terminés</h3>
                 <p class="text-slate-400">(Liste bientôt disponible ici...)</p>
             </div>
         </div>
      </section>

    </div>

    <div v-else class="text-center py-20">
       <h1 class="text-2xl text-red-500 font-semibold">Accès Refusé</h1>
       <p class="text-slate-400 mt-2">Impossible de charger les données ou vous n'êtes pas connecté.</p>
       </div>
  </div>
</template>
