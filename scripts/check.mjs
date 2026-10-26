import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import vm from "node:vm";
const root = path.resolve(import.meta.dirname, ".."),
  dist = path.join(root, "dist");
const read = (file) => fs.readFileSync(path.join(dist, file), "utf8");
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
      if (/^(https?:|mailto:|webcal:|data:)/.test(url)) continue;
      assert.ok(
        !url.startsWith("/"),
        "root-relative path breaks Pages: " + url,
      );
      const [relative, fragment] = url.split("#");
      let dest = path.resolve(
        path.dirname(file),
        decodeURIComponent(relative || path.basename(file)),
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
});
test("platform wording and source archive preserve complete source text", () => {
  const data = JSON.parse(
    fs.readFileSync(path.join(root, "source-snapshot/inventory.json")),
  );
  for (const p of data.pages.filter(
    (p) =>
      !["root", "cart", "new-dropdown", "organization-1", "events"].includes(
        p.slug,
      ),
  ))
    for (const text of p.text)
      assert.ok(
        read("archive.html").includes(h(text)),
        p.slug + ": " + text.slice(0, 50),
      );
  for (const text of data.pages
    .find((p) => p.slug === "nebraska-platform")
    .text.slice(1)
    .filter((t) => t !== t.toUpperCase()))
    assert.ok(read("platform.html").includes(h(text)));
});
test("every website page has landmarks, one h1, language, preview labeling, and image alternatives", () => {
  for (const file of htmlFiles.filter((f) => !f.includes("vote-2026"))) {
    const html = fs.readFileSync(file, "utf8");
    assert.equal((html.match(/<h1>/g) || []).length, 1);
    assert.match(html, /<html lang="en">/);
    assert.match(html, /<main id="main">/);
    assert.match(html, /Website redesign preview/);
    for (const image of html.matchAll(/<img\b[^>]+>/g))
      assert.match(image[0], /alt="[^"]*"/);
    assert.match(html, /https:\/\/partyreveal.com\//);
    assert.match(html, /\.\/vote-2026\//);
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
test("archive filtering and direct-link disclosure behavior work", () => {
  const entries = [
    { textContent: "Leadership Dennis", hidden: false },
    { textContent: "Platform agriculture", hidden: false },
  ];
  const listeners = {},
    search = {
      value: "dennis",
      addEventListener: (n, fn) => (listeners[n] = fn),
    },
    status = {},
    target = { open: false, matches: () => true };
  const document = {
    querySelector: (s) =>
      s === "[data-archive-search]"
        ? search
        : s === "[data-search-status]"
          ? status
          : null,
    querySelectorAll: () => entries,
    getElementById: () => target,
    addEventListener: () => {},
  };
  vm.runInNewContext(fs.readFileSync(path.join(root, "src/site.js"), "utf8"), {
    document,
    location: { hash: "#leadership" },
    window: { addEventListener: () => {} },
  });
  listeners.input();
  assert.equal(entries[0].hidden, false);
  assert.equal(entries[1].hidden, true);
  assert.equal(status.textContent, "1 source page found");
  assert.equal(target.open, true);
});
