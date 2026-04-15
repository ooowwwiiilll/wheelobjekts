import { preloadImages } from "./utils.js";
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import { Draggable } from "gsap/Draggable";
import { SplitText } from "gsap/SplitText";
import { animate, spring } from "animejs";
// import { pixelateImage } from "./pixelate.js";

gsap.registerPlugin(Draggable, Flip, SplitText);

const springEase = spring({
  bounce: -0.19,
  duration: 300
});

/* ─────────────────────────────────────────────────────────────────────────────
 * MOTION CONFIG — single source of truth for every animation timing.
 *
 * All values already include the 35% speed-up (original × 0.65).
 * To restore originals, multiply each duration / delay / stagger back by 1.54.
 *
 * Sections:
 *   intro       – after loading overlay fades out
 *   detail      – open / close item detail panel
 *   filter      – category filter blur / fade
 *   hover       – product grid item hover (CSS-driven, see style.css)
 *   observer    – IntersectionObserver reveal / hide
 *   overlay     – loading overlay fade-out wait
 *   cursor      – custom cursor follow
 * ────────────────────────────────────────────────────────────────────────── */
export const MOTION = {

  // ── Intro sequence (after load 100%) ──────────────────────────────────
  intro: {
    productDuration: 0.39,       // was 0.6
    productEase: "power3.out",
    staggerAmount: 0.78,       // was 1.2
    staggerFrom: "random",
    containerDuration: 0.78,       // was 1.2
    containerEase: "power3.inOut",
  },

  // ── Item detail open / close ──────────────────────────────────────────
  detail: {
    panelDuration: 0.78,       // was 1.2  (container + details slide)
    panelEase: "power3.inOut",

    flipDuration: 0.78,       // was 1.2
    flipEase: "power3.inOut",

    titleCharDuration: 0.72,       // was 1.1
    titleCharDelay: 0.26,       // was 0.4
    titleCharEase: "power3.inOut",
    titleCharStagger: 0.016,      // was 0.025

    textLineDuration: 0.72,       // was 1.1
    textLineDelay: 0.26,       // was 0.4
    textLineEase: "power3.inOut",
    textLineStagger: 0.033,      // was 0.05

    imgDuration: 0.78,       // was 1.2
    imgDelay: 0.33,       // was 0.5
    imgEase: "power3.out",

    detailImgReveal: 0.72,       // was 1.1  (detail body images)
    detailImgEase: "power3.out",

    crossShowDuration: 0.26,       // was 0.4
    crossShowDelay: 0.33,       // was 0.5
    crossHideDuration: 0.26,       // was 0.4
    crossEase: "power2.out",

    // close-specific
    closeDelay: 0.20,       // was 0.3
    closeTitleDuration: 0.39,       // was 0.6
    closeTextDuration: 0.39,       // was 0.6
    closeTextStagger: 0.033,      // was 0.05
    closeTitleStagger: 0.016,      // was 0.025

    unflipDuration: 0.78,       // was 1.2
    unflipDelay: 0.20,       // was 0.3
    unflipEase: "power3.inOut",
  },

  // ── Grid item filter (category switching) ─────────────────────────────
  filter: {
    showDuration: 0.39,       // was 0.6
    showEase: "power2.out",
    hideDuration: 0.26,       // was 0.4
    hideEase: "power2.out",
  },

  // ── Grid item hover (CSS img scale) ───────────────────────────────────
  // ⚠  Managed in style.css — kept here as reference so you know the value.
  hover: {
    imgScaleDuration: 585,        // ms, was 900ms  → style.css `.product img`
  },

  // ── IntersectionObserver reveal / fade ─────────────────────────────────
  observer: {
    revealDuration: 0.33,       // was 0.5
    revealEase: "power2.out",
    fadeDuration: 0.26,       // was 0.4
    fadeEase: "power2.in",
  },

  // ── Loading overlay ───────────────────────────────────────────────────
  overlay: {
    fadeOutWait: 390,        // ms, was 600  (setTimeout before intro)
  },

  // ── Custom cursor ─────────────────────────────────────────────────────
  cursor: {
    duration: 0.39,       // was 0.6
    ease: "power2.out",
  },
};


class Grid {
  constructor() {
    this.dom = document.querySelector(".container");
    this.grid = document.querySelector(".grid");
    this.products = [...document.querySelectorAll(".product div")];

    this.details = document.querySelector(".details");
    this.detailsThumb = this.details.querySelector(".details__thumb");

    this.cross = document.querySelector(".cross");

    this.isDragging = false;
    this.SHOW_DETAILS = false;
    this.observer = null;
    this.currentProduct = null;
    this.originalParent = null;

  }

  init() {

    this.intro();
    this.overlay = document.getElementById("overlay");

    this.overlay.addEventListener("click", () => {
      if (this.SHOW_DETAILS) this.hideDetails();
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && this.SHOW_DETAILS) {
        this.hideDetails();
      }
    });

    this.products = document.querySelectorAll(".product div");

    const catMap = {
      A: [8, 9, 10],
      B: [1, 2, 3, 5, 12],
      C: [],
      D: [4, 6, 11]
    };
    this.products.forEach((el) => {
      const id = Number(el.dataset.id);
      const cat = Object.keys(catMap).find((key) => catMap[key].includes(id)) || "none";
      el.dataset.cat = cat;
    });

    document.querySelectorAll(".frame__links a[data-filter]").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const category = e.currentTarget.dataset.filter;
        this.filterItems(category);

        // toggle active style
        document.querySelectorAll(".frame__links a").forEach((l) => l.classList.remove("active"));
        e.currentTarget.classList.add("active");
      });
    });
  }

  filterItems(category) {
    const products = document.querySelectorAll(".product div");
    this.activeCategory = category;

    products.forEach((item) => {
      const matches =
        category === "all" ||
        item.dataset.cat === category ||
        item.dataset.cat === "none";

      if (matches) {
        gsap.to(item, {
          opacity: 1,
          filter: "blur(0px) saturate(1)",
          scale: 1,
          duration: MOTION.filter.showDuration,
          ease: MOTION.filter.showEase,
          pointerEvents: "auto",
        });
      } else {
        gsap.to(item, {
          opacity: 0.6,
          filter: "blur(40px) saturate(0)",
          scale: 0.6,
          duration: MOTION.filter.hideDuration,
          ease: MOTION.filter.hideEase,
          pointerEvents: "none",
        });
      }
    });
  }


  intro() {
    this.centerGrid();

    const timeline = gsap.timeline();

    timeline.set(this.dom, { scale: 0.5 });
    timeline.set(this.products, {
      scale: 0.5,
      opacity: 0,
    });

    timeline.to(this.products, {
      scale: 1,
      opacity: 1,
      duration: MOTION.intro.productDuration,
      ease: MOTION.intro.productEase,
      stagger: {
        amount: MOTION.intro.staggerAmount,
        from: MOTION.intro.staggerFrom,
      },
    });
    timeline.to(this.dom, {
      scale: 1,
      duration: MOTION.intro.containerDuration,
      ease: MOTION.intro.containerEase,
      onComplete: () => {
        this.setupDraggable();
        this.addEvents();
        this.observeProducts();
        this.handleDetails();
        this.updateRadar();
      },
    });
  }

  centerGrid() {
    const gridWidth = this.grid.offsetWidth;
    const gridHeight = this.grid.offsetHeight;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const centerX = (windowWidth - gridWidth) / 2;
    const centerY = (windowHeight - gridHeight) / 2;

    gsap.set(this.grid, {
      x: centerX,
      y: centerY,
    });
  }

  setupDraggable() {
    this.dom.classList.add("--is-loaded");

    this.draggable = Draggable.create(this.grid, {
      type: "x,y",
      bounds: {
        minX: -(this.grid.offsetWidth - window.innerWidth) - 200,
        maxX: 200,
        minY: -(this.grid.offsetHeight - window.innerHeight) - 100,
        maxY: 100,
      },
      inertia: true,
      allowEventDefault: true,
      edgeResistance: 0.9,

      onDragStart: () => {
        this.isDragging = true;
        this.grid.classList.add("--is-dragging");
      },

      onDrag: () => this.updateRadar(),
      onThrowUpdate: () => this.updateRadar(),
      onDragEnd: () => {
        this.isDragging = false;
        this.grid.classList.remove("--is-dragging");
        this.updateRadar();
      },
    })[0];
  }


  addEvents() {
    window.addEventListener(
      "wheel",
      (e) => {
        e.preventDefault();

        if (!this.SHOW_DETAILS) {
          const deltaX = -e.deltaX * 7;
          const deltaY = -e.deltaY * 7;

          const currentX = gsap.getProperty(this.grid, "x");
          const currentY = gsap.getProperty(this.grid, "y");

          const newX = currentX + deltaX;
          const newY = currentY + deltaY;

          const bounds = this.draggable.vars.bounds;
          const clampedX = Math.max(bounds.minX, Math.min(bounds.maxX, newX));
          const clampedY = Math.max(bounds.minY, Math.min(bounds.maxY, newY));

          gsap.to(this.grid, {
            x: clampedX,
            y: clampedY,
            duration: 0.3,
            ease: "power3.out",
            onUpdate: () => this.updateRadar(),
          });
        } else {
          this.details.scrollTop += e.deltaY;
        }
      },
      { passive: false }
    );

    window.addEventListener("resize", () => {
      this.updateBounds();
    });

    window.addEventListener("mousemove", (e) => {
      if (this.SHOW_DETAILS) {
        this.handleCursor(e);
      }
    });
  }

  updateBounds() {
    if (this.draggable) {
      this.draggable.vars.bounds = {
        minX: -(this.grid.offsetWidth - window.innerWidth) - 50,
        maxX: 50,
        minY: -(this.grid.offsetHeight - window.innerHeight) - 50,
        maxY: 50,
      };
    }
  }

  updateRadar() {
    const rocky = document.getElementById("radar-rocky");
    if (!rocky || !this.draggable) return;

    const gridX = gsap.getProperty(this.grid, "x");
    const gridY = gsap.getProperty(this.grid, "y");
    const bounds = this.draggable.vars.bounds;

    const radarSize = 44;
    const rockySize = 20;

    const progressX = gsap.utils.mapRange(
      bounds.maxX,
      bounds.minX,
      0,
      1,
      gridX
    );

    const progressY = gsap.utils.mapRange(
      bounds.maxY,
      bounds.minY,
      0,
      1,
      gridY
    );

    const posX = (radarSize - rockySize) * progressX;
    const posY = (radarSize - rockySize) * progressY;

    gsap.to(rocky, {
      x: posX,
      y: posY,
      duration: 0.25,
      ease: "power2.out",
    });
  }

  observeProducts() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const item = entry.target;
        const currentCategory = this.activeCategory || "all";
        const matches =
          currentCategory === "all" ||
          item.dataset.cat === currentCategory ||
          item.dataset.cat === "none";

        if (entry.isIntersecting && matches) {
          gsap.to(item, {
            scale: 1,
            opacity: 1,
            filter: "blur(0px) saturate(1)",
            duration: MOTION.observer.revealDuration,
            ease: MOTION.observer.revealEase,
          });
        } else if (!matches) {
          gsap.to(item, {
            opacity: 0.6,
            filter: "blur(40px) saturate(0)",
            scale: 0.6,
            duration: MOTION.observer.fadeDuration,
            ease: MOTION.observer.fadeEase,
          });
        } else if (!entry.isIntersecting) {
          gsap.to(item, {
            opacity: 0.6,
            scale: 0.6,
            filter: "blur(40px) saturate(0)",
            duration: MOTION.observer.fadeDuration,
            ease: MOTION.observer.fadeEase,
          });
        }
      });
    }, {
      root: null,
      threshold: 0.1,
    });

    this.products.forEach((product) => observer.observe(product));
    this.observer = observer;
  }


  handleDetails() {
    this.SHOW_DETAILS = false;

    this.titles = this.details.querySelectorAll(".details__title p");
    this.texts = this.details.querySelectorAll(".details__body [data-text]");

    // SplitText (already registered)
    new SplitText(this.titles, {
      type: "lines, chars",
      mask: "lines",
      charsClass: "char",
    });

    new SplitText(this.texts, {
      type: "lines",
      mask: "lines",
      linesClass: "line",
    });

    this.products.forEach((product) => {
      product.addEventListener("click", (e) => {
        e.stopPropagation();
        this.showDetails(product);
      });
    });

    this.dom.addEventListener("click", (e) => {
      // Don't hide details if clicking on a link
      if (e.target.tagName === 'A' || e.target.closest('a')) {
        return;
      }
      if (this.SHOW_DETAILS) this.hideDetails();
    });
  }

  observeDetailImages() {
    const images = this.details.querySelectorAll(".details__body img");

    // Set all images to hidden state first
    gsap.set(images, { opacity: 0, y: 40, scale: 0.95 });

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.to(entry.target, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: MOTION.detail.detailImgReveal,
            ease: MOTION.detail.detailImgEase,
            clearProps: "transform,opacity"
          });
          obs.unobserve(entry.target); // only once
        }
      });
    }, {
      threshold: 0.25
    });

    images.forEach(img => observer.observe(img));
  }


  showDetails(product) {
    if (this.SHOW_DETAILS) return;
    this.SHOW_DETAILS = true;
    this.details.classList.add("--is-showing");
    this.dom.classList.add("--is-details-showing");
    document.body.classList.add("--is-details-showing");

    gsap.to(this.dom, {
      x: "-50vw",
      duration: MOTION.detail.panelDuration,
      ease: MOTION.detail.panelEase,
    });

    gsap.to(this.details, {
      x: 0,
      duration: MOTION.detail.panelDuration,
      ease: MOTION.detail.panelEase,
    });

    this.flipProduct(product);

    const title = this.details.querySelector(`[data-title="${product.dataset.id}"]`);
    const text = this.details.querySelector(`[data-desc="${product.dataset.id}"]`);

    // Show only the active title and description
    if (title) {
      title.classList.add("--active");
      gsap.to(title.querySelectorAll(".char"), {
        y: 0,
        duration: MOTION.detail.titleCharDuration,
        delay: MOTION.detail.titleCharDelay,
        ease: MOTION.detail.titleCharEase,
        stagger: MOTION.detail.titleCharStagger,
      });
    }

    if (text) {
      text.classList.add("--active");

      const videos = text.querySelectorAll('video');
      videos.forEach(v => {
        // Restore src if it was purged on previous close
        if (v.dataset.originalSrc) {
          v.setAttribute('src', v.dataset.originalSrc);
        }
        v.currentTime = 0;
        v.load();
        v.play().catch(() => { });
      });

      gsap.to(text.querySelectorAll(".line"), {
        y: 0,
        duration: MOTION.detail.textLineDuration,
        delay: MOTION.detail.textLineDelay,
        ease: MOTION.detail.textLineEase,
        stagger: MOTION.detail.textLineStagger,
      });
    }

    const detailImg = this.details.querySelector(".details__img");
    if (detailImg) {
      gsap.fromTo(detailImg,
        {
          opacity: 0,
          y: 30,
          scale: 0.95,
          filter: "blur(30px)"
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: MOTION.detail.imgDuration,
          delay: MOTION.detail.imgDelay,
          ease: MOTION.detail.imgEase,
        }
      );
    }

    this.observeDetailImages();
    window.addEventListener("mousemove", this._boundHandleCursor = (e) => this.handleCursor(e));
  }

  hideDetails() {
    this.SHOW_DETAILS = false;

    // Fully purge all video media sessions to prevent PiP carry-over
    this.details.querySelectorAll('video').forEach(v => {
      v.pause();
      v.currentTime = 0;
      // Store original src and blank it to kill the media session
      if (v.src && !v.dataset.originalSrc) {
        v.dataset.originalSrc = v.getAttribute('src');
      }
      v.removeAttribute('src');
      v.load();
    });

    this.dom.classList.remove("--is-details-showing");
    document.body.classList.remove("--is-details-showing");

    gsap.to(this.dom, {
      x: 0,
      duration: MOTION.detail.panelDuration,
      delay: MOTION.detail.closeDelay,
      ease: MOTION.detail.panelEase,
      onComplete: () => {
        this.details.classList.remove("--is-showing");
        this.details.scrollTo({ top: 0, behavior: "instant" });

        // Remove --active class from all titles and texts after animation
        this.titles.forEach((t) => t.classList.remove("--active"));
        this.texts.forEach((t) => t.classList.remove("--active"));
      },
    });

    gsap.to(this.details, {
      x: "50vw",
      duration: MOTION.detail.panelDuration,
      delay: MOTION.detail.closeDelay,
      ease: MOTION.detail.panelEase,
    });

    this.unFlipProduct();

    this.titles.forEach((title) => {
      gsap.to(title.querySelectorAll(".char"), {
        y: "100%",
        duration: MOTION.detail.closeTitleDuration,
        ease: MOTION.detail.panelEase,
        stagger: {
          amount: MOTION.detail.closeTitleStagger,
          from: "end",
        },
      });
    });

    this.texts.forEach((text) => {
      gsap.to(text.querySelectorAll(".line"), {
        y: "100%",
        duration: MOTION.detail.closeTextDuration,
        ease: MOTION.detail.panelEase,
        stagger: MOTION.detail.closeTextStagger,
      });
    });
    window.removeEventListener("mousemove", this._boundHandleCursor);
  }

  flipProduct(product) {
    this.currentProduct = product;
    this.originalParent = product.parentNode;

    if (this.observer) {
      this.observer.unobserve(product);
    }

    const state = Flip.getState(product);

    this.detailsThumb.appendChild(product);

    // Set high z-index and position to ensure product flies over the details panel
    gsap.set(product, {
      zIndex: 1000,
      position: "absolute"
    });

    Flip.from(state, {
      absolute: true,
      duration: MOTION.detail.flipDuration,
      ease: MOTION.detail.flipEase,
    });

    gsap.to(this.cross, {
      scale: 1,
      duration: MOTION.detail.crossShowDuration,
      delay: MOTION.detail.crossShowDelay,
      ease: MOTION.detail.crossEase,
    });
  }

  unFlipProduct() {
    if (!this.currentProduct || !this.originalParent) return;

    gsap.to(this.cross, {
      scale: 0,
      duration: MOTION.detail.crossHideDuration,
      ease: MOTION.detail.crossEase,
    });

    const state = Flip.getState(this.currentProduct);

    const finalRect = this.originalParent.getBoundingClientRect();
    const currentRect = this.currentProduct.getBoundingClientRect();

    gsap.set(this.currentProduct, {
      position: "absolute",
      top: currentRect.top - this.detailsThumb.getBoundingClientRect().top + "px",
      left: currentRect.left - this.detailsThumb.getBoundingClientRect().left + "px",
      width: currentRect.width + "px",
      height: currentRect.height + "px",
      zIndex: 10000,
    });

    gsap.to(this.currentProduct, {
      top: finalRect.top - this.detailsThumb.getBoundingClientRect().top + "px",
      left: finalRect.left - this.detailsThumb.getBoundingClientRect().left + "px",
      width: finalRect.width + "px",
      height: finalRect.height + "px",
      duration: MOTION.detail.unflipDuration,
      delay: MOTION.detail.unflipDelay,
      ease: MOTION.detail.unflipEase,
      onComplete: () => {
        this.originalParent.appendChild(this.currentProduct);

        gsap.set(this.currentProduct, {
          position: "",
          top: "",
          left: "",
          width: "",
          height: "",
          zIndex: "",
        });

        this.currentProduct = null;
        this.originalParent = null;
      },
    });
  }

  handleCursor(e) {
    const x = e.clientX;
    const y = e.clientY;

    gsap.to(this.cross, {
      x: x - this.cross.offsetWidth / 2,
      y: y - this.cross.offsetHeight / 2,
      duration: MOTION.cursor.duration,
      ease: MOTION.cursor.ease,
    });
  }
}

export function initGrid() {

  const grid = new Grid();

  const loadingOverlay = document.getElementById("loading-overlay");
  const progressText = loadingOverlay?.querySelector(".loading-overlay__progress");

  const handleProgress = (progress) => {
    if (progressText) {
      progressText.textContent = progress;
    }
  };

  preloadImages(".grid img", handleProgress).then(() => {


    // Fade out loading overlay
    if (loadingOverlay) {
      loadingOverlay.classList.add("--hidden");

      // Wait for fade out animation, then start intro
      setTimeout(() => {
        grid.init();
        initAsciiFilter();
        document.body.classList.remove("loading");

      }, MOTION.overlay.fadeOutWait);
    } else {
      // Fallback if overlay doesn't exist
      grid.init();
      initAsciiFilter();
      document.body.classList.remove("loading");
    }
  });
}
