import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios' // On importe axios pour faire nos appels API

// On définit notre store 'auth'
export const useAuthStore = defineStore('auth', () => {
  
  // === 1. L'ÉTAT (STATE) ===
  const user = ref(null) // Stockera les infos de l'utilisateur (nom, avatar...)
  
  // On lit le token depuis le localStorage au démarrage.
  // Si le token existe, il sera stocké ici, sinon ce sera `null`.
  const token = ref(localStorage.getItem('auth_token'))


  // === 2. LES "GETTERS" ===
  // L'indicateur "Connecté ?"
  const isLoggedIn = computed(() => !!user.value)


  // === 3. LES ACTIONS ===

  /**
   * Récupère les informations de l'utilisateur depuis l'API en utilisant le token.
   */
  const fetchUser = async () => {
    if (token.value) {
      try {
        // On configure axios pour qu'il envoie TOUJOURS le token dans les en-têtes.
        // C'est comme montrer son "bracelet de festival" à chaque requête.
        const response = await axios.get('http://127.0.0.1:8000/api/user', {
          headers: {
            'Authorization': `Bearer ${token.value}`
          }
        })
        
        // Si l'appel réussit, on met à jour l'état `user` avec les données reçues.
        user.value = response.data

      } catch (error) {
        // Si le token est invalide ou expiré, l'API renverra une erreur.
        // On nettoie tout pour déconnecter l'utilisateur.
        console.error("Erreur lors de la récupération de l'utilisateur:", error)
        user.value = null
        token.value = null
        localStorage.removeItem('auth_token')
      }
    }
  }

  // On rend tout ça accessible au reste de l'application
  return { user, token, isLoggedIn, fetchUser }
})