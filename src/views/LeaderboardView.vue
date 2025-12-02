<script setup lang="ts">

import { ref, onMounted } from 'vue';
import axios from 'axios';
import type { LeaderboardUser } from '@/types/index';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const users = ref<LeaderboardUser[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);

const fetchLeaderboard = async () => {
  loading.value = true;
  error.value = null;
  try{
    const apiUrl = `${API_BASE_URL}/leaderboard`;

    if (import.meta.env.DEV) {
      console.log('[Leaderboard] Call API: ${apiUrl}');
    }

    const response = await axios.get<LeaderboardUser[]>(apiUrl, {
      headers: { 'Accept': 'application/json'}
    });

    users.value = response.data;

  }catch (err: unknown) {
    console.log("[Leaderboard] Error: ", err);
    if (axios.isAxiosError(err) && err.response) {
      error.value = `Erreur API (${err.response.status}): ${err.response.data.message || 'Impossible de charger le classement.'}`;
    } else {
      error.value = "Erreur réseau ou impossible de contacter l'API.";
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchLeaderboard();
});

</script>

<template>
  <div class="py-16 md:py-24">
    <section class="container mx-auto px-4 sm:px-6 lg:px-8">

      <h1 class="text-5xl sm:text-6xl font-extrabold text-white text-center mb-16">
        <span class="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500">
          🏆 Classement
        </span>
      </h1>

      <div v-if="loading" class="text-center py-10">
        <p class="text-slate-400 animate-pulse text-lg">Chargement du classement...</p>
      </div>

      <div v-else-if="error" class="bg-yellow-900/50 border border-yellow-500/50 text-yellow-300 p-4 rounded-lg max-w-2xl mx-auto">
        <p class="font-semibold">Erreur :</p>
        <p>{{ error }}</p>
      </div>

      <div v-else-if="users.length > 0" class="max-w-4xl mx-auto">
        <ol class="space-y-4">

          <li
            v-for="(user, index) in users"
            :key="user.id"

            class="bg-gray-800/50 border border-purple-500/30 rounded-xl p-4 sm:p-6 shadow-lg shadow-purple-500/10
                   flex items-center justify-between space-x-4
                   transition-all duration-300 hover:bg-gray-700/50 hover:border-purple-500/50"
          >
            <div class="flex items-center space-x-4 sm:space-x-6 min-w-0">

              <div class="flex-shrink-0 bg-purple-600/30 text-purple-300 rounded-full
                          w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center
                          text-xl sm:text-2xl font-bold border-2 border-purple-500">
                {{ index + 1 }}
              </div>
              <a :href="'/profile/' + user.steam_id_64">
                <div class="flex items-center space-x-4 min-w-0">
                  <img :src="user.avatar" alt="Avatar" class="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-slate-700 flex-shrink-0">
                  <div class="min-w-0">
                    <p class="text-lg sm:text-xl font-bold text-white truncate" :title="user.name">{{ user.name }}</p>
                    <p class="text-sm text-slate-400">{{ user.games_completed }} jeux complétés</p>
                  </div>
                </div>
              </a>
            </div>

            <div class="flex-shrink-0 text-right">
              <p class="text-2xl sm:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                {{ (user.total_xp || 0).toLocaleString() }} XP
              </p>
            </div>
          </li>

        </ol>
      </div>

      <div v-else class="text-center py-10">
        <p class="text-slate-400 text-lg">Personne n'est encore dans le classement.</p>
        <p class="text-slate-500 text-sm mt-2">Visitez les pages de vos jeux et actualisez votre profil pour calculer votre score !</p>
      </div>

    </section>
  </div>
</template>
