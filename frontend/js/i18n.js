// i18n.js — Language strings for multi-language support

const i18n = {
  "en-US": {
    tagline:      "Your voice is your password",
    micHint:      "Tap & Hold to Speak",
    placeholder:  'Say something like: "Check my balance" or "Send 500 to Asha"',
    balance:      "Your balance is",
    sent:         "Sent",
    to:           "to",
    confirm:      "Confirm",
    cancel:       "Cancel",
    history:      "Recent Transactions",
    tips:         "Savings Tips",
    loan:         "Loan outstanding",
    unknown:      "Sorry, I didn't understand that. Please try again.",
    listening:    "Listening... speak now",
  },
  "hi-IN": {
    tagline:      "आपकी आवाज़ आपका पासवर्ड है",
    micHint:      "बोलने के लिए दबाएं",
    placeholder:  '"बैलेंस चेक करो" या "आशा को 500 भेजो" जैसा कुछ बोलें',
    balance:      "आपका बैलेंस है",
    sent:         "भेजा",
    to:           "को",
    confirm:      "पुष्टि करें",
    cancel:       "रद्द करें",
    history:      "हाल के लेनदेन",
    tips:         "बचत सुझाव",
    loan:         "ऋण बकाया",
    unknown:      "माफ़ करें, समझ नहीं आया। कृपया फिर से बोलें।",
    listening:    "सुन रहा हूँ... अब बोलें",
  },
  "sw-KE": {
    tagline:      "Sauti yako ni nenosiri lako",
    micHint:      "Bonyeza kusema",
    placeholder:  'Sema kitu kama: "Angalia salio" au "Tuma 500 kwa Asha"',
    balance:      "Salio lako ni",
    sent:         "Imetumwa",
    to:           "kwa",
    confirm:      "Thibitisha",
    cancel:       "Ghairi",
    history:      "Miamala ya Hivi Karibuni",
    tips:         "Vidokezo vya Akiba",
    loan:         "Mkopo unaobaki",
    unknown:      "Samahani, sikuelewa. Tafadhali jaribu tena.",
    listening:    "Sikilizwa... sema sasa",
  },
  "fr-FR": {
    tagline:      "Votre voix est votre mot de passe",
    micHint:      "Appuyez pour parler",
    placeholder:  'Dites quelque chose comme: "Vérifier mon solde" ou "Envoyer 500 à Asha"',
    balance:      "Votre solde est",
    sent:         "Envoyé",
    to:           "à",
    confirm:      "Confirmer",
    cancel:       "Annuler",
    history:      "Transactions récentes",
    tips:         "Conseils d'épargne",
    loan:         "Prêt en cours",
    unknown:      "Désolé, je n'ai pas compris. Veuillez réessayer.",
    listening:    "Écoute... parlez maintenant",
  },
  "es-ES": {
    tagline:      "Tu voz es tu contraseña",
    micHint:      "Toca para hablar",
    placeholder:  'Di algo como: "Ver mi saldo" o "Enviar 500 a Asha"',
    balance:      "Tu saldo es",
    sent:         "Enviado",
    to:           "a",
    confirm:      "Confirmar",
    cancel:       "Cancelar",
    history:      "Transacciones recientes",
    tips:         "Consejos de ahorro",
    loan:         "Préstamo pendiente",
    unknown:      "Lo siento, no entendí. Por favor intenta de nuevo.",
    listening:    "Escuchando... habla ahora",
  }
};

let currentLang = "en-US";

function t(key) {
  return (i18n[currentLang] && i18n[currentLang][key]) || i18n["en-US"][key] || key;
}

function setLanguage(lang) {
  currentLang = lang;
  document.getElementById("tagline").textContent = t("tagline");
  document.getElementById("micHint").textContent  = t("micHint");
  document.getElementById("transcriptText").innerHTML =
    t("placeholder").replace(/"([^"]+)"/g, '"<em>$1</em>"');
}

document.getElementById("langSelect").addEventListener("change", e => setLanguage(e.target.value));
