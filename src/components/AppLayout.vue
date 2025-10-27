<script setup lang="ts">
/**
 * Layout principal de l'application.
 * Gère l'affichage de la barre de navigation, le menu utilisateur,
 * la recherche globale (desktop + mobile modal) et le pied de page.
 */
import { useAuthStore } from '@/stores/auth'; // Utilise l'alias @/
import { RouterLink, useRouter } from 'vue-router';
import { ref } from 'vue';

// Récupère le store Pinia pour l'état d'authentification
const authStore = useAuthStore();
// Variable locale pour le champ de recherche (utilisée par les deux barres)
const searchQuery = ref('');
// Outil pour la redirection (utilisé par la déconnexion et la recherche)
const router = useRouter();

// État pour contrôler l'ouverture du modal de recherche sur mobile
const isSearchModalOpen = ref(false);
  
// --- On récupère l'URL de base de l'API ---
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// On construit l'URL de connexion Steam
const steamLoginUrl = `${API_BASE_URL}/auth/steam/redirect`;
  
/**
 * Gère la déconnexion de l'utilisateur.
 * Appelle l'action logout du store et redirige vers l'accueil.
 */
const handleLogout = () => {
  if (import.meta.env.DEV) console.log('[AppLayout] Déconnexion...');
  authStore.logout();
  router.push({ name: 'home' });
};

/**
 * Gère la soumission de la recherche (desktop et mobile).
 * Redirige vers la page des résultats de recherche si la requête est valide.
 */
const performSearch = () => {
  const query = searchQuery.value.trim();
  if (query.length >= 3) {
    if (import.meta.env.DEV) console.log(`[AppLayout] Navigation vers la recherche globale pour : "${query}"`);

    // Redirige vers la page de résultats en passant la query comme paramètre d'URL
    router.push({ name: 'search-results', query: { q: query } });

    // Nettoie et ferme le modal (si ouvert)
    isSearchModalOpen.value = false;
    searchQuery.value = ''; // Vide la barre après la recherche
  } else {
    if (import.meta.env.DEV) console.log("[AppLayout] Terme de recherche trop court (minimum 3 caractères).");
    // Optionnel : on pourrait afficher un message d'erreur dans le modal
  }
};
</script>

<template>
  <div class="bg-black text-slate-300 min-h-screen font-sans flex flex-col">

    <header
      class="bg-black/60 backdrop-blur-xl sticky top-0 z-50
             border-b-2 border-purple-600/50 shadow-2xl shadow-purple-600/20"
    >
      <nav class="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-24">

        <RouterLink
          :to="{ name: authStore.isLoggedIn ? 'dashboard' : 'home' }"
          class="text-4xl font-extrabold tracking-tighter text-white transition-all duration-300 ease-in-out
                 hover:text-purple-400 hover:drop-shadow-[0_0_15px_rgba(192,132,252,0.7)]"
        >
          <img src="/favicon.png" alt="TrophyCalc Logo" class="h-10 w-auto">
        </RouterLink>

        <div class="hidden md:flex flex-grow max-w-xl mx-8">
          <div class="relative w-full">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Rechercher un jeu Steam..."
              aria-label="Rechercher un jeu sur Steam"
              @keyup.enter="performSearch"
              class="w-full bg-gray-800/50 border-2 border-gray-700 rounded-lg py-2 px-4 pl-10 text-white
                     placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-300"
            />
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div class="flex items-center space-x-2 sm:space-x-4">

          <button
            @click="isSearchModalOpen = true"
            class="md:hidden p-2 rounded-full text-slate-300 hover:text-white hover:bg-gray-700/50 transition-colors"
            aria-label="Ouvrir la recherche"
          >
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <div v-if="authStore.isLoggedIn && authStore.user" class="relative group">
            <div class="flex items-center space-x-3 cursor-pointer">
              <span class="font-semibold text-white hidden lg:block">{{ authStore.user.name }}</span>
              <div class="relative">
                <img
                  :src="authStore.user.avatar"
                  class="w-14 h-14 rounded-lg border-2 border-gray-700
                         transition-all duration-300 ease-in-out
                         group-hover:border-purple-500 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(192,132,252,0.5)]"
                  alt="Avatar de l'utilisateur"
                />
                <span class="absolute -bottom-1.5 -right-1.5 bg-green-500 w-4 h-4 rounded-full border-2 border-black ring-1 ring-gray-700"></span>
              </div>
            </div>

            <div
              class="absolute top-full right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5
                     opacity-0 invisible group-hover:opacity-100 group-hover:visible
                     transition-all duration-200 ease-in-out z-50"
            >
              <RouterLink
                :to="{ name: 'dashboard' }"
                class="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-gray-700 hover:text-white transition-colors duration-150"
                active-class="bg-purple-600/30 text-purple-300"
              >
                Tableau de Bord
              </RouterLink>
               <RouterLink
                :to="{ name: 'my-games' }"
                class="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-gray-700 hover:text-white transition-colors duration-150"
                active-class="bg-purple-600/30 text-purple-300"
              >
                Mes Jeux
              </RouterLink>
              <div class="border-t border-gray-700 my-1"></div>
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-600/20 hover:text-red-300 transition-colors duration-150"
              >
                Se déconnecter
              </button>
            </div>
          </div>

          <div v-else>
            <a
              :href="steamLoginUrl"
              class="inline-block rounded-md overflow-hidden
                     transition transform hover:scale-105 hover:shadow-[0_0_20px_rgba(192,132,252,0.6)] duration-300 ease-in-out"
            >
              <img src="https://community.akamai.steamstatic.com/public/images/signinthroughsteam/sits_02.png" alt="Se connecter via Steam">
            </a>
          </div>
        </div>
      </nav>
    </header>

    <main class="container mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow">
      <slot /> </main>

    <footer class="bg-gray-900/50 border-t border-purple-500/20 mt-16 py-8">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
        <p>&copy; {{ new Date().getFullYear() }} TrophyCalc. Tous droits réservés.</p>
        <p class="mt-2">
          Ce site n'est pas affilié à Valve Corporation. Steam et le logo Steam sont des marques déposées de Valve Corporation.
        </p>
        <nav class="mt-4 space-x-4">
          <RouterLink :to="{ name: 'legal' }" class="hover:text-purple-400 transition-colors">
            Mentions Légales & Confidentialité
          </RouterLink>
        </nav>
      </div>
    </footer>

    <div v-if="isSearchModalOpen" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-center p-4 pt-[15vh]">
      <div class="w-full max-w-xl">
        <div class="relative w-full">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Rechercher un jeu Steam..."
            aria-label="Rechercher un jeu sur Steam"
            @keyup.enter="performSearch"
            class="w-full bg-gray-800 border-2 border-purple-500 rounded-lg py-3 px-5 pl-12 text-white text-lg
                   placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 transition duration-300"
          />
          <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          @click="isSearchModalOpen = false"
          class="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
          aria-label="Fermer la recherche"
        >
          <svg class="h-8 w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Force le layout à prendre toute la hauteur pour pousser le footer */
.min-h-screen {
  display: flex;
  flex-direction: column;
}
main {
  flex-grow: 1;
}
</style>
