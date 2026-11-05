/**
 * Envoie un formulaire en fetch (sans recharger la page), puis redirige
 * vers /confirmation.html. Affiche un message d'erreur en cas d'échec.
 *
 * @param {string}  formId          id du <form>
 * @param {string}  feedbackId      id de la zone d'erreur (alert)
 * @param {boolean} convertirEnJson true = envoi JSON, false = FormData (multipart, pour les fichiers)
 */
export function activerEnvoiFormulaire(formId, feedbackId, convertirEnJson = false) {
  const form = document.getElementById(formId);
  const feedback = document.getElementById(feedbackId);
  if (!form || !feedback) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    feedback.classList.add('d-none');

    const bouton = form.querySelector('button[type="submit"]');
    if (bouton) bouton.disabled = true;

    const donnees = new FormData(form);
    const options = { method: 'POST' };

    if (convertirEnJson) {
      const corps = Object.fromEntries(donnees.entries());
      // Les cases à cocher multiples doivent rester des tableaux
      for (const nom of ['benevole-types[]', 'benevole-dispos[]']) {
        const valeurs = donnees.getAll(nom);
        if (valeurs.length) corps[nom] = valeurs;
      }
      options.headers = { 'Content-Type': 'application/json' };
      options.body = JSON.stringify(corps);
    } else {
      options.body = donnees;
    }

    try {
      const reponse = await fetch(form.action, options);
      if (!reponse.ok) {
        throw new Error(`L’envoi a échoué (${reponse.status}).`);
      }
      window.location.assign('/confirmation.html');
    } catch (erreur) {
      console.error(erreur);
      feedback.textContent = "Une erreur est survenue lors de l'envoi. Veuillez réessayer plus tard.";
      feedback.classList.remove('d-none');
    } finally {
      if (bouton) bouton.disabled = false;
    }
  });
}