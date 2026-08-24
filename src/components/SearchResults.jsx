import { Plus } from "lucide-react";
import { useShoppingList } from "../context/ShoppingListContext";

export default function SearchResults({ results }) {
  const { addItem } = useShoppingList();

  if (results.length === 0) {
    return (
      <p className="text-sm text-gray-400 px-1">No products match that search.</p>
    );
  }

  return (
    <ul className="space-y-2">
      {results.map((p) => (
        <li
          key={p.name}
          className="flex items-center justify-between gap-3 bg-white rounded-2xl shadow-sm px-4 py-2.5"
        >
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-800 capitalize truncate">{p.name}</p>
            <p className="text-xs text-gray-400">
              {p.brand} · ${p.price.toFixed(2)}
            </p>
          </div>
          <button
            onClick={() => addItem(p.name, 1)}
            className="shrink-0 w-8 h-8 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center hover:bg-brand-100"
            aria-label={`Add ${p.name}`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </li>
      ))}
    </ul>
  );
}
