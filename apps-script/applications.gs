/* ==========================================================================
   CountriesIRL — the applications inbox (Google Apps Script)
   --------------------------------------------------------------------------
   This file does not run on the website. It runs inside your Google account,
   attached to the Google Sheet that holds applications: open that sheet,
   Extensions → Apps Script, paste this in, and deploy it as a web app.
   CONFIG.md ("Connecting it to a Google Sheet") has the steps.

   The form at countriesirl.com/apply/ sends one POST here with the
   application as JSON. This script checks it, adds the time it arrived, and
   appends one row to the sheet with Status "Pending" and Admin notes empty.
   It answers {"ok": true} only once that row exists, so the applicant is
   never told an application was sent when it was not.

   The sheet itself stays private: the web app runs as you, and it is the
   only thing that opens the sheet. Applicants never touch it, and there is
   no key, password or spreadsheet address in the website's code.
   ========================================================================== */

/* The sheet that receives applications. A tab with this name is used if there
   is one; otherwise the first tab of the spreadsheet is. */
var SHEET_NAME = 'Applications';

/* The answers the form sends, in the order they become columns. */
var FIELDS = [
  'fullName', 'country', 'age', 'email',
  'instagram', 'instagramFollowers', 'tiktok', 'tiktokFollowers', 'youtube', 'youtubeFollowers',
  'contentTypes', 'experience', 'workLinks', 'motivation', 'contribution', 'discord', 'rulesAccepted'
];

/* The header row: when it arrived, the answers, then your two columns. */
var HEADERS = ['Timestamp', 'Full name', 'Country', 'Age', 'Email',
  'Instagram', 'Instagram followers', 'TikTok', 'TikTok followers', 'YouTube', 'YouTube subscribers',
  'Content types', 'Experience', 'Work links', 'Motivation', 'Contribution', 'Discord',
  'Rules accepted', 'Status', 'Admin notes'];

var DEFAULT_STATUS = 'Pending';
var MIN_AGE = 13;                 // matches apply.minimumAge in js/config.js
var MAX_AGE = 120;
var MAX_FOLLOWERS = 1e10;

/* Longest answer accepted for each field, matching the form's own limits.
   Anything longer is a sign the request did not come from the form. */
var LIMITS = {
  fullName: 80, country: 60, email: 254,
  instagram: 100, tiktok: 100, youtube: 100,
  contentTypes: 400, experience: 1000, workLinks: 1000,
  motivation: 1000, contribution: 1000, discord: 40
};

var REQUIRED_TEXT = {
  fullName: 'a full name', country: 'a country', email: 'an email address',
  contentTypes: 'at least one kind of content', experience: 'the experience answer',
  motivation: 'the reason for joining', contribution: 'the contribution answer'
};

var EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

/* --------------------------------------------------------------------------
   Receiving an application
   -------------------------------------------------------------------------- */

function doPost(e) {
  try {
    var data = readJson(e);
    if (!data) return json({ ok: false, error: 'The application could not be read.' });

    /* The form has a field people never see. Bots fill in every field, so
       anything in it means a bot: answer politely, store nothing. */
    if (text(data.honeypot) !== '') return json({ ok: true, stored: false });

    var problems = check(data);
    if (problems.length) return json({ ok: false, error: problems.join(' ') });

    var row = store(data);
    return json({ ok: true, row: row });
  } catch (error) {
    console.error('Application not stored: ' + (error && error.message ? error.message : error));
    return json({ ok: false, error: 'The application could not be saved. Please try again.' });
  }
}

/* Opening the web app URL in a browser lands here. It says the service is
   alive and nothing else — no applications, no spreadsheet. */
function doGet() {
  return json({ ok: true, service: 'CountriesIRL applications', accepts: 'POST' });
}

/* --------------------------------------------------------------------------
   Checking it
   --------------------------------------------------------------------------
   The form checks every answer before it sends, but anyone can post to this
   URL, so everything that matters is checked again here.
   -------------------------------------------------------------------------- */

function check(data) {
  var problems = [];

  Object.keys(REQUIRED_TEXT).forEach(function (key) {
    if (text(data[key]) === '') problems.push('Missing ' + REQUIRED_TEXT[key] + '.');
  });

  Object.keys(LIMITS).forEach(function (key) {
    if (text(data[key]).length > LIMITS[key]) problems.push('The ' + key + ' answer is too long.');
  });

  if (text(data.email) !== '' && !EMAIL.test(text(data.email))) {
    problems.push('That email address is not valid.');
  }

  var age = Number(data.age);
  if (!isFinite(age) || Math.floor(age) !== age || age < MIN_AGE || age > MAX_AGE) {
    problems.push('The age must be a whole number between ' + MIN_AGE + ' and ' + MAX_AGE + '.');
  }

  if (text(data.instagram) === '' && text(data.tiktok) === '' && text(data.youtube) === '') {
    problems.push('At least one social account is needed.');
  }

  ['instagramFollowers', 'tiktokFollowers', 'youtubeFollowers'].forEach(function (key) {
    var value = data[key];
    if (value === '' || value === null || value === undefined) return;
    var count = Number(value);
    if (!isFinite(count) || count < 0 || count > MAX_FOLLOWERS || Math.floor(count) !== count) {
      problems.push('The ' + key + ' count is not a whole number.');
    }
  });

  if (data.rulesAccepted !== true) problems.push('The community rules were not accepted.');

  return problems;
}

/* --------------------------------------------------------------------------
   Storing it
   -------------------------------------------------------------------------- */

function store(data) {
  /* Two applications arriving at once would otherwise race for the same row. */
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var sheet = applicationSheet();
    var row = [new Date()];
    FIELDS.forEach(function (key) { row.push(cell(data[key])); });
    row.push(DEFAULT_STATUS, '');
    sheet.appendRow(row);
    return sheet.getLastRow();
  } finally {
    lock.releaseLock();
  }
}

function applicationSheet() {
  var book = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = book.getSheetByName(SHEET_NAME) || book.getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

/* Run this once from the editor to put the header row in place. Applications
   do it themselves as well, so it is only for tidiness. */
function setup() {
  applicationSheet();
}

/* --------------------------------------------------------------------------
   Small helpers
   -------------------------------------------------------------------------- */

function readJson(e) {
  if (!e || !e.postData || !e.postData.contents) return null;
  try {
    var data = JSON.parse(e.postData.contents);
    return data && typeof data === 'object' ? data : null;
  } catch (error) {
    return null;
  }
}

function text(value) {
  return value === null || value === undefined ? '' : String(value).trim();
}

/* Numbers and true/false go in as they are. An answer that opens with =, +,
   - or @ would otherwise be read as a spreadsheet formula, so it keeps a
   leading apostrophe and stays plain text. */
function cell(value) {
  if (typeof value === 'number' || typeof value === 'boolean') return value;
  var written = text(value);
  return /^[=+\-@]/.test(written) ? "'" + written : written;
}

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
