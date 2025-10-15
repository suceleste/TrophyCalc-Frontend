<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

// On crée une variable réactive pour stocker le message de l'API
const apiMessage = ref("Chargement du message depuis l'API...")

// onMounted() est une fonction qui s'exécute automatiquement
// une fois que le composant est affiché à l'écran.
onMounted(async () => {
  try {
    // On fait la requête GET vers notre backend Laravel
    const response = await axios.get('http://127.0.0.1:8000/api/status')

    // On met à jour notre variable avec le message reçu
    apiMessage.value = response.data.status
  } catch (error) {
    // En cas d'erreur, on affiche un message clair
    apiMessage.value = "Erreur: Impossible de contacter l'API."
    console.error('Il y a eu une erreur !', error)
  }
})
</script>

<template>
  <main>
    <h1>Bienvenue sur TrophyCalc !</h1>
    <p>
      Statut du backend : <strong>{{ apiMessage }}</strong>
    </p>
  </main>
</template>
