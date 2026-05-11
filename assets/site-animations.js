(function () {
  var navIntroSessionKey = "og-site-nav-intro-shown";
  var alreadyVisitedThisSession = false;
  try {
    alreadyVisitedThisSession = window.sessionStorage.getItem(navIntroSessionKey) === "1";
  } catch (e) {
    alreadyVisitedThisSession = false;
  }

  if (alreadyVisitedThisSession) {
    document.body.classList.add("nav-intro-done");
  } else {
    document.body.classList.add("nav-intro-start");
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        document.body.classList.remove("nav-intro-start");
        document.body.classList.add("nav-intro-done");
        try {
          window.sessionStorage.setItem(navIntroSessionKey, "1");
        } catch (e) {
          /* ignore */
        }
      });
    });
  }

  var nav = document.querySelector("nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("nav-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function observe(selector, options) {
    var els = document.querySelectorAll(selector);
    if (!els.length) return;
    var stagger = options.staggerMs != null ? options.staggerMs : 0;
    var threshold = options.threshold != null ? options.threshold : 0.18;
    var rootMargin = options.rootMargin || "0px";
    var durationMs = options.clearDelayAfterMs != null ? options.clearDelayAfterMs : 720;

    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var idx = Number(el.dataset.revealIndex || el.dataset.index || 0);
          var delay = idx * stagger;
          if (stagger) {
            el.style.setProperty("--reveal-delay", delay + "ms");
            window.setTimeout(function () {
              el.style.removeProperty("--reveal-delay");
            }, durationMs + delay + 80);
          }
          el.classList.add("is-visible");
          obs.unobserve(el);
        });
      },
      { threshold: threshold, rootMargin: rootMargin }
    );

    els.forEach(function (el, i) {
      if (!el.dataset.revealIndex && !el.dataset.index) el.dataset.revealIndex = String(i);
      obs.observe(el);
    });
  }

  /* threshold 0: tall timeline cards/photos can fail 0.2 and stay opacity:0 forever */
  observe(".timeline-item", {
    staggerMs: 120,
    threshold: 0,
    rootMargin: "0px 0px 12% 0px",
  });
  observe(".timeline-photo", {
    staggerMs: 120,
    threshold: 0,
    rootMargin: "0px 0px 12% 0px",
  });

  observe(".member-row", { staggerMs: 120, threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

  observe(".box", {
    staggerMs: 90,
    threshold: 0.15,
    clearDelayAfterMs: 720,
  });

  var revealExtras = document.querySelectorAll("[data-reveal]");
  if (revealExtras.length) {
    var ro = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var idx = Number(el.dataset.revealIndex || 0);
          el.style.setProperty("--reveal-delay", idx * 100 + "ms");
          el.classList.add("is-visible");
          ro.unobserve(el);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
    );
    revealExtras.forEach(function (el, i) {
      if (!el.dataset.revealIndex) el.dataset.revealIndex = String(i);
      ro.observe(el);
    });
  }

  var timelineFallback =
    "https://obsgyn.med.hku.hk/-/media/HKU/Obsgyn/Home/Features/link-item_clinical-services.jpg";
  document.querySelectorAll(".timeline-photo img").forEach(function (img) {
    img.addEventListener("error", function onTimelineImgError() {
      img.removeEventListener("error", onTimelineImgError);
      if (img.src.indexOf("link-item_clinical-services.jpg") !== -1) return;
      img.src = timelineFallback;
    });
  });
})();
