(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var header = document.querySelector(".site-header");

  /* Scroll suave (Lenis) ---------------------------------------------------- */
  var lenis = null;
  if (!reduceMotion && typeof window.Lenis === "function") {
    lenis = new window.Lenis({
      lerp: 0.09,
      smoothWheel: true,
      autoRaf: true
    });
  }

  function scrollToTarget(target) {
    if (lenis) lenis.scrollTo(target);
    else target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }

  /* Menu mobile ------------------------------------------------------------- */
  var toggle = document.querySelector(".menu-toggle");
  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    if (open) header.classList.remove("is-hidden");
  }
  toggle.addEventListener("click", function () {
    setMenu(!document.body.classList.contains("menu-open"));
  });

  // Âncoras internas: fecham o menu e rolam compensando o header
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      var id = a.getAttribute("href");
      var target = id.length > 1 && document.querySelector(id);
      setMenu(false);
      if (!target) return;
      e.preventDefault();
      scrollToTarget(target);
    });
  });

  /* Títulos: palavra por palavra -------------------------------------------- */
  var splitSelector = ".h-hero, .h-section, .h-mid, .feature__title, .big-truth, .dream-killer, .purpose__quote";

  function splitWords(el) {
    var index = 0;
    var walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(function (node) {
      var parts = node.nodeValue.split(/([ \t\n\r]+)/); // não quebra no espaço inseparável (\u00a0)
      var frag = document.createDocumentFragment();
      parts.forEach(function (part) {
        if (!part) return;
        if (/^[ \t\n\r]+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
        var w = document.createElement("span");
        var i = document.createElement("i");
        w.className = "w";
        i.textContent = part;
        i.style.setProperty("--i", index++);
        w.appendChild(i);
        frag.appendChild(w);
      });
      node.parentNode.replaceChild(frag, node);
    });
    el.classList.add("split");
  }

  if (!reduceMotion) document.querySelectorAll(splitSelector).forEach(splitWords);

  /* Listas em cascata ------------------------------------------------------- */
  document.querySelectorAll("[data-stagger]").forEach(function (list) {
    Array.prototype.forEach.call(list.children, function (child, i) {
      child.style.setProperty("--si", i);
    });
  });

  /* Surgimento ao rolar ----------------------------------------------------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      io.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -70px 0px", threshold: 0.01 });

  document.querySelectorAll(".reveal, .split, [data-stagger], [data-chart], [data-inview]").forEach(function (el) {
    io.observe(el);
  });

  /* Contadores -------------------------------------------------------------- */
  function countUp(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (reduceMotion) { el.textContent = target; return; }
    var start = null;
    var duration = 1800;
    function frame(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(frame);
    }
    el.textContent = "0";
    requestAnimationFrame(frame);
  }
  var counterIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      countUp(entry.target);
      counterIO.unobserve(entry.target);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll("[data-count]").forEach(function (el) { counterIO.observe(el); });

  /* Efeitos ligados ao scroll: progresso, header, parallax, faixa ------------ */
  var progress = document.querySelector(".scroll-progress");
  var parallaxEls = reduceMotion ? [] : Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  var ribbons = reduceMotion ? [] : Array.prototype.slice.call(document.querySelectorAll(".ribbon"));
  var lastY = window.scrollY;
  var ticking = false;

  function onScroll() {
    var y = window.scrollY;
    var vh = window.innerHeight;
    var max = document.documentElement.scrollHeight - vh;

    if (progress) progress.style.setProperty("--p", max > 0 ? (y / max).toFixed(4) : 0);

    header.classList.toggle("is-scrolled", y > 40);
    if (!document.body.classList.contains("menu-open")) {
      if (y > 700 && y > lastY + 4) header.classList.add("is-hidden");
      else if (y < lastY - 4 || y <= 700) header.classList.remove("is-hidden");
    }
    lastY = y;

    parallaxEls.forEach(function (el) {
      var box = (el.parentElement || el).getBoundingClientRect();
      if (box.bottom < -200 || box.top > vh + 200) return;
      var speed = parseFloat(el.getAttribute("data-parallax")) || 0.1;
      var offset = (box.top + box.height / 2 - vh / 2) * -speed;
      el.style.setProperty("--py", offset.toFixed(1) + "px");
    });

    ribbons.forEach(function (ribbon, i) {
      var box = ribbon.getBoundingClientRect();
      if (box.bottom < 0 || box.top > vh) return;
      var dir = i % 2 ? 1 : -1;
      ribbon.style.setProperty("--rx", ((box.top - vh / 2) * 0.18 * dir).toFixed(1) + "px");
    });

    ticking = false;
  }

  function requestTick() {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }

  if (lenis) lenis.on("scroll", requestTick);
  else window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", requestTick);
  onScroll();

  /* Carrosséis (setas + barra de progresso) --------------------------------- */
  document.querySelectorAll("[data-carousel]").forEach(function (track) {
    var name = track.getAttribute("data-carousel");
    var prev = document.querySelector('[data-prev="' + name + '"]');
    var next = document.querySelector('[data-next="' + name + '"]');
    var bar = document.querySelector('[data-progress="' + name + '"]');

    function step() {
      var item = track.firstElementChild;
      if (!item) return track.clientWidth;
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return item.getBoundingClientRect().width + gap;
    }

    function update() {
      var max = track.scrollWidth - track.clientWidth;
      var ratio = max > 0 ? track.scrollLeft / max : 0;
      if (bar) {
        var visible = Math.min(track.clientWidth / track.scrollWidth, 1);
        bar.style.width = (visible * 100) + "%";
        bar.style.transform = "translateX(" + (ratio * (1 - visible) / visible * 100) + "%)";
      }
      if (prev) prev.disabled = track.scrollLeft <= 4;
      if (next) next.disabled = track.scrollLeft >= max - 4;
      track.style.setProperty("--tl-width", track.scrollWidth + "px");
    }

    if (prev) prev.addEventListener("click", function () { track.scrollBy({ left: -step(), behavior: "smooth" }); });
    if (next) next.addEventListener("click", function () { track.scrollBy({ left: step(), behavior: "smooth" }); });
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  });

  /* FAQ --------------------------------------------------------------------- */
  document.querySelectorAll(".acc__btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.closest(".acc__item");
      var open = !item.classList.contains("is-open");
      document.querySelectorAll(".acc__item.is-open").forEach(function (other) {
        if (other === item) return;
        other.classList.remove("is-open");
        other.querySelector(".acc__btn").setAttribute("aria-expanded", "false");
      });
      item.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  /* CTA fixo no mobile: aparece depois do hero, some na oferta -------------- */
  var sticky = document.querySelector(".sticky-cta");
  var hero = document.querySelector(".hero");
  var priceCard = document.querySelector(".price-card");
  var heroOut = false;
  var priceIn = false;

  function syncSticky() {
    var show = heroOut && !priceIn;
    sticky.classList.toggle("is-visible", show);
    sticky.setAttribute("aria-hidden", String(!show));
    sticky.querySelector("a").tabIndex = show ? 0 : -1;
  }
  new IntersectionObserver(function (e) { heroOut = !e[0].isIntersecting; syncSticky(); }).observe(hero);
  new IntersectionObserver(function (e) { priceIn = e[0].isIntersecting; syncSticky(); }, { threshold: 0.15 }).observe(priceCard);

  /* Repassa UTMs da página para o checkout ---------------------------------- */
  var params = window.location.search.slice(1).split("&").filter(function (p) {
    return p && p.indexOf("semdelay") !== 0; // parâmetro interno de revisão não vai para o checkout
  }).join("&");
  if (params) {
    document.querySelectorAll('a[href*="pay.hotmart.com"]').forEach(function (a) {
      a.href += (a.href.indexOf("?") > -1 ? "&" : "?") + params;
    });
  }

  /* Ano no rodapé ----------------------------------------------------------- */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
