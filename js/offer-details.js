function findSelectedId() {
  const param = new URLSearchParams(window.location.search);
  const offerId = param.get("id");
  return offerId;
}

function findOffer(offers, offerId) {
  return offers.find((offer) => offer.id === Number(offerId));
}

async function loadOffers() {
  const response = await fetch("../data/offers.json");
  const offers = await response.json();

  const offerId = findSelectedId();
  const selectedOffer = findOffer(offers, offerId);

  console.log(selectedOffer);
}

loadOffers();

// console.log(findSelectedId());
