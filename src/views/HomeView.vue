<script setup lang="ts">
import { useAuthStore } from '../stores/auth' // On importe notre tableau de bord

// On récupère une instance du tableau de bord
const authStore = useAuthStore()
</script>

<template>
  <main>
    <div v-if="authStore.isLoggedIn && authStore.user">
      <h1>Bienvenue, {{ authStore.user.name }} !</h1>
      <p>Votre connexion a réussi.</p>
      <img :src="authStore.user.avatar" alt="Avatar de l'utilisateur" style="border-radius: 8px; width: 128px; height: 128px;">
    </div>

    <div v-else>
      <h1>Bienvenue sur TrophyCalc !</h1>
      <p>Veuillez vous connecter pour continuer.</p>
      </div>
  </main>
</template>