import { getFollowedOffers } from "./storage.js";

let selectedContract = "all";

function showFollowedOffers() {
  const followedIds = getFollowedOffers() || [];
  const articles = document.querySelectorAll("article[data-offer-id]");
  let count = 0;

  articles.forEach((article) => {
    const id = Number(article.dataset.offerId);
    const isFollowed = followedIds.includes(id);
    const contractMatch =
      selectedContract === "all" || article.dataset.contract === selectedContract;

    if (isFollowed && contractMatch) {
      article.style.display = "";
      count++;
    } else {
      article.style.display = "none";
    }
  });

  document.querySelector("#empty-followed-offers").classList.toggle("hidden", count > 0);
}

const contractTabs = document.querySelectorAll(".contract-tab");

contractTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    selectedContract = tab.dataset.contract;

    contractTabs.forEach((btn) => {
      btn.classList.remove("bg-blue-700", "text-white", "shadow-sm");
      btn.classList.add("bg-slate-100", "text-slate-600", "hover:bg-slate-200");
    });
    tab.classList.remove("bg-slate-100", "text-slate-600", "hover:bg-slate-200");
    tab.classList.add("bg-blue-700", "text-white", "shadow-sm");

    showFollowedOffers();
  });
});

showFollowedOffers();