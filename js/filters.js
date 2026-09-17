import { getData } from "./data.js";

let offers = [];

const searchInput = document.getElementById("search-keyword");
const searchButton = document.getElementById("search-button");
const offersList = document.getElementById("Offers_List");
const resultsCount = document.getElementById("results-count");

async function loadOffers() {
    try {
        offers = await getData();

        resultsCount.textContent = offers.length;

    } catch (error) {
        console.error(error);
    }
}

function searchOffers() {
    const keyword = searchInput.value.toLowerCase().trim();

    const articles = offersList.querySelectorAll("article");

    let visibleOffers = 0;

    offers.forEach(function (offer, index) {

        const title = offer.job_title.toLowerCase();
        const company = offer.company.toLowerCase();
        const description = offer.description.toLowerCase();

        const match =
            title.includes(keyword) ||
            company.includes(keyword) ||
            description.includes(keyword);

        if (match) {
            articles[index].style.display = "";
            visibleOffers++;
        } else {
            articles[index].style.display = "none";
        }
    });

    resultsCount.textContent = visibleOffers;
}

searchButton.addEventListener("click", searchOffers);

loadOffers();