<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth' // <-- 1. ON IMPORTE NOTRE STORE

// On prépare nos outils
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore() // <-- 2. ON RÉCUPÈRE LE STORE

onMounted(async () => { // <-- On rend la fonction 'async' pour pouvoir attendre
  const token = route.query.token

  if (token && typeof token === 'string') {
    // On stocke le token
    localStorage.setItem('auth_token', token)
    
    // On met à jour le token dans notre store
    authStore.token = token 

    // ==========================================================
    // 3. LA LIGNE QUI CHANGE TOUT : ON FORCE LA MISE À JOUR
    await authStore.fetchUser() 
    // ==========================================================

    // Maintenant que le store est à jour, on redirige
    router.push({ name: 'Home' })

  } else {
    console.error("Aucun token trouvé, redirection vers l'accueil.")
    router.push({ name: 'Home' })
  }
})
</script>

<template>
  <div>
    <h1>Connexion en cours...</h1>
    <p>Vous allez être redirigé.</p>
  </div>
</template>