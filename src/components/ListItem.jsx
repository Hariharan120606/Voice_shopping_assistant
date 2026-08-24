import { Minus, Plus, X } from "lucide-react";
import { useShoppingList } from "../context/ShoppingListContext";

export default function ListItem({ item }) {
  const { toggleItem, setQuantity, removeItem } = useShoppingList();

  return (
    <li
      className={`flex items-center gap-3 px-4 py-3 bg-white rounded-2xl shadow-sm transition-opacity ${
        item.checked ? "opacity-50" : ""
      }`}
    >
      <button
        onClick={() => toggleItem(item.id)}
        aria-label={item.checked ? "Mark as not done" : "Mark as done"}
        className={`w-6 h-6 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
          item.checked
            ? "bg-brand-500 border-brand-500 text-white"
            : "border-gray-300"
        }`}
      >
        {item.checked && (
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none">
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`font-medium text-gray-800 capitalize truncate ${
            item.checked ? "line-through" : ""
          }`}
        >
          {item.name}
        </p>
      </div>

      <div className="flex items-center gap-1.5 bg-gray-50 rounded-full px-1">
        <button
          onClick={() => setQuantity(item.id, item.quantity - 1)}
          aria-label="Decrease quantity"
          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-800"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
        <button
          onClick={() => setQuantity(item.id, item.quantity + 1)}
          aria-label="Increase quantity"
          className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-800"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>

      <button
        onClick={() => removeItem(item.name)}
        aria-label={`Remove ${item.name}`}
        className="w-7 h-7 shrink-0 flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </li>
  );
}
