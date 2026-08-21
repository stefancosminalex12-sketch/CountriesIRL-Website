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
      if (!cta || !cta.href) return;
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
    return m && m.name && m.country;
  });

  function countriesByCount() {
    var counts = {};
    members.forEach(function (m) {
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
    stats: function (node) {
      var auto = {
        'auto:members': String(members.length),
        'auto:countries': String(countriesByCount().length)
      };
      var items = (get('hero.stats') || []).filter(function (s) { return s && s.label; });
      node.replaceChildren.apply(node, items.map(function (item) {
        var text = auto[item.value] || item.value || '';
        var li = el('li');
        var value = el('span', 'stats__value', text);
        /* Numbers count up on reveal, suffix and all ('100M+'); anything that
           does not start with a digit ('No.1') simply appears. */
        var number = /^(\d+)(.*)$/.exec(text);
        if (number) {
          value.dataset.count = number[1];
          value.dataset.suffix = number[2];
        }
        li.append(value, el('span', 'stats__label', item.label));
        return li;
      }));
    },

    /* A moving strip of every flag in the network, doubled so the loop has no
       seam. Decorative only — screen readers skip it via aria-hidden. */
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
          img.loading = 'lazy';
          div.append(img);
        });
        return div;
      }

      node.replaceChildren(row(), row());
    },

    principles: function (node) {
      var items = get('about.principles') || [];
      node.replaceChildren.apply(node, items.map(function (item) {
        var li = el('li');
        li.append(el('h3', null, item.title), el('p', null, item.text));
        return li;
      }));
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
    card.dataset.country = member.country;

    var head = el('div', 'member__head');
    var meta = el('div');
    meta.append(el('h3', 'member__name', member.name));

    /* Half the accounts are named after their country, and the flag is right
       there — printing the country again would say it for a third time. */
    if (!sameWord(member.name, member.country)) {
      meta.append(el('p', 'member__country', member.country));
    }
    head.append(avatar(member), meta);

    card.append(head);
    if (member.description) card.append(el('p', 'member__desc', member.description));

    var links = memberLinks(member);
    if (links) card.append(links);

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
      status.textContent = plural(members.length, 'account') + ' in the network';
    }

    var hiddenCards = cards.slice(VISIBLE);
    if (!hiddenCards.length) return;

    hiddenCards.forEach(function (card) { card.hidden = true; });

    var label = 'View all ' + members.length + ' accounts';
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
      node.textContent = Math.round(target * eased) + suffix;
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
})();
