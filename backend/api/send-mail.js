const multer = require("multer");
const { envoyerEmailViaGmailApi } = require("./_utils");

const upload = multer({ storage: multer.memoryStorage() });

function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ erreur: "Methode non autorisee" });
  }

  try {
    await runMiddleware(req, res, upload.single("emploi-cv"));

    const nom = req.body["emploi-nom"];
    const email = req.body["emploi-courriel"];
    const message = req.body["emploi-message"];
    const file = req.file;

    if (!nom || !email) {
      return res.status(400).json({ erreur: "Le nom et le courriel sont requis." });
    }

    const texteEmail = `Nom complet : ${nom}\nCourriel du candidat : ${email}\n\nMessage :\n${message || "(Aucun message)"}`;

    await envoyerEmailViaGmailApi({
      to: process.env.RH_EMAIL || process.env.SMTP_USER,
      subject: `Nouvelle candidature - ${nom}`,
      text: texteEmail,
      file: file,
    });

    return res.status(200).json({ succes: true });
  } catch (erreur) {
    console.error("Erreur send-mail:", erreur);
    return res.status(500).json({ erreur: erreur.message || "Une erreur est survenue." });
  }
};