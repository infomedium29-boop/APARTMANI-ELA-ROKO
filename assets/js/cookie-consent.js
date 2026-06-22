(() => {
  const CONFIG = {
    hr: {
      title: "Privatnost i kolačići",
      text: "Koristimo nužne kolačiće kako bi stranica pravilno radila. Analitičke i marketinške kolačiće koristimo samo uz vašu privolu.",
      acceptAll: "Prihvati sve",
      rejectAll: "Odbij neobavezne",
      settings: "Postavke",
      save: "Spremi postavke",
      privacy: "Politika privatnosti",
      cookies: "Politika kolačića",
      necessary: "Nužni kolačići",
      necessaryText: "Potrebni su za osnovni rad stranice i ne mogu se isključiti.",
      analytics: "Analitički kolačići",
      analyticsText: "Pomažu razumjeti korištenje stranice. Trenutno nisu aktivni dok se ne doda analitika.",
      marketing: "Marketinški kolačići",
      marketingText: "Koriste se za oglašavanje i remarketing. Trenutno nisu aktivni dok se ne dodaju marketinški alati."
    },
    en: {
      title: "Privacy and cookies",
      text: "We use necessary cookies to keep the website working properly. Analytics and marketing cookies are used only with your consent.",
      acceptAll: "Accept all",
      rejectAll: "Reject optional",
      settings: "Settings",
      save: "Save settings",
      privacy: "Privacy Policy",
      cookies: "Cookie Policy",
      necessary: "Necessary cookies",
      necessaryText: "Required for the basic operation of the website and cannot be disabled.",
      analytics: "Analytics cookies",
      analyticsText: "Help understand website usage. They are currently inactive until analytics are added.",
      marketing: "Marketing cookies",
      marketingText: "Used for advertising and remarketing. They are currently inactive until marketing tools are added."
    }
  };

  const isEnglish = location.pathname.includes("/en/");
  const lang = isEnglish ? "en" : "hr";
  const t = CONFIG[lang];
  const privacyUrl = isEnglish ? "privacy-policy.html" : "politika-privatnosti.html";
  const cookiesUrl = isEnglish ? "cookie-policy.html" : "politika-kolacica.html";
  const storageKey = "er_cookie_consent_v1";

  function getConsent(){
    try { return JSON.parse(localStorage.getItem(storageKey)); }
    catch(e){ return null; }
  }

  function setConsent(consent){
    localStorage.setItem(storageKey, JSON.stringify({
      ...consent,
      necessary: true,
      updatedAt: new Date().toISOString()
    }));
    document.dispatchEvent(new CustomEvent("cookieConsentUpdated", { detail: getConsent() }));
  }

  function createBanner(){
    if (getConsent()) return;

    const wrapper = document.createElement("div");
    wrapper.className = "cookie-consent show";
    wrapper.setAttribute("role", "dialog");
    wrapper.setAttribute("aria-live", "polite");
    wrapper.setAttribute("aria-label", t.title);

    wrapper.innerHTML = `
      <div class="cookie-panel">
        <h2>${t.title}</h2>
        <p>${t.text}</p>
        <p><a href="${privacyUrl}">${t.privacy}</a> · <a href="${cookiesUrl}">${t.cookies}</a></p>

        <div class="cookie-settings" id="cookie-settings">
          <div class="cookie-choice">
            <div><strong>${t.necessary}</strong><span>${t.necessaryText}</span></div>
            <label class="cookie-switch" aria-label="${t.necessary}">
              <input type="checkbox" checked disabled>
              <span class="cookie-slider"></span>
            </label>
          </div>
          <div class="cookie-choice">
            <div><strong>${t.analytics}</strong><span>${t.analyticsText}</span></div>
            <label class="cookie-switch" aria-label="${t.analytics}">
              <input id="cookie-analytics" type="checkbox">
              <span class="cookie-slider"></span>
            </label>
          </div>
          <div class="cookie-choice">
            <div><strong>${t.marketing}</strong><span>${t.marketingText}</span></div>
            <label class="cookie-switch" aria-label="${t.marketing}">
              <input id="cookie-marketing" type="checkbox">
              <span class="cookie-slider"></span>
            </label>
          </div>
        </div>

        <div class="cookie-actions">
          <button class="cookie-btn primary" type="button" data-cookie-accept>${t.acceptAll}</button>
          <button class="cookie-btn" type="button" data-cookie-reject>${t.rejectAll}</button>
          <button class="cookie-btn light" type="button" data-cookie-toggle>${t.settings}</button>
          <button class="cookie-btn" type="button" data-cookie-save style="display:none">${t.save}</button>
        </div>
      </div>
    `;

    document.body.appendChild(wrapper);

    const settings = wrapper.querySelector("#cookie-settings");
    const toggle = wrapper.querySelector("[data-cookie-toggle]");
    const save = wrapper.querySelector("[data-cookie-save]");
    const analytics = wrapper.querySelector("#cookie-analytics");
    const marketing = wrapper.querySelector("#cookie-marketing");

    wrapper.querySelector("[data-cookie-accept]").addEventListener("click", () => {
      setConsent({ analytics: true, marketing: true });
      wrapper.remove();
    });

    wrapper.querySelector("[data-cookie-reject]").addEventListener("click", () => {
      setConsent({ analytics: false, marketing: false });
      wrapper.remove();
    });

    toggle.addEventListener("click", () => {
      settings.classList.toggle("open");
      save.style.display = settings.classList.contains("open") ? "inline-flex" : "none";
    });

    save.addEventListener("click", () => {
      setConsent({ analytics: analytics.checked, marketing: marketing.checked });
      wrapper.remove();
    });
  }

  window.ERCookieConsent = {
    get: getConsent,
    reset: () => {
      localStorage.removeItem(storageKey);
      location.reload();
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createBanner);
  } else {
    createBanner();
  }
})();
