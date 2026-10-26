import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
const root = path.resolve(import.meta.dirname, "..");
const out = path.join(root, "dist");
const assetVersion = (file) =>
  createHash("sha256")
    .update(fs.readFileSync(path.join(root, "src", file)))
    .digest("hex")
    .slice(0, 12);
const data = JSON.parse(
  fs.readFileSync(path.join(root, "source-snapshot/inventory.json")),
);
const content = JSON.parse(
  fs.readFileSync(path.join(root, "src/content.json")),
);
const { assets } = JSON.parse(
  fs.readFileSync(path.join(root, "src/assets.json")),
);
const assetsById = new Map(assets.map((entry) => [entry.id, entry]));
const assetsBySource = new Map(
  assets.map((entry) => [entry.sourcePath, entry]),
);
const pages = new Map(data.pages.map((p) => [p.slug, p]));
const h = (v) =>
  String(v)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
const asset = (id) => {
  const a = assetsById.get(id);
  if (!a) throw Error(`Missing asset ${id}`);
  return "./" + a.webPath;
};
const img = (id, alt, cls = "", eager = false) =>
  `<img src="${asset(id)}" alt="${h(assetsById.get(id)?.alt || alt)}" title="${h(assetsById.get(id)?.title || alt)}" class="${cls}" loading="${eager ? "eager" : "lazy"}" decoding="async">`;
const arrow = '<span aria-hidden="true">↗</span>';
const meetingCalendarPath = `calendar/gage-county-gop-meeting-${content.meeting.date}.ics`;
const paragraphs = (slug) =>
  (pages.get(slug)?.text || []).map((t) => `<p>${h(t)}</p>`).join("");
const nav = [
  ["index.html", "Home"],
  ["about.html", "About"],
  ["events.html", "Meetings & events"],
  ["resources.html", "Resources"],
  ["vote-2026/", "Voter card"],
  [content.partyReveal, "Party Reveal ↗"],
];
function layout(
  file,
  title,
  body,
  description = "Meetings, leadership, governing documents, and election resources from the Gage County Republican Party.",
) {
  const home = file === "index.html";
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><title>${h(title)} | Gage County GOP</title><meta name="description" content="${h(description)}"><meta name="theme-color" content="#142d36"><meta property="og:title" content="${h(title)} | Gage County GOP"><meta property="og:description" content="${h(description)}"><meta property="og:image" content="https://quattromani.github.io/gage-county-gop-website/${asset("gage-county-courthouse-beatrice").slice(2)}"><link rel="icon" href="./favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="./style.css?v=${assetVersion("style.css")}"><script src="./site.js?v=${assetVersion("site.js")}" defer></script></head><body><a class="skip" href="#main">Skip to content</a><div class="location-bar">Gage County, Nebraska<span>Gage County Republican Party</span></div><header class="site-header"><a class="brand" href="./index.html" aria-label="Gage County GOP home"><span class="brand-icon" aria-hidden="true">G</span><span>GAGE COUNTY <b>REPUBLICAN PARTY</b></span></a><details class="mobile-nav"><summary>Menu <span aria-hidden="true">☰</span></summary><nav aria-label="Mobile navigation">${nav.map(([url, label]) => `<a href="${url.startsWith("https") ? url : "./" + url}">${label}</a>`).join("")}<a href="./contact.html">Contact</a></nav></details><nav class="desktop-nav" aria-label="Main navigation">${nav
    .filter(([url]) => url !== "index.html")
    .map(
      ([url, label]) =>
        `<a ${file === url ? 'aria-current="page"' : ""} href="${url.startsWith("https") ? url : "./" + url}">${label}</a>`,
    )
    .join(
      "",
    )}</nav><a class="header-contact" href="./contact.html">Contact ${arrow}</a></header><main id="main">${body}</main><footer class="site-footer"><div class="footer-top"><a class="brand" href="./index.html"><span class="brand-icon" aria-hidden="true">G</span><span>GAGE COUNTY <b>REPUBLICAN PARTY</b></span></a><p>Gage County, Nebraska.<br>Party information. Local connections. Election resources.</p><a href="mailto:${content.email}">Email the county party ${arrow}</a></div><div class="footer-bottom"><span>Gage County Republican Party</span><div><a href="./resources.html">Resources</a><a href="./contact.html">Contact</a></div></div></footer></body></html>`;
}
const pageHero = (kicker, title, desc) =>
  `<section class="page-hero wrap"><p class="eyebrow">${kicker}</p><h1>${title}</h1><p class="lead">${desc}</p></section>`;
const meeting = `<article class="meeting-card"><p class="eyebrow">Meeting notice</p><div class="meeting-date"><span>NOV</span><strong>10</strong></div><div><h3>County GOP meeting</h3><p><time datetime="${content.meeting.dateTime}">${content.meeting.dateLabel} at ${content.meeting.time}</time><br> ${content.meeting.venue}<br>${content.meeting.city}</p></div><a class="text-link" href="./${meetingCalendarPath}" type="text/calendar">Add to calendar <span aria-hidden="true">→</span></a></article>`;
const home = `<section class="hero"><div class="hero-copy"><p class="eyebrow"><span class="red-line"></span> Gage County, Nebraska</p><h1>Your county.<br>Your party.<br><em>Your connection.</em></h1><p>Get to know the Gage County Republican Party. Meet our leaders, explore our events, and discover local resources.</p><div class="actions"><a class="button" href="./events.html">Meetings & events <span aria-hidden="true">→</span></a><a class="text-link" href="./about.html">Get to know us ${arrow}</a></div><div class="hero-note"><span aria-hidden="true">★</span> Local information. In one place.</div></div><figure class="hero-image">${img("gage-county-courthouse-beatrice", "The Gage County Courthouse in Beatrice, with American flags on the lawn.", "", true)}<figcaption>Gage County Courthouse <span>Beatrice, Nebraska</span></figcaption><div class="image-label" aria-hidden="true">GAGE<br>COUNTY<br><span>NEBRASKA</span></div></figure></section><section class="quick-strip" aria-label="Quick access"><a class="quick-featured" href="./vote-2026/"><span class="quick-number">01</span><span>2026 voter card<small>Candidates, dates & downloads</small></span>${arrow}</a><a href="${content.partyReveal}"><span class="quick-number">02</span><span>Party Reveal<small>Candidate evidence & sources</small></span>${arrow}</a><a href="./resources.html#constitution"><span class="quick-number">03</span><span>Party documents<small>Platform, constitution & organization</small></span>${arrow}</a></section><section class="wrap section home-intro"><div><p class="eyebrow">The county party</p><h2>A local organization.<br>A shared place to start.</h2><p class="body-copy">Learn about the party’s mission, meet its leadership, and see how the county organization works.</p><a class="text-link" href="./about.html">About the Gage County GOP ${arrow}</a></div>${meeting}</section><section class="election-band"><div class="wrap election-inner"><div><p class="eyebrow">Election resources / 2026</p><h2>Keep your voter card close.</h2><p>Browse the candidate reference, check voting dates, and save the card for offline use. Explore the underlying evidence through Party Reveal.</p><div class="actions"><a class="button light" href="./vote-2026/">Open the voter card <span aria-hidden="true">→</span></a><a class="text-link" href="${content.partyReveal}">Explore Party Reveal ${arrow}</a></div><p class="small">A party reference, not an official ballot. Inclusion does not imply endorsement.</p></div><a href="./vote-2026/" class="card-preview" aria-label="Open the 2026 Gage County GOP voter card"><div><span>GAGE COUNTY GOP</span><strong>2026</strong></div><h3>Candidate<br>reference card</h3><div class="sample-lines" aria-hidden="true"><i></i><i></i><i></i></div><span>Candidates · Voting dates · Downloads ${arrow}</span></a></div></section><section class="wrap section"><div class="section-heading"><div><p class="eyebrow">Around the county</p><h2>People. Places. Participation.</h2></div><a class="text-link" href="./events.html#gallery">See community photos ${arrow}</a></div><div class="photo-grid"><a class="photo-story" href="./events.html#gallery">${img("2026-wilber-czech-festival-parade", "Gage County GOP float at the 2026 Wilber Czech Festival.")}<span>In the community <b>Parades & local events ${arrow}</b></span></a><a class="photo-story" href="./events.html#gallery">${img("2026-county-convention-02", "People gathered in a hall at the 2026 Gage County Republican convention.")}<span>At the table <b>Meetings & convention ${arrow}</b></span></a><a class="photo-story" href="./events.html#gallery">${img("2026-county-fair-booth", "Gage County GOP display at the 2026 county fair.")}<span>Across Gage County <b>The county fair ${arrow}</b></span></a></div></section><section class="contact-band wrap"><div><p class="eyebrow">Questions or ideas?</p><h2>Start a conversation.</h2></div><a class="button" href="./contact.html">Contact the county party ${arrow}</a></section>`;
const leaders = content.leaders
  .map(
    (l) =>
      `<article class="leader">${img(l.image, l.name)}<p class="eyebrow">${l.role}</p><h3>${l.name}</h3></article>`,
  )
  .join("");
const about =
  pageHero(
    "About the party",
    "Rooted in Gage County.",
    "The mission, people, and history of the county Republican organization.",
  ) +
  `<section class="wrap section prose-grid"><div><p class="eyebrow">Our mission</p><h2>What the party is here to do.</h2></div><blockquote class="mission-statement" aria-label="Gage County Republican Party mission statement">${paragraphs("vision")}</blockquote></section><section class="wrap section" id="leadership"><div class="section-heading"><div><p class="eyebrow">Leadership</p><h2>Meet the executive officers.</h2></div></div><div class="leader-grid">${leaders}</div></section><section class="soft-section"><div class="wrap section prose-grid"><div><p class="eyebrow">Our history</p><h2>Re-established in 2022.</h2></div><div class="prose">${content.history.map((text) => `<p>${h(text)}</p>`).join("")}</div></div></section><section class="wrap section"><p class="eyebrow">How the party works</p><h2>Organization & governing documents.</h2><div class="resource-grid"><a href="./resources.html#organization"><h3>County committee</h3><p>Management, representation, and participation.</p>${arrow}</a><a href="./resources.html#constitution"><h3>County constitution</h3><p>The five-page governing document for the county party.</p>${arrow}</a><a href="./platform.html"><h3>Party platform</h3><p>Read the complete platform by topic.</p>${arrow}</a></div></section>`;
const galleryIds = [
  "2026-wilber-czech-festival-parade",
  "2026-county-convention-01",
  "2026-county-convention-02",
  "2026-county-fair-booth",
  "parade-gathering-01",
  "parade-float-01",
  "community-display-01",
  "homestead-parade-01",
  "2025-10-county-gop-meeting",
  "community-event-01",
  "community-gathering-01",
  "community-celebration-01",
  "county-fair-dunk-tank-01",
  "county-fair-dunk-tank-02",
  "barbecue-fundraiser-artwork",
  "2026-fundraiser-flyer",
];
const galleryNames = [
  "2026 Wilber Czech Festival",
  "2026 county convention",
  "2026 county convention",
  "2026 county fair booth",
  "Parade gathering",
  "Parade float",
  "Community display",
  "Homestead parade",
  "October 2025 meeting",
  "Community event",
  "Community gathering",
  "Community celebration",
  "County fair dunk tank",
  "County fair dunk tank",
  "Fundraiser artwork",
  "2026 fundraiser flyer",
];
const events =
  pageHero(
    "Meetings & events",
    "The county party, together.",
    "Meeting information and a photographic record of local activity.",
  ) +
  `<section class="wrap section meeting-detail" id="meeting"><div><p class="eyebrow">Next meeting</p><h2><time datetime="${content.meeting.dateTime}">${content.meeting.dateLabel}<br><em>${content.meeting.time}</em></time></h2></div><div><h3>${content.meeting.venue}</h3><p>${content.meeting.city}</p><a class="button" href="./${meetingCalendarPath}" type="text/calendar">Add to calendar ${arrow}</a></div></section><section class="soft-section" id="gallery"><div class="wrap section"><p class="eyebrow">Community events</p><h2>From the fair booth to the convention.</h2><p class="body-copy">Parades, county fairs, conventions, and gatherings across the community.</p><div class="gallery">${galleryIds.map((id, i) => `<figure><a href="${asset(id)}">${img(id, galleryNames[i])}</a><figcaption>${galleryNames[i]}</figcaption></figure>`).join("")}</div></div></section>`;
const constitution = data.assets
  .filter((a) => a.path?.includes("Costitution"))
  .sort((a, b) => a.path.match(/PG-(\d)/)[1] - b.path.match(/PG-(\d)/)[1]);
const resources =
  pageHero(
    "Resources",
    "Party resources.",
    "Party documents, organization information, and election references in one place.",
  ) +
  `<section class="wrap section"><div class="resource-grid"><a href="./vote-2026/"><p class="eyebrow">Election reference</p><h2>2026 voter card</h2><p>Candidate references, calendar links, print downloads, and offline saving.</p>${arrow}</a><a href="${content.partyReveal}"><p class="eyebrow">Research & evidence</p><h2>Party Reveal</h2><p>Explore candidate evidence and sources alongside the GOP voter card.</p>${arrow}</a><a href="./platform.html"><p class="eyebrow">Party positions</p><h2>The platform</h2><p>The full published county party platform, organized into readable topics.</p>${arrow}</a></div></section><section class="soft-section" id="constitution"><div class="wrap section"><p class="eyebrow">Governing document</p><h2>County GOP constitution.</h2><p class="body-copy">Read the five-page county party constitution. Select a page to open the full-size document.</p><div class="document-grid">${constitution.map((a, i) => `<a href="./${a.path}">${img(assetsBySource.get(a.path).id, `County GOP constitution, page ${i + 1}`)}<span>Open page ${i + 1} ${arrow}</span></a>`).join("")}</div></div></section><section class="wrap section" id="organization"><p class="eyebrow">Party organization</p><h2>Committees & convention.</h2><p class="body-copy">The constitution sets out the party’s governing procedures, officer elections, and delegate requirements.</p><div class="disclosures">${[
    [
      "County committee",
      "The county committee manages party affairs and represents the county’s supervisor districts.",
    ],
    [
      "Executive committee",
      "The executive committee consists of the chair, vice chair, secretary, and treasurer.",
    ],
    [
      "County convention",
      "Read the constitution for convention procedures, delegate requirements, and officer elections.",
    ],
  ]
    .map(
      ([title, text]) =>
        `<details><summary>${title}</summary><div class="prose"><p>${text}</p></div></details>`,
    )
    .join(
      "",
    )}</div></section><section class="wrap section"><p class="eyebrow">Further references</p><h2>More information.</h2><div class="link-list"><a href="https://ne.gop/">Nebraska Republican Party ${arrow}</a><a href="./endorsements.html">About the endorsement process ${arrow}</a></div></section>`;
const platformText = pages.get("nebraska-platform").text;
let topics = [],
  intro = [],
  current;
for (const text of platformText.slice(1)) {
  if (text === text.toUpperCase() && text.length < 55) {
    current = {
      title: text.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
      paragraphs: [],
    };
    topics.push(current);
  } else if (current) current.paragraphs.push(text);
  else intro.push(text);
}
const platform =
  pageHero(
    "Party documents",
    "The county party platform.",
    "Gage County Republican Party positions, organized by topic.",
  ) +
  `<section class="wrap section platform-layout"><nav class="topic-nav" aria-label="Platform topics">${topics.map((t, i) => `<a href="#topic-${i}">${h(t.title)}</a>`).join("")}</nav><div class="prose">${intro.map((t) => `<p>${h(t)}</p>`).join("")}${topics.map((t, i) => `<section id="topic-${i}"><h2>${h(t.title)}</h2>${t.paragraphs.map((p) => `<p>${h(p)}</p>`).join("")}</section>`).join("")}</div></section>`;
const contact =
  pageHero(
    "Contact",
    "A direct line to the county party.",
    "Questions about meetings, the committee, or local party activities? Start here.",
  ) +
  `<section class="wrap section contact-layout"><div><p class="eyebrow">Email</p><h2>Let’s connect.</h2><a class="email-link" href="mailto:${content.email}">${content.email} ${arrow}</a><p class="body-copy">For information about the Gage County Republican Party, send an email or join us at the next meeting.</p><div class="link-list"><a href="${content.facebook}">Facebook group ${arrow}</a><a href="${content.instagram}">Instagram ${arrow}</a><a href="./${meetingCalendarPath}" type="text/calendar">Add the meeting to your calendar <span aria-hidden="true">→</span></a></div></div><div class="contact-aside"><p class="eyebrow">Ways to participate</p><h3>Bring your interests and experience.</h3><ul><li>Plan meetings, social events, and fundraisers.</li><li>Help with communications and social media.</li><li>Converse with representatives and candidates.</li><li>Learn about the county committee.</li></ul><a class="text-link" href="./resources.html#organization">Learn how the committee works ${arrow}</a><hr><h3>Contribution questions</h3><p>Contact the party for contribution information.</p></div></section>`;
const endorsements =
  pageHero(
    "Party information",
    "About endorsements.",
    "Information about the county party’s endorsement process.",
  ) +
  `<section class="wrap section prose"><p class="notice">Contact the county party with questions about endorsements. Listing on the voter card does not imply endorsement.</p>${paragraphs("endorsements")}<a class="button" href="mailto:${content.email}">Ask about endorsements ${arrow}</a></section>`;
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
// Publish a portable event rather than opening an email or assuming an end time.
const calendarText = (value) =>
  String(value)
    .replaceAll("\\", "\\\\")
    .replaceAll("\n", "\\n")
    .replaceAll(",", "\\,")
    .replaceAll(";", "\\;");
const utcStamp = (value) =>
  new Date(value)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
const foldLine = (line) => {
  const chunks = [];
  let chunk = "";
  for (const character of line) {
    if (Buffer.byteLength(chunk + character) > 75) {
      chunks.push(chunk);
      chunk = " ";
    }
    chunk += character;
  }
  chunks.push(chunk);
  return chunks.join("\r\n");
};
const meetingCalendar =
  [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Gage County GOP//County Meetings//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:gage-county-gop-meeting-${content.meeting.date}@quattromani.github.io`,
    `DTSTAMP:${utcStamp(content.meeting.calendarUpdatedAt)}`,
    `DTSTART:${utcStamp(content.meeting.dateTime)}`,
    "SUMMARY:Gage County GOP meeting",
    `LOCATION:${calendarText(`${content.meeting.venue}, ${content.meeting.city}`)}`,
    `DESCRIPTION:${calendarText(`Gage County GOP meeting at ${content.meeting.venue}, ${content.meeting.city}. Starts at ${content.meeting.time} Central Time.`)}`,
    "URL:https://quattromani.github.io/gage-county-gop-website/events.html#meeting",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .map(foldLine)
    .join("\r\n") + "\r\n";
fs.mkdirSync(path.join(out, "calendar"), { recursive: true });
fs.writeFileSync(path.join(out, meetingCalendarPath), meetingCalendar);

fs.cpSync(path.join(root, "assets/web"), path.join(out, "assets/web"), {
  recursive: true,
  filter: (source) => !source.startsWith(path.join(root, "assets/web/archive")),
});
for (const page of constitution) {
  const destination = path.join(out, page.path);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(path.join(root, page.path), destination);
}
// Preserve already-published image URLs while new pages use descriptive paths.
for (const entry of assets) {
  if (!entry.legacyWebPath || entry.webPath.startsWith("assets/web/archive/"))
    continue;
  fs.copyFileSync(
    path.join(root, entry.webPath),
    path.join(out, entry.legacyWebPath),
  );
}
for (const name of ["style.css", "site.js", "favicon.svg"])
  fs.copyFileSync(path.join(root, "src", name), path.join(out, name));
for (const [file, title, body] of [
  ["index.html", "Home", home],
  ["about.html", "About the party", about],
  ["events.html", "Meetings & events", events],
  ["resources.html", "Resources", resources],
  ["platform.html", "Party platform", platform],
  ["contact.html", "Contact", contact],
  ["endorsements.html", "Endorsements", endorsements],
])
  fs.writeFileSync(path.join(out, file), layout(file, title, body));
fs.writeFileSync(
  path.join(out, "404.html"),
  layout(
    "404.html",
    "Page not found",
    pageHero(
      "404",
      "That page isn’t here.",
      "Find your way back to the county party website.",
    ) +
      '<section class="wrap section"><a class="button" href="./index.html">Go to the homepage →</a></section>',
  ),
);
fs.writeFileSync(path.join(out, ".nojekyll"), "");
execFileSync(
  process.execPath,
  [path.join(root, "vendor/voter-card/scripts/build-gop-web-card.mjs")],
  { stdio: "inherit" },
);
fs.cpSync(
  path.join(root, "vendor/voter-card/public/vote-2026"),
  path.join(out, "vote-2026"),
  { recursive: true },
);
// Preview-specific integration: retain upstream card behavior and add local navigation.
const cardFile = path.join(out, "vote-2026/index.html");
let card = fs.readFileSync(cardFile, "utf8");
card = card
  .replace(
    '<a class="site-link" href="https://www.gagecountygop.org/">gagecountygop.org</a>',
    '<a class="site-link" href="../index.html">Gage County GOP</a>',
  )
  .replace("<head>", '<head><meta name="robots" content="noindex, nofollow">')
  .replace(
    "<body>",
    '<body><nav aria-label="Website navigation" style="padding:14px 5%;background:#142d36;color:white;display:flex;flex-wrap:wrap;gap:24px"><a style="color:inherit" href="../index.html">← Gage County GOP</a><a style="color:inherit" href="https://partyreveal.com/">Party Reveal ↗</a></nav>',
  );
fs.writeFileSync(cardFile, card);
// Regenerate the card cache fingerprint after integration changes.
const swFile = path.join(out, "vote-2026/sw.js");
let sw = fs.readFileSync(swFile, "utf8");
const integrationHash = createHash("sha256")
  .update(card)
  .digest("hex")
  .slice(0, 12);
sw = sw.replace(
  /gage-gop-card-[a-f0-9]+/g,
  `gage-gop-card-preview-${integrationHash}`,
);
fs.writeFileSync(swFile, sw);
console.log(
  "Built 7 website pages and voter card in dist/; source archive retained in repository.",
);
