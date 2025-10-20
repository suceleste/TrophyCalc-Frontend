<script setup lang="ts">
import { useAuthStore } from '../stores/auth';
import { RouterLink } from 'vue-router';

const authStore = useAuthStore();
</script>

<template>
  <div>
    <div v-if="authStore.isLoadingUser" class="text-center py-20">
      <p class="text-slate-400 animate-pulse">Chargement de votre tableau de bord...</p>
      </div>

    <div v-else-if="authStore.isLoggedIn && authStore.user" class="space-y-10">

      <section class="flex flex-col md:flex-row items-center md:space-x-8 space-y-6 md:space-y-0">
        <div class="flex items-center space-x-4 bg-gray-800/50 p-6 rounded-xl border border-purple-500/30 w-full md:w-auto">
          <img :src="authStore.user.avatar" alt="Avatar" class="w-16 h-16 rounded-lg border-2 border-gray-700"/>
          <div>
            <h1 class="text-2xl font-bold text-white">{{ authStore.user.name }}</h1>
            <a :href="authStore.user.profile_url" target="_blank" class="text-sm text-purple-400 hover:underline">Voir profil Steam</a>
          </div>
        </div>
        <div class="bg-gray-800/50 p-6 rounded-xl border border-purple-500/30 text-center flex-grow">
          <div class="text-sm text-slate-400 uppercase tracking-wider">Complétion Globale</div>
          <div class="text-5xl font-extrabold text-white mt-2">-- %</div>
          <div class="text-xs text-slate-500 mt-1">(Bientôt disponible)</div>
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
       <h1 class="text-2xl text-red-500 font-semibold">Erreur de Chargement</h1>
       <p class="text-slate-400 mt-2">Impossible de charger les données utilisateur. Vous n'êtes peut-être pas connecté.</p>
       </div>
  </div>
</template>
