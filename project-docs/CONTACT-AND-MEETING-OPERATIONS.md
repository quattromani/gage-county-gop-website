# Contact intake and meeting maintenance

Implemented November 20, 2026 after owner approval. The website is still a local review build. The Google intake form is published and accepts anonymous responses; its linked register is private. No live-site deployment is part of this work.

## Public and private boundaries

- `src/contact-intake.json` holds only the public responder URL, observed prefilled task URLs, and the public interests-field key. No private register or form-editor links are in the public build.
- Open the private **Gage County GOP — Private contact register** workbook in the owner's Google Drive `ChatGPT` folder. It has Contacts, Form Responses 1, and Instructions tabs. Use the linked Form's editor for settings and response notifications.
- The workbook and Form editor currently have only the owner's access. Named executive-team or appointed-member Google accounts must be supplied before inviting collaborators. Check Form and workbook access separately. Never enable public results, publish the workbook, or expose a contact lookup.
- The form allows add, update, and stop requests; email, text, both, or reply-only choices; one required email/mobile contact; an optional additional method; optional previous contact, community, and interests. Google sign-in is optional, not required. One response per account is off. Respondent results summaries and response editing are off.
- The owner enabled new-response email notifications. These are administrative alerts about incoming requests, not messages sent to contacts. Public confirmation acknowledges receipt for review, not a completed register change.
- No real member records were accessed or imported. One clearly marked fictional QA response remains in Form Responses 1. Do not add it to Contacts or contact its example.com address. Contacts starts empty.

## Review incoming requests

1. Review Form Responses 1. Its timestamp is incoming evidence; it is not the reviewed contact register. Record the response source and timestamp when maintaining Contacts.
2. Check that the selected channel has a usable email/number. A supplied phone number alone does not grant permission for texts. If someone requests both but supplies only one method, clarify before marking both enabled.
3. For additions, create a stable Contact ID and record confirmed communication choices. Use Active, Pending review, or Suppressed status; record reviewer and reviewed date. Do not send notices to pending/unconfirmed records.
4. For updates, match an existing contact and confirm material changes when necessary. A submitted name/email is not proof of identity. Preserve the Contact ID and review notes. Never overwrite automatically.
5. For stop requests, disable the affected channel(s) and retain the withdrawal source/date. Preserve a suppression record so a future list import does not silently re-enable notices.
6. An interest inquiry is separate from ongoing notices and appointments. Team links prefill the team and reply-only choice. Reply to the inquiry manually. No membership or committee appointment is created by the form.
7. Send notices manually, only using chosen channels. Use individual messages or appropriate private-address email handling. Do not expose recipients to each other. Record delivery failures and incorporate corrections.

The owner/executive team must assign the routine reviewer and follow-up process. The website makes no response-time promise. There is no automated confirmation email, text delivery, PWA, or push service.

## Meeting source

Edit `meeting` in `src/content.json`. The base schedule is the second Tuesday, 7 p.m. America/Chicago, 402 Sports Bar & Grill, Beatrice. `startHour` is a number, not a string. `firstDate` is a real second Tuesday. The owner confirmed this schedule on November 20, 2026.

Use `overrides` for specific occurrences. `date` is always the original scheduled second Tuesday. Every override requires a status, an explicit public message, confirmedBy, and ISO updatedAt. Do not delete the base occurrence to announce a cancellation.

```json
{
  "date": "2026-12-08",
  "status": "canceled",
  "message": "The December 8 meeting is canceled. [Replace with confirmed public details.]",
  "confirmedBy": "[Name or team role that confirmed the change]",
  "updatedAt": "2026-12-07T18:00:00Z"
}
```

This is a documentation example, not an actual cancellation. Other statuses:

| Status | Additional fields | Behavior |
| --- | --- | --- |
| changed | venue/city, and startHour + time if the hour changes | Same date, revised details and explicit notice |
| rescheduled | newDate, optionally venue/city/startHour + time | New effective date, stable original occurrence identity |
| canceled | No newDate | Canceled date remains visible through that day; single-meeting action is hidden |

The shared module drives the global strip, meeting cards, current venue/directions, single-event files, and recurring calendar exceptions. A moved meeting remains announced through its original date even if moved earlier or beyond another regular occurrence. The detailed card can show the next upcoming meeting alongside that retained notice. The strip uses existing dark ink blue; dated changes use the existing red, with explicit words.

After an authorized change: build/check, inspect the exact date/status on the local site, then use the normal deployment workflow when authorized. Separately send the important notice manually through the contact's selected available channel. Record sending and failed delivery. Calendar imports are snapshots, not subscriptions or notice enrollment. Previously imported files will not automatically receive website changes.

Client JavaScript advances the current event at Central midnight and when a tab becomes visible. Without JavaScript, the build-time HTML/file remains a snapshot; rebuild periodically for that fallback. Monthly recurrence remains local-time aware. No end time or attendees are invented.

## Committee content

`src/participation.json` is the source for the seven teams from the owner's photograph: Candidate Survey, Public Relations, Recruiting, Fundraising, Podcast, Program, Education. Education includes school Constitution Day on September 17 and Patriot Academy classes. General descriptions are editorial summaries, not promises of vacancies, appointments, duties in bylaws, or time commitments. Confirm any leader, workload, active project, or opening before adding it.

Keep the Get involved opportunities separate from Party organization in Resources. When changing the Google form, regenerate public task/interest links in its Pre-fill form UI and update the observed field key; verify task, notice preference, and team text on the signed-out form before publishing site links.

Public Google Form links open in a separate tab/window according to browser settings. The site explains the handoff before the committee links and on the Updates page; the form keeps the selected task/team and notice preference. Normal internal site links keep their existing behavior.
