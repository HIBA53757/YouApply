import { getFollowedOffers, saveFollowedOffers, unfollowOffer } from "./storage.js";

function setState(button, followed) {
  const svg = button.querySelector("svg");
  svg.setAttribute("fill", followed ? "currentColor" : "none");
  button.classList.toggle("text-blue-700", followed);
  button.classList.toggle("hover:text-blue-900", followed);
  button.classList.toggle("text-slate-300", !followed);
  button.classList.toggle("hover:text-slate-500", !followed);
}

document.querySelectorAll("#Offers_List button[data-offer-id]").forEach((button) => {
  const id = Number(button.dataset.offerId);

  setState(button, getFollowedOffers().includes(id));

  button.addEventListener("click", () => {
    const followedOffers = getFollowedOffers();

    if (followedOffers.includes(id)) {
      unfollowOffer(id);
      setState(button, false);
    } else {
      followedOffers.push(id);
      saveFollowedOffers(followedOffers);
      setState(button, true);
    }
  });
});