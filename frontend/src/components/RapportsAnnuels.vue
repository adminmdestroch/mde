<script setup>
import { ref, onMounted } from "vue";

const couleurs = ["btn-primary", "btn-secondary", "btn-warning"];
const rapports = ref([]);
const chargementTermine = ref(false);
const erreurChargement = ref(false);

onMounted(async () => {
  try {
    const reponse = await fetch("/api/rapports-annuels");
    if (!reponse.ok) {
      throw new Error(`La liste des rapports n'a pas pu être chargée (${reponse.status}).`);
    }

    const fichiers = await reponse.json();
    if (!Array.isArray(fichiers)) {
      throw new Error("La réponse de la liste des rapports est invalide.");
    }

    rapports.value = fichiers
      .map((fichier) => {
        if (typeof fichier?.nom !== "string" || typeof fichier?.url !== "string") {
          return null;
        }

        const anneeMatch = fichier.nom.match(/(\d{4}-\d{4}|\d{4})/);
        return {
          url: fichier.url,
          annee: anneeMatch ? anneeMatch[1] : null,
        };
      })
      .filter(Boolean)
      .sort((a, b) => (b.annee || "").localeCompare(a.annee || ""));
  } catch (erreur) {
    console.error(erreur);
    rapports.value = [];
    erreurChargement.value = true;
  } finally {
    chargementTermine.value = true;
  }
});
</script>

<template>
  <div class="row g-3">
    <div v-for="(rapport, i) in rapports" :key="rapport.url" class="col-md-4">
      <a :href="rapport.url" target="_blank" rel="noopener" class="btn w-auto" :class="couleurs[i % couleurs.length]">
        <i class="icone-couleur icone-fleche" aria-hidden="true"></i>

        Rapport annuel{{ rapport.annee ? " " + rapport.annee : "" }}
      </a>
    </div>
    <p v-if="erreurChargement" class="text-danger">Les rapports annuels ne peuvent pas être chargés pour le moment.</p>
    <p v-else-if="chargementTermine && rapports.length === 0" class="text-muted">Aucun rapport annuel n'est disponible pour le moment.</p>
  </div>
</template>
