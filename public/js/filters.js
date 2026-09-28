const form = document.querySelector("#offers-filter-form");
const sortSelect = document.querySelector("#sort-select");
const contractInput = document.querySelector("#contract-filter-value");

form.querySelectorAll('input[name="technology"], input[name="workMode"]').forEach((checkbox) => {
  checkbox.addEventListener("change", () => form.requestSubmit());
});

document.querySelectorAll("[data-contract]").forEach((button) => {
  button.addEventListener("click", () => {
    contractInput.value = button.dataset.contract;
    form.requestSubmit();
  });
});

sortSelect?.addEventListener("change", () => form.requestSubmit());

const filterToggle = document.querySelector("#filter-toggle-btn");
const filterContent = document.querySelector("#filter-content");
const filterChevron = document.querySelector("#filter-chevron");

if (filterToggle && filterContent) {
  filterToggle.addEventListener("click", () => {
    filterContent.classList.toggle("grid-rows-[1fr]");
    filterChevron?.classList.toggle("rotate-180");
  });
}
