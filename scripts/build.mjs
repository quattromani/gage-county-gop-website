import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
const root = path.resolve(import.meta.dirname, "..");
const out = path.join(root, "dist");
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
const source = (slug) =>
  `<a class="source-link" href="./archive.html#${h(slug)}">Source record ${arrow}</a>`;
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
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><title>${h(title)} | Gage County GOP</title><meta name="description" content="${h(description)}"><meta name="theme-color" content="#142d36"><meta property="og:title" content="${h(title)} | Gage County GOP"><meta property="og:description" content="${h(description)}"><meta property="og:image" content="https://quattromani.github.io/gage-county-gop-website/${asset("gage-county-courthouse-beatrice").slice(2)}"><link rel="icon" href="./favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="./style.css"><script src="./site.js" defer></script></head><body><a class="skip" href="#main">Skip to content</a><div class="preview-bar">Website redesign preview <span>Gage County, Nebraska</span><a href="https://www.gagecountygop.org/">Current website ${arrow}</a></div><header class="site-header"><a class="brand" href="./index.html" aria-label="Gage County GOP home"><span class="brand-icon" aria-hidden="true">G</span><span>GAGE COUNTY <b>REPUBLICAN PARTY</b></span></a><details class="mobile-nav"><summary>Menu <span aria-hidden="true">☰</span></summary><nav aria-label="Mobile navigation">${nav.map(([url, label]) => `<a href="${url.startsWith("https") ? url : "./" + url}">${label}</a>`).join("")}<a href="./contact.html">Contact</a></nav></details><nav class="desktop-nav" aria-label="Main navigation">${nav
    .filter(([url]) => url !== "index.html")
    .map(
      ([url, label]) =>
        `<a ${file === url ? 'aria-current="page"' : ""} href="${url.startsWith("https") ? url : "./" + url}">${label}</a>`,
    )
    .join(
      "",
    )}</nav><a class="header-contact" href="./contact.html">Contact ${arrow}</a></header><main id="main">${body}</main><footer class="site-footer"><div class="footer-top"><a class="brand" href="./index.html"><span class="brand-icon" aria-hidden="true">G</span><span>GAGE COUNTY <b>REPUBLICAN PARTY</b></span></a><p>Gage County, Nebraska.<br>Party information. Local connections. Election resources.</p><a href="mailto:${content.email}">Email the county party ${arrow}</a></div><div class="footer-bottom"><span>Independent design preview · Source captured October 26, 2026</span><div><a href="./archive.html">Content archive</a><a href="https://github.com/quattromani/gage-county-gop-website">GitHub</a><a href="./contact.html">Contact</a></div></div></footer></body></html>`;
}
const pageHero = (kicker, title, desc) =>
  `<section class="page-hero wrap"><p class="eyebrow">${kicker}</p><h1>${title}</h1><p class="lead">${desc}</p></section>`;
const meeting = `<article class="meeting-card"><p class="eyebrow">Meeting notice</p><div class="meeting-date"><span>NOV</span><strong>10</strong></div><div><h3>County GOP meeting</h3><p>${content.meeting.time} <span aria-hidden="true">/</span> ${content.meeting.venue}<br>${content.meeting.city}</p></div><a class="text-link" href="./events.html#meeting">Meeting details <span aria-hidden="true">→</span></a><p class="meeting-caution">Source notice; confirm the date before attending.</p></article>`;
const home = `<section class="hero"><div class="hero-copy"><p class="eyebrow"><span class="red-line"></span> Gage County, Nebraska</p><h1>Your county.<br>Your party.<br><em>Your connection.</em></h1><p>Find the people, meetings, and resources of the Gage County Republican Party.</p><div class="actions"><a class="button" href="./events.html">Meetings & events <span aria-hidden="true">→</span></a><a class="text-link" href="./about.html">Get to know us ${arrow}</a></div><div class="hero-note"><span aria-hidden="true">★</span> Local information. In one place.</div></div><figure class="hero-image">${img("gage-county-courthouse-beatrice", "The Gage County Courthouse in Beatrice, with American flags on the lawn.", "", true)}<figcaption>Gage County Courthouse <span>Beatrice, Nebraska</span></figcaption><div class="image-label" aria-hidden="true">GAGE<br>COUNTY<br><span>NEBRASKA</span></div></figure></section><section class="quick-strip" aria-label="Quick access"><a href="./vote-2026/"><span class="quick-number">01</span><span>2026 voter card<small>Candidates, dates & downloads</small></span>${arrow}</a><a href="${content.partyReveal}"><span class="quick-number">02</span><span>Party Reveal<small>Candidate evidence & sources</small></span>${arrow}</a><a href="./resources.html#constitution"><span class="quick-number">03</span><span>Party documents<small>Platform, constitution & organization</small></span>${arrow}</a></section><section class="wrap section home-intro"><div><p class="eyebrow">The county party</p><h2>A local organization.<br>A shared place to start.</h2><p class="body-copy">Learn about the party’s mission, meet its leadership, and see how the county organization works.</p><a class="text-link" href="./about.html">About the Gage County GOP ${arrow}</a></div>${meeting}</section><section class="election-band"><div class="wrap election-inner"><div><p class="eyebrow">Election resources / 2026</p><h2>Keep your voter card close.</h2><p>Browse the candidate reference, check voting dates, and save the card for offline use. Explore the underlying evidence through Party Reveal.</p><div class="actions"><a class="button light" href="./vote-2026/">Open the voter card <span aria-hidden="true">→</span></a><a class="text-link" href="${content.partyReveal}">Explore Party Reveal ${arrow}</a></div><p class="small">A party reference, not an official ballot. Inclusion does not imply endorsement.</p></div><a href="./vote-2026/" class="card-preview" aria-label="Open the 2026 Gage County GOP voter card"><div><span>GAGE COUNTY GOP</span><strong>2026</strong></div><h3>Candidate<br>reference card</h3><div class="sample-lines" aria-hidden="true"><i></i><i></i><i></i></div><span>Candidates · Voting dates · Downloads ${arrow}</span></a></div></section><section class="wrap section"><div class="section-heading"><div><p class="eyebrow">Around the county</p><h2>People. Places. Participation.</h2></div><a class="text-link" href="./events.html#gallery">Explore the event archive ${arrow}</a></div><div class="photo-grid"><a class="photo-story" href="./events.html#gallery">${img("2026-wilber-czech-festival-parade", "Gage County GOP float at the 2026 Wilber Czech Festival.")}<span>In the community <b>Parades & local events ${arrow}</b></span></a><a class="photo-story" href="./events.html#gallery">${img("2026-county-convention-02", "People gathered in a hall at the 2026 Gage County Republican convention.")}<span>At the table <b>Meetings & convention ${arrow}</b></span></a><a class="photo-story" href="./events.html#gallery">${img("2026-county-fair-booth", "Gage County GOP display at the 2026 county fair.")}<span>Across Gage County <b>The county fair ${arrow}</b></span></a></div></section><section class="contact-band wrap"><div><p class="eyebrow">Questions or ideas?</p><h2>Start a conversation.</h2></div><a class="button" href="./contact.html">Contact the county party ${arrow}</a></section>`;
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
  `<section class="wrap section prose-grid"><div><p class="eyebrow">Our mission</p><h2>What the party is here to do.</h2></div><div class="prose">${paragraphs("vision")}${source("vision")}</div></section><section class="wrap section" id="leadership"><div class="section-heading"><div><p class="eyebrow">Leadership</p><h2>Meet the executive officers.</h2></div>${source("leadership")}</div><div class="leader-grid">${leaders}</div><p class="small">Officers as listed on the source leadership page, captured October 26, 2026.</p></section><section class="soft-section"><div class="wrap section prose-grid"><div><p class="eyebrow">Our history</p><h2>Re-established in 2022.</h2></div><div class="prose">${paragraphs("history")}${source("history")}</div></div></section><section class="wrap section"><p class="eyebrow">How the party works</p><h2>Organization & governing documents.</h2><div class="resource-grid"><a href="./resources.html#organization"><h3>County committee</h3><p>Management, representation, and participation.</p>${arrow}</a><a href="./resources.html#constitution"><h3>County constitution</h3><p>The five-page document published on the original website.</p>${arrow}</a><a href="./platform.html"><h3>Party platform</h3><p>Read the complete platform by topic.</p>${arrow}</a></div></section>`;
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
  `<section class="wrap section meeting-detail" id="meeting"><div><p class="eyebrow">Meeting notice from the source website</p><h2>${content.meeting.dateLabel}<br><em>${content.meeting.time}</em></h2></div><div><h3>${content.meeting.venue}</h3><p>${content.meeting.city}</p><p class="notice">${content.meeting.note}</p><a class="button" href="mailto:${content.email}?subject=County%20GOP%20meeting%20details">Confirm meeting details ${arrow}</a><p class="small">The events page also lists a second-Tuesday meeting schedule beginning July 14, 2026.</p>${source("home")}</div></section><section class="soft-section" id="gallery"><div class="wrap section"><p class="eyebrow">Community archive</p><h2>From the fair booth to the convention.</h2><p class="body-copy">Photos and artwork preserved from the original event pages. Labels follow source filenames and page context; uncertain dates are not assigned.</p><div class="gallery">${galleryIds.map((id, i) => `<figure><a href="${asset(id)}">${img(id, galleryNames[i])}</a><figcaption>${galleryNames[i]}</figcaption></figure>`).join("")}</div><a class="text-link" href="./archive.html#2025">Read original event reports ${arrow}</a></div></section>`;
const constitution = data.assets
  .filter((a) => a.path?.includes("Costitution"))
  .sort((a, b) => a.path.match(/PG-(\d)/)[1] - b.path.match(/PG-(\d)/)[1]);
const resources =
  pageHero(
    "Resources",
    "Find the source.",
    "Party documents, organization information, and election references in one place.",
  ) +
  `<section class="wrap section"><div class="resource-grid"><a href="./vote-2026/"><p class="eyebrow">Election reference</p><h2>2026 voter card</h2><p>The imported GOP publication, with candidate references, calendar links, print downloads, and offline saving.</p>${arrow}</a><a href="${content.partyReveal}"><p class="eyebrow">Research & evidence</p><h2>Party Reveal</h2><p>Explore candidate evidence and sources alongside the GOP voter card.</p>${arrow}</a><a href="./platform.html"><p class="eyebrow">Party positions</p><h2>The platform</h2><p>The full published county party platform, organized into readable topics.</p>${arrow}</a></div></section><section class="soft-section" id="constitution"><div class="wrap section"><p class="eyebrow">Governing document</p><h2>County GOP constitution.</h2><p class="body-copy">All five pages from the source website, preserved as published. These are document images; a verified accessible transcription remains to be prepared.</p><div class="document-grid">${constitution.map((a, i) => `<a href="./${a.path}">${img(assetsBySource.get(a.path).id, `County GOP constitution, page ${i + 1}`)}<span>Open page ${i + 1} ${arrow}</span></a>`).join("")}</div>${source("articles")}</div></section><section class="wrap section" id="organization"><p class="eyebrow">Party organization</p><h2>Committees & convention.</h2><p class="notice">The published summaries differ on how officers are elected. Read the source summaries alongside the constitution and confirm the governing procedure with the party.</p><div class="disclosures">${[
    ["new-page-1", "County committee & delegates"],
    ["organization", "Executive committee"],
    ["county-covention", "County convention"],
  ]
    .map(
      ([slug, title]) =>
        `<details><summary>${title}</summary><div class="prose">${paragraphs(slug)}${source(slug)}</div></details>`,
    )
    .join(
      "",
    )}</div></section><section class="wrap section"><p class="eyebrow">Further references</p><h2>More information.</h2><div class="link-list"><a href="https://ne.gop/">Nebraska Republican Party ${arrow}</a><a href="./endorsements.html">About the endorsement process ${arrow}</a><a href="./archive.html#state-offices">Original office listings & source archive ${arrow}</a></div><p class="small">The legacy office lists are retained as historical source material. Use the voter card and Party Reveal for the maintained election reference.</p></section>`;
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
    "The complete text published on the source website, presented by topic.",
  ) +
  `<section class="wrap section platform-layout"><nav class="topic-nav" aria-label="Platform topics">${topics.map((t, i) => `<a href="#topic-${i}">${h(t.title)}</a>`).join("")}</nav><div class="prose"><p class="notice">Party positions reproduced from the source website. Adoption date and version are not stated in the source.</p>${intro.map((t) => `<p>${h(t)}</p>`).join("")}${topics.map((t, i) => `<section id="topic-${i}"><h2>${h(t.title)}</h2>${t.paragraphs.map((p) => `<p>${h(p)}</p>`).join("")}</section>`).join("")}${source("nebraska-platform")}</div></section>`;
const contact =
  pageHero(
    "Contact",
    "A direct line to the county party.",
    "Questions about meetings, the committee, or local party activities? Start here.",
  ) +
  `<section class="wrap section contact-layout"><div><p class="eyebrow">Email</p><h2>Let’s connect.</h2><a class="email-link" href="mailto:${content.email}">${content.email} ${arrow}</a><p class="body-copy">For information about the Gage County Republican Party, send an email or confirm the next meeting details.</p><div class="link-list"><a href="${content.facebook}">Facebook group ${arrow}</a><a href="${content.instagram}">Instagram ${arrow}</a><a href="./events.html#meeting">Meeting information <span aria-hidden="true">→</span></a></div></div><div class="contact-aside"><p class="eyebrow">Ways to participate</p><h3>Bring your interests and experience.</h3><ul><li>Plan meetings, social events, and fundraisers.</li><li>Help with communications and social media.</li><li>Converse with representatives and candidates.</li><li>Learn about the county committee.</li></ul><a class="text-link" href="./resources.html#organization">Learn how the committee works ${arrow}</a>${source("contact")}<hr><h3>Contribution questions</h3><p>Contact the party for current contribution instructions. The original site’s donation page is unfinished; this preview does not collect payments.</p></div></section>`;
const endorsements =
  pageHero(
    "Party information",
    "About endorsements.",
    "Published information about the county party’s endorsement process.",
  ) +
  `<section class="wrap section prose"><p class="notice">This page describes the source website’s endorsement information. It is not a list of endorsed candidates. Listing on the voter card does not imply endorsement.</p>${paragraphs("endorsements")}<a class="button" href="mailto:${content.email}">Ask about endorsements ${arrow}</a>${source("endorsements")}</section>`;
const archive =
  pageHero(
    "Source archive",
    "Nothing lost in the redesign.",
    "Public source text, image assets, and provenance from the original website, captured October 26, 2026.",
  ) +
  `<section class="wrap section"><p class="notice">Historical source material, reproduced for review. Candidate lists may contain errors or outdated entries. Template donation text and testimonials are preserved here as evidence of the old site, not as factual claims by this preview.</p><label class="search-label" for="archive-search">Find a source page</label><input id="archive-search" type="search" placeholder="Search titles and source text…" data-archive-search><p data-search-status role="status"></p><div class="archive-list">${data.pages
    .filter(
      (p) =>
        !["root", "cart", "new-dropdown", "organization-1", "events"].includes(
          p.slug,
        ),
    )
    .map(
      (p) =>
        `<details id="${p.slug}" data-archive-entry><summary>${h(p.title?.split("—")[0].trim() || p.slug)} <span>/${p.slug}</span></summary><div class="prose"><p class="small">Source: <a href="${p.url}">${p.url}</a> · Captured ${data.captured}</p>${p.text?.map((t) => `<p>${h(t)}</p>`).join("") || "<p>This page contains images rather than readable body text.</p>"}${p.images
          ?.map((i) => {
            const a = data.assets.find((a) => a.url === i.url);
            return a
              ? `<a class="archive-image-link" href="./${a.path}">${img(assetsBySource.get(a.path).id, i.alt || `Source image from ${p.slug}`)}</a>`
              : "";
          })
          .join("")}</div></details>`,
    )
    .join(
      "",
    )}</div><p class="small">Duplicate routes /, /new-dropdown, /organization-1, and /events are retained in the repository inventory. The empty cart is also preserved there.</p><a class="text-link" href="https://github.com/quattromani/gage-county-gop-website/tree/main/source-snapshot">View the full source inventory ${arrow}</a></section>`;
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
fs.cpSync(path.join(root, "assets"), path.join(out, "assets"), {
  recursive: true,
});
// Preserve already-published image URLs while new pages use descriptive paths.
for (const entry of assets) {
  if (!entry.legacyWebPath) continue;
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
  ["archive.html", "Source archive", archive],
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
  .replace("<head>", '<head><meta name="robots" content="noindex, nofollow">')
  .replace(
    "<body>",
    '<body><nav aria-label="Website navigation" style="padding:14px 5%;background:#142d36;color:white;display:flex;flex-wrap:wrap;gap:24px"><a style="color:inherit" href="../index.html">← Gage County GOP</a><a style="color:inherit" href="https://partyreveal.com/">Party Reveal ↗</a></nav>',
  );
fs.writeFileSync(cardFile, card);
// Regenerate the card cache fingerprint after integration changes.
const swFile = path.join(out, "vote-2026/sw.js");
let sw = fs.readFileSync(swFile, "utf8");
const { createHash } = await import("node:crypto");
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
  "Built 8 website pages, source archive, and imported voter card in dist/.",
);
