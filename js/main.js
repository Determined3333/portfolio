// Mobile menu + project filter + scroll reveal animations

document.addEventListener("DOMContentLoaded", () => {
  // Mobile menu
  const menuBtn = document.getElementById("menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      menuBtn.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    });
    mobileMenu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => mobileMenu.classList.remove("open"));
    });
  }

  // Project filters
  const filterBtns = document.querySelectorAll("[data-filter]");
  const cards = document.querySelectorAll("[data-categories]");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter;
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      cards.forEach((card) => {
        const cats = (card.dataset.categories || "").split(" ");
        const show = filter === "all" || cats.includes(filter);
        card.style.display = show ? "" : "none";
      });
    });
  });

  // Scroll reveal (Intersection Observer)
  const revealEls = document.querySelectorAll(".reveal, .reveal-scale");
  if (revealEls.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    // Fallback: show everything
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }
});
