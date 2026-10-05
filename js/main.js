// Mobile menu + project filter + scroll reveal + mobile portfolio slider

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

  // Portfolio slider (mobile)
  const grid = document.getElementById("projects-grid");
  const dotsBox = document.getElementById("projects-dots");
  let visibleCards = () =>
    grid
      ? [...grid.querySelectorAll(".project-card")].filter(
          (c) => c.style.display !== "none"
        )
      : [];

  function buildDots() {
    if (!grid || !dotsBox) return;
    const cards = visibleCards();
    dotsBox.innerHTML = "";
    // dots only useful on mobile; CSS hides on desktop
    cards.forEach((card, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", `Проект ${i + 1}`);
      if (i === 0) b.classList.add("active");
      b.addEventListener("click", () => {
        card.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
      });
      dotsBox.appendChild(b);
    });
  }

  function updateActiveDot() {
    if (!grid || !dotsBox) return;
    const cards = visibleCards();
    const dots = [...dotsBox.querySelectorAll("button")];
    if (!cards.length || !dots.length) return;
    const left = grid.scrollLeft;
    let best = 0;
    let bestDist = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.offsetLeft - left - grid.clientLeft);
      if (dist < bestDist) {
        bestDist = dist;
        best = i;
      }
    });
    dots.forEach((d, i) => d.classList.toggle("active", i === best));
  }

  if (grid) {
    buildDots();
    grid.addEventListener("scroll", () => {
      window.requestAnimationFrame(updateActiveDot);
    }, { passive: true });
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

      if (grid) {
        grid.scrollTo({ left: 0, behavior: "smooth" });
        buildDots();
        updateActiveDot();
      }
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
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }
});
