// Lightweight intent-matching NLP layer.
//
// Why regex/pattern matching instead of a full LLM call for every utterance?
// Voice grocery commands follow a small number of predictable shapes ("add X",
// "I need X", "remove X", "find X under $Y"...). Pattern matching handles
// these in <1ms with zero API cost/latency and works fully offline once
// speech-to-text has produced text. This keeps the app responsive and free
// to run. The parser is structured so a free-tier LLM (e.g. a Claude/Gemini
// call) could be dropped in as a fallback for genuinely ambiguous utterances
// — see `parseWithFallback` at the bottom.

import { SYNONYMS } from "../data/catalog";

const NUMBER_WORDS = {
  one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  a: 1, an: 1, couple: 2, few: 3, dozen: 12,
};

function extractQuantity(text) {
  const numMatch = text.match(/\b(\d+)\b/);
  if (numMatch) return parseInt(numMatch[1], 10);
  for (const [word, val] of Object.entries(NUMBER_WORDS)) {
    if (new RegExp(`\\b${word}\\b`).test(text)) return val;
  }
  return 1;
}

function extractPriceLimit(text) {
  // "under $5", "under 5 dollars", "below $10", "less than $3.50"
  const match = text.match(/(?:under|below|less than)\s*\$?(\d+(?:\.\d+)?)/);
  return match ? parseFloat(match[1]) : null;
}

function cleanItemName(raw) {
  let s = raw
    .replace(/\b(please|to my list|to the list|from my list|from the list)\b/g, "")
    .replace(/\b(\d+)\b/g, "")
    .replace(
      /\b(bottles?|cans?|bags?|boxes?|packs?|of)\b/g,
      ""
    )
    .replace(
      new RegExp(`\\b(${Object.keys(NUMBER_WORDS).join("|")})\\b`, "g"),
      ""
    )
    .trim()
    .replace(/\s+/g, " ");
  // resolve synonyms
  if (SYNONYMS[s]) s = SYNONYMS[s];
  return s;
}

// Detection regex (used only to classify intent — may match broadly) and a
// separate, narrow "strip" regex (used only to remove the trigger *words*,
// never the item text in between). Keeping these separate avoids a greedy
// detection match accidentally eating the item name (e.g. "find X under $5"
// previously had its detection regex span "find...under", swallowing "X").
const PATTERNS = [
  {
    intent: "search_price",
    detect: /\bfind\b.*\b(?:under|below|less than)\b/i,
    strip: /\b(find|search for|look for|look up)\b/i,
  },
  {
    intent: "search",
    detect: /\b(find|search for|look for|look up)\b/i,
    strip: /\b(find|search for|look for|look up)\b/i,
  },
  {
    intent: "remove",
    detect: /\b(remove|delete|take off|get rid of)\b/i,
    strip: /\b(remove|delete|take off|get rid of)\b/i,
  },
  {
    intent: "add",
    detect: /\b(add|i need|i want to buy|i want|buy|get me|put|pick up)\b/i,
    strip: /\b(add|i need|i want to buy|i want|buy|get me|put|pick up)\b/i,
  },
];

/**
 * Parses a raw voice transcript into a structured intent object.
 * Returns: { intent, item, quantity, priceLimit, raw }
 */
export function parseCommand(transcriptRaw) {
  const transcript = transcriptRaw.trim().toLowerCase();
  if (!transcript) {
    return { intent: "unknown", raw: transcriptRaw };
  }

  let matched = PATTERNS.find((p) => p.detect.test(transcript));
  if (!matched) {
    // Bare item name, e.g. just "milk" -> treat as add
    matched = { intent: "add", strip: null };
  }

  const quantity = extractQuantity(transcript);
  const priceLimit = extractPriceLimit(transcript);

  // Strip the trigger phrase (words only) to isolate the item name
  let itemPart = transcript;
  if (matched.strip) {
    itemPart = transcript.replace(matched.strip, "");
  }
  itemPart = itemPart
    .replace(/(?:under|below|less than)\s*\$?\d+(?:\.\d+)?/g, "")
    .replace(/\bdollars?\b/g, "")
    .replace(/\b(?:to|from)\s+(?:my|the)\s+list\b/g, "")
    .replace(/\bmy list\b/g, "")
    .replace(/\bthe list\b/g, "")
    .replace(/^\s*(to|for|me)\b/, "")
    .replace(/\b(to|for|from)\s*$/, "");

  const item = cleanItemName(itemPart);

  return {
    intent: matched.intent,
    item: item || null,
    quantity,
    priceLimit,
    raw: transcriptRaw,
  };
}

/**
 * Optional fallback: if the local parser can't confidently extract an item
 * (e.g. highly unusual phrasing), a free-tier LLM call could be substituted
 * here to classify intent + extract entities as JSON. Left as a stub so the
 * app works fully offline without requiring an API key.
 */
export async function parseWithFallback(transcript, llmCallFn = null) {
  const parsed = parseCommand(transcript);
  if (parsed.item || !llmCallFn) return parsed;
  try {
    return await llmCallFn(transcript);
  } catch {
    return parsed;
  }
}
