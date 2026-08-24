import { Sparkles, Plus } from "lucide-react";
import { useMemo } from "react";
import { useShoppingList } from "../context/ShoppingListContext";
import { getRunningLowSuggestions, getSeasonalSuggestions } from "../utils/suggestions";

export default function SmartSuggestions({ substituteSuggestion, onDismissSubstitute }) {
  const { items, addItem } = useShoppingList();
  const names = useMemo(() => items.map((i) => i.name), [items]);

  const suggestions = useMemo(() => {
    const list = [
      ...getRunningLowSuggestions(names),
      ...getSeasonalSuggestions(names),
    ];
    return list.slice(0, 6);
  }, [names]);

  if (suggestions.length === 0 && !substituteSuggestion) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 px-1">
        <Sparkles className="w-3.5 h-3.5 text-brand-500" />
        Smart suggestions
      </div>

      {substituteSuggestion && (
        <div className="flex items-center justify-between gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-sm">
          <span className="text-amber-800">{substituteSuggestion.message}</span>
          <button
            onClick={onDismissSubstitute}
            className="text-xs text-amber-600 shrink-0 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {suggestions.map((s) => (
          <button
            key={`${s.type}-${s.item}`}
            onClick={() => addItem(s.item, 1)}
            className="shrink-0 flex items-center gap-1.5 bg-white border border-gray-200 rounded-full pl-3 pr-2 py-1.5 text-xs font-medium text-gray-700 hover:border-brand-300 hover:bg-brand-50 transition-colors whitespace-nowrap"
            title={s.message}
          >
            <span className="capitalize">{s.item}</span>
            <Plus className="w-3 h-3 text-brand-500" />
          </button>
        ))}
      </div>
    </div>
  );
}
