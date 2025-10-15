<template>
  <div class="achievements-container">
    <button @click="router.back()" class="btn-back">← Retour au Profil</button>
    
    <div v-if="loading" class="loading-message">
      Chargement des trophées pour {{ gameName }}...
    </div>

    <div v-else-if="!error">
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

    <p v-else class="error-message">
      Erreur : {{ error }}
      <span v-if="!loading && totalCount === 0"> (Ce jeu n'a peut-être pas de succès publics.)</span>
    </p>
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
  // Récupère les props passées par l'URL
  props: {
    steamId: { type: String, required: true },
    appId: { type: String, required: true },
  },
  setup() {
    return {
      router: useRouter(),
      backendBaseUrl: 'http://localhost:8000/api', // <-- ALIGNÉ sur localhost
    };
  },
  data() {
    return {
      gameName: 'Jeu...',
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
        const response = await axios.get(`${this.backendBaseUrl}/user/${this.steamId}/achievements/${this.appId}`);
        const data = response.data;
        
        if (data.status === 'info') {
            this.error = data.message;
            this.gameName = data.game_name;
            return;
        }

        this.gameName = data.game_name;
        this.achievements = data.achievements;
        this.unlockedCount = data.unlocked_count;
        this.totalCount = data.total_count;
        this.percentage = data.pourcentage;

      } catch (err: any) {
        console.error("Erreur de récupération des succès:", err);
        this.error = "Impossible de charger les données de succès pour ce jeu.";
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
}
.btn-back {
  background: none;
  border: 1px solid #66c0f4;
  color: #66c0f4;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;
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
    color: #a3ff78; /* Vert vif pour les succès */
}
.achievement-card {
  display: flex;
  align-items: center;
  background-color: #2a2e33;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 10px;
  border-left: 5px solid transparent;
  transition: border-left-color 0.3s;
}
.achievement-card.unlocked {
  border-left-color: #a3ff78;
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
</style>