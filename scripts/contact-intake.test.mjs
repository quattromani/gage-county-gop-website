import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { validateContact, sendContact, CONSENT_VERSION } from '../src/contact-form.js';

const source = fs.readFileSync(new URL('../services/contact-intake/Code.gs', import.meta.url), 'utf8');
const valid = (changes = {}) => ({ requestId: crypto.randomUUID(), task: 'add', name: 'Fictional QA', email: 'qa@example.com', mobile: '', notices: 'email', community: '', previous: '', committee: '', message: '', website: '', consentVersion: CONSENT_VERSION, ...changes });
function service({ failFlush = false } = {}) {
  const rows = [], cache = new Map(), calls = [];
  const sheet = {
    getLastRow: () => rows.length,
    getRange: (row, column, count = 1, width = 1) => ({
      getValues: () => rows.slice(row - 1, row - 1 + count).map((entry) => entry.slice(column - 1, column - 1 + width)),
      getValue: () => rows[row - 1][column - 1],
      createTextFinder: (value) => ({ matchEntireCell() { return this; }, findNext: () => { const index = rows.findIndex((entry, index) => index >= row - 1 && entry[column - 1] === value); return index < 0 ? null : { getRow: () => index + 1 }; } }),
    }),
    appendRow: (row) => { rows.push([...row]); calls.push('append'); },
  };
  const context = vm.createContext({
    console, Date,
    SpreadsheetApp: { openById: () => ({ getSheetByName: (name) => name === 'Incoming requests' ? sheet : null }), flush: () => { calls.push('flush'); if (failFlush) throw Error('synthetic write failure'); } },
    PropertiesService: { getScriptProperties: () => ({ getProperty: () => 'private-test-file-id' }) },
    LockService: { getScriptLock: () => ({ tryLock: () => true, hasLock: () => true, releaseLock() {} }) },
    CacheService: { getScriptCache: () => ({ get: (key) => cache.get(key), put: (key, value) => cache.set(key, value) }) },
    Utilities: { DigestAlgorithm: { SHA_256: 'sha256' }, Charset: { UTF_8: 'utf8' }, computeDigest: (_, text) => [...crypto.createHash('sha256').update(text).digest()] },
    ContentService: { MimeType: { JSON: 'application/json' }, createTextOutput: (text) => ({ text, setMimeType() { return this; } }) },
  });
  vm.runInContext(source, context);
  rows.push([...context.INTAKE_HEADERS]);
  return { rows, calls, context, post: (payload) => JSON.parse(context.doPost({ parameter: { payload: JSON.stringify(payload) } }).text) };
}

test('contact intake accepts common autofill formats and applies channel requirements', () => {
  assert.deepEqual(validateContact(valid({ name: 'Renée O’Neil', mobile: '+1 (402) 555-0123', notices: 'both' })), {});
  assert.deepEqual(validateContact(valid({ email: '', mobile: '402-555-0123', notices: 'text' })), {});
  assert.ok(validateContact(valid({ notices: 'both' })).mobile);
  assert.ok(validateContact(valid({ email: '', mobile: '402-555-0123', notices: 'email' })).email);
  assert.deepEqual(validateContact(valid({ task: 'stop', email: '', mobile: '402-555-0123', notices: 'email' })), {});
  assert.ok(validateContact(valid({ task: 'stop', notices: 'reply' })).notices);
  assert.deepEqual(validateContact(valid({ task: 'interest', notices: 'reply' })), {});
});

test('server validation independently rejects malformed, oversize, honeypot and missing-channel submissions', () => {
  const instance = service();
  for (const values of [valid({ name: '' }), valid({ email: '', mobile: '' }), valid({ mobile: '123' }), valid({ task: 'overwrite' }), valid({ requestId: 'bad-id' }), valid({ website: 'spam' }), valid({ message: 'x'.repeat(2001) }), valid({ notices: 'both' }), valid({ consentVersion: 'old' }), valid({ task: 'stop', notices: 'reply' }), { ...valid(), email: ['qa@example.com'] }]) {
    assert.equal(instance.post(values).ok, false);
  }
  assert.equal(instance.rows.length, 1);
  assert.equal(instance.calls.length, 0);
});

test('saved receipt follows persistence and duplicate retry does not append again', () => {
  const instance = service(), submission = valid();
  assert.deepEqual(instance.post(submission), { ok: true, requestId: submission.requestId });
  assert.deepEqual(instance.calls, ['append', 'flush']);
  assert.equal(instance.rows[1][12], 'Pending review');
  assert.deepEqual(instance.post(submission), { ok: true, requestId: submission.requestId });
  assert.equal(instance.rows.length, 2);
  assert.equal(instance.post({ ...submission, name: 'Changed request' }).ok, false);
  assert.equal(instance.rows.length, 2);
  assert.equal(JSON.stringify(instance.post(submission)).includes('qa@example.com'), false);
});

test('spreadsheet values are formula-safe and service exposes no roster through GET', () => {
  const instance = service();
  assert.equal(instance.post(valid({ name: '=IMPORTXML("example")', mobile: '+14025550123', message: '@formula' })).ok, true);
  assert.equal(instance.rows[1][4], "'=IMPORTXML(\"example\")");
  assert.equal(instance.rows[1][6], "'+14025550123");
  assert.equal(instance.rows[1][11], "'@formula");
  assert.deepEqual(JSON.parse(instance.context.doGet().text), { service: 'Gage County GOP contact intake', version: CONSENT_VERSION });
});

test('service returns failure after storage error and limits repeated contact requests', () => {
  const broken = service({ failFlush: true });
  assert.equal(broken.post(valid()).ok, false);
  const instance = service();
  for (let i = 0; i < 5; i++) assert.equal(instance.post(valid()).ok, true);
  assert.equal(instance.post(valid()).ok, false);
  assert.equal(instance.rows.length, 6);
});

test('client never treats opaque, failed, mismatched or malformed replies as saved', async () => {
  const endpoint = 'https://script.google.com/macros/s/test-service/exec', submission = valid();
  const ok = async (url, options) => {
    assert.equal(url, endpoint);
    assert.equal(options.credentials, 'omit');
    assert.equal(options.mode, 'cors');
    assert.equal(options.body.get('payload'), JSON.stringify(submission));
    return { ok: true, json: async () => ({ ok: true, requestId: submission.requestId }) };
  };
  assert.equal((await sendContact(endpoint, submission, ok)).requestId, submission.requestId);
  for (const reply of [ { ok: false, json: async () => ({ ok: true, requestId: submission.requestId }) }, { ok: true, json: async () => ({ ok: true, requestId: 'wrong' }) }, { ok: true, json: async () => ({ ok: false }) }, { ok: true, json: async () => { throw Error('not JSON'); } } ]) {
    await assert.rejects(sendContact(endpoint, submission, async () => reply));
  }
  await assert.rejects(sendContact('', submission, ok));
  await assert.rejects(sendContact(endpoint, submission, async () => { throw Error('offline'); }));
});
