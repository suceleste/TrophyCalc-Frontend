<script setup lang="ts">
/**
 * Notre propre bandeau de cookies.
 * Il vérifie son propre item localStorage.
 * Il injecte le script Google Analytics MANUELLEMENT si l'utilisateur accepte.
 */
import { ref, onMounted } from 'vue';

// Notre propre clé de sauvegarde
const CONSENT_STORAGE_KEY = 'trophycalc_consent_given';
// L'ID de mesure (doit être dans ton .env)
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

const showBanner = ref(false);

/**
 * Vérifie si le consentement a été donné.
 * Si oui, charge GA. Si non, affiche le bandeau.
 */
onMounted(() => {
  const consent = localStorage.getItem(CONSENT_STORAGE_KEY);

  if (!consent) {
    // Si l'utilisateur n'a jamais fait de choix, on affiche le bandeau
    showBanner.value = true;
  } else if (consent === 'all') {
    // Si l'utilisateur a déjà accepté, on charge GA
    loadAnalyticsScripts();
  }
  // Si le consentement était 'necessary', on ne fait rien
});

/**
 * L'utilisateur a cliqué sur "Tout Accepter".
 */
const acceptAll = () => {
  localStorage.setItem(CONSENT_STORAGE_KEY, 'all');
  showBanner.value = false;
  loadAnalyticsScripts(); // On lance GA
  if (import.meta.env.DEV) console.log('[CookieBanner] Consentement "Tout accepter" donné.');
};

/**
 * L'utilisateur a cliqué sur "Refuser".
 */
const acceptNecessary = () => {
  localStorage.setItem(CONSENT_STORAGE_KEY, 'necessary');
  showBanner.value = false;
  if (import.meta.env.DEV) console.log('[CookieBanner] Consentement "Nécessaires" donné.');
};

/**
 * Fonction qui charge Google Analytics MANUELLEMENT
 * en injectant les balises <script> que tu as fournies.
 */
const loadAnalyticsScripts = () => {
  if (!GA_MEASUREMENT_ID) {
    console.error('VITE_GA_MEASUREMENT_ID n\'est pas défini dans le fichier .env');
    return;
  }
  // Vérifie si le script est déjà injecté (pour éviter les doublons)
  if (document.getElementById('gtag-script')) {
    if (import.meta.env.DEV) console.log('[CookieBanner] Google Analytics déjà chargé.');
    return;
  }

  if (import.meta.env.DEV) console.log('[CookieBanner] Chargement manuel de Google Analytics...');

  // 1. Crée la balise script principale
  const script1 = document.createElement('script');
  script1.id = 'gtag-script'; // On lui donne un ID pour le retrouver
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  // 2. Crée la balise script d'initialisation
  const script2 = document.createElement('script');
  script2.innerHTML = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', '${GA_MEASUREMENT_ID}');
  `;
  document.head.appendChild(script2);

  if (import.meta.env.DEV) console.log('[CookieBanner] Google Analytics chargé manuellement.');
};
</script>

<template>
  <div v-if="showBanner" class="fixed bottom-0 left-0 right-0 z-50 p-4">
    <div class="container mx-auto max-w-4xl bg-gray-800/90 backdrop-blur-lg
                border-t-2 border-purple-500/50 shadow-2xl shadow-purple-500/20
                rounded-lg p-6 flex flex-col sm:flex-row items-center justify-between gap-5">

      <p class="text-sm text-slate-300 flex-grow">
        Nous utilisons des cookies essentiels pour votre session et, si vous l'acceptez,
        des cookies d'analyse (Google Analytics) pour améliorer le site.
      </p>

      <div class="flex-shrink-0 flex gap-4">
        <button
          type="button"
          @click="acceptNecessary"
          class="bg-gray-700 text-slate-300 font-bold py-2 px-5 rounded-lg
                 hover:bg-gray-600 transition-colors"
        >
          Refuser (Nécessaires)
        </button>
        <button
          type="button"
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
