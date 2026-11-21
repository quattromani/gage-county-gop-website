document.addEventListener("keydown", (event) => {
  const menu = document.querySelector(".mobile-nav");
  if (event.key === "Escape" && menu?.open) {
    menu.open = false;
    menu.querySelector("summary").focus();
  }
});

document.querySelectorAll(".mobile-nav nav a").forEach((link) => {
  link.addEventListener("click", () => { link.closest("details").open = false; });
});

const meetingConfig = JSON.parse(document.body.dataset.meetingConfig);
if (document.querySelector("[data-meeting-strip]")) {
  import(`./meeting.mjs?v=${document.body.dataset.meetingScriptVersion}`).then(({ nextMeeting, meetingNotice, meetingCalendar, meetingStatusLabel, retainedMeetingText }) => {
    let activeState;
    let calendarUrl;
    function refreshMeeting() {
      const meeting = nextMeeting(meetingConfig);
      const notice = meetingNotice(meetingConfig);
      const state = JSON.stringify([meeting, notice]);
      if (state === activeState) return;
      activeState = state;
      const nextUrl = URL.createObjectURL(new Blob([meetingCalendar(meeting, meetingConfig.calendarUpdatedAt)], { type: "text/calendar;charset=utf-8" }));
      document.querySelectorAll("[data-next-meeting]").forEach((card) => {
        card.querySelector("[data-meeting-month]").textContent = meeting.monthLabel;
        card.querySelector("[data-meeting-day]").textContent = meeting.dayLabel;
        card.querySelector("[data-meeting-status]").textContent = meetingStatusLabel(meeting);
        const time = card.querySelector("[data-meeting-time]");
        time.dateTime = meeting.dateTime;
        time.textContent = `${meeting.dateLabel} at ${meeting.time}`;
        card.querySelector("[data-meeting-location]").textContent = meeting.venue;
        card.querySelector("[data-meeting-city]").textContent = meeting.city;
        const change = card.querySelector("[data-meeting-change]");
        change.textContent = meeting.message;
        change.hidden = !meeting.message;
        const retained = card.querySelector("[data-meeting-retained]");
        retained.textContent = retainedMeetingText(meeting, notice);
        retained.hidden = !retained.textContent;
      });
      document.querySelectorAll("[data-meeting-strip]").forEach((strip) => {
        strip.classList.toggle("has-meeting-change", notice.status !== "scheduled");
        strip.querySelector("[data-meeting-strip-status]").textContent = meetingStatusLabel(notice);
        strip.querySelector("[data-meeting-strip-summary]").textContent = `${notice.shortDateLabel} · ${notice.time} · ${notice.venue}`;
      });
      document.querySelectorAll("[data-meeting-calendar]").forEach((link) => {
        link.href = nextUrl;
        link.download = `gage-county-gop-meeting-${meeting.nominalDate}.ics`;
        link.hidden = meeting.status === "canceled";
      });
      document.querySelectorAll("[data-meeting-venue-summary]").forEach((summary) => { summary.textContent = `We meet at ${meeting.venue} in ${meeting.city}.`; });
      document.querySelectorAll("[data-meeting-directions]").forEach((link) => {
        link.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(meeting.location)}`;
      });
      if (calendarUrl) URL.revokeObjectURL(calendarUrl);
      calendarUrl = nextUrl;
    }
    refreshMeeting();
    setInterval(refreshMeeting, 60_000);
    document.addEventListener("visibilitychange", refreshMeeting);
    document.addEventListener("click", (event) => { if (event.target.closest("[data-meeting-calendar]")) refreshMeeting(); });
  });
}

const documentDesktop = window.matchMedia("(min-width: 901px)");
const topicDisclosures = [...document.querySelectorAll(".topic-disclosure")];
function setDocumentNavigation() { topicDisclosures.forEach((disclosure) => { disclosure.open = documentDesktop.matches; }); }
setDocumentNavigation();
documentDesktop.addEventListener("change", setDocumentNavigation);
topicDisclosures.forEach((disclosure) => {
  disclosure.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => { if (!documentDesktop.matches) disclosure.open = false; }));
});
let printDisclosureStates;
window.addEventListener("beforeprint", () => { printDisclosureStates = topicDisclosures.map((disclosure) => disclosure.open); topicDisclosures.forEach((disclosure) => { disclosure.open = true; }); });
window.addEventListener("afterprint", () => { topicDisclosures.forEach((disclosure, index) => { disclosure.open = printDisclosureStates?.[index] ?? documentDesktop.matches; }); });

document.querySelectorAll(".topic-nav").forEach((topicNav) => {
  const desktop = window.matchMedia("(min-width: 901px)");
  const topics = [...topicNav.querySelectorAll('a[href^="#"]')]
    .map((link) => ({ link, section: document.getElementById(link.hash.slice(1)) }))
    .filter(({ section }) => section);
  let pending = false;

  function updateCurrentTopic() {
    pending = false;
    let current;
    if (desktop.matches) {
      // Match the native jump-link inset so clicks and scrolling agree.
      const readingLine = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      for (const topic of topics) {
        const sectionInset = parseFloat(getComputedStyle(topic.section).scrollMarginTop) || 0;
        if (topic.section.getBoundingClientRect().top > readingLine + sectionInset + 1) break;
        current = topic;
      }
    }
    for (const topic of topics) {
      if (topic === current) topic.link.setAttribute("aria-current", "location");
      else topic.link.removeAttribute("aria-current");
    }
  }

  function scheduleUpdate() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(updateCurrentTopic);
  }

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  window.addEventListener("pageshow", scheduleUpdate);
  window.addEventListener("load", scheduleUpdate);
  desktop.addEventListener("change", scheduleUpdate);
  updateCurrentTopic();
});

const supervisorExplorer = document.querySelector("[data-supervisor-explorer]");
if (supervisorExplorer) {
  const cards = [...document.querySelectorAll("[data-supervisor]")];
  const districtLinks = [...supervisorExplorer.querySelectorAll("[data-map-district]")];
  const selection = supervisorExplorer.querySelector("[data-district-selection]");
  const status = supervisorExplorer.querySelector("[data-district-status]");
  const initialSelection = selection.innerHTML;
  let selectedDistrict;

  function previewDistrict(district) {
    cards.forEach((card) => card.classList.toggle("is-highlighted", card.dataset.supervisor === district));
    districtLinks.forEach((link) => {
      link.classList.toggle("is-highlighted", link.dataset.mapDistrict === district);
      if (link.dataset.mapDistrict === selectedDistrict) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
    const card = cards.find((entry) => entry.dataset.supervisor === district);
    if (!card) {
      selection.innerHTML = initialSelection;
      return;
    }
    selection.replaceChildren(...[...card.children].map((child) => child.cloneNode(true)));
    const details = document.createElement("a");
    details.href = `#${card.id}`;
    details.textContent = "View supervisor details ↓";
    selection.append(details);
  }

  districtLinks.forEach((link) => {
    link.addEventListener("pointerenter", (event) => {
      if (event.pointerType !== "touch") previewDistrict(link.dataset.mapDistrict);
    });
    link.addEventListener("pointerleave", () => previewDistrict(selectedDistrict));
    link.addEventListener("focus", () => previewDistrict(link.dataset.mapDistrict));
    link.addEventListener("blur", () => previewDistrict(selectedDistrict));
    link.addEventListener("click", (event) => {
      event.preventDefault();
      selectedDistrict = link.dataset.mapDistrict;
      const visibleMap = supervisorExplorer.querySelector('[data-district-map]:not([hidden])');
      if (!visibleMap.querySelector(`[data-map-district="${selectedDistrict}"]`)) {
        showMap(selectedDistrict === "1" || selectedDistrict === "6" ? "county" : "beatrice");
      }
      previewDistrict(selectedDistrict);
      if (window.matchMedia("(max-width: 700px)").matches) selection.scrollIntoView({ block: "nearest", behavior: "auto" });
      status.textContent = `Selected District ${selectedDistrict}: ${cards.find((card) => card.dataset.supervisor === selectedDistrict).querySelector("h3").textContent}.`;
    });
  });

  const viewButtons = [...supervisorExplorer.querySelectorAll("[data-map-view]")];
  let zoom = 1;
  const zoomIn = supervisorExplorer.querySelector("[data-map-zoom-in]");
  const zoomOut = supervisorExplorer.querySelector("[data-map-zoom-out]");
  const mapScale = supervisorExplorer.querySelector("[data-map-scale]");
  function setZoom(value) {
    zoom = value;
    supervisorExplorer.querySelectorAll(".district-map svg").forEach((svg) => { svg.style.width = `${value * 100}%`; });
    supervisorExplorer.querySelectorAll(".district-map-viewport").forEach((viewport) => { viewport.scrollTop = 0; viewport.scrollLeft = 0; });
    mapScale.textContent = `${value * 100}%`;
    zoomOut.disabled = value === 1;
    zoomIn.disabled = value === 3;
  }
  supervisorExplorer.querySelector("[data-map-zoom]").hidden = false;
  zoomIn.addEventListener("click", () => setZoom(Math.min(3, zoom + .5)));
  zoomOut.addEventListener("click", () => setZoom(Math.max(1, zoom - .5)));
  function showMap(id) {
    setZoom(1);
    supervisorExplorer.querySelectorAll("[data-district-map]").forEach((map) => { map.hidden = map.dataset.districtMap !== id; });
    viewButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.mapView === id)));
  }
  supervisorExplorer.querySelector("[data-map-switch]").hidden = false;
  supervisorExplorer.querySelectorAll(".district-map figcaption").forEach((caption) => { caption.hidden = true; });
  viewButtons.forEach((button) => button.addEventListener("click", () => showMap(button.dataset.mapView)));
  supervisorExplorer.querySelector("[data-map-detail]").addEventListener("click", (event) => {
    event.preventDefault();
    showMap("beatrice");
    viewButtons.find((button) => button.dataset.mapView === "beatrice").focus();
  });
  showMap("county");
}
