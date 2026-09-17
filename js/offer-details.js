const title = document.getElementById("job_title");
const companyName = document.getElementById("companyName");const companyVerified = document.getElementById("company_verified");
const offerLocation = document.querySelectorAll(".offerLocation");
const opp_type = document.getElementById("opp_type");
const publishedAt = document.getElementById("published_at");
const referenceHeader = document.getElementById("reference_header");
const duration = document.getElementById("duration");
const profile = document.getElementById("profile");
const start_date = document.getElementById("start_date");
const salary = document.getElementById("salary");
const description = document.getElementById("description");
const teamSize = document.getElementById("team_size");
const workMethod = document.getElementById("work_method");
const remotePolicy = document.getElementById("remote_policy");
const missionsList = document.getElementById("missions_list");
const profileList = document.getElementById("profile_list");
const skillsContainer = document.getElementById("skills");
const softSkillsContainer = document.getElementById("soft_skills");
const schedule = document.getElementById("schedule");
const healthInsurance = document.getElementById("health_insurance");
const contractDuration = document.getElementById("contract_duration");
const transportAndMeals = document.getElementById("transport_and_meals");
const responseTime = document.getElementById("response_time");
const referenceSide = document.getElementById("reference_side");
const offerStatus = document.getElementById("offer_status");
const opp_type_side = document.getElementById("opp_type_side");
const duration_side = document.getElementById("duration_side");
const demarage_date = document.getElementById("demarage_date");
const applicationsCount = document.getElementById("applications_count");
const recruiterInitials = document.getElementById("recruiter_initials");
const recruiterName = document.getElementById("recruiter_name");
const recruiterRole = document.getElementById("recruiter_role");
const hrEmail = document.getElementById("hrEmail");
const hrEmailText = document.getElementById("hr_email_text");

function findSelectedId() {
  const param = new URLSearchParams(window.location.search);
  const offerId = param.get("id");
  return offerId;
}

function findOffer(offers, offerId) {
  return offers.find((offer) => offer.id === Number(offerId));
}

function formatDate(dateString) {
  const date = new Date(dateString + "T00:00:00");

  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function createCheckItem(text, isCard = false) {
  const item = document.createElement("li");
  item.className = isCard
    ? "flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-slate-50 border border-slate-100"
    : "flex items-start gap-3";

  const check = document.createElement("span");
  check.textContent = "✓";
  check.className =
    "w-6 h-6 flex items-center justify-center flex-shrink-0 rounded-full bg-blue-50 text-blue-600 font-bold text-sm";

  const content = document.createElement("span");
  content.textContent = text;
  content.className = "text-slate-700 text-sm md:text-base leading-relaxed";

  item.append(check, content);
  return item;
}

async function loadOffers() {
  const response = await fetch("../data/offers.json");
  const offers = await response.json();

  const offerId = findSelectedId();
  const selectedOffer = findOffer(offers, offerId);

  // console.log(selectedOffer);
  displayInfos(selectedOffer);
}

function displayInfos(selectedOffer) {
  const offerType =
    selectedOffer.opp_type.charAt(0).toUpperCase() +
    selectedOffer.opp_type.slice(1);

  title.textContent = selectedOffer.job_title;
  companyName.textContent = selectedOffer.company;
  companyVerified.classList.toggle("hidden", !selectedOffer.company_verified);

  offerLocation.forEach((locationElement) => {
    locationElement.textContent = selectedOffer.location;
  });

  opp_type.textContent =
    offerType + " - " + selectedOffer.job_title;
  publishedAt.textContent = "Publié le " + formatDate(selectedOffer.published_at);
  referenceHeader.textContent = "#" + selectedOffer.reference;
  duration.textContent = offerType + " · " + selectedOffer.duration;
  profile.textContent = selectedOffer.profile;
  start_date.textContent =
    "Démarrage : " + formatDate(selectedOffer.start_date);
  salary.textContent = selectedOffer.salary;
  description.textContent = selectedOffer.description;
  teamSize.textContent = selectedOffer.team_size;
  workMethod.textContent = selectedOffer.work_method;
  remotePolicy.textContent = selectedOffer.remote_policy;

  missionsList.textContent = "";
  selectedOffer.missions
    .split(".")
    .map((mission) => mission.trim())
    .filter(Boolean)
    .forEach((mission) => {
      missionsList.appendChild(createCheckItem(mission, true));
    });

  profileList.textContent = "";
  profileList.appendChild(createCheckItem(selectedOffer.profile));

  skillsContainer.textContent = "";
  selectedOffer.skills.forEach((skill) => {
    const span = document.createElement("span");
    span.textContent = skill;
    span.className =
      "bg-white border border-slate-200 text-slate-700 text-xs md:text-sm font-medium px-2.5 py-1.5 rounded-lg shadow-sm";
    skillsContainer.appendChild(span);
  });

  softSkillsContainer.textContent = "";
  selectedOffer.soft_skills.forEach((softSkill) => {
    const span = document.createElement("span");
    span.textContent = softSkill;
    span.className =
      "bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-lg";
    softSkillsContainer.appendChild(span);
  });

  schedule.textContent = selectedOffer.schedule;
  healthInsurance.textContent = selectedOffer.health_insurance;
  contractDuration.textContent = selectedOffer.duration;
  transportAndMeals.textContent = selectedOffer.transport_and_meals;
  responseTime.textContent = selectedOffer.response_time;

  referenceSide.textContent = "#" + selectedOffer.reference;
  offerStatus.textContent =
    selectedOffer.status === "published" ? "Publiée" : "Brouillon";
  opp_type_side.textContent = offerType;
  duration_side.textContent = selectedOffer.duration;
  demarage_date.textContent = formatDate(selectedOffer.start_date);
  applicationsCount.textContent =
    selectedOffer.applications_count + " candidats";

  const recruiterNames = selectedOffer.recruiter_name.split(" ");
  recruiterInitials.textContent =
    recruiterNames[0].charAt(0) +
    recruiterNames[recruiterNames.length - 1].charAt(0);
  recruiterName.textContent = selectedOffer.recruiter_name;
  recruiterRole.textContent = selectedOffer.recruiter_role;
  hrEmail.href = "mailto:" + selectedOffer.email;
  hrEmailText.textContent = selectedOffer.email;

}
loadOffers();

// console.log(findSelectedId());
