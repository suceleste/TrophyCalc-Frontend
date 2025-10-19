<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth' // On importe notre tableau de bord

// On récupère une instance du tableau de bord pour accéder au token
const authStore = useAuthStore()

// On crée une variable "réactive" pour stocker la liste des jeux.
// Au début, elle est vide.
const games = ref([])
// On crée une variable pour gérer l'état de chargement
const isLoading = ref(true)

// Dès que la page est prête, on lance l'appel à l'API
onMounted(async () => {
  // On vérifie si on a bien un token
  if (authStore.token) {
    try {
      // On appelle notre nouvelle route backend en incluant le token
      const response = await axios.get('http://127.0.0.1:8000/api/user/games', {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })
      
      // On met à jour notre variable 'games' avec les données reçues
      games.value = response.data.games

    } catch (error) {
      console.error("Erreur lors de la récupération des jeux:", error)
    } finally {
      // Dans tous les cas (succès ou erreur), on arrête le chargement
      isLoading.value = false
    }
  } else {
    console.error("Aucun token d'authentification trouvé.")
    isLoading.value = false
  }
})
</script>

<template>
  <div>
    <h1>Mes Jeux Steam</h1>
    
    <div v-if="isLoading">
      <p>Chargement de votre bibliothèque de jeux...</p>
    </div>

    <div v-else>
      <ul>
        <li v-for="game in games" :key="game.appid" style="display: flex; align-items: center; margin-bottom: 10px;">
          <img :src="game.icon_url" :alt="`Icône de ${game.name}`">
          <span style="margin-left: 15px;">
            {{ game.name }} - ({{ game.playtime_hours }} heures)
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
ul {
  list-style: none;
  padding: 0;
}
</style>