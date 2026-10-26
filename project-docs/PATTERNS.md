# Presentation patterns

The authoritative patterns are the generators in scripts/build.mjs and styles in src/style.css; the real pages serve as maintained examples.

- **Page header:** one h1, a short introductory paragraph, and a subject label. About, resources, and contact show the pattern.
- **Resource link:** a whole linked card with an explicit destination. Use for navigation, never for a disclosure action.
- **Organization disclosure:** a native details/summary element containing a brief organization overview; procedural details defer to the constitution. Resources demonstrates keyboard-operable closed/open states. Historical source records stay in the repository, outside the public site.
- **Meeting notice:** source data appears with uncertainty attached. Do not turn an unconfirmed year into a calendar event.
- **Photo story:** local image and explicit caption link to the related archive. Event-date claims require supporting source context.
- **Mobile menu:** native details/summary remains functional without scripts. Escape closes it and restores focus to summary when scripts are available.
- **Voter card:** imported as a separate path with its own existing styles and offline scope. Do not apply global site styles to its candidate presentation.

Tokens define ink, paper, red, muted text, lines, and spacing. Typography uses system fonts without remote font requests. Image and document links open native files; forms and payment widgets are not simulated. Use contact links when there is no verified backend. Public text addresses visitors directly; migration findings and source-capture notes belong in repository documentation.

The shared stylesheet and script include content-hash query versions. A changed asset receives a new URL, so returning browsers do not combine updated markup with cached old styles or behavior.

Meeting actions on the homepage, events, and contact pages link to the same generated iCalendar event. The date, UTC offset, venue, and city come from src/content.json. The event has a stable UID and explicit UTC start time; no end time or attendees are invented. It opens an .ics file without forcing a download, allowing the visitor to review it in their calendar application. It does not send email invitations or add events automatically. File encoding, escaping, and folding follow [RFC 5545](https://www.rfc-editor.org/rfc/rfc5545#section-3.6.1). Native calendar-app completion remains a user action.
