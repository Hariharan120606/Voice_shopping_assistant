import { ShoppingBasket } from "lucide-react";

export default function Header({ itemCount }) {
  return (
    <header className="flex items-center justify-between px-4 pt-5 pb-2">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center">
          <ShoppingBasket className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-gray-800 leading-tight">Voice Cart</h1>
          <p className="text-[11px] text-gray-400 leading-tight">
            {itemCount} item{itemCount === 1 ? "" : "s"} on your list
          </p>
        </div>
      </div>
    </header>
  );
}
