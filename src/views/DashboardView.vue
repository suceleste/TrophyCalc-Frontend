<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
const authStore = useAuthStore()
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold mb-6">Tableau de Bord</h1>
    
    <div class="bg-gray-800 p-6 rounded-lg">
      <p>C'est ici que s'afficheront vos statistiques principales.</p>
      
      <nav class="mt-6">
        <RouterLink :to="{ name: 'my-games' }" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Voir ma bibliothèque de jeux
        </RouterLink>
      </nav>
    </div>
  </div>
</template>