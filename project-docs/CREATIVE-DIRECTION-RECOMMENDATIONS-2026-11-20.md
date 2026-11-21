# Creative direction recommendations

**Date:** November 20, 2026
**Status:** Approved by the owner and implemented locally on November 20, 2026.
**Basis:** [Observed review and breakpoint evidence](CREATIVE-DIRECTION-REVIEW-2026-11-20.md), followed by the owner's clarifications. The text below preserves the reviewed recommendations; subsequent implementation is recorded in REFACTOR-PLAN.md, CONTACT-AND-MEETING-OPERATIONS.md, and VALIDATION.md. Statements below describing the review-only state are historical.

## Direction

Retain the site's local character, warm paper, dark ink, serif typography, and restrained red. Change the order and meaning of the emphasis so the experience answers three practical questions: When can I come? How can I help? How will I hear about important changes?

The current design is a useful information destination. Its next refinement should make participation equally clear. Governing documents and the government guide remain valuable, directly accessible references; they do not need to be prerequisites for attending or expressing interest.

These are informed design judgments, not claims of measured conversion improvements. The review found no horizontal overflow at its four principal sizes. The proposed changes address task clarity and attention, rather than an assumed technical failure.

## Owner-confirmed requirements

| Topic | Confirmed requirement |
| --- | --- |
| Meetings | Newcomers can attend without an invitation, RSVP, or existing membership. |
| Contact list | It serves both interested people and existing participants. “Already registered” means the GOP already has a means of contacting them, not voter registration. |
| Access | The executive team or an appointed committee member will have access to a private Google-held record. |
| Communications | Email/text updates are currently manual. Messages will be infrequent and important, such as meeting cancellations and changes. |
| Future | A PWA is a future possibility, not part of the present implementation scope. |

## Main navigation and orientation

Recommended desktop order:

**Meetings & events · Get involved · About · Resources · Donate**

The logo remains Home. Donate stays last, as previously requested. Get involved opens the future opportunities page. Its global presence matters because visitors may arrive directly on an interior page rather than traverse the homepage.

Use “Get involved” as the opportunities page's title and main-navigation label. Its body can describe committees and other ways to help. Reserve “Party organization” for the Resources section explaining the county committee, executive committee, convention, and governing procedures. This preserves those procedural records while making their purpose distinct.

Keep Constitution, Platform, Local government, voter-card references, and Party Reveal out of the main navigation. Put them in a clear Resources index. Place party documents before completed-election references, and label the 2026 material as a completed-cycle reference. Include the government guide in that index as well as its homepage bar and footer link.

Add a small “Meeting updates” utility link in the masthead's existing upper strip, replacing redundant organization text where space permits. On phones, include that link in the menu rather than forcing another control beside the logo. Keep Contact in the footer and in contextual links. Footer destinations should include Get involved, Meeting updates, Resources, Local government, and Contact.

Use a parent-section indication on document pages, with a breadcrumb or an explicit “Back to Resources” link. Do not assign aria-current="page" to Resources when the reader is on a different page. Preserve the current-section underline within desktop document sidebars.

## Homepage order

| Order | Proposed content | Purpose and constraint |
| --- | --- | --- |
| 1 | Compact next-meeting strip directly below the masthead | Date, time, short venue label, and a Meeting details link. Present on public pages, so attendance information is available beyond the homepage. |
| 2 | Shorter welcome hero | Keep the courthouse and local voice. Make the invitation explicit. Primary action: “Come to the next meeting.” Secondary: “Explore ways to help.” |
| 3 | Full meeting card | Put the practical details immediately after the hero, before the quick-access strip. Add the confirmed newcomer welcome, directions when verified, calendar options, and an updates link. |
| 4 | Reordered three-card strip | **Get involved · Platform · Constitution.** The future involvement destination becomes the featured first card, using the existing red treatment. Preserve direct access to both documents. |
| 5 | People and local activity, with a brief About introduction | Show real activity before the larger support asks. Use a few purposeful photos with specific captions and one clear gallery route. |
| 6 | “Stay informed” contact section | Brief explanation of rare, important messages, with “Add my details” and “Update my details” actions leading into one short intake flow. |
| 7 | Compact local-government reference bar | Preserve the useful guide and footer destination. This is a reference route, not a central recruitment step. |
| 8 | Donation section, followed by footer | Keep Venmo and the same-phone link. Reduce the section's dominance, particularly on phones, while keeping the donation route easy to find. |

This deliberately changes earlier homepage ordering and which card is featured. Those earlier choices are not implementation mistakes; this is a proposed adjustment to the now-explicit participation goals.

Avoid adding a full eight-committee catalog to the homepage. The featured card should describe the kinds of participation available in a short, accurate sentence; the destination page carries the actual opportunities. Do not invent committee names or workloads for that teaser.

## Meeting visibility and change notices

**Yes, accompany the full meeting card with a compact top notice.** It supplies timely information; the full card supplies detail. Keep the strip in ordinary document flow, rather than using a flashing announcement or an overlay. The header and notice must not consume most of a phone's first screen.

A normal strip could read: “Next meeting: December 8 · 7 p.m. · 402 Sports Bar & Grill · Details.” The full card can say: “New here? You're welcome. No RSVP required.” Exact copy remains a proposal, and the event date must come from the maintained meeting source rather than a second manually edited string.

For a cancellation or material change, the strip's role changes: show the affected date and explicit status, such as “December 8 meeting canceled,” with a link to the current meeting details. A changed venue notice should name the new venue. Do not let a cancellation disappear merely because a recurring date calculation advances to the next month.

Maintain one authoritative public meeting record, with a specific-date override for a cancellation, rescheduling, or venue change. The homepage, top strip, Events page, and calendar outputs should reflect it. The update record should have a checked/updated time and an identified team owner. This is a proposed content requirement; no exception handling was added to the current code.

Explain both calendar actions consistently wherever they appear. “Add this meeting” and “Add monthly meetings” are clearer than an unexplained “Add All.” Preserve the monthly second-Tuesday explanation. A calendar-file import is a snapshot, not enrollment in email/text alerts; the alert signup must remain a separate, clear choice.

## Involvement page and follow-through

Assume the forthcoming content includes the actual opportunities. Give each opportunity a plain title, what the work involves, whether a small one-time contribution is possible, approximate commitment where known, and a clear interest action. Do not promise that a particular seat or role is available until confirmed.

A person should be able to express interest without already knowing the formal committee structure. Include an “I'm not sure where I fit” route. Committee-interest actions can identify the selected opportunity in the intake, avoiding a second explanation by the visitor.

The team should receive a usable inquiry, not just an anonymous page view. Show an acknowledgment that accurately explains the next step. Identify the executive-team role or appointed member responsible for responding before publishing a response-time promise. The owner confirmed access responsibility, but a specific operational owner and response interval remain implementation decisions, not established facts.

Link this opportunities page from About and Contact when the visitor's intent is to help. Keep the formal governance link separately labeled for readers who want to understand how the party is organized.

## Homepage contact section and private records

**Yes, include a homepage contact section.** Its purpose is reliable notice delivery and maintaining current details. It should not be called a newsletter or presented as registering to vote, enrolling in the Republican Party, or automatically accepting a committee position.

Suggested introductory copy:

> Stay informed.
>
> Receive occasional, important Gage County GOP notices, including meeting changes and cancellations. Add your contact details or update the information we already have.

Keep a compact homepage block with the two clear actions. Use one dedicated short form behind them rather than placing a tall, generic form embed in the homepage. Link to the same intake from Meetings, Get involved, Contact, and the footer. A future implementation can test an inline form if it remains short and usable; it is not essential to the recommendation.

### Proposed intake

| Field or choice | Purpose |
| --- | --- |
| Add my details / Update my details | Establish the task without asking about voter registration. |
| Name | Identify the person for human review. |
| Email and/or mobile number | At least one usable contact method; do not require both merely to join the list. |
| Email notices / Text notices | Explicit, independent choices. A supplied phone number alone is not an instruction to send texts. |
| Town/community, optional | Useful context if the team needs it; no full street address by default. |
| Committee interest, optional | A separate request to be contacted about helping, not a compulsory step in receiving meeting notices. |
| Previous contact method, conditional and optional | Help staff match an update when the email/number itself has changed. Do not display existing records to the submitter. |

Keep a brief privacy explanation beside the submit action: intended use, the executive team's/appointed member's access, the owner's no-selling/no-passing-along commitment, and how to update or stop notices. Distinguish infrequent notices from direct replies to a volunteer inquiry. Neither should imply an ongoing promotional mailing campaign.

### Private Google record

I recommend a **private Google Sheet rather than a free-form Google Doc** for the contact register. Structured records are easier to maintain, deduplicate, export, and eventually migrate into an application. A public Google Form feeding a restricted Sheet is a proportionate first implementation to evaluate. Google documents that Forms can store responses in a linked Sheet; this does not require a PWA.

The form may be public while the responses and contact register remain restricted to named authorized accounts. Do not publish the Sheet, expose a public contact lookup, or enable respondent-visible results summaries. Google notes that such summaries can reveal full-text responses. Check form and Sheet access separately, rather than assuming one sharing setting covers both.

An update submission should be a **request for staff review**, not an automatic overwrite of an existing contact. A claimed email address is not proof of identity. Staff should match the entry and confirm material contact changes as needed. Keep a review status, updated date, communication choices, and a record of withdrawals. The current contact register is authoritative; raw incoming submissions are an intake log, not a second live roster. Both can be tabs in the same restricted workbook.

Avoid requiring a Google account solely to submit ordinary contact details. Google notes that enabling the one-response limit requires sign-in. A future pilot should verify the actual guest experience on a phone, including any Google sign-in prompt, rather than assuming its settings produce a frictionless flow.

No form or Sheet is configured by this document. A form captures information; it does not by itself deliver or manage the group's email/text notices. Manual team maintenance and sending remain the initial operating model. Protect recipients' details when sending, using individual messages or appropriate private-address email handling rather than exposing the contact list to the group.

### Cancellation workflow

1. Record the affected meeting's cancellation/change in the public meeting source.
2. Confirm that the website displays the exact date and status correctly.
3. Send the important notice through each person's chosen available channel, with a link to the current meeting information.
4. Record that the notice was sent, handle failed delivery, and incorporate returned contact corrections.

A one-time confirmation after signup and a clear update/stop-notices path support reliability. Do not promise every message will be delivered or read. Adding a calendar event, providing contact details, receiving important notices, and expressing committee interest are distinct actions.

## Color, typography, and screen sizes

### Color and emphasis

Keep the existing ink, warm paper, soft background, and red. The measured text-token contrast is a useful foundation. Use red's strongest emphasis for the immediate participation action or featured involvement tile, rather than the constitution. Keep ordinary links and reference cards quieter. A cancellation requires explicit words and a recognizable notice treatment; its meaning cannot depend on red alone.

Reduce unnecessary competing shadows and large fields of emphasis. The dark donation band can remain, with less vertical padding and a smaller QR presentation on phones. Keep a directly tappable payment link; a person using the same phone cannot scan their own screen conveniently.

Retain the courthouse image as local identity. Real activity photography then supplies the human side of the organization. Do not replace factual local images with generic political stock art. Keep the site clearly identified as the county party, not an official county government publication.

### Desktop

Keep a balanced hero and readable measures, but reduce its height enough to expose more of the next task. The first viewport must show the meeting strip and a clear participation action; the entire detailed card does not need to fit above every possible fold. Make the main-navigation text comfortable rather than shrinking it to preserve a layout at all costs.

### Tablet

Treat the 768px composition deliberately. The current two-column hero wraps “Your connection” awkwardly and compresses the photograph and credit. Use a wider text measure or a stacked composition in that range, with restrained photo height. Choose the header collapse point based on the proposed labels' actual space requirements; do not force the expanded navigation into 11px type simply because the old 900px threshold allowed it.

### Phone

Put the practical action ahead of decorative height. Reduce the 380px courthouse block and long introductory spacing so meeting details arrive sooner. Preserve the proposed task order when sections stack. Make the meeting strip wrap naturally into a few readable lines rather than a ticker or carousel.

Keep body text readable, controls comfortably tappable, and labels explicit. Consider a collapsible “Jump to a topic/article” control for the long documents, rather than a dense wall of 11px links. Preserve plain anchors and the full source text. On the government guide, promote the existing question routes before the long explanatory diagram, while retaining its jump links and full-height maps.

Use a compact return-to-section or return-to-top route in long reference content. Keep navigation and action labels consistent across widths. Do not make primary content depend on hover.

## Priorities and review gates

| Priority | Proposed work | How to evaluate it |
| --- | --- | --- |
| First | Global Get involved route; distinct governance/opportunity labels; meeting strip and earlier full card | A newcomer can find the next date, understand they may attend, and find ways to help without reading the constitution first. |
| First | Define the add/update contact flow and private operating owner | An interested person can provide a chosen contact method; an existing contact can request an update without seeing anyone else's data. |
| Next | Reorder quick access; move people/activity ahead of donation; make the homepage contact block visible | Each core task has an explicit entry, and the page's strongest emphasis matches participation rather than reference reading. |
| Next | Tablet hero, navigation type size, mobile section heights, reference jump controls | Real content remains readable at the four reviewed sizes and with enlarged text, without horizontal page overflow or hover-only access. |
| Later | Future PWA and possible notification capabilities | Preserve clean data and public/private boundaries now; choose authentication, delivery, offline behavior, and notification scope as a separate project. |

Before implementation, test the proposed labels and order with a few people unfamiliar with the current site. Ask them to find the next meeting, locate an opportunity, request a contact update, and find the assessor's office. Observe task completion and wrong turns; do not lead them through the design. This tests the review's hypotheses without claiming a quantified improvement in advance.

When launched, use practical outcomes: new attendees, useful committee inquiries, usable contact additions/updates, follow-up completion, and successful delivery of important notices. Page views alone do not establish involvement. No analytics installation is proposed or performed here.

## References and scope boundary

Google capability references, checked during the review:

- [Choose where to save form responses](https://support.google.com/docs/answer/2917686)
- [Publish and share a form with responders](https://support.google.com/docs/answer/2839588)
- [View and manage form responses](https://support.google.com/docs/answer/139706)

The form and data-handling design above is my recommendation, informed by those capabilities and the owner's requirements. It is not Google's assurance that an uninspected form is private. No member information was accessed or recorded in this repository. The recommendations introduce no PWA, messaging automation, new service subscription, or implementation approval.

Verification: all 19 snapshotted implementation files retain their review-start checksums. Only the review and recommendation documents were updated in this follow-up. No build, commit, deployment, Google document/form setup, or contact-data access occurred.
