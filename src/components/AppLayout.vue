<script setup lang="ts">
import { useAuthStore } from '../stores/auth';
import { RouterLink } from 'vue-router';
import { ref } from 'vue'; // On importe ref pour la barre de recherche

const authStore = useAuthStore();
const searchQuery = ref(''); // Variable pour stocker la recherche
</script>

<template>
  <div class="bg-black text-slate-300 min-h-screen font-sans">

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
          Trophy<span class="text-purple-400">Calc</span>
        </RouterLink>

        <div class="hidden md:flex flex-grow max-w-xl mx-8">
          <div class="relative w-full">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Rechercher un jeu..."
              class="w-full bg-gray-800/50 border-2 border-gray-700 rounded-lg py-2 px-4 pl-10 text-white
                     placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition duration-300"
            />
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <div v-if="authStore.isLoggedIn && authStore.user" class="flex items-center space-x-3">
            <span class="font-semibold text-white hidden lg:block">{{ authStore.user.name }}</span>
            <div class="relative group">
              <img
                :src="authStore.user.avatar"
                class="w-14 h-14 rounded-lg border-2 border-gray-700
                       transition-all duration-300 ease-in-out
                       group-hover:border-purple-500 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(192,132,252,0.5)] cursor-pointer"
                alt="Avatar de l'utilisateur"
              />
              <span class="absolute -bottom-1.5 -right-1.5 bg-green-500 w-4 h-4 rounded-full border-2 border-black ring-1 ring-gray-700"></span>
              </div>
          </div>

          <div v-else>
            <a
              href="http://127.0.0.1:8000/api/auth/steam/redirect"
              class="inline-block rounded-md overflow-hidden
                     transition transform hover:scale-105 hover:shadow-[0_0_20px_rgba(192,132,252,0.6)] duration-300 ease-in-out"
            >
              <img src="https://community.akamai.steamstatic.com/public/images/signinthroughsteam/sits_02.png" alt="Se connecter via Steam">
            </a>
          </div>
        </div>
      </nav>
    </header>
    <main class="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <slot />
    </main>

  </div>
</template>
