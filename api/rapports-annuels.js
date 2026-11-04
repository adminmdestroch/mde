const { creerClientDrive } = require("./_utils");

module.exports = async (req, res) => {
  if (req.method !== "GET") {
    return res.status(405).json({ erreur: "Methode non autorisee" });
  }

  try {
    const drive = creerClientDrive();
    const fichiers = [];
    let pageToken;

    do {
      const reponse = await drive.files.list({
        q: `'${process.env.GOOGLE_DRIVE_FOLDER_ID}' in parents and mimeType = 'application/pdf' and trashed = false`,
        fields: "nextPageToken, files(id, name, webViewLink)",
        orderBy: "name",
        pageSize: 100,
        pageToken,
      });

      fichiers.push(
        ...(reponse.data.files || [])
          .filter((fichier) => fichier.id && fichier.name)
          .map((fichier) => ({
            nom: fichier.name,
            url: fichier.webViewLink || `https://drive.google.com/file/d/${fichier.id}/view`,
          }))
      );
      pageToken = reponse.data.nextPageToken;
    } while (pageToken);

    return res.status(200).json(fichiers);
  } catch (erreur) {
    console.error("Erreur rapports-annuels:", erreur);
    return res.status(erreur.status || 500).json({
      erreur: erreur.message || "Une erreur interne est survenue sur le serveur.",
    });
  }
};