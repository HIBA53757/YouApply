const followedOffersIds = [];

export function getFollowedOffers() {
  const followedOffers = localStorage.getItem("followedOffers");
  return JSON.parse(followedOffers);

}

export function saveFollowedOffers(followedOffers) {
  localStorage.setItem("followedOffers", JSON.stringify(followedOffers));
}

getFollowedOffers();
saveFollowedOffers(followedOffersIds);
