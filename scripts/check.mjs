import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import vm from "node:vm";
import { renderMeetingCard, renderMeetingStrip } from "./components/meeting-card.mjs";
import { nextMeeting, meetingNotice, retainedMeetingText, meetingCalendar, meetingSeriesCalendar, validateMeetingConfig } from "../src/meeting.mjs";
const root = path.resolve(import.meta.dirname, ".."),
  dist = path.join(root, "dist");
const read = (file) => fs.readFileSync(path.join(dist, file), "utf8");
const currentMeeting = nextMeeting(JSON.parse(fs.readFileSync(path.join(root, "src/content.json"))).meeting);
function files(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) =>
      e.isDirectory()
        ? files(path.join(dir, e.name))
        : [path.join(dir, e.name)],
    );
}
const htmlFiles = files(dist).filter((f) => f.endsWith(".html"));
const h = (v) =>
  String(v)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
test("all local page links, assets, and fragment destinations resolve under a repository base path", () => {
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");
    for (const m of html.matchAll(/(?:href|src)="([^"<>]+)"/g)) {
      const url = m[1];
      if (/^(https?:|mailto:|tel:|webcal:|data:)/.test(url)) continue;
      assert.ok(
        !url.startsWith("/"),
        "root-relative path breaks Pages: " + url,
      );
      const [relative, fragment] = url.split("#");
      let dest = path.resolve(
        path.dirname(file),
        decodeURIComponent(relative.split("?")[0] || path.basename(file)),
      );
      if (fs.existsSync(dest) && fs.statSync(dest).isDirectory())
        dest = path.join(dest, "index.html");
      assert.ok(fs.existsSync(dest), `${path.relative(dist, file)}: ${url}`);
      if (fragment && dest.endsWith(".html"))
        assert.ok(
          fs
            .readFileSync(dest, "utf8")
            .includes(`id="${decodeURIComponent(fragment)}"`),
          `${dest} lacks ${fragment}`,
        );
    }
  }
});
test("source inventory is complete and original asset hashes remain intact", () => {
  const data = JSON.parse(
    fs.readFileSync(path.join(root, "source-snapshot/inventory.json")),
  );
  assert.equal(data.pages.length, 24);
  assert.equal(data.assets.length, 36);
  for (const p of data.pages) {
    assert.ok(!p.error, p.url);
    assert.ok(
      fs.existsSync(path.join(root, "source-snapshot", p.slug + ".html")),
    );
  }
  for (const a of data.assets) {
    assert.ok(!a.error, a.url);
    assert.equal(
      crypto
        .createHash("sha256")
        .update(fs.readFileSync(path.join(root, a.path)))
        .digest("hex"),
      a.sha256,
    );
  }
  const { assets } = JSON.parse(
    fs.readFileSync(path.join(root, "src/assets.json")),
  );
  assert.equal(new Set(assets.map((a) => a.id)).size, assets.length);
  assert.equal(new Set(assets.map((a) => a.webPath)).size, assets.length);
  for (const entry of assets) {
    assert.match(entry.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.match(
      entry.webPath,
      /^assets\/web\/(people|places|events|documents|brand|archive)\/[a-z0-9]+(?:-[a-z0-9]+)*\.(?:webp|png|svg)$/,
    );
    assert.equal(
      crypto
        .createHash("sha256")
        .update(fs.readFileSync(path.join(root, entry.sourcePath)))
        .digest("hex"),
      entry.sourceSha256,
    );
    if (entry.webPath.startsWith("assets/web/archive/")) {
      assert.ok(!fs.existsSync(path.join(dist, entry.webPath)), entry.id);
      continue;
    }
    assert.ok(fs.existsSync(path.join(dist, entry.webPath)), entry.id);
    if (entry.legacyWebPath)
      assert.deepEqual(
        fs.readFileSync(path.join(dist, entry.legacyWebPath)),
        fs.readFileSync(path.join(dist, entry.webPath)),
      );
  }
  for (const original of data.assets) {
    assert.ok(
      assets.some((entry) => entry.sourcePath === original.path),
      original.path,
    );
  }
});
test("platform wording remains faithful to preserved source text", () => {
  const data = JSON.parse(
    fs.readFileSync(path.join(root, "source-snapshot/inventory.json")),
  );
  for (const text of data.pages
    .find((p) => p.slug === "nebraska-platform")
    .text.slice(1)
    .filter((t) => t !== t.toUpperCase()))
    assert.ok(read("platform.html").includes(h(text)));
  assert.match(read("platform.html"), /<h1>GAGE COUNTY GOP PLATFORM<\/h1>/);
});
test("constitution transcription renders every source unit and retains the five original pages", () => {
  const source = JSON.parse(fs.readFileSync(path.join(root, "src/constitution.json"), "utf8"));
  const html = read("constitution.html");
  assert.equal(source.articles.length, 7);
  assert.equal(source.sourcePages.length, 5);
  assert.ok(html.includes(`<h1>${h(source.title)}</h1>`));
  for (const article of source.articles) {
    assert.ok(html.includes(`<h2>${h(article.heading)}</h2>`), article.id);
    for (const clause of article.clauses || []) {
      for (const unit of [clause.label, clause.text, clause.after, ...(clause.items || [])].filter(Boolean))
        assert.ok(html.includes(h(unit)), `${article.id}: ${unit.slice(0, 60)}`);
    }
    for (const paragraph of article.paragraphs || [])
      assert.ok(html.includes(h(paragraph)), article.id);
  }
  for (const [index, sourcePath] of source.sourcePages.entries()) {
    assert.ok(html.includes(`href="./${sourcePath}"`), sourcePath);
    assert.deepEqual(fs.readFileSync(path.join(dist, sourcePath)), fs.readFileSync(path.join(root, sourcePath)));
    assert.ok(html.includes(`Open original page ${index + 1}`));
  }
  assert.match(html, /\[redacted in source\]/);
  assert.match(read("resources.html"), /href="\.\/constitution\.html"/);
});
test("every website page has landmarks, one h1, language, and image alternatives", () => {
  for (const file of htmlFiles.filter((f) => !f.includes("vote-2026"))) {
    const html = fs.readFileSync(file, "utf8");
    assert.equal((html.match(/<h1>/g) || []).length, 1);
    assert.match(html, /<html\b[^>]*\blang="en"[^>]*>/);
    assert.match(html, /<main id="main">/);
    assert.doesNotMatch(html, /[↗→↓↑←]/, "Use vector link icons, not platform-dependent arrow characters");
    for (const icon of html.matchAll(/<svg\b[^>]*aria-hidden="true"[^>]*>/g)) {
      assert.match(icon[0], /focusable="false"/);
      assert.match(icon[0], /stroke="currentColor"/);
    }
    for (const image of html.matchAll(/<img\b[^>]+>/g))
      assert.match(image[0], /alt="[^"]*"/);

  }
});
test("voter card renders exactly the imported inclusion set and keeps judicial retention separate", () => {
  const data = JSON.parse(
    fs.readFileSync(
      path.join(
        root,
        "vendor/voter-card/src/data/elections/2026/election-directory.json",
      ),
    ),
  );
  const aff = new Map(data.affiliations.map((a) => [a.affiliationId, a]));
  const expected = data.candidacies
    .filter(
      (r) =>
        r.electionStageGroup === "current-general-election" &&
        aff.get(r.affiliationId).label === "Republican" &&
        aff.get(r.affiliationId).sourceId,
    )
    .map((r) => r.candidacyId)
    .sort();
  const html = read("vote-2026/index.html");
  assert.deepEqual(
    [...html.matchAll(/data-candidacy="([^"]+)"/g)].map((m) => m[1]).sort(),
    expected,
  );
  assert.match(html, /id="judicial-retention"/);
  assert.match(html, /not an official ballot/);
  assert.ok(!html.includes('type="checkbox"'));
  assert.match(html, /href="\.\.\/index.html"/);
  assert.match(html, /gage-county-gop-website\/vote-2026\/calendar/);
});
test("card downloads and calendars retain upstream bytes and all five milestones", () => {
  for (const [src, dest] of [
    ["gage-county-gop-2026-mobile-card.pdf", "candidate-card.pdf"],
    ["gage-county-gop-2026-mobile-card.png", "candidate-card.png"],
    ["gage-county-gop-2026-candidate-flyer.pdf", "print-flyer.pdf"],
  ])
    assert.deepEqual(
      fs.readFileSync(path.join(root, "vendor/voter-card/output/pdf", src)),
      fs.readFileSync(path.join(dist, "vote-2026/assets", dest)),
    );
  const ics = read("vote-2026/calendar/all-dates.ics");
  assert.equal((ics.match(/BEGIN:VEVENT/g) || []).length, 5);
  assert.ok(!ics.replaceAll("\r\n", "").includes("\n"));
  assert.ok(!fs.existsSync(path.join(dist, "sw.js")));
});
test("card offline worker handles save, offline retrieval, and scope boundaries", async () => {
  const handlers = {},
    cache = new Map();
  let online = true;
  const scope = "https://example.com/gage-county-gop-website/vote-2026/";
  const norm = (k) => (typeof k === "string" ? k : k.url);
  const caches = {
    keys: async () => [...cache.keys()],
    delete: async (k) => cache.delete(k),
    open: async (key) => {
      if (!cache.has(key)) cache.set(key, new Map());
      const entries = cache.get(key);
      return {
        match: async (k) => entries.get(norm(k))?.clone(),
        addAll: async (requests) => {
          for (const req of requests)
            entries.set(req.url, new Response("saved:" + req.url));
        },
      };
    },
  };
  const self = {
    registration: { scope },
    clients: { claim: async () => {} },
    skipWaiting() {},
    addEventListener: (n, fn) => (handlers[n] = fn),
  };
  vm.runInNewContext(read("vote-2026/sw.js"), {
    self,
    caches,
    URL,
    Request,
    Response,
    fetch: async () => {
      if (!online) throw Error("offline");
      return new Response("network");
    },
  });
  let pending, result;
  handlers.message({
    data: { type: "SAVE" },
    ports: [{ postMessage: (r) => (result = r) }],
    waitUntil: (p) => (pending = p),
  });
  await pending;
  assert.ok(result);
  online = false;
  let response;
  handlers.fetch({
    request: { url: scope, method: "GET", mode: "navigate" },
    respondWith: (p) => (response = p),
  });
  assert.ok(response);
  assert.match(await (await response).text(), /saved:/);
  let intercepted = false;
  handlers.fetch({
    request: {
      url: "https://example.com/gage-county-gop-website/about.html",
      method: "GET",
      mode: "navigate",
    },
    respondWith: () => (intercepted = true),
  });
  assert.equal(intercepted, false);
});
test("public build excludes source archive and migration language, with recurring meeting details", () => {
  assert.ok(!fs.existsSync(path.join(dist, "archive.html")));
  assert.ok(!fs.existsSync(path.join(dist, "source-snapshot")));
  assert.ok(!fs.existsSync(path.join(dist, "_brand-review")));
  assert.ok(!fs.existsSync(path.join(dist, "assets/web/archive")));
  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");
    assert.doesNotMatch(
      html,
      /archive\.html|source website|Current website|Source record|Source notice|Source captured|Website redesign preview|source leadership page|legacy office lists|imported GOP publication/i,
      file,
    );
    if (!file.endsWith("platform.html"))
      assert.doesNotMatch(
        html,
        /href="https?:\/\/(?:www\.)?gagecountygop\.org(?:\/|")/i,
        file,
      );
  }
  for (const file of ["index.html", "events.html"]) {
    assert.ok(read(file).includes(currentMeeting.dateLabel));
    assert.ok(read(file).includes(`datetime="${currentMeeting.dateTime}"`));
    assert.doesNotMatch(
      read(file),
      /confirm the date|does not specify a year/i,
    );
  }
});

test("meeting actions open a portable calendar event at the confirmed Central time", () => {
  const filename = `gage-county-gop-meeting-${currentMeeting.date}.ics`;
  const link = `./calendar/${filename}`;
  for (const name of ["index.html", "events.html", "contact.html"]) {
    assert.ok(read(name).includes(`href="${link}" type="text/calendar" download="${filename}"`), name);
    assert.doesNotMatch(
      read(name),
      /mailto:[^"]+subject=County%20GOP%20meeting/,
    );
  }
  const calendar = read(link.slice(2));
  assert.equal((calendar.match(/BEGIN:VEVENT/g) || []).length, 1);
  assert.ok(calendar.includes(`DTSTART:${new Date(currentMeeting.dateTime).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z")}\r\n`));
  assert.match(calendar, /SUMMARY:Gage County GOP meeting/);
  assert.match(
    calendar,
    /LOCATION:402 Sports Bar & Grill\\, Beatrice\\, Nebraska/,
  );
  assert.doesNotMatch(calendar, /DTEND:|DURATION:|ATTENDEE:|ORGANIZER:/);
  assert.ok(!calendar.replaceAll("\r\n", "").includes("\n"));
  for (const line of calendar.split("\r\n"))
    assert.ok(Buffer.byteLength(line) <= 75);
  const unfolded = calendar.replaceAll("\r\n ", "");
  assert.match(unfolded, /X-WR-CALNAME:Gage County GOP Meetings/);
  assert.doesNotMatch(unfolded, /URL:https:\/\/quattromani/);
  assert.match(
    unfolded,
    /URL:https:\/\/www.gagecountygop.org\/\r\n/,
  );
});

test("second Tuesday advances after meeting day in Central time, across years and DST", () => {
  const config = JSON.parse(fs.readFileSync(path.join(root, "src/content.json"), "utf8")).meeting;
  const cases = [
    ["2026-11-20T12:00:00Z", "2026-12-08", "-06:00"],
    ["2026-12-09T05:59:00Z", "2026-12-08", "-06:00"],
    ["2026-12-09T06:00:00Z", "2027-01-12", "-06:00"],
    ["2027-03-09T12:00:00Z", "2027-03-09", "-06:00"],
    ["2027-03-10T06:00:00Z", "2027-04-13", "-05:00"],
    ["2027-11-09T12:00:00Z", "2027-11-09", "-06:00"],
  ];
  for (const [instant, date, offset] of cases) {
    const meeting = nextMeeting(config, new Date(instant));
    assert.equal(meeting.date, date, instant);
    assert.equal(meeting.dateTime, `${date}T19:00:00${offset}`, instant);
    assert.equal(meeting.venue, "402 Sports Bar & Grill");
    assert.match(meetingCalendar(meeting, config.calendarUpdatedAt), /LOCATION:402 Sports Bar & Grill\\, Beatrice\\, Nebraska/);
  }
  assert.ok(read("index.html").includes(`data-meeting-month>${currentMeeting.monthLabel}</span><strong data-meeting-day>${currentMeeting.dayLabel}</strong>`));
  for (const file of ["index.html", "events.html", "contact.html"])
    assert.match(read(file), /data-meeting-calendar/);
});

test("Monthly import uses a local-time series with daylight saving transitions", () => {
  const link = './calendar/gage-county-gop-meetings.ics';
  for (const file of ["index.html", "events.html", "contact.html"]) {
    assert.match(read(file), /Add monthly meetings/);
    assert.ok(read(file).includes(`href="${link}" type="text/calendar" download="gage-county-gop-meetings.ics"`));
  }
  const config = JSON.parse(fs.readFileSync(path.join(root, "src/content.json"))).meeting;
  const series = meetingSeriesCalendar({ ...config, guestSpeakers: [] });
  assert.equal((series.match(/BEGIN:VEVENT/g) || []).length, 1);
  assert.match(series, /DTSTART;TZID=America\/Chicago:20261208T190000\r\n/);
  assert.match(series, /RRULE:FREQ=MONTHLY;BYDAY=2TU\r\n/);
  assert.match(series, /TZOFFSETFROM:-0600\r\nTZOFFSETTO:-0500/);
  assert.match(series, /TZOFFSETFROM:-0500\r\nTZOFFSETTO:-0600/);
  assert.doesNotMatch(series, /DTEND:|DURATION:|ATTENDEE:|ORGANIZER:/);
  for (const line of series.split("\r\n")) assert.ok(Buffer.byteLength(line) <= 75);
});

test("donation and completed-election references preserve the intended destinations and tab behavior", async () => {
  const content = JSON.parse(fs.readFileSync(path.join(root, "src/content.json"), "utf8"));
  const qrSource = JSON.parse(fs.readFileSync(path.join(root, content.donation.qrSource || "src/donation-qr.json"), "utf8"));
  assert.equal(crypto.createHash("sha256").update(content.donation.url).digest("hex"), qrSource.payloadSha256);
  const home = read("index.html");
  assert.equal(home.split(`href="${h(content.donation.url)}"`).length - 1, 2);
  assert.match(home, /id="donate"/);
  assert.doesNotMatch(home, /class="election-band"/);
  assert.ok(home.indexOf('id="election-resources"') > home.indexOf('id="donate"'));
  const references = home.match(/<section class="election-references[\s\S]*?<\/section>/)[0];
  assert.match(references, /Completed election cycle \/ 2026/);
  const cardLink = references.match(/<a href="\.\/vote-2026\/"[^>]*>/)[0];
  assert.doesNotMatch(cardLink, /target=/);
  assert.match(references, /href="https:\/\/partyreveal\.com\/" target="_blank" rel="noopener noreferrer"/);
  for (const file of htmlFiles.filter((f) => !f.includes("vote-2026"))) {
    const html = fs.readFileSync(file, "utf8");
    const headerNav = html.match(/<nav class="desktop-nav"[^>]*>(.*?)<\/nav>/)[1];
    assert.match(headerNav, /href="\.\/index\.html#donate">Donate<\/a>$/);
  }
  const { renderElectionBand } = await import("./components/election-band.mjs");
  assert.match(renderElectionBand(content, ""), /Keep your voter card close/);
});

test("government guide has sourced officeholders and contact routes with homepage and footer access", () => {
  const data = JSON.parse(fs.readFileSync(path.join(root, "src/government.json"), "utf8"));
  const page = read("government.html");
  assert.deepEqual(data.board.districts.map((entry) => entry.district), [1, 2, 3, 4, 5, 6, 7]);
  assert.equal(data.offices.length, 8);
  assert.equal(new Set(data.offices.map((entry) => entry.id)).size, 8);
  for (const entry of [data.state, ...data.board.districts, ...data.offices, ...data.services]) {
    if (entry.personId) assert.ok(page.includes(h(data.people[entry.personId].name)), entry.personId);
    assert.match(entry.phone, /^\d{3}-\d{3}-\d{4}$/);
    assert.ok(page.includes(`href="tel:+1${entry.phone.replace(/\D/g, "")}"`));
    if (entry.email) assert.ok(page.includes(`href="mailto:${h(entry.email)}"`));
    for (const id of entry.sourceIds) {
      assert.ok(data.sources[id], id);
      assert.equal(data.sources[id].checkedAt, data.checkedAt);
      assert.match(new URL(data.sources[id].url).hostname, /^(?:www\.)?(?:gagecountyne\.gov|nebraskalegislature\.gov|extension\.unl\.edu)$/);
      assert.ok(page.includes(`href="${h(data.sources[id].url)}"`), id);
    }
  }
  for (const file of htmlFiles.filter((file) => !file.includes("vote-2026"))) {
    const html = fs.readFileSync(file, "utf8");
    const header = html.match(/<header class="site-header">(.*?)<\/header>/)[1];
    assert.doesNotMatch(header, /government\.html/);
    assert.match(html, /<a href="\.\/government\.html"(?: aria-current="page")?>Local government<\/a>/);
  }
  const home = read("index.html");
  const meetingPosition = home.indexOf('class="meeting-card"');
  const bannerPosition = home.indexOf('class="government-banner"');
  const donationPosition = home.indexOf('class="donate-band"');
  assert.ok(meetingPosition < bannerPosition && bannerPosition < donationPosition);
  assert.match(page, /Directory listings may lag appointments or term changes/);
  assert.doesNotMatch(JSON.stringify(data.people), /affiliation|Republican|Democrat/i);
});

test("supervisor geography joins current directory records and keeps scanned names out of the interaction", () => {
  const model = JSON.parse(fs.readFileSync(path.join(root, "src/supervisor-maps.json"), "utf8"));
  const government = JSON.parse(fs.readFileSync(path.join(root, "src/government.json"), "utf8"));
  const page = read("government.html");
  const contains = (point, ring) => {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [x, y] = ring[i], [x2, y2] = ring[j];
      if ((y > point[1]) !== (y2 > point[1]) && point[0] < (x2 - x) * (point[1] - y) / (y2 - y) + x) inside = !inside;
    }
    return inside;
  };
  for (const map of model.maps) {
    assert.ok(government.sources[map.sourceId]);
    for (const region of map.districts) {
      assert.ok(government.board.districts.some((d) => d.district === region.district));
      for (const ring of region.rings) {
        assert.ok(ring.length >= 3);
        for (const p of ring) assert.ok(p.every(Number.isFinite));
      }
    }
  }
  // Interior samples checked against the two official maps, including both sides
  // of the split Beatrice Ward 3. These catch accidental district remapping.
  const samples = {
    county: [[1,[950,500]],[2,[300,700]],[3,[590,1140]],[6,[900,1400]],[7,[300,1400]]],
    beatrice: [[2,[100,150]],[3,[400,550]],[4,[400,350]],[5,[300,300]],[7,[100,550]]],
  };
  for (const map of model.maps) {
    for (const [expected, point] of samples[map.id]) {
      const matches = map.districts.filter((r) => r.rings.reduce((inside, ring) => inside !== contains(point, ring), false));
      assert.deepEqual(matches.map((r) => r.district), [expected], `${map.id}: ${point}`);
    }
  }
  for (const entry of government.board.districts) {
    assert.ok(page.includes(`data-map-district="${entry.district}" aria-label="District ${entry.district}: ${h(government.people[entry.personId].name)}"`));
    assert.ok(page.includes(`id="supervisor-district-${entry.district}"`));
  }
  assert.doesNotMatch(page, /Board agendas and minutes|Don Schuller|Dave Swavely/);
  assert.doesNotMatch(JSON.stringify(model), /personId|Schuller|Swavely|Haxby|Lytle/);
});

test("dated meeting changes persist through the affected day and calendars keep occurrence identity", () => {
  const base = JSON.parse(fs.readFileSync(path.join(root, "src/content.json"))).meeting;
  const override = { date: "2026-12-08", status: "canceled", message: "December meeting canceled due to weather.", confirmedBy: "Test fixture", updatedAt: "2026-12-07T18:00:00Z" };
  const canceled = { ...base, overrides: [override] };
  const meeting = nextMeeting(canceled, new Date("2026-12-09T05:59:00Z"));
  assert.equal(meeting.status, "canceled");
  assert.equal(meeting.date, "2026-12-08");
  assert.equal(nextMeeting(canceled, new Date("2026-12-09T06:00:00Z")).date, "2027-01-12");
  const single = meetingCalendar(meeting).replaceAll("\r\n ", "");
  assert.match(single, /STATUS:CANCELLED/);
  assert.match(single, /UID:gage-county-gop-meeting-2026-12-08@/);
  const series = meetingSeriesCalendar(canceled).replaceAll("\r\n ", "");
  assert.equal((series.match(/BEGIN:VEVENT/g) || []).length, 2);
  assert.match(series, /RECURRENCE-ID:20261209T010000Z/);
  assert.equal((series.match(/UID:gage-county-gop-second-tuesday@/g) || []).length, 2);
  const changed = { ...base, overrides: [{ ...override, status: "changed", venue: "Test venue", startHour: 18, time: "6 p.m." }] };
  assert.equal(nextMeeting(changed, new Date("2026-12-01T12:00:00Z")).dateTime, "2026-12-08T18:00:00-06:00");
  assert.match(meetingSeriesCalendar(changed), /LOCATION:Test venue/);
  const later = { ...base, overrides: [{ ...override, status: "rescheduled", newDate: "2027-01-05" }] };
  const rescheduled = nextMeeting(later, new Date("2026-12-20T12:00:00Z"));
  assert.equal(rescheduled.date, "2027-01-05");
  assert.equal(rescheduled.nominalDate, "2026-12-08");
  assert.match(meetingCalendar(rescheduled), /UID:gage-county-gop-meeting-2026-12-08@/);
  const movedBeyondNext = { ...base, overrides: [{ ...override, status: "rescheduled", newDate: "2027-02-20" }] };
  const beforeOriginal = new Date("2026-12-01T12:00:00Z");
  assert.equal(nextMeeting(movedBeyondNext, beforeOriginal).date, "2027-01-12");
  assert.equal(meetingNotice(movedBeyondNext, beforeOriginal).nominalDate, "2026-12-08");
  const earlier = { ...base, overrides: [{ ...override, status: "rescheduled", newDate: "2026-12-07" }] };
  const now = new Date("2026-12-08T18:00:00Z");
  assert.equal(nextMeeting(earlier, now).date, "2027-01-12");
  assert.equal(meetingNotice(earlier, now).date, "2026-12-07");
  assert.match(retainedMeetingText(nextMeeting(earlier, now), meetingNotice(earlier, now)), /December 8, 2026.*December 7, 2026/);
  assert.equal(meetingNotice(earlier, new Date("2026-12-09T06:00:00Z")).status, "scheduled");
});

test("meeting configuration rejects ambiguous overrides and resolves the actual rescheduled local hour", () => {
  const base = { ...JSON.parse(fs.readFileSync(path.join(root, "src/content.json"))).meeting, guestSpeakers: [] };
  const override = { date: "2027-03-09", status: "rescheduled", newDate: "2027-03-14", startHour: 1, time: "1 a.m.", message: "Test only", confirmedBy: "Test fixture", updatedAt: "2027-03-01T12:00:00Z" };
  assert.equal(nextMeeting({ ...base, overrides: [override] }, new Date("2027-03-10T12:00:00Z")).dateTime, "2027-03-14T01:00:00-06:00");
  assert.throws(() => nextMeeting({ ...base, overrides: [{ ...override, startHour: 2 }] }, new Date("2027-03-10T12:00:00Z")), /does not exist/);
  assert.equal(nextMeeting({ ...base, firstDate: "2030-01-08" }, new Date("2026-01-01T12:00:00Z")).date, "2030-01-08");
  for (const invalid of [
    { ...base, firstDate: "2026-12-07" },
    { ...base, firstDate: "2026-99-99" },
    { ...base, overrides: [override, override] },
    { ...base, overrides: [{ ...override, date: "2027-03-10" }] },
    { ...base, overrides: [{ ...override, status: "changed" }] },
    { ...base, overrides: [{ ...override, confirmedBy: "" }] },
    { ...base, overrides: [{ ...override, startHour: undefined }] },
  ]) assert.throws(() => validateMeetingConfig(invalid));
});

test("participation routes stay consistent and private intake administration stays out of public output", () => {
  const intake = JSON.parse(fs.readFileSync(path.join(root, "src/contact-intake.json")));
  assert.equal(intake.status, "ready");
  assert.match(intake.endpoint, /^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/);
  for (const task of ["add", "update", "stop", "interest"]) assert.ok(read("updates.html").includes(`data-contact-open="${task}"`));
  for (const file of htmlFiles.filter((f) => !f.includes("vote-2026"))) {
    const html = fs.readFileSync(file, "utf8");
    const nav = html.match(/<nav class="desktop-nav"[^>]*>(.*?)<\/nav>/)[1];
    assert.deepEqual([...nav.matchAll(/>([^<]+)<\/a>/g)].map((m) => m[1]), ["Meetings &amp; events", "Get involved", "About", "Resources", "Donate"]);
    assert.match(html, /data-meeting-strip/);
    assert.match(html, /href="\.\/updates\.html"/);
  }
  const home = read("index.html");
  const order = ['class="hero"', 'class="wrap section home-meeting"', 'class="quick-strip"', 'class="wrap section home-community"', 'class="stay-informed soft-section"', 'class="government-banner"', 'class="donate-band"'];
  const indexes = order.map((marker) => home.indexOf(marker));
  assert.ok(indexes.every((n, i) => n >= 0 && (!i || n > indexes[i - 1])));
  for (const file of files(dist).filter((f) => /\.(html|json|js|mjs)$/.test(f))) {
    assert.doesNotMatch(fs.readFileSync(file, "utf8"), /1mXsRm-5JTbS1BAZtVwToSx1GjN00W6uWImOqW9YqNyA|1Qt1lBAURsxPkTxaxwsI-eQQTKgvP3JB8VT9fk2tpwXo|qa-test@example\.com|private contact register/i, file);
  }
  assert.match(read("updates.html"), /data-contact-dialog/);
  assert.doesNotMatch(read("updates.html"), /docs\.google\.com\/forms/);
  assert.match(read("updates.html"), /separate from voter registration/);
  assert.ok(read("government.html").indexOf("Start with your question.") < read("government.html").indexOf("Different responsibilities."));
});


test("guest speakers belong to one meeting and follow reschedules without leaking into the recurring series", () => {
  const config = JSON.parse(fs.readFileSync(path.join(root, "src/content.json"))).meeting;
  const now = new Date("2026-12-01T12:00:00Z");
  const december = nextMeeting(config, now);
  assert.equal(december.guestSpeaker.name, "Mike Hilgers");
  assert.equal(nextMeeting(config, new Date("2026-12-09T06:00:00Z")).guestSpeaker, null);
  const noSpeaker = nextMeeting({ ...config, guestSpeakers: [] }, now);
  const options = { h, meetingLink: () => "", allMeetingsLink: () => "", schedule: "" };
  assert.match(renderMeetingCard(noSpeaker, options), /data-meeting-speaker hidden/);
  assert.match(renderMeetingStrip(noSpeaker, h), /data-meeting-strip-speaker hidden/);
  assert.doesNotMatch(renderMeetingCard(noSpeaker, options), /Mike Hilgers/);
  for (const file of ["index.html", "events.html", "contact.html"]) {
    if (file !== "contact.html") assert.match(read(file), /data-speaker-name>Mike Hilgers/);
    assert.match(read(file), /data-meeting-strip-speaker-name>Nebraska Attorney General Mike Hilgers/);
  }
  const change = { date: "2026-12-08", status: "rescheduled", newDate: "2026-12-10", message: "Test reschedule", confirmedBy: "Test", updatedAt: "2026-12-01T12:00:00Z" };
  assert.equal(nextMeeting({ ...config, overrides: [change] }, now).guestSpeaker.name, "Mike Hilgers");
  const canceled = { ...config, overrides: [{ ...change, status: "canceled", newDate: undefined }] };
  assert.equal(nextMeeting(canceled, now).guestSpeaker, null);
  assert.doesNotMatch(meetingSeriesCalendar(canceled), /Mike Hilgers/);
  assert.match(meetingCalendar(december).replaceAll("\r\n ", ""), /Guest speaker: Nebraska Attorney General Mike Hilgers/);
  const events = read("calendar/gage-county-gop-meetings.ics").replaceAll("\r\n ", "").split("BEGIN:VEVENT").slice(1);
  assert.equal(events.length, 2);
  assert.doesNotMatch(events[0], /Guest speaker|Mike Hilgers/);
  assert.match(events[1], /RECURRENCE-ID:20261209T010000Z/);
  assert.match(events[1], /Guest speaker: Nebraska Attorney General Mike Hilgers/);
  const speaker = config.guestSpeakers[0];
  for (const guestSpeakers of [[speaker, speaker], [{ ...speaker, date: "2026-12-09" }], [{ ...speaker, name: "" }]]) {
    assert.throws(() => validateMeetingConfig({ ...config, guestSpeakers }));
  }
});
