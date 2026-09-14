/* ==========================================================================
   CountriesIRL — application form (apply/index.html)
   --------------------------------------------------------------------------
   Five steps. Each is checked before the next one opens; the last shows every
   answer back for review, then sends the lot as JSON to `apply.endpoint` in
   js/config.js — a Google Apps Script web app, once one is set up (CONFIG.md
   explains how). Nothing is reported as sent unless that endpoint confirms
   it, and a failed send never clears the form.
   ========================================================================== */

(function () {
  'use strict';

  var form = document.getElementById('apply-form');
  var layout = document.getElementById('apply-top');
  if (!form || !layout) return;

  var settings = (window.SITE_CONFIG && window.SITE_CONFIG.apply) || {};
  var MIN_AGE = typeof settings.minimumAge === 'number' ? settings.minimumAge : 13;
  var MAX_AGE = 120;
  var MAX_LINKS = 5;
  var TIMEOUT = 20000;

  var PLATFORMS = {
    instagram: { label: 'Instagram', hosts: ['instagram.com'], handle: /^@?[a-z0-9._]{1,30}$/i },
    tiktok: { label: 'TikTok', hosts: ['tiktok.com'], handle: /^@?[a-z0-9._]{2,24}$/i },
    youtube: { label: 'YouTube', hosts: ['youtube.com', 'youtu.be'], handle: /^@?[a-z0-9._-]{3,30}$/i }
  };

  var EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;
  var DISCORD = /^(?!.*\.\.)[a-z0-9_.]{2,32}$/i;
  var DISCORD_LEGACY = /^[^@#:`]{2,32}#\d{4}$/;

  var steps = toArray(form.querySelectorAll('.apply-step'));
  var stepButtons = toArray(document.querySelectorAll('.apply-progress__step'));
  var statusLine = document.getElementById('apply-status');
  var announcer = document.getElementById('apply-announce');
  var backButton = document.getElementById('apply-back');
  var nextButton = document.getElementById('apply-next');
  var submitButton = document.getElementById('apply-submit');
  var alertBox = document.getElementById('apply-alert');
  var alertText = document.getElementById('apply-alert-text');
  var reviewBox = document.getElementById('apply-review');
  var donePanel = document.getElementById('apply-done');

  var current = 0;
  var furthest = 0;
  var busy = false;
  var attempted = [];
  var passed = [];

  /* ----------------------------------------------------------------------
     Reading the form
     ---------------------------------------------------------------------- */

  function toArray(list) {
    return Array.prototype.slice.call(list);
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function control(name) {
    return form.elements[name];
  }

  /* A single input, or every checkbox sharing the name. */
  function inputs(name) {
    var c = control(name);
    if (!c) return [];
    return c.tagName ? [c] : toArray(c);
  }

  function value(name) {
    var c = control(name);
    return c && c.tagName ? c.value.trim() : '';
  }

  function limit(name) {
    var c = control(name);
    return (c && c.tagName && Number(c.getAttribute('maxlength'))) || Infinity;
  }

  function title(index) {
    return steps[index].querySelector('.apply-step__title').textContent;
  }

  function checkedTypes() {
    return inputs('contentTypes')
      .filter(function (box) { return box.checked; })
      .map(function (box) { return box.value; });
  }

  function contentList() {
    var list = checkedTypes();
    var other = value('contentOther');
    if (other) list.push('Other: ' + other);
    return list;
  }

  /* '12,500', '12 500' and '12.500' all mean twelve and a half thousand. */
  function followers(raw) {
    var digits = raw.replace(/[\s,.'’_]/g, '');
    return /^\d{1,10}$/.test(digits) ? Number(digits) : NaN;
  }

  function followerCount(key) {
    var raw = value(key + 'Followers');
    return raw ? followers(raw) : '';
  }

  function linkLines(text) {
    return text.split(/\r?\n/)
      .map(function (line) { return line.trim(); })
      .filter(Boolean);
  }

  function normalizedLinks() {
    return linkLines(value('workLinks')).map(function (line) {
      var url = parseLink(line);
      return url ? url.href : line;
    });
  }

  /* ----------------------------------------------------------------------
     Links and usernames
     ---------------------------------------------------------------------- */

  /* Instagram usernames can contain dots (afghanistan.irl), so a dot alone
     does not make something a link — a scheme, a slash or a known domain does. */
  function looksLikeLink(text) {
    return /^[a-z][a-z0-9+.-]*:\/\//i.test(text) || /^\/\//.test(text) || /^www\./i.test(text) ||
      text.indexOf('/') !== -1 || /(^|\.)(instagram\.com|tiktok\.com|youtube\.com|youtu\.be)$/i.test(text);
  }

  /* A web address, with or without https:// in front. Anything that is not
     http(s), or whose host has no dot in it, is not one. */
  function parseLink(text) {
    var full = /^[a-z][a-z0-9+.-]*:/i.test(text) ? text : 'https://' + text.replace(/^\/+/, '');
    var url;
    try { url = new URL(full); } catch (error) { return null; }
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return null;
    if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(url.hostname)) return null;
    return url;
  }

  function onHost(hostname, hosts) {
    var host = hostname.toLowerCase().replace(/^(www|m)\./, '');
    return hosts.some(function (domain) {
      return host === domain || host.slice(-domain.length - 1) === '.' + domain;
    });
  }

  /* ----------------------------------------------------------------------
     Rules — each returns an error message, or '' when the answer is fine
     ---------------------------------------------------------------------- */

  function tooLong(name) {
    var max = limit(name);
    return value(name).length > max ? 'Keep this to ' + max.toLocaleString('en-GB') + ' characters or fewer.' : '';
  }

  function required(name, message) {
    return value(name) ? tooLong(name) : message;
  }

  function accountError(key) {
    var text = value(key);
    var platform = PLATFORMS[key];
    if (!text) {
      return value(key + 'Followers') ? 'Add the ' + platform.label + ' account these followers belong to.' : '';
    }
    if (tooLong(key)) return tooLong(key);
    if (looksLikeLink(text)) {
      var url = parseLink(text);
      if (!url) return 'That isn’t a valid web address. Check the link, or enter just your username.';
      if (!onHost(url.hostname, platform.hosts)) {
        return 'That link doesn’t go to ' + platform.label + '. Check it, or enter just your username.';
      }
      if (url.pathname.replace(/\/+$/, '') === '') {
        return 'Link to your own ' + platform.label + ' profile, not the ' + platform.label + ' home page.';
      }
      return '';
    }
    return platform.handle.test(text) ? '' : 'Enter a username like @yourname, or paste the link to your profile.';
  }

  function countError(key) {
    var raw = value(key + 'Followers');
    if (!raw) return value(key) ? 'Add your ' + PLATFORMS[key].label + ' count.' : '';
    return isNaN(followers(raw)) ? 'Enter the count as a whole number, like 12500.' : '';
  }

  function linksError() {
    if (tooLong('workLinks')) return tooLong('workLinks');
    var lines = linkLines(value('workLinks'));
    if (lines.length > MAX_LINKS) return 'Add up to ' + MAX_LINKS + ' links.';
    for (var i = 0; i < lines.length; i++) {
      if (!parseLink(lines[i])) {
        var shown = lines[i].length > 40 ? lines[i].slice(0, 39) + '…' : lines[i];
        return (lines.length > 1 ? 'Line ' + (i + 1) + ' isn’t' : 'That isn’t') +
          ' a valid web address: “' + shown + '”.';
      }
    }
    return '';
  }

  var RULES = {
    fullName: function () { return required('fullName', 'Enter your full name.'); },
    country: function () { return required('country', 'Enter the country you represent.'); },
    age: function () {
      var text = value('age');
      if (!text) return 'Enter your age.';
      if (!/^\d{1,3}$/.test(text)) return 'Enter your age as a whole number, like 17.';
      var age = Number(text);
      if (age < MIN_AGE) return 'You need to be at least ' + MIN_AGE + ' to apply.';
      if (age > MAX_AGE) return 'Check your age — that number looks too high.';
      return '';
    },
    email: function () {
      var text = value('email');
      if (!text) return 'Enter your email address.';
      return text.length <= limit('email') && EMAIL.test(text) ? '' : 'Enter a valid email address, like name@example.com.';
    },
    accounts: function () {
      return value('instagram') || value('tiktok') || value('youtube') ? '' :
        'Add at least one account — Instagram, TikTok or YouTube.';
    },
    instagram: function () { return accountError('instagram'); },
    instagramFollowers: function () { return countError('instagram'); },
    tiktok: function () { return accountError('tiktok'); },
    tiktokFollowers: function () { return countError('tiktok'); },
    youtube: function () { return accountError('youtube'); },
    youtubeFollowers: function () { return countError('youtube'); },
    contentTypes: function () {
      return contentList().length ? '' : 'Choose at least one kind of content, or describe it under “Something else”.';
    },
    contentOther: function () { return tooLong('contentOther'); },
    experience: function () { return required('experience', 'Tell us about your content creation experience.'); },
    workLinks: linksError,
    motivation: function () { return required('motivation', 'Tell us why you want to join.'); },
    contribution: function () { return required('contribution', 'Tell us what you could contribute.'); },
    discord: function () {
      var text = value('discord').replace(/^@/, '');
      if (!text) return '';
      return DISCORD.test(text) || DISCORD_LEGACY.test(text) ? '' :
        'Discord usernames are 2 to 32 characters: letters, numbers, dots and underscores.';
    },
    rulesAccepted: function () {
      return control('rulesAccepted').checked ? '' : 'Tick the box to agree to the community rules before you submit.';
    }
  };

  var STEP_FIELDS = [
    ['fullName', 'country', 'age', 'email'],
    ['accounts', 'instagram', 'instagramFollowers', 'tiktok', 'tiktokFollowers', 'youtube', 'youtubeFollowers'],
    ['contentTypes', 'contentOther', 'experience', 'workLinks'],
    ['motivation', 'contribution', 'discord'],
    ['rulesAccepted']
  ];

  /* ----------------------------------------------------------------------
     Showing problems
     ---------------------------------------------------------------------- */

  function show(name, message) {
    var box = document.getElementById(name + '-error');
    if (box) {
      box.textContent = message;
      box.hidden = !message;
    }
    inputs(name).forEach(function (input) {
      if (message) input.setAttribute('aria-invalid', 'true');
      else input.removeAttribute('aria-invalid');
    });
  }

  /* Checks one step, shows what is wrong, and returns the names at fault. */
  function check(index) {
    attempted[index] = true;
    var problems = STEP_FIELDS[index].filter(function (name) {
      var message = RULES[name]();
      show(name, message);
      return !!message;
    });
    passed[index] = !problems.length;
    return problems;
  }

  function announce(message) {
    announcer.textContent = '';
    window.setTimeout(function () { announcer.textContent = message; }, 50);
  }

  function focusProblem(problems) {
    var name = problems[0] === 'accounts' ? 'instagram' : problems[0];
    var target = inputs(name)[0];
    if (target) target.focus();
    announce(problems.length === 1 ? 'One answer needs attention.' : problems.length + ' answers need attention.');
  }

  /* ----------------------------------------------------------------------
     Moving between steps
     ---------------------------------------------------------------------- */

  function go(index, moveFocus) {
    current = index;
    furthest = Math.max(furthest, index);
    var last = index === steps.length - 1;

    steps.forEach(function (step, n) { step.hidden = n !== index; });
    stepButtons.forEach(function (button, n) {
      button.disabled = busy || n > furthest;
      button.classList.toggle('is-done', !!passed[n] && n !== index);
      if (n === index) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
      button.querySelector('.apply-progress__state').textContent =
        n === index ? ' (current step)' : passed[n] ? ' (completed)' : '';
    });
    statusLine.textContent = 'Step ' + (index + 1) + ' of ' + steps.length + ': ' + title(index);

    backButton.hidden = index === 0;
    nextButton.hidden = last;
    submitButton.hidden = !last;
    if (last) renderReview();
    else alertBox.hidden = true;

    if (moveFocus) {
      steps[index].querySelector('.apply-step__title').focus({ preventScroll: true });
      if (layout.getBoundingClientRect().top < 0) layout.scrollIntoView({ block: 'start' });
    }
  }

  /* Back is always allowed. Forward, every step on the way has to pass. */
  function jumpTo(target) {
    if (busy || target === current || target < 0 || target >= steps.length) return;
    if (target < current) {
      go(target, true);
      return;
    }
    for (var i = current; i < target; i++) {
      var problems = check(i);
      if (problems.length) {
        if (i !== current) go(i, false);
        focusProblem(problems);
        return;
      }
    }
    go(target, true);
  }

  /* ----------------------------------------------------------------------
     Review
     ---------------------------------------------------------------------- */

  function accountSummary(key) {
    var account = value(key);
    if (!account) return '';
    var count = followerCount(key);
    var unit = key === 'youtube' ? ' subscribers' : ' followers';
    return count === '' || isNaN(count) ? account : account + ' · ' + count.toLocaleString('en-GB') + unit;
  }

  var REVIEW = [
    { step: 0, rows: [
      ['Full name', function () { return value('fullName'); }],
      ['Country represented', function () { return value('country'); }],
      ['Age', function () { return value('age'); }],
      ['Email address', function () { return value('email'); }]
    ] },
    { step: 1, rows: [
      ['Instagram', function () { return accountSummary('instagram'); }],
      ['TikTok', function () { return accountSummary('tiktok'); }],
      ['YouTube', function () { return accountSummary('youtube'); }]
    ] },
    { step: 2, rows: [
      ['Content', function () { return contentList().join(', '); }],
      ['Experience', function () { return value('experience'); }],
      ['Links to your work', function () { return normalizedLinks().join('\n'); }]
    ] },
    { step: 3, rows: [
      ['Why you want to join', function () { return value('motivation'); }],
      ['What you could contribute', function () { return value('contribution'); }],
      ['Discord username', function () { return value('discord').replace(/^@/, ''); }]
    ] }
  ];

  function renderReview() {
    reviewBox.replaceChildren.apply(reviewBox, REVIEW.map(function (part) {
      var name = title(part.step);
      var section = el('section', 'apply-review__part');
      var head = el('div', 'apply-review__head');
      var edit = el('button', 'apply-edit', 'Edit');
      edit.type = 'button';
      edit.disabled = busy;
      edit.setAttribute('data-go', String(part.step));
      edit.setAttribute('aria-label', 'Edit ' + name.toLowerCase());
      head.append(el('h3', null, name), edit);

      var list = el('dl');
      part.rows.forEach(function (row) {
        var text = row[1]();
        list.append(el('dt', null, row[0]), el('dd', text ? null : 'is-empty', text || 'Not provided'));
      });
      section.append(head, list);
      return section;
    }));
  }

  /* ----------------------------------------------------------------------
     Sending
     ---------------------------------------------------------------------- */

  /* Field names match the columns the Google Sheet will use (CONFIG.md). */
  function payload() {
    return {
      timestamp: new Date().toISOString(),
      fullName: value('fullName'),
      country: value('country'),
      age: Number(value('age')),
      email: value('email'),
      instagram: value('instagram'),
      tiktok: value('tiktok'),
      youtube: value('youtube'),
      instagramFollowers: followerCount('instagram'),
      tiktokFollowers: followerCount('tiktok'),
      youtubeFollowers: followerCount('youtube'),
      contentTypes: contentList().join(', '),
      experience: value('experience'),
      workLinks: normalizedLinks().join('\n'),
      motivation: value('motivation'),
      contribution: value('contribution'),
      discord: value('discord').replace(/^@/, ''),
      rulesAccepted: control('rulesAccepted').checked,
      honeypot: control('website') ? control('website').value : ''
    };
  }

  function setBusy(on) {
    busy = on;
    form.setAttribute('aria-busy', on ? 'true' : 'false');
    submitButton.disabled = on;
    backButton.disabled = on;
    submitButton.classList.toggle('is-busy', on);
    submitButton.querySelector('.apply-submit__label').textContent = on ? 'Sending…' : 'Submit application';
    stepButtons.forEach(function (button, n) { button.disabled = on || n > furthest; });
    toArray(reviewBox.querySelectorAll('button')).forEach(function (button) { button.disabled = on; });
  }

  function fail(message) {
    alertBox.hidden = false;
    alertText.textContent = message;
    var box = alertBox.getBoundingClientRect();
    if (box.top < 0 || box.bottom > window.innerHeight) alertBox.scrollIntoView({ block: 'center' });
  }

  function succeed() {
    layout.hidden = true;
    donePanel.hidden = false;
    donePanel.querySelector('h2').focus({ preventScroll: true });
    donePanel.scrollIntoView({ block: 'start' });
  }

  function endpoint() {
    var apply = (window.SITE_CONFIG && window.SITE_CONFIG.apply) || {};
    var url = String(apply.endpoint || '').trim();
    return /^(https:\/\/|http:\/\/(localhost|127\.0\.0\.1)(:\d+)?\/)\S*$/i.test(url) ? url : '';
  }

  function send() {
    if (busy) return;
    alertBox.hidden = true;

    for (var i = 0; i < steps.length; i++) {
      var problems = check(i);
      if (problems.length) {
        if (i !== current) go(i, false);
        focusProblem(problems);
        return;
      }
    }

    var url = endpoint();
    if (!url) {
      console.warn('CountriesIRL: applications cannot be sent yet — set apply.endpoint in js/config.js ' +
        'to the Google Apps Script web app URL (see CONFIG.md).');
      fail('This form isn’t connected to the team’s application inbox yet, so nothing was sent. ' +
        'Your answers are still here — please try again later.');
      return;
    }

    var data = payload();
    setBusy(true);
    var controller = window.AbortController ? new AbortController() : null;
    var timer = window.setTimeout(function () { if (controller) controller.abort(); }, TIMEOUT);

    fetch(url, {
      method: 'POST',
      /* JSON in the body, labelled text/plain on purpose: a Google Apps Script
         web app cannot answer the extra (preflight) request a JSON content type
         makes browsers send first. The script reads e.postData.contents. */
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(data),
      credentials: 'omit',
      signal: controller ? controller.signal : undefined
    })
      .then(function (response) {
        if (!response.ok) throw new Error('the service answered ' + response.status);
        return response.text();
      })
      .then(function (text) {
        var reply = null;
        try { reply = JSON.parse(text); } catch (error) { /* not JSON: not a confirmation */ }
        if (!reply || reply.ok !== true) {
          throw new Error('no confirmation' + (reply && reply.error ? ': ' + reply.error : ''));
        }
        window.clearTimeout(timer);
        setBusy(false);
        succeed();
      })
      .catch(function (error) {
        window.clearTimeout(timer);
        setBusy(false);
        var unreachable = error && (error.name === 'AbortError' || error instanceof TypeError);
        console.warn('CountriesIRL: application not sent —', error && error.message);
        fail(unreachable ?
          'We couldn’t reach the application inbox, so your application was not sent. Check your connection ' +
          'and try again — your answers are still here.' :
          'The application inbox didn’t confirm your application, so it may not have arrived. Your answers are ' +
          'still here — please try again in a moment.');
      });
  }

  /* ----------------------------------------------------------------------
     Wiring
     ---------------------------------------------------------------------- */

  /* Enter in a field, Next and Submit all land here. */
  form.addEventListener('submit', function (event) {
    event.preventDefault();
    if (busy) return;
    if (current < steps.length - 1) jumpTo(current + 1);
    else send();
  });

  backButton.addEventListener('click', function () {
    if (!busy && current > 0) go(current - 1, true);
  });

  /* The step list and the review's Edit buttons. */
  document.addEventListener('click', function (event) {
    var trigger = event.target.closest('[data-go]');
    if (trigger && !trigger.disabled) jumpTo(Number(trigger.getAttribute('data-go')));
  });

  /* Once a step has been checked, its messages follow the answers live. */
  function recheck(event) {
    if (event.target.name && attempted[current]) check(current);
  }
  form.addEventListener('input', recheck);
  form.addEventListener('change', recheck);

  toArray(form.querySelectorAll('[data-counter]')).forEach(function (input) {
    var out = document.getElementById(input.id + '-count');
    var max = Number(input.getAttribute('maxlength'));
    function update() {
      var used = input.value.length;
      out.textContent = used.toLocaleString('en-GB') + ' / ' + max.toLocaleString('en-GB') + ' characters';
      out.classList.toggle('is-near', used >= max * 0.9);
    }
    input.addEventListener('input', update);
    update();
  });

  toArray(document.querySelectorAll('[data-min-age]')).forEach(function (node) {
    node.textContent = String(MIN_AGE);
  });

  layout.hidden = false;
  go(0, false);
})();
