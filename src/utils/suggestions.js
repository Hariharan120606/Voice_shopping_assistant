import { CATALOG, getSubstitutes } from "../data/catalog";
import { getItemsRunningLow, getCurrentSeason } from "../data/history";

export function getRunningLowSuggestions(currentListNames) {
  const low = getItemsRunningLow();
  return low
    .filter((item) => !currentListNames.includes(item))
    .map((item) => ({
      type: "running_low",
      item,
      message: `It looks like you're running low on ${item}.`,
    }));
}

export function getSeasonalSuggestions(currentListNames) {
  const season = getCurrentSeason();
  return CATALOG.filter(
    (p) =>
      (p.season === season || p.season === "all") &&
      !currentListNames.includes(p.name)
  )
    .slice(0, 4)
    .map((p) => ({
      type: "seasonal",
      item: p.name,
      message: `${cap(p.name)} is in season right now — want to add it?`,
    }));
}

export function getSubstituteSuggestion(itemName) {
  const subs = getSubstitutes(itemName);
  if (!subs.length) return null;
  return {
    type: "substitute",
    item: itemName,
    substitutes: subs,
    message: `${cap(itemName)} not available? Try ${subs
      .slice(0, 2)
      .join(" or ")} instead.`,
  };
}

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
