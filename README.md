# 🔎 AIFinder

**Stop scrolling through AI directories. Just describe what you want to build.**

AIFinder is a conversational AI-tool discovery app. Instead of browsing endless lists of AI products, you describe your task in plain language — and AIFinder returns a personalized, ranked shortlist of real AI tools that fit, sorted from free to paid, each with a clear one-line reason why it was picked for you.

Built solo in 24 hours for **HackDevengers 2.0** — a fully virtual, 24-hour open-innovation hackathon powered by Unstop and sponsored by Lovable.

---

## 🚩 The Problem

There are now 1000+ AI tools launching every month — for building apps, writing content, generating images, editing video, and more. Most people don't know where to start. Existing "AI directories" just dump hundreds of logos on a page with no guidance, forcing users to manually filter through tools that may not even fit their actual need or budget.

The result: people pick the wrong tool, overpay for something too advanced, or give up entirely.

## 💡 The Solution

AIFinder replaces browsing with a conversation. Type what you're trying to do — *"I want to build an app,"* *"help me edit a video,"* *"I need a chatbot for my business"* — and AIFinder's matching engine returns a personalized, ranked shortlist of real tools that genuinely fit, each with a specific reason why it was chosen for **your** request, sorted from free to paid.

---

## ✨ Features

- 🔎 **Natural-language discovery** — no filters, no dropdowns, just describe what you need
- 🤖 **Gemini-powered matching engine** — personalized reasoning for every recommendation, not generic descriptions
- 💰 **Transparent pricing-first sorting** — always surfaces free options before paid ones
- 📋 **Curated, verified tool database** — grounded in real tools only, zero hallucinated recommendations
- 🎨 **Clean, minimal UI** — designed to feel trustworthy, not like another "AI hype" product
- 🔐 **Real user accounts** — sign up, log in, and revisit past searches

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| UI/UX Design | Google Stitch |
| App Development | Google AI Studio |
| AI / Matching Engine | Gemini API |
| Authentication | Firebase Authentication |
| Data | Curated static JSON database of real AI tools |

---

## 📸 Screenshots

> _Add screenshots of your Landing, Login, Prompt, and Results screens here._

| Landing | Prompt Input | Results |
|---|---|---|
| ![landing](./screenshots/landing.png) | ![prompt](./screenshots/prompt.png) | ![results](./screenshots/results.png) |

---

## 🚀 How It Works

1. **Sign up / log in** — quick email or Google authentication
2. **Describe your task** — e.g. *"I want to build an app"*, or tap a suggested example
3. **Get matched** — the Gemini-powered engine scans a curated database of real AI tools and returns the best-fit options
4. **Compare and choose** — results are sorted from free to paid, each with a one-line reason why it matches your request

---

## 🧠 What Makes It Different

Most "AI tool finder" sites are static SEO directories with a search bar. AIFinder is conversational and reasoning-driven — it doesn't just match keywords, it explains **why** each tool fits your specific situation. And unlike a raw LLM chat, every recommendation is grounded in a curated, verified database, so results are always real tools with real, current pricing tiers — never invented.

---

## 📂 Project Structure

```
aifinder/
├── src/
│   ├── components/       # UI components (matches Stitch design exactly)
│   ├── screens/          # Landing, Auth, Prompt, Results
│   ├── data/
│   │   └── ai_tools_database.json   # curated real AI tools dataset
│   └── services/
│       └── gemini.js     # Gemini API matching logic
├── public/
├── README.md
└── package.json
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js (v18+)
- A Gemini API key
- A Firebase project (for authentication)

### Installation
```bash
git clone https://github.com/<your-username>/aifinder.git
cd aifinder
npm install
```

### Environment Variables
Create a `.env` file in the root directory:
```
GEMINI_API_KEY=your_gemini_api_key_here
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
```

### Run Locally
```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## 🎯 Who It's For

- Students choosing their first no-code app builder
- Indie hackers deciding between AI coding assistants
- Small business owners looking for an affordable chatbot solution
- Content creators comparing video/image generation tools
- Anyone facing "AI tool overload" who wants a fast, trustworthy answer instead of hours of research

---

## 🗺️ Roadmap / Future Scope

- [ ] Expand the curated database beyond the initial categories
- [ ] Add user ratings/reviews layered on top of AI recommendations
- [ ] Browser extension for instant in-context tool suggestions
- [ ] Community-submitted tools with a verification pipeline
- [ ] Save and organize favorite tools into collections

---

## 🏆 Built For

**HackDevengers 2.0** — 24-Hour Open Innovation Hackathon
Powered by Unstop · Sponsored by Lovable

---

## 👤 Author

Built solo by [Md shameel] in 24 hours.

- LinkedIn: www.linkedin.com/in/mdshameel

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
