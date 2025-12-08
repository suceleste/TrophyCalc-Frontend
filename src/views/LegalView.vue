<script setup lang="ts">
  import { useSeoMeta } from '@unhead/vue'

  useSeoMeta({
    title: 'Mentions Légales & Confidentialité - TrophyCalc',
    description: 'Informations légales concernant l\'utilisation de TrophyCalc et l\'API Steam.',
    robots: 'noindex' // Généralement, on ne veut pas que cette page apparaisse en premier dans Google
  })
</script>

<template>
  <div class="space-y-10 max-w-4xl mx-auto">
    <section>
      <h1 class="text-4xl font-bold text-white mb-6 border-b border-purple-500/30 pb-3">Mentions Légales</h1>
      <div class="space-y-4 text-slate-300 prose prose-invert prose-slate max-w-none">
        <p>Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la confiance en l'économie numérique, il est précisé aux utilisateurs du site TrophyCalc l'identité des différents intervenants dans le cadre de sa réalisation et de son suivi.</p>

        <h2 class="text-white">Édition du site</h2>
        <p>Le présent site, accessible à l’URL TrophyCalc.com, est édité par :</p>
        <p>Suceleste.</p>

        <h2 class="text-white">Hébergement</h2>
        <p>Le site est hébergé par la société DigitalOcean, LLC, située au 101 Avenue of the Americas, 10th Floor, New York, NY 10013, États-Unis.</p>

        <h2 class="text-white">Contact</h2>
        <p><!--Par email : [TON_EMAIL_DE_CONTACT]--></p>
      </div>
    </section>

    <section>
      <h1 class="text-4xl font-bold text-white mb-6 border-b border-purple-500/30 pb-3">Politique de Confidentialité</h1>
      <div class="space-y-4 text-slate-300 prose prose-invert prose-slate max-w-none">
        <p>Date de dernière mise à jour : 24 octobre 2025</p>
        <p>Nous attachons une grande importance à la protection de vos données personnelles. Cette politique vise à vous informer sur la manière dont nous collectons, utilisons et protégeons vos données.</p>

        <h2 class="text-white">Données collectées</h2>
        <p>Lors de votre connexion via Steam, nous collectons et stockons les données publiques suivantes fournies par l'API Steam :</p>
        <ul>
          <li>Votre SteamID 64 (pour lier votre compte)</li>
          <li>Votre pseudo Steam (pour l'affichage)</li>
          <li>L'URL de votre avatar (pour l'affichage)</li>
          <li>L'URL de votre profil Steam</li>
        </ul>
        <p>Nous collectons également les données relatives à vos jeux et à vos succès Steam (listes, dates de déblocage, rareté) afin de fournir les fonctionnalités principales du site (calcul de statistiques, affichage de la progression).</p>

        <h2 class="text-white">Cookies</h2>
        <p>Nous utilisons deux types de cookies :</p>
        <ul>
          <li><strong>Cookies Essentiels :</strong> Un cookie (`auth_token`) est utilisé pour maintenir votre session de connexion sécurisée. Il est indispensable au fonctionnement du site.</li>
          <li><strong>Cookies d'Analyse (si acceptés) :</strong> Si vous donnez votre consentement, des cookies tiers (Google Analytics) sont utilisés pour mesurer l'audience et améliorer le site.</li>
        </ul>

        <h2 class="text-white">Utilisation des données</h2>
        <p>Vos données sont utilisées **uniquement** pour le bon fonctionnement de TrophyCalc. Elles ne sont ni vendues, ni partagées avec des tiers à des fins commerciales.</p>

        <h2 class="text-white">Vos droits</h2>
        <p>Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Vous pouvez exercer ce droit en nous contactant à (bientot...). La suppression de votre compte entraînera la suppression de toutes les données associées.</p>
      </div>
    </section>
  </div>
</template>

<style>
/* On utilise les styles de 'prose' de Tailwind pour formater le texte légal */
.prose-invert h2 {
  color: theme('colors.white');
}
.prose-invert ul {
  list-style-type: disc;
  padding-left: 1.5rem;
}
</style>
