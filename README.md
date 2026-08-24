# Voice Cart — Voice Command Shopping Assistant

A mobile-first, voice-controlled shopping list manager built with React + Vite +
Tailwind CSS. Add, remove, and search items by speaking naturally, get smart
suggestions (running-low, seasonal, substitutes), and manage quantities —
all with real-time visual feedback.

**Live demo:** _add your deployed URL here_
**Repo:** _add your GitHub URL here_

---

## Features

| Requirement | Implementation |
|---|---|
| Voice command recognition | Browser-native `SpeechRecognition` (Web Speech API) via `useVoiceRecognition` hook |
| NLP for varied phrasing | Pattern-matching intent parser (`src/utils/nlp.js`) — handles "add X", "I need X", "I want to buy X" identically |
| Multilingual voice input | Language dropdown (`en-US`, `en-IN`, `hi-IN`, `es-ES`, `fr-FR`, `de-DE`) sets `recognition.lang` |
| Add / remove / modify items | Voice or manual text input; quantity steppers per item |
| Auto-categorization | Static product catalog (`src/data/catalog.js`) maps items → Dairy / Produce / Bakery / Meat / Beverages / Snacks / Household |
| Quantity parsing | Extracts digits ("2") and number words ("two") from speech |
| Voice-activated search | "Find organic apples" / "Find toothpaste under $5" filters the product catalog and current list |
| Price range filtering | Regex-extracted `under $N` clause filters search results |
| Smart suggestions | Running-low (simulated purchase history + repurchase cycle), seasonal (current month → in-season items), substitutes (static substitution map, triggered on add) |
| Visual feedback | Live interim transcript, pulsing mic animation, toast-style confirmation after each command |
| Error handling | Mic permission / no-speech / network errors surfaced inline; unsupported browsers fall back to text input |
| Mobile-first UI | Single-column max-width layout, large tap targets, sticky bottom mic bar |

---

## Project Structure

```
voice-shopping-assistant/
├── src/
│   ├── components/          # Presentational UI components
│   │   ├── Header.jsx
│   │   ├── MicButton.jsx
│   │   ├── LanguageSelector.jsx
│   │   ├── TranscriptFeedback.jsx
│   │   ├── SearchBar.jsx
│   │   ├── SearchResults.jsx
│   │   ├── SmartSuggestions.jsx
│   │   ├── ShoppingList.jsx
│   │   ├── ListItem.jsx
│   │   └── ManualAddBar.jsx
│   ├── context/
│   │   └── ShoppingListContext.jsx   # useReducer + Context for list state
│   ├── hooks/
│   │   └── useVoiceRecognition.js    # Web Speech API wrapper
│   ├── utils/
│   │   ├── nlp.js            # Intent parser (add/remove/search + entity extraction)
│   │   └── suggestions.js    # Running-low / seasonal / substitute logic
│   ├── data/
│   │   ├── catalog.js        # Product catalog: category, brand, price, substitutes
│   │   └── history.js        # Simulated purchase history for recommendations
│   ├── App.jsx                # Wires voice input → NLP → state → UI
│   ├── main.jsx
│   └── index.css
├── index.html
├── tailwind.config.js
└── package.json
```

---

## Local Development

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`) in **Chrome**
(desktop or Android) — the Web Speech API has the most reliable support
there. Safari/Firefox will fall back to the manual text-input bar.

> The app must be served over **HTTPS or localhost** for microphone access
> to work — this is a browser security requirement, not an app limitation.

## Build

```bash
npm run build
npm run preview   # serve the production build locally
```

---

## Architecture & Approach

**Voice → Text:** The browser's native `SpeechRecognition` API converts
speech to text client-side, with no external API calls, cost, or added
latency. `useVoiceRecognition` wraps this in a hook that exposes listening
state, interim (live) transcript, and typed error messages.

**Text → Intent:** Rather than calling an LLM for every utterance, a
lightweight pattern-matching parser (`nlp.js`) classifies the transcript
into `add` / `remove` / `search` / `search_price` and extracts the item
name, quantity, and price ceiling. This keeps the app fully free-tier,
instant, and offline-capable, while still robustly handling phrasing
variation ("add X" vs. "I need X" vs. "I want to buy X" all resolve to the
same `add` intent). The parser is structured so a free-tier LLM call could
be swapped in as a fallback for genuinely ambiguous input (see
`parseWithFallback`).

**State:** A single `useReducer` + Context (`ShoppingListContext`) holds the
list. Items auto-categorize on add via a static product catalog, which also
powers search, price filtering, and substitute suggestions.

**Suggestions:** Three independent signals feed the suggestion strip —
items nearing their simulated repurchase cycle ("running low"), items in
season for the current month, and substitute items surfaced the moment a
product with known alternatives (e.g. milk) is added.

**Edge cases handled:** empty/unparseable transcripts, no microphone,
denied permissions, unsupported browsers (manual input fallback), duplicate
item adds (quantity merges instead of duplicating rows), and quantities
that would go below 1.

---

## Deployment

### Vercel (recommended, zero-config)
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm run build
# drag-and-drop the dist/ folder at app.netlify.com, or:
netlify deploy --prod --dir=dist
```

### Firebase Hosting
```bash
npm run build
firebase init hosting   # set public dir to "dist", configure as SPA: yes
firebase deploy
```

All three serve over HTTPS by default, which is required for microphone access.

---

## Known Limitations / Future Work

- Product catalog and purchase history are static/mocked (no backend).
- Speech recognition accuracy depends on the browser's implementation —
  Chrome is most reliable; Safari/Firefox support is inconsistent.
- Multilingual NLP intent parsing (beyond speech-to-text) currently targets
  English phrasing patterns; non-English commands are best transcribed and
  then edited via the manual input bar.
- No persistence layer — list resets on page reload (would add
  localStorage or a Firestore/Supabase backend next).
