const months = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });
const fullDate = new Intl.DateTimeFormat("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
const shortDate = new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", timeZone: "UTC" });

function secondTuesday(year, month) {
  return 1 + ((2 - new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 7) % 7) + 7;
}
function localDate(now, timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const value = Object.fromEntries(parts.map(({ type, value }) => [type, value]));
  return `${value.year}-${value.month}-${value.day}`;
}
function validDate(value) {
  const date = new Date(`${value}T12:00:00Z`);
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
export function validateMeetingConfig(config) {
  if (config.recurrence !== "second-tuesday-monthly") throw Error(`Unsupported meeting recurrence: ${config.recurrence}`);
  if (config.timeZone !== "America/Chicago") throw Error("Meeting calendars require America/Chicago");
  if (!validDate(config.firstDate)) throw Error("Meeting firstDate must be a real ISO date");
  const [firstYear, firstMonth, firstDay] = config.firstDate.split("-").map(Number);
  if (firstDay !== secondTuesday(firstYear, firstMonth)) throw Error("Meeting firstDate must be the second Tuesday");
  if (!Number.isInteger(config.startHour) || config.startHour < 0 || config.startHour > 23) throw Error("Meeting startHour must be an integer from 0 to 23");
  if (!config.time?.trim() || !config.confirmedBy?.trim() || !Number.isFinite(Date.parse(config.calendarUpdatedAt))) throw Error("Meeting schedule needs a display time, confirmedBy and calendarUpdatedAt");
  const speakerDates = new Set();
  for (const speaker of config.guestSpeakers || []) {
    if (!validDate(speaker.date) || speakerDates.has(speaker.date) || speaker.date < config.firstDate) throw Error("Guest speakers require unique scheduled dates");
    const [year, month, day] = speaker.date.split("-").map(Number);
    if (day !== secondTuesday(year, month)) throw Error("Guest speaker date must identify a scheduled monthly occurrence");
    if (!speaker.name?.trim() || !speaker.title?.trim() || !speaker.confirmedBy?.trim() || !Number.isFinite(Date.parse(speaker.updatedAt))) throw Error("Guest speakers need a name, title, confirmedBy and updatedAt");
    speakerDates.add(speaker.date);
  }
  const seen = new Set();
  for (const entry of config.overrides || []) {
    if (!validDate(entry.date) || seen.has(entry.date)) throw Error("Meeting overrides require unique, real dates");
    const [year, month, day] = entry.date.split("-").map(Number);
    if (day !== secondTuesday(year, month) || entry.date < config.firstDate) throw Error("Override date must identify a scheduled monthly occurrence");
    if (!["canceled", "changed", "rescheduled"].includes(entry.status)) throw Error("Unknown meeting override status");
    if (!entry.message?.trim() || !entry.confirmedBy?.trim() || !Number.isFinite(Date.parse(entry.updatedAt))) throw Error("Meeting overrides need a message, confirmedBy and updatedAt");
    if (entry.status === "rescheduled" && (!validDate(entry.newDate) || entry.newDate === entry.date)) throw Error("Rescheduled meetings need a different, real newDate");
    if (entry.status !== "rescheduled" && entry.newDate) throw Error("Use rescheduled status when changing a meeting date");
    if (entry.startHour != null && (!Number.isInteger(entry.startHour) || entry.startHour < 0 || entry.startHour > 23 || !entry.time)) throw Error("A changed hour needs an integer startHour and display time");
    if (entry.time != null && entry.startHour == null) throw Error("A changed display time also needs startHour for the calendar");
    seen.add(entry.date);
  }
}
function occurrence(config, nominalDate, override) {
  const date = override?.newDate || nominalDate;
  const [year, month, number] = date.split("-").map(Number);
  const day = new Date(Date.UTC(year, month - 1, number));
  const hour = override?.startHour ?? config.startHour;
  const localHour = Date.UTC(year, month - 1, number, hour);
  const offsetFormat = new Intl.DateTimeFormat("en-US", { timeZone: config.timeZone, timeZoneName: "shortOffset" });
  const offsetAt = (instant) => Number(offsetFormat.formatToParts(new Date(instant)).find(({ type }) => type === "timeZoneName").value.match(/^GMT([+-]\d+)$/)?.[1]);
  let instant = localHour;
  for (let i = 0; i < 3; i++) instant = localHour - offsetAt(instant) * 3_600_000;
  const offsetHours = offsetAt(instant);
  if (instant + offsetHours * 3_600_000 !== localHour) throw Error("Meeting hour does not exist during the daylight saving transition");
  if (!Number.isFinite(offsetHours)) throw Error("Unsupported time zone offset");
  const offset = `${offsetHours < 0 ? "-" : "+"}${String(Math.abs(offsetHours)).padStart(2, "0")}:00`;
  const venue = override?.venue || config.venue, city = override?.city || config.city;
  const guestSpeaker = override?.status === "canceled" ? null : (config.guestSpeakers || []).find((speaker) => speaker.date === nominalDate) || null;
  const updatedAt = [override?.updatedAt || config.calendarUpdatedAt, guestSpeaker?.updatedAt].filter(Boolean).sort((a, b) => Date.parse(b) - Date.parse(a))[0];
  return {
    guestSpeaker,
    date, nominalDate, dateLabel: fullDate.format(day), shortDateLabel: shortDate.format(day),
    monthLabel: months.format(day).toUpperCase(), dayLabel: String(number),
    dateTime: `${date}T${String(hour).padStart(2, "0")}:00:00${offset}`, time: override?.time || config.time,
    venue, city, location: `${venue}, ${city}`, status: override?.status || "scheduled",
    message: override?.message || "", updatedAt,
    confirmedBy: override?.confirmedBy || config.confirmedBy,
    originalDateLabel: fullDate.format(new Date(`${nominalDate}T12:00:00Z`)),
  };
}
export const guestSpeakerLabel = (meeting) => meeting.guestSpeaker ? `${meeting.guestSpeaker.title} ${meeting.guestSpeaker.name}` : "";
export const meetingStatusLabel = (meeting) => ({ scheduled: "Next meeting", canceled: "Meeting canceled", changed: "Meeting update", rescheduled: "Meeting rescheduled" })[meeting.status];
export function retainedMeetingText(meeting, notice) {
  return notice.nominalDate !== meeting.nominalDate ? `The ${notice.originalDateLabel} meeting has been rescheduled to ${notice.dateLabel}. ${notice.message}` : "";
}
export function nextMeeting(config, now = new Date()) {
  validateMeetingConfig(config);
  const today = localDate(now, config.timeZone);
  const overrides = new Map((config.overrides || []).map((entry) => [entry.date, entry]));
  const candidates = [];
  let [year, month] = (today > config.firstDate ? today : config.firstDate).slice(0, 7).split("-").map(Number);
  for (let i = 0; i < 14; i++) {
    const date = `${year}-${String(month).padStart(2, "0")}-${String(secondTuesday(year, month)).padStart(2, "0")}`;
    if (date >= config.firstDate && !overrides.has(date)) candidates.push(occurrence(config, date));
    month += 1;
    if (month === 13) { month = 1; year += 1; }
  }
  // Include rescheduled occurrences whose original month has already passed.
  for (const entry of overrides.values()) candidates.push(occurrence(config, entry.date, entry));
  return candidates.filter((entry) => entry.date >= today).sort((a, b) => a.date.localeCompare(b.date))[0];
}
export function meetingNotice(config, now = new Date()) {
  const next = nextMeeting(config, now);
  const today = localDate(now, config.timeZone);
  // Keep the affected nominal date visible through that day, even if moved
  // earlier or beyond another regular meeting. The card still shows what is next.
  const relevant = (config.overrides || []).filter((entry) => entry.date >= today && entry.date <= next.date).sort((a, b) => a.date.localeCompare(b.date));
  return relevant.length ? occurrence(config, relevant[0].date, relevant[0]) : next;
}
const escapeText = (value) => String(value).replaceAll("\\", "\\\\").replaceAll("\n", "\\n").replaceAll(",", "\\,").replaceAll(";", "\\;");
const stamp = (value) => new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
function fold(line) {
  let result = "", chunk = "";
  for (const character of line) {
    if (new TextEncoder().encode(chunk + character).length > 75) { result += chunk + "\r\n"; chunk = " "; }
    chunk += character;
  }
  return result + chunk;
}
const seriesUid = "gage-county-gop-second-tuesday@quattromani.github.io";
function eventLines(meeting, uid, updatedAt, recurrenceId) {
  return ["BEGIN:VEVENT", `UID:${uid}`, `DTSTAMP:${stamp(updatedAt)}`,
    ...(recurrenceId ? [`RECURRENCE-ID:${stamp(recurrenceId)}`] : []),
    `DTSTART:${stamp(meeting.dateTime)}`, `STATUS:${meeting.status === "canceled" ? "CANCELLED" : "CONFIRMED"}`,
    `SUMMARY:${meeting.status === "canceled" ? "CANCELED: " : ""}Gage County GOP meeting`,
    `LOCATION:${escapeText(meeting.location)}`,
    `DESCRIPTION:${escapeText(`${meeting.message ? `${meeting.message} ` : ""}${meeting.guestSpeaker ? `Guest speaker: ${guestSpeakerLabel(meeting)}. ` : ""}Gage County GOP meeting at ${meeting.venue}, ${meeting.city}. Starts at ${meeting.time} Central Time. Check the party website for changes; calendar imports do not subscribe you to alerts.`)}`,
    "URL:https://www.gagecountygop.org/", "END:VEVENT"];
}
export function meetingCalendar(meeting, updatedAt) {
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Gage County GOP//County Meetings//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "X-WR-CALNAME:Gage County GOP Meetings", "X-WR-CALDESC:Meeting events from the Gage County Republican Party",
    ...eventLines(meeting, `gage-county-gop-meeting-${meeting.nominalDate || meeting.date}@quattromani.github.io`, meeting.updatedAt || updatedAt), "END:VCALENDAR"];
  return lines.map(fold).join("\r\n") + "\r\n";
}
export function meetingSeriesCalendar(config) {
  validateMeetingConfig(config);
  const first = occurrence(config, config.firstDate);
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Gage County GOP//County Meetings//EN", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", "X-WR-CALNAME:Gage County GOP Meetings",
    "BEGIN:VTIMEZONE", `TZID:${config.timeZone}`, "BEGIN:DAYLIGHT", "DTSTART:20070311T020000", "TZOFFSETFROM:-0600", "TZOFFSETTO:-0500", "TZNAME:CDT", "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=2SU", "END:DAYLIGHT", "BEGIN:STANDARD", "DTSTART:20071104T020000", "TZOFFSETFROM:-0500", "TZOFFSETTO:-0600", "TZNAME:CST", "RRULE:FREQ=YEARLY;BYMONTH=11;BYDAY=1SU", "END:STANDARD", "END:VTIMEZONE",
    "BEGIN:VEVENT", `UID:${seriesUid}`, `DTSTAMP:${stamp(config.calendarUpdatedAt)}`,
    `DTSTART;TZID=${config.timeZone}:${config.firstDate.replaceAll("-", "")}T${String(config.startHour).padStart(2, "0")}0000`,
    "RRULE:FREQ=MONTHLY;BYDAY=2TU", "SUMMARY:Gage County GOP meeting", `LOCATION:${escapeText(first.location)}`,
    `DESCRIPTION:${escapeText(`Gage County GOP meeting at ${first.venue}, ${first.city}. Starts at ${first.time} Central Time. Check the party website for schedule updates. Calendar imports do not subscribe you to alerts.`)}`,
    "URL:https://www.gagecountygop.org/", "END:VEVENT"];
  // Speaker announcements are dated exceptions, never part of the recurring master.
  const exceptions = new Map((config.guestSpeakers || []).map((speaker) => [speaker.date, null]));
  for (const entry of config.overrides || []) exceptions.set(entry.date, entry);
  for (const [date, entry] of exceptions) {
    const original = occurrence(config, date);
    const meeting = occurrence(config, date, entry);
    lines.push(...eventLines(meeting, seriesUid, meeting.updatedAt, original.dateTime));
  }
  lines.push("END:VCALENDAR");
  return lines.map(fold).join("\r\n") + "\r\n";
}
