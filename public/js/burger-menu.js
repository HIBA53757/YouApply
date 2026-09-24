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
        const isClickInside =
            mobileMenu.contains(event.target) ||
            mobileMenuBtn.contains(event.target);

        if (!isClickInside && !mobileMenu.classList.contains("hidden")) {
            mobileMenu.classList.add("hidden");
            mobileMenuBtn.setAttribute("aria-expanded", "false");
        }
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", function () {
            mobileMenu.classList.add("hidden");
            mobileMenuBtn.setAttribute("aria-expanded", "false");
        });
    });
}