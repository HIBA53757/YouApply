export function getFollowedOffers() {
  try {
    const followedOffers = JSON.parse(localStorage.getItem("followedOffers") || "[]");
    return Array.isArray(followedOffers) ? followedOffers.map(Number) : [];
  } catch {
    return [];
  }
}

export function saveFollowedOffers(followedOffers) {
  localStorage.setItem("followedOffers", JSON.stringify(followedOffers));
}

export function unfollowOffer(offerId) {
  const followedOffers = getFollowedOffers();
  const updateOffer = followedOffers.filter((id) => id !== Number(offerId));
  saveFollowedOffers(updateOffer);
}

export function toggleFollowedOffer(offerId) {
  const id = Number(offerId);
  const followedOffers = getFollowedOffers();
  if (followedOffers.includes(id)) {
    saveFollowedOffers(followedOffers.filter((offerId) => offerId !== id));
    return false;
  }
  saveFollowedOffers([...followedOffers, id]);
  return true;
}
