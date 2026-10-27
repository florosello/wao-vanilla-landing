(function () {
  "use strict";

  /* ---------- Language (DE default, ES optional) ---------- */
  var ES = {
    cta_short: "Acceso anticipado",
    cta: "Asegura tu acceso anticipado",
    hero_title: "Piel calmada y luminosa con vainilla del Amazonas.",
    hero_lede: "WAO Vanilla Serum combina Vanilla odorata de la selva ecuatoriana con 4 % de niacinamida y ácido hialurónico. Para piel seca y apagada que busca cuidado natural sin renunciar a resultados visibles.",
    hero_offer: "<strong>15 % de descuento</strong> en el lanzamiento. 30 ml por 69 €.",
    hero_caption: "De la cosecha en la selva hasta el frasco",
    formula_title: "Cuatro activos. Nada que tu piel no necesite.",
    formula_intro: "Una fórmula corta y clara: un extracto botánico como protagonista, acompañado de tres activos probados en concentraciones efectivas.",
    a1: "Extracto antioxidante que protege la piel del estrés ambiental.",
    a2_name: "Niacinamida",
    a2: "Afina la textura y unifica el tono.",
    a3_name: "Aloe vera",
    a3: "Calma y cuida la piel irritada.",
    a4_name: "Ácido hialurónico",
    a4: "Retiene la hidratación para una piel más firme y suave.",
    origin_title: "De la selva a tu piel",
    origin_intro: "Nuestra vainilla crece en la Amazonía ecuatoriana y se cosecha a mano junto a la comunidad waodani. Así nace cada frasco:",
    s1_t: "Cosecha", s1: "Recolectada a mano, directamente en la selva.",
    s2_t: "Extracción", s2: "Las vainas se extraen de forma suave.",
    s3_t: "Envasado", s3: "En vidrio ámbar, que protege los activos de la luz.",
    s4_t: "Aplicación", s4: "Tres a cuatro gotas, mañana y noche.",
    s5_t: "Envío", s5: "En su caja de cartón, directo a tu casa.",
    people_title: "Hecho para todo tipo de piel",
    people_body: "Ligero, se absorbe rápido y no deja sensación pegajosa. Bajo tu crema de día o solo por la noche.",
    f1: "30 ml en vidrio ámbar que protege de la luz",
    f2: "Para la mañana y la noche",
    f3: "Desarrollado para el mercado alemán",
    lead_title: "Sé de las primeras en Alemania",
    lead_body: "Inscríbete y recibe antes del lanzamiento:",
    p1: "15 % de descuento en tu primera compra",
    p2: "Una muestra gratis para probarlo",
    p3: "La fecha de lanzamiento antes que nadie",
    form_title: "Asegura tu acceso anticipado",
    form_placeholder: "El formulario estará disponible muy pronto.",
    privacy_note: "Usamos tu email solo para información del lanzamiento. Puedes darte de baja cuando quieras. Más en la <a href=\"/datenschutz\">política de privacidad</a>.",
    footer: "EWAO Project by waodani. Proyecto de estudio, 2026.",
    privacy_link: "Privacidad",
    consent_text: "Usamos cookies de estadística (Google Analytics) y marketing (Meta). Tú decides si podemos usarlas.",
    consent_yes: "Aceptar todas",
    consent_no: "Solo necesarias",
    thanks_title: "Gracias. Ya estás en la lista.",
    thanks_body: "Te escribiremos antes del lanzamiento con tu código de 15 % y la información para recibir tu muestra.",
    thanks_back: "Volver a la página"
  };
  var TITLES = { de: document.title, es: document.documentElement.getAttribute("data-title-es") || "WAO Vanilla Serum – EWAO Project" };

  var nodes = Array.prototype.slice.call(document.querySelectorAll("[data-i18n], [data-i18n-html]"));
  var DE = {};
  nodes.forEach(function (el) {
    var k = el.getAttribute("data-i18n");
    if (k) DE[k] = el.textContent;
    var h = el.getAttribute("data-i18n-html");
    if (h) DE[h] = el.innerHTML;
  });

  function setLang(lang) {
    var dict = lang === "es" ? ES : DE;
    nodes.forEach(function (el) {
      var k = el.getAttribute("data-i18n");
      if (k && dict[k] != null) el.textContent = dict[k];
      var h = el.getAttribute("data-i18n-html");
      if (h && dict[h] != null) el.innerHTML = dict[h];
    });
    document.documentElement.lang = lang;
    document.title = TITLES[lang];
    document.querySelectorAll("[data-lang]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === lang));
    });
    try { localStorage.setItem("wao_lang", lang); } catch (e) {}
  }

  var initial = "de";
  var q = new URLSearchParams(location.search).get("lang");
  if (q === "es" || q === "de") initial = q;
  else { try { initial = localStorage.getItem("wao_lang") || "de"; } catch (e) {} }
  if (initial !== "de") setLang(initial);

  document.querySelectorAll("[data-lang]").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.getAttribute("data-lang")); });
  });

  /* ---------- Consent banner ---------- */
  var banner = document.getElementById("consent");
  if (banner) {
    var stored = null;
    try { stored = localStorage.getItem("wao_consent"); } catch (e) {}
    if (!stored) banner.hidden = false;
    banner.querySelectorAll("[data-consent]").forEach(function (b) {
      b.addEventListener("click", function () {
        window.waoSetConsent(b.getAttribute("data-consent") === "granted");
        banner.hidden = true;
      });
    });
  }

  /* ---------- CTA clicks ---------- */
  document.querySelectorAll("[data-cta]").forEach(function (a) {
    a.addEventListener("click", function () {
      window.waoTrack("cta_click", { cta_location: a.getAttribute("data-cta"), cta_text: a.textContent.trim() });
    });
  });

  /* ---------- ViewContent: formula section seen ---------- */
  var formula = document.getElementById("formel");
  if (formula && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries.some(function (e) { return e.isIntersecting; })) {
        window.waoTrack("view_content", { content_name: "WAO Vanilla Serum", content_type: "product", currency: "EUR", value: 69 });
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(formula);
  }

  /* ---------- Scroll 70 % ---------- */
  var scrolled = false;
  function onScroll() {
    if (scrolled) return;
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    if (max > 0 && (window.scrollY / max) >= 0.7) {
      scrolled = true;
      window.waoTrack("scroll_70", { percent_scrolled: 70 });
      window.removeEventListener("scroll", onScroll);
    }
  }
  if (document.getElementById("early-access")) window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Fillout form ---------- */
  var slot = document.getElementById("fillout-slot");
  if (slot && window.WAO.FILLOUT_ID) {
    slot.innerHTML = "";
    var box = document.createElement("div");
    box.style.width = "100%";
    box.style.minHeight = "420px";
    box.setAttribute("data-fillout-id", window.WAO.FILLOUT_ID);
    box.setAttribute("data-fillout-embed-type", "standard");
    box.setAttribute("data-fillout-inherit-parameters", "");
    box.setAttribute("data-fillout-dynamic-resize", "");
    slot.appendChild(box);
    var s = document.createElement("script");
    s.src = "https://server.fillout.com/embed/v1/";
    s.async = true;
    document.body.appendChild(s);
  }

  // Fillout talks to the page through postMessage. Any message from Fillout
  // that mentions a submission counts as a lead (fired once per session).
  window.addEventListener("message", function (e) {
    var host = "";
    try { host = new URL(e.origin).hostname; } catch (err) { return; }
    if (!/(^|\.)fillout\.com$/.test(host)) return;
    var raw;
    try { raw = typeof e.data === "string" ? e.data : JSON.stringify(e.data); } catch (err) { return; }
    if (/submit/i.test(raw)) window.waoLead("fillout_embed");
  });
})();
