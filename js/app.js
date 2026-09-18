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


const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener("click", function (event) {
        event.stopPropagation();
        mobileMenu.classList.toggle("hidden");
        mobileMenuBtn.setAttribute(
            "aria-expanded",
            mobileMenu.classList.contains("hidden") ? "false" : "true"
        );
    });

    document.addEventListener("click", function (event) {
        const isClickInside = mobileMenu.contains(event.target) || mobileMenuBtn.contains(event.target);
        if (!isClickInside && !mobileMenu.classList.contains("hidden")) {
            mobileMenu.classList.add("hidden");
            mobileMenuBtn.setAttribute("aria-expanded", "false");
        }
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            mobileMenu.classList.add("hidden");
            mobileMenuBtn.setAttribute("aria-expanded", "false");
        });
    });
}
