/* ==========================================================
   EDIT THIS BLOCK — everything business-specific lives here.
   Swap these values in and the whole site updates.
   ========================================================== */
const CONFIG = {
  // WhatsApp number in international format, no + or spaces.
  whatsappNumber: "918668139533",

  // Default message shown for general "Chat / Order on WhatsApp" buttons
  defaultMessage: "Hi Carvic Cakes & Bakes! I'd like to place an order.",

  // Full postal address, shown in the Visit section
  address: "Chennai, Tamil Nadu · Pickup details shared after confirmation",

  // Business hours line
  hours: "10:00 AM – 9:00 PM, all days (orders close 1 hr before)",

  // Phone number to DISPLAY (formatted for humans)
  displayPhone: "+91 86681 39533",

  // Paste your real Google Business Profile share link here
  // (Google Business Profile > Ask for reviews / Share profile)
  googleBusinessProfileUrl: "https://www.google.com/search?q=Carvic+Cakes+and+Bakes+Chennai",

  // Google Maps embed — replace with your exact location.
  // Easiest way: Google Maps > your business > Share > Embed a map > copy the URL inside src="...".
  googleMapsEmbedUrl: "https://www.google.com/maps?q=Carvic+Cakes+and+Bakes+Chennai&output=embed",

  instagramUrl: "https://www.instagram.com/carvic_cakes/"
};

/* ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  wireCarousel();
  wireWhatsAppLinks();
  wireFloatingWhatsapp();
  wireStaticInfo();
  wireHeaderScroll();
  wireMobileNav();
  wireMenuTabs();
  wireCategoryChips();
  wireOfferBanner();
  wireOrderModal();
  wireScrollReveal();
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});

/* ---------- Duplicate carousel cards once for a seamless scroll loop ---------- */
function wireCarousel() {
  const track = document.getElementById("carouselTrack");
  if (!track) return;
  track.innerHTML += track.innerHTML;
}

/* ---------- WhatsApp click-to-chat helpers ---------- */
function buildWhatsAppUrl(message) {
  const text = encodeURIComponent(message || CONFIG.defaultMessage);
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${text}`;
}

function wireWhatsAppLinks() {
  // Generic "Chat / Order on WhatsApp" buttons — instant chat, no scheduling needed
  ["whatsappBtn", "whatsappBtnBottom", "footerWhatsapp"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.href = buildWhatsAppUrl();
  });
}

/* ---------- Floating WhatsApp bubble ---------- */
function wireFloatingWhatsapp() {
  const el = document.getElementById("floatingWhatsapp");
  if (el) el.href = buildWhatsAppUrl();
}

/* ---------- Fill in address / hours / map / GMB from config ---------- */
function wireStaticInfo() {
  const addr = document.getElementById("visitAddress");
  const hours = document.getElementById("visitHours");
  const phone = document.getElementById("visitPhone");
  const map = document.getElementById("visitMap");
  const gmb = document.getElementById("gmbBtn");
  const gmbFooter = document.getElementById("footerGmb");

  if (addr) addr.textContent = CONFIG.address;
  if (hours) hours.textContent = CONFIG.hours;
  if (phone) phone.textContent = CONFIG.displayPhone;
  if (map) map.src = CONFIG.googleMapsEmbedUrl;
  if (gmb) gmb.href = CONFIG.googleBusinessProfileUrl;
  if (gmbFooter) gmbFooter.href = CONFIG.googleBusinessProfileUrl;
}

/* ---------- Header background on scroll ---------- */
function wireHeaderScroll() {
  const header = document.getElementById("siteHeader");
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ---------- Mobile nav toggle ---------- */
function wireMobileNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------- Menu category tabs ---------- */
function activateMenuTab(target) {
  const tabs = document.querySelectorAll(".menu-tab");
  const panels = document.querySelectorAll(".menu-list");

  tabs.forEach((t) => {
    const match = t.getAttribute("data-target") === target;
    t.classList.toggle("is-active", match);
    t.setAttribute("aria-selected", String(match));
    t.tabIndex = match ? 0 : -1;
  });

  panels.forEach((panel) => {
    const match = panel.id === `panel-${target}`;
    panel.classList.toggle("is-active", match);
    panel.hidden = !match;
  });
}

function wireMenuTabs() {
  const tabs = Array.from(document.querySelectorAll(".menu-tab"));
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateMenuTab(tab.getAttribute("data-target")));
    tab.addEventListener("keydown", (event) => {
      const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      let nextIndex = index;
      if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
      if (event.key === "Home") nextIndex = 0;
      if (event.key === "End") nextIndex = tabs.length - 1;
      const nextTab = tabs[nextIndex];
      activateMenuTab(nextTab.getAttribute("data-target"));
      nextTab.focus();
    });
  });
}

/* ---------- Category chips: jump to menu + switch tab ---------- */
function wireCategoryChips() {
  document.querySelectorAll(".chip[data-menu-target]").forEach((chip) => {
    chip.addEventListener("click", () => {
      activateMenuTab(chip.getAttribute("data-menu-target"));
    });
  });
}

/* ---------- Dismissible offers banner ---------- */
function wireOfferBanner() {
  const banner = document.getElementById("offerBanner");
  const closeBtn = document.getElementById("offerClose");
  if (!banner || !closeBtn) return;

  let dismissed = false;
  try {
    dismissed = window.localStorage.getItem("carvic_offer_dismissed") === "1";
  } catch (e) {
    dismissed = false;
  }
  if (dismissed) banner.classList.add("is-hidden");

  closeBtn.addEventListener("click", () => {
    banner.classList.add("is-hidden");
    try {
      window.localStorage.setItem("carvic_offer_dismissed", "1");
    } catch (e) {
      /* localStorage unavailable — banner still hides for this session */
    }
  });
}

/* ---------- Schedule Order modal ---------- */
function wireOrderModal() {
  const modal = document.getElementById("orderModal");
  const closeBtn = document.getElementById("modalClose");
  const form = document.getElementById("orderForm");
  const itemNameEl = document.getElementById("modalItemName");
  const dateInput = document.getElementById("orderDate");
  const errorBox = document.getElementById("formError");
  if (!modal || !form) return;

  let currentItem = "an item from your menu";
  let lastFocusedEl = null;

  // Minimum selectable date = today (browser-local)
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  if (dateInput) dateInput.min = `${yyyy}-${mm}-${dd}`;

  function openModal(itemLabel) {
    currentItem = itemLabel || currentItem;
    itemNameEl.textContent = currentItem;
    lastFocusedEl = document.activeElement;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    if (errorBox) errorBox.hidden = true;
    const firstField = document.getElementById("orderDate");
    if (firstField) firstField.focus();
  }

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
      lastFocusedEl.focus();
    }
  }

  // Every product/menu "Order" button opens the scheduling modal
  document.querySelectorAll(".order-link").forEach((btn) => {
    btn.addEventListener("click", () => {
      openModal(btn.getAttribute("data-item") || currentItem);
    });
  });

  closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) closeModal();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const date = document.getElementById("orderDate").value;
    const time = document.getElementById("orderTime").value;
    const name = document.getElementById("orderName").value.trim();
    const phone = document.getElementById("orderPhone").value.trim();
    const notes = document.getElementById("orderNotes").value.trim();

    // Basic validation — kept simple and honest, no data leaves the browser
    // except through the WhatsApp link the customer explicitly opens.
    const phonePattern = /^[0-9+ ]{7,15}$/;
    if (!date || !name || !phonePattern.test(phone)) {
      if (errorBox) {
        errorBox.textContent = "Please fill in the date, your name, and a valid phone number.";
        errorBox.hidden = false;
      }
      return;
    }

    const prettyDate = new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });

    const lines = [
      "Hi Carvic Cakes & Bakes! I'd like to schedule an order.",
      `Item: ${currentItem}`,
      `Date needed: ${prettyDate}`,
      `Time slot: ${time}`,
      `Name: ${name}`,
      `Phone: ${phone}`
    ];
    if (notes) lines.push(`Notes: ${notes}`);

    const message = lines.join("\n");
    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
    closeModal();
    form.reset();
  });
}

/* ---------- One restrained scroll-reveal pass per section ---------- */
function wireScrollReveal() {
  const targets = document.querySelectorAll(
    ".favourites .section-heading, .story-grid, .menu-section .menu-heading, .gallery .section-heading, .visit-grid, .cta-inner"
  );
  targets.forEach((el) => el.classList.add("reveal"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
}
