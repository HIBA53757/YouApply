export function getFollowedOffers() {
  const followedOffers = localStorage.getItem("followedOffers");
  return followedOffers ? JSON.parse(followedOffers) : [];
}

export function saveFollowedOffers(followedOffers) {
  localStorage.setItem("followedOffers", JSON.stringify(followedOffers));
}

export function unfollowOffer(offerId) {
  const followedOffers = getFollowedOffers();
  const updateOffer = followedOffers.filter((id) => id !== Number(offerId));
  saveFollowedOffers(updateOffer);
}
