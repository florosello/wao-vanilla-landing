/*
 * WAO Vanilla — tracking bootstrap.
 * Loaded synchronously in <head> on every page, before anything else.
 *
 * Fill in the IDs below. Everything else (GA4, Meta Pixel) is configured
 * inside Google Tag Manager, which listens to the dataLayer events listed here:
 *   cta_click      – a "Early Access" button was clicked   { cta_location }
 *   view_content   – the formula section was seen (once)
 *   scroll_70      – the visitor scrolled 70 % of the page (once)
 *   generate_lead  – the Fillout form was submitted (once per session)
 */
window.WAO = {
  GTM_ID: "GTM-PHZ5CNPD",
  FILLOUT_ID: "3Wpde4evRZus"
};

window.dataLayer = window.dataLayer || [];
function gtag() { window.dataLayer.push(arguments); }

(function () {
  var stored = null;
  try { stored = localStorage.getItem("wao_consent"); } catch (e) {}
  if (stored !== "granted" && stored !== "denied") stored = null;

  // Google Consent Mode v2 (GDPR): in the EEA, UK and Switzerland nothing is
  // stored until the visitor agrees. Elsewhere measurement is on by default.
  // A visitor's own choice in the banner (stored) always wins.
  var EEA = ["AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR","DE","GR","HU","IE",
             "IT","LV","LT","LU","MT","NL","PL","PT","RO","SK","SI","ES","SE",
             "IS","LI","NO","GB","CH"];
  if (stored) {
    gtag("consent", "default", {
      ad_storage: stored, ad_user_data: stored, ad_personalization: stored,
      analytics_storage: stored, functionality_storage: "granted",
      security_storage: "granted"
    });
  } else {
    gtag("consent", "default", {
      ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
      analytics_storage: "denied", region: EEA, wait_for_update: 500
    });
    gtag("consent", "default", {
      ad_storage: "granted", ad_user_data: "granted", ad_personalization: "granted",
      analytics_storage: "granted", functionality_storage: "granted",
      security_storage: "granted"
    });
  }

  if (window.WAO.GTM_ID) {
    (function (w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
      var f = d.getElementsByTagName(s)[0], j = d.createElement(s);
      j.async = true;
      j.src = "https://www.googletagmanager.com/gtm.js?id=" + i;
      f.parentNode.insertBefore(j, f);
    })(window, document, "script", "dataLayer", window.WAO.GTM_ID);
  }
})();

window.waoTrack = function (event, params) {
  var payload = { event: event };
  if (params) for (var k in params) payload[k] = params[k];
  window.dataLayer.push(payload);
  if (window.console) console.log("[WAO]", event, params || "");
};

window.waoSetConsent = function (granted) {
  var v = granted ? "granted" : "denied";
  try { localStorage.setItem("wao_consent", v); } catch (e) {}
  gtag("consent", "update", {
    ad_storage: v,
    ad_user_data: v,
    ad_personalization: v,
    analytics_storage: v
  });
  window.waoTrack("consent_update", { consent: v });
};

window.waoLead = function (source) {
  var done = false;
  try { done = sessionStorage.getItem("wao_lead") === "1"; } catch (e) {}
  if (done) return;
  try { sessionStorage.setItem("wao_lead", "1"); } catch (e) {}
  window.waoTrack("generate_lead", { lead_source: source, currency: "EUR", value: 69 });
};
