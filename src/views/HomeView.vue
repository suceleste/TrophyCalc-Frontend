<script setup lang="ts">
  import { useSeoMeta } from '@unhead/vue'

  useSeoMeta({
    title: 'TrophyCalc - Accueil',
    description: 'Analysez votre profil Steam, calculez votre score XP réel basé sur la rareté des succès, et grimpez dans le classement des chasseurs de trophées.',
    ogTitle: 'TrophyCalc - Boostez votre profil Steam',
    ogDescription: 'Vos succès rares valent enfin de l\'XP. Venez calculer votre score.' ,
    ogType: 'website'
  })
</script>

<template>
  <div class="space-y-16 md:space-y-24 py-16 md:py-24">

    <section class="text-center px-4">
      <h1 class="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight mb-6">
        <span class="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500">
          Dominez vos Succès Steam.
        </span>
        <br />
        <span class="text-slate-400">Révélez le Vrai Joueur en Vous.</span>
      </h1>
      <p class="max-w-3xl mx-auto text-lg md:text-xl text-slate-400 mb-10">
        TrophyCalc transforme votre profil Steam en un tableau de bord puissant. Suivez votre progression, analysez vos habitudes et comparez-vous à la communauté.
      </p>
      <div class="text-sm text-slate-500">(Connectez-vous via Steam en haut à droite pour commencer)</div>
    </section>

    <section class="container mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-4xl font-bold text-center text-white mb-12">Fonctionnalités Principales</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">

        <div class="bg-gray-800/50 border border-purple-500/30 rounded-xl p-6 shadow-lg shadow-purple-500/10 transform transition-transform hover:scale-105 hover:border-purple-500/60">
          <h3 class="text-2xl font-semibold text-white mb-3">Analyse Détaillée</h3>
          <p class="text-slate-400">
            Visualisez vos taux de complétion par jeu, découvrez vos succès les plus rares et suivez votre temps de jeu. (Bientôt disponible)
          </p>
        </div>

        <div class="bg-gray-800/50 border border-purple-500/30 rounded-xl p-6 shadow-lg shadow-purple-500/10 transform transition-transform hover:scale-105 hover:border-purple-500/60">
          <h3 class="text-2xl font-semibold text-white mb-3">Bibliothèque Interactive</h3>
          <p class="text-slate-400">
            Naviguez dans votre bibliothèque de jeux, filtrez par genre ou par progression, et accédez rapidement aux succès. (En cours)
          </p>
        </div>

        <div class="bg-gray-800/50 border border-purple-500/30 rounded-xl p-6 shadow-lg shadow-purple-500/10 transform transition-transform hover:scale-105 hover:border-purple-500/60">
          <h3 class="text-2xl font-semibold text-white mb-3">Profil & Comparaison</h3>
          <p class="text-slate-400">
            Créez votre profil TrophyCalc, partagez vos statistiques et comparez votre progression avec vos amis. (Bientôt disponible)
          </p>
        </div>
      </div>
    </section>

    <section class="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
       <h2 class="text-4xl font-bold text-white mb-12">Comment ça Marche ?</h2>
       <div class="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-12">

           <div class="flex flex-col items-center max-w-xs">
               <div class="bg-purple-600/30 text-purple-300 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold border-2 border-purple-500 mb-4">1</div>
               <h3 class="text-xl font-semibold text-white mb-2">Connectez Steam</h3>
               <p class="text-slate-400">Utilisez le bouton en haut pour vous connecter de manière sécurisée via votre compte Steam.</p>
           </div>

           <div class="text-purple-500 text-2xl hidden md:block">&rarr;</div>

           <div class="flex flex-col items-center max-w-xs">
               <div class="bg-purple-600/30 text-purple-300 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold border-2 border-purple-500 mb-4">2</div>
               <h3 class="text-xl font-semibold text-white mb-2">Explorez Votre Profil</h3>
               <p class="text-slate-400">Accédez à votre tableau de bord et visualisez votre bibliothèque de jeux synchronisée.</p>
           </div>

           <div class="text-purple-500 text-2xl hidden md:block">&rarr;</div>

           <div class="flex flex-col items-center max-w-xs">
               <div class="bg-purple-600/30 text-purple-300 rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold border-2 border-purple-500 mb-4">3</div>
               <h3 class="text-xl font-semibold text-white mb-2">Analysez vos Succès</h3>
               <p class="text-slate-400">Plongez dans les détails de chaque jeu et découvrez vos statistiques de trophées. (Bientôt !)</p>
           </div>
       </div>
    </section>

    </div>
</template>

<style scoped>
/* Plus besoin de CSS ici non plus ! */
</style>
