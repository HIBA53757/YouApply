export function getFollowedOffers() {
  try {
    const followedOffers = JSON.parse(localStorage.getItem("followedOffers") || "[]");
    return Array.isArray(followedOffers) ? followedOffers.map(Number) : [];
  } catch {
    return [];
  }
}

export function toggleFollowedOffer(offerId) {
  const id = Number(offerId);
  const followedOffers = getFollowedOffers();
  if (followedOffers.includes(id)) {
    localStorage.setItem("followedOffers", JSON.stringify(followedOffers.filter((offerId) => offerId !== id)));
    return false;
  }
  localStorage.setItem("followedOffers", JSON.stringify([...followedOffers, id]));
  return true;
}
