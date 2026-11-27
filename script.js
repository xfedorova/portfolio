(() => {
  const header = document.querySelector("[data-header]");
  const identitySlot = document.querySelector(".header-identity-slot");
  const identity = document.querySelector(".header-identity");
  const openCvBtn = document.querySelector("[data-open-cv]");
  const cvDialog = document.querySelector("#cv-dialog");
  const closeCvControls = document.querySelectorAll("[data-close-cv]");
  const projects = document.querySelectorAll("[data-project]");
  const mobileMq = window.matchMedia("(max-width: 900px)");

  let lastFocus = null;
  let identityTop = 0;
  let identityWidth = 0;
  let identityLeft = 0;

  function clearFixedIdentity() {
    if (!identity) return;
    identity.classList.remove("is-fixed");
    header?.classList.remove("is-sticky");
    identity.style.width = "";
    identity.style.left = "";
    if (identitySlot) identitySlot.style.height = "";
  }

  function measureIdentity() {
    if (!identity || identity.classList.contains("is-fixed")) return;
    const rect = identity.getBoundingClientRect();
    identityTop = window.scrollY + rect.top;
    identityWidth = rect.width;
    identityLeft = rect.left;
  }

  function onScroll() {
    if (!identity || !header || !identitySlot) return;

    const stickAt = Math.max(identityTop - 24, 0);
    const shouldFix = window.scrollY > stickAt;

    if (shouldFix && !identity.classList.contains("is-fixed")) {
      measureIdentity();
      identitySlot.style.height = `${identity.offsetHeight}px`;
      identity.style.width = `${identityWidth}px`;
      identity.style.left = `${identityLeft}px`;
      identity.classList.add("is-fixed");
      header.classList.add("is-sticky");
    } else if (!shouldFix && identity.classList.contains("is-fixed")) {
      clearFixedIdentity();
    }
  }

  function setDetailsOpen(project, open) {
    const details = project.querySelector("[data-details]");
    const btn = project.querySelector("[data-toggle-details]");
    if (!details || !btn) return;

    const label = btn.querySelector("[data-details-label]");
    const icon = btn.querySelector("[data-details-icon]");

    details.classList.toggle("is-open", open);
    project.classList.toggle("is-expanded", open);
    btn.setAttribute("aria-expanded", String(open));
    if (label) label.textContent = open ? "Hide" : "Details";
    if (icon) {
      icon.src = open ? "assets/icons/minus.svg" : "assets/icons/plus.svg";
    }
  }

  projects.forEach((project) => {
    const details = project.querySelector("[data-details]");
    const btn = project.querySelector("[data-toggle-details]");
    if (!btn || !details) return;

    const initiallyOpen = btn.getAttribute("aria-expanded") === "true";
    details.classList.toggle("is-open", initiallyOpen);
    project.classList.toggle("is-expanded", initiallyOpen);

    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      setDetailsOpen(project, !expanded);
    });
  });

  function getFocusable(container) {
    return [...container.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    )].filter((el) => !el.hasAttribute("hidden") && el.offsetParent !== null);
  }

  function openCv() {
    if (!cvDialog) return;
    lastFocus = document.activeElement;
    cvDialog.hidden = false;
    document.body.classList.add("cv-open");
    const closeBtn = cvDialog.querySelector(".cv-dialog__close");
    (closeBtn || cvDialog).focus();
  }

  function closeCv() {
    if (!cvDialog || cvDialog.hidden) return;
    cvDialog.hidden = true;
    document.body.classList.remove("cv-open");
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  if (openCvBtn) openCvBtn.addEventListener("click", openCv);
  closeCvControls.forEach((el) => el.addEventListener("click", closeCv));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeCv();

    if (event.key === "Tab" && cvDialog && !cvDialog.hidden) {
      const focusable = getFocusable(cvDialog);
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    clearFixedIdentity();
    measureIdentity();
    onScroll();
  });
  mobileMq.addEventListener("change", () => {
    clearFixedIdentity();
    measureIdentity();
    onScroll();
  });

  measureIdentity();
  onScroll();
})();
