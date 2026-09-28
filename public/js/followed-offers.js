import { displayOffers } from "./render.js";
import { getFollowedOffers } from "./storage.js";

let offers = [];
let selectedContract = "all";
const tabs = [...document.querySelectorAll(".contract-tab")];

function contractType(offer) {
  const type = String(offer.type_contrat || "").toLowerCase();
  if (type.includes("stage")) return "stage";
  if (type.includes("alternance")) return "alternance";
  return "";
}

function displayFollowedOffers() {
  const followed = getFollowedOffers();
  const savedOffers = offers.filter((offer) => followed.includes(Number(offer.id)));
  const counts = { stage: 0, alternance: 0 };
  savedOffers.forEach((offer) => {
    const type = contractType(offer);
    if (type) counts[type] += 1;
  });
  document.querySelectorAll(".contract-count").forEach((count) => {
    count.textContent = `(${counts[count.dataset.count] || 0})`;
  });

  const visible = selectedContract === "all"
    ? savedOffers
    : savedOffers.filter((offer) => contractType(offer) === selectedContract);
  displayOffers(visible);
  document.querySelector("#empty-followed-offers")?.classList.toggle("hidden", visible.length > 0);
}

tabs.forEach((tab) => tab.addEventListener("click", () => {
  selectedContract = tab.dataset.contract;
  tabs.forEach((item) => {
    item.classList.remove("bg-blue-700", "text-white", "shadow-sm");
    item.classList.add("bg-slate-100", "text-slate-600", "hover:bg-slate-200");
  });
  tab.classList.remove("bg-slate-100", "text-slate-600", "hover:bg-slate-200");
  tab.classList.add("bg-blue-700", "text-white", "shadow-sm");
  displayFollowedOffers();
}));

document.addEventListener("followed-offers-changed", displayFollowedOffers);

try {
  const followedIds = getFollowedOffers();
  const query = new URLSearchParams({ ids: followedIds.join(",") });
  const response = await fetch(`/api/offres?${query}`);
  if (!response.ok) throw new Error("Erreur de chargement des offres");
  offers = await response.json();
  displayFollowedOffers();
} catch (error) {
  console.error(error);
  const emptyState = document.querySelector("#empty-followed-offers");
  if (emptyState) {
    emptyState.classList.remove("hidden");
    emptyState.querySelector("h3").textContent = "Les offres suivies n'ont pas pu être chargées";
    emptyState.querySelector("p").textContent = "Veuillez réessayer dans quelques instants.";
  }
}
