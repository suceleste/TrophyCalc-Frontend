<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { RouterLink } from 'vue-router';

// On récupère une instance du tableau de bord
const authStore = useAuthStore()
</script>

<template>
  <main>
    <div v-if="authStore.isLoggedIn && authStore.user">
      <h1>Bienvenue, {{ authStore.user.name }} !</h1>
      <p>Votre connexion a réussi.</p>
      <img :src="authStore.user.avatar" alt="Avatar de l'utilisateur" style="border-radius: 8px; width: 128px; height: 128px;">
      
      <nav style="margin-top: 20px;">
        <RouterLink :to="{ name: 'my-games' }">Voir mes jeux</RouterLink>
      </nav>
      
    </div>

    <div v-else>
      <h1>Bienvenue sur TrophyCalc !</h1>
      <p>Veuillez vous connecter pour continuer.</p>
      
      <a href="http://127.0.0.1:8000/api/auth/steam/redirect">
        <img src="https://community.akamai.steamstatic.com/public/images/signinthroughsteam/sits_01.png" alt="Se connecter via Steam">
      </a>
      </div>
  </main>
</template>

<style scoped>
/* On peut centrer le contenu pour que ce soit plus joli */
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
}
</style>