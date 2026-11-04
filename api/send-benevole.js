const { envoyerEmailViaGmailApi } = require("./_utils");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ erreur: "Methode non autorisee" });
  }

  try {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const nom = body["benevole-nom"];
    const email = body["benevole-courriel"];
    const telephone = body["benevole-telephone"];
    const source = body["benevole-source"];

    const typesBenevolat = body["benevole-types[]"] || body["benevole-types"];
    const disposCochees = body["benevole-dispos[]"] || body["benevole-dispos"];
    const precisionTypes = body["benevole-types-precision"];
    const precisionDispos = body["benevole-dispos-precision"];

    if (!nom || !email) {
      return res.status(400).json({ erreur: "Le nom et le courriel sont requis." });
    }

    let listeTypes = typesBenevolat ? (Array.isArray(typesBenevolat) ? typesBenevolat.join(", ") : typesBenevolat) : "Aucun selectionne";
    let listeDispos = disposCochees ? (Array.isArray(disposCochees) ? disposCochees.join(", ") : disposCochees) : "Aucune selectionnee";

    const texteEmail = `DETAILS DU CANDIDAT BENEVOLE :
-----------------------------------------
Nom complet : ${nom}
Courriel : ${email}
Telephone : ${telephone}
Source (connaissance) : ${source}

Type(s) de benevolat selectionne(s) :
${listeTypes}
Precision type de benevolat : ${precisionTypes || "N/A"}

Disponibilite(s) selectionnee(s) :
${listeDispos}
Precision disponibilites (si autre) : ${precisionDispos || "N/A"}`;

    await envoyerEmailViaGmailApi({
      to: process.env.RH_EMAIL || process.env.SMTP_USER,
      subject: `Nouvelle demande de benevolat - ${nom}`,
      text: texteEmail,
    });

    return res.status(200).json({ succes: true });
  } catch (erreur) {
    console.error("Erreur send-benevole:", erreur);
    return res.status(500).json({ erreur: erreur.message || "Une erreur est survenue." });
  }
};