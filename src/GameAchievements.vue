<template>
  <div class="achievements-container">
    <button @click="router.back()" class="btn-back">← Retour au Profil</button>
    
    <div v-if="loading" class="loading-message">
      Chargement des trophées pour {{ gameName }}...
    </div>

    <div v-else-if="error" class="error-box">
        <h2>Erreur de Chargement :</h2>
        <p class="error-message">{{ error }}</p>
        <p v-if="totalCount === 0" class="info-message">Ce jeu ne semble pas supporter les succès Steam ou les données sont privées.</p>
    </div>

    <div v-else>
      <header class="game-header">
        <h1>Trophées de {{ gameName }}</h1>
        <p class="summary">
          Statut : <span class="unlocked-count">{{ unlockedCount }}</span> / {{ totalCount }} débloqués ({{ percentage }}%)
        </p>
      </header>

      <section class="achievements-list">
        <div v-for="ach in achievements" :key="ach.name" class="achievement-card" :class="{ 'unlocked': ach.achieved }">
          <div class="status-icon">{{ ach.achieved ? '✅' : '🔒' }}</div>
          <div class="details">
            <h3>{{ ach.name }}</h3>
            <p>{{ ach.description }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

interface Achievement {
  name: string;
  description: string;
  achieved: boolean;
}

export default defineComponent({
  name: 'GameAchievements',
  props: {
    steamId: { type: String, required: true },
    appId: { type: String, required: true },
  },
  setup() {
    // Utiliser localhost car nous l'avons aligné dans le routeur et les composants
    return {
      router: useRouter(),
      backendBaseUrl: 'http://localhost:8000/api', 
    };
  },
  data() {
    return {
      gameName: 'Chargement...',
      achievements: [] as Achievement[],
      unlockedCount: 0,
      totalCount: 0,
      percentage: '0.00',
      loading: true,
      error: null as string | null,
    };
  },
  mounted() {
    this.fetchAchievements();
  },
  methods: {
    async fetchAchievements() {
      this.loading = true;
      this.error = null;
      try {
        // Appel à la route de succès : /user/{steamId}/achievements/{appId}
        const response = await axios.get(`${this.backendBaseUrl}/user/${this.steamId}/achievements/${this.appId}`);
        const data = response.data;
        
        // Gérer le cas où le backend renvoie un statut 'info' (jeu non supporté)
        if (data.status === 'info') {
            this.gameName = data.game_name;
            this.totalCount = 0; // Aucun succès n'est trouvé
            this.error = data.message;
            return;
        }

        this.gameName = data.game_name;
        this.achievements = data.achievements;
        this.unlockedCount = data.unlocked_count;
        this.totalCount = data.total_count;
        this.percentage = data.pourcentage;

      } catch (err: any) {
        console.error("Erreur de récupération des succès:", err);
         if (err.response) {
            this.error = `Erreur du serveur (${err.response.status}). Impossible de récupérer les trophées.`;
        } else {
            this.error = "Erreur de connexion au Backend.";
        }
      } finally {
        this.loading = false;
      }
    },
  }
});
</script>

<style scoped>
.achievements-container {
  max-width: 900px;
  margin: 40px auto;
  color: #c7d2e3;
}
.btn-back {
  background-color: #383c42;
  border: none;
  color: white;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
  transition: background-color 0.2s;
}
.btn-back:hover {
    background-color: #4f555e;
}
.game-header {
  text-align: center;
  border-bottom: 2px solid #333;
  padding-bottom: 15px;
  margin-bottom: 20px;
}
.summary {
    font-size: 1.2em;
    font-weight: bold;
}
.unlocked-count {
    color: #a3ff78;
}
.achievements-list {
    margin-top: 20px;
}
.achievement-card {
  display: flex;
  align-items: center;
  background-color: #2a2e33;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 10px;
  border-left: 5px solid transparent;
}
.achievement-card.unlocked {
  border-left-color: #a3ff78; /* Vert pour débloqué */
}
.status-icon {
  font-size: 1.5em;
  margin-right: 15px;
}
.details h3 {
  margin: 0;
  font-size: 1.1em;
}
.details p {
  margin: 5px 0 0;
  font-size: 0.9em;
  color: #a0aec0;
}
.error-box {
    padding: 20px;
    background-color: #4f1e1e;
    border: 1px solid #d62d2d;
    border-radius: 8px;
}
</style>