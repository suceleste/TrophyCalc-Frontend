<script setup lang="ts">
import { ref, onMounted } from 'vue';

// On crée une variable pour savoir si le bandeau doit être montré
const showBanner = ref(false);

// Au démarrage du composant...
onMounted(() => {
  // On vérifie si un choix a DÉJÀ été fait
  if (!localStorage.getItem('cookie_consent_level')) {
    // Si non, on affiche le bandeau
    showBanner.value = true;
  } else {
    // Si un choix a déjà été fait (ex: 'all'), on charge les scripts
    if (localStorage.getItem('cookie_consent_level') === 'all') {
      loadAnalyticsScripts();
    }
  }
});

// Fonction appelée quand on accepte TOUT
const acceptAll = () => {
  localStorage.setItem('cookie_consent_level', 'all');
  showBanner.value = false;
  loadAnalyticsScripts(); // On charge les scripts d'analyse
  console.log('Consentement "Tout accepter" donné.');
};

// Fonction appelée quand on accepte seulement le minimum
const acceptNecessary = () => {
  localStorage.setItem('cookie_consent_level', 'necessary');
  showBanner.value = false;
  // On ne charge PAS les scripts d'analyse
  console.log('Consentement "Nécessaires" donné.');
};

// Fonction qui chargera Google Analytics (quand on l'ajoutera)
const loadAnalyticsScripts = () => {
  console.log('CHARGEMENT DE GOOGLE ANALYTICS... (logique à ajouter)');
  // C'est ici qu'on ajoutera l'initialisation de 'vue-gtag-next'
  // Mais pour l'instant, on se contente de le simuler.
};
</script>

<template>
  <div v-if="showBanner" class="fixed bottom-0 left-0 right-0 z-50 p-4">
    <div class="container mx-auto max-w-4xl bg-gray-800/90 backdrop-blur-lg
                border-t-2 border-purple-500/50 shadow-2xl shadow-purple-500/20
                rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-5">

      <p class="text-sm text-slate-300 flex-grow">
        Nous utilisons des cookies essentiels pour votre session et, si vous l'acceptez,
        des cookies d'analyse (comme Google Analytics) pour améliorer le site.
      </p>

      <div class="flex-shrink-0 flex gap-4">
        <button
          @click="acceptNecessary"
          class="bg-gray-700 text-slate-300 font-bold py-2 px-5 rounded-lg
                 hover:bg-gray-600 transition-colors"
        >
          Refuser (Nécessaires)
        </button>
        <button
          @click="acceptAll"
          class="bg-purple-600 text-white font-bold py-2 px-5 rounded-lg
                 hover:bg-purple-700 transition-colors"
        >
          Tout Accepter
        </button>
      </div>
    </div>
  </div>
</template>
