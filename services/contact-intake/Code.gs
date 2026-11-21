/** Gage County GOP append-only public contact intake. No roster lookup API. */
var INTAKE_VERSION = 'contact-notices-v1';
var INTAKE_TAB = 'Incoming requests';
var INTAKE_HEADERS = ['Received at', 'Request ID', 'Request digest', 'Request type', 'Name', 'Email', 'Mobile', 'Notice choice', 'Town or community', 'Previous contact', 'Committee', 'Interests or message', 'Review status', 'Notice wording version'];

// Run once from the Sheet-bound editor. The private file ID stays in Script Properties.
function setupContactIntake() {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  if (!book) throw new Error('Run setup from the contact register’s bound editor.');
  PropertiesService.getScriptProperties().setProperty('CONTACT_SHEET_ID', book.getId());
  var sheet = book.getSheetByName(INTAKE_TAB) || book.insertSheet(INTAKE_TAB);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(INTAKE_HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, INTAKE_HEADERS.length).setBackground('#142d36').setFontColor('#fffdf9').setFontWeight('bold').setWrap(true);
    sheet.setRowHeight(1, 48);
    sheet.setColumnWidths(1, INTAKE_HEADERS.length, 180);
    sheet.setColumnWidth(12, 300);
  }
  book.setSpreadsheetTimeZone('America/Chicago');
  console.log('Contact intake configured. Existing Contacts and legacy form responses are unchanged.');
}

function doGet() {
  return intakeJson_({ service: 'Gage County GOP contact intake', version: INTAKE_VERSION });
}

function doPost(event) {
  var lock;
  try {
    if (!event || !event.parameter || typeof event.parameter.payload !== 'string' || event.parameter.payload.length > 8000) throw new Error('Invalid request.');
    var submission = validateContact_(JSON.parse(event.parameter.payload));
    var fileId = PropertiesService.getScriptProperties().getProperty('CONTACT_SHEET_ID');
    if (!fileId) throw new Error('Intake is not configured.');
    lock = LockService.getScriptLock();
    if (!lock.tryLock(15000)) return intakeJson_({ ok: false, error: 'The service is busy. Please try again.' });
    var sheet = SpreadsheetApp.openById(fileId).getSheetByName(INTAKE_TAB);
    if (!sheet || sheet.getRange(1, 1, 1, INTAKE_HEADERS.length).getValues()[0].join('|') !== INTAKE_HEADERS.join('|')) throw new Error('Intake schema is unavailable.');
    var digest = intakeDigest_(JSON.stringify(submission));
    var count = sheet.getLastRow();
    // A retry after a lost response must not create a second incoming request.
    if (count > 1) {
      var match = sheet.getRange(2, 2, count - 1, 1).createTextFinder(submission.requestId).matchEntireCell(true).findNext();
      if (match) {
        if (sheet.getRange(match.getRow(), 3).getValue() !== digest) return intakeJson_({ ok: false, error: 'This request has changed. Please send it again.' });
        return intakeJson_({ ok: true, requestId: submission.requestId });
      }
    }
    var cache = CacheService.getScriptCache();
    var hour = String(Math.floor(Date.now() / 3600000));
    var globalKey = 'requests-' + hour;
    var contactKey = 'contact-' + hour + '-' + intakeDigest_((submission.email || submission.mobile).toLowerCase());
    var globalCount = Number(cache.get(globalKey) || 0);
    var contactCount = Number(cache.get(contactKey) || 0);
    if (globalCount >= 100 || contactCount >= 5) return intakeJson_({ ok: false, error: 'Too many requests. Please try later or email the county party.' });
    var row = [new Date(), submission.requestId, digest, submission.task, submission.name, submission.email, submission.mobile, submission.notices, submission.community, submission.previous, submission.committee, submission.message, 'Pending review', INTAKE_VERSION];
    sheet.appendRow(row.map(intakeCell_));
    SpreadsheetApp.flush();
    cache.put(globalKey, String(globalCount + 1), 7200);
    cache.put(contactKey, String(contactCount + 1), 7200);
    return intakeJson_({ ok: true, requestId: submission.requestId });
  } catch (error) {
    // Never return exception text, contact values, file IDs or previous records.
    return intakeJson_({ ok: false, error: 'We could not save this request. Check your details and try again, or email the county party.' });
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
}

function validateContact_(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Invalid payload.');
  var limits = { requestId: 36, task: 10, name: 100, email: 254, mobile: 40, notices: 10, community: 100, previous: 254, committee: 100, message: 2000, website: 200, consentVersion: 40 };
  var result = {};
  Object.keys(limits).forEach(function (key) {
    if (raw[key] != null && typeof raw[key] !== 'string') throw new Error('Invalid field.');
    var value = (raw[key] || '').replace(/\r\n?/g, '\n').trim();
    if (value.length > limits[key] || /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(value)) throw new Error('Invalid field.');
    result[key] = value;
  });
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(result.requestId)) throw new Error('Invalid request ID.');
  if (['add', 'update', 'stop', 'interest'].indexOf(result.task) < 0 || !result.name) throw new Error('Missing request details.');
  if (result.website || result.consentVersion !== INTAKE_VERSION) throw new Error('Invalid form.');
  if (['email', 'text', 'both', 'reply'].indexOf(result.notices) < 0 || (result.task === 'stop' && result.notices === 'reply')) throw new Error('Choose notices.');
  if (!result.email && !result.mobile) throw new Error('A contact method is required.');
  if (result.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result.email)) throw new Error('Invalid email.');
  var digits = result.mobile.replace(/\D/g, '');
  if (result.mobile && (!/^[+\d() .-]+$/.test(result.mobile) || digits.length < 10 || digits.length > 15)) throw new Error('Invalid mobile.');
  if (result.task !== 'stop') {
    if ((result.notices === 'email' || result.notices === 'both') && !result.email) throw new Error('Email is required for email notices.');
    if ((result.notices === 'text' || result.notices === 'both') && !result.mobile) throw new Error('Mobile is required for texts.');
  }
  delete result.website;
  return result;
}
function intakeCell_(value) {
  return typeof value === 'string' && /^[=+\-@]/.test(value) ? "'" + value : value;
}
function intakeDigest_(value) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value, Utilities.Charset.UTF_8).map(function (byte) { return ('0' + ((byte + 256) % 256).toString(16)).slice(-2); }).join('');
}
function intakeJson_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
