const { google } = require("googleapis");

function creerClientDrive() {
  const emailCompteService = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const clePrivee = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (!emailCompteService || !clePrivee || !process.env.GOOGLE_DRIVE_FOLDER_ID) {
    const erreur = new Error("La configuration Google Drive est incomplete.");
    erreur.status = 500;
    throw erreur;
  }

  const authentification = new google.auth.GoogleAuth({
    credentials: {
      client_email: emailCompteService,
      private_key: clePrivee,
    },
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });

  return google.drive({ version: "v3", auth: authentification });
}

async function envoyerEmailViaGmailApi({ to, subject, text, file }) {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oAuth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString("base64")}?=`;
  
  let rawMessage = [
    `To: ${to}`,
    `Subject: ${utf8Subject}`,
    "MIME-Version: 1.0",
  ];

  if (file) {
    const boundary = "foo_bar_baz";
    rawMessage.push(`Content-Type: multipart/mixed; boundary="${boundary}"`);
    rawMessage.push("");
    rawMessage.push(`--${boundary}`);
    rawMessage.push("Content-Type: text/plain; charset=utf-8");
    rawMessage.push("Content-Transfer-Encoding: 7bit");
    rawMessage.push("");
    rawMessage.push(text);
    rawMessage.push("");
    rawMessage.push(`--${boundary}`);
    rawMessage.push(`Content-Type: ${file.mimetype}; name="${file.originalname}"`);
    rawMessage.push("Content-Transfer-Encoding: base64");
    rawMessage.push(`Content-Disposition: attachment; filename="${file.originalname}"`);
    rawMessage.push("");
    rawMessage.push(file.buffer.toString("base64"));
    rawMessage.push("");
    rawMessage.push(`--${boundary}--`);
  } else {
    rawMessage.push("Content-Type: text/plain; charset=utf-8");
    rawMessage.push("");
    rawMessage.push(text);
  }

  const encodedMessage = Buffer.from(rawMessage.join("\r\n"))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  await gmail.users.messages.send({
    userId: "me",
    requestBody: {
      raw: encodedMessage,
    },
  });
}

module.exports = { creerClientDrive, envoyerEmailViaGmailApi };