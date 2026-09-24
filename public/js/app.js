import { getData } from "./data.js"
import { disply_pagination , pagnation  } from "./pagination.js";
import { disply_offers } from "./render.js";

const offersList = document.getElementById("Offers_List");

if (offersList) {
    const offers = await getData();
    disply_offers(pagnation(1, 3, offers));

    if (document.getElementById("div_contain_number_page")) {
        disply_pagination(offers);
    }
}

