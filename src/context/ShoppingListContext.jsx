import { createContext, useContext, useReducer, useCallback } from "react";
import { categorize } from "../data/catalog";

const ShoppingListContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case "ADD_ITEM": {
      const { name, quantity } = action.payload;
      const existing = state.items.find(
        (i) => i.name.toLowerCase() === name.toLowerCase()
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === existing.id
              ? { ...i, quantity: i.quantity + quantity }
              : i
          ),
        };
      }
      const newItem = {
        id: crypto.randomUUID(),
        name,
        quantity,
        category: categorize(name),
        checked: false,
        addedAt: Date.now(),
      };
      return { ...state, items: [newItem, ...state.items] };
    }
    case "REMOVE_ITEM": {
      const { name } = action.payload;
      return {
        ...state,
        items: state.items.filter(
          (i) => i.name.toLowerCase() !== name.toLowerCase()
        ),
      };
    }
    case "TOGGLE_ITEM": {
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, checked: !i.checked } : i
        ),
      };
    }
    case "SET_QUANTITY": {
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload.id
            ? { ...i, quantity: Math.max(1, action.payload.quantity) }
            : i
        ),
      };
    }
    case "CLEAR_CHECKED": {
      return { ...state, items: state.items.filter((i) => !i.checked) };
    }
    default:
      return state;
  }
}

export function ShoppingListProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { items: [] });

  const addItem = useCallback(
    (name, quantity = 1) => dispatch({ type: "ADD_ITEM", payload: { name, quantity } }),
    []
  );
  const removeItem = useCallback(
    (name) => dispatch({ type: "REMOVE_ITEM", payload: { name } }),
    []
  );
  const toggleItem = useCallback(
    (id) => dispatch({ type: "TOGGLE_ITEM", payload: { id } }),
    []
  );
  const setQuantity = useCallback(
    (id, quantity) => dispatch({ type: "SET_QUANTITY", payload: { id, quantity } }),
    []
  );
  const clearChecked = useCallback(() => dispatch({ type: "CLEAR_CHECKED" }), []);

  return (
    <ShoppingListContext.Provider
      value={{ items: state.items, addItem, removeItem, toggleItem, setQuantity, clearChecked }}
    >
      {children}
    </ShoppingListContext.Provider>
  );
}

export function useShoppingList() {
  const ctx = useContext(ShoppingListContext);
  if (!ctx) throw new Error("useShoppingList must be used within ShoppingListProvider");
  return ctx;
}
