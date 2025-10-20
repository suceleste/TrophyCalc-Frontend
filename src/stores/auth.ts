import { ref, computed, watch } from 'vue' // <-- Ajoute 'watch'
import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('auth_token'))

  const isLoggedIn = computed(() => !!token.value && !!user.value)

  function setToken(newToken: string | null) {
    console.log('[AuthStore setToken] Mise à jour du token:', newToken); // Log
    token.value = newToken
    if (newToken) {
      localStorage.setItem('auth_token', newToken)
    } else {
      localStorage.removeItem('auth_token')
    }
  }

  async function fetchUser() {
    if (!token.value) {
      console.log('[AuthStore] fetchUser: Pas de token, annulation.');
      user.value = null
      return
    }

    try {
      console.log('[AuthStore] fetchUser: Appel API /user...');
      const response = await axios.get('http://127.0.0.1:8000/api/user', {
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Accept': 'application/json'
        }
      })
      user.value = response.data
      console.log('[AuthStore] fetchUser: Utilisateur récupéré:', user.value);
    } catch (error) {
      console.error('[AuthStore] fetchUser: ERREUR API !', error);
      setToken(null)
      user.value = null
    }
  }

  function logout() { /* ... */ }

  // ========================================================
  // OBSERVATEUR : Lance fetchUser si le token apparaît
  watch(token, (newToken) => {
    console.log('[AuthStore Watcher] Le token a changé:', newToken); // Log
    if (newToken && !user.value) { // Si on a un nouveau token ET pas encore d'utilisateur
      console.log('[AuthStore Watcher] Token présent, utilisateur absent => Appel fetchUser.'); // Log
      fetchUser();
    } else if (!newToken) { // Si le token disparaît (logout)
        user.value = null; // On s'assure que user est bien null
        console.log('[AuthStore Watcher] Token retiré, utilisateur mis à null.'); // Log
    }
  }, { immediate: true }) // immediate: true => lance le watch une fois au démarrage
  // ========================================================

  return { user, token, isLoggedIn, setToken, fetchUser, logout }
})
