let offers = [];

const searchInput = document.getElementById("search-keyword");
const searchButton = document.getElementById("search-button");
const offersList = document.getElementById("Offers_List");
const resultsCount = document.getElementById("results-count");

async function loadOffers() {
    try {
        const response = await fetch("../data/offers.json");
        if (!response.ok) {
            throw new Error("Erreur lors du chargement des offres");
        }
        offers = await response.json();
        displayOffers(offers);
    } catch (error) {
        console.error(error);
    }
}
function searchOffers() {
    const keyword = searchInput.value.toLowerCase().trim();
    const filteredOffers = offers.filter(function (offer) {

        const title = offer.job_title.toLowerCase();
        const company = offer.company.toLowerCase();
        const description = offer.description.toLowerCase();

        return (
            title.includes(keyword) ||
            company.includes(keyword) ||
            description.includes(keyword)
        );
    });

    displayOffers(filteredOffers);
}
function displayOffers(offersToDisplay) {
    offersList.innerHTML = "";
    resultsCount.textContent = offersToDisplay.length;
    offersToDisplay.forEach(function (offer) {
        const article = document.createElement("article");
        article.className =
            "bg-white rounded-2xl border border-slate-200 shadow-sm p-5";
        article.innerHTML = `
            <h2 class="text-lg font-bold text-slate-800">
                ${offer.job_title}
            </h2>
            <p class="text-sm text-slate-600 mt-1">
                ${offer.company}
            </p>
            <p class="text-sm text-slate-500 mt-2">
                ${offer.location}
            </p>
            <p class="text-sm text-slate-600 mt-3">
                ${offer.description}
            </p>
        `;
        offersList.appendChild(article);
    });
}

searchButton.addEventListener("click", searchOffers);
loadOffers();