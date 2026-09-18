import { getData } from "./data.js";
import { disply_offers } from "./render.js";
import { getFollowedOffers } from "./storage.js";

async function displayFollowedOffers() {
  const offersList = document.querySelector("#Offers_List");
  offersList.innerHTML = "";

  const offers = await getData();
  const followedIds = getFollowedOffers() || [];

  const followedOffers = offers.filter((offer) =>
    followedIds.includes(Number(offer.id)),
  );

  const emptyState = document.querySelector("#empty-followed-offers");
  emptyState.classList.toggle("hidden", followedOffers.length > 0);

  disply_offers(followedOffers);
}

displayFollowedOffers();
