const { envoyerEmailViaGmailApi } = require("./_utils");

const REGEX_COURRIEL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ erreur: "Methode non autorisee" });
  }

  try {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const nom = String(body["nom"] || "").trim();
    const email = String(body["courriel"] || "").trim();
    const message = String(body["message"] || "").trim();

    if (!nom || !email) {
      return res.status(400).json({ erreur: "Le nom et le courriel sont requis." });
    }
    if (!REGEX_COURRIEL.test(email)) {
      return res.status(400).json({ erreur: "Le courriel est invalide." });
    }

    // Retire les sauts de ligne pour éviter l'injection d'en-têtes dans le sujet
    const nomSujet = nom.replace(/[\r\n]+/g, " ");

    const texteEmail = `Nom complet : ${nom}\nCourriel : ${email}\n\nMessage :\n${message || "(Aucun message)"}`;

    await envoyerEmailViaGmailApi({
      to: process.env.RH_EMAIL || process.env.SMTP_USER,
      subject: `Nouveau message (Nous joindre) - ${nomSujet}`,
      text: texteEmail,
    });

    return res.status(200).json({ succes: true });
  } catch (erreur) {
    console.error("Erreur send-joindre:", erreur);
    return res.status(500).json({ erreur: erreur.message || "Une erreur est survenue." });
  }
};