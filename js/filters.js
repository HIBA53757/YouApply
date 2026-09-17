import { getData } from "./data.js";

let offers = [];

const searchInput = document.getElementById("search-keyword");
const cityInput = document.getElementById("search-city");
const searchButton = document.getElementById("search-button");

const offersList = document.getElementById("Offers_List");
const resultsCount = document.getElementById("results-count");
const technologyFilters = document.getElementById("technology-filters");


async function loadOffers() {
    try {
        offers = await getData();
        displayTechnologies();
        resultsCount.textContent = offers.length;
    } catch (error) {
        console.error(error);
    }
}


function displayTechnologies() {
    const technologies = [];
    offers.forEach(function (offer) {
        offer.skills.forEach(function (skill) {
            if (!technologies.includes(skill)) {
                technologies.push(skill);
            }
        });
    });

    technologies.forEach(function (technology) {
        const label = document.createElement("label");
        label.className = "flex items-center gap-2 cursor-pointer";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = technology;
        checkbox.className = "technology-filter";

        const span = document.createElement("span");
        span.className = "text-sm text-slate-700";
        span.textContent = technology;

        label.appendChild(checkbox);
        label.appendChild(span);

        technologyFilters.appendChild(label);
    });
}

function searchOffers() {
    const keyword = searchInput.value.toLowerCase().trim();
    const city = cityInput.value.toLowerCase().trim();

    const selectedTechnologies = Array.from(
        document.querySelectorAll(".technology-filter:checked")
    ).map(function (checkbox) {
        return checkbox.value;
    });
    const articles = offersList.querySelectorAll("article");
    let visibleOffers = 0;
    offers.forEach(function (offer, index) {

        const title = offer.job_title.toLowerCase();
        const company = offer.company.toLowerCase();
        const description = offer.description.toLowerCase();

        const keywordMatch = title.includes(keyword) || company.includes(keyword) || description.includes(keyword);
        const location = offer.location.toLowerCase();

        const cityMatch =
            location.includes(city);

        const technologyMatch = selectedTechnologies.length === 0 || selectedTechnologies.every(function (technology) {
                return offer.skills.includes(technology);

            });

        const showOffer = keywordMatch && cityMatch && technologyMatch;
        if (showOffer) {
            articles[index].style.display = "";
            visibleOffers++;
        } else {
            articles[index].style.display = "none";
        }
    });
    resultsCount.textContent = visibleOffers;
}
searchButton.addEventListener("click", searchOffers);
technologyFilters.addEventListener("change", searchOffers);

loadOffers();