/* ==========================================================================
   CountriesIRL — application form (apply/index.html)
   --------------------------------------------------------------------------
   First a choice of two paths — join as a Country creator, or join the Creative team —
   then the steps for that path. Each step is checked before the next one
   opens; the last shows every answer back for review, then sends the lot
   as JSON to `apply.endpoint` in js/config.js — a Google Apps Script web
   app (CONFIG.md explains how to set it up). Nothing is reported as sent
   unless that endpoint confirms it, and a failed send never clears the form.
   ========================================================================== */

(function () {
  'use strict';

  var form = document.getElementById('apply-form');
  var layout = document.getElementById('apply-top');
  var pathBox = document.getElementById('apply-path');
  if (!form || !layout || !pathBox) return;

  var config = window.SITE_CONFIG || {};
  var settings = config.apply || {};
  var MIN_AGE = typeof settings.minimumAge === 'number' ? settings.minimumAge : 13;
  var MAX_AGE = 120;
  var MAX_LINKS = 5;
  var TIMEOUT = 20000;
  var OTHER = '__other';

  /* The words before and after "Applying …" above the steps, per path. */
  var PATHS = {
    country: ['Applying as a', 'Country creator'],
    creative: ['Applying to the', 'Creative team']
  };

  var PLATFORMS = {
    instagram: { label: 'Instagram', hosts: ['instagram.com'], handle: /^@?[a-z0-9._]{1,30}$/i },
    tiktok: { label: 'TikTok', hosts: ['tiktok.com'], handle: /^@?[a-z0-9._]{2,24}$/i },
    youtube: { label: 'YouTube', hosts: ['youtube.com', 'youtu.be'], handle: /^@?[a-z0-9._-]{3,30}$/i }
  };

  var EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;
  var DISCORD = /^(?!.*\.\.)[a-z0-9_.]{2,32}$/i;
  var DISCORD_LEGACY = /^[^@#:`]{2,32}#\d{4}$/;

  var allSteps = toArray(form.querySelectorAll('.apply-step'));
  var progressList = document.getElementById('apply-progress-list');
  var pathLead = document.getElementById('apply-path-lead');
  var pathName = document.getElementById('apply-path-name');
  var changePath = document.getElementById('apply-change-path');
  var statusLine = document.getElementById('apply-status');
  var announcer = document.getElementById('apply-announce');
  var backButton = document.getElementById('apply-back');
  var nextButton = document.getElementById('apply-next');
  var submitButton = document.getElementById('apply-submit');
  var alertBox = document.getElementById('apply-alert');
  var alertText = document.getElementById('apply-alert-text');
  var reviewBox = document.getElementById('apply-review');
  var donePanel = document.getElementById('apply-done');

  var path = '';
  var steps = [];          // the steps of the chosen path, in order
  var stepButtons = [];
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

  /* A single input, or every checkbox or radio sharing the name. */
  function inputs(name) {
    var c = control(name);
    if (!c) return [];
    return c.tagName ? [c] : toArray(c);
  }

  /* A text field's answer, or the picked radio's value. */
  function value(name) {
    var c = control(name);
    if (!c) return '';
    return String(c.value || '').trim();
  }

  function limit(name) {
    var c = control(name);
    return (c && c.tagName && Number(c.getAttribute('maxlength'))) || Infinity;
  }

  /* 'step-country-title' → 'country': the key the rules below use. */
  function stepKey(step) {
    return step.getAttribute('aria-labelledby').replace(/^step-|-title$/g, '');
  }

  function title(step) {
    return step.querySelector('.apply-step__title').textContent;
  }

  function checked(name) {
    return inputs(name)
      .filter(function (box) { return box.checked; })
      .map(function (box) { return box.value; });
  }

  function withOther(list, otherName) {
    var other = value(otherName);
    if (other) list.push('Other: ' + other);
    return list;
  }

  function contentList() { return withOther(checked('contentTypes'), 'contentOther'); }
  function skillList() { return withOther(checked('skills'), 'skillsOther'); }

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

  function normalizedLinks(name) {
    return linkLines(value(name)).map(function (line) {
      var url = parseLink(line);
      return url ? url.href : line;
    });
  }

  /* ----------------------------------------------------------------------
     The country list
     ----------------------------------------------------------------------
     Every country in js/countries.js, minus the ones a member already
     represents. A member takes a country when its flag is that country's
     file — assets/flags/fr.png takes France — and it has no `geo` of its
     own, which is how states and historical countries are marked.
     ---------------------------------------------------------------------- */

  function fold(text) {
    return String(text).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, ' ').trim();
  }

  var members = ((config.members && config.members.list) || []).filter(Boolean);

  var takenCodes = {};
  members.forEach(function (member) {
    var match = /\/([a-z]{2}(?:-[a-z]{3})?)\.(png|svg|jpe?g|webp)$/.exec(member.flag || '');
    if (match && !member.geo) takenCodes[match[1]] = true;
  });

  /* Member names, without notes like "(Owner)", for the "not on the list" box. */
  var takenNames = {};
  members.forEach(function (member) {
    if (member.name) takenNames[fold(member.name.replace(/\s*\(.*\)\s*$/, ''))] = member.name.replace(/\s*\(.*\)\s*$/, '');
  });

  var countries = (window.APPLY_COUNTRIES || []).map(function (row) {
    return {
      code: row[0],
      name: row[1],
      search: [row[1]].concat(row[2] || []).map(fold)
    };
  }).sort(function (a, b) { return a.name.localeCompare(b.name, 'en'); });

  countries.forEach(function (c) {
    c.taken = !!takenCodes[c.code] || c.search.some(function (s) { return takenNames[s]; });
  });
  var open = countries.filter(function (c) { return !c.taken; });

  var countryList = document.getElementById('country-list');
  var countrySearch = document.getElementById('countrySearch');
  var countryEmpty = document.getElementById('country-empty');
  var countryChosen = document.getElementById('country-chosen');
  var countryCount = document.getElementById('country-count');
  var otherField = document.getElementById('countryOther-field');

  function countryOption(val, label, className) {
    var option = el('label', 'country-option' + (className ? ' ' + className : ''));
    var radio = el('input');
    radio.type = 'radio';
    radio.name = 'country';
    radio.value = val;
    option.append(radio, el('span', null, label));
    return option;
  }

  function buildCountries() {
    var options = open.map(function (c) {
      var option = countryOption(c.name, c.name);
      option.setAttribute('data-search', c.search.join('|'));
      return option;
    });
    options.push(countryOption(OTHER, 'Not on the list — a territory or historical country', 'country-option--other'));
    countryList.replaceChildren.apply(countryList, options);
    countryCount.textContent = '· ' + open.length + ' available';
  }

  function filterCountries() {
    var query = fold(countrySearch.value);
    var shown = 0;
    toArray(countryList.querySelectorAll('.country-option:not(.country-option--other)')).forEach(function (option) {
      var hit = !query || option.getAttribute('data-search').split('|').some(function (s) {
        return s.indexOf(query) !== -1;
      });
      option.hidden = !hit;
      if (hit) shown++;
    });

    if (shown || !query) {
      countryEmpty.hidden = true;
      return shown;
    }
    var taken = countries.filter(function (c) {
      return c.taken && c.search.some(function (s) { return s.indexOf(query) !== -1; });
    });
    countryEmpty.textContent = taken.length ?
      taken.slice(0, 3).map(function (c) { return c.name; }).join(', ') +
        (taken.length === 1 ? ' already has an account in the network, so it isn’t listed.' :
          ' already have accounts in the network, so they aren’t listed.') :
      'No country matches “' + countrySearch.value.trim() + '”. If it’s a territory or historical country, choose “Not on the list” below.';
    countryEmpty.hidden = false;
    return 0;
  }

  /* U.S. states are a separate kind of account, and not open for applications.
     "Texas", "Texas, USA" and "State of Texas" are all caught; Georgia the
     country is on the list, so typing it here means the state. */
  var US_STATES = [
    'alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado', 'connecticut',
    'delaware', 'florida', 'georgia', 'hawaii', 'idaho', 'illinois', 'indiana', 'iowa',
    'kansas', 'kentucky', 'louisiana', 'maine', 'maryland', 'massachusetts', 'michigan',
    'minnesota', 'mississippi', 'missouri', 'montana', 'nebraska', 'nevada', 'new hampshire',
    'new jersey', 'new mexico', 'new york', 'north carolina', 'north dakota', 'ohio',
    'oklahoma', 'oregon', 'pennsylvania', 'rhode island', 'south carolina', 'south dakota',
    'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington', 'west virginia',
    'wisconsin', 'wyoming', 'district of columbia', 'washington dc'
  ];

  function isState(text) {
    var name = fold(text)
      .replace(/^(the )?state of /, '')
      .replace(/ (state|usa|us|u s|united states( of america)?)$/, '');
    return US_STATES.indexOf(name) !== -1;
  }

  /* What the applicant picked, as it goes into the sheet. */
  function countryName() {
    var picked = value('country');
    return picked === OTHER ? value('countryOther') : picked;
  }

  function syncCountry() {
    var picked = value('country');
    otherField.hidden = picked !== OTHER;
    toArray(countryList.querySelectorAll('.country-option')).forEach(function (option) {
      option.classList.toggle('is-picked', option.querySelector('input').checked);
    });
    if (picked && picked !== OTHER) {
      countryChosen.textContent = 'You picked ' + picked + '.';
      countryChosen.hidden = false;
    } else {
      countryChosen.hidden = true;
    }
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

  function linksError(name) {
    if (tooLong(name)) return tooLong(name);
    var lines = linkLines(value(name));
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
    country: function () {
      return value('country') ? '' : 'Choose the country you want to represent, or “Not on the list”.';
    },
    countryOther: function () {
      if (value('country') !== OTHER) return '';
      var text = value('countryOther');
      if (!text) return 'Enter the place your account will represent.';
      if (tooLong('countryOther')) return tooLong('countryOther');
      var taken = takenNames[fold(text)];
      if (taken) return taken + ' already has an account in the network.';
      return isState(text) ? 'U.S. states aren’t open for applications — only countries, territories and historical countries.' : '';
    },
    skills: function () {
      return skillList().length ? '' : 'Choose at least one skill, or describe yours under “Something else”.';
    },
    skillsOther: function () { return tooLong('skillsOther'); },
    fullName: function () { return required('fullName', 'Enter your full name.'); },
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
    workLinks: function () { return linksError('workLinks'); },
    skillExperience: function () { return required('skillExperience', 'Tell us about your experience.'); },
    portfolio: function () { return linksError('portfolio'); },
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

  /* The answers each step checks, by step key. */
  var STEP_FIELDS = {
    country: ['country', 'countryOther'],
    skills: ['skills', 'skillsOther'],
    personal: ['fullName', 'age', 'email'],
    social: ['accounts', 'instagram', 'instagramFollowers', 'tiktok', 'tiktokFollowers', 'youtube', 'youtubeFollowers'],
    creator: ['contentTypes', 'contentOther', 'experience', 'workLinks'],
    work: ['skillExperience', 'portfolio'],
    motivation: ['motivation', 'contribution', 'discord'],
    review: ['rulesAccepted']
  };

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
    var problems = STEP_FIELDS[stepKey(steps[index])].filter(function (name) {
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
    var first = problems[0];
    var target = first === 'accounts' ? control('instagram') :
      first === 'country' ? countrySearch : inputs(first)[0];
    if (target) target.focus();
    announce(problems.length === 1 ? 'One answer needs attention.' : problems.length + ' answers need attention.');
  }

  /* ----------------------------------------------------------------------
     Choosing a path
     ---------------------------------------------------------------------- */

  function renderProgress() {
    stepButtons = steps.map(function (step, n) {
      var button = el('button', 'apply-progress__step');
      button.type = 'button';
      button.setAttribute('data-go', String(n));
      var num = el('span', 'apply-progress__num', String(n + 1));
      num.setAttribute('aria-hidden', 'true');
      button.append(num, el('span', 'apply-progress__label', title(step)),
        el('span', 'visually-hidden apply-progress__state'));
      return button;
    });
    progressList.replaceChildren.apply(progressList, stepButtons.map(function (button) {
      var li = el('li', 'apply-progress__item');
      li.append(button);
      return li;
    }));
  }

  function setHash(hash) {
    if (window.history && history.replaceState) {
      history.replaceState(null, '', location.pathname + location.search + hash);
    }
  }

  /* Answers typed on one path stay put if the applicant switches and comes
     back; only the progress through the steps starts again. */
  function choosePath(name, moveFocus) {
    if (name !== path) {
      path = name;
      current = 0;
      steps = allSteps.filter(function (step) {
        var only = step.getAttribute('data-path');
        return !only || only === name;
      });
      allSteps.forEach(function (step) { step.hidden = true; });
      attempted = [];
      passed = [];
      furthest = 0;
      renderProgress();
    }
    pathLead.textContent = PATHS[name][0];
    pathName.textContent = PATHS[name][1];
    setHash('#' + name);
    pathBox.hidden = true;
    layout.hidden = false;
    go(current, moveFocus);
    if (moveFocus) layout.scrollIntoView({ block: 'start' });
  }

  function showPaths() {
    if (busy) return;
    layout.hidden = true;
    pathBox.hidden = false;
    setHash('');
    var card = pathBox.querySelector('[data-path="' + path + '"]') || pathBox.querySelector('[data-path]');
    card.focus();
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
    statusLine.textContent = 'Step ' + (index + 1) + ' of ' + steps.length + ': ' + title(steps[index]);

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

  var REVIEW = {
    country: [['Country', countryName]],
    skills: [['Skills', function () { return skillList().join(', '); }]],
    personal: [
      ['Full name', function () { return value('fullName'); }],
      ['Age', function () { return value('age'); }],
      ['Email address', function () { return value('email'); }]
    ],
    social: [
      ['Instagram', function () { return accountSummary('instagram'); }],
      ['TikTok', function () { return accountSummary('tiktok'); }],
      ['YouTube', function () { return accountSummary('youtube'); }]
    ],
    creator: [
      ['Content', function () { return contentList().join(', '); }],
      ['Experience', function () { return value('experience'); }],
      ['Links to your work', function () { return normalizedLinks('workLinks').join('\n'); }]
    ],
    work: [
      ['Experience', function () { return value('skillExperience'); }],
      ['Portfolio and links', function () { return normalizedLinks('portfolio').join('\n'); }]
    ],
    motivation: [
      ['Why you want to join', function () { return value('motivation'); }],
      ['What you could contribute', function () { return value('contribution'); }],
      ['Discord username', function () { return value('discord').replace(/^@/, ''); }]
    ]
  };

  function renderReview() {
    var parts = steps.slice(0, -1).map(function (step, n) {
      var name = title(step);
      var section = el('section', 'apply-review__part');
      var head = el('div', 'apply-review__head');
      var edit = el('button', 'apply-edit', 'Edit');
      edit.type = 'button';
      edit.disabled = busy;
      edit.setAttribute('data-go', String(n));
      edit.setAttribute('aria-label', 'Edit ' + name.toLowerCase());
      head.append(el('h3', null, name), edit);

      var list = el('dl');
      REVIEW[stepKey(step)].forEach(function (row) {
        var text = row[1]();
        list.append(el('dt', null, row[0]), el('dd', text ? null : 'is-empty', text || 'Not provided'));
      });
      section.append(head, list);
      return section;
    });
    reviewBox.replaceChildren.apply(reviewBox, parts);
  }

  /* ----------------------------------------------------------------------
     Sending
     ---------------------------------------------------------------------- */

  /* Field names match the columns in apps-script/applications.gs. Both
     paths send `experience` and `workLinks`; only the questions differ. */
  function payload() {
    var data = {
      track: path,
      timestamp: new Date().toISOString(),
      fullName: value('fullName'),
      age: Number(value('age')),
      email: value('email'),
      motivation: value('motivation'),
      contribution: value('contribution'),
      discord: value('discord').replace(/^@/, ''),
      rulesAccepted: control('rulesAccepted').checked,
      honeypot: control('website') ? control('website').value : ''
    };
    if (path === 'country') {
      data.country = countryName();
      data.countryListed = value('country') !== OTHER;
      data.instagram = value('instagram');
      data.tiktok = value('tiktok');
      data.youtube = value('youtube');
      data.instagramFollowers = followerCount('instagram');
      data.tiktokFollowers = followerCount('tiktok');
      data.youtubeFollowers = followerCount('youtube');
      data.contentTypes = contentList().join(', ');
      data.experience = value('experience');
      data.workLinks = normalizedLinks('workLinks').join('\n');
    } else {
      data.skills = skillList().join(', ');
      data.experience = value('skillExperience');
      data.workLinks = normalizedLinks('portfolio').join('\n');
    }
    return data;
  }

  function setBusy(on) {
    busy = on;
    form.setAttribute('aria-busy', on ? 'true' : 'false');
    submitButton.disabled = on;
    backButton.disabled = on;
    changePath.disabled = on;
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
    setHash('');
    donePanel.querySelector('h2').focus({ preventScroll: true });
    donePanel.scrollIntoView({ block: 'start' });
  }

  function endpoint() {
    var url = String(settings.endpoint || '').trim();
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
    if (busy || !path) return;
    if (current < steps.length - 1) jumpTo(current + 1);
    else send();
  });

  backButton.addEventListener('click', function () {
    if (!busy && current > 0) go(current - 1, true);
  });

  changePath.addEventListener('click', showPaths);

  /* The path cards, the step list and the review's Edit buttons. */
  document.addEventListener('click', function (event) {
    var card = event.target.closest('[data-path]');
    if (card && card.tagName === 'BUTTON') {
      choosePath(card.getAttribute('data-path'), true);
      return;
    }
    var trigger = event.target.closest('[data-go]');
    if (trigger && !trigger.disabled) jumpTo(Number(trigger.getAttribute('data-go')));
  });

  /* Once a step has been checked, its messages follow the answers live. */
  function recheck(event) {
    if (event.target.name && attempted[current]) check(current);
  }
  form.addEventListener('input', recheck);
  form.addEventListener('change', recheck);

  buildCountries();
  filterCountries();     // the browser may have put back an earlier search
  countrySearch.addEventListener('input', filterCountries);
  countryList.addEventListener('change', function () {
    syncCountry();
    if (value('country') === OTHER) control('countryOther').focus();
  });

  /* Enter in the search box never sends the step on; when the search is
     down to one country, it picks that one. */
  countrySearch.addEventListener('keydown', function (event) {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    var visible = toArray(countryList.querySelectorAll('.country-option:not(.country-option--other):not([hidden]) input'));
    if (visible.length === 1) {
      visible[0].checked = true;
      visible[0].dispatchEvent(new Event('change', { bubbles: true }));
      visible[0].focus();
    }
  });

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

  /* countriesirl.com/apply/#country or #creative skips the choice. */
  var start = location.hash.slice(1);
  if (PATHS[start]) {
    choosePath(start, false);
  } else {
    pathBox.hidden = false;
  }
})();
