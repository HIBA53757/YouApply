import { getData } from "./data.js";
import { disply_offers } from "./render.js";

let offers = [];

const searchInput = document.getElementById("search-keyword");
const cityInput = document.getElementById("search-city");
const searchButton = document.getElementById("search-button");
const sortSelect = document.getElementById("sort-select");

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

    const selectedContract = document.querySelector(
        ".contract-filter.bg-white"
    ).dataset.contract;

    const articles = offersList.querySelectorAll("article");

    let visibleOffers = 0;

    offers.forEach(function (offer, index) {
        const title = offer.job_title.toLowerCase();
        const company = offer.company.toLowerCase();
        const description = offer.description.toLowerCase();
        const location = offer.location.toLowerCase();

        const keywordMatch =
            title.includes(keyword) ||
            company.includes(keyword) ||
            description.includes(keyword);

        const cityMatch = location.includes(city);

        const technologyMatch =
            selectedTechnologies.length === 0 ||
            selectedTechnologies.every(function (technology) {
                return offer.skills.includes(technology);
            });

        const contractMatch =
            selectedContract === "all" ||
            offer.opp_type.toLowerCase() === selectedContract;

        const showOffer =
            keywordMatch &&
            cityMatch &&
            technologyMatch &&
            contractMatch;

        if (showOffer) {
            articles[index].style.display = "";
            visibleOffers++;
        } else {
            articles[index].style.display = "none";
        }
    });

    resultsCount.textContent = visibleOffers;
}

function sortOffers() {
    const sortType = sortSelect.value;

    offers.sort(function (a, b) {
        const dateA = new Date(a.published_at);
        const dateB = new Date(b.published_at);

        if (sortType === "recent") {
            return dateB - dateA;
        }

        if (sortType === "oldest") {
            return dateA - dateB;
        }
    });

    offersList.innerHTML = "";

    disply_offers(offers);

    searchOffers();
}

function resetFilters() {
    searchInput.value = "";
    cityInput.value = "";

    document.querySelectorAll(".technology-filter").forEach(function (checkbox) {
        checkbox.checked = false;
    });

    document.querySelectorAll(".work-mode-filter").forEach(function (checkbox) {
        checkbox.checked = false;
    });

    document.querySelectorAll(".contract-filter").forEach(function (button) {
        button.classList.remove(
            "bg-white",
            "text-slate-800",
            "shadow-sm"
        );

        button.classList.add("text-slate-600");
    });

    const allContract = document.querySelector(
        '.contract-filter[data-contract="all"]'
    );

    allContract.classList.remove("text-slate-600");

    allContract.classList.add(
        "bg-white",
        "text-slate-800",
        "shadow-sm"
    );

    document.querySelectorAll(".duration-filter").forEach(function (button) {
        button.classList.remove("bg-blue-700", "text-white");
        button.classList.add("bg-slate-100", "text-slate-700");
    });

    sortSelect.value = "recent";

    offers.sort(function (a, b) {
        return new Date(b.published_at) - new Date(a.published_at);
    });

    offersList.innerHTML = "";

    disply_offers(offers);

    resultsCount.textContent = offers.length;
}

searchButton.addEventListener("click", searchOffers);

technologyFilters.addEventListener("change", searchOffers);

sortSelect.addEventListener("change", sortOffers);

const resetButtons = document.querySelectorAll(".reset-filters");

resetButtons.forEach(function (button) {
    button.addEventListener("click", resetFilters);
});

document.querySelectorAll(".contract-filter").forEach(function (button) {
    button.addEventListener("click", function () {

        document.querySelectorAll(".contract-filter").forEach(function (button) {
            button.classList.remove(
                "bg-white",
                "text-slate-800",
                "shadow-sm"
            );

            button.classList.add("text-slate-600");
        });

        button.classList.remove("text-slate-600");

        button.classList.add(
            "bg-white",
            "text-slate-800",
            "shadow-sm"
        );

        searchOffers();
    });
});

loadOffers();