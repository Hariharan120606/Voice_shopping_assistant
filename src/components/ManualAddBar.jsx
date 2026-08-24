import { useState } from "react";
import { Plus } from "lucide-react";
import { useShoppingList } from "../context/ShoppingListContext";

export default function ManualAddBar() {
  const [text, setText] = useState("");
  const { addItem } = useShoppingList();

  const submit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    addItem(trimmed, 1);
    setText("");
  };

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Or type an item to add..."
        className="flex-1 min-w-0 text-sm bg-white rounded-2xl shadow-sm px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-brand-200 placeholder:text-gray-400"
      />
      <button
        type="submit"
        aria-label="Add item"
        className="w-10 h-10 shrink-0 rounded-2xl bg-brand-500 text-white flex items-center justify-center hover:bg-brand-600 transition-colors"
      >
        <Plus className="w-5 h-5" />
      </button>
    </form>
  );
}
