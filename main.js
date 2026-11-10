/* ==========================================================================
   杨正昊 · Personal Portfolio — interactions
   Vanilla JS, no dependencies.
   ========================================================================== */

(function () {
  "use strict";

  var doc = document;
  var root = doc.documentElement;
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function $(selector, scope) {
    return (scope || doc).querySelector(selector);
  }

  function $$(selector, scope) {
    return Array.prototype.slice.call((scope || doc).querySelectorAll(selector));
  }

  /* ---------- header + scroll progress ---------- */

  var header = $("#siteHeader");
  var progressBar = $("#progressBar");
  var ticking = false;

  function updateScrollUI() {
    var y = window.scrollY || window.pageYOffset;
    var max = root.scrollHeight - window.innerHeight;
    var ratio = max > 0 ? Math.min(y / max, 1) : 0;

    if (header) header.classList.toggle("scrolled", y > 12);
    if (progressBar) progressBar.style.width = (ratio * 100).toFixed(2) + "%";
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

  /* ---------- hero pointer glow ---------- */

  var hero = $(".hero");
  var heroGlow = $("#heroGlow");
  var glowFrame = null;

  if (hero && heroGlow && finePointer && !prefersReduced) {
    hero.addEventListener("pointermove", function (event) {
      if (glowFrame) return;
      glowFrame = window.requestAnimationFrame(function () {
        var rect = hero.getBoundingClientRect();
        var gx = ((event.clientX - rect.left) / rect.width) * 100;
        var gy = ((event.clientY - rect.top) / rect.height) * 100;
        heroGlow.style.setProperty("--gx", gx.toFixed(2) + "%");
        heroGlow.style.setProperty("--gy", gy.toFixed(2) + "%");
        glowFrame = null;
      });
    });
  }

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

  /* ---------- active nav link ---------- */

  var navLinks = $$(".nav a");
  var sections = navLinks
    .map(function (link) {
      var id = link.getAttribute("href");
      return id && id.charAt(0) === "#" ? doc.querySelector(id) : null;
    })
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          navLinks.forEach(function (link) {
            var isActive = link.getAttribute("href") === "#" + entry.target.id;
            link.classList.toggle("active", isActive);
            if (isActive) {
              link.setAttribute("aria-current", "true");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      navObserver.observe(section);
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

  /* ---------- animated counters ---------- */

  var counters = $$("[data-count]");

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10) || 0;

    if (prefersReduced) {
      el.textContent = String(target);
      return;
    }

    var start = null;
    var duration = 1500;

    function formatCount(value) {
      return value >= 1000 ? String(value) : value.toLocaleString("en-US");
    }

    function step(timestamp) {
      if (start === null) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var value = Math.round(target * easeOutCubic(progress));
      el.textContent = formatCount(value);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        el.textContent = formatCount(target);
      }
    }

    window.requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window && counters.length) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3, rootMargin: "0px 0px -5% 0px" }
    );

    counters.forEach(function (el) {
      counterObserver.observe(el);
    });
  } else {
    counters.forEach(function (el) {
      el.textContent = el.getAttribute("data-count");
    });
  }

  /* ---------- local clock (Asia/Shanghai) ---------- */

  var clock = $("#clock");

  if (clock) {
    var timeFormatter;

    try {
      timeFormatter = new Intl.DateTimeFormat("zh-CN", {
        timeZone: "Asia/Shanghai",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });
    } catch (error) {
      timeFormatter = null;
    }

    function updateClock() {
      var now = new Date();
      if (timeFormatter) {
        clock.textContent = timeFormatter.format(now);
      } else {
        var h = String(now.getHours()).padStart(2, "0");
        var m = String(now.getMinutes()).padStart(2, "0");
        clock.textContent = h + ":" + m;
      }
    }

    updateClock();
    window.setInterval(updateClock, 20000);
  }

  /* ---------- profile card tilt ---------- */

  var tiltCard = $("[data-tilt]");

  if (tiltCard && finePointer && !prefersReduced) {
    var tiltFrame = null;
    var pointer = { x: 0, y: 0 };

    tiltCard.addEventListener("pointermove", function (event) {
      var rect = tiltCard.getBoundingClientRect();
      pointer.x = (event.clientX - rect.left) / rect.width;
      pointer.y = (event.clientY - rect.top) / rect.height;

      if (tiltFrame) return;
      tiltFrame = window.requestAnimationFrame(function () {
        var rotateY = (pointer.x - 0.5) * 9;
        var rotateX = (pointer.y - 0.5) * -9;
        tiltCard.style.transform =
          "rotateX(" + rotateX.toFixed(2) + "deg) rotateY(" + rotateY.toFixed(2) + "deg)";
        tiltCard.style.setProperty("--mx", (pointer.x * 100).toFixed(1) + "%");
        tiltCard.style.setProperty("--my", (pointer.y * 100).toFixed(1) + "%");
        tiltFrame = null;
      });
    });

    tiltCard.addEventListener("pointerleave", function () {
      tiltCard.style.transform = "";
      tiltCard.style.setProperty("--mx", "30%");
      tiltCard.style.setProperty("--my", "10%");
    });
  }

  /* ---------- skill card hover glow ---------- */

  if (finePointer) {
    $$(".skill-card").forEach(function (card) {
      card.addEventListener("pointermove", function (event) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty("--sx", (((event.clientX - rect.left) / rect.width) * 100).toFixed(1) + "%");
        card.style.setProperty("--sy", (((event.clientY - rect.top) / rect.height) * 100).toFixed(1) + "%");
      });
    });
  }

  /* ---------- copy email + toast ---------- */

  var toast = $("#toast");
  var toastTimer = null;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("show");
    }, 2200);
  }

  function legacyCopy(text) {
    var area = doc.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "-1000px";
    area.style.opacity = "0";
    body.appendChild(area);
    area.select();

    var ok = false;
    try {
      ok = doc.execCommand("copy");
    } catch (error) {
      ok = false;
    }

    body.removeChild(area);
    return ok;
  }

  $$("[data-copy]").forEach(function (button) {
    button.addEventListener("click", function () {
      var text = button.getAttribute("data-copy") || "";

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard
          .writeText(text)
          .then(function () {
            showToast("邮箱已复制：" + text);
          })
          .catch(function () {
            showToast(legacyCopy(text) ? "邮箱已复制：" + text : "复制失败，请手动选择邮箱");
          });
      } else {
        showToast(legacyCopy(text) ? "邮箱已复制：" + text : "复制失败，请手动选择邮箱");
      }
    });
  });

  /* ---------- calculator ---------- */

  var calculator = $("#calculator");

  if (calculator) {
    var display = $("#calcDisplay", calculator);
    var history = $("#calcHistory", calculator);
    var keys = $$("button", calculator);
    var state = {
      current: "0",
      previous: null,
      operator: null,
      overwrite: false,
      error: false,
      expression: ""
    };

    var operators = {
      "+": "+",
      "-": "−",
      "*": "×",
      "/": "÷"
    };

    function formatNumber(value) {
      if (!isFinite(value)) return "Error";
      if (Object.is(value, -0)) value = 0;
      var abs = Math.abs(value);
      var text;

      if (abs !== 0 && (abs >= 1e12 || abs < 1e-9)) {
        text = value.toExponential(6);
      } else {
        text = String(Number(value.toPrecision(12)));
      }

      return text;
    }

    function render() {
      var text = state.error ? "Error" : state.current;
      display.textContent = text;
      display.classList.toggle("small", text.length > 9 && text.length <= 13);
      display.classList.toggle("tiny", text.length > 13);
      history.textContent = state.expression || "\u00a0";
    }

    function resetAll() {
      state.current = "0";
      state.previous = null;
      state.operator = null;
      state.overwrite = false;
      state.error = false;
      state.expression = "";
      render();
    }

    function inputDigit(digit) {
      if (state.error) resetAll();

      if (state.overwrite) {
        state.current = digit === "." ? "0." : digit;
        state.overwrite = false;
      } else {
        if (digit === "." && state.current.indexOf(".") !== -1) return;
        if (state.current === "0" && digit !== ".") {
          state.current = digit;
        } else if (state.current.replace(/[-.]/g, "").length < 13) {
          state.current += digit;
        }
      }

      state.expression = "";
      render();
    }

    function calculate(a, b, operator) {
      switch (operator) {
        case "+":
          return a + b;
        case "-":
          return a - b;
        case "*":
          return a * b;
        case "/":
          return b === 0 ? NaN : a / b;
        default:
          return b;
      }
    }

    function inputOperator(operator) {
      if (state.error) return;

      var value = parseFloat(state.current);

      if (state.operator !== null && !state.overwrite) {
        var result = calculate(state.previous, value, state.operator);
        if (!isFinite(result)) {
          state.error = true;
          state.expression = "不能除以 0";
          render();
          return;
        }
        state.current = formatNumber(result);
        value = result;
      }

      state.previous = value;
      state.operator = operator;
      state.overwrite = true;
      state.expression = formatNumber(value) + " " + operators[operator];
      render();
    }

    function equals() {
      if (state.error || state.operator === null || state.previous === null) return;

      var value = parseFloat(state.current);
      var result = calculate(state.previous, value, state.operator);

      if (!isFinite(result)) {
        state.error = true;
        state.expression = "不能除以 0";
        render();
        return;
      }

      state.expression =
        formatNumber(state.previous) +
        " " +
        operators[state.operator] +
        " " +
        formatNumber(value) +
        " =";
      state.current = formatNumber(result);
      state.previous = null;
      state.operator = null;
      state.overwrite = true;
      render();
    }

    function unary(action) {
      if (state.error) {
        if (action === "clear") resetAll();
        return;
      }

      var value = parseFloat(state.current);

      if (action === "clear") {
        resetAll();
        return;
      }

      if (action === "negate") {
        state.current = state.current.charAt(0) === "-" ? state.current.slice(1) : "-" + state.current;
        if (state.current === "-0") state.current = "0";
      } else if (action === "percent") {
        state.current = formatNumber(value / 100);
      } else if (action === "sqrt") {
        if (value < 0) {
          state.error = true;
          state.expression = "负数不能开平方";
          render();
          return;
        }
        state.current = formatNumber(Math.sqrt(value));
        state.expression = "√(" + formatNumber(value) + ")";
      }

      state.overwrite = true;
      render();
    }

    function backspace() {
      if (state.error) {
        resetAll();
        return;
      }
      if (state.overwrite) {
        state.current = "0";
      } else if (state.current.length > 1) {
        state.current = state.current.slice(0, -1);
        if (state.current === "-") state.current = "0";
      } else {
        state.current = "0";
      }
      render();
    }

    keys.forEach(function (key) {
      key.addEventListener("click", function () {
        if (key.hasAttribute("data-num")) {
          inputDigit(key.getAttribute("data-num"));
        } else if (key.hasAttribute("data-op")) {
          inputOperator(key.getAttribute("data-op"));
        } else {
          var action = key.getAttribute("data-action");
          if (action === "equals") equals();
          else unary(action);
        }
      });
    });

    var calcVisible = false;

    if ("IntersectionObserver" in window) {
      var calcObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            calcVisible = entry.isIntersecting;
          });
        },
        { threshold: 0.35 }
      );
      calcObserver.observe(calculator);
    } else {
      calcVisible = true;
    }

    doc.addEventListener("keydown", function (event) {
      if (!calcVisible || event.metaKey || event.ctrlKey || event.altKey) return;

      var target = event.target;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      // Let focused controls handle their own keys (Enter / Space).
      if (target && (target.tagName === "BUTTON" || target.tagName === "A")) return;

      var key = event.key;

      if (/^[0-9]$/.test(key)) {
        inputDigit(key);
        event.preventDefault();
      } else if (key === ".") {
        inputDigit(".");
        event.preventDefault();
      } else if (key === "+" || key === "-" || key === "*" || key === "/") {
        inputOperator(key);
        event.preventDefault();
      } else if (key === "Enter" || key === "=") {
        equals();
        event.preventDefault();
      } else if (key === "Escape" || key === "Delete") {
        resetAll();
        event.preventDefault();
      } else if (key === "Backspace") {
        backspace();
        event.preventDefault();
      } else if (key === "%") {
        unary("percent");
        event.preventDefault();
      }
    });

    render();
  }

  /* ---------- footer year ---------- */

  var year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
