<template>
  <div class="profile-container">
    <div v-if="loading" class="loading-message">
      Chargement du profil TrophyCalc...
    </div>

    <div v-if="profile.pseudo">
      <header class="profile-header">
        <img :src="profile.avatar" :alt="profile.pseudo" class="avatar">
        <h1>{{ profile.pseudo }}'s TrophyCalc Profile</h1>
        <p>SteamID: {{ steamId }}</p>
        <p>Bibliothèque : {{ games.length }} jeux</p>
      </header>

      <hr>

      <section class="game-list">
        <h2>Vos jeux (Classés par temps de jeu)</h2>
        <div class="game-cards-container">
          <div v-for="game in games" :key="game.app_id" class="game-card" 
               @click="viewAchievements(game.app_id)"
               :title="'Voir les trophées de ' + game.name">
            
            <img v-if="game.icon_url" :src="game.icon_url" :alt="game.name + ' icon'" class="game-icon">
            <div v-else class="game-icon-placeholder">🎮</div>

            <div class="game-info">
              <h3>{{ game.name }}</h3>
              <p class="playtime">{{ game.playtime_hours }} heures</p>
            </div>
          </div>
        </div>
      </section>
    </div>

    <p v-if="error" class="error-message">Erreur de chargement des données: {{ error }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

// Définition simple des types de données pour TypeScript
interface SteamProfile {
  pseudo: string;
  avatar: string;
  url: string;
}

interface Game {
  app_id: string;
  name: string;
  playtime_hours: number;
  icon_url: string | null;
}

export default defineComponent({
  name: 'Profile',
  // Récupère le steamId passé dans l'URL par le routeur
  props: {
    steamId: {
      type: String,
      required: true
    }
  },
  setup() {
    return {
      router: useRouter(),
      backendBaseUrl: 'http://127.0.0.1:8000/api', // <-- ADAPTEZ CETTE URL
    };
  },
  data() {
    return {
      profile: {} as SteamProfile,
      games: [] as Game[],
      loading: true,
      error: null as string | null,
    };
  },
  mounted() {
    // Appelle les fonctions de récupération des données au chargement de la page
    this.fetchAllData();
  },
  methods: {
    async fetchAllData() {
      this.loading = true;
      try {
        // Appel A: Récupération du Profil
        const profileResponse = await axios.get(`${this.backendBaseUrl}/user/${this.steamId}/profile`);
        this.profile = profileResponse.data;

        // Appel B: Récupération des Jeux
        const gamesResponse = await axios.get(`${this.backendBaseUrl}/user/${this.steamId}/games`);
        this.games = gamesResponse.data.games;

      } catch (err: any) {
        console.error("Erreur de récupération des données:", err);
        this.error = "Impossible de charger les données du profil ou de la bibliothèque.";
        // Si l'erreur est critique (ex: ID invalide), on déconnecte
        localStorage.removeItem('steam_id_64');
        // this.router.push({ name: 'Home' }); 
      } finally {
        this.loading = false;
      }
    },
    viewAchievements(appId: string) {
      // Naviguer vers la nouvelle route GameAchievements
      this.router.push({ 
        name: 'GameAchievements', 
        params: { 
          steamId: this.steamId, 
          appId: appId 
        } 
      });
    }
  }
});
</script>

<style scoped>
.profile-container {
  max-width: 1000px;
  margin: 40px auto;
  padding: 20px;
  border: 1px solid #333;
  border-radius: 8px;
  background-color: #1e2023;
  color: #c7d2e3;
}
.profile-header {
  text-align: center;
  margin-bottom: 20px;
}
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid #66c0f4;
}
.game-list {
  margin-top: 30px;
}
.game-cards-container {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 15px;
}
.game-card {
  width: calc(33% - 15px); /* 3 colonnes */
  background-color: #2a2e33;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.game-card:hover {
  background-color: #383c42;
}
.game-icon {
  width: 40px;
  height: 40px;
  border-radius: 4px;
}
.game-icon-placeholder {
    width: 40px;
    height: 40px;
    background-color: #444;
    text-align: center;
    line-height: 40px;
    font-size: 20px;
    border-radius: 4px;
}
.playtime {
  font-size: 0.9em;
  color: #a0aec0;
}
</style>