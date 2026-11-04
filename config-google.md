Oui, c’est correct. La capture montre que :

- le projet **mde-rapports-annuels** est sélectionné;
- **Google Drive API** est activée;
- l’état affiche **Activé**.

Vous pouvez passer à l’étape suivante : créer le compte de service.

## Étape suivante

Dans le menu de gauche, allez à :

**IAM et administration → Comptes de service**

Puis :

1. Cliquez sur **Créer un compte de service**.
2. Donnez-lui un nom, par exemple :
   ```text
   rapports-annuels
   ```
3. Vous pouvez laisser le rôle vide pour le moment, ou ne lui attribuer aucun rôle général.
4. Terminez la création.
5. Ouvrez le compte de service créé.
6. Copiez son adresse courriel, qui ressemble à :
   ```text
   rapports-annuels@mde-rapports-annuels.iam.gserviceaccount.com
   ```

## Ensuite

Dans Google Drive :

1. Créez ou ouvrez le dossier des rapports annuels.
2. Cliquez sur **Partager**.
3. Ajoutez l’adresse courriel du compte de service.
4. Donnez-lui le rôle **Lecteur**.

Le compte de service doit pouvoir lire ce dossier, même si les visiteurs du site utiliseront ensuite des liens publics pour ouvrir les PDF.

Enfin, dans le compte de service, allez dans l’onglet **Clés** :

1. Cliquez sur **Ajouter une clé**.
2. Choisissez **Créer une clé**.
3. Sélectionnez **JSON**.
4. Téléchargez le fichier.

⚠️ La clé JSON est secrète. Ne la déposez pas dans le dépôt GitHub et ne la placez pas dans `frontend/`. Elle servira à créer les variables sécurisées dans Render.

À ce stade, ne cliquez pas nécessairement sur **Créer des identifiants** dans la page de l’API pour générer une clé API : pour le code que nous avons intégré, c’est bien un **compte de service avec une clé JSON** qu’il faut.