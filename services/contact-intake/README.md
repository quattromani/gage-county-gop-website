# Website contact intake service

A Sheet-bound Google Apps Script receives the site's custom contact form and appends reviewed-later requests to **Incoming requests**. It never reads or changes Contacts, exposes contact rows, or sends notices. Source: Code.gs and appsscript.json. The website's public endpoint is in src/contact-intake.json.

## Deploy or update

1. Open the private contact workbook, then Extensions → Apps Script. Keep the project bound to that workbook.
2. Copy Code.gs and the manifest from this repository into their matching editor files. Confirm the selected filename before pasting. Save and check for syntax errors.
3. Run setupContactIntake once from the bound editor. It stores the parent file ID in private Script Properties and initializes Incoming requests. It leaves Contacts and legacy Form Responses 1 alone. The private ID is not part of the website's source or payload.
4. Use a Web app deployment, executing as the owner, with access **Anyone**. Visitors must not need a Google login. When changing server code, update the existing deployment to a new version so its public URL remains stable.
5. Authorize only the declared Sheets scope. Google describes it as access to all the owner's Google Sheets spreadsheets. The owner explicitly approved this on November 21, 2026. The implementation targets only the configured workbook and Incoming requests. Do not add services or widen the implementation without review.
6. Keep a matching public /exec URL in src/contact-intake.json. Run npm run check and make a clearly marked synthetic request from a signed-out browser. Verify both the website receipt and private Incoming requests row before claiming delivery works.

A bound web app cannot use getActiveSpreadsheet at request time; setup runs inside the editor and stores the ID for openById. Google documents that distinction in https://developers.google.com/apps-script/guides/bound. Authorization details: https://developers.google.com/apps-script/guides/services/authorization.

## Contract and limits

POST a URL-encoded payload parameter containing the bounded JSON schema validated in Code.gs. The browser uses a normal CORS request with credentials omitted and reads the JSON receipt after redirects. Never use opaque no-cors replies as proof of delivery. A receipt must contain ok:true and the exact requestId.

The client generates a request UUID and reuses it for retries of unchanged values. The service locks writes, matches UUID/digest, appends once, and flushes before confirming. Edited values require a new request UUID. Header order is checked before writes; do not rename or reorder Incoming requests headers independently of the service.

Server validation enforces tasks, notice choices, contact formats, lengths, schema version and an empty honeypot. Spreadsheet cells are protected from formula interpretation. Best-effort cache limits are 100 new requests/hour globally and 5/contact/hour; they are basic abuse controls, not authenticated access or comprehensive denial-of-service protection. Google service quotas still apply.

GET returns only a service name/version. POST returns a request ID or generic failure, never a contact lookup. No private data is placed in URLs, browser storage or application logs. The script does not create committee memberships or change communication preferences automatically.

Incoming requests is an inbox. Staff must manually review additions, match updates, honor stops, and preserve consent/source records in Contacts. Legacy Google Form response notifications cover only that old form; the custom inbox currently has no automatic admin email notification. Monitor both inboxes during transition. Outbound email/text sending remains manual.

Version 1 deployed and anonymously tested November 21, 2026. Keep marked QA rows out of Contacts. The new front end remains locally reviewable until its source is committed/pushed through the normal preview workflow.
