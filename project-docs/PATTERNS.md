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

Above 900px the flag is 70px wide with original proportions, immediately to the right of the logo and wordmark. The desktop navigation follows with an automatic left margin so its last link aligns with the header’s right content edge. At 900px and below it is hidden, and the native details/summary Menu control uses red, white, and navy bars. The white bar has a subtle edge for contrast on cream. Keep the visible Menu label, keyboard behavior, focus outline, and all navigation links. The flag is decorative context, never a navigation control.

Contact is a plain footer link, rather than a boxed masthead action; it is also omitted from the mobile header menu. Contextual contact calls to action within page content remain available.

## Meeting event handoff

Meeting actions on Home, Events and Contact download descriptively named .ics files. Apple Calendar imports them through its normal import dialog. The event website is the party homepage, not the GitHub hosting URL. X-WR-CALNAME identifies Gage County GOP Meetings when a calendar application displays a calendar name. The physical LOCATION remains the venue and city. The single-event UID is date-specific; the recurring series has one stable UID. No end time, invitation sender, or attendees are invented.

A browser may still display the download origin as GitHub while hosting remains there. The event's visible website and venue are party-facing; domain configuration is separate.

Homepage quick-access labels, descriptions, and destinations are maintained in src/content.json. The third card opens the separate committee opportunities page; the Resources organization disclosures remain the procedural overview.

## Current sidebar section

Above 900px, every .topic-nav sidebar underlines the last linked section heading to reach the page’s native jump-link inset (32px root scroll padding plus any section scroll margin). Scrolling in either direction and native anchor navigation use the same reading line; no topic is marked before the first heading. The current link has aria-current="location" without changing keyboard focus or the URL. Updates run at most once per animation frame and also handle load, history restoration, and resizing. At 900px and below the current state is cleared. Plain jump links remain usable without JavaScript. The platform and constitution share this behavior, and future left sidebar document navigation should use the same .topic-nav component.

## Donation band and retained election band

The homepage Donate section replaces the seasonal election band and is the target of the last header link on desktop and mobile. It offers a Venmo button and a linked lossless QR with a four-module white quiet zone. Both use the exact decoded destination in src/content.json. Source decoding and the live image comparison are recorded there. The QR matrix is in src/donation-qr.json; scripts/build-donation-qr.py renders it at integer scale and refuses a mismatched destination hash. Keep the QR black on white, unfiltered, and unrotated.

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

Shared navigation is Meetings & events, Get involved, About, Resources, Donate. Meeting updates is a utility/mobile/footer route. Reference pages have a Resources breadcrumb without falsely marking Resources as the current page. Desktop document sidebars retain current-section underlines; native topic disclosures provide mobile jumps and close after selection.

The global meeting strip uses the existing ink blue with white text; explicit dated change notices use the existing red. Homepage order is shorter hero, full meeting card, Get involved/Platform/Constitution quick links, local activity, Stay informed, government reference, compact donation, contact and footer. On phones the full meeting card precedes its accompanying welcome copy.

Get involved renders src/participation.json. Team interest links prefill the public form with that team and reply-only, while a general unsure route remains available. Keep private form administration and roster records outside the public build. Dated overrides and calendars share src/meeting.mjs. See CONTACT-AND-MEETING-OPERATIONS.md.
