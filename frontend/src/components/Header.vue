<script setup>
// Détermine le lien actif selon la page réellement chargée (site multi-pages, pas de routeur SPA)
const navItems = [
  { label: "La Maison", href: "/" },
  { label: "Nos services", href: "/services.html" },
  { label: "Nous soutenir", href: "/soutenir.html" },
  { label: "Bénévolat et emplois", href: "/benevolat-emploi.html" },
  { label: "Publications", href: "/publications.html" },
  { label: "Nous joindre", href: "/joindre.html" },
];

function normalize(pathname) {
  return pathname.replace(/index\.html$/, "").replace(/\/+$/, "") || "/";
}

const currentPath = normalize(window.location.pathname);

function isActive(href) {
  if (href === "#") return false;
  return normalize(new URL(href, window.location.origin).pathname) === currentPath;
}
</script>

<template>
<header class="sticky-top">

  <!-- 1. BLOC LOGO : Reste sur fond blanc et s'aligne à gauche comme avant -->
  <div class="bg-white py-3">
    <div class="container-fluid p-4">
      <a href="/">
        <!-- w-lg-100 conservé pour les grands écrans -->
        <img src="/assets/img/logo.png" alt="Logo de la maison des enfants" class="w-lg-100 logo-mde-img" />
      </a>
    </div>
  </div>

  <!-- 2. BLOC MENU : On rétablit la hauteur, l'espacement et la taille du texte d'origine -->
  <nav class="navbar navbar-expand-lg bg-primary py-2">
    <div class="container-fluid px-4">
      
      <!-- Bouton Burger (mobile uniquement) -->
      <button class="navbar-toggler my-1 ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Les liens du menu réalignés proprement -->
      <div class="collapse navbar-collapse" id="navbarNav">
        <!-- justify-content-start avec un gap constant pour retrouver l'alignement de départ -->
        <ul class="navbar-nav nav-pills justify-content-start align-items-center w-100 gap-3">
          <li v-for="item in navItems" :key="item.label" class="nav-item">
            <a 
              class="nav-link text-white px-3 py-2"
              :class="{ active: isActive(item.href) }"
              :aria-current="isActive(item.href) ? 'page' : undefined"
              :href="item.href"
            >{{ item.label }}</a>
          </li>
        </ul>
      </div>

    </div>
  </nav>

</header>
</template>

