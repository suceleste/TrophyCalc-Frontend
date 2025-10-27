<script setup lang="ts">
/**
 * Composant racine (principal) de l'application Vue.
 * Il charge le layout global, le point d'entrée du routeur (RouterView),
 * et le composant de consentement aux cookies.
 */
import { RouterView } from 'vue-router';
import AppLayout from '@/components/AppLayout.vue';
import CookieBanner from '@/components/CookieBanner.vue'; // <-- On importe notre composant
</script>

<template>
  <AppLayout>
    <RouterView />
  </AppLayout>

  <CookieBanner />

</template>

<style>
</style>
