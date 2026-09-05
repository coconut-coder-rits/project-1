/**
 * ==========================================================================
 * RITVIK VARMA — PORTFOLIO ENGINE & INTERACTIVITY SCRIPT
 * High-End Editorial Dark / Light Mode Interactive System
 *
 * Features:
 * 1. Project Database & Dynamic Modal Viewer with Accessibility Focus Trap
 * 2. Blog Engine with Astro-Grade Client Markdown Parser & Progress Tracker
 * 3. Multilingual Greetings Preloader with Smooth Countdown & Finale
 * 4. Butter-Smooth Physics Cursor (auto-disabled on touch / reduced motion)
 * 5. Magnetic Hover Physics on Interactive Elements & Action Buttons
 * 6. 3D Perspective Tilt on Project & Skill Cards
 * 7. IntersectionObserver Scroll Reveals & Active Navigation Spy
 * 8. Theme Switcher (Dark / Light Mode) with LocalStorage Persistence
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // ==========================================================================
  // 1. DATA REPOSITORIES: BLOGS & INSIGHTS
  // ==========================================================================
  /**
   * Articles and technical notes rendered via client-side Markdown.
   */
  const BLOGS = [
    {
      id: "building-interactive-portfolio",
      title: "Building an Interactive Portfolio at 14",
      date: "August 21, 2026",
      readTime: "5 min read",
      tag: "Creative Motion",
      excerpt:
        "How I reverse-engineered 's iconic portfolio physics using pure vanilla JavaScript and CSS3 transforms — without external heavy animation libraries.",
      markdown: `# Building an Interactive  Portfolio at 14

*Published on August 21, 2026 • 5 min read • Web Development, Motion, JavaScript*

---

## The Inspiration

When I first encountered 's portfolio dennissnellenberg.com , I was blown away by the level of craft, tactile feedback, and physics-driven micro-interactions. The smooth momentum cursor, the magnetic pull on buttons, and the seamless transition between dark and light themes felt completely alive.

At 14 years old, having started coding only a year ago, I challenged myself to reverse-engineer and build this entire experience from scratch using **pure Vanilla JavaScript and CSS3 transforms** — without relying on heavy third-party animation libraries like GSAP or Three.js.

\`\`\`javascript
// Linear Interpolation (Lerp) for Butter-Smooth Cursor Momentum
function lerp(start, end, factor) {
  return start + (end - start) * factor;
}

// Running inside 60fps requestAnimationFrame
dotX += (mouseX - dotX) * 0.6;
dotY += (mouseY - dotY) * 0.6;
circleX += (mouseX - circleX) * 0.18;
circleY += (mouseY - circleY) * 0.18;
\`\`\`

---

## Key Challenges Overcome

### 1. Vector Magnetic Pull
To achieve the magnetic button effect where buttons pull gently toward your cursor:
1. Calculate the bounding box center \`(centerX, centerY)\` on \`mousemove\`.
2. Compute distance offsets \`(dx, dy)\` and apply a weighted hardware transform \`translate3d(dx * 0.35px, dy * 0.35px, 0)\`.
3. On \`mouseleave\`, snap back using a custom cubic-bezier spring curve \`cubic-bezier(0.22, 1, 0.36, 1)\`.

### 2. Multi-Language 100+ Greeting Loader
Instead of a static loading bar, I engineered a high-velocity language ticker that cycles through world languages with each numeric increment, resolving at 100% into my name.

---

## What I Learned
Building this taught me that true performance in modern web design comes from understanding the browser rendering pipeline — avoiding layout thrashing, leveraging \`transform\` and \`opacity\`, and writing clean, modular vanilla JavaScript.

*Still learning, still building, and just getting started.* ✦`,
    },
    {
      id: "creative-coding-physics",
      title: "Engineering Custom Physics & Dynamic Glitch Effects on the Web",
      date: "August 8, 2026",
      readTime: "6 min read",
      tag: "CSS3 & Canvas",
      excerpt:
        "Exploring vector velocity, elastic springs, and GPU-accelerated transforms for high-impact editorial web experiences.",
      markdown: `# Engineering Custom Physics & Dynamic Glitch Effects on the Web

*Published on August 8, 2026 • 6 min read • Creative Coding, CSS3, Canvas*

---

## Why Physics-Driven UI Matters

Traditional web animation often feels rigid because keyframes run linearly or on generic ease curves. When you introduce **vector velocity, mass momentum, and elasticity**, interactive elements feel responsive and grounded in reality.

---

## Interactive 3D Perspective Tilt

By calculating pointer coordinates relative to card bounds, we apply real-time 3D rotation matrix transforms:

\`\`\`javascript
const rect = card.getBoundingClientRect();
const x = e.clientX - rect.left;
const y = e.clientY - rect.top;
const rotateX = ((y / rect.height) - 0.5) * -16;
const rotateY = ((x / rect.width) - 0.5) * 16;

card.style.transform = \`perspective(1000px) rotateX(\${rotateX}deg) rotateY(\${rotateY}deg) translateY(-6px)\`;
\`\`\`

This delivers a tangible, tactile physical surface response under user interaction.`,
    },
    {
      id: "learning-python-backend",
      title:
        "My Journey from Frontend Vanilla JS to Python & Backend Fundamentals",
      date: "August 15, 2026",
      readTime: "4 min read",
      tag: "Python & APIs",
      excerpt:
        "Stepping into backend architecture: RESTful API design with FastAPI, asynchronous microservices, and connecting AI models to modern client interfaces.",
      markdown: `# My Journey from Frontend Vanilla JS to Python & Backend Fundamentals

*Published on August 15, 2026 • 4 min read • Python, Backend, API Architecture*

---

## Moving Beyond the Browser

After spending months mastering the DOM, JavaScript asynchronous patterns, and modern CSS layouts, I realized that building truly useful applications requires a rock-solid backend. That curiosity led me directly into **Python**.

Python's clean syntax and extensive ecosystem made it the perfect bridge to dive into:
- RESTful API design with FastAPI & Flask
- Asynchronous request handling and background worker threads
- Database schemas with SQLite and PostgreSQL
- LLM integration pipelines and streaming socket endpoints

\`\`\`python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Ritvik's Microservice Engine")

class PromptRequest(BaseModel):
    query: str
    temperature: float = 0.7

@app.post("/api/stream")
async def generate_response(payload: PromptRequest):
    # Streaming response generation with sub-10ms latency
    return {"status": "success", "message": f"Processing: {payload.query}"}
\`\`\`

---

## The Next Frontier
I am currently working on connecting local Python microservices to my interactive frontend experiments, creating intelligent AI interfaces and real-time simulations.`,
    },
  ];

  // Current active index for article pagination
  let currentBlogIndex = 0;
  let previouslyFocusedElement = null;

  // Environment Capabilities
  const isTouchDevice =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia("(pointer: coarse)").matches;
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  // ==========================================================================
  // 2A. LENIS SMOOTH-SCROLL (safe, reduced-motion-aware)
  // ==========================================================================
  let lenisInstance = null;
  let lenisRafId = null;
  let lenisReady = false;
  const scrollProgressTrack = document.getElementById("scrollProgressTrack");
  const scrollProgressThumb = document.getElementById("scrollProgressThumb");
  let thumbCurrentY = 0;
  let thumbTargetY = 0;
  let thumbLerpFrame = null;
  let scrollbarIdleTimer = null;
  let isDraggingScrollbar = false;

  function applyScrollbarVisualState(isActive) {
    if (!scrollProgressTrack || !scrollProgressThumb) return;

    scrollProgressTrack.classList.toggle("is-active", isActive);
    scrollProgressThumb.classList.toggle("is-active", isActive);

    if (isActive) {
      clearTimeout(scrollbarIdleTimer);
      scrollbarIdleTimer = setTimeout(() => {
        scrollProgressTrack.classList.remove("is-active");
        scrollProgressThumb.classList.remove("is-active");
      }, 600);
    }
  }

  function updateScrollThumbVisual() {
    if (!scrollProgressTrack || !scrollProgressThumb) return;

    const trackHeight = scrollProgressTrack.clientHeight;
    const thumbHeight = Math.max(
      48,
      (window.innerHeight / document.documentElement.scrollHeight) *
        trackHeight,
    );
    const maxTravel = Math.max(trackHeight - thumbHeight, 0);

    scrollProgressThumb.style.height = `${thumbHeight}px`;
    scrollProgressThumb.style.width = `${prefersReducedMotion ? 8 : 10}px`;

    if (lenisInstance) {
      const progress = Math.min(Math.max(lenisInstance.progress, 0), 1);
      thumbTargetY = maxTravel * progress;
    }

    if (thumbLerpFrame) return;

    const animateThumb = () => {
      thumbCurrentY += (thumbTargetY - thumbCurrentY) * 0.14;
      scrollProgressThumb.style.transform = `translateY(${thumbCurrentY}px)`;

      if (Math.abs(thumbTargetY - thumbCurrentY) > 0.2) {
        thumbLerpFrame = requestAnimationFrame(animateThumb);
      } else {
        thumbCurrentY = thumbTargetY;
        scrollProgressThumb.style.transform = `translateY(${thumbCurrentY}px)`;
        thumbLerpFrame = null;
      }
    };

    thumbLerpFrame = requestAnimationFrame(animateThumb);
  }

  function bindCustomScrollbar() {
    if (!scrollProgressTrack || !scrollProgressThumb || !lenisInstance) return;

    document.documentElement.classList.add("lenis-ready");
    scrollProgressTrack.classList.add("is-visible");
    scrollProgressThumb.classList.add("is-visible");

    updateScrollThumbVisual();

    lenisInstance.on("scroll", ({ progress }) => {
      if (!isDraggingScrollbar) {
        updateScrollThumbVisual();
      }

      if (progress > 0 || document.documentElement.scrollTop > 0) {
        applyScrollbarVisualState(true);
      }
    });

    const handleThumbPointerDown = (event) => {
      event.preventDefault();
      isDraggingScrollbar = true;
      scrollProgressThumb.setPointerCapture?.(event.pointerId);
      applyScrollbarVisualState(true);
    };

    const handleThumbPointerMove = (event) => {
      if (!isDraggingScrollbar || !lenisInstance) return;

      const trackRect = scrollProgressTrack.getBoundingClientRect();
      const thumbRect = scrollProgressThumb.getBoundingClientRect();
      const dragDelta = event.clientY - thumbRect.top - thumbRect.height / 2;
      const maxThumbTravel = Math.max(trackRect.height - thumbRect.height, 0);
      const nextProgress = Math.min(
        Math.max(
          (event.clientY - trackRect.top - thumbRect.height / 2) /
            Math.max(maxThumbTravel, 1),
          0,
        ),
        1,
      );

      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        0,
      );

      if (maxScroll > 0) {
        lenisInstance.scrollTo(maxScroll * nextProgress, {
          duration: 0.3,
        });
      }

      if (dragDelta !== 0) {
        applyScrollbarVisualState(true);
      }
    };

    const stopDraggingScrollbar = () => {
      isDraggingScrollbar = false;
      applyScrollbarVisualState(false);
    };

    scrollProgressThumb.addEventListener("pointerdown", handleThumbPointerDown);
    scrollProgressThumb.addEventListener("pointermove", handleThumbPointerMove);
    scrollProgressThumb.addEventListener("pointerup", stopDraggingScrollbar);
    scrollProgressThumb.addEventListener("pointerleave", stopDraggingScrollbar);
    scrollProgressThumb.addEventListener(
      "pointercancel",
      stopDraggingScrollbar,
    );

    scrollProgressTrack.addEventListener("click", (event) => {
      if (!lenisInstance) return;
      const rect = scrollProgressTrack.getBoundingClientRect();
      const clickY = event.clientY - rect.top;
      const thumbHeight = parseFloat(scrollProgressThumb.style.height || "48");
      const maxTravel = Math.max(rect.height - thumbHeight, 0);
      const progress =
        maxTravel > 0
          ? Math.min(Math.max((clickY - thumbHeight / 2) / maxTravel, 0), 1)
          : 0;
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        0,
      );

      lenisInstance.scrollTo(maxScroll * progress, { duration: 0.8 });
      applyScrollbarVisualState(true);
    });

    window.addEventListener("resize", updateScrollThumbVisual);
    window.addEventListener(
      "scroll",
      () => {
        if (!isDraggingScrollbar) {
          updateScrollThumbVisual();
        }
      },
      { passive: true },
    );
    scrollProgressTrack.addEventListener("pointerenter", () =>
      applyScrollbarVisualState(true),
    );
    scrollProgressTrack.addEventListener("pointerleave", () =>
      applyScrollbarVisualState(false),
    );
  }

  function cleanupLenis() {
    if (lenisRafId) {
      cancelAnimationFrame(lenisRafId);
      lenisRafId = null;
    }

    if (thumbLerpFrame) {
      cancelAnimationFrame(thumbLerpFrame);
      thumbLerpFrame = null;
    }

    if (lenisInstance && typeof lenisInstance.destroy === "function") {
      lenisInstance.destroy();
    }

    lenisInstance = null;
    lenisReady = false;
    document.documentElement.classList.remove("lenis-ready");
    document.documentElement.style.scrollBehavior = "";
    if (scrollProgressTrack)
      scrollProgressTrack.classList.remove("is-visible", "is-active");
    if (scrollProgressThumb)
      scrollProgressThumb.classList.remove("is-visible", "is-active");
  }

  try {
    if (!prefersReducedMotion && typeof window.Lenis !== "undefined") {
      lenisInstance = new window.Lenis({
        duration: 1.2,
        smoothWheel: true,
      });

      lenisReady = true;
      document.documentElement.style.scrollBehavior = "auto";
      bindCustomScrollbar();

      const animate = (time) => {
        lenisInstance.raf(time);
        lenisRafId = requestAnimationFrame(animate);
      };

      lenisRafId = requestAnimationFrame(animate);
      window.addEventListener("beforeunload", cleanupLenis, { once: true });
    }
  } catch (error) {
    console.warn("Lenis initialization failed:", error);
  }

  // ==========================================================================
  // 3. DOM ELEMENT REFERENCES
  // ==========================================================================
  const loader = document.getElementById("loader");
  const loaderCounter = document.getElementById("loaderCounter");
  const loaderWord = document.getElementById("loaderWord");
  const loaderProgressBar = document.getElementById("loaderProgressBar");
  const nav = document.getElementById("nav");
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const themeToggle = document.getElementById("themeToggle");
  const footerToTop = document.getElementById("footerToTop");

  // Blogs DOM Elements
  const blogsGrid = document.getElementById("blogsGrid");
  const blogReader = document.getElementById("blogReader");
  const blogReaderBar = document.getElementById("blogReaderBar");
  const blogReaderClose = document.getElementById("blogReaderClose");
  const blogReaderTags = document.getElementById("blogReaderTags");
  const blogReaderTitle = document.getElementById("blogReaderTitle");
  const blogReaderDate = document.getElementById("blogReaderDate");
  const blogReaderTime = document.getElementById("blogReaderTime");
  const blogReaderContent = document.getElementById("blogReaderContent");
  const prevBlogBtn = document.getElementById("prevBlogBtn");
  const nextBlogBtn = document.getElementById("nextBlogBtn");
  const backToBlogsBtn = document.getElementById("backToBlogsBtn");

  // Cursor Elements
  const cursorDot = document.querySelector(".cursor-dot");
  const cursorCircle = document.querySelector(".cursor-circle");
  const cursorViewText = document.querySelector(".cursor-view-text");

  // ==========================================================================
  // 4. ACCESSIBILITY: FOCUS TRAPPING UTILITIES
  // ==========================================================================
  /**
   * Traps keyboard focus within an active modal dialog for accessibility (WCAG 2.1).
   * @param {HTMLElement} modalEl - The modal container to trap focus inside.
   */
  function trapFocus(modalEl) {
    previouslyFocusedElement = document.activeElement;
    modalEl.setAttribute("aria-hidden", "false");

    const focusableSelectors =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const focusableElements = modalEl.querySelectorAll(focusableSelectors);
    if (!focusableElements.length) return;

    const firstEl = focusableElements[0];
    const lastEl = focusableElements[focusableElements.length - 1];

    // Focus the first element inside the modal
    firstEl.focus();

    modalEl._focusTrapHandler = function (e) {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        }
      } else {
        if (document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };

    modalEl.addEventListener("keydown", modalEl._focusTrapHandler);
  }

  /**
   * Releases the focus trap and restores focus to the previously active element.
   * @param {HTMLElement} modalEl - The modal container being closed.
   */
  function releaseFocus(modalEl) {
    if (modalEl._focusTrapHandler) {
      modalEl.removeEventListener("keydown", modalEl._focusTrapHandler);
      delete modalEl._focusTrapHandler;
    }
    modalEl.setAttribute("aria-hidden", "true");
    if (
      previouslyFocusedElement &&
      typeof previouslyFocusedElement.focus === "function"
    ) {
      previouslyFocusedElement.focus();
    }
  }

  // ==========================================================================
  // 5. THEME SWITCHER (Dark & Light Mode)
  // ==========================================================================
  /**
   * Applies the requested theme across DOM and synchronizes with localStorage.
   * @param {'dark' | 'light'} theme - Target color theme.
   */
  function applyTheme(theme) {
    const isLight = theme === "light";
    if (isLight) {
      document.documentElement.setAttribute("data-theme", "light");
      document.body.classList.add("light-theme");
    } else {
      document.documentElement.removeAttribute("data-theme");
      document.body.classList.remove("light-theme");
    }

    if (themeToggle) {
      themeToggle.setAttribute(
        "aria-label",
        isLight ? "Switch to dark theme" : "Switch to light theme",
      );
    }

    localStorage.setItem("rv_portfolio_theme", theme);
  }

  // Initialize theme from storage or default to dark
  const savedTheme = localStorage.getItem("rv_portfolio_theme") || "dark";
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current =
        document.documentElement.getAttribute("data-theme") === "light"
          ? "light"
          : "dark";
      applyTheme(current === "light" ? "dark" : "light");
    });
  }

  // ==========================================================================
  // 6. MULTI-LANGUAGE PRELOADER
  // ==========================================================================
  const GREETINGS_LIST = [
    "Hello",
    "Bonjour",
    "Hola",
    "Ciao",
    "こんにちは",
    "नमस्ते",
    "Olá",
    "Guten Tag",
    "안녕하세요",
    "مرحبا",
    "Vanakkam",
    "Ritvik Varma",
  ];

  let loaderFinished = false;

  /**
   * Cycles through international greetings and triggers the hero reveal on completion.
   */
  function runLoader() {
    if (!loader || prefersReducedMotion) {
      finishLoaderImmediate();
      return;
    }

    let currentIndex = 0;
    const totalWords = GREETINGS_LIST.length;
    const stepDuration = 280;

    function step() {
      if (loaderFinished) return;
      const word = GREETINGS_LIST[currentIndex];
      const progress = Math.min(
        Math.round(((currentIndex + 1) / totalWords) * 100),
        100,
      );

      if (loaderWord) {
        loaderWord.style.opacity = "0";
        loaderWord.style.transform = "translateY(6px)";
        setTimeout(() => {
          loaderWord.textContent = word;
          loaderWord.style.opacity = "1";
          loaderWord.style.transform = "translateY(0)";
        }, 40);
      }

      if (loaderCounter)
        loaderCounter.textContent = String(progress).padStart(2, "0");
      if (loaderProgressBar) loaderProgressBar.style.width = `${progress}%`;

      currentIndex++;
      if (currentIndex < totalWords) {
        setTimeout(step, stepDuration);
      } else {
        setTimeout(finishLoader, stepDuration + 100);
      }
    }

    step();
  }

  function finishLoader() {
    if (loaderFinished) return;
    loaderFinished = true;

    if (loaderCounter) loaderCounter.textContent = "100";
    if (loaderProgressBar) loaderProgressBar.style.width = "100%";
    if (loaderWord) loaderWord.textContent = "Ritvik Varma";

    setTimeout(() => {
      if (loader) loader.classList.add("exit");
      setTimeout(revealHero, 500);
    }, 300);
  }

  function finishLoaderImmediate() {
    loaderFinished = true;
    if (loader) loader.classList.add("exit");
    revealHero();
  }

  function revealHero() {
    if (nav) nav.classList.add("visible");
    document.querySelectorAll(".hero [data-reveal]").forEach((el, idx) => {
      setTimeout(() => el.classList.add("revealed"), idx * 80 + 50);
    });
  }

  runLoader();
  setTimeout(() => {
    if (!loaderFinished) finishLoader();
  }, 4000);

  // ==========================================================================
  // 6B. ABOUT SECTION TYPEWRITER EFFECT
  // ==========================================================================
  const TYPEWRITER_PHRASES = [
    "Frontend Developer",
    "Framework Explorer",
    "Creative Coder",
    "Problem Solver",
    "Still Learning Every Day",
  ];

  const TYPEWRITER_COLORS = [
    "#f28f79",
    "#9c2fb7",
    "#f15c3b",
    "#13d0a4",
    "#9b4ed2",
  ];

  const typewriterTextEl = document.getElementById("typewriterText");
  const typewriterCursorEl = document.getElementById("typewriterCursor");

  function runTypewriter() {
    if (!typewriterTextEl) return;

    if (prefersReducedMotion) {
      typewriterTextEl.textContent = TYPEWRITER_PHRASES[0];
      return;
    }

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typingSpeed = 70;
    const deletingSpeed = 40;
    const pauseAfterTyping = 1400;
    const pauseAfterDeleting = 400;

    function setTypewriterColor() {
      const color = TYPEWRITER_COLORS[phraseIndex];
      typewriterTextEl.style.setProperty("--typewriter-color", color);
      if (typewriterCursorEl) {
        typewriterCursorEl.style.setProperty("--typewriter-color", color);
      }
    }

    function tick() {
      const currentPhrase = TYPEWRITER_PHRASES[phraseIndex];

      if (!isDeleting) {
        if (charIndex === 0) setTypewriterColor();
        charIndex++;
        typewriterTextEl.textContent = currentPhrase.slice(0, charIndex);

        if (charIndex === currentPhrase.length) {
          isDeleting = true;
          setTimeout(tick, pauseAfterTyping);
          return;
        }
        setTimeout(tick, typingSpeed);
      } else {
        charIndex--;
        typewriterTextEl.textContent = currentPhrase.slice(0, charIndex);

        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % TYPEWRITER_PHRASES.length;
          setTimeout(tick, pauseAfterDeleting);
          return;
        }
        setTimeout(tick, deletingSpeed);
      }
    }

    tick();
  }

  runTypewriter();

  // ==========================================================================
  // 7. ULTRA-SMOOTH MOMENTUM CURSOR (Desktop Only)
  // ==========================================================================
  if (!isTouchDevice && !prefersReducedMotion && cursorDot && cursorCircle) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let circleX = mouseX,
      circleY = mouseY;
    let dotX = mouseX,
      dotY = mouseY;
    let hasMovedMouse = false;

    window.addEventListener(
      "mousemove",
      (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!hasMovedMouse) {
          hasMovedMouse = true;
          dotX = circleX = mouseX;
          dotY = circleY = mouseY;
          cursorDot.style.opacity = "1";
          cursorCircle.style.opacity = "1";
        }
      },
      { passive: true },
    );

    document.addEventListener("mouseleave", () => {
      cursorDot.style.opacity = "0";
      cursorCircle.style.opacity = "0";
    });

    document.addEventListener("mouseenter", () => {
      if (hasMovedMouse) {
        cursorDot.style.opacity = "1";
        cursorCircle.style.opacity = "1";
      }
    });

    function renderCursor() {
      if (hasMovedMouse) {
        dotX += (mouseX - dotX) * 0.6;
        dotY += (mouseY - dotY) * 0.6;
        circleX += (mouseX - circleX) * 0.18;
        circleY += (mouseY - circleY) * 0.18;

        cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0) translate(-50%, -50%)`;
        cursorCircle.style.transform = `translate3d(${circleX}px, ${circleY}px, 0) translate(-50%, -50%)`;

        if (cursorViewText) {
          cursorViewText.style.transform = `translate3d(${circleX}px, ${circleY}px, 0) translate(-50%, -50%)`;
        }
      }
      requestAnimationFrame(renderCursor);
    }

    requestAnimationFrame(renderCursor);

    // Interactive element hover detection
    const hoverSelector =
      "a, button, input, textarea, .skill-item, .blog-card, .project-row, [data-magnetic]";
    document.addEventListener("mouseover", (e) => {
      if (
        e.target.closest(hoverSelector) &&
        !e.target.closest(".project-row")
      ) {
        document.body.classList.add("cursor-hover");
      }
    });

    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(hoverSelector)) {
        document.body.classList.remove("cursor-hover");
      }
    });
  }

  // ==========================================================================
  // 8. MAGNETIC BUTTON PHYSICS
  // ==========================================================================
  function applyMagneticPhysics() {
    if (isTouchDevice || prefersReducedMotion) return;

    document
      .querySelectorAll(
        "[data-magnetic], .btn-get-in-touch, .hero-btn-primary, .hero-btn-secondary, .nav-cta-btn",
      )
      .forEach((el) => {
        el.addEventListener(
          "mousemove",
          (e) => {
            const rect = el.getBoundingClientRect();
            const dx = e.clientX - (rect.left + rect.width / 2);
            const dy = e.clientY - (rect.top + rect.height / 2);
            el.style.transform = `translate3d(${dx * 0.3}px, ${dy * 0.3}px, 0)`;
          },
          { passive: true },
        );

        el.addEventListener("mouseleave", () => {
          el.style.transform = "translate3d(0, 0, 0)";
          el.style.transition =
            "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)";
        });

        el.addEventListener("mouseenter", () => {
          el.style.transition = "transform 0.1s ease-out";
        });
      });
  }

  applyMagneticPhysics();

  function applyCardTilt(selector) {
    if (isTouchDevice || prefersReducedMotion) return;

    document.querySelectorAll(selector).forEach((card) => {
      if (card.dataset.tiltBound === "true") return;
      card.dataset.tiltBound = "true";

      const resetTilt = () => {
        card.style.setProperty("--tilt-x", "0deg");
        card.style.setProperty("--tilt-y", "0deg");
        card.style.setProperty("--lift", "0px");
        card.style.transition =
          "transform 0.55s var(--ease-spring), border-color 0.3s ease, box-shadow 0.4s ease";
      };

      card.addEventListener(
        "mousemove",
        (e) => {
          const rect = card.getBoundingClientRect();
          const offsetX = (e.clientX - rect.left) / rect.width;
          const offsetY = (e.clientY - rect.top) / rect.height;
          const rotateX = (0.5 - offsetY) * 14;
          const rotateY = (offsetX - 0.5) * 16;

          card.style.transition = "transform 0.08s ease-out";
          card.style.setProperty("--tilt-x", `${rotateX}deg`);
          card.style.setProperty("--tilt-y", `${rotateY}deg`);
          card.style.setProperty("--lift", "-6px");
        },
        { passive: true },
      );

      card.addEventListener("mouseleave", resetTilt);
      card.addEventListener("mouseenter", () => {
        card.style.transition = "transform 0.12s ease-out";
      });
      resetTilt();
    });
  }

  // ==========================================================================
  // 9. ASTRO-GRADE CLIENT-SIDE MARKDOWN PARSER
  // ==========================================================================
  /**
   * Converts markdown text into structured semantic HTML with syntax wrappers.
   * @param {string} md - Markdown content.
   * @returns {string} Sanitized HTML output.
   */
  function parseMarkdown(md) {
    if (!md) return "";

    let content = md
      .replace(/^#\s+[^\n]+/m, "")
      .replace(/^\*[^\n]+\*/m, "")
      .replace(/^---/m, "")
      .trim();

    // Fenced Code Blocks
    content = content.replace(
      /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g,
      (_, lang, code) => {
        const language = lang || "code";
        const cleanCode = code
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
        return `
        <div class="code-block-wrapper">
          <div class="code-block-header">
            <span>${language}</span>
            <button class="code-copy-btn" aria-label="Copy code snippet">
              <span>Copy</span>
            </button>
          </div>
          <pre><code>${cleanCode}</code></pre>
        </div>
      `;
      },
    );

    content = content
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^\> (.*$)/gim, "<blockquote>$1</blockquote>")
      .replace(/^---$/gim, "<hr />")
      .replace(/\*\*\*(.*?)\*\*\*/g, "<strong><em>$1</em></strong>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1 ↗</a>',
      )
      .replace(/^\s*-\s+(.*)$/gim, "<li>$1</li>");

    content = content.replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>");

    const blocks = content.split(/\n{2,}/);
    return blocks
      .map((block) => {
        const trimmed = block.trim();
        if (!trimmed) return "";
        if (/^<(h[1-6]|div|blockquote|hr|ul|li)/i.test(trimmed)) return trimmed;
        return `<p>${trimmed.replace(/\n/g, "<br />")}</p>`;
      })
      .join("\n");
  }

  // ==========================================================================
  // 11. BLOGS RENDERER & ARTICLE VIEWER
  // ==========================================================================
  function renderBlogs() {
    if (!blogsGrid) return;

    blogsGrid.innerHTML = BLOGS.map(
      (blog, idx) => `
      <article class="blog-card scroll-reveal sr-delay-${idx + 1}" data-scroll-reveal data-blog-index="${idx}" data-category="${blog.tag.toLowerCase().replace(/[^a-z0-9]+/g, "-")}" tabindex="0" role="button" aria-label="Read article: ${blog.title}">
        <div class="blog-card-content">
          <div class="blog-card-top">
            <span class="blog-tag"><span class="blog-tag-icon" aria-hidden="true">✦</span>${blog.tag}</span>
            <span class="blog-reading-time"><span aria-hidden="true">◷</span>${blog.readTime}</span>
          </div>
          <h3 class="blog-card-title">${blog.title}</h3>
          <p class="blog-card-excerpt">${blog.excerpt}</p>
        </div>
        <div class="blog-card-footer">
          <span class="blog-date">${blog.date}</span>
          <div class="blog-read-link">
            <span>Read Article</span>
            <span aria-hidden="true">↗</span>
          </div>
        </div>
      </article>
    `,
    ).join("");

    blogsGrid.querySelectorAll(".blog-card").forEach((card) => {
      const idx = parseInt(card.dataset.blogIndex, 10);
      card.addEventListener("click", (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty("--ripple-x", `${event.clientX - rect.left}px`);
        card.style.setProperty("--ripple-y", `${event.clientY - rect.top}px`);
        card.classList.remove("is-rippling");
        requestAnimationFrame(() => card.classList.add("is-rippling"));
        openBlogReader(idx);
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openBlogReader(idx);
        }
      });
    });

    applyCardTilt(".blog-card");
  }

  renderBlogs();

  function openBlogReader(index) {
    currentBlogIndex = index;
    const blog = BLOGS[index];
    if (!blog || !blogReader) return;

    if (blogReaderTags)
      blogReaderTags.innerHTML = `<span class="blog-tag">${blog.tag}</span>`;
    if (blogReaderTitle) blogReaderTitle.textContent = blog.title;
    if (blogReaderDate) blogReaderDate.textContent = blog.date;
    if (blogReaderTime) blogReaderTime.textContent = blog.readTime;

    if (blogReaderContent) {
      blogReaderContent.innerHTML = parseMarkdown(blog.markdown);
      setupCodeCopyButtons();
    }

    document.documentElement.classList.add("no-scroll");
    blogReader.classList.add("active");
    blogReader.scrollTop = 0;
    if (blogReaderBar) blogReaderBar.style.width = "0%";
    trapFocus(blogReader);
  }

  function closeBlogReader() {
    if (!blogReader) return;
    blogReader.classList.remove("active");
    document.documentElement.classList.remove("no-scroll");
    releaseFocus(blogReader);
  }

  if (blogReaderClose)
    blogReaderClose.addEventListener("click", closeBlogReader);
  if (backToBlogsBtn) {
    backToBlogsBtn.addEventListener("click", () => {
      closeBlogReader();
      const target = document.getElementById("blogs");
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  }

  if (prevBlogBtn) {
    prevBlogBtn.addEventListener("click", () => {
      openBlogReader((currentBlogIndex - 1 + BLOGS.length) % BLOGS.length);
    });
  }

  if (nextBlogBtn) {
    nextBlogBtn.addEventListener("click", () => {
      openBlogReader((currentBlogIndex + 1) % BLOGS.length);
    });
  }

  // Reading progress tracking
  if (blogReader && blogReaderBar) {
    blogReader.addEventListener(
      "scroll",
      () => {
        const scrollable = blogReader.scrollHeight - blogReader.clientHeight;
        if (scrollable > 0) {
          const pct = (blogReader.scrollTop / scrollable) * 100;
          blogReaderBar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
        }
      },
      { passive: true },
    );
  }

  // Code Copy Button Handler
  function setupCodeCopyButtons() {
    if (!blogReaderContent) return;
    blogReaderContent.querySelectorAll(".code-copy-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const wrapper = btn.closest(".code-block-wrapper");
        const codeEl = wrapper ? wrapper.querySelector("pre code") : null;
        if (!codeEl) return;

        try {
          await navigator.clipboard.writeText(codeEl.textContent || "");
          btn.classList.add("copied");
          const labelEl = btn.querySelector("span");
          if (labelEl) labelEl.textContent = "Copied!";
          setTimeout(() => {
            btn.classList.remove("copied");
            if (labelEl) labelEl.textContent = "Copy";
          }, 2000);
        } catch (err) {
          console.warn("Clipboard write failed", err);
        }
      });
    });
  }

  // ==========================================================================
  // 12. 3D CARD TILT FOR SKILLS
  // ==========================================================================
  applyCardTilt(".skills-category, .journey-thanks");

  // ==========================================================================
  // 13. SCROLL REVEALS & ACTIVE NAVIGATION TRACKER
  // ==========================================================================
  const scrollRevealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          if (entry.target.matches(".work-count, .blogs-count")) {
            animateCounter(entry.target);
          }
          scrollRevealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  document
    .querySelectorAll("[data-scroll-reveal]")
    .forEach((el) => scrollRevealObserver.observe(el));

  function animateCounter(element) {
    if (element.dataset.counterAnimated) return;
    element.dataset.counterAnimated = "true";
    const match = element.textContent.trim().match(/^(\d+)\s*(.*)$/);
    if (!match) return;

    const target = Number(match[1]);
    const suffix = match[2];
    if (prefersReducedMotion) {
      element.textContent = `${String(target).padStart(2, "0")} ${suffix}`;
      return;
    }
    const duration = 900;
    const startTime = performance.now();

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = `${String(Math.round(target * eased)).padStart(2, "0")} ${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    }

    element.textContent = `00 ${suffix}`;
    requestAnimationFrame(tick);
  }

  function prepareMotionHooks() {
    document
      .querySelectorAll(".skills-grid, .blogs-grid, .project-list")
      .forEach((grid) => {
        grid.querySelectorAll(".scroll-reveal").forEach((item, index) => {
          item.style.transitionDelay = `${index * 80}ms`;
        });
      });

    document
      .querySelectorAll(".contact-avatar-pill, .blog-reader img")
      .forEach((image) => image.classList.add("image-reveal"));

    document
      .querySelectorAll(
        ".hero-btn-primary, .hero-btn-secondary, .btn-get-in-touch, .nav-cta-btn",
      )
      .forEach((button) => button.classList.add("btn-sheen"));
  }

  prepareMotionHooks();
  applyCardTilt(".skills-category, .blog-card, .journey-thanks");

  const imageRevealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          imageRevealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 },
  );

  document
    .querySelectorAll(".image-reveal")
    .forEach((image) => imageRevealObserver.observe(image));

  const sections = document.querySelectorAll("section[id], footer");
  const navLinks = document.querySelectorAll("[data-nav-link]");

  window.addEventListener(
    "scroll",
    () => {
      const scrollY = window.scrollY;

      if (nav) {
        if (scrollY > 50) nav.classList.add("scrolled");
        else nav.classList.remove("scrolled");
      }

      let currentSection = "";
      sections.forEach((sec) => {
        const top = sec.offsetTop - 140;
        const height = sec.offsetHeight;
        if (scrollY >= top && scrollY < top + height) {
          currentSection = sec.getAttribute("id");
        }
      });

      navLinks.forEach((link) => {
        link.classList.remove("active");
        const href = link.getAttribute("href").replace("#", "");
        if (
          href === currentSection ||
          (href === "top" && currentSection === "")
        ) {
          link.classList.add("active");
        }
      });
    },
    { passive: true },
  );

  // ==========================================================================
  // 14. MOBILE MENU & GLOBAL CONTROLS
  // ==========================================================================
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const isActive = menuToggle.classList.toggle("active");
      mobileMenu.classList.toggle("active");
      menuToggle.setAttribute("aria-expanded", String(isActive));
      if (isActive) document.documentElement.classList.add("no-scroll");
      else document.documentElement.classList.remove("no-scroll");
    });

    document.querySelectorAll("[data-mobile-link]").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.classList.remove("active");
        mobileMenu.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        document.documentElement.classList.remove("no-scroll");
      });
    });
  }

  // Keyboard shortcut: Escape to close active dialogs
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (blogReader && blogReader.classList.contains("active"))
        closeBlogReader();
      if (mobileMenu && mobileMenu.classList.contains("active")) {
        menuToggle.classList.remove("active");
        mobileMenu.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        document.documentElement.classList.remove("no-scroll");
      }
    }
  });

  // Back to Top Button
  if (footerToTop) {
    footerToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // Smooth anchor scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href").slice(1);
      if (!targetId || targetId === "main") return;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});
