function makeElement(tag, className, text) {
  const element = document.createElement(tag);
  element.className = className;
  if (text) element.textContent = text;
  return element;
}

export function disply_offers(offers, target = document.querySelector("#Offers_List")) {
  if (!target) return;
  target.replaceChildren();

  offers.forEach((offer) => {
    const article = makeElement("article", "bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-200 hover:border-blue-300 transition-all");
    article.dataset.workMode = offer.mode_travail || "";
    const row = makeElement("div", "flex flex-col sm:flex-row items-start gap-4");
    const initial = makeElement("div", "w-14 h-14 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-xl flex-shrink-0", (offer.entreprise_nom || "?").charAt(0).toUpperCase());
    const content = makeElement("div", "flex-1 w-full min-w-0");
    const heading = makeElement("div", "flex items-start justify-between gap-4");
    const details = makeElement("div", "min-w-0");
    details.append(makeElement("h2", "text-lg md:text-xl font-bold text-slate-800 leading-tight mb-2", offer.titre));
    const contract = makeElement("span", "bg-blue-100 text-blue-900 text-xs font-bold px-3 py-1 rounded-full", offer.type_contrat);
    details.append(contract);
    const meta = makeElement("div", "flex flex-wrap items-center gap-x-3 gap-y-2 mt-2 text-sm font-medium text-slate-700");
    meta.append(makeElement("span", "", offer.entreprise_nom), makeElement("span", "text-slate-500", offer.ville));
    details.append(meta);

    const follow = document.createElement("button");
    follow.type = "button";
    follow.dataset.offerId = offer.id;
    follow.setAttribute("aria-label", "Retirer cette offre des offres suivies");
    follow.className = "text-blue-700 hover:text-blue-900 transition-colors p-1 flex-shrink-0";
    follow.innerHTML = '<svg class="w-6 h-6" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>';
    heading.append(details, follow);
    content.append(heading);

    if (offer.presentation_entreprise) content.append(makeElement("p", "mt-4 text-sm text-slate-600 line-clamp-2 leading-relaxed", offer.presentation_entreprise));

    const footer = makeElement("div", "mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-5 border-t border-slate-100");
    const skills = makeElement("div", "flex flex-wrap gap-2");
    String(offer.skills || "").split(",").filter(Boolean).forEach((skill) => skills.append(makeElement("span", "bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-lg", skill.trim())));
    const link = makeElement("a", "w-full sm:w-auto bg-blue-700 hover:bg-blue-900 text-white text-sm font-medium px-5 py-2.5 rounded-xl flex items-center justify-center", "Voir l'offre");
    link.href = `/offer-details.html?id=${encodeURIComponent(offer.id)}`;
    footer.append(skills, link);
    content.append(footer);
    row.append(initial, content);
    article.append(row);
    target.append(article);
  });
}
