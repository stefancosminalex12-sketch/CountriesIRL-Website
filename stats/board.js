/* ==========================================================================
   CountriesIRL — live figures

   Reads ../data/stats.json every few seconds and keeps the table in step with
   it. Rows do not jump when the order changes: their old positions are
   measured, the new order is written, and each row is animated from where it
   was to where it now belongs.

   Nothing here invents a number. A figure the publisher could not read is left
   blank rather than shown as zero, and a trend the history cannot support yet
   is left blank rather than shown as no change.
   ========================================================================== */

(function () {
  'use strict';

  var STATS_URL = '../data/stats.json';
  var POLL_MS = 5000;
  /* Two missed polls in a row and the badge stops claiming to be live. */
  var STALE_AFTER = POLL_MS * 2.5;

  var rowsNode = document.getElementById('rows');
  var totalsNode = document.getElementById('totals');
  var liveNode = document.getElementById('live');
  var liveText = document.getElementById('live-text');
  var countNode = document.getElementById('board-count');
  var noteNode = document.getElementById('note');

  var sort = 'followers';
  var lastGeneratedAt = null;
  var lastOkAt = 0;
  var rowIndex = {};      /* username -> row element */
  var previousValues = {}; /* username -> last rendered numbers, for flashing */

  var STILL = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------------------------------------------------------------- utils */

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function group(n) {
    return Math.abs(n).toLocaleString('en-GB');
  }

  function signed(n) {
    return (n < 0 ? '−' : '+') + group(n);
  }

  function present(v) {
    return v !== null && v !== undefined;
  }

  /* ------------------------------------------------------------- the rows */

  function numberCell(value, options) {
    options = options || {};
    var cell = el('span', 'col-num ' + (options.className || ''));
    if (!present(value)) {
      cell.classList.add('is-empty');
      cell.textContent = '';
      cell.setAttribute('aria-label', 'not on this platform');
      return cell;
    }
    cell.textContent = options.signed ? signed(value) : group(value);
    if (options.signed && value < 0) cell.dataset.direction = 'down';
    if (options.signed && value > 0) cell.dataset.direction = 'up';
    return cell;
  }

  function buildRow(account) {
    var row = el('div', 'row');
    row.setAttribute('role', 'row');
    row.dataset.username = account.username;

    row.append(el('span', 'col-rank', String(account.rank)));

    var name = el('span', 'col-name');
    name.append(el('span', 'row__label', account.label));
    var handles = el('span', 'row__handles');
    if (account.instagram) handles.append(el('span', 'tag', 'IG'));
    if (account.youtube) handles.append(el('span', 'tag', 'YT'));
    if (account.tiktok) handles.append(el('span', 'tag', 'TT'));
    name.append(handles);
    row.append(name);

    row.append(
      numberCell(account.instagram && account.instagram.followers),
      numberCell(account.youtube && account.youtube.subscribers),
      numberCell(account.tiktok && account.tiktok.followers),
      numberCell(account.followers, { className: 'is-total' }),
      numberCell(account.hour, { signed: true }),
      numberCell(account.day, { signed: true })
    );
    return row;
  }

  /* Flash a cell that has just changed, so movement is visible without
     watching the number itself. */
  function flash(cell, direction) {
    if (STILL.matches) return;
    cell.dataset.flash = direction;
    window.setTimeout(function () { delete cell.dataset.flash; }, 1200);
  }

  function updateRow(row, account) {
    var cells = row.querySelectorAll('.col-num');
    var values = [
      account.instagram && account.instagram.followers,
      account.youtube && account.youtube.subscribers,
      account.tiktok && account.tiktok.followers,
      account.followers,
      account.hour,
      account.day
    ];
    var before = previousValues[account.username] || [];

    row.querySelector('.col-rank').textContent = String(account.rank);

    values.forEach(function (value, i) {
      var cell = cells[i];
      if (!cell) return;

      var text = present(value)
        ? (i >= 4 ? signed(value) : group(value))
        : '';

      if (cell.textContent !== text) {
        cell.textContent = text;
        cell.classList.toggle('is-empty', !present(value));
        if (present(value) && present(before[i]) && value !== before[i]) {
          flash(cell, value > before[i] ? 'up' : 'down');
        }
      }
      if (i >= 4 && present(value)) {
        cell.dataset.direction = value < 0 ? 'down' : 'up';
      }
    });

    previousValues[account.username] = values;
  }

  /* Reorder with the rows animating from their old positions rather than
     snapping. Measure, rewrite, then play the difference. */
  function reorder(order) {
    var first = {};
    Object.keys(rowIndex).forEach(function (username) {
      first[username] = rowIndex[username].getBoundingClientRect().top;
    });

    order.forEach(function (username) {
      rowsNode.append(rowIndex[username]);
    });

    if (STILL.matches) return;

    order.forEach(function (username) {
      var row = rowIndex[username];
      var delta = first[username] - row.getBoundingClientRect().top;
      if (!delta) return;

      row.style.transition = 'none';
      row.style.transform = 'translateY(' + delta + 'px)';
      /* Force the browser to take the start position before animating. */
      void row.offsetHeight;
      row.style.transition = 'transform 0.55s cubic-bezier(0.22, 0.61, 0.36, 1)';
      row.style.transform = '';
      row.dataset.moved = delta > 0 ? 'up' : 'down';
      window.setTimeout(function () { delete row.dataset.moved; }, 900);
    });
  }

  function sortValue(account) {
    if (sort === 'views') return account.views || 0;
    if (sort === 'likes') return account.likes || 0;
    if (sort === 'day') return account.day === null ? -Infinity : account.day;
    if (sort === 'hour') return account.hour === null ? -Infinity : account.hour;
    return account.followers;
  }

  function renderRows(list) {
    var ordered = list.slice().sort(function (a, b) {
      return sortValue(b) - sortValue(a) || a.label.localeCompare(b.label);
    });

    ordered.forEach(function (account) {
      if (!rowIndex[account.username]) {
        rowIndex[account.username] = buildRow(account);
        rowsNode.append(rowIndex[account.username]);
        previousValues[account.username] = null;
      }
      updateRow(rowIndex[account.username], account);
    });

    reorder(ordered.map(function (a) { return a.username; }));

    countNode.textContent = ordered.length + ' accounts';
  }

  /* ------------------------------------------------------------- the head */

  function totalBlock(value, label, hour, day, note) {
    var block = el('div', 'total');
    block.append(el('p', 'total__value', group(value)), el('p', 'total__label', label));

    var moves = [];
    if (present(hour) && hour !== 0) moves.push(signed(hour) + '/h');
    if (present(day) && day !== 0) moves.push(signed(day) + ' today');
    if (moves.length) {
      var trend = el('p', 'total__trend', moves.join(' · '));
      if ((present(day) && day < 0) || (!present(day) && hour < 0)) {
        trend.dataset.direction = 'down';
      }
      block.append(trend);
    }
    if (note) block.append(el('p', 'total__note', note));
    return block;
  }

  function renderTotals(stats) {
    var t = stats.totals;
    var blocks = [
      totalBlock(t.followers, 'followers', t.hour, t.day,
        [t.instagram && group(t.instagram) + ' Instagram',
         t.youtube && group(t.youtube) + ' YouTube',
         t.tiktok && group(t.tiktok) + ' TikTok'].filter(Boolean).join(' · '))
    ];

    if (t.views) {
      blocks.push(totalBlock(t.views, 'views', t.viewsHour, t.viewsDay,
        'lifetime, across ' + stats.platforms.youtube + ' YouTube channels'));
    }
    if (t.likes) {
      blocks.push(totalBlock(t.likes, 'likes', t.likesHour, t.likesDay,
        'across ' + stats.platforms.tiktok + ' TikTok accounts'));
    }

    totalsNode.replaceChildren.apply(totalsNode, blocks);
  }

  /* --------------------------------------------------------------- status */

  function setLive(state, text) {
    liveNode.dataset.state = state;
    liveText.textContent = text;
  }

  function describeAge(stats) {
    var published = new Date(stats.generatedAt);
    var mins = Math.round((Date.now() - published.getTime()) / 60000);
    if (mins < 2) return 'published just now';
    if (mins < 60) return 'published ' + mins + ' minutes ago';
    var hours = Math.round(mins / 60);
    return 'published ' + hours + (hours === 1 ? ' hour' : ' hours') + ' ago';
  }

  function renderNote(stats) {
    var parts = [describeAge(stats)];
    if (stats.coverageHours < 1) {
      parts.push('hourly and daily movement appears once the tracker has been ' +
        'running that long — ' + Math.round(stats.coverageHours * 60) +
        ' minutes of readings so far');
    } else if (stats.coverageHours < 24) {
      parts.push('daily movement appears after 24 hours of readings — ' +
        Math.round(stats.coverageHours) + ' hours so far');
    }
    parts.push('YouTube rounds its subscriber counts; every other figure is exact');
    noteNode.textContent = parts.join('. ') + '.';
  }

  /* ----------------------------------------------------------------- poll */

  function apply(stats) {
    lastOkAt = Date.now();

    /* Nothing new published: keep the table exactly as it is. */
    if (stats.generatedAt === lastGeneratedAt) {
      setLive('live', 'live');
      return;
    }
    lastGeneratedAt = stats.generatedAt;

    renderTotals(stats);
    renderRows(stats.list);
    renderNote(stats);
    setLive('live', 'updated');
    window.setTimeout(function () {
      if (Date.now() - lastOkAt < STALE_AFTER) setLive('live', 'live');
    }, 1500);
  }

  function poll() {
    fetch(STATS_URL + '?t=' + Date.now(), { cache: 'no-store' })
      .then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
      })
      .then(apply)
      .catch(function () {
        if (Date.now() - lastOkAt > STALE_AFTER) {
          setLive('stale', lastGeneratedAt ? 'reconnecting' : 'no figures published yet');
        }
      });
  }

  /* ----------------------------------------------------------------- init */

  document.getElementById('year').textContent = '© ' + new Date().getFullYear();

  Array.prototype.forEach.call(document.querySelectorAll('.sort'), function (button) {
    button.addEventListener('click', function () {
      sort = button.dataset.sort;
      Array.prototype.forEach.call(document.querySelectorAll('.sort'), function (b) {
        b.setAttribute('aria-pressed', String(b === button));
      });
      fetch(STATS_URL + '?t=' + Date.now(), { cache: 'no-store' })
        .then(function (r) { return r.json(); })
        .then(function (stats) { renderRows(stats.list); })
        .catch(function () { /* the table simply stays as it was */ });
    });
  });

  poll();
  window.setInterval(poll, POLL_MS);

  /* A tab left in the background stops polling; catch up the moment it is
     looked at again. */
  document.addEventListener('visibilitychange', function () {
    if (!document.hidden) poll();
  });
}());
