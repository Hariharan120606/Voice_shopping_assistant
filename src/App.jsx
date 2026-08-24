import { useCallback, useMemo, useState } from "react";
import Header from "./components/Header";
import MicButton from "./components/MicButton";
import LanguageSelector from "./components/LanguageSelector";
import TranscriptFeedback from "./components/TranscriptFeedback";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import SmartSuggestions from "./components/SmartSuggestions";
import ShoppingList from "./components/ShoppingList";
import ManualAddBar from "./components/ManualAddBar";
import { ShoppingListProvider, useShoppingList } from "./context/ShoppingListContext";
import { useVoiceRecognition } from "./hooks/useVoiceRecognition";
import { parseCommand } from "./utils/nlp";
import { getSubstituteSuggestion } from "./utils/suggestions";
import { CATALOG, findProduct } from "./data/catalog";

function AppInner() {
  const { items, addItem, removeItem } = useShoppingList();
  const [lang, setLang] = useState("en-US");
  const [lastAction, setLastAction] = useState("");
  const [query, setQuery] = useState("");
  const [priceLimit, setPriceLimit] = useState(null);
  const [substituteSuggestion, setSubstituteSuggestion] = useState(null);

  const handleTranscript = useCallback(
    (transcript) => {
      const parsed = parseCommand(transcript);

      if (!parsed.item && parsed.intent !== "search_price") {
        setLastAction(`Didn't catch an item in "${transcript}". Try again?`);
        return;
      }

      switch (parsed.intent) {
        case "add": {
          addItem(parsed.item, parsed.quantity);
          setLastAction(
            `Added ${parsed.quantity > 1 ? parsed.quantity + " " : ""}${parsed.item} to your list.`
          );
          const sub = getSubstituteSuggestion(parsed.item);
          setSubstituteSuggestion(sub);
          setQuery("");
          setPriceLimit(null);
          break;
        }
        case "remove": {
          removeItem(parsed.item);
          setLastAction(`Removed ${parsed.item} from your list.`);
          break;
        }
        case "search":
        case "search_price": {
          setQuery(parsed.item || "");
          setPriceLimit(parsed.priceLimit);
          setLastAction(
            parsed.priceLimit != null
              ? `Searching for ${parsed.item || "items"} under $${parsed.priceLimit}.`
              : `Searching for ${parsed.item}.`
          );
          break;
        }
        default: {
          addItem(transcript, 1);
          setLastAction(`Added "${transcript}" to your list.`);
        }
      }
    },
    [addItem, removeItem]
  );

  const { isSupported, isListening, interimTranscript, error, startListening, stopListening } =
    useVoiceRecognition({ onResult: handleTranscript, lang });

  const toggleMic = () => {
    if (isListening) stopListening();
    else startListening();
  };

  const isSearching = query.trim().length > 0 || priceLimit != null;

  const searchResults = useMemo(() => {
    if (!isSearching) return [];
    const q = query.trim().toLowerCase();
    return CATALOG.filter((p) => {
      const matchesQuery = !q || p.name.includes(q) || p.brand.toLowerCase().includes(q);
      const matchesPrice = priceLimit == null || p.price <= priceLimit;
      return matchesQuery && matchesPrice;
    });
  }, [query, priceLimit, isSearching]);

  const listFilter = useCallback(
    (item) => {
      if (!isSearching) return true;
      const q = query.trim().toLowerCase();
      const product = findProduct(item.name);
      const matchesQuery = !q || item.name.toLowerCase().includes(q);
      const matchesPrice = priceLimit == null || (product && product.price <= priceLimit);
      return matchesQuery && matchesPrice;
    },
    [query, priceLimit, isSearching]
  );

  return (
    <div className="min-h-screen max-w-md mx-auto bg-[#f4f6f5] flex flex-col">
      <Header itemCount={items.length} />

      <main className="flex-1 px-4 pb-28 space-y-4 overflow-y-auto">
        <SearchBar
          query={query}
          setQuery={setQuery}
          priceLimit={priceLimit}
          setPriceLimit={setPriceLimit}
        />

        {isSearching ? (
          <SearchResults results={searchResults} />
        ) : (
          <>
            <SmartSuggestions
              substituteSuggestion={substituteSuggestion}
              onDismissSubstitute={() => setSubstituteSuggestion(null)}
            />
            <ShoppingList filterFn={listFilter} />
          </>
        )}
      </main>

      <footer className="sticky bottom-0 left-0 right-0 max-w-md mx-auto w-full bg-gradient-to-t from-[#f4f6f5] via-[#f4f6f5] to-transparent pt-6 pb-4 px-4">
        <div className="space-y-3">
          <TranscriptFeedback
            interim={interimTranscript}
            lastAction={lastAction}
            error={error}
            isListening={isListening}
          />
          <ManualAddBar />
          <div className="flex items-center justify-between pt-1">
            <LanguageSelector lang={lang} setLang={setLang} />
            <MicButton isListening={isListening} isSupported={isSupported} onClick={toggleMic} />
            <div className="w-[84px]" />
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ShoppingListProvider>
      <AppInner />
    </ShoppingListProvider>
  );
}
