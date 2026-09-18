function getFollowedOffers() {
  const followedOffers = localStorage.getItem("followedOffers");
  console.log(followedOffers);

  //  convert it back to an array
  //  return the array
}

function saveFollowedOffers(followedOffers) {

  localStorage.setItem("followedOffers", followedOffers);

  //  convert the array to a string
  //  save it in localStorage
}

getFollowedOffers();
saveFollowedOffers("test")
