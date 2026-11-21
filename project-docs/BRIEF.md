# Website redesign brief

## Outcome and scope

Create a standalone, publicly viewable GitHub Pages revision of gagecountygop.org. Preserve publicly discoverable party content and original assets, import the GOP voter-card publication, and retain election references in Resources. Leave Squarespace, domain records, the neutral civic project, and the original voter-card deployment intact.

Readers need to find a meeting, identify party leadership, understand the organization, read governing documents, contact the party, or open election resources. Homepage quick access prioritizes the constitution, platform, and a separate committee opportunities page. The site is occasional-use party information; it is not an election authority or a county government website. People uninterested in party activity may still benefit from election resources; access is unrestricted.

## Information and evidence

The public capture includes 24 URLs and 36 content assets. The raw pages and sitemap are retained under source-snapshot, with extracted text and asset hashes in inventory.json. Main information groups are party identity and leadership, community activity, documents and organization, election resources, and contact. Historical candidate lists remain source evidence, while the imported voter card retains its existing upstream authority. See CONTENT-REVIEW.md for contradictions and migration decisions.

The original site is the content precedent: visually emphatic, organizationally fragmented. The existing voter card is the interaction precedent: compact, practical. Party Reveal is the evidence precedent: source-oriented, searchable. These descriptions come from the reviewed source and existing projects, not an exhaustive comparative market survey.

## Representation and design

Five design words: local, clear, grounded, readable, connected.

The subject is a human organization with tangible local places, people, and events, and conceptual governing rules. Use literal source photography for the courthouse, leaders, and gatherings. Avoid replacing local evidence with generated stock imagery. Archive the source eagle, logo, Venmo image, decorative artwork, and template imagery without promoting uncertain payment information or third-party template portraits.

Warm paper, dark ink, restrained red, serif headings, and a simple sans serif interface establish an editorial character. The small G monogram is a provisional preview identity, not an adopted replacement logo. Photography supplies local specificity; common grids, borders, and spacing reduce competing visual decisions. CSS tokens own recurring color and spacing. Platform and archive text have a limited reading measure.

Desktop navigation supports direct browsing. A native details menu handles smaller screens and works without JavaScript. Pages are static HTML with relative URLs, so they work at a GitHub repository path. Historical source records remain in the repository and are excluded from the public build. The public pages use normal party-site wording without migration commentary or archive navigation.

## Acceptance and limits

- Nine substantive pages plus voter card and error page, usable on desktop and mobile.
- All public captured source text retained in the archive or duplicate-route inventory.
- Original asset hashes verified and display derivatives hosted locally.
- Complete published platform preserved. Organization summaries defer procedural details to the constitution. The user confirmed a second-Tuesday monthly meeting at 7 p.m. Central at 402 Sports Bar & Grill, beginning December 8, 2026.
- Voter card renders its exact imported inclusion set, with judicial section, five calendar milestones, original downloads, scoped offline support, and return navigation.
- Main navigation omits Party Reveal and voter card. Homepage quick access links to Constitution, Platform, and Committees & convention in that order.
- Build validates links, anchors, source fidelity, inclusion, download bytes, archive exclusion, confirmed meeting details, and offline scope.
- Verified public GitHub Pages preview and documented maintenance.

This preview intentionally carries noindex metadata. It is public, not private, and noindex is not an access control. It does not collect form submissions, process donations, add analytics, or claim independent verification of original-site content. Original asset licenses, private Squarespace content, full governing-document transcription, and confirmed event dates remain outside the public capture. See VALIDATION.md for actual test coverage and limitations.

## Navigation update, November 20, 2026

The user requested document access and committee participation in the three cards below the homepage banner. Reuse the existing card treatment and direct document pages; keep Resources in navigation. Remove the voter card and Party Reveal from both desktop/mobile masthead navigation and this quick-access strip. Other election references remain available.

The third card opens committees.html, an additional page for committee opportunities. Its introductory content lives in src/content.json. The user mentioned approximately eight committees; names, responsibilities, and participation details remain pending. Do not infer that roster from the governing committees. Preserve resources.html#organization and its existing committees and convention disclosures.

## Donation update, November 20, 2026

Replace the homepage election band with a Donate section using the live homepage’s decoded Venmo QR destination. Reuse the dark band and two-column hierarchy, with a clean black-and-white QR and a direct link for visitors using the same phone. Stack these on mobile. Keep the election-band component and styles for future reuse. Donate is the last desktop and mobile header link and targets the homepage section. No contribution terms, payment success, or independently verified recipient is asserted.

## Approved participation refactor, November 20, 2026

The current local implementation prioritizes Meetings & events and Get involved in navigation and places a compact dark-blue meeting strip on public pages. Home now leads with a shorter hero and full meeting card, then Get involved/Platform/Constitution, real activity, Stay informed, government reference and a compact donation section. Resources holds governance and documents; the government guide leads with practical question routes. Document pages retain desktop position underlines and gain mobile topic disclosure.

The owner supplied seven committee teams: Candidate Survey, Public Relations, Recruiting, Fundraising, Podcast, Program, Education. General descriptions and team-specific contact links are included; formal governance remains separate. A public contact intake feeds a private Google Sheet for manual add/update/stop review. Access remains owner-only pending named authorized collaborators. No real member records imported. PWA and automated delivery remain future scope. See REFACTOR-PLAN.md, CONTACT-AND-MEETING-OPERATIONS.md and VALIDATION.md for the completed scope, checks and operational limits.
