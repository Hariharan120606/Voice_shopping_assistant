// Product catalog: acts as a lightweight "knowledge base" for categorization,
// search, substitutes, and seasonal logic. In production this would live in
// a real product database (e.g. Firestore / Postgres).

export const CATALOG = [
  { name: "milk", category: "Dairy", brand: "Farmhouse", price: 3.5, season: null, substitutes: ["almond milk", "oat milk", "soy milk"] },
  { name: "almond milk", category: "Dairy", brand: "Silk", price: 4.2, season: null, substitutes: ["oat milk", "milk"] },
  { name: "oat milk", category: "Dairy", brand: "Oatly", price: 4.5, season: null, substitutes: ["almond milk", "milk"] },
  { name: "soy milk", category: "Dairy", brand: "Silk", price: 3.9, season: null, substitutes: ["almond milk", "milk"] },
  { name: "cheese", category: "Dairy", brand: "Kraft", price: 5.0, season: null, substitutes: ["vegan cheese"] },
  { name: "yogurt", category: "Dairy", brand: "Chobani", price: 1.5, season: null, substitutes: ["greek yogurt"] },
  { name: "butter", category: "Dairy", brand: "Amul", price: 4.0, season: null, substitutes: ["margarine"] },
  { name: "eggs", category: "Dairy", brand: "Farmhouse", price: 3.2, season: null, substitutes: ["egg substitute"] },

  { name: "bread", category: "Bakery", brand: "Wonder", price: 2.8, season: null, substitutes: ["whole wheat bread", "sourdough bread"] },
  { name: "whole wheat bread", category: "Bakery", brand: "Nature's Own", price: 3.2, season: null, substitutes: ["bread"] },
  { name: "sourdough bread", category: "Bakery", brand: "Local Bakery", price: 4.5, season: null, substitutes: ["bread"] },
  { name: "bagel", category: "Bakery", brand: "Thomas'", price: 3.0, season: null, substitutes: ["bread"] },

  { name: "apples", category: "Produce", brand: "Generic", price: 1.2, season: "fall", substitutes: ["pears"] },
  { name: "organic apples", category: "Produce", brand: "Organic Farms", price: 2.0, season: "fall", substitutes: ["apples", "pears"] },
  { name: "bananas", category: "Produce", brand: "Chiquita", price: 0.6, season: "all", substitutes: ["plantains"] },
  { name: "oranges", category: "Produce", brand: "Sunkist", price: 0.9, season: "winter", substitutes: ["tangerines"] },
  { name: "tomatoes", category: "Produce", brand: "Generic", price: 1.8, season: "summer", substitutes: ["cherry tomatoes"] },
  { name: "spinach", category: "Produce", brand: "Generic", price: 2.5, season: "spring", substitutes: ["kale"] },
  { name: "pumpkin", category: "Produce", brand: "Generic", price: 3.0, season: "fall", substitutes: ["squash"] },
  { name: "strawberries", category: "Produce", brand: "Driscoll's", price: 3.5, season: "spring", substitutes: ["raspberries"] },
  { name: "potatoes", category: "Produce", brand: "Generic", price: 1.0, season: "all", substitutes: ["sweet potatoes"] },
  { name: "onions", category: "Produce", brand: "Generic", price: 0.8, season: "all", substitutes: ["shallots"] },

  { name: "chips", category: "Snacks", brand: "Lay's", price: 2.5, season: null, substitutes: ["pretzels", "popcorn"] },
  { name: "pretzels", category: "Snacks", brand: "Rold Gold", price: 2.2, season: null, substitutes: ["chips"] },
  { name: "popcorn", category: "Snacks", brand: "Orville", price: 1.8, season: null, substitutes: ["chips"] },
  { name: "cookies", category: "Snacks", brand: "Oreo", price: 3.0, season: null, substitutes: ["biscuits"] },
  { name: "chocolate", category: "Snacks", brand: "Hershey's", price: 2.0, season: null, substitutes: ["candy"] },

  { name: "water", category: "Beverages", brand: "Aquafina", price: 1.0, season: "summer", substitutes: ["sparkling water"] },
  { name: "sparkling water", category: "Beverages", brand: "LaCroix", price: 1.4, season: "summer", substitutes: ["water"] },
  { name: "orange juice", category: "Beverages", brand: "Tropicana", price: 3.8, season: "winter", substitutes: ["apple juice"] },
  { name: "coffee", category: "Beverages", brand: "Folgers", price: 6.5, season: "winter", substitutes: ["tea"] },
  { name: "tea", category: "Beverages", brand: "Lipton", price: 4.0, season: "winter", substitutes: ["coffee"] },
  { name: "soda", category: "Beverages", brand: "Coca-Cola", price: 1.5, season: "summer", substitutes: ["sparkling water"] },

  { name: "toothpaste", category: "Household", brand: "Colgate", price: 3.0, season: null, substitutes: ["mouthwash"] },
  { name: "shampoo", category: "Household", brand: "Head & Shoulders", price: 5.5, season: null, substitutes: ["conditioner"] },
  { name: "paper towels", category: "Household", brand: "Bounty", price: 4.0, season: null, substitutes: ["napkins"] },
  { name: "detergent", category: "Household", brand: "Tide", price: 8.0, season: null, substitutes: ["soap"] },

  { name: "chicken", category: "Meat", brand: "Generic", price: 6.0, season: null, substitutes: ["tofu", "turkey"] },
  { name: "beef", category: "Meat", brand: "Generic", price: 9.0, season: null, substitutes: ["chicken"] },
  { name: "tofu", category: "Meat", brand: "House Foods", price: 2.5, season: null, substitutes: ["chicken"] },
  { name: "fish", category: "Meat", brand: "Generic", price: 8.5, season: null, substitutes: ["tofu"] },
];

// A synonym map so casual phrasing ("cola", "veggies") still resolves to a
// catalog item / category. Used by the NLP layer.
export const SYNONYMS = {
  cola: "soda",
  pop: "soda",
  veggies: "produce",
  vegetables: "produce",
  fruit: "produce",
  fruits: "produce",
};

export function findProduct(name) {
  const clean = name.trim().toLowerCase();
  return (
    CATALOG.find((p) => p.name === clean) ||
    CATALOG.find((p) => p.name.includes(clean) || clean.includes(p.name))
  );
}

export function categorize(name) {
  const product = findProduct(name);
  return product ? product.category : "Other";
}

export function getSubstitutes(name) {
  const product = findProduct(name);
  return product?.substitutes ?? [];
}

export const CATEGORY_ORDER = [
  "Dairy",
  "Produce",
  "Bakery",
  "Meat",
  "Beverages",
  "Snacks",
  "Household",
  "Other",
];

export const CATEGORY_COLORS = {
  Dairy: "bg-blue-100 text-blue-700",
  Produce: "bg-green-100 text-green-700",
  Bakery: "bg-amber-100 text-amber-700",
  Meat: "bg-red-100 text-red-700",
  Beverages: "bg-cyan-100 text-cyan-700",
  Snacks: "bg-purple-100 text-purple-700",
  Household: "bg-slate-100 text-slate-700",
  Other: "bg-gray-100 text-gray-700",
};
