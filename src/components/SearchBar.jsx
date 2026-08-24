import { Search, X } from "lucide-react";

export default function SearchBar({ query, setQuery, priceLimit, setPriceLimit }) {
  const active = query || priceLimit != null;

  return (
    <div className="flex items-center gap-2 bg-white rounded-2xl shadow-sm px-3 py-2">
      <Search className="w-4 h-4 text-gray-400 shrink-0" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search items (or say 'find organic apples under $5')"
        className="flex-1 min-w-0 text-sm bg-transparent focus:outline-none placeholder:text-gray-400"
      />
      {priceLimit != null && (
        <span className="text-xs font-medium text-brand-600 bg-brand-50 rounded-full px-2 py-1 whitespace-nowrap">
          under ${priceLimit}
        </span>
      )}
      {active && (
        <button
          onClick={() => {
            setQuery("");
            setPriceLimit(null);
          }}
          aria-label="Clear search"
          className="text-gray-300 hover:text-gray-500"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
