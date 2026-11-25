# Website redesign brief

## Outcome and scope

Maintain a standalone, publicly viewable GitHub Pages revision of gagecountygop.org. Preserve publicly discoverable party content and original assets, retain the imported GOP voter-card publication, and identify the 2026 election materials as completed-cycle references. Leave Squarespace, domain records, the neutral civic project, and the original voter-card deployment intact.

Readers need to find a meeting, identify party leadership, understand the organization, read governing documents, contact the party, or open election resources. Homepage quick access prioritizes Get involved, Platform, and Constitution, in that order. The site is occasional-use party information; it is not an election authority or a county government website. People uninterested in party activity may still benefit from election resources; access is unrestricted.

## Information and evidence

The public capture includes 24 URLs and 36 content assets. The raw pages and sitemap are retained under source-snapshot, with extracted text and asset hashes in inventory.json. Main information groups are party identity and leadership, community activity, documents and organization, election resources, and contact. Historical candidate lists remain source evidence, while the imported voter card retains its existing upstream authority. See CONTENT-REVIEW.md for contradictions and migration decisions.

The original site is the content precedent: visually emphatic, organizationally fragmented. The existing voter card is the interaction precedent: compact, practical. Party Reveal is the evidence precedent: source-oriented, searchable. These descriptions come from the reviewed source and existing projects, not an exhaustive comparative market survey.

## Representation and design

Five design words: local, clear, grounded, readable, connected.

The subject is a human organization with tangible local places, people, and events, and conceptual governing rules. Use literal source photography for the courthouse, leaders, and gatherings. Avoid replacing local evidence with generated stock imagery. Earlier Venmo artwork, decorative source imagery, and template portraits remain repository evidence. The public donation section uses the owner-approved Givebutter campaign and selected supplied QR artwork, maintained in src/content.json and the asset registry.

Warm paper, dark ink, logo blue, muted red, serif headings, and a simple sans serif interface establish an editorial character. The selected partial R mark appears in the header, footer, and favicon; brand.palette in src/content.json selects the current logo-blue theme. Earlier G and R proposals remain review history. Photography supplies local specificity; common grids, borders, and spacing reduce competing visual decisions. CSS tokens own recurring color and spacing. Long-form text has a limited reading measure.

Desktop navigation supports direct browsing. A native details menu handles smaller screens and works without JavaScript. Ordinary pages are static HTML with relative URLs, so they work at a GitHub repository path. Missing-page assets and recovery links must resolve from the deployment base even when the host serves the page at an unknown nested URL; see [missing-page recovery](PATTERNS.md#missing-page-recovery) for this scoped exception and local preview behavior. Historical source records remain in the repository and are excluded from the public build. The public pages use normal party-site wording without migration commentary or archive navigation.

The public contact form sends add, update, stop, and committee-interest requests through an append-only Google Apps Script service into a restricted Google Sheet. A matching receipt confirms intake; a team member reviews requests before changing the register or sending notices. The website contains no private roster. Privacy and Accessibility pages describe actual service use, visitor choices, alternatives, and known limits; their authoritative wording lives in src/policies.json.

## Acceptance and limits

- Thirteen substantive pages plus the error page and imported voter card, usable on desktop and mobile.
- All public captured source text retained in the archive or duplicate-route inventory.
- Original asset hashes verified and display derivatives hosted locally.
- Complete published platform preserved. Organization summaries defer procedural details to the constitution. The user confirmed a second-Tuesday monthly meeting at 7 p.m. Central at 402 Sports Bar & Grill, beginning December 8, 2026.
- Voter card renders its exact imported inclusion set, with judicial section, five calendar milestones, original downloads, and return navigation. PDFs can be saved directly. Its scoped worker can serve previously cached public copies; the current card has no new-save controls and does not provide a first-visit offline copy.
- Main navigation omits Party Reveal and voter card. Homepage quick access links to Get involved, Platform, and Constitution; the completed-2026 reference block follows Donate.
- Build validates links, anchors, source fidelity, inclusion, download bytes, archive exclusion, confirmed meeting details, and offline scope.
- Verified public GitHub Pages preview and documented maintenance.

This preview intentionally carries noindex metadata. It is public, not private, and noindex is not an access control. It accepts contact requests through a public append-only service into a restricted inbox and links to Givebutter for payments; the site does not collect payment-account details or add audience analytics. It does not claim independent verification of original-site content. Public availability does not establish media rights, and private Squarespace content remains outside the capture. The constitution transcription preserves the original scans and their redaction; confirmed meeting details do not resolve every historical event or content-owner question.

See [current validation status](VALIDATION.md#current-status-november-24-2026) for the audited public preview, scoped 404 repair, verification evidence, and unresolved launch work. Readiness evidence does not constitute official-launch clearance; release status is separate.

## Decision history

The dated records below preserve earlier decisions and constraints. They describe the project at those stages; the current brief above and the authoritative source records govern later implementation.

### Historical navigation update, November 20, 2026

The user requested document access and committee participation in the three cards below the homepage banner. Reuse the existing card treatment and direct document pages; keep Resources in navigation. Remove the voter card and Party Reveal from both desktop/mobile masthead navigation and this quick-access strip. Other election references remain available.

The third card opens committees.html, an additional page for committee opportunities. Its introductory content lives in src/content.json. The user mentioned approximately eight committees; names, responsibilities, and participation details remain pending. Do not infer that roster from the governing committees. Preserve resources.html#organization and its existing committees and convention disclosures.

### Historical donation update, November 20, 2026

Replace the homepage election band with a Donate section using the live homepage’s decoded Venmo QR destination. Reuse the dark band and two-column hierarchy, with a clean black-and-white QR and a direct link for visitors using the same phone. Stack these on mobile. Keep the election-band component and styles for future reuse. Donate is the last desktop and mobile header link and targets the homepage section. No contribution terms, payment success, or independently verified recipient is asserted.

### Historical participation refactor approval, November 20, 2026

The current local implementation prioritizes Meetings & events and Get involved in navigation and places a compact dark-blue meeting strip on public pages. Home now leads with a shorter hero and full meeting card, then Get involved/Platform/Constitution, real activity, Stay informed, government reference and a compact donation section. Resources holds governance and documents; the government guide leads with practical question routes. Document pages retain desktop position underlines and gain mobile topic disclosure.

The owner supplied seven committee teams: Candidate Survey, Public Relations, Recruiting, Fundraising, Podcast, Program, Education. General descriptions and team-specific contact links are included; formal governance remains separate. A public contact intake feeds a private Google Sheet for manual add/update/stop review. Access remains owner-only pending named authorized collaborators. No real member records imported. PWA and automated delivery remain future scope. See REFACTOR-PLAN.md, CONTACT-AND-MEETING-OPERATIONS.md and VALIDATION.md for the completed scope, checks and operational limits.
