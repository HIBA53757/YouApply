export function displayOffers(offers) {
  const list = document.querySelector("#Offers_List");
  if (!list) return;

  list.replaceChildren();

  offers.forEach((offer) => {
    const card = document.createElement("article");
    card.className = "bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-300 transition-all";
    card.dataset.workMode = offer.mode_travail || "";
    card.innerHTML = `
      <div class="flex flex-col sm:flex-row items-start gap-4">
        <div data-company-initial class="w-14 h-14 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-xl flex-shrink-0"></div>
        <div class="flex-1 w-full min-w-0">
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0">
              <h2 data-title class="text-lg md:text-xl font-bold text-slate-800 leading-tight mb-2"></h2>
              <span data-contract class="bg-blue-100 text-blue-900 text-xs font-bold px-3 py-1 rounded-full"></span>
              <div class="flex flex-wrap items-center gap-x-3 gap-y-2 mt-2 text-sm font-medium text-slate-700">
                <span data-company></span><span data-city class="text-slate-500"></span>
              </div>
            </div>
            <button type="button" data-offer-id aria-label="Retirer cette offre des offres suivies" class="text-blue-700 hover:text-blue-900 transition-colors p-1 flex-shrink-0">
              <svg class="w-6 h-6" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
            </button>
          </div>
          <p data-description class="mt-4 text-sm text-slate-600 line-clamp-2 leading-relaxed"></p>
          <div class="mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-5 border-t border-slate-100">
            <div data-skills class="flex flex-wrap gap-2"></div>
            <a data-details class="w-full sm:w-auto bg-blue-700 hover:bg-blue-900 text-white text-sm font-medium px-5 py-2.5 rounded-xl flex items-center justify-center">Voir l'offre</a>
          </div>
        </div>
      </div>`;

    card.querySelector("[data-company-initial]").textContent = (offer.entreprise_nom || "?").charAt(0).toUpperCase();
    card.querySelector("[data-title]").textContent = offer.titre || "";
    card.querySelector("[data-contract]").textContent = offer.type_contrat || "";
    card.querySelector("[data-company]").textContent = offer.entreprise_nom || "";
    card.querySelector("[data-city]").textContent = offer.ville || "";
    card.querySelector("[data-offer-id]").dataset.offerId = offer.id;
    card.querySelector("[data-details]").href = `/offer-details.html?id=${encodeURIComponent(offer.id)}`;

    const description = card.querySelector("[data-description]");
    description.textContent = offer.presentation_entreprise || "";
    if (!offer.presentation_entreprise) description.classList.add("hidden");

    const skills = card.querySelector("[data-skills]");
    String(offer.skills || "").split(",").filter(Boolean).forEach((skill) => {
      const tag = document.createElement("span");
      tag.className = "bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-lg";
      tag.textContent = skill.trim();
      skills.append(tag);
    });

    list.append(card);
  });
}
