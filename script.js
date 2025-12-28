/* =========================
   GLOBAL SCRIPT
   - Nav toggle
   - Mobile menu
   - Footer year
========================= */

document.addEventListener("DOMContentLoaded", () => {
  /* FONT LOADING CHECK - Verify fonts are loaded */
  if ("fonts" in document) {
    document.fonts.ready.then(() => {
      document.documentElement.classList.add("fonts-loaded");
    }).catch(() => {
      // Fonts will still work with fallbacks
      document.documentElement.classList.add("fonts-fallback");
    });
  }

  /* FOOTER YEAR */
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* NAV TOGGLE (MOBILE) */
  const navToggle = document.querySelector(".nav-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");

  if (navToggle && mobileMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navToggle.getAttribute("aria-expanded") === "true";

      navToggle.setAttribute("aria-expanded", String(!isOpen));

      if (isOpen) {
        mobileMenu.setAttribute("hidden", "");
        mobileMenu.classList.remove("is-open");
      } else {
        mobileMenu.removeAttribute("hidden");
        mobileMenu.classList.add("is-open");
      }
    });

    /* CLOSE MENU WHEN LINK IS CLICKED */
    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.setAttribute("aria-expanded", "false");
        mobileMenu.setAttribute("hidden", "");
        mobileMenu.classList.remove("is-open");
      });
    });

    /* CLOSE MENU WHEN BUTTON IN MOBILE MENU IS CLICKED */
    const mobileMenuButton = mobileMenu.querySelector("button");
    if (mobileMenuButton) {
      mobileMenuButton.addEventListener("click", () => {
        navToggle.setAttribute("aria-expanded", "false");
        mobileMenu.setAttribute("hidden", "");
        mobileMenu.classList.remove("is-open");
      });
    }
  }

  /* LIGHTBOX FUNCTIONALITY */
  const lightbox = document.querySelector(".lightbox");
  const lightboxImg = document.querySelector(".lightbox-img");
  const lightboxCap = document.querySelector(".lightbox-cap");
  const lightboxClose = document.querySelector(".lightbox-close");
  const lightboxPrev = document.querySelector(".lightbox-prev");
  const lightboxNext = document.querySelector(".lightbox-next");

  let currentImages = [];
  let currentIndex = 0;

  function openLightbox(imgSrc, caption, images = null, index = 0) {
    if (!lightbox || !lightboxImg || !lightboxCap) return;

    if (images) {
      currentImages = images;
      currentIndex = index;
    } else {
      // Collect all gallery images if not provided
      const galleryCards = document.querySelectorAll(".card[data-category]");
      currentImages = Array.from(galleryCards).map((card) => {
        const btn = card.querySelector(".card-media");
        return {
          src: btn?.getAttribute("data-full") || "",
          caption: btn?.getAttribute("data-caption") || "",
        };
      });
      currentIndex = currentImages.findIndex((img) => img.src === imgSrc);
      if (currentIndex === -1) currentIndex = 0;
    }

    lightboxImg.src = imgSrc;
    lightboxCap.textContent = caption || "";
    lightbox.removeAttribute("hidden");
    document.body.style.overflow = "hidden";

    // Update navigation buttons
    if (lightboxPrev) {
      lightboxPrev.style.display = currentImages.length > 1 ? "block" : "none";
    }
    if (lightboxNext) {
      lightboxNext.style.display = currentImages.length > 1 ? "block" : "none";
    }
  }

  function closeLightbox() {
    if (lightbox) {
      lightbox.setAttribute("hidden", "");
      document.body.style.overflow = "";
    }
  }

  function showNextImage() {
    if (currentImages.length === 0) return;
    currentIndex = (currentIndex + 1) % currentImages.length;
    const img = currentImages[currentIndex];
    lightboxImg.src = img.src;
    lightboxCap.textContent = img.caption || "";
  }

  function showPrevImage() {
    if (currentImages.length === 0) return;
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    const img = currentImages[currentIndex];
    lightboxImg.src = img.src;
    lightboxCap.textContent = img.caption || "";
  }

  // Attach click handlers to gallery buttons
  document.querySelectorAll(".card-media").forEach((btn) => {
    btn.addEventListener("click", () => {
      const imgSrc = btn.getAttribute("data-full");
      const caption = btn.getAttribute("data-caption");
      if (imgSrc) {
        // Get current active filter
        const activeFilter = document.querySelector(".filter-btn.is-active")?.getAttribute("data-filter") || "all";
        updateLightboxImagesForFilter(activeFilter);
        
        // Find the index of the clicked image
        const clickedIndex = currentImages.findIndex((img) => img.src === imgSrc);
        const index = clickedIndex >= 0 ? clickedIndex : 0;
        
        openLightbox(imgSrc, caption, currentImages, index);
      }
    });
  });

  // Update lightbox images based on current filter
  function updateLightboxImagesForFilter(filter = "all") {
    const visibleCards = Array.from(document.querySelectorAll(".card[data-category]")).filter((card) => {
      if (card.classList.contains("hidden") || card.style.display === "none") return false;
      const category = card.getAttribute("data-category");
      return filter === "all" || category === filter;
    });

    currentImages = visibleCards.map((card) => {
      const btn = card.querySelector(".card-media");
      return {
        src: btn?.getAttribute("data-full") || "",
        caption: btn?.getAttribute("data-caption") || "",
      };
    });
  }

  // Lightbox controls
  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", showPrevImage);
  }

  if (lightboxNext) {
    lightboxNext.addEventListener("click", showNextImage);
  }

  // Close on backdrop click
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });
  }

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox && !lightbox.hasAttribute("hidden")) {
      closeLightbox();
    }
    if (e.key === "ArrowLeft" && lightbox && !lightbox.hasAttribute("hidden")) {
      showPrevImage();
    }
    if (e.key === "ArrowRight" && lightbox && !lightbox.hasAttribute("hidden")) {
      showNextImage();
    }
  });

  // Expose for external use
  window.openLightbox = openLightbox;

  /* PORTFOLIO FILTER FUNCTIONALITY */
  const filterButtons = document.querySelectorAll(".filter-btn");
  const galleryCards = document.querySelectorAll(".card[data-category]");

  if (filterButtons.length > 0 && galleryCards.length > 0) {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.getAttribute("data-filter");

        // Update active state
        filterButtons.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");

        // Filter cards with animation
        galleryCards.forEach((card) => {
          const category = card.getAttribute("data-category");
          const shouldShow = filter === "all" || category === filter;

          if (shouldShow) {
            card.classList.remove("hidden", "fade-out");
            card.style.display = "";
            // Force reflow for animation
            requestAnimationFrame(() => {
              card.style.opacity = "1";
              card.style.transform = "scale(1)";
            });
          } else {
            card.classList.add("fade-out");
            card.style.opacity = "0";
            card.style.transform = "scale(0.95)";
            setTimeout(() => {
              card.classList.add("hidden");
              card.style.display = "none";
            }, 300);
          }
        });

        // Update lightbox images array for filtered view
        updateLightboxImagesForFilter(filter);
      });
    });
  }

  /* BACK TO TOP BUTTON */
  const backToTopButton = document.querySelector(".back-to-top");
  
  if (backToTopButton) {
    // Show/hide button based on scroll position
    function toggleBackToTop() {
      if (window.scrollY > 300) {
        backToTopButton.classList.add("visible");
      } else {
        backToTopButton.classList.remove("visible");
      }
    }

    // Scroll to top function
    function scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }

    // Listen for scroll events
    window.addEventListener("scroll", toggleBackToTop);
    
    // Click handler
    backToTopButton.addEventListener("click", scrollToTop);
    
    // Initial check
    toggleBackToTop();
  }
});
