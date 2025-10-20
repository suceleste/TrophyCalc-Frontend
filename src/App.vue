<script setup lang="ts">
// Plus besoin de onMounted ou useAuthStore ici !
import { RouterView } from 'vue-router'
import AppLayout from './components/AppLayout.vue'
</script>

<template>
  <AppLayout>
    <RouterView />
  </AppLayout>
</template>
