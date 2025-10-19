<script setup lang="ts">
// On importe les outils de Vue
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'

// On importe notre "cerveau" d'authentification
import { useAuthStore } from './stores/auth'

// On importe notre "cadre" visuel
import AppLayout from './components/AppLayout.vue'

// On récupère une instance du cerveau pour pouvoir l'utiliser
const authStore = useAuthStore()

// Dès que l'application est prête, on lance l'action pour récupérer l'utilisateur.
// C'est ce code qui permet de "se souvenir" de l'utilisateur à chaque rechargement.
onMounted(() => {
  authStore.fetchUser()
})
</script>

<template>
  <!-- On affiche notre cadre visuel -->
  <AppLayout>
    <!-- Et à l'intérieur du cadre, on affiche la page active -->
    <RouterView />
  </AppLayout>
</template>

<style scoped>
/* Ce fichier n'a plus besoin de style, le layout s'en charge. */
</style>
