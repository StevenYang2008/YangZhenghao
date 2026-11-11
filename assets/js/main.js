/* ==========================================================================
   杨正昊 · Personal Portfolio — interactions
   Vanilla JS, no dependencies.
   ========================================================================== */

(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- legacy anchor links → dedicated pages ---------- */
  /* 旧版的 #education 等锚点仍然可用，直接跳到对应栏目页面 */

  var legacyPages = {
    "#education": "education.html",
    "#publications": "publications.html",
    "#work": "work.html",
    "#honors": "honors.html"
  };

  var currentFile = window.location.pathname.split("/").pop();
  var legacyTarget = legacyPages[window.location.hash];

  if ((currentFile === "" || currentFile === "index.html") && legacyTarget) {
    window.location.replace(legacyTarget);
  }

  function $(selector, scope) {
    return (scope || doc).querySelector(selector);
  }

  function $$(selector, scope) {
    return Array.prototype.slice.call((scope || doc).querySelectorAll(selector));
  }

  /* ---------- header ---------- */

  var header = $("#siteHeader");
  var ticking = false;

  function updateScrollUI() {
    var y = window.scrollY || window.pageYOffset;

    if (header) header.classList.toggle("scrolled", y > 12);
    ticking = false;
  }

  function requestScrollUI() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateScrollUI);
    }
  }

  window.addEventListener("scroll", requestScrollUI, { passive: true });
  window.addEventListener("resize", requestScrollUI);
  updateScrollUI();

  /* ---------- reveal on scroll ---------- */

  var reveals = $$(".reveal");

  if ("IntersectionObserver" in window && !prefersReduced) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" }
    );

    reveals.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    reveals.forEach(function (el) {
      el.classList.add("in");
    });
  }

  /* ---------- mobile menu ---------- */

  var menuToggle = $("#menuToggle");
  var mobileMenu = $("#mobileMenu");
  var body = doc.body;

  function openMenu() {
    if (!mobileMenu || !menuToggle) return;
    mobileMenu.classList.add("open");
    mobileMenu.setAttribute("aria-hidden", "false");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "关闭菜单");
    body.classList.add("no-scroll");
  }

  function closeMenu(restoreFocus) {
    if (!mobileMenu || !menuToggle) return;
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "打开菜单");
    body.classList.remove("no-scroll");
    if (restoreFocus) menuToggle.focus();
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", function () {
      if (mobileMenu.classList.contains("open")) {
        closeMenu(true);
      } else {
        openMenu();
      }
    });

    $$("a", mobileMenu).forEach(function (link) {
      link.addEventListener("click", function () {
        closeMenu(false);
      });
    });

    doc.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && mobileMenu.classList.contains("open")) {
        closeMenu(true);
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 980 && mobileMenu.classList.contains("open")) {
        closeMenu(false);
      }
    });
  }

  /* ---------- footer year ---------- */

  var year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
