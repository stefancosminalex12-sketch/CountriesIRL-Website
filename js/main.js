/* ==========================================================================
   CountriesIRL — site behaviour
   --------------------------------------------------------------------------
   Reads window.SITE_CONFIG (js/config.js) and builds the page from it, then
   wires up the navigation. Nothing here needs editing to change content.
   ========================================================================== */

(function () {
  'use strict';

  var config = window.SITE_CONFIG;

  if (!config) {
    console.error('CountriesIRL: js/config.js did not load, so the page has no content to show.');
    return;
  }

  /* ----------------------------------------------------------------------
     Helpers
     ---------------------------------------------------------------------- */

  /** Resolve a dotted path such as 'hero.primaryCta.label' against config. */
  function get(path) {
    return path.split('.').reduce(function (value, key) {
      return (value === null || value === undefined) ? undefined : value[key];
    }, config);
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function each(selector, fn) {
    Array.prototype.forEach.call(document.querySelectorAll(selector), fn);
  }

  /** Absolute URL against brand.url, for meta tags that require one. */
  function absolute(pathOrUrl) {
    if (!pathOrUrl) return '';
    if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
    var base = (get('brand.url') || '').replace(/\/?$/, '/');
    return base + String(pathOrUrl).replace(/^\//, '');
  }

  function isExternal(href) {
    return /^(https?:)?\/\//i.test(href);
  }

  /** Anchor with the right target/rel for external destinations. */
  function link(href, label) {
    var a = el('a', null, label);
    a.href = href;
    if (isExternal(href)) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
    return a;
  }

  /* ----------------------------------------------------------------------
     Declarative bindings
     ---------------------------------------------------------------------- */

  function applyBindings() {
    each('[data-text]', function (node) {
      var value = get(node.dataset.text);
      if (typeof value !== 'string') return;
      node.textContent = value;
      /* An empty value in config hides the element instead of leaving a
         blank line where its margin used to be. */
      node.hidden = value === '';
    });

    each('[data-attr-src]', function (node) {
      var value = get(node.dataset.attrSrc);
      if (value) node.setAttribute('src', value);
    });

    /* {label, href} pairs — one config entry drives both the text and target. */
    each('[data-cta]', function (node) {
      var cta = get(node.dataset.cta);
      /* No entry in config means nothing to link to. Bailing out early used to
         leave the empty button sitting there as a blank box, so hide it. */
      if (!cta || !cta.href) {
        node.hidden = true;
        return;
      }
      node.hidden = false;
      node.textContent = cta.label || '';
      node.setAttribute('href', cta.href);
      if (isExternal(cta.href)) {
        node.target = '_blank';
        node.rel = 'noopener noreferrer';
      }
    });

    /* Arrays of strings rendered as paragraphs. */
    each('[data-paragraphs]', function (node) {
      var items = get(node.dataset.paragraphs);
      if (!Array.isArray(items)) return;
      node.replaceChildren.apply(node, items.map(function (text) {
        return el('p', null, text);
      }));
    });

    /* Lists take either a plain string or a { title, text } pair. A pair
       puts the title on its own line above the description. */
    each('[data-list]', function (node) {
      var items = get(node.dataset.list);
      if (!Array.isArray(items)) return;
      node.replaceChildren.apply(node, items.map(function (item) {
        if (typeof item === 'string') return el('li', null, item);
        var li = el('li');
        if (item.title) li.append(el('strong', null, item.title));
        if (item.text) li.append(document.createTextNode(item.text));
        return li;
      }));
    });
  }

  /* ----------------------------------------------------------------------
     Section renderers
     ---------------------------------------------------------------------- */

  var members = (get('members.list') || []).filter(function (m) {
    /* `country` is optional: entries that name their own flag do not need it. */
    return m && m.name;
  });

  function countriesByCount() {
    var counts = {};
    members.forEach(function (m) {
      if (!m.country) return;
      counts[m.country] = (counts[m.country] || 0) + 1;
    });
    return Object.keys(counts)
      .map(function (country) { return { country: country, count: counts[country] }; })
      .sort(function (a, b) {
        return b.count - a.count || a.country.localeCompare(b.country);
      });
  }

  function plural(n, singular, pluralForm) {
    return n + ' ' + (n === 1 ? singular : (pluralForm || singular + 's'));
  }

  var renderers = {
    /* Hero figures. Anything written as 'auto:…' in config is counted from the
       member list, so the numbers cannot drift away from the truth. */
    flagMarquee: function (node) {
      var sources = [];
      members.forEach(function (member) {
        var source = flagSource(member);
        if (source && sources.indexOf(source) === -1) sources.push(source);
      });
      if (!sources.length) return;

      function row() {
        var div = el('div', 'marquee__row');
        sources.forEach(function (source) {
          var img = el('img', 'marquee__flag');
          img.src = source;
          img.alt = '';
          img.width = 39;
          img.height = 26;
          /* Every copy crosses the screen during the loop, and they all reuse
             the first row's cached files, so there is nothing worth deferring
             — while a lazy flag could scroll into view still blank. */
          img.decoding = 'async';
          div.append(img);
        });
        return div;
      }

      var track = el('div', 'marquee__track');
      track.append(row());
      node.replaceChildren(track);

      /* Flag size is fixed in CSS, so a row measures the same whether or not
         the images have arrived. This width is the tile the loop repeats on. */
      var period = track.firstElementChild.getBoundingClientRect().width;
      if (!period) return;

      track.style.setProperty('--marquee-shift', period + 'px');

      /* The slide consumes one row, so the rows behind it have to cover the
         strip by themselves — otherwise the end of the track drifts into view
         and leaves a blank stretch before the loop restarts.

         Grows only. Appending leaves the running animation alone, whereas
         rebuilding the track would snap it back to the start of the loop. */
      function fill() {
        var visible = node.getBoundingClientRect().width || window.innerWidth;
        var needed = Math.ceil(visible / period) + 1;
        while (track.children.length < needed) track.append(row());
      }

      fill();

      /* Both, deliberately. The observer catches every reason the strip can
         change width, not just a window drag; the resize event covers the
         case where observer callbacks are not being delivered because the
         page is not painting. fill() is idempotent, so running twice costs
         a comparison. */
      window.addEventListener('resize', fill);
      if (window.ResizeObserver) new ResizeObserver(fill).observe(node);
    },

    social: function (node) {
      var items = (get('social') || []).filter(function (s) { return s && s.label && s.url; });
      node.replaceChildren.apply(node, items.map(function (item) {
        var li = el('li');
        li.append(link(item.url, item.label));
        return li;
      }));
    },

    contact: function (node) {
      var email = get('contact.email');
      if (!email) return;
      node.replaceChildren(link('mailto:' + email, email));
    },

    year: function (node) {
      node.textContent = '© ' + new Date().getFullYear();
    }
  };

  function runRenderers() {
    each('[data-render]', function (node) {
      var fn = renderers[node.dataset.render];
      if (fn) fn(node);
    });
  }

  /* ----------------------------------------------------------------------
     Member cards
     ---------------------------------------------------------------------- */

  /* --------------------------------------------------------------------
     Flags
     --------------------------------------------------------------------
     Flag emoji are built from ISO country codes, so the map below is just
     name -> code. A member entry can always override the result with its
     own `flag: '\uD83C\uDDF7\uD83C\uDDF4'` value, and anything unmatched
     falls back to the member's initials rather than showing nothing.
     -------------------------------------------------------------------- */
  var COUNTRY_CODES = {
    'afghanistan': 'AF', 'albania': 'AL', 'algeria': 'DZ', 'andorra': 'AD',
    'angola': 'AO', 'antarctica': 'AQ', 'argentina': 'AR', 'armenia': 'AM',
    'australia': 'AU', 'austria': 'AT', 'azerbaijan': 'AZ', 'bahrain': 'BH',
    'bangladesh': 'BD', 'belarus': 'BY', 'belgium': 'BE', 'bolivia': 'BO',
    'bosnia and herzegovina': 'BA', 'brazil': 'BR', 'bulgaria': 'BG',
    'cambodia': 'KH', 'cameroon': 'CM', 'canada': 'CA', 'chile': 'CL',
    'china': 'CN', 'colombia': 'CO', 'costa rica': 'CR', 'croatia': 'HR',
    'cuba': 'CU', 'cyprus': 'CY', 'czechia': 'CZ', 'czech republic': 'CZ',
    'denmark': 'DK', 'dominican republic': 'DO', 'ecuador': 'EC', 'egypt': 'EG',
    'estonia': 'EE', 'ethiopia': 'ET', 'finland': 'FI', 'france': 'FR',
    'georgia': 'GE', 'germany': 'DE', 'ghana': 'GH', 'greece': 'GR',
    'guatemala': 'GT', 'hong kong': 'HK', 'hungary': 'HU', 'iceland': 'IS',
    'india': 'IN', 'indonesia': 'ID', 'iran': 'IR', 'iraq': 'IQ',
    'ireland': 'IE', 'israel': 'IL', 'italy': 'IT', 'jamaica': 'JM',
    'japan': 'JP', 'jordan': 'JO', 'kazakhstan': 'KZ', 'kenya': 'KE', 'kingdom of poland': 'PL',
    'kuwait': 'KW', 'kyrgyzstan': 'KG', 'latvia': 'LV', 'lebanon': 'LB',
    'libya': 'LY', 'lithuania': 'LT', 'luxembourg': 'LU', 'malaysia': 'MY',
    'malta': 'MT', 'mexico': 'MX', 'moldova': 'MD', 'monaco': 'MC',
    'mongolia': 'MN', 'montenegro': 'ME', 'morocco': 'MA', 'nepal': 'NP',
    'netherlands': 'NL', 'new zealand': 'NZ', 'nigeria': 'NG',
    'north macedonia': 'MK', 'norway': 'NO', 'oman': 'OM', 'pakistan': 'PK',
    'palestine': 'PS', 'panama': 'PA', 'paraguay': 'PY', 'peru': 'PE',
    'philippines': 'PH', 'poland': 'PL', 'portugal': 'PT', 'qatar': 'QA',
    'romania': 'RO', 'russia': 'RU', 'saudi arabia': 'SA', 'senegal': 'SN',
    'serbia': 'RS', 'singapore': 'SG', 'slovakia': 'SK', 'slovenia': 'SI',
    'south africa': 'ZA', 'south korea': 'KR', 'korea': 'KR', 'spain': 'ES',
    'sri lanka': 'LK', 'sweden': 'SE', 'switzerland': 'CH', 'syria': 'SY',
    'taiwan': 'TW', 'tanzania': 'TZ', 'thailand': 'TH', 'tunisia': 'TN',
    'turkey': 'TR', 'turkmenistan': 'TM', 'uganda': 'UG', 'ukraine': 'UA',
    'united arab emirates': 'AE', 'united kingdom': 'GB', 'uk': 'GB',
    'united states': 'US', 'usa': 'US', 'uruguay': 'UY', 'uzbekistan': 'UZ',
    'venezuela': 'VE', 'vietnam': 'VN', 'yemen': 'YE', 'zimbabwe': 'ZW'
  };

  /* 'United States (Texas)' and 'Poland (historical — Kingdom of Poland)' both
     want the parent country's flag, so trim qualifiers before looking up. */
  function baseCountry(country) {
    return String(country)
      .replace(/\(.*?\)/g, ' ')
      .split('\u2014')[0]
      .replace(/\s+/g, ' ')
      .trim()
      .toLowerCase();
  }

  /* Flag artwork lives in assets/flags/, one PNG per ISO code. Historical and
     fictional entries have no flag file, so their cards fall back to initials. */
  function flagSource(member) {
    if (member.flag) return member.flag;
    var code = COUNTRY_CODES[baseCountry(member.country)];
    return code ? 'assets/flags/' + code.toLowerCase() + '.png' : '';
  }

  /* Ampersands are already stripped by the split below. */
  var SKIP_WORDS = ['the', 'and', 'of', 'a', 'an'];

  function initials(name) {
    var words = name.split(/[\s&]+/).filter(function (w) {
      return w && SKIP_WORDS.indexOf(w.toLowerCase()) === -1;
    });
    if (!words.length) words = [name];
    return words.slice(0, 2).map(function (w) {
      return w.charAt(0).toUpperCase();
    }).join('');
  }

  function avatar(member) {
    var fallback = el('span', 'member__avatar', initials(member.name));
    fallback.setAttribute('aria-hidden', 'true');

    /* A member photo wins if there is one; otherwise the country's flag. */
    if (!member.image) {
      var source = flagSource(member);
      if (!source) return fallback;

      var flag = el('img', 'member__flag');
      flag.src = source;
      flag.alt = '';
      flag.width = 46;
      flag.height = 31;
      flag.loading = 'lazy';
      flag.addEventListener('error', function () { flag.replaceWith(fallback); });
      return flag;
    }

    var img = el('img', 'member__avatar');
    img.src = member.image;
    /* The name sits next to the image, so repeating it here would only make
       screen readers say it twice. Decorative by intent. */
    img.alt = '';
    img.width = 46;
    img.height = 31;
    img.loading = 'lazy';
    img.addEventListener('error', function () {
      img.replaceWith(fallback);
    });
    return img;
  }

  function memberLinks(member) {
    var entries = (member.links || []).slice();
    if (member.website) entries.push({ label: 'Website', url: member.website });

    entries = entries.filter(function (l) { return l && l.label && l.url; });
    if (!entries.length) return null;

    var ul = el('ul', 'member__links');
    entries.forEach(function (entry) {
      var li = el('li');
      var a = link(entry.url, entry.label);
      a.setAttribute('aria-label', entry.label + ' — ' + member.name);
      li.append(a);
      ul.append(li);
    });
    return ul;
  }

  function sameWord(a, b) {
    var strip = function (v) { return String(v).toLowerCase().replace(/[^a-z]/g, ''); };
    return strip(a) === strip(b);
  }

  function memberCard(member) {
    var card = el('article', 'member');
    if (member.country) card.dataset.country = member.country;

    /* The handle is how a row is matched to its figures in data/stats.json. */
    var handle = memberHandle(member);
    if (handle) card.dataset.handle = handle;

    var head = el('div', 'member__head');
    var meta = el('div');
    meta.append(el('h3', 'member__name', member.name));

    /* Half the accounts are named after their country, and the flag is right
       there — printing the country again would say it for a third time. */
    if (member.country && !sameWord(member.name, member.country)) {
      meta.append(el('p', 'member__country', member.country));
    }

    /* Sits inside the name block, not under the card, so it reads as a second
       line belonging to the member rather than a footer on the row. */
    var links = memberLinks(member);
    if (links) meta.append(links);

    head.append(avatar(member), meta);

    card.append(head);
    if (member.description) card.append(el('p', 'member__desc', member.description));

    return card;
  }

  /* How many accounts are on screen before the roster asks to be expanded. */
  var VISIBLE = 20;

  function initMembers() {
    var grid = document.getElementById('member-grid');
    var status = document.getElementById('member-status');
    if (!grid) return;

    var cards = members.map(memberCard);
    grid.replaceChildren.apply(grid, cards);

    if (status) {
      status.textContent = plural(members.length, 'member');
    }

    var hiddenCards = cards.slice(VISIBLE);
    if (!hiddenCards.length) return;

    hiddenCards.forEach(function (card) { card.hidden = true; });

    var label = 'View all ' + members.length + ' members';
    var toggle = el('button', 'btn btn--secondary', label);
    toggle.type = 'button';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'member-grid');

    var row = el('div', 'members__more');
    row.append(toggle);
    grid.after(row);

    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';

      hiddenCards.forEach(function (card) { card.hidden = open; });
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.textContent = open ? label : 'Show fewer';

      /* Collapsing from the bottom of a long list would otherwise leave the
         reader stranded somewhere below the section. */
      if (open && grid.getBoundingClientRect().top < 0) {
        grid.scrollIntoView({ block: 'start' });
      }
    });
  }

  /* ----------------------------------------------------------------------
     Head: title, description, Open Graph, structured data
     ---------------------------------------------------------------------- */

  function setMeta(selector, value) {
    var tag = document.head.querySelector(selector);
    if (tag && value) tag.setAttribute('content', value);
  }

  function applyMeta() {
    var title = get('meta.title');
    var description = get('meta.description');
    var url = get('brand.url');
    var image = absolute(get('meta.ogImage'));

    if (title) document.title = title;
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:site_name"]', get('brand.name'));
    setMeta('meta[property="og:url"]', url);
    setMeta('meta[property="og:image"]', image);

    var canonical = document.head.querySelector('link[rel="canonical"]');
    if (canonical && url) canonical.setAttribute('href', url);

    var schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: get('brand.name'),
      description: description,
      url: url,
      logo: absolute(get('brand.logo')),
      email: get('contact.email'),
      sameAs: (get('social') || []).map(function (s) { return s.url; }).filter(Boolean)
    };

    var script = el('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.append(script);
  }

  /* ----------------------------------------------------------------------
     Navigation
     ---------------------------------------------------------------------- */

  function initNav() {
    var header = document.querySelector('.site-header');
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('primary-nav');
    if (!header || !toggle || !nav) return;

    var isMobile = window.matchMedia('(max-width: 52em)');

    function closeNav() {
      toggle.setAttribute('aria-expanded', 'false');
      nav.removeAttribute('data-open');
    }

    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      if (open) nav.removeAttribute('data-open');
      else nav.setAttribute('data-open', 'true');
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        closeNav();
        toggle.focus();
      }
    });

    document.addEventListener('click', function (event) {
      if (toggle.getAttribute('aria-expanded') !== 'true') return;
      if (!nav.contains(event.target) && !toggle.contains(event.target)) closeNav();
    });

    isMobile.addEventListener('change', closeNav);

    /* Anchor links scroll natively: `scroll-behavior` and `scroll-padding-top`
       in the stylesheet do the work, the browser keeps the history entry, and
       the sections carry tabindex="-1" so focus follows too. All that is left
       is closing the menu behind the link. */
    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) closeNav();
    });

    /* Mark the section currently under the header. */
    var links = {};
    var sections = [];

    each('.nav__list a[href^="#"]', function (anchor) {
      var id = anchor.getAttribute('href').slice(1);
      var section = document.getElementById(id);
      if (!section) return;
      links[id] = anchor;
      sections.push(section);
    });

    if (!sections.length) return;

    var ticking = false;

    function updateActive() {
      ticking = false;
      var line = window.scrollY + header.offsetHeight + 24;
      var currentId = sections[0].id;

      sections.forEach(function (section) {
        if (section.getBoundingClientRect().top + window.scrollY <= line) {
          currentId = section.id;
        }
      });

      /* The last section is often too short to reach the line on its own. */
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
        currentId = sections[sections.length - 1].id;
      }

      Object.keys(links).forEach(function (id) {
        if (id === currentId) links[id].setAttribute('aria-current', 'true');
        else links[id].removeAttribute('aria-current');
      });
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateActive);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    updateActive();
  }

  /* ----------------------------------------------------------------------
     Live figures
     --------------------------------------------------------------------
     data/stats.json is written by the follower tracker (see the README). It
     carries the current follower count per account plus the 1h and 24h
     movement, already worked out. Anything the tracker could not measure
     arrives as null and is simply not drawn, so the page never invents a
     number or shows a dash where a figure should be.
     ---------------------------------------------------------------------- */

  var STATS_URL = 'data/stats.json';

  function group(n) {
    return Math.abs(n).toLocaleString('en-GB');
  }

  function signed(n) {
    return (n < 0 ? '\u2212' : '+') + group(n);
  }

  /* 'brituishirl' out of 'https://www.instagram.com/brituishirl/'. */
  function handleFrom(url) {
    var match = /instagram\.com\/([^\/?#]+)/i.exec(String(url || ''));
    return match ? match[1].toLowerCase() : null;
  }

  function memberHandle(member) {
    var found = null;
    (member.links || []).forEach(function (link) {
      if (!found) found = handleFrom(link && link.url);
    });
    return found;
  }

  function trendItem(label, value) {
    var li = el('li', 'trend');
    li.append(
      el('span', 'trend__value', signed(value)),
      el('span', 'trend__label', label)
    );
    if (value < 0) li.dataset.direction = 'down';
    return li;
  }

  function figure(value, label, hour, day) {
    var item = el('div', 'figure');
    var number = el('p', 'figure__value', group(value));
    number.dataset.count = String(value);
    item.append(number, el('p', 'figure__label', label));

    var moves = [];
    if (hour !== null && hour !== undefined && hour !== 0) moves.push(signed(hour) + ' in an hour');
    if (day !== null && day !== undefined && day !== 0) moves.push(signed(day) + ' today');
    if (moves.length) {
      var trend = el('p', 'figure__trend', moves.join(' \u00b7 '));
      if ((day !== null && day < 0) || (day === null && hour < 0)) {
        trend.dataset.direction = 'down';
      }
      item.append(trend);
    }
    return item;
  }

  function renderNetwork(stats) {
    var band = document.querySelector('.stats-band');
    var node = document.getElementById('network');
    if (!band || !node || !stats || !stats.totals) return;

    var totals = stats.totals;
    var figures = el('div', 'network__figures');

    figures.append(figure(totals.followers, 'followers across the network',
      totals.hour, totals.day));

    if (totals.views) {
      figures.append(figure(totals.views, 'views on YouTube',
        totals.viewsHour, totals.viewsDay));
    }
    if (totals.likes) {
      figures.append(figure(totals.likes, 'likes on TikTok',
        totals.likesHour, totals.likesDay));
    }

    var stamp = el('p', 'network__stamp');
    var when = new Date(stats.generatedAt);
    stamp.append(
      document.createTextNode(plural(stats.accounts, 'account') + ' \u00b7 counted ' +
        when.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' \u00b7 ')
    );
    var more = el('a', null, 'every account, live');
    more.href = 'stats/';
    stamp.append(more);

    node.replaceChildren(figures, stamp);

    band.hidden = false;
    band.setAttribute('data-reveal', '');
    revealOn(band);
  }

  /* Follower count and 24h movement on each row of the roster. */
  function renderMemberStats(stats) {
    var byHandle = {};
    (stats.list || []).forEach(function (account) {
      byHandle[account.username.toLowerCase()] = account;
    });

    each('.member', function (card) {
      var handle = card.dataset.handle;
      var account = handle && byHandle[handle];
      if (!account) return;

      var existing = card.querySelector('.member__stat');
      if (existing) existing.remove();

      var wrap = el('div', 'member__stat');
      var count = el('span', 'member__count', group(account.followers));
      if (account.approximate) count.title = 'Instagram rounds this one';
      wrap.append(count);

      if (account.day !== null && account.day !== undefined && account.day !== 0) {
        var delta = el('span', 'member__delta', signed(account.day));
        if (account.day < 0) delta.dataset.direction = 'down';
        wrap.append(delta);
      }

      var head = card.querySelector('.member__head');
      if (head) head.append(wrap);
    });
  }

  /* How often an open page re-reads the figures. The file only changes when
     the tracker publishes, so this is cheap: a few hundred bytes, and the
     browser gets a 304 whenever nothing has moved. */
  var STATS_POLL_MS = 60000;

  function initLiveFigures() {
    if (typeof fetch !== 'function') return;

    /* Same cache-buster the assets use, so a fresh page never reads figures
       the browser cached an hour ago. */
    var version = (document.currentScript && document.currentScript.src || '').split('?v=')[1];
    var url = STATS_URL + (version ? '?v=' + version : '?t=' + Date.now());

    fetch(url, { cache: 'no-cache' })
      .then(function (response) {
        if (!response.ok) throw new Error('stats.json ' + response.status);
        return response.json();
      })
      .then(function (stats) {
        renderNetwork(stats);
        renderMemberStats(stats);
      })
      .catch(function (error) {
        /* No figures is a fine outcome: the band stays hidden and the roster
           reads as it did before. Nothing on the page depends on this. */
        console.warn('CountriesIRL: live figures unavailable —', error.message);
      });
  }

  function pollLiveFigures() {
    fetch(STATS_URL + '?t=' + Date.now(), { cache: 'no-store' })
      .then(function (response) { return response.ok ? response.json() : null; })
      .then(function (stats) {
        if (!stats) return;
        renderNetwork(stats);
        renderMemberStats(stats);
        /* The band has already been revealed by now, so show it outright
           rather than animating the new figures in from nothing. */
        var band = document.querySelector('.stats-band');
        if (band) band.setAttribute('data-revealed', 'true');
      })
      .catch(function () { /* a failed poll just means the last figures stand */ });
  }

  /* ----------------------------------------------------------------------
     Scroll reveal
     --------------------------------------------------------------------
     The hero figures sit low in the dark band, so they arrive as you scroll:
     each one lifts into place and its number counts up. Anything marked
     [data-reveal] gets the lift; [data-count] gets the count.
     ---------------------------------------------------------------------- */

  var STILL = window.matchMedia('(prefers-reduced-motion: reduce)');

  function countUp(node, target) {
    var duration = 900;
    var start = 0;

    var suffix = node.dataset.suffix || '';

    function frame(now) {
      if (!start) start = now;
      var t = Math.min((now - start) / duration, 1);
      /* Ease out — fast first, settles on the real number. */
      var eased = 1 - Math.pow(1 - t, 3);
      /* Grouped as it climbs — 254,541 reads as a number, 254541 reads as
         a serial. */
      node.textContent = Math.round(target * eased).toLocaleString('en-GB') + suffix;
      if (t < 1) window.requestAnimationFrame(frame);
    }

    node.textContent = '0' + suffix;
    window.requestAnimationFrame(frame);
  }

  function reveal(node) {
    node.setAttribute('data-revealed', 'true');
    each('[data-count]', function (value) {
      if (!node.contains(value)) return;
      countUp(value, Number(value.dataset.count));
    });
  }

  /* Reveal a single node that arrived after the initial pass. */
  function revealOn(node) {
    if (STILL.matches || !('IntersectionObserver' in window)) {
      reveal(node);
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.01, rootMargin: '0px 0px -8% 0px' });
    observer.observe(node);
  }

  function initReveal() {
    var targets = document.querySelectorAll('[data-reveal]');
    if (!targets.length) return;

    /* No observer, or the visitor asked for less motion: show it all now. */
    if (STILL.matches || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(targets, function (node) {
        node.setAttribute('data-revealed', 'true');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        observer.unobserve(entry.target);
      });
      /* A low threshold on purpose: tall blocks (the member grid) can never
         show a quarter of themselves at once. */
    }, { threshold: 0.01, rootMargin: '0px 0px -8% 0px' });

    Array.prototype.forEach.call(targets, function (node) { observer.observe(node); });
  }

  /* ----------------------------------------------------------------------
     Start
     ---------------------------------------------------------------------- */

  applyBindings();
  runRenderers();
  initMembers();
  applyMeta();
  initNav();
  initReveal();
  initLiveFigures();
  if (typeof fetch === 'function') window.setInterval(pollLiveFigures, STATS_POLL_MS);
})();
