import { renderElectionReferences } from "./components/election-references.mjs";
import { renderContactForm, contactTrigger } from "./components/contact-form.mjs";
import { renderPolicyPage } from "./components/policy-page.mjs";
import { renderSiteShell } from "./components/site-shell.mjs";
import { renderMeetingCard, renderMeetingStrip } from "./components/meeting-card.mjs";
import { renderStayInformed, renderUpdatesPage } from "./components/updates-page.mjs";
import { renderGovernmentPage } from "./components/government-page.mjs";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { nextMeeting, meetingNotice, retainedMeetingText, meetingCalendar, meetingSeriesCalendar } from "../src/meeting.mjs";
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
const supervisorMaps = JSON.parse(fs.readFileSync(path.join(root, "src/supervisor-maps.json")));
const governmentSource = JSON.parse(fs.readFileSync(path.join(root, "src/government.json")));
const constitutionSource = JSON.parse(
  fs.readFileSync(path.join(root, "src/constitution.json")),
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
const participation = JSON.parse(fs.readFileSync(path.join(root, "src/participation.json")));
const intake = JSON.parse(fs.readFileSync(path.join(root, "src/contact-intake.json")));
const policies = JSON.parse(fs.readFileSync(path.join(root, "src/policies.json")));
const meetingInfo = nextMeeting(content.meeting);
const stripMeeting = meetingNotice(content.meeting);
const meetingCalendarPath = `calendar/gage-county-gop-meeting-${meetingInfo.date}.ics`;
const allMeetingsPath = "calendar/gage-county-gop-meetings.ics";
const meetingLink = (className, label, canceled = meetingInfo.status === "canceled") => `<a${canceled ? " hidden" : ""} class="${className}" data-meeting-calendar href="./${meetingCalendarPath}" type="text/calendar" download="gage-county-gop-meeting-${meetingInfo.date}.ics">${label}</a>`;
const allMeetingsLink = (className) => `<a class="${className}" href="./${allMeetingsPath}" type="text/calendar" download="gage-county-gop-meetings.ics">Add monthly meetings <span aria-hidden="true">→</span></a>`;
const paragraphs = (slug) =>
  (pages.get(slug)?.text || []).map((t) => `<p>${h(t)}</p>`).join("");
function layout(file, title, body, description) {
  return renderSiteShell({ file, title, body, description, content, asset, assetVersion, brandVersion: assetsById.get(content.brand.markAsset).sourceSha256.slice(0, 12), h, meetingStrip: renderMeetingStrip(stripMeeting, h), contactForm: renderContactForm(intake, participation, content.email, h) });
}
const pageHero = (kicker, title, desc) =>
  `<section class="page-hero wrap"><p class="eyebrow">${kicker}</p><h1>${title}</h1><p class="lead">${desc}</p></section>`;
const meetingSchedule = `Meetings are held on the second Tuesday of each month at ${content.meeting.time} Central.`;
const meeting = renderMeetingCard(meetingInfo, { h, meetingLink, allMeetingsLink, schedule: meetingSchedule, retainedNotice: retainedMeetingText(meetingInfo, stripMeeting) });
const courthouse = assetsById.get("gage-county-courthouse-memorial-day-2012");
const donation = content.donation;
const donationBand = `<section class="donate-band" id="donate" aria-labelledby="donate-title"><div class="wrap donate-inner"><div><p class="eyebrow">Support the county party</p><h2 id="donate-title">Donate to the Gage County GOP.</h2><p>Support the work of the Gage County Republican Party.</p><div class="actions"><a class="button light" href="${h(donation.url)}">Donate with Givebutter</a></div><p class="donate-help">Scan the QR code or open our Givebutter campaign to choose a payment method.</p></div><figure class="donate-qr"><a href="${h(donation.url)}" aria-label="Donate to the Gage County GOP with Givebutter">${img(donation.qrAsset, "Givebutter donation QR code for the Gage County GOP")}</a><figcaption>Gage County GOP<br>Scan to donate with Givebutter</figcaption></figure></div></section>`;
const governmentLink = content.homeGovernmentLink;
const governmentBanner = `<section class="government-banner" aria-labelledby="government-banner-title"><a class="wrap government-banner-link" href="./${h(governmentLink.href)}"><div><h2 id="government-banner-title">${h(governmentLink.title)}</h2><p>${h(governmentLink.description)}</p></div><span class="government-banner-action">${h(governmentLink.action)}</span></a></section>`;
const home = `<section class="hero"><div class="hero-copy"><p class="eyebrow"><span class="red-line"></span> Gage County Republican Party</p><h1>Your county.<br>Your party.<br><em>Your connection.</em></h1><p>Come to a meeting, share your ideas, and find a way to take part in the Gage County Republican Party.</p><div class="actions"><a class="button" href="./events.html#meeting">Come to the next meeting <span aria-hidden="true">→</span></a><a class="text-link" href="./committees.html">Explore ways to help ${arrow}</a></div><div class="hero-note">New here? You’re welcome. No RSVP required.</div></div><figure class="hero-image">${img("gage-county-courthouse-memorial-day-2012", "The Gage County Courthouse in Beatrice, with American flags on the lawn.", "", true)}<figcaption><span>Gage County Courthouse, Beatrice</span><span class="photo-credit">Photo: <a href="${h(courthouse.sourceUrl)}">${h(courthouse.creator)}</a> / <a href="${h(courthouse.licenseUrl)}">${h(courthouse.license)}</a></span></figcaption></figure></section>
<section class="wrap section home-meeting" aria-labelledby="home-meeting-title"><div><p class="eyebrow">Join us</p><h2 id="home-meeting-title">Come as you are.<br>Start with a meeting.</h2><p class="body-copy">Meet the people behind the county party, hear what’s happening, and bring your questions and ideas.</p><p>Newcomers are welcome. You can attend without an invitation, RSVP, or existing membership.</p><a class="text-link" href="./events.html#meeting">Meeting details & directions ${arrow}</a></div>${meeting}</section>
<section class="quick-strip" aria-label="Quick access"><div class="quick-strip-inner">${content.homeQuickLinks.map((link, index) => `<a${index === 0 ? ' class="quick-featured"' : ""} href="./${h(link.href)}"><span class="quick-number">${String(index + 1).padStart(2, "0")}</span><span>${h(link.title)}<small>${h(link.description)}</small></span>${arrow}</a>`).join("")}</div></section>
<section class="wrap section home-community"><div class="section-heading"><div><p class="eyebrow">People. Places. Participation.</p><h2>A local organization.<br>A shared place to start.</h2></div><a class="text-link" href="./about.html">Meet the county party ${arrow}</a></div><p class="body-copy">From meetings to the fair booth and local parades, there are different ways to take part.</p><div class="photo-grid">${[
  ["2026-wilber-czech-festival-parade", "Gage County GOP float at the 2026 Wilber Czech Festival.", "2026 Wilber Czech Festival"],
  ["2026-county-convention-02", "People gathered at the 2026 county convention.", "2026 county convention"],
  ["2026-county-fair-booth", "Gage County GOP display at the 2026 county fair.", "2026 county fair booth"],
].map(([id,alt,caption]) => `<figure class="community-photo">${img(id,alt)}<figcaption>${caption}</figcaption></figure>`).join("")}</div><a class="text-link gallery-route" href="./events.html#gallery">See community photos ${arrow}</a></section>
${renderStayInformed(intake, h)}${governmentBanner}${donationBand}${renderElectionReferences(content.homeElectionReferences, content.partyReveal, h, arrow)}<section class="contact-band wrap"><div><p class="eyebrow">Questions or ideas?</p><h2>Start a conversation.</h2></div><a class="text-link" href="./contact.html">Contact the county party ${arrow}</a></section>`;
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
  `<section class="wrap section prose-grid"><div><p class="eyebrow">Our mission</p><h2>What the party is here to do.</h2></div><blockquote class="mission-statement">${paragraphs("vision")}</blockquote></section><section class="wrap section" id="leadership"><div class="section-heading"><div><p class="eyebrow">Leadership</p><h2>Meet the executive officers.</h2></div></div><div class="leader-grid">${leaders}</div></section><section class="soft-section"><div class="wrap section prose-grid"><div><p class="eyebrow">Our history</p><h2>Re-established in 2022.</h2></div><div class="prose">${content.history.map((text) => `<p>${h(text)}</p>`).join("")}</div></div></section><section class="wrap section"><p><a class="button" href="./committees.html">Explore ways to get involved ${arrow}</a></p><p class="eyebrow">How the party works</p><h2>Organization & governing documents.</h2><div class="resource-grid"><a href="./resources.html#organization"><h3>Party organization</h3><p>Governing committees, representation, and convention.</p>${arrow}</a><a href="./constitution.html"><h3>County constitution</h3><p>Read the governing document as text, with original scans linked below.</p>${arrow}</a><a href="./platform.html"><h3>Party platform</h3><p>Read the complete platform by topic.</p>${arrow}</a></div></section>`;
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
const events = pageHero("Meetings & events", "A place at the table.", "Come to a regular meeting, get to know the county party, and bring your questions and ideas.") +
  `<section class="wrap section event-meeting" id="meeting"><div><p class="eyebrow">New here?</p><h2>You’re welcome.</h2><p class="body-copy">Regular meetings are open to newcomers. You can attend without an invitation, RSVP, or existing membership.</p><h3>Finding the meeting</h3><p><span data-meeting-venue-summary>We meet at ${h(meetingInfo.venue)} in ${h(meetingInfo.city)}.</span></p><a class="text-link" data-meeting-directions href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(meetingInfo.location)}">Find the venue on a map ${arrow}</a><p class="calendar-note">Check this page for schedule changes, or <a href="./updates.html#add" ${contactTrigger("add", "", h)}>add your details for important notices</a>.</p><a class="text-link" href="./committees.html">Explore ways to take part ${arrow}</a></div>${meeting}</section><section class="soft-section" id="gallery"><div class="wrap section"><p class="eyebrow">Community events</p><h2>From the fair booth to the convention.</h2><p class="body-copy">Parades, county fairs, conventions, and gatherings across the community.</p><div class="gallery">${galleryIds.map((id, i) => `<figure><a href="${asset(id)}">${img(id, galleryNames[i])}</a><figcaption>${galleryNames[i]}</figcaption></figure>`).join("")}</div></div></section>`;
const constitution = constitutionSource.sourcePages.map((sourcePath) => {
  const source = data.assets.find((entry) => entry.path === sourcePath);
  if (!source || !assetsBySource.has(sourcePath))
    throw Error(`Missing constitution source: ${sourcePath}`);
  return source;
});
const resources = pageHero("Resources", "Find the reference you need.", "Party documents, organization information, and a guide to local government.") +
  `<section class="wrap section" id="documents"><p class="eyebrow">Party documents</p><div class="resource-grid"><a href="./platform.html"><h2>Platform</h2><p>Party positions, organized by topic.</p>${arrow}</a><a href="./constitution.html"><h2>Constitution</h2><p>The complete governing document, with original scans.</p>${arrow}</a><a href="./government.html"><h2>Local government</h2><p>County offices, local representatives, and who to contact.</p>${arrow}</a></div></section><section class="soft-section" id="organization"><div class="wrap section"><p class="eyebrow">Party organization</p><h2>How the party is organized.</h2><p class="body-copy">The constitution sets out the party’s governing procedures, officer elections, and delegate requirements.</p><p>Looking for ways to help? <a href="./committees.html">Explore involvement opportunities.</a></p><div class="disclosures">${[
  ["County committee", "The county committee manages party affairs and represents the county’s supervisor districts."],
  ["Executive committee", "The executive committee consists of the chair, vice chair, secretary, and treasurer."],
  ["County convention", "Read the constitution for convention procedures, delegate requirements, and officer elections."],
].map(([title,text]) => `<details><summary>${title}</summary><div class="prose"><p>${text}</p><a href="./constitution.html">Read the constitution</a></div></details>`).join("")}</div></div></section><section class="wrap section" id="election-references"><p class="eyebrow">Completed election cycle</p><h2>2026 election references.</h2><p class="body-copy">Reference materials from the completed 2026 election. Check official election sources for future election dates and requirements.</p><div class="resource-grid"><a href="./vote-2026/"><h3>2026 voter card</h3><p>Candidate references, print downloads, and offline saving.</p>${arrow}</a><a href="${content.partyReveal}"><h3>Party Reveal</h3><p>Explore candidate evidence and sources.</p>${arrow}</a><a href="./endorsements.html"><h3>Endorsement process</h3><p>How the county party’s endorsement process works.</p>${arrow}</a></div></section><section class="wrap section"><p class="eyebrow">Further reference</p><a class="text-link" href="https://ne.gop/">Nebraska Republican Party ${arrow}</a></section>`;
const opportunities = participation;
const committees = pageHero("Get involved", "Find your way to take part.", h(opportunities.intro)) +
  `<section class="wrap section"><div class="section-heading"><div><p class="eyebrow">Committee opportunities</p><h2>Find a team. Bring what you do well.</h2></div><a class="text-link" href="./events.html#meeting">Start with a meeting ${arrow}</a></div><p class="calendar-note">The interest form opens right here with the team name filled in. You can ask about helping without signing up for ongoing notices. <a href="./updates.html#interest">More about the contact form</a>.</p><div class="involvement-grid">${opportunities.ways.map((way) => `<article id="${h(way.id)}"><h3>${h(way.title)}</h3><p>${h(way.description)}</p><button type="button" class="text-link" ${contactTrigger("interest", way.title, h)} aria-label="Express interest in the ${h(way.title)}">I’m interested <span aria-hidden="true">→</span></button></article>`).join("")}</div></section><section class="soft-section"><div class="wrap section prose-grid"><div><p class="eyebrow">Not sure where to start?</p><h2>A conversation is a good start.</h2></div><div class="prose"><p>You don’t need to choose a team before getting in touch. Tell us about your interests and experience, and a member of the county party team can discuss where you might fit.</p><a class="button" href="./updates.html#interest" ${contactTrigger("interest", "", h)}>Express an interest ${arrow}</a><p class="calendar-note">You can also <a href="./contact.html">contact the party directly</a>.</p></div></div></section><section class="wrap section"><p class="eyebrow">Party organization</p><h2>Looking for the governing structure?</h2><p class="body-copy">The county committee, executive committee, and convention have formal roles described in the constitution.</p><a class="text-link" href="./resources.html#organization">Read the organization overview ${arrow}</a></section>`;
const platformText = pages.get("nebraska-platform").text;
const constitutionClause = (clause, index) =>
  `<li><div class="constitution-clause"><span class="clause-number" aria-hidden="true">${index + 1})</span><div><p>${clause.label ? `<strong>${h(clause.label)}</strong> ` : ""}${h(clause.text)}${clause.redacted ? ' <span class="redaction">[redacted in source]</span>.' : ""}</p>${clause.items ? `<ol class="subclauses${clause.itemStyle === "parenthesis" ? " parenthesis" : ""}" type="a">${clause.items.map((item) => `<li>${h(item)}</li>`).join("")}</ol>` : ""}${clause.after ? `<p>${h(clause.after)}</p>` : ""}</div></div></li>`;
const constitutionPage =
  pageHero(
    "Governing document",
    constitutionSource.title,
    "Read the constitution as text. Links to the five original scanned pages follow the transcription.",
  ) +
  `<section class="wrap section document-layout"><details class="topic-disclosure" open><summary>Jump to an article</summary><nav class="topic-nav" aria-label="Constitution articles">${constitutionSource.articles.map((article) => `<a href="#${article.id}">${h(article.heading)}</a>`).join("")}<a href="#source-pages">Original pages</a></nav></details><div class="constitution-text">${constitutionSource.articles.map((article) => `<section class="constitution-article" id="${article.id}"><h2>${h(article.heading)}</h2>${article.clauses ? `<ol class="constitution-clauses">${article.clauses.map(constitutionClause).join("")}</ol>` : article.paragraphs.map((paragraph) => `<p>${h(paragraph)}</p>`).join("")}</section>`).join("")}</div></section>` +
  `<section class="soft-section" id="source-pages"><div class="wrap section"><p class="eyebrow">Source documents</p><h2>Original scanned pages.</h2><p class="body-copy">The text above follows these five page images. The registered address is redacted in the original.</p><div class="document-grid">${constitution.map((source, i) => `<a href="./${source.path}">${img(assetsBySource.get(source.path).id, `Constitution, original page ${i + 1}`)}<span>Open original page ${i + 1} ${arrow}</span></a>`).join("")}</div></div></section>`;
let topics = [],
  intro = [],
  current;
for (const text of platformText.slice(1)) {
  if (text === text.toUpperCase() && text.length < 55) {
    current = {
      title: text,
      paragraphs: [],
    };
    topics.push(current);
  } else if (current) current.paragraphs.push(text);
  else intro.push(text);
}
const platform =
  pageHero(
    "Party documents",
    platformText[0],
    "Gage County Republican Party positions, organized by topic.",
  ) +
  `<section class="wrap section platform-layout"><details class="topic-disclosure" open><summary>Jump to a topic</summary><nav class="topic-nav" aria-label="Platform topics">${topics.map((t, i) => `<a href="#topic-${i}">${h(t.title)}</a>`).join("")}</nav></details><div class="prose">${intro.map((t) => `<p>${h(t)}</p>`).join("")}${topics.map((t, i) => `<section id="topic-${i}"><h2>${h(t.title)}</h2>${t.paragraphs.map((p) => `<p>${h(p)}</p>`).join("")}</section>`).join("")}</div></section>`;
const contact =
  pageHero(
    "Contact",
    "A direct line to the county party.",
    "Questions about meetings, the committee, or local party activities? Start here.",
  ) +
  `<section class="wrap section contact-layout"><div><p class="eyebrow">Email</p><h2>Let’s connect.</h2><a class="email-link" href="mailto:${content.email}">${content.email} ${arrow}</a><p class="body-copy">For information about the Gage County Republican Party, send an email or join us at the next meeting.</p><div class="link-list"><a href="${content.facebook}">Facebook group ${arrow}</a><a href="${content.instagram}">Instagram ${arrow}</a>${meetingLink("", 'Add this meeting to your calendar <span aria-hidden="true">→</span>')}${allMeetingsLink("")}<p class="calendar-note">${h(meetingSchedule)} Calendar imports are snapshots; <a href="./updates.html">sign up separately for important notices</a>.</p></div></div><div class="contact-aside"><p class="eyebrow">Ways to participate</p><h3>Bring your interests and experience.</h3><ul><li>Plan meetings, social events, and fundraisers.</li><li>Help with communications and social media.</li><li>Converse with representatives and candidates.</li><li>Learn about the county committee.</li></ul><a class="text-link" href="./committees.html">Explore ways to get involved ${arrow}</a><hr><h3>Important meeting notices</h3><p>Add or update your contact details for occasional, important county party notices.</p><a class="text-link" href="./updates.html#add" ${contactTrigger("add", "", h)}>Stay informed ${arrow}</a><hr><h3>Contribution questions</h3><p>Contact the party for contribution information.</p></div></section>`;
const endorsements =
  pageHero(
    "Party information",
    "About endorsements.",
    "Information about the county party’s endorsement process.",
  ) +
  `<section class="wrap section prose"><p class="notice">Contact the county party with questions about endorsements. Listing on the voter card does not imply endorsement.</p>${paragraphs("endorsements")}<a class="button" href="mailto:${content.email}">Ask about endorsements ${arrow}</a></section>`;
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
// Publish the initial event as a no-script fallback; the browser generates later dates.
fs.mkdirSync(path.join(out, "calendar"), { recursive: true });
fs.writeFileSync(path.join(out, meetingCalendarPath), meetingCalendar(meetingInfo, content.meeting.calendarUpdatedAt));
fs.writeFileSync(path.join(out, allMeetingsPath), meetingSeriesCalendar(content.meeting));

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
for (const name of ["style.css", "site.js", "meeting.mjs", "contact-form.js"])
  fs.copyFileSync(path.join(root, "src", name), path.join(out, name));
// The browser icon and masthead share the same registered mark.
fs.copyFileSync(path.join(root, assetsById.get(content.brand.markAsset).webPath), path.join(out, "favicon.svg"));
for (const [file, title, body] of [
  ["index.html", "Home", home],
  ["about.html", "About the party", about],
  ["events.html", "Meetings & events", events],
  ["resources.html", "Resources", resources],
  ["committees.html", opportunities.title, committees],
  ["government.html", governmentSource.title, renderGovernmentPage(governmentSource, { escapeHtml: h, pageHero, supervisorMaps, asset })],
  ["constitution.html", "County constitution", constitutionPage],
  ["platform.html", "Party platform", platform],
  ["contact.html", "Contact", contact],
  ["updates.html", "Meeting updates", renderUpdatesPage(intake, { h, pageHero, email: content.email })],
  ["endorsements.html", "Endorsements", endorsements],
  ["privacy.html", policies.privacy.title, renderPolicyPage(policies.privacy, { policies, pageHero, email: content.email, h })],
  ["accessibility.html", policies.accessibility.title, renderPolicyPage(policies.accessibility, { policies, pageHero, email: content.email, h })],
])
  fs.writeFileSync(path.join(out, file), layout(file, title, body, file === "government.html" ? "A guide to District 30 representation, Gage County supervisors, elected offices, and county services, with official contact links." : policies[file.replace(/\.html$/, "")]?.intro));
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
  "Built 13 website pages and voter card in dist/; source archive retained in repository.",
);
