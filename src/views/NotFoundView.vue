<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <div class="flex flex-col items-center justify-center text-center" style="height: 60vh;">
    <h1 class="text-9xl font-extrabold text-purple-400 tracking-tighter animate-pulse">404</h1>
    <h2 class="text-3xl font-semibold text-white mt-4">Page Non Trouvée</h2>
    <p class="text-slate-400 mt-2 max-w-md">
      Oups ! Il semblerait que vous ayez pris un mauvais portail. La page que vous cherchez n'existe pas ou a été déplacée.
    </p>
    <div class="mt-8">
      <RouterLink
        :to="{ name: 'home' }"
        class="px-6 py-3 bg-purple-600 text-white font-bold rounded-lg shadow-lg shadow-purple-500/30
               hover:bg-purple-700 transition-all duration-300 transform hover:scale-105"
      >
        Retourner à l'Accueil
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
/* On peut ajouter des styles spécifiques ici si besoin */
</style>
