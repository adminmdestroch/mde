# mde
Site de Maison des enfants (St-Roch)

## Structure du projet

- `frontend/` : site Vue 3 + Vite (multi-pages) + Bootstrap/SCSS
- `backend/` : petit serveur Express (sert `frontend/dist` en local)

## Développement

Pour voir le site avec l'entête et le pied de page Vue, il faut le servir avec Vite.
Ne pas ouvrir les fichiers HTML directement dans le navigateur (`file://`) : les composants
Vue ne seront pas chargés correctement.

Dans un terminal, depuis `frontend/` :

```
npm install
npm run dev          # serveur Vite (http://localhost:5173) avec rechargement à chaud
```

Ouvre ensuite l'adresse affichée par Vite (généralement `http://localhost:5173`). Les pages
du site sont accessibles, par exemple, à `/` et `/publications.html`. Le serveur Express
n'est pas nécessaire pour afficher les pages et leurs composants Vue; il est requis seulement
pour tester les API Node.js, notamment la liste des rapports annuels. Le formulaire de contact
utilise encore temporairement son script PHP, qui sera converti séparément.

⚠️ Le SCSS n'est **pas** recompilé automatiquement par Vite : `npm run scss:watch` doit tourner
dans un deuxième terminal, toujours depuis `frontend/`, si tu modifies `src/scss/main.scss`.
Pour compiler le SCSS une seule fois :

```
npm run scss:build
```

## Build de production

```
cd frontend
npm run build        # génère les fichiers prêts à déployer dans frontend/dist
```

Pour tester localement le build de production, depuis `frontend/` :

```
npm run preview      # sert le build, généralement sur http://localhost:4173
```

Le backend Express (`node backend/server.js`, port 5000) peut aussi servir `frontend/dist`.

## Rapports annuels (PDF)

La page `publications.html` affiche automatiquement un bouton par PDF présent dans un dossier
Google Drive, via l'API Express `/api/rapports-annuels`. La cliente peut donc ajouter ou retirer
des rapports dans Google Drive sans reconstruire ni redéployer le site.

### Configuration Google Drive

Une seule fois, un administrateur doit :

1. créer un projet dans [Google Cloud Console](https://console.cloud.google.com/);
2. activer **Google Drive API**;
3. créer un compte de service et une clé JSON;
4. créer un dossier Google Drive pour les rapports et partager ce dossier avec l'adresse courriel
   du compte de service en rôle **Lecteur**;
5. rendre le dossier et ses PDF accessibles aux personnes ayant le lien, en rôle **Lecteur**;
6. copier l'identifiant du dossier, qui est la partie après `/folders/` dans son URL.

Ajoute les valeurs suivantes dans les variables d'environnement du service Render :

```text
GOOGLE_SERVICE_ACCOUNT_EMAIL=adresse-du-compte-de-service@projet.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_FOLDER_ID=identifiant-du-dossier-google-drive
```

Ne place jamais le fichier JSON de la clé du compte de service dans le dépôt ou dans le frontend.
Les identifiants du compte de service restent privés; seuls les PDF explicitement partagés doivent
être accessibles publiquement afin que les visiteurs puissent les ouvrir.

### Tester l'API en local

Configure les trois variables d'environnement ci-dessus dans ton terminal, puis démarre Express :
```
cd backend
npm start
```

Dans un autre terminal, le site peut être servi par Vite :
```
cd frontend
npm run dev
```

Vite redirige automatiquement `/api/*` vers Express (voir le proxy dans
`vite.config.js`). Ajoute un PDF dans le dossier Google Drive partagé, puis rafraîchis
`localhost:5173/publications.html`.

### Dépannage

- **`http proxy error ... ECONNREFUSED`** dans les logs Vite : Express n'est pas démarré ou a été
  fermé — relance-le depuis `backend/`.
- **Les rapports n'apparaissent pas** : vérifie que le dossier est partagé avec le compte de
  service, que les fichiers sont des PDF et qu'ils ne sont pas dans la corbeille.
- **La page affiche une erreur de chargement** : vérifie les trois variables d'environnement,
  notamment les retours de ligne `\n` de `GOOGLE_PRIVATE_KEY`.

### Déploiement (Render)

Render fournit le port par la variable d'environnement `PORT`; le serveur Express l'utilise
automatiquement.
