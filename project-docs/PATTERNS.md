# Presentation patterns

The authoritative patterns are the generators in scripts/build.mjs and styles in src/style.css; the real pages serve as maintained examples.

- **Page header:** one h1, a short introductory paragraph, and a subject label. About, resources, and contact show the pattern.
- **Resource link:** a whole linked card with an explicit destination. Use for navigation, never for a disclosure action.
- **Organization disclosure:** a native details/summary element containing a brief organization overview; procedural details defer to the constitution. Resources demonstrates keyboard-operable closed/open states. Historical source records stay in the repository, outside the public site.
- **Meeting notice:** Home and Events render the next second Tuesday from src/content.json. The first date is December 8, 2026. The browser advances it after the meeting day ends in America/Chicago. A generated date follows the confirmed recurrence rule; changes and exceptions must be recorded in source data.
- **Party document:** The platform and constitution are HTML reading pages with a document title and topic or article navigation. The constitution links its original scans after the complete text; platform provenance stays in the repository without a public source block. The constitution's numbered clauses and nested lettered items follow the five scans in order. Its transcription is maintained in src/constitution.json, with the registered address marked as redacted. The platform text comes from the captured source inventory. Presentation may change; source wording may not be silently revised.
- **Photo story:** local image and explicit caption link to the related archive. Event-date claims require supporting source context.
- **Mobile menu:** native details/summary remains functional without scripts. Escape closes it and restores focus to summary when scripts are available.
- **Voter card:** imported as a separate path with its own existing styles and offline scope. Do not apply global site styles to its candidate presentation.

Tokens define ink, paper, red, muted text, lines, and spacing. Typography uses system fonts without remote font requests. Image and document links open native files; forms and payment widgets are not simulated. Use contact links when there is no verified backend. Public text addresses visitors directly; migration findings and source-capture notes belong in repository documentation.

The shared stylesheet and script include content-hash query versions. A changed asset receives a new URL, so returning browsers do not combine updated markup with cached old styles or behavior.

Meeting actions on Home, Events, and Contact offer the next occurrence and an Add monthly meetings recurring series. A shared module calculates the date and calendar data from src/content.json. The one-event file has an explicit UTC start; the series has a local 7 p.m. start, monthly second-Tuesday rule, and America/Chicago daylight-saving definition. No end time or attendees are invented. The browser generates future single-event downloads; the build includes an initial .ics fallback. File encoding, escaping, and folding follow [RFC 5545](https://www.rfc-editor.org/rfc/rfc5545#section-3.6.1). Importing either file is a visitor action. Imported files are snapshots, not a live subscription, so later cancellations or changes require an updated calendar import.

The homepage Constitution quick link uses the featured red treatment: the shared var(--red) token, white title and arrow, warm-white supporting text, a narrow warm highlight, and a restrained shadow. Its grid position, size rules, and link destination stay shared with the quick-access strip; hover darkens the background without moving the tile.

The About page mission statement uses a semantic blockquote with unchanged party wording, larger serif text, a red leading rule, and the shared soft background. Its inset spacing and type scale adapt to narrow screens. Keep it distinct from ordinary body paragraphs without adding promotional wording.

## Masthead flag and mobile menu

The proposed site uses a flat, unmodified U.S. flag PNG as a small upper-right masthead accent. Source: Wikimedia Commons, File:Flag_of_the_United_States.svg; 330px PNG rendition, public domain. The source register preserves the original file, URL, checksum, and license. A simple rectangular rendering fits the site's restrained typographic branding and remains legible at small size.

Above 1100px the flag is 70px wide with original proportions, after the desktop navigation and aligned with the header’s right content edge. The desktop navigation has an automatic left margin, separating it from the logo and wordmark. At 1100px and below the flag is hidden, and the native details/summary Menu control uses red, white, and navy bars. The white bar has a subtle edge for contrast on cream. Keep the visible Menu label, keyboard behavior, focus outline, and all navigation links. The flag is decorative context, never a navigation control.

Contact is a plain footer link, rather than a boxed masthead action; it is also omitted from the mobile header menu. Contextual contact calls to action within page content remain available.

## Meeting event handoff

Meeting actions on Home, Events and Contact download descriptively named .ics files. Apple Calendar imports them through its normal import dialog. The event website is the party homepage, not the GitHub hosting URL. X-WR-CALNAME identifies Gage County GOP Meetings when a calendar application displays a calendar name. The physical LOCATION remains the venue and city. The single-event UID is date-specific; the recurring series has one stable UID. No end time, invitation sender, or attendees are invented.

A browser may still display the download origin as GitHub while hosting remains there. The event's visible website and venue are party-facing; domain configuration is separate.

Homepage quick-access labels, descriptions, and destinations are maintained in src/content.json. The third card opens the separate committee opportunities page; the Resources organization disclosures remain the procedural overview.

## Current sidebar section

Above 900px, every .topic-nav sidebar underlines the last linked section heading to reach the page’s native jump-link inset (the measured masthead height plus a 24px clearance and any section scroll margin). Scrolling in either direction and native anchor navigation use the same reading line; no topic is marked before the first heading. The current link has aria-current="location" without changing keyboard focus or the URL. Updates run at most once per animation frame and also handle load, history restoration, and resizing. At 900px and below the current state is cleared. Plain jump links remain usable without JavaScript. The platform and constitution share this behavior, and future left sidebar document navigation should use the same .topic-nav component.

## Donation band and retained election band

The homepage Donate section replaces the seasonal election band and is the target of the last header link on desktop and mobile. It offers a Givebutter button and a linked lossless QR. The owner selected the supplied QR design, with colored finder squares and its center artwork cleaned. The preserved image is the active asset; it is not replaced by a fresh plain matrix. Both button and QR use the clean campaign URL in src/content.json. Independent ZXing decoding confirmed the final image, including at desktop and phone display sizes.

The donation.qrSource record selects the verified artwork and payload hash. scripts/build-donation-qr.py verifies the source checksum and copies the selected supplied image unchanged. It also retains matrix rendering for the earlier QR sources. The old Venmo and plain Givebutter matrix/assets remain archived. Preserve the white frame around the supplied code, and do not rotate, filter or decorate its data modules. Any future artwork change requires another independent decode check.

The original election band is preserved in scripts/components/election-band.mjs as renderElectionBand(content, arrow); its styles, voter-card build, downloads, and Resources links remain available. A future election update can explicitly reintroduce that component. Do not silently replace its 2026 facts for a later cycle.

The homepage meeting card places its second-Tuesday monthly schedule and configured time immediately above two calendar links styled as buttons. The next-occurrence action is filled; Add monthly meetings is outlined and imports the recurring monthly series. Keep the schedule visible before the actions so visitors can understand the recurring import. Links retain native calendar-download semantics and wrap at narrow widths.

## Government responsibility map

The standalone government guide uses ordinary sections, headings, and links to show state representation alongside county responsibilities. County board and countywide office groups share the county lane without an implied management connection. Service groups describe function rather than appointment or supervision. Officeholders, contacts, service routes, and source checks come from src/government.json; scripts/components/government-page.mjs renders that model. Narrow screens stack the groups and remove connectors. Each office offers task examples, telephone/email contact where verified, and an official-source link. The homepage promotes the guide with a compact full-width reference bar after the meeting section and before Donate. Footer navigation labels it “Local government”; header navigation omits it. The entire resource bar is one link, with a descriptive heading and “Explore the guide” action.

The native mobile menu uses its details[open] state to turn the hamburger into a red X: outer bars translate and rotate, while the center bar fades and contracts. A 180ms CSS transition reverses when closed; the panel has a subtle opening fade/slide. Reduced-motion preferences disable icon transitions and panel animation. The same summary toggles either state, with native expanded/collapsed semantics; Escape closes the menu and restores focus. No JavaScript is required for the icon or toggle.

Government guide office, service, and state-representation destinations use CSS :target to show a persistent red outline and contrasting background after an anchor jump. It follows the current URL fragment, including direct links and browser history, without timers, layout shifts, or JavaScript. Only the selected destination is highlighted; question links and map links share this behavior.


## Supervisor district explorer

The government page connects countywide and Beatrice maps to current supervisor contacts through district IDs. The source PDFs are preserved under assets/originals/external. src/supervisor-maps.json contains image-space region geometry and provenance; src/government.json alone supplies the current people and contact information. Printed map keys are never an officeholder authority. The component is scripts/components/supervisor-maps.mjs.

Hover or keyboard focus previews a district, highlighting its geography and supervisor card. Click or Enter pins that selection, updates a live status, and leaves a “View supervisor details” anchor. Touch selection brings the contact panel into view. Numbered 44px links provide an alternative to choosing geography; a district outside the current view opens the appropriate map. The Beatrice outline on the county map opens its detailed view. Maps fit the available column width and display their full proportional height at every viewport size. Map scale controls can enlarge the SVG with horizontal scrolling; the map never has an internal vertical height cap. State uses text, numbered markers, outlines and fill. Reduced motion removes the short fill transition. Without JavaScript, both maps remain visible and every area links to its supervisor card.

These are source-based interactive overviews, not georeferenced parcel/address lookup. The PDF links remain for checking edge locations. County paths follow the thick drawn boundary centrelines; Beatrice paths are traced from the source colour regions with small road/text gaps repaired. A monochrome source-map base retains roads, town labels and context; printed keys, census table and title are omitted from the Beatrice derivative. Map-source colours never encode current people.

## Approved participation hierarchy, November 20, 2026

Shared navigation is Meetings & events, Get involved, About, Resources, Donate. Meeting updates is a utility/mobile route. The footer contains secondary destinations only: Local government, Contact, Privacy, and Accessibility. Reference pages have a Resources breadcrumb without falsely marking Resources as the current page. Desktop document sidebars retain current-section underlines; native topic disclosures provide mobile jumps and close after selection.

The global meeting strip uses the existing ink blue with white text; explicit dated change notices use the existing red. Homepage order is shorter hero, full meeting card, Get involved/Platform/Constitution quick links, local activity, Stay informed, government reference, compact donation, contact and footer. On phones the full meeting card precedes its accompanying welcome copy.

Get involved renders src/participation.json. Team interest links prefill the public form with that team and reply-only, while a general unsure route remains available. Keep private form administration and roster records outside the public build. Dated overrides and calendars share src/meeting.mjs. See CONTACT-AND-MEETING-OPERATIONS.md.

## Custom contact dialog, November 21, 2026

Contact actions use one shared native dialog per page, rendered by scripts/components/contact-form.mjs. It becomes full-screen at phone widths; its fixed header keeps Close available while the form body scrolls. Use explicit data-contact-open task hooks and optional team labels. Homepage links retain an Updates fallback; the Updates page also offers a no-script email alternative. No external Google Form is used by the website.

Use visible labels, at least 16px input text and 44–52px touch controls. Enable browser autofill for full name (name), email (email), mobile (tel) and town (address-level2), with appropriate input types/keyboards. Do not read a visitor's saved profile, put contact data in URLs, or save it in local storage. Previous-contact and honeypot inputs intentionally opt out of autofill. A full-name field avoids requiring separate name entry.

Focus moves to the dialog heading, remains within its controls, and returns to the opener on Close/Escape. Validation provides a focused error summary with field links and inline errors. Interest actions preselect the team and reply-only preference. Stopping notices changes the question and does not require the contact method for the channel being stopped, because staff match the existing record manually.

Submission is pending until the private append-only service confirms the matching request UUID. Inputs remain in memory after failure; unchanged retries reuse the UUID. A successful response received while the dialog was closed is shown on reopening. No opaque request, iframe load, or button click counts as proof of saving. See services/contact-intake/README.md and project-docs/ON-SITE-CONTACT-FORM.md.


## Website policy pages

Privacy and Accessibility use the existing page hero and a single readable text column. Their authoritative wording and review date live in src/policies.json; scripts/components/policy-page.mjs renders escaped paragraphs, headings, and links. Use this pattern for factual website information, with a contact route and explicit limitations. Do not add compliance badges, legal claims, response-time promises, or retention periods without evidence/owner policy. The form privacy link opens a named new tab to preserve draft entries; footer links use normal same-tab navigation. The secondary footer avoids repeating header/mobile routes, indicates the current page, and uses 44px-high links with wrapping on narrow screens.

## Shared content boundary

Usable desktop content is capped at 1,280 CSS pixels. The `--content-width` token owns that boundary; `--container-width` adds the shared responsive gutters. Normal `.wrap` sections and the hero use the outer container, while `--content-inset` aligns the full-width utility bar, masthead, and footer to the same content edges. Background bands remain full width. Never remove the hero cap at a large-screen breakpoint.

The quick-access strip uses a full-width section around `.quick-strip-inner`, whose three-card grid caps at the usable content width. On phones the grid still becomes a full-width vertical stack with the existing inset link text. Keep card appearance and focus rules on the inner grid's links.

Use `--column-gap` for primary two-column layouts: 32–64px, with existing smaller-screen overrides. Viewport growth should add outer margins rather than indefinitely widening the space between related content. Long-form `.prose`, constitution, and policy reading columns use a 75ch maximum; padded reading wrappers add their gutters outside that measure. Policy copy aligns to the main content's left edge on wide screens. This is a presentation rule; source content, government geography, and the separate voter-card publication are unchanged.

## Completed-election homepage reference

A compact, neutral 2026 resources block follows Donate. It renders src/content.json homeElectionReferences and the shared PartyReveal URL. The completed-cycle label gives the historical material context. The voter card uses the existing internal vote-2026/ route in the same tab, including its website return link, downloads and scoped offline worker. PartyReveal opens a new tab with noopener/noreferrer and a visible notice. The links sit side by side on desktop and stack on phones. This is a reference route, separate from the primary recruitment actions.

After comparing the original scratched R, the owner requested a revised B: rounded corners, red R, and the original artwork’s blue and red. The owner selected the left-aligned partial R for the website header, footer, and favicon. After a regular build, npm run preview:brand creates a local-only revised-B masthead proof with the original artwork for comparison. Ordinary builds remove it; CI does not invoke this command.

The selected mark is registered as gage-county-gop-mark. Its original SVG owns the geometry and sampled legacy colors; the display derivative is copied without rasterizing. The favicon is generated from that same asset. The shared shell uses the mark with empty alt text alongside the readable party name, and versions image/icon URLs with the source hash. The two wordmark lines use proportional type sizes and tracking so their widths align across desktop and phone sizes. Earlier G and R proposals remain in repository review material. The historical voter-card publication retains its own archived branding.

## Sticky masthead

The shared header sticks at the viewport top with an opaque paper background, existing bottom rule, and a soft ink shadow. Location and meeting notices remain ordinary page content. The header establishes its own stacking layer, with native modal dialogs above it.

A ResizeObserver measures the rendered header and sets --header-height, with responsive CSS fallbacks when JavaScript is unavailable. Root scroll padding, document sidebars and the supervisor panel share --sticky-inset (header height plus 24px). Native anchor navigation and the existing active-section underline use that same reading line. Long desktop topic lists and the open mobile menu can scroll within the available viewport height. Print output makes the header and document disclosure static and removes the shadow.

## Shared palette and donation artwork

brand.palette in src/content.json selects the website theme. The current logo-blue setting uses logo blue #3A4B5F with the prior muted red #AC352C and light button labels. Set it to original to restore the former blue #142D36. The rejected full bright-red theme has been removed. The shared shell keeps browser theme-color in sync. The approved logo and QR artwork retain their own original colors; the voter card keeps its archived publication theme.

The desktop/tablet donation holder is 256px square, containing a 220px QR image. Its white background and padding belong to the image link; the figure caption sits below on the donation band. At 700px and below the entire QR figure and caption are hidden, and the donation text and button occupy one full-width column. Helper copy supports the direct campaign link without referring to a hidden QR.

scripts/build-donation-qr.py prepares the selected verified artwork using its registered source hash and payload record. The full-size 1254px edited master is retained in assets/originals; the 640px lossless PNG display derivative reduces transfer size. Decode the prepared image and a browser screenshot after changing its artwork or dimensions. Superseded plain QR artwork remains archived and excluded from public output.
