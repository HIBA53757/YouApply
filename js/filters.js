import { getData } from "./data.js";
import { disply_offers } from "./render.js";
const WORK_MODES = [
    { code: "hybride", label: "Hybride" },
    { code: "remote", label: "Télétravail 100%" },
    { code: "presentiel", label: "Présentiel" },
];

const DURATIONS = [
    { code: "1-2", label: "1 à 2 mois" },
    { code: "3-6", label: "3 à 6 mois" },
    { code: "1-year", label: "1 an" },
    { code: "2-years", label: "2 ans" },
];

let offers = [];

const searchInput = document.getElementById("search-keyword");
const cityInput = document.getElementById("search-city");
const searchButton = document.getElementById("search-button");
const sortSelect = document.getElementById("sort-select");

const offersList = document.getElementById("Offers_List");
const resultsCount = document.getElementById("results-count");
const technologyFilters = document.getElementById("technology-filters");
const workModeFilters = document.getElementById("work-mode-filters");
const durationFilters = document.getElementById("duration-filters");
const noResults = document.getElementById("no-results");

async function loadOffers() {
    try {
        offers = await getData();
        displayTechnologies();
        displayWorkModes();
        displayDurations();
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
function displayWorkModes() {
    WORK_MODES.forEach(function (mode) {
        const label = document.createElement("label");
        label.className = "flex items-center justify-between cursor-pointer group";

        const wrapper = document.createElement("div");
        wrapper.className = "flex items-center gap-3";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.dataset.workMode = mode.code;
        checkbox.className =
            "work-mode-filter w-5 h-5 text-blue-700 bg-white border-slate-300 rounded focus:ring-blue-500 focus:ring-2 accent-blue-700";

        const span = document.createElement("span");
        span.className = "text-sm text-slate-700";
        span.textContent = mode.label;

        wrapper.appendChild(checkbox);
        wrapper.appendChild(span);
        label.appendChild(wrapper);
        workModeFilters.appendChild(label);
    });
    workModeFilters.addEventListener("change", searchOffers);
}
function displayDurations() {
    DURATIONS.forEach(function (duration) {
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.duration = duration.code;
        button.className =
            "duration-filter px-4 py-2 text-xs font-medium bg-slate-100 text-slate-700 rounded-full hover:bg-slate-200";
        button.textContent = duration.label;
        durationFilters.appendChild(button);
    });

    durationFilters.addEventListener("click", function (event) {
        const button = event.target.closest(".duration-filter");
        if (!button) return;

        const isActive = button.classList.contains("bg-blue-700");

        durationFilters.querySelectorAll(".duration-filter").forEach(function (btn) {
            btn.classList.remove("bg-blue-700", "text-white");
            btn.classList.add("bg-slate-100", "text-slate-700");
        });

        if (!isActive) {
            button.classList.remove("bg-slate-100", "text-slate-700");
            button.classList.add("bg-blue-700", "text-white");
        }

        searchOffers();
    });
}
export function filterByContract(offer, selectedContract) {
    return selectedContract === "all" || offer.opp_type.toLowerCase() === selectedContract;
}
function searchOffers() {
    const keyword = searchInput.value.toLowerCase().trim();
    const city = cityInput.value.toLowerCase().trim();

    const selectedTechnologies = Array.from(
        document.querySelectorAll(".technology-filter:checked")
    ).map(function (checkbox) {
        return checkbox.value;
    });

    const selectedWorkModes = Array.from(
        document.querySelectorAll(".work-mode-filter:checked")
    ).map(function (checkbox) {
        return checkbox.dataset.workMode;
    });

    const selectedDuration = document.querySelector(
        ".duration-filter.bg-blue-700"
    )?.dataset.duration;

    const selectedContract =
        document.querySelector(".contract-filter.bg-white")?.dataset.contract || "all";

    const articles = offersList.querySelectorAll("article");
    let visibleOffers = 0;

    offers.forEach(function (offer, index) {
        const title = offer.job_title.toLowerCase();
        const company = offer.company.toLowerCase();
        const description = offer.description.toLowerCase();
        const location = offer.location.toLowerCase();

        const keywordMatch =
            title.includes(keyword) || company.includes(keyword) || description.includes(keyword);

        const cityMatch = location.includes(city);

        const technologyMatch =
            selectedTechnologies.length === 0 ||
            selectedTechnologies.every(function (technology) {
                return offer.skills.includes(technology);
            });

        const contractMatch = filterByContract(offer, selectedContract);

        const workModeMatch =
            selectedWorkModes.length === 0 || selectedWorkModes.includes(offer.work_mode);

        const durationMatch = !selectedDuration || offer.mission_duration === selectedDuration;
        const showOffer =
            keywordMatch && cityMatch && technologyMatch && contractMatch && workModeMatch && durationMatch;
        if (articles[index]) {
            articles[index].style.display = showOffer ? "" : "none";
        }
        if (showOffer) visibleOffers++;
    });
    resultsCount.textContent = visibleOffers;
    if (noResults) noResults.classList.toggle("hidden", visibleOffers !== 0);
}
function sortOffers() {
    const sortType = sortSelect.value;

    offers.sort(function (a, b) {
        const dateA = new Date(a.published_at);
        const dateB = new Date(b.published_at);
        if (sortType === "recent") return dateB - dateA;
        if (sortType === "oldest") return dateA - dateB;
    });

    offersList.innerHTML = "";
    disply_offers(offers);
    searchOffers();
}
function resetFilters() {
    searchInput.value = "";
    cityInput.value = "";

    document.querySelectorAll(".technology-filter").forEach((cb) => (cb.checked = false));
    document.querySelectorAll(".work-mode-filter").forEach((cb) => (cb.checked = false));

    document.querySelectorAll(".contract-filter").forEach((button) => {
        button.classList.remove("bg-white", "text-slate-800", "shadow-sm");
        button.classList.add("text-slate-600");
    });
    const allContract = document.querySelector('.contract-filter[data-contract="all"]');
    allContract.classList.remove("text-slate-600");
    allContract.classList.add("bg-white", "text-slate-800", "shadow-sm");

    document.querySelectorAll(".duration-filter").forEach((button) => {
        button.classList.remove("bg-blue-700", "text-white");
        button.classList.add("bg-slate-100", "text-slate-700");
    });

    sortSelect.value = "recent";

    offers.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));

    offersList.innerHTML = "";
    disply_offers(offers);
    resultsCount.textContent = offers.length;
    if (noResults) noResults.classList.add("hidden");
}
if (searchButton) {
    const filterToggleBtn = document.getElementById("filter-toggle-btn");
    const filterContent = document.getElementById("filter-content");
    const filterChevron = document.getElementById("filter-chevron");

    if (filterToggleBtn && filterContent) {
        filterToggleBtn.addEventListener("click", function () {
            filterContent.classList.toggle("grid-rows-[1fr]");
            if (filterChevron) {
                filterChevron.classList.toggle("rotate-180");
            }
        });
    }

    searchButton.addEventListener("click", searchOffers);
    technologyFilters.addEventListener("change", searchOffers);
    sortSelect.addEventListener("change", sortOffers);

    document.querySelectorAll(".reset-filters").forEach((button) => {
        button.addEventListener("click", resetFilters);
    });

    document.querySelectorAll(".contract-filter").forEach((button) => {
        button.addEventListener("click", function () {
            document.querySelectorAll(".contract-filter").forEach((btn) => {
                btn.classList.remove("bg-white", "text-slate-800", "shadow-sm");
                btn.classList.add("text-slate-600");
            });
            button.classList.remove("text-slate-600");
            button.classList.add("bg-white", "text-slate-800", "shadow-sm");
            searchOffers();
        });
    });

    loadOffers();
}