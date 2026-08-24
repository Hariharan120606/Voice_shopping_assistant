import { ShoppingCart } from "lucide-react";
import { useShoppingList } from "../context/ShoppingListContext";
import { CATEGORY_ORDER, CATEGORY_COLORS } from "../data/catalog";
import ListItem from "./ListItem";

export default function ShoppingList({ filterFn }) {
  const { items } = useShoppingList();
  const visible = filterFn ? items.filter(filterFn) : items;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 text-gray-400">
        <ShoppingCart className="w-10 h-10 mb-3" />
        <p className="font-medium">Your list is empty</p>
        <p className="text-sm">Try saying "Add milk" or "I need bananas"</p>
      </div>
    );
  }

  if (visible.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400 text-sm">
        No items match your search.
      </div>
    );
  }

  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: visible.filter((i) => i.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="space-y-5">
      {grouped.map((group) => (
        <div key={group.category}>
          <div className="flex items-center gap-2 mb-2 px-1">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${CATEGORY_COLORS[group.category]}`}
            >
              {group.category}
            </span>
            <span className="text-xs text-gray-400">{group.items.length}</span>
          </div>
          <ul className="space-y-2">
            {group.items.map((item) => (
              <ListItem key={item.id} item={item} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
