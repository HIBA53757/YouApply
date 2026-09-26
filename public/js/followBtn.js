import { getFollowedOffers, toggleFollowedOffer } from "./storage.js";

function setState(button, followed) {
  const svg = button.querySelector("svg");
  svg.setAttribute("fill", followed ? "currentColor" : "none");
  button.classList.toggle("text-blue-700", followed);
  button.classList.toggle("hover:text-blue-900", followed);
  button.classList.toggle("text-slate-300", !followed);
  button.classList.toggle("hover:text-slate-500", !followed);
}

function syncButtons() {
  document.querySelectorAll("button[data-offer-id]").forEach((button) => {
    setState(button, getFollowedOffers().includes(Number(button.dataset.offerId)));
  });
}

syncButtons();
document.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-offer-id]");
  if (!button) return;
  const followed = toggleFollowedOffer(button.dataset.offerId);
  syncButtons();
  if (document.body.dataset.page === "followed" && !followed) {
    document.dispatchEvent(new CustomEvent("followed-offers-changed"));
  }
});
