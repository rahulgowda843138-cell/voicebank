# 🏦 FT-1: VoiceBank — Voice-Driven Financial Access

> Financial inclusion for low-literacy users through voice-first interaction.

---

## 📁 Project Structure

```
ft1-voice-finance/
├── frontend/                    # Client-side (runs in any browser)
│   ├── index.html               # Main app page
│   ├── css/
│   │   └── style.css            # Clean, accessible styling
│   └── js/
│       ├── data.js              # Mock user & transaction data
│       ├── i18n.js              # Multi-language string manager
│       ├── voice.js             # Web Speech API wrapper
│       └── app.js               # Main app controller & command parser
│
├── backend/                     # Node.js/Express REST API
│   ├── server.js                # Entry point
│   ├── package.json
│   ├── models/
│   │   └── db.js                # In-memory data store (swap with DB)
│   ├── routes/
│   │   ├── accounts.js          # Account & balance endpoints
│   │   ├── transactions.js      # Send money, pay bill, history
│   │   └── voice.js             # Voice command NLP processor
│   └── middleware/
│       └── auth.js              # User authentication middleware
│
├── data/
│   └── sample_commands.json     # Sample voice commands for testing
│
└── README.md
```

---

## 🚀 Getting Started

### Frontend Only (No Backend Needed)
```bash
# Just open the file in a browser
open frontend/index.html
```

### With Backend API
```bash
cd backend
npm install
npm start
# Server runs at http://localhost:3000
```

---

## 🎤 Voice Commands Supported

| Intent | Example Commands |
|--------|-----------------|
| Check Balance | "check my balance", "बैलेंस बताओ", "salio" |
| Send Money | "send 500 to Asha", "भेजो 200 मोहन को" |
| Pay Bill | "pay electricity bill", "bill भरो" |
| Transaction History | "show history", "transactions", "लेनदेन" |
| Savings Tips | "give me savings tips", "सुझाव दो" |
| Loan Status | "loan status", "EMI कब है", "mkopo" |

---

## 🌐 Supported Languages

| Language | Code | Voice Input |
|----------|------|------------|
| English  | en-US | ✅ |
| Hindi    | hi-IN | ✅ |
| Swahili  | sw-KE | ✅ |
| French   | fr-FR | ✅ |
| Spanish  | es-ES | ✅ |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/accounts/:userId | Get account details |
| GET    | /api/accounts/:userId/balance | Get balance |
| GET    | /api/accounts/:userId/contacts | Get contacts |
| GET    | /api/transactions/:userId | Transaction history |
| POST   | /api/transactions/send | Send money |
| POST   | /api/transactions/pay-bill | Pay a bill |
| POST   | /api/voice/command | Process voice command |
| GET    | /api/voice/tips | Get savings tip |
| GET    | /api/health | Health check |

---

## ♿ Accessibility Features

- **Voice-first UI** — No reading required
- **Text-to-speech feedback** — Every action is spoken aloud
- **Large tap targets** — Usable on basic touch screens
- **Minimal UI** — Works on low-end devices
- **Multi-language** — Supports 5 languages, extensible
- **Offline-friendly** — Core features work without internet
- **Confirmation steps** — Prevents accidental transfers

---

## 🔒 Security Notes

- PIN authentication (hash with bcrypt in production)
- Use JWT tokens instead of x-user-id header in production
- Replace in-memory DB with PostgreSQL/MongoDB
- Add rate limiting (express-rate-limit)
- Enable HTTPS in production

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML5, CSS3, Vanilla JS |
| Voice | Web Speech API (SpeechRecognition + SpeechSynthesis) |
| Backend | Node.js + Express |
| Storage | In-memory (demo) → MongoDB/PostgreSQL (production) |
| i18n | Custom lightweight i18n module |
