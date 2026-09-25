const searchInput = document.getElementById("search-keyword");
const cityInput = document.getElementById("search-city");
const searchButton = document.getElementById("search-button");
const sortSelect = document.getElementById("sort-select");

const offersList = document.getElementById("Offers_List");
const resultsCount = document.getElementById("results-count");
const technologyFilters = document.getElementById("technology-filters");
const workModeFilters = document.getElementById("work-mode-filters");
const noResults = document.getElementById("no-results");

const articles = Array.from(offersList.querySelectorAll("article"));

function getOfferData(article) {
  const title = article.querySelector("h2")?.textContent.trim() || "";
  const company = article.querySelector(".text-slate-700 span")?.textContent.trim() || "";
  const contract = article.querySelector(".bg-blue-100")?.textContent.trim() || "";
  const location = article.querySelector(".text-slate-500")?.textContent.trim() || "";
  const description = article.querySelector("p")?.textContent.trim() || "";
  const skills = Array.from(article.querySelectorAll(".bg-slate-100")).map((skill) =>
    skill.textContent.trim()
  );

  return {
    title: title.toLowerCase(),
    company: company.toLowerCase(),
    contract: contract.toLowerCase(),
    location: location.toLowerCase(),
    description: description.toLowerCase(),
    skills: skills.map((skill) => skill.toLowerCase()),
  };
}

function getWorkMode(article) {
  return (article.dataset.workMode || "").toLowerCase();
}

function filterByContract(offer, selectedContract) {
  return selectedContract === "all" || offer.contract === selectedContract;
}

function searchOffers() {
  const keyword = searchInput.value.toLowerCase().trim();
  const city = cityInput.value.toLowerCase().trim();

  const selectedTechnologies = Array.from(
    document.querySelectorAll(".technology-filter:checked")
  ).map((checkbox) => checkbox.value.toLowerCase());

  const selectedWorkModes = Array.from(
    document.querySelectorAll(".work-mode-filter:checked")
  ).map((checkbox) => checkbox.dataset.workMode.toLowerCase());

  const selectedContract =
    document.querySelector(".contract-filter.bg-white")?.dataset.contract || "all";

  let visibleOffers = 0;

  articles.forEach((article) => {
    const offer = getOfferData(article);

    const keywordMatch =
      !keyword ||
      offer.title.includes(keyword) ||
      offer.company.includes(keyword) ||
      offer.description.includes(keyword);

    const cityMatch = !city || offer.location.includes(city);

    const technologyMatch =
      selectedTechnologies.length === 0 ||
      selectedTechnologies.every((technology) => offer.skills.includes(technology));

    const contractMatch = filterByContract(offer, selectedContract);

    const workModeMatch =
      selectedWorkModes.length === 0 || selectedWorkModes.includes(getWorkMode(article));

    const showOffer =
      keywordMatch && cityMatch && technologyMatch && contractMatch && workModeMatch;

    article.style.display = showOffer ? "" : "none";
    if (showOffer) visibleOffers++;
  });

  resultsCount.textContent = visibleOffers;

  if (noResults) {
    noResults.classList.toggle("hidden", visibleOffers !== 0);
  }
}

function getDateFromArticle(article) {
  const text = article.textContent;
  const match = text.match(/Début le\s+(\d{2}\/\d{2}\/\d{4})/);
  if (!match) return 0;
  const [day, month, year] = match[1].split("/");
  return new Date(`${year}-${month}-${day}`).getTime();
}

function sortOffers() {
  const sortType = sortSelect.value;

  const sortedArticles = [...articles].sort((a, b) => {
    const dateA = getDateFromArticle(a);
    const dateB = getDateFromArticle(b);
    return sortType === "recent" ? dateB - dateA : dateA - dateB;
  });

  sortedArticles.forEach((article) => offersList.appendChild(article));
  searchOffers();
}

function resetFilters() {
  searchInput.value = "";
  cityInput.value = "";

  document.querySelectorAll(".technology-filter").forEach((checkbox) => {
    checkbox.checked = false;
  });

  document.querySelectorAll(".work-mode-filter").forEach((checkbox) => {
    checkbox.checked = false;
  });

  document.querySelectorAll(".contract-filter").forEach((button) => {
    button.classList.remove("bg-white", "text-slate-800", "shadow-sm");
    button.classList.add("text-slate-600");
  });

  const allContract = document.querySelector('.contract-filter[data-contract="all"]');
  allContract.classList.remove("text-slate-600");
  allContract.classList.add("bg-white", "text-slate-800", "shadow-sm");

  sortSelect.value = "recent";

  articles.forEach((article) => {
    offersList.appendChild(article);
    article.style.display = "";
  });

  resultsCount.textContent = articles.length;

  if (noResults) noResults.classList.add("hidden");
}

// --- Filtre mobile (accordéon) ---
const filterToggleBtn = document.getElementById("filter-toggle-btn");
const filterContent = document.getElementById("filter-content");
const filterChevron = document.getElementById("filter-chevron");

if (filterToggleBtn && filterContent) {
  filterToggleBtn.addEventListener("click", () => {
    filterContent.classList.toggle("grid-rows-[1fr]");
    if (filterChevron) filterChevron.classList.toggle("rotate-180");
  });
}

// --- Listeners ---
if (searchButton) searchButton.addEventListener("click", searchOffers);
if (searchInput) searchInput.addEventListener("input", searchOffers);
if (cityInput) cityInput.addEventListener("input", searchOffers);
if (sortSelect) sortSelect.addEventListener("change", sortOffers);
if (workModeFilters) workModeFilters.addEventListener("change", searchOffers);
if (technologyFilters) technologyFilters.addEventListener("change", searchOffers);

document.querySelectorAll(".contract-filter").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".contract-filter").forEach((btn) => {
      btn.classList.remove("bg-white", "text-slate-800", "shadow-sm");
      btn.classList.add("text-slate-600");
    });

    button.classList.remove("text-slate-600");
    button.classList.add("bg-white", "text-slate-800", "shadow-sm");

    searchOffers();
  });
});

document.querySelectorAll(".reset-filters").forEach((button) => {
  button.addEventListener("click", resetFilters);
});