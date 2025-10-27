<script setup lang="ts">
import { useAuthStore } from '../stores/auth';
import { RouterLink } from 'vue-router';

const authStore = useAuthStore();
</script>

<template>
  <div class="bg-black text-slate-300 min-h-screen font-mono">
    
    <header 
      class="bg-black/50 backdrop-blur-lg sticky top-0 z-50 
             border-b border-cyan-500/30 shadow-lg shadow-cyan-500/10"
    >
      <nav class="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
        
        <RouterLink 
          :to="{ name: authStore.isLoggedIn ? 'dashboard' : 'home' }" 
          class="text-3xl font-bold tracking-widest text-white transition-all duration-300 hover:text-cyan-400 hover:drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]"
        >
          Trophy<span class="text-cyan-400">Calc</span>
        </RouterLink>
        
        <div>
          <div v-if="authStore.isLoggedIn && authStore.user" class="flex items-center space-x-4">
            <span class="font-medium text-white">{{ authStore.user.name }}</span>
            <div class="relative">
              <img 
                :src="authStore.user.avatar" 
                class="w-12 h-12 rounded-md border-2 border-slate-700 hover:border-cyan-500 transition-colors duration-300 cursor-pointer"
                alt="Avatar de l'utilisateur"
              />
              <span class="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-black"></span>
            </div>
            </div>
          
          <div v-else>
            <a 
              href="http://127.0.0.1:8000/api/auth/steam/redirect" 
              class="transition-transform transform hover:scale-105 inline-block"
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