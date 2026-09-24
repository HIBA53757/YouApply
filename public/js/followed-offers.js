import { getData } from "./data.js";
import { disply_offers } from "./render.js";
import { getFollowedOffers } from "./storage.js";
import { filterByContract } from "./filters.js";

let selectedContract = "all";

async function displayFollowedOffers() {
  const offersList = document.querySelector("#Offers_List");
  offersList.innerHTML = "";

  const offers = await getData();
  const followedIds = getFollowedOffers() || [];

  const followedOffers = offers
    .filter((offer) => followedIds.includes(Number(offer.id)))
    .filter((offer) => filterByContract(offer, selectedContract));

  const emptyState = document.querySelector("#empty-followed-offers");
  emptyState.classList.toggle("hidden", followedOffers.length > 0);

  disply_offers(followedOffers);
}

const contractTabs = document.querySelectorAll(".contract-tab");

contractTabs.forEach((tab) => {
  tab.addEventListener("click", function () {
    selectedContract = tab.dataset.contract;

    contractTabs.forEach((btn) => {
      btn.classList.remove("bg-blue-700", "text-white", "shadow-sm");
      btn.classList.add("bg-slate-100", "text-slate-600", "hover:bg-slate-200");
    });
    tab.classList.remove("bg-slate-100", "text-slate-600", "hover:bg-slate-200");
    tab.classList.add("bg-blue-700", "text-white", "shadow-sm");

    displayFollowedOffers();
  });
});

displayFollowedOffers();