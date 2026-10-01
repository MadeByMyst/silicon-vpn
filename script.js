/* SiliconVPN — script.js  (fully interactive) */

document.addEventListener("DOMContentLoaded", () => {
  /* ═══════════════════════════════════════════════════════════
     NAVBAR SCROLL STATE
  ═══════════════════════════════════════════════════════════ */
  const navbar = document.getElementById("navbar");
  function updateNavbar() {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", updateNavbar, { passive: true });
  updateNavbar();

  /* ═══════════════════════════════════════════════════════════
     MOBILE SIDEBAR
  ═══════════════════════════════════════════════════════════ */
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileOverlay = document.getElementById("mobile-overlay");
  const mobileClose = document.getElementById("mobile-close");
  const mobileLinks = mobileMenu.querySelectorAll(
    ".mobile-nav a, .mobile-nav-cta",
  );

  function openMenu() {
    mobileMenu.classList.add("open");
    mobileOverlay.classList.add("visible");
    hamburger.classList.add("active");
    hamburger.setAttribute("aria-expanded", "true");
    document.body.classList.add("no-scroll");
  }
  function closeMenu() {
    mobileMenu.classList.remove("open");
    mobileOverlay.classList.remove("visible");
    hamburger.classList.remove("active");
    hamburger.setAttribute("aria-expanded", "false");
    document.body.classList.remove("no-scroll");
  }

  hamburger.addEventListener("click", () =>
    mobileMenu.classList.contains("open") ? closeMenu() : openMenu(),
  );
  mobileClose.addEventListener("click", closeMenu);
  mobileOverlay.addEventListener("click", closeMenu);
  mobileLinks.forEach((l) => l.addEventListener("click", closeMenu));
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) closeMenu();
  });

  /* ═══════════════════════════════════════════════════════════
     SCROLL-TRIGGERED FADE-UP
  ═══════════════════════════════════════════════════════════ */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
  );

  document
    .querySelectorAll(".fade-up")
    .forEach((el) => revealObserver.observe(el));

  /* ═══════════════════════════════════════════════════════════
     FAQ ACCORDION
  ═══════════════════════════════════════════════════════════ */
  document.querySelectorAll(".faq-item").forEach((item) => {
    item.querySelector(".faq-q").addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      const panel = item.closest(".faq-panel");
      if (panel) {
        panel.querySelectorAll(".faq-item").forEach((i) => {
          i.classList.remove("open");
          i.querySelector(".faq-q").setAttribute("aria-expanded", "false");
        });
      }
      if (!isOpen) {
        item.classList.add("open");
        item.querySelector(".faq-q").setAttribute("aria-expanded", "true");
      }
    });
  });

  /* ═══════════════════════════════════════════════════════════
     FAQ CATEGORY TABS
  ═══════════════════════════════════════════════════════════ */
  document.querySelectorAll(".faq-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.dataset.tab;
      document.querySelectorAll(".faq-tab").forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      document
        .querySelectorAll(".faq-panel")
        .forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      const panel = document.querySelector(
        '.faq-panel[data-panel="' + target + '"]',
      );
      if (panel) panel.classList.add("active");
    });
  });

  /* ═══════════════════════════════════════════════════════════
     BACK TO TOP
  ═══════════════════════════════════════════════════════════ */
  const backToTop = document.getElementById("back-to-top");
  window.addEventListener(
    "scroll",
    () => {
      backToTop.classList.toggle("visible", window.scrollY > 400);
    },
    { passive: true },
  );
  backToTop.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );

  /* ═══════════════════════════════════════════════════════════
     MODAL SYSTEM
  ═══════════════════════════════════════════════════════════ */
  function createModal(content) {
    document
      .querySelectorAll(".svpn-modal-backdrop")
      .forEach((m) => m.remove());

    const backdrop = document.createElement("div");
    backdrop.className = "svpn-modal-backdrop";
    backdrop.innerHTML =
      '<div class="svpn-modal" role="dialog" aria-modal="true">' +
      content +
      "</div>";
    document.body.appendChild(backdrop);
    document.body.classList.add("no-scroll");

    requestAnimationFrame(() => backdrop.classList.add("open"));

    function closeModal() {
      backdrop.classList.remove("open");
      document.body.classList.remove("no-scroll");
      setTimeout(() => backdrop.remove(), 300);
    }

    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closeModal();
    });
    backdrop
      .querySelectorAll(".svpn-modal-close, [data-close-modal]")
      .forEach((btn) => {
        btn.addEventListener("click", closeModal);
      });

    return { backdrop, closeModal };
  }

  /* ═══════════════════════════════════════════════════════════
     TOAST NOTIFICATIONS
  ═══════════════════════════════════════════════════════════ */
  function showToast(message, type, duration) {
    type = type || "success";
    duration = duration || 4000;
    let container = document.getElementById("toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      document.body.appendChild(container);
    }
    const toast = document.createElement("div");
    toast.className = "svpn-toast svpn-toast-" + type;
    const icon = type === "success" ? "✓" : type === "error" ? "✕" : "ℹ";
    toast.innerHTML =
      '<span class="toast-icon">' +
      icon +
      "</span><span>" +
      message +
      "</span>";
    container.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
    }, duration);
  }

  /* ═══════════════════════════════════════════════════════════
     PAYMENT MODAL BUILDER
  ═══════════════════════════════════════════════════════════ */
  function buildPlanModal(plan) {
    const plans = {
      standard: {
        name: "Standard Plan",
        price: "$20/mo",
        badge: "🌐 Most Popular",
        badgeClass: "badge-blue",
        color: "#376af6",
        perks: [
          "Access to 50+ global servers",
          "Advanced AES-256 encryption",
          "Priority 24/7 support",
          "Unlimited bandwidth",
          "No cooldown between connections",
          "Up to 3 simultaneous devices",
        ],
        desc: "Ideal for remote workers and frequent travellers who need reliable, always-on privacy across their main devices.",
      },
      premium: {
        name: "Premium Plan",
        price: "$40/mo",
        badge: "👑 Best Value",
        badgeClass: "badge-gold",
        color: "#f59e0b",
        perks: [
          "All 90+ servers worldwide",
          "Top-tier encryption + obfuscation",
          "24/7 dedicated support",
          "Unlimited bandwidth",
          "No cooldown — always on",
          "Up to 10 simultaneous devices",
          "Built-in Password Manager",
          "Ad & tracker blocker",
        ],
        desc: "Total digital freedom for power users. One plan covers your entire life — laptop, phone, tablet, router, and more.",
      },
    };

    const p = plans[plan];
    const perksHTML = p.perks
      .map(function (item) {
        return (
          '<li><svg viewBox="0 0 24 24" fill="none" stroke="' +
          p.color +
          '" stroke-width="2.5" width="14" height="14"><polyline points="20 6 9 17 4 12"/></svg>' +
          item +
          "</li>"
        );
      })
      .join("");

    return (
      '<button class="svpn-modal-close" aria-label="Close">&times;</button>' +
      '<div class="plan-modal-inner">' +
      '<div class="plan-modal-head">' +
      '<span class="plan-modal-badge ' +
      p.badgeClass +
      '">' +
      p.badge +
      "</span>" +
      '<h2 class="plan-modal-title">' +
      p.name +
      "</h2>" +
      '<div class="plan-modal-price">' +
      p.price +
      "</div>" +
      '<p class="plan-modal-desc">' +
      p.desc +
      "</p>" +
      "</div>" +
      '<ul class="plan-modal-perks">' +
      perksHTML +
      "</ul>" +
      '<div class="plan-modal-actions">' +
      '<button class="btn btn-paypal" id="btn-paypal">' +
      '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a3.35 3.35 0 0 0-.607-.541c-.013.076-.026.175-.041.254-.93 4.778-4.005 7.201-9.138 7.201h-2.19a.563.563 0 0 0-.556.479l-1.187 7.527h-.506l-.24 1.516a.56.56 0 0 0 .554.647h3.882c.46 0 .85-.334.922-.788.098-.62.98-6.227.98-6.227h2.19c4.358 0 7.422-1.763 8.26-6.866.33-2.04.156-3.593-.323-4.202z"/></svg>' +
      "Pay with PayPal" +
      "</button>" +
      '<button class="btn btn-card" id="btn-card">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>' +
      "Pay with Card" +
      "</button>" +
      "</div>" +
      '<p class="plan-modal-guarantee">🔒 30-day money-back guarantee · Cancel anytime</p>' +
      "</div>"
    );
  }

  /* ═══════════════════════════════════════════════════════════
     CARD PAYMENT FORM
  ═══════════════════════════════════════════════════════════ */
  function buildCardForm(planName, price) {
    return (
      '<button class="svpn-modal-close" aria-label="Close">&times;</button>' +
      '<div class="card-form-inner">' +
      '<div class="card-form-head">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28" height="28"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>' +
      "<div><h2>Secure Checkout</h2><p>" +
      planName +
      " · <strong>" +
      price +
      "</strong></p></div>" +
      "</div>" +
      '<div class="card-demo-warning" role="note" aria-label="Demo payment warning">' +
      "<strong>Demo only:</strong> Do not enter your real financial information. This checkout form is for portfolio demonstration purposes only." +
      "</div>" +
      '<div class="card-preview" id="card-preview">' +
      '<div class="card-preview-inner">' +
      '<div class="card-front">' +
      '<div class="card-chip"></div>' +
      '<div class="card-network">VISA</div>' +
      '<div class="card-number-disp" id="card-num-disp">•••• •••• •••• ••••</div>' +
      '<div class="card-bottom-row">' +
      '<div><span class="card-lbl">Card Holder</span><span id="card-name-disp">YOUR NAME</span></div>' +
      '<div><span class="card-lbl">Expires</span><span id="card-exp-disp">MM/YY</span></div>' +
      "</div>" +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div class="card-fields">' +
      '<div class="field-group"><label for="cf-name">Cardholder Name</label><input type="text" id="cf-name" placeholder="John Doe" autocomplete="cc-name" maxlength="26"/></div>' +
      '<div class="field-group"><label for="cf-num">Card Number</label><div class="input-icon-wrap"><input type="text" id="cf-num" placeholder="1234 5678 9012 3456" autocomplete="cc-number" maxlength="19" inputmode="numeric"/><svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="20" height="20"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg></div></div>' +
      '<div class="field-row">' +
      '<div class="field-group"><label for="cf-exp">Expiry Date</label><input type="text" id="cf-exp" placeholder="MM / YY" autocomplete="cc-exp" maxlength="7" inputmode="numeric"/></div>' +
      '<div class="field-group"><label for="cf-cvv">CVV</label><div class="input-icon-wrap"><input type="text" id="cf-cvv" placeholder="•••" autocomplete="cc-csc" maxlength="4" inputmode="numeric"/></div></div>' +
      "</div>" +
      '<div class="field-group"><label for="cf-email">Email for receipt</label><input type="email" id="cf-email" placeholder="you@example.com" autocomplete="email"/></div>' +
      "</div>" +
      '<button class="btn btn-pay-now" id="btn-pay-now">' +
      '<span id="pay-btn-label"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="16" height="16"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>Pay ' +
      price +
      " Securely</span>" +
      '<span id="pay-btn-loading" style="display:none;"><span class="spinner"></span> Processing…</span>' +
      "</button>" +
      '<p class="card-secure-note"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="12" height="12"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>256-bit SSL encryption · We never store card details</p>' +
      "</div>"
    );
  }

  /* ═══════════════════════════════════════════════════════════
     CARD FORM LIVE INTERACTIONS
  ═══════════════════════════════════════════════════════════ */
  function initCardFormListeners(modal, planName, price) {
    const numInput = modal.querySelector("#cf-num");
    const nameInput = modal.querySelector("#cf-name");
    const expInput = modal.querySelector("#cf-exp");
    const cvvInput = modal.querySelector("#cf-cvv");
    const emailInput = modal.querySelector("#cf-email");

    const numDisp = modal.querySelector("#card-num-disp");
    const nameDisp = modal.querySelector("#card-name-disp");
    const expDisp = modal.querySelector("#card-exp-disp");
    const cardPreview = modal.querySelector("#card-preview");

    numInput.addEventListener("input", function () {
      let v = numInput.value.replace(/\D/g, "").slice(0, 16);
      numInput.value = v.replace(/(.{4})/g, "$1 ").trim();
      const padded = v.padEnd(16, "\u2022");
      numDisp.textContent = padded.replace(/(.{4})/g, "$1 ").trim();
      const networkEl = modal.querySelector(".card-network");
      if (v.startsWith("4")) networkEl.textContent = "VISA";
      else if (v.startsWith("5") || v.startsWith("2"))
        networkEl.textContent = "MC";
      else if (v.startsWith("3")) networkEl.textContent = "AMEX";
      else networkEl.textContent = "VISA";
    });

    nameInput.addEventListener("input", function () {
      nameDisp.textContent = nameInput.value.toUpperCase() || "YOUR NAME";
    });

    expInput.addEventListener("input", function () {
      let v = expInput.value.replace(/\D/g, "").slice(0, 4);
      if (v.length >= 2) v = v.slice(0, 2) + " / " + v.slice(2);
      expInput.value = v;
      expDisp.textContent = expInput.value || "MM/YY";
    });

    cvvInput.addEventListener("focus", function () {
      cardPreview.classList.add("flipped");
    });
    cvvInput.addEventListener("blur", function () {
      cardPreview.classList.remove("flipped");
    });
    cvvInput.addEventListener("input", function () {
      cvvInput.value = cvvInput.value.replace(/\D/g, "").slice(0, 4);
    });

    modal.querySelector("#btn-pay-now").addEventListener("click", function () {
      const name = nameInput.value.trim();
      const num = numInput.value.replace(/\s/g, "");
      const exp = expInput.value.trim();
      const cvv = cvvInput.value.trim();
      const email = emailInput.value.trim();

      if (!name) {
        shakeField(nameInput);
        showToast("Please enter your cardholder name.", "error");
        return;
      }
      if (num.length < 16) {
        shakeField(numInput);
        showToast("Please enter a valid 16-digit card number.", "error");
        return;
      }
      if (exp.length < 7) {
        shakeField(expInput);
        showToast("Please enter the expiry date.", "error");
        return;
      }
      if (cvv.length < 3) {
        shakeField(cvvInput);
        showToast("Please enter your CVV.", "error");
        return;
      }
      if (!email || !email.includes("@")) {
        shakeField(emailInput);
        showToast("Please enter a valid email address.", "error");
        return;
      }

      const label = modal.querySelector("#pay-btn-label");
      const loading = modal.querySelector("#pay-btn-loading");
      const payBtn = modal.querySelector("#btn-pay-now");
      label.style.display = "none";
      loading.style.display = "inline-flex";
      payBtn.disabled = true;

      setTimeout(function () {
        document.querySelectorAll(".svpn-modal-backdrop").forEach(function (m) {
          m.classList.remove("open");
          document.body.classList.remove("no-scroll");
          setTimeout(function () {
            m.remove();
          }, 300);
        });
        setTimeout(function () {
          showSuccessModal(planName, price, email);
        }, 350);
      }, 2000);
    });
  }

  function shakeField(input) {
    input.classList.add("shake");
    input.style.borderColor = "#ef4444";
    setTimeout(function () {
      input.classList.remove("shake");
      input.style.borderColor = "";
    }, 600);
  }

  /* ═══════════════════════════════════════════════════════════
     SUCCESS MODAL
  ═══════════════════════════════════════════════════════════ */
  function showSuccessModal(planName, price, email) {
    createModal(
      '<button class="svpn-modal-close" aria-label="Close">&times;</button>' +
        '<div class="success-modal-inner">' +
        '<div class="success-anim">' +
        '<svg class="success-circle" viewBox="0 0 52 52">' +
        '<circle class="success-circle-bg" cx="26" cy="26" r="24"/>' +
        '<path class="success-check" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M14 27l8 8 16-16"/>' +
        "</svg>" +
        "</div>" +
        "<h2>Welcome to SiliconVPN!</h2>" +
        '<p class="success-plan">' +
        planName +
        " · " +
        price +
        "</p>" +
        '<p class="success-msg">Your payment was processed successfully. A confirmation has been sent to <strong>' +
        email +
        "</strong>.</p>" +
        '<div class="success-next">' +
        '<p class="success-next-title">What\'s next?</p>' +
        '<div class="success-steps">' +
        '<div class="success-step"><span>1</span><p>Check your inbox for your activation link</p></div>' +
        '<div class="success-step"><span>2</span><p>Download the SiliconVPN app for your device</p></div>' +
        '<div class="success-step"><span>3</span><p>Log in and connect to your nearest server</p></div>' +
        "</div>" +
        "</div>" +
        '<button class="btn btn-primary" data-close-modal style="width:100%;margin-top:8px;">Got it — Let\'s Go!</button>' +
        "</div>",
    );
  }

  /* ═══════════════════════════════════════════════════════════
     PRICING — DOWNLOAD FREE (Basic plan)
  ═══════════════════════════════════════════════════════════ */
  const downloadBtn = document.querySelector(".pcard-cta.btn-outline");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const content =
        "SiliconVPN Installer — Basic (Free)\n" +
        "======================================\n" +
        "Version: 2.4.1 (64-bit)\n" +
        "Released: 2026-03-11\n" +
        "Platform: Windows x64\n\n" +
        "INSTALLATION INSTRUCTIONS\n" +
        "--------------------------\n" +
        "1. Run this installer as Administrator\n" +
        "2. Follow the on-screen setup wizard\n" +
        "3. Launch SiliconVPN from your Start Menu\n" +
        "4. Create a free account or log in\n" +
        "5. Select a server and click Connect\n\n" +
        "FREE PLAN INCLUDES:\n" +
        "  \u2022 Access to 10+ server locations\n" +
        "  \u2022 Standard AES-128 encryption\n" +
        "  \u2022 1 simultaneous device\n" +
        "  \u2022 Basic support via help centre\n" +
        "  \u2022 Up to 2 GB / day bandwidth\n\n" +
        "NOTE: This is a demo installer file for portfolio purposes.\n" +
        "SiliconVPN is a concept project \u2014 no real VPN connection is established.\n\n" +
        "\u00a9 2026 MadeByMyst \u00b7 SiliconVPN";
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "silicon-vpn-install(64x).txt";
      a.click();
      URL.revokeObjectURL(url);
      showToast("Download started — silicon-vpn-install(64x).txt", "success");
    });
  }

  /* ═══════════════════════════════════════════════════════════
     PRICING — CHOOSE PLAN (Standard & Premium)
  ═══════════════════════════════════════════════════════════ */
  document.querySelectorAll(".pcard-cta").forEach(function (btn) {
    if (btn.classList.contains("btn-outline")) return;

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      const card = btn.closest(".pcard");
      const planNameText =
        (card.querySelector(".pcard-name") || {}).textContent || "";
      const plan =
        planNameText.trim().toLowerCase() === "premium"
          ? "premium"
          : "standard";
      const price = plan === "premium" ? "$40/mo" : "$20/mo";
      const title = plan === "premium" ? "Premium Plan" : "Standard Plan";

      const { backdrop } = createModal(buildPlanModal(plan));

      backdrop
        .querySelector("#btn-paypal")
        .addEventListener("click", function () {
          showToast("PayPal integration coming soon!", "info");
        });

      backdrop
        .querySelector("#btn-card")
        .addEventListener("click", function () {
          backdrop.classList.remove("open");
          document.body.classList.remove("no-scroll");
          setTimeout(function () {
            backdrop.remove();
            const { backdrop: cardBackdrop } = createModal(
              buildCardForm(title, price),
            );
            initCardFormListeners(cardBackdrop, title, price);
          }, 200);
        });
    });
  });

  /* ═══════════════════════════════════════════════════════════
     SIGN-UP MODAL
  ═══════════════════════════════════════════════════════════ */
  function openSignupModal() {
    const { backdrop } = createModal(
      '<button class="svpn-modal-close" aria-label="Close">&times;</button>' +
        '<div class="signup-modal-inner">' +
        '<div class="signup-head">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="var(--brand)" stroke-width="2" width="32" height="32"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' +
        "<h2>Create your account</h2>" +
        "<p>Free forever. No credit card needed.</p>" +
        "</div>" +
        '<div class="auth-demo-warning" role="note" aria-label="Demo account warning">' +
        "<strong>Demo only:</strong> Do not use your real email, password, or personal information. This sign-up form is for portfolio demonstration purposes only." +
        "</div>" +
        '<div class="card-fields">' +
        '<div class="field-row">' +
        '<div class="field-group"><label for="su-fname">First Name</label><input type="text" id="su-fname" placeholder="John"/></div>' +
        '<div class="field-group"><label for="su-lname">Last Name</label><input type="text" id="su-lname" placeholder="Doe"/></div>' +
        "</div>" +
        '<div class="field-group"><label for="su-email">Email</label><input type="email" id="su-email" placeholder="you@example.com"/></div>' +
        '<div class="field-group"><label for="su-pass">Password</label>' +
        '<div class="input-icon-wrap">' +
        '<input type="password" id="su-pass" placeholder="Min. 8 characters"/>' +
        '<button type="button" class="toggle-pass" style="background:none;border:none;cursor:pointer;padding:4px;position:absolute;right:10px;top:50%;transform:translateY(-50%);">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>' +
        "</button>" +
        "</div>" +
        "</div>" +
        '<label class="checkbox-row"><input type="checkbox" id="su-terms"/><span>I agree to the <a href="#" onclick="return false;" style="color:var(--brand)">Terms of Service</a> and <a href="#" onclick="return false;" style="color:var(--brand)">Privacy Policy</a></span></label>' +
        "</div>" +
        '<button class="btn btn-primary" id="btn-create-account" style="width:100%;margin-top:8px;">Create Free Account</button>' +
        '<p class="card-secure-note" style="text-align:center;margin-top:12px;">Already have an account? <a href="#" id="open-login" style="color:var(--brand);font-weight:600;">Log in</a></p>' +
        "</div>",
    );

    backdrop
      .querySelector(".toggle-pass")
      .addEventListener("click", function () {
        const inp = backdrop.querySelector("#su-pass");
        inp.type = inp.type === "password" ? "text" : "password";
      });

    backdrop
      .querySelector("#btn-create-account")
      .addEventListener("click", function () {
        const fname = backdrop.querySelector("#su-fname").value.trim();
        const email = backdrop.querySelector("#su-email").value.trim();
        const pass = backdrop.querySelector("#su-pass").value;
        const agreed = backdrop.querySelector("#su-terms").checked;

        if (!fname) {
          showToast("Please enter your first name.", "error");
          return;
        }
        if (!email || !email.includes("@")) {
          showToast("Please enter a valid email.", "error");
          return;
        }
        if (pass.length < 8) {
          showToast("Password must be at least 8 characters.", "error");
          return;
        }
        if (!agreed) {
          showToast("Please accept the Terms of Service.", "error");
          return;
        }

        const btn = backdrop.querySelector("#btn-create-account");
        btn.textContent = "Creating account\u2026";
        btn.disabled = true;

        setTimeout(function () {
          backdrop.classList.remove("open");
          document.body.classList.remove("no-scroll");
          setTimeout(function () {
            backdrop.remove();
          }, 300);
          showToast(
            "Welcome, " + fname + "! Your account is ready. \uD83C\uDF89",
            "success",
            5000,
          );
        }, 1500);
      });

    backdrop
      .querySelector("#open-login")
      .addEventListener("click", function (e) {
        e.preventDefault();
        backdrop.classList.remove("open");
        document.body.classList.remove("no-scroll");
        setTimeout(function () {
          backdrop.remove();
          openLoginModal();
        }, 250);
      });
  }

  /* ═══════════════════════════════════════════════════════════
     LOGIN MODAL
  ═══════════════════════════════════════════════════════════ */
  function openLoginModal() {
    const { backdrop } = createModal(
      '<button class="svpn-modal-close" aria-label="Close">&times;</button>' +
        '<div class="signup-modal-inner">' +
        '<div class="signup-head">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="var(--brand)" stroke-width="2" width="32" height="32"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' +
        "<h2>Welcome back</h2>" +
        "<p>Log in to your SiliconVPN account</p>" +
        "</div>" +
        '<div class="auth-demo-warning" role="note" aria-label="Demo login warning">' +
        "<strong>Demo only:</strong> Do not enter your real email or password. This log-in form is for portfolio demonstration purposes only." +
        "</div>" +
        '<div class="card-fields">' +
        '<div class="field-group"><label for="li-email">Email</label><input type="email" id="li-email" placeholder="you@example.com"/></div>' +
        '<div class="field-group"><label for="li-pass">Password</label>' +
        '<div class="input-icon-wrap">' +
        '<input type="password" id="li-pass" placeholder="Your password"/>' +
        '<button type="button" class="toggle-pass" style="background:none;border:none;cursor:pointer;padding:4px;position:absolute;right:10px;top:50%;transform:translateY(-50%);">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>' +
        "</button>" +
        "</div>" +
        "</div>" +
        '<div style="text-align:right;margin-top:-4px;"><a href="#" id="forgot-pass" style="color:var(--brand);font-size:0.85rem;">Forgot password?</a></div>' +
        "</div>" +
        '<button class="btn btn-primary" id="btn-login" style="width:100%;margin-top:16px;">Log In</button>' +
        '<p class="card-secure-note" style="text-align:center;margin-top:12px;">New here? <a href="#" id="open-signup-from-login" style="color:var(--brand);font-weight:600;">Create an account</a></p>' +
        "</div>",
    );

    backdrop
      .querySelector(".toggle-pass")
      .addEventListener("click", function () {
        const inp = backdrop.querySelector("#li-pass");
        inp.type = inp.type === "password" ? "text" : "password";
      });

    backdrop.querySelector("#btn-login").addEventListener("click", function () {
      const email = backdrop.querySelector("#li-email").value.trim();
      const pass = backdrop.querySelector("#li-pass").value;
      if (!email || !email.includes("@")) {
        showToast("Please enter a valid email.", "error");
        return;
      }
      if (!pass) {
        showToast("Please enter your password.", "error");
        return;
      }

      const btn = backdrop.querySelector("#btn-login");
      btn.textContent = "Logging in\u2026";
      btn.disabled = true;

      setTimeout(function () {
        backdrop.classList.remove("open");
        document.body.classList.remove("no-scroll");
        setTimeout(function () {
          backdrop.remove();
        }, 300);
        showToast(
          "Logged in successfully! Welcome back. \uD83D\uDC4B",
          "success",
          4000,
        );
      }, 1200);
    });

    backdrop
      .querySelector("#forgot-pass")
      .addEventListener("click", function (e) {
        e.preventDefault();
        showToast("Password reset link sent to your email.", "info", 5000);
      });

    backdrop
      .querySelector("#open-signup-from-login")
      .addEventListener("click", function (e) {
        e.preventDefault();
        backdrop.classList.remove("open");
        document.body.classList.remove("no-scroll");
        setTimeout(function () {
          backdrop.remove();
          openSignupModal();
        }, 250);
      });
  }

  /* ═══════════════════════════════════════════════════════════
     CONTACT MODAL
  ═══════════════════════════════════════════════════════════ */
  function openContactModal() {
    const { backdrop } = createModal(
      '<button class="svpn-modal-close" aria-label="Close">&times;</button>' +
        '<div class="signup-modal-inner">' +
        '<div class="signup-head">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="var(--brand)" stroke-width="2" width="32" height="32"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
        "<h2>Contact Support</h2>" +
        "<p>Our team replies in under 5 minutes.</p>" +
        "</div>" +
        '<div class="card-fields">' +
        '<div class="field-group"><label for="ct-name">Your Name</label><input type="text" id="ct-name" placeholder="John Doe"/></div>' +
        '<div class="field-group"><label for="ct-email">Email Address</label><input type="email" id="ct-email" placeholder="you@example.com"/></div>' +
        '<div class="field-group"><label for="ct-subject">Subject</label>' +
        '<select id="ct-subject" style="width:100%;padding:12px 16px;border-radius:10px;border:1.5px solid var(--border);background:var(--surface);color:var(--text);font-family:inherit;font-size:0.95rem;cursor:pointer;outline:none;">' +
        '<option value="">Select a topic\u2026</option>' +
        "<option>Account &amp; Login</option>" +
        "<option>Billing &amp; Payments</option>" +
        "<option>Connection Issues</option>" +
        "<option>Feature Request</option>" +
        "<option>Other</option>" +
        "</select>" +
        "</div>" +
        '<div class="field-group"><label for="ct-msg">Message</label><textarea id="ct-msg" placeholder="Describe your issue or question\u2026" rows="4" style="width:100%;padding:12px 16px;border-radius:10px;border:1.5px solid var(--border);background:var(--surface);color:var(--text);font-family:inherit;font-size:0.95rem;resize:vertical;outline:none;"></textarea></div>' +
        "</div>" +
        '<button class="btn btn-primary" id="btn-send-msg" style="width:100%;margin-top:8px;">Send Message</button>' +
        "</div>",
    );

    backdrop
      .querySelector("#btn-send-msg")
      .addEventListener("click", function () {
        const name = backdrop.querySelector("#ct-name").value.trim();
        const email = backdrop.querySelector("#ct-email").value.trim();
        const subj = backdrop.querySelector("#ct-subject").value;
        const msg = backdrop.querySelector("#ct-msg").value.trim();

        if (!name) {
          showToast("Please enter your name.", "error");
          return;
        }
        if (!email || !email.includes("@")) {
          showToast("Please enter a valid email.", "error");
          return;
        }
        if (!subj) {
          showToast("Please select a subject.", "error");
          return;
        }
        if (!msg) {
          showToast("Please write your message.", "error");
          return;
        }

        const btn = backdrop.querySelector("#btn-send-msg");
        btn.textContent = "Sending\u2026";
        btn.disabled = true;

        setTimeout(function () {
          backdrop.classList.remove("open");
          document.body.classList.remove("no-scroll");
          setTimeout(function () {
            backdrop.remove();
          }, 300);
          showToast(
            "Message sent! We'll reply within 5 minutes. \u2713",
            "success",
            5000,
          );
        }, 1000);
      });
  }

  /* ═══════════════════════════════════════════════════════════
     WIRE UP ALL REMAINING BUTTONS
  ═══════════════════════════════════════════════════════════ */

  // "Get VPN" in navbar / mobile → signup
  document
    .querySelectorAll(".navbar-cta .btn-primary, .mobile-menu .mobile-nav-cta")
    .forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        closeMenu();
        openSignupModal();
      });
    });

  // Hero "Get Started — It's Free"
  const heroGetStarted = document.querySelector(".hero-btns .btn-primary");
  if (heroGetStarted) {
    heroGetStarted.addEventListener("click", function (e) {
      e.preventDefault();
      openSignupModal();
    });
  }

  // CTA banner "Get Started Free"
  const ctaBannerBtn = document.querySelector(".cta-btns .btn-white");
  if (ctaBannerBtn) {
    ctaBannerBtn.addEventListener("click", function (e) {
      e.preventDefault();
      openSignupModal();
    });
  }

  // Feature split "Get Protected Now" — scroll to pricing + pulse
  document
    .querySelectorAll('.fsplit-text .btn-primary[href="#pricing"]')
    .forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        document
          .getElementById("pricing")
          .scrollIntoView({ behavior: "smooth" });
        setTimeout(function () {
          document.querySelectorAll(".pcard").forEach(function (c, i) {
            setTimeout(function () {
              c.classList.add("pulse-once");
              setTimeout(function () {
                c.classList.remove("pulse-once");
              }, 600);
            }, i * 100);
          });
        }, 650);
      });
    });

  // "Unlock Premium" → scroll & highlight premium card
  const unlockBtn = document.querySelector(
    '.fsplit-text .btn-gold[href="#pricing"]',
  );
  if (unlockBtn) {
    unlockBtn.addEventListener("click", function (e) {
      e.preventDefault();
      document.getElementById("pricing").scrollIntoView({ behavior: "smooth" });
      setTimeout(function () {
        const prem = document.querySelector(".pcard-featured");
        if (prem) {
          prem.classList.add("pulse-once");
          setTimeout(function () {
            prem.classList.remove("pulse-once");
          }, 700);
        }
      }, 650);
    });
  }

  // FAQ & footer "Contact Support"
  document
    .querySelectorAll('.faq-cta-strip .btn-primary, a[href="#contact"].btn')
    .forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        openContactModal();
      });
    });

  // "How it works" step 1 — inject sign-up button
  document.querySelectorAll(".step").forEach(function (step) {
    const h = step.querySelector("h3");
    if (h && h.textContent.includes("Create Your Account")) {
      const btn = document.createElement("button");
      btn.className = "btn btn-primary step-inline-btn";
      btn.textContent = "Sign Up Free";
      step.appendChild(btn);
      btn.addEventListener("click", openSignupModal);
    }
  });

  // Hero scroll links — pulse pricing when arrived
  document
    .querySelectorAll(
      'a[href="#pricing"]:not(.btn-primary):not(.btn-gold):not(.fsplit-text a)',
    )
    .forEach(function (a) {
      a.addEventListener("click", function () {
        setTimeout(function () {
          document.querySelectorAll(".pcard").forEach(function (c, i) {
            setTimeout(function () {
              c.classList.add("pulse-once");
              setTimeout(function () {
                c.classList.remove("pulse-once");
              }, 600);
            }, i * 100);
          });
        }, 600);
      });
    });

  /* ═══════════════════════════════════════════════════════════
     ANIMATED LIVE IP / SERVER in hero mock card
  ═══════════════════════════════════════════════════════════ */
  const fmcCard = document.querySelector(".fsplit-mockcard");
  if (fmcCard) {
    const servers = [
      {
        flag: "\uD83C\uDDF3\uD83C\uDDF1",
        city: "Amsterdam",
        country: "Netherlands",
        ms: "12",
        ip: "185.220.XXX.XXX",
      },
      {
        flag: "\uD83C\uDDFA\uD83C\uDDF8",
        city: "New York",
        country: "United States",
        ms: "38",
        ip: "104.21.XXX.XXX",
      },
      {
        flag: "\uD83C\uDDEC\uD83C\uDDE7",
        city: "London",
        country: "United Kingdom",
        ms: "8",
        ip: "51.89.XXX.XXX",
      },
      {
        flag: "\uD83C\uDDE9\uD83C\uDDEA",
        city: "Frankfurt",
        country: "Germany",
        ms: "22",
        ip: "95.213.XXX.XXX",
      },
      {
        flag: "\uD83C\uDDF8\uD83C\uDDEC",
        city: "Singapore",
        country: "Singapore",
        ms: "110",
        ip: "45.76.XXX.XXX",
      },
      {
        flag: "\uD83C\uDDEF\uD83C\uDDF5",
        city: "Tokyo",
        country: "Japan",
        ms: "88",
        ip: "103.152.XXX.XXX",
      },
    ];
    let si = 0;
    setInterval(function () {
      si = (si + 1) % servers.length;
      const s = servers[si];
      const ipEl = fmcCard.querySelector(".fmc-ip-value");
      const flagEl = fmcCard.querySelector(".fmc-flag");
      const locEl = fmcCard.querySelector(".fmc-loc-info strong");
      const subEl = fmcCard.querySelector(".fmc-loc-info span");
      if (ipEl)
        ipEl.innerHTML = s.ip.replace(
          "XXX.XXX",
          '<span class="fmc-redact">XXX.XXX</span>',
        );
      if (flagEl) flagEl.textContent = s.flag;
      if (locEl) locEl.textContent = s.city;
      if (subEl) subEl.textContent = s.country + " \u00b7 " + s.ms + " ms";
    }, 3500);
  }

  /* ═══════════════════════════════════════════════════════════
     FOOTER SMOOTH SCROLL
  ═══════════════════════════════════════════════════════════ */
  document.querySelectorAll('.footer-col a[href^="#"]').forEach(function (a) {
    a.addEventListener("click", function (e) {
      const target = document.querySelector(a.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
});

/* ═══════════════════════════════════════════════════════════
   INJECT STYLES
═══════════════════════════════════════════════════════════ */
(function injectStyles() {
  const style = document.createElement("style");
  style.textContent = `
    #toast-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 99999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    }
    .svpn-toast {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 20px;
      border-radius: 12px;
      font-family: 'Inter', sans-serif;
      font-size: 0.9rem;
      font-weight: 500;
      color: #fff;
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      transform: translateX(110%);
      opacity: 0;
      transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s;
      pointer-events: all;
      max-width: 340px;
    }
    .svpn-toast.show { transform: translateX(0); opacity: 1; }
    .svpn-toast-success { background: linear-gradient(135deg,#059669,#10b981); }
    .svpn-toast-error   { background: linear-gradient(135deg,#dc2626,#ef4444); }
    .svpn-toast-info    { background: linear-gradient(135deg,#2563eb,#376af6); }
    .toast-icon { font-size: 1rem; font-weight: 700; }

    .svpn-modal-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(10,4,28,0.65);
      backdrop-filter: blur(6px);
      z-index: 9000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      opacity: 0;
      transition: opacity 0.3s;
      overflow-y: auto;
    }
    .svpn-modal-backdrop.open { opacity: 1; }
    .svpn-modal {
      background: var(--surface, #fff);
      border-radius: 24px;
      padding: 36px 32px;
      max-width: 480px;
      width: 100%;
      box-sizing: border-box;
      position: relative;
      box-shadow: 0 24px 80px rgba(102,32,207,0.25);
      transform: translateY(20px) scale(0.97);
      transition: transform 0.35s cubic-bezier(0.34,1.3,0.64,1);
      max-height: 90vh;
      overflow-y: auto;
      overflow-x: hidden;
    }
    .svpn-modal-backdrop.open .svpn-modal { transform: translateY(0) scale(1); }
    .svpn-modal-close {
      position: absolute;
      top: 16px; right: 16px;
      background: var(--surface-2, #f2eeff);
      border: none;
      border-radius: 50%;
      width: 36px; height: 36px;
      font-size: 1.3rem;
      cursor: pointer;
      color: var(--text-2, #4b3872);
      display: flex; align-items: center; justify-content: center;
      transition: background 0.2s, transform 0.2s;
    }
    .svpn-modal-close:hover { background: rgba(102,32,207,0.15); transform: scale(1.1); }

    .plan-modal-inner { display: flex; flex-direction: column; gap: 20px; }
    .plan-modal-head  { text-align: center; }
    .plan-modal-badge { display: inline-block; padding: 5px 14px; border-radius: 99px; font-size: 0.8rem; font-weight: 700; margin-bottom: 10px; }
    .badge-blue { background: #eff6ff; color: #2563eb; }
    .badge-gold { background: #fffbeb; color: #d97706; }
    .plan-modal-title { font-size: 1.7rem; font-weight: 800; color: var(--text); margin-bottom: 4px; }
    .plan-modal-price { font-size: 2.2rem; font-weight: 800; background: linear-gradient(135deg, var(--brand), var(--brand-2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .plan-modal-desc  { color: var(--text-3, #7b6ea0); font-size: 0.9rem; margin-top: 6px; }
    .plan-modal-perks { display: flex; flex-direction: column; gap: 8px; background: var(--surface-2, #f2eeff); border-radius: 14px; padding: 16px 20px; }
    .plan-modal-perks li { display: flex; align-items: center; gap: 10px; font-size: 0.9rem; color: var(--text); }
    .plan-modal-actions { display: flex; gap: 12px; }
    .btn-paypal {
      flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
      padding: 14px 20px; border-radius: 12px; border: none;
      background: #003087; color: #fff; font-weight: 600; font-size: 0.9rem;
      cursor: pointer; transition: opacity 0.2s, transform 0.15s; font-family: inherit;
    }
    .btn-paypal:hover { opacity: 0.88; transform: translateY(-1px); }
    .btn-card {
      flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
      padding: 14px 20px; border-radius: 12px; border: none;
      background: linear-gradient(135deg, var(--brand, #6620cf), var(--brand-2, #376af6));
      color: #fff; font-weight: 600; font-size: 0.9rem;
      cursor: pointer; transition: opacity 0.2s, transform 0.15s; font-family: inherit;
    }
    .btn-card:hover { opacity: 0.88; transform: translateY(-1px); }
    .plan-modal-guarantee { text-align: center; font-size: 0.78rem; color: var(--text-3); }

    .card-form-inner { display: flex; flex-direction: column; gap: 20px; }
    .card-form-head { display: flex; align-items: center; gap: 14px; border-bottom: 1px solid var(--border-soft); padding-bottom: 16px; }
    .card-form-head h2 { font-size: 1.3rem; font-weight: 800; color: var(--text); margin: 0; }
    .card-form-head p  { font-size: 0.85rem; color: var(--text-3); margin: 2px 0 0; }
    .card-demo-warning {
      padding: 12px 14px;
      border-radius: 14px;
      border: 1px solid rgba(245, 158, 11, 0.32);
      background: linear-gradient(135deg, rgba(255, 251, 235, 0.96), rgba(254, 243, 199, 0.92));
      color: #7c4a03;
      font-size: 0.84rem;
      line-height: 1.45;
    }
    .card-demo-warning strong { color: #92400e; }

    .card-preview { perspective: 1000px; height: 170px; }
    .card-preview-inner {
      position: relative; width: 100%; height: 100%;
      transition: transform 0.6s cubic-bezier(0.4,0,0.2,1);
      transform-style: preserve-3d;
    }
    .card-preview.flipped .card-preview-inner { transform: rotateY(180deg); }
    .card-front {
      position: absolute; inset: 0;
      background: linear-gradient(135deg, #1a0533 0%, #2d1066 50%, #1a2a6c 100%);
      border-radius: 16px; padding: 22px 24px; color: #fff;
      display: flex; flex-direction: column; justify-content: space-between;
      backface-visibility: hidden; -webkit-backface-visibility: hidden;
      box-shadow: 0 10px 40px rgba(102,32,207,0.3);
    }
    .card-chip { width: 36px; height: 28px; background: linear-gradient(135deg,#fbbf24,#f59e0b); border-radius: 6px; }
    .card-network { position: absolute; top: 20px; right: 24px; font-weight: 800; font-size: 1.1rem; letter-spacing: 1px; font-style: italic; opacity: 0.9; }
    .card-number-disp { font-size: 1.2rem; letter-spacing: 3px; font-family: 'Courier New',monospace; opacity: 0.95; }
    .card-bottom-row { display: flex; justify-content: space-between; gap: 16px; }
    .card-bottom-row > div { display: flex; flex-direction: column; gap: 2px; }
    .card-lbl { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 1px; opacity: 0.6; }

    .card-fields { display: flex; flex-direction: column; gap: 14px; min-width: 0; }
    .field-group { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
    .field-group label { font-size: 0.82rem; font-weight: 600; color: var(--text-2, #4b3872); }
    .field-group input, .field-group select, .field-group textarea {
      width: 100%;
      min-width: 0;
      padding: 12px 16px; border-radius: 10px;
      border: 1.5px solid var(--border, rgba(102,32,207,0.15));
      background: var(--surface, #fff); color: var(--text, #160a2b);
      font-family: inherit; font-size: 0.95rem; outline: none;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .field-group input:focus, .field-group select:focus, .field-group textarea:focus {
      border-color: var(--brand, #6620cf);
      box-shadow: 0 0 0 3px rgba(102,32,207,0.1);
    }
    .field-row { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 12px; }
    .field-row > * { min-width: 0; }
    .input-icon-wrap { position: relative; min-width: 0; }
    .input-icon-wrap input { width: 100%; padding-right: 44px; }
    .input-icon { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); color: var(--text-3); pointer-events: none; }
    .checkbox-row { display: flex; align-items: flex-start; gap: 10px; font-size: 0.85rem; cursor: pointer; }
    .checkbox-row input { margin-top: 2px; accent-color: var(--brand); }

    .btn-pay-now {
      width: 100%; padding: 15px; border-radius: 12px; border: none;
      background: linear-gradient(135deg, var(--brand, #6620cf), var(--brand-2, #376af6));
      color: #fff; font-weight: 700; font-size: 1rem;
      cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
      font-family: inherit; transition: opacity 0.2s, transform 0.15s;
    }
    .btn-pay-now:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
    .btn-pay-now:disabled { opacity: 0.65; cursor: not-allowed; }
    #pay-btn-label { display: inline-flex; align-items: center; gap: 8px; }
    #pay-btn-loading { display: inline-flex; align-items: center; gap: 10px; }

    .card-secure-note {
      display: flex; align-items: center; justify-content: center;
      gap: 5px; font-size: 0.78rem; color: var(--text-3);
    }
    .spinner {
      width: 16px; height: 16px;
      border: 2px solid rgba(255,255,255,0.4);
      border-top-color: #fff; border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes shake {
      0%,100% { transform: translateX(0); }
      20%,60%  { transform: translateX(-6px); }
      40%,80%  { transform: translateX(6px); }
    }
    .shake { animation: shake 0.4s ease; }

    .success-modal-inner { display: flex; flex-direction: column; align-items: center; gap: 16px; text-align: center; }
    .success-circle { width: 72px; height: 72px; animation: scalePop 0.4s ease; }
    .success-circle-bg { fill: var(--brand, #6620cf); }
    .success-check {
      stroke-dasharray: 60; stroke-dashoffset: 60;
      animation: drawCheck 0.5s 0.2s ease forwards;
    }
    @keyframes scalePop { 0% { transform: scale(0); } 70% { transform: scale(1.1); } 100% { transform: scale(1); } }
    @keyframes drawCheck { to { stroke-dashoffset: 0; } }
    .success-modal-inner h2 { font-size: 1.5rem; font-weight: 800; color: var(--text); }
    .success-plan { font-size: 0.9rem; color: var(--text-3); }
    .success-msg  { font-size: 0.9rem; color: var(--text-2); max-width: 380px; }
    .success-next { width: 100%; background: var(--surface-2, #f2eeff); border-radius: 14px; padding: 16px 20px; }
    .success-next-title { font-weight: 700; font-size: 0.85rem; color: var(--text-2); margin-bottom: 12px; }
    .success-steps { display: flex; flex-direction: column; gap: 10px; }
    .success-step { display: flex; align-items: center; gap: 12px; text-align: left; }
    .success-step span {
      width: 26px; height: 26px; border-radius: 50%;
      background: linear-gradient(135deg, var(--brand), var(--brand-2));
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-size: 0.75rem; font-weight: 700; flex-shrink: 0;
    }
    .success-step p { font-size: 0.85rem; color: var(--text-2); margin: 0; }

    .signup-modal-inner { display: flex; flex-direction: column; gap: 20px; }
    .signup-head { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 8px; }
    .signup-head h2 { font-size: 1.5rem; font-weight: 800; color: var(--text); }
    .signup-head p  { font-size: 0.88rem; color: var(--text-3); }
    .auth-demo-warning {
      padding: 12px 14px;
      border-radius: 14px;
      border: 1px solid rgba(245, 158, 11, 0.32);
      background: linear-gradient(135deg, rgba(255, 251, 235, 0.96), rgba(254, 243, 199, 0.92));
      color: #7c4a03;
      font-size: 0.84rem;
      line-height: 1.45;
    }
    .auth-demo-warning strong { color: #92400e; }

    .step-inline-btn { font-size: 0.85rem; padding: 10px 20px; margin-top: 14px; }

    @keyframes pulseOnce {
      0%   { box-shadow: 0 0 0 0 rgba(102,32,207,0.4); }
      70%  { box-shadow: 0 0 0 16px rgba(102,32,207,0); }
      100% { box-shadow: 0 0 0 0 rgba(102,32,207,0); }
    }
    .pulse-once { animation: pulseOnce 0.6s ease; }

    @media (max-width: 540px) {
      .svpn-modal-backdrop { padding: 10px; }
      .svpn-modal { padding: 28px 18px; border-radius: 18px; }
      .plan-modal-actions { flex-direction: column; }
      .field-row { grid-template-columns: 1fr; }
      .card-form-head { flex-direction: column; align-items: flex-start; gap: 8px; }
    }
  `;
  document.head.appendChild(style);
})();
