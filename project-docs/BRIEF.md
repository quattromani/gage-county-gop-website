# Website redesign brief

## Outcome and scope

Create a standalone, publicly viewable GitHub Pages revision of gagecountygop.org. Preserve publicly discoverable party content and original assets, import the GOP voter-card publication, and link Party Reveal from navigation. Leave Squarespace, domain records, the neutral civic project, and the original voter-card deployment intact.

Readers need to find a meeting, identify party leadership, understand the organization, read governing documents, contact the party, or open election resources. Returning visitors need direct paths to the voter card and Party Reveal. The site is occasional-use party information; it is not an election authority or a county government website. People uninterested in party activity may still benefit from election resources; access is unrestricted.

## Information and evidence

The public capture includes 24 URLs and 36 content assets. The raw pages and sitemap are retained under source-snapshot, with extracted text and asset hashes in inventory.json. Main information groups are party identity and leadership, community activity, documents and organization, election resources, and contact. Historical candidate lists remain source evidence, while the imported voter card retains its existing upstream authority. See CONTENT-REVIEW.md for contradictions and migration decisions.

The original site is the content precedent: visually emphatic, organizationally fragmented. The existing voter card is the interaction precedent: compact, practical. Party Reveal is the evidence precedent: source-oriented, searchable. These descriptions come from the reviewed source and existing projects, not an exhaustive comparative market survey.

## Representation and design

Five design words: local, clear, grounded, readable, connected.

The subject is a human organization with tangible local places, people, and events, and conceptual governing rules. Use literal source photography for the courthouse, leaders, and gatherings. Avoid replacing local evidence with generated stock imagery. Archive the source eagle, logo, Venmo image, decorative artwork, and template imagery without promoting uncertain payment information or third-party template portraits.

Warm paper, dark ink, restrained red, serif headings, and a simple sans serif interface establish an editorial character. The small G monogram is a provisional preview identity, not an adopted replacement logo. Photography supplies local specificity; common grids, borders, and spacing reduce competing visual decisions. CSS tokens own recurring color and spacing. Platform and archive text have a limited reading measure.

Desktop navigation supports direct browsing. A native details menu handles smaller screens and works without JavaScript. Pages are static HTML with relative URLs, so they work at a GitHub repository path. Source disclosure links connect main pages to the historical evidence. The archive search is optional enhancement; all records remain readable without it.

## Acceptance and limits

- Eight substantive pages plus voter card and error page, usable on desktop and mobile.
- All public captured source text retained in the archive or duplicate-route inventory.
- Original asset hashes verified and display derivatives hosted locally.
- Complete published platform preserved; governance conflicts and unconfirmed meeting year visible.
- Voter card renders its exact imported inclusion set, with judicial section, five calendar milestones, original downloads, scoped offline support, and return navigation.
- Main navigation includes Party Reveal and voter card.
- Build validates links, anchors, source fidelity, inclusion, download bytes, archive behavior, and offline scope.
- Verified public GitHub Pages preview and documented maintenance.

This preview intentionally carries noindex metadata. It is public, not private, and noindex is not an access control. It does not collect form submissions, process donations, add analytics, or claim independent verification of original-site content. Original asset licenses, private Squarespace content, full governing-document transcription, and confirmed event dates remain outside the public capture. See VALIDATION.md for actual test coverage and limitations.
