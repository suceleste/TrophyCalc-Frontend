<script setup lang="ts">
import { computed } from 'vue';

// Assurez-vous que cette URL correspond à votre backend Laravel
const backendBaseUrl = 'http://127.0.0.1:8000/api'; 

const steamLoginUrl = computed(() => {
  return `${backendBaseUrl}/auth/steam/redirect`;
});
</script>

<template>
  <div class="home-container">
    <h1>Bienvenue sur TrophyCalc 🏆</h1>
    <p>Connectez-vous via Steam pour synchroniser vos trophées.</p>
    
    <a :href="steamLoginUrl" class="btn btn-steam">
      Se connecter avec Steam
    </a>
  </div>
</template>

<style scoped>
.home-container {
  text-align: center;
  padding: 50px;
}
.btn-steam {
  display: inline-block;
  padding: 10px 20px;
  background-color: #1b2838;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-weight: bold;
  margin-top: 20px;
  transition: background-color 0.3s;
}
.btn-steam:hover {
    background-color: #2a475e;
}
</style>