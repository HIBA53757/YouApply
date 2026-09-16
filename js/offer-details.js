const title = document.getElementById("job_title");
const companyName = document.getElementById("companyName");
const offerLocation = document.querySelectorAll(".offerLocation");
const opp_type = document.getElementById("opp_type");
const duration = document.getElementById("duration");
const profile = document.getElementById("profile");
const start_date = document.getElementById("start_date");
const salary = document.getElementById("salary");
const description = document.getElementById("description");
const schedule = document.querySelectorAll(".schedule");
const missions = document.getElementById("missions");
const skillsContainer = document.getElementById("skills");
const opp_type_side = document.getElementById("opp_type_side");
const duration_side = document.getElementById("duration_side")
const demarage_date = document.getElementById('demarage_date')
const hrEmail = document.getElementById('hrEmail')
const locationMapText = document.getElementById('location_map_text')

function findSelectedId() {
  const param = new URLSearchParams(window.location.search);
  const offerId = param.get("id");
  return offerId;
}

function findOffer(offers, offerId) {
  return offers.find((offer) => offer.id === Number(offerId));
}

async function loadOffers() {
  const response = await fetch("../data/offers.json");
  const offers = await response.json();

  const offerId = findSelectedId();
  const selectedOffer = findOffer(offers, offerId);

  console.log(selectedOffer);
  displayInfos(selectedOffer);
}

function displayInfos(selectedOffer) {
  title.textContent = selectedOffer.job_title;
  companyName.textContent = selectedOffer.company;

  offerLocation.forEach((offerLocation) => {
    offerLocation.textContent = selectedOffer.location;
  });

  opp_type.textContent =
    selectedOffer.opp_type + " - " + selectedOffer.job_title;
  duration.textContent = selectedOffer.opp_type + " " + selectedOffer.duration;
  profile.textContent = selectedOffer.profile;
  start_date.textContent = "Démarrage : " + selectedOffer.start_date;
  salary.textContent = selectedOffer.salary;
  description.textContent = selectedOffer.description;

  schedule.forEach((scheduleElement) => {
    scheduleElement.textContent = selectedOffer.schedule;
    scheduleElement.className = "text-blue-700 font-mono text-base md:text-lg";
  });

  missions.textContent = selectedOffer.missions;

  selectedOffer.skills.forEach((skill) => {
    const span = document.createElement("span");
    span.textContent = skill;
    span.className =
      "bg-white border border-slate-200 text-slate-700 text-xs md:text-sm font-medium px-2.5 py-1.5 rounded-lg shadow-sm";
    skillsContainer.appendChild(span);
  });

  opp_type_side.textContent = selectedOffer.opp_type
  duration_side.textContent = selectedOffer.duration
  demarage_date.textContent = selectedOffer.start_date
  hrEmail.textContent = selectedOffer.email
  locationMapText.textContent = selectedOffer.location

}
loadOffers();

// console.log(findSelectedId());
