import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import type { User } from '@/types/index'; // Importe le "contrat" User

// Récupère l'URL de base de l'API depuis les variables d'environnement (.env)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Store Pinia pour gérer l'état d'authentification de l'utilisateur.
 */
export const useAuthStore = defineStore('auth', () => {

  // --- STATE ---

  /**
   * Les informations de l'utilisateur connecté.
   * Utilise l'interface 'User' pour un typage strict.
   */
  const user = ref<User | null>(null);

  /**
   * Le token d'authentification (jeton Bearer).
   * Initialisé depuis le localStorage pour la persistance.
   */
  const token = ref<string | null>(localStorage.getItem('auth_token'));


  // --- GETTERS (Propriétés Calculées) ---

  /**
   * Indique si l'utilisateur est actuellement authentifié.
   * On vérifie qu'on a à la fois un token ET les infos utilisateur.
   */
  const isLoggedIn = computed(() => !!token.value && !!user.value);


  // --- ACTIONS (Fonctions) ---

  /**
   * Met à jour le token dans le store et dans le localStorage.
   * @param {string | null} newToken - Le nouveau token, ou null pour effacer.
   */
  function setToken(newToken: string | null) {
    if (import.meta.env.DEV) { // Log uniquement en développement
      console.log(`[AuthStore:setToken] Mise à jour du token.`);
    }
    token.value = newToken;
    if (newToken) {
      localStorage.setItem('auth_token', newToken);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  /**
   * Récupère les infos de l'utilisateur depuis l'API (/api/user)
   * en utilisant le token stocké.
   */
  async function fetchUser() {
    if (!token.value) {
      if (import.meta.env.DEV) {
        console.log('[AuthStore:fetchUser] Annulation : Pas de token trouvé.');
      }
      user.value = null;
      return;
    }

    try {
      const apiUrl = `${API_BASE_URL}/user`;
      if (import.meta.env.DEV) {
        console.log(`[AuthStore:fetchUser] Appel de l'API : ${apiUrl}`);
      }

      const response = await axios.get<User>(apiUrl, { // On dit à Axios qu'on attend un objet User
        headers: {
          'Authorization': `Bearer ${token.value}`,
          'Accept': 'application/json'
        }
      });

      user.value = response.data; // response.data est maintenant de type 'User'
      if (import.meta.env.DEV) {
        console.log('[AuthStore:fetchUser] Utilisateur récupéré avec succès:', user.value);
      }

    } catch (error) {
      console.error('[AuthStore:fetchUser] ERREUR API ! Token invalide ou expiré.', error);
      // On déconnecte l'utilisateur si l'appel échoue
      logout();
    }
  }

  /**
   * Déconnecte l'utilisateur en effaçant son état et son token.
   */
  function logout() {
    if (import.meta.env.DEV) {
      console.log('[AuthStore:logout] Déconnexion...');
    }
    setToken(null); // Efface le token du store et du localStorage
    user.value = null; // Efface les données utilisateur du store
  }


  // --- OBSERVATEUR (Watch) ---

  /**
   * Surveille le 'token'.
   * Déclenche fetchUser au démarrage si un token existe,
   * ou quand le token est défini par le callback.
   */
  watch(token, (newToken) => {
    if (import.meta.env.DEV) {
      console.log(`[AuthStore:Watcher] Le token a changé : ${newToken ? 'PRÉSENT' : 'NULL'}`);
    }

    // Si on a un nouveau token ET qu'on n'a pas encore chargé l'utilisateur
    if (newToken && !user.value) {
      if (import.meta.env.DEV) {
        console.log('[AuthStore:Watcher] Token présent, utilisateur absent => Appel fetchUser.');
      }
      fetchUser();
    }
    // Si le token a été retiré (logout)
    else if (!newToken) {
      user.value = null;
      if (import.meta.env.DEV) {
        console.log('[AuthStore:Watcher] Token retiré, utilisateur mis à null.');
      }
    }
  }, { immediate: true }) // 'immediate: true' lance ce watcher une fois au démarrage.


  // --- EXPORTATIONS ---

  return {
    // État
    user,
    token,
    // Getters
    isLoggedIn,
    // Actions
    setToken,
    fetchUser,
    logout
  }
})
