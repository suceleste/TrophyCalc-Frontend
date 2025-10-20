<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  console.log('[AuthCallback FINAL] Composant monté.');
  const tokenFromUrl = route.query.token;

  if (tokenFromUrl && typeof tokenFromUrl === 'string') {
    console.log('[AuthCallback FINAL] Token trouvé :', tokenFromUrl);

    // 1. Stocke le token via le store
    authStore.setToken(tokenFromUrl);
    console.log('[AuthCallback FINAL] Token stocké. Redirection vers dashboard...');

    // 2. Redirige vers le dashboard où App.vue prendra le relais
    router.push({ name: 'dashboard' });

  } else {
    console.error('[AuthCallback FINAL] ERREUR: Pas de token trouvé. Redirection vers home.');
    authStore.logout();
    router.push({ name: 'home' });
  }
});
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-950">
    <div class="text-center">
      <h1 class="text-2xl text-white mb-4 animate-pulse">Authentification en cours...</h1>
      <p class="text-slate-400">Veuillez patienter.</p>
    </div>
  </div>
</template>
