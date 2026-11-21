# On-site contact form

Owner approved conversion on November 21, 2026. The current local site replaces outgoing Google Form handoffs with a custom native dialog: full-screen on phones, modal on desktop. It keeps the same private Google workbook and human review. The prior Form and its response history remain intact. No roster lookup, automatic overwrite, outbound messaging, PWA, new team sharing, or production-domain changes.

## Implemented

- Add, update, stop and interest paths; committee preselection and reply-only defaults for inquiries.
- Autofill enabled with standard name/email/tel/address-level2 hints, suitable input types and mobile keyboards, one full-name field, and 16px input text. No saved personal browser profiles were accessed during testing.
- Native dialog, explicit focus containment/return, Close/Escape, independently scrolling body, phone-sized controls, field errors, retained input and a direct email alternative on service failure.
- Genuine matching-ID receipt after a successful append/flush; retry deduplication; server-side validation, bounded values, formula-safe spreadsheet strings, basic honeypot and rate limits.
- Sheet-bound Apps Script configured and deployed as owner with anonymous access. Its private workbook ID lives in Script Properties. Public GET reveals only service/version; POST exposes only a receipt or generic failure.
- Incoming requests is the new intake tab. Contacts remains the reviewed register; legacy Form Responses 1 remains separate. Native workbook instructions updated for the transition.

Google's Sheets permission is broad: see/edit/create/delete all Sheets spreadsheets. The owner reviewed and explicitly authorized it on November 21 before it was granted. The implementation targets only the configured workbook's Incoming requests tab; no contact rows are returned publicly. Keep script editor access restricted and review future service changes.

## Verification

- npm run check: 24 passing checks. New service checks cover independent server validation, channel rules, common autofill formats, append/flush sequencing, duplicate retries, changed-payload rejection, formula safety, generic failures/rate limits, and rejection of opaque/failed/mismatched/malformed client replies.
- Browser review at 320×740, 390×844, 768×1024 and 1280×800 CSS pixels: dialog fits, no horizontal page overflow, inputs remain 16px. Phone presentation fills the viewport; desktop uses a bounded modal.
- Name/email/phone/town autofill metadata inspected. Representative fictional profile formats pass validation. Actual saved-profile autofill and physical iOS/Android keyboards were not exercised.
- Error summary focus, inline errors, retained values after unavailable-service failure, keyboard wrap, Escape/focus return, and Candidate Survey/reply-only preselection manually verified.
- Signed-out in-app browser at 390px submitted one clearly marked fictional QA inquiry. The page remained committees.html, an on-site saved receipt appeared, and a matching Pending review row was verified in Incoming requests. Keep that QA row out of Contacts. No real member records accessed/imported.
- User-requested redundant handoff sentence removed from Updates.

Evidence lives in project-docs/review/on-site-contact-2026-11-21/. This is targeted coverage, not full accessibility certification, field performance measurement or cross-engine/real-device certification.

## Operations and release

Source and deployment runbook: services/contact-intake/README.md. Incoming requests requires manual review. Legacy Google Form admin notifications do not apply to the new custom inbox; no automatic admin email or outbound email/text delivery is configured. No contact information is persisted in browser storage, URLs, public source or diagnostic screenshots.

The submission endpoint is deployed and functional. Frontend changes are locally reviewable and have not been committed/pushed in this conversion task. Existing public preview, production Squarespace/DNS, and voter-card deployment remain outside this conversion's publication step.
