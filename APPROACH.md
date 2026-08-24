# Approach Write-up (< 200 words)

I built Voice Cart with React + Vite + Tailwind, using the browser-native Web
Speech API for speech-to-text rather than a paid transcription service — this
keeps the app entirely free-tier and removes network latency from the voice
loop. Recognized text is passed through a custom regex-based intent parser
that classifies commands into add/remove/search actions and extracts item
name, quantity, and price constraints, handling phrasing variety ("add milk"
vs. "I need milk") without an LLM call per utterance, keeping the app fast
and cost-free while still leaving room for an LLM fallback on ambiguous input.

Shopping list state lives in a `useReducer` + Context store; items
auto-categorize and unlock substitute suggestions via a static product
catalog. Smart suggestions combine three signals: a simulated purchase-cycle
model ("running low"), current-month seasonality, and a substitution map.

Edge cases handled: unsupported browsers fall back to manual text entry,
mic errors (permission/no-speech/network) surface inline, and duplicate
voice-adds merge quantities instead of creating duplicate rows.

The result is a mobile-first, installable web app deployable to Vercel,
Netlify, or Firebase Hosting with zero backend required, built within the
8-hour scope while covering every required feature area.
