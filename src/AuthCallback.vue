<template>
  <div class="loading-container">
    <h2>Validation de la connexion Steam en cours...</h2>
    <p v-if="error" class="error-message">Erreur : {{ error }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'AuthCallback',
  setup() {
    // Composition API (setup) pour TypeScript
    const router = useRouter();
    const backendBaseUrl = 'http://127.0.0.1:8000/api'; // <-- ADAPTEZ SI NÉCESSAIRE
    
    return {
      router,
      backendBaseUrl
    };
  },
  data() {
    return {
      error: null as string | null,
    };
  },
  mounted() {
    const queryString = window.location.search; 

    if (queryString) {
        this.handleSteamCallback(queryString);
    } else {
        this.error = "Erreur: Aucun paramètre de retour Steam trouvé.";
        this.redirectToHome();
    }
  },
  methods: {
    async handleSteamCallback(queryString: string) {
      try {
        // Envoi de la query string complète au backend Laravel pour vérification
        const response = await axios.get(`${this.backendBaseUrl}/auth/steam/callback${queryString}`);
        
        const steamId: string = response.data.steam_id;
        
        // Stockage de l'ID
        localStorage.setItem('steam_id_64', steamId);

        // Redirection vers la page de profil
        this.router.push({ name: 'Profile', params: { steamId: steamId } });

      } catch (err: any) {
        console.error('Erreur lors du Callback:', err.response ? err.response.data.message : err.message);
        this.error = err.response && err.response.data.message 
                     ? err.response.data.message 
                     : 'Échec de la vérification de la signature Steam.';
        
        localStorage.removeItem('steam_id_64'); 
        this.redirectToHome();
      }
    },
    redirectToHome() {
        // Rediriger après un court délai
        setTimeout(() => {
            this.router.push({ name: 'Home' });
        }, 3000);
    }
  }
});
</script>