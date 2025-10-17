<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from './stores/auth' // On importe notre "tableau de bord"

// On récupère une instance de notre tableau de bord pour pouvoir l'utiliser
const authStore = useAuthStore()

// Dès que l'application est prête, on lance l'action pour récupérer l'utilisateur
onMounted(() => {
  authStore.fetchUser()
})
</script>

<template>
  <RouterView />
</template>

<style scoped>
/* Tu peux laisser cette partie vide */
</style>