import { saveFollowedOffers } from "./storage.js";
import { getFollowedOffers } from "./storage.js";
import { unfollowOffer } from "./storage.js";

export function disply_offers(offers) {
  const Offers_List = document.querySelector("#Offers_List");
  Offers_List.textContent = "";

  offers.forEach((offer) => {
    const article = document.createElement("article");

    const div_in_article = document.createElement("div");

    const div_Company_logo = document.createElement("div");

    const div_contain_info_card = document.createElement("div");

    const div_in_contain_info_card = document.createElement("div");

    const div_offer_info = document.createElement("div");

    const h2 = document.createElement("h2");

    const div_contract = document.createElement("div");

    const span_contract = document.createElement("span");

    const div_meta = document.createElement("div");

    const span_company = document.createElement("span");

    const span_dot_1 = document.createElement("span");

    const span_location = document.createElement("span");

    const span_dot_2 = document.createElement("span");

    const span_date = document.createElement("span");

    const button_save = document.createElement("button");

    const svg_save = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );

    const path_save = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );

    const p_description = document.createElement("p");

    const div_footer = document.createElement("div");

    const div_technologies = document.createElement("div");

    const div_footer_right = document.createElement("div");

    const span_salary = document.createElement("span");

    const link_offer = document.createElement("a");

    const svg_arrow = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg",
    );

    const path_arrow = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );

    // ARTICLE
    article.setAttribute(
      "class",
      "bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-300 transition-all",
    );

    // DIV IN ARTICLE
    div_in_article.setAttribute(
      "class",
      "flex flex-col sm:flex-row items-start gap-4",
    );

    // COMPANY LOGO
    div_Company_logo.setAttribute(
      "class",
      "w-14 h-14 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl flex-shrink-0",
    );

    div_Company_logo.textContent = offer.company.charAt(0).toUpperCase();

    // CONTAINER INFO
    div_contain_info_card.setAttribute("class", "flex-1 w-full min-w-0");

    // DIV TOP
    div_in_contain_info_card.setAttribute(
      "class",
      "flex items-start justify-between gap-4",
    );

    // TITLE
    h2.setAttribute(
      "class",
      "text-lg md:text-xl font-bold text-slate-800 leading-tight mb-2",
    );

    h2.textContent = offer.job_title;

    // CONTRACT
    div_contract.setAttribute("class", "flex items-center gap-2 mb-2");

    span_contract.setAttribute(
      "class",
      "bg-[#5eead4] text-[#0f766e] text-xs font-bold px-3 py-1 rounded-full",
    );

    span_contract.textContent = offer.opp_type;

    // META
    div_meta.setAttribute(
      "class",
      "flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium text-slate-700",
    );

    // COMPANY
    span_company.textContent = offer.company;

    // DOT 1
    span_dot_1.setAttribute("class", "w-1 h-1 rounded-full bg-slate-400");

    // LOCATION
    span_location.setAttribute("class", "text-slate-500");

    span_location.textContent = offer.location;

    // DOT 2
    span_dot_2.setAttribute(
      "class",
      "hidden sm:inline w-1 h-1 rounded-full bg-slate-400",
    );

    // DATE
    span_date.setAttribute("class", "text-slate-500 hidden sm:inline");

    span_date.textContent = `Publié le ${offer.start_date}`;

    // SAVE BUTTON
    button_save.setAttribute(
      "class",
      "text-slate-300 hover:text-slate-500 transition-colors p-1 flex-shrink-0",
    );

    button_save.dataset.offerId = offer.id;

    const followedOffers = getFollowedOffers();
    const alreadyFollowed = followedOffers.includes(Number(offer.id));

    if (alreadyFollowed) {
      button_save.classList.remove("text-slate-300", "hover:text-slate-500");
      button_save.classList.add("text-blue-600", "hover:text-blue-700");
    }

    button_save.addEventListener("click", () => {
      const offerId = button_save.dataset.offerId;
      const followedOffers = getFollowedOffers();

      const alreadyFollowed = followedOffers.includes(Number(offerId));
      if (alreadyFollowed) {
        unfollowOffer(offerId);
        if (document.body.dataset.page === "followed") {
          article.remove();

          const emptyState = document.querySelector("#empty-followed-offers");
          const hasRemainingOffers = Offers_List.querySelector("article");

          if (!hasRemainingOffers && emptyState) {
            emptyState.classList.remove("hidden");
          }
        }
        svg_save.setAttribute("fill", "none");
        button_save.classList.remove("text-blue-600", "hover:text-blue-700");
        button_save.classList.add("text-slate-300", "hover:text-slate-500");
      } else {
        followedOffers.push(Number(offerId));
        saveFollowedOffers(followedOffers);
        svg_save.setAttribute("fill", "currentColor");
        button_save.classList.remove("text-slate-300", "hover:text-slate-500");
        button_save.classList.add("text-blue-600", "hover:text-blue-700");
      }
    });

    // SAVE SVG
    svg_save.setAttribute("class", "w-6 h-6");

    if (alreadyFollowed) {
      svg_save.setAttribute("fill", "currentColor");
    } else {
      svg_save.setAttribute("fill", "none");
    }

    svg_save.setAttribute("stroke", "currentColor");

    svg_save.setAttribute("viewBox", "0 0 24 24");

    // SAVE PATH
    path_save.setAttribute("stroke-linecap", "round");

    path_save.setAttribute("stroke-linejoin", "round");

    path_save.setAttribute("stroke-width", "2");

    path_save.setAttribute(
      "d",
      "M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z",
    );

    // DESCRIPTION
    p_description.setAttribute(
      "class",
      "mt-4 text-sm text-slate-600 line-clamp-2 leading-relaxed",
    );

    p_description.textContent = offer.description;

    // FOOTER
    div_footer.setAttribute(
      "class",
      "mt-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 pt-5 border-t border-slate-100",
    );

    // TECHNOLOGIES
    div_technologies.setAttribute("class", "flex flex-wrap gap-2");

    offer.skills.forEach((skill) => {
      const span_tech = document.createElement("span");

      span_tech.setAttribute(
        "class",
        "bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-lg",
      );

      span_tech.textContent = skill;

      div_technologies.appendChild(span_tech);
    });

    // FOOTER RIGHT
    div_footer_right.setAttribute(
      "class",
      "flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto justify-between md:justify-end",
    );

    // SALARY
    span_salary.setAttribute("class", "text-sm font-bold text-blue-700");

    span_salary.textContent = offer.salary;

    // LINK
    link_offer.setAttribute(
      "class",
      "w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors",
    );
    link_offer.setAttribute("href", `offre-detail.html?id=${offer.id}`);

    link_offer.textContent = "Voir l'offre";

    // ARROW SVG
    svg_arrow.setAttribute("class", "w-4 h-4");

    svg_arrow.setAttribute("fill", "none");

    svg_arrow.setAttribute("stroke", "currentColor");

    svg_arrow.setAttribute("viewBox", "0 0 24 24");

    // ARROW PATH
    path_arrow.setAttribute("stroke-linecap", "round");

    path_arrow.setAttribute("stroke-linejoin", "round");

    path_arrow.setAttribute("stroke-width", "2");

    path_arrow.setAttribute("d", "M14 5l7 7m0 0l-7 7m7-7H3");

    // =========================
    // APPEND CHILD
    // =========================

    svg_save.appendChild(path_save);

    button_save.appendChild(svg_save);

    svg_arrow.appendChild(path_arrow);

    link_offer.appendChild(svg_arrow);

    div_contract.appendChild(span_contract);

    div_meta.appendChild(span_company);
    div_meta.appendChild(span_dot_1);
    div_meta.appendChild(span_location);
    div_meta.appendChild(span_dot_2);
    div_meta.appendChild(span_date);

    div_offer_info.appendChild(h2);
    div_offer_info.appendChild(div_contract);
    div_offer_info.appendChild(div_meta);

    div_in_contain_info_card.appendChild(div_offer_info);
    div_in_contain_info_card.appendChild(button_save);

    div_footer_right.appendChild(span_salary);
    div_footer_right.appendChild(link_offer);

    div_footer.appendChild(div_technologies);
    div_footer.appendChild(div_footer_right);

    div_contain_info_card.appendChild(div_in_contain_info_card);
    div_contain_info_card.appendChild(p_description);
    div_contain_info_card.appendChild(div_footer);

    div_in_article.appendChild(div_Company_logo);
    div_in_article.appendChild(div_contain_info_card);

    article.appendChild(div_in_article);

    Offers_List.appendChild(article);
  });
}
