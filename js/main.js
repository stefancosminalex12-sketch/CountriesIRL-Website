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
      if (typeof value === 'string') node.textContent = value;
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

    /* Arrays of strings rendered as list items. */
    each('[data-list]', function (node) {
      var items = get(node.dataset.list);
      if (!Array.isArray(items)) return;
      node.replaceChildren.apply(node, items.map(function (text) {
        return el('li', null, text);
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
    countryIndex: function (node) {
      node.replaceChildren.apply(node, countriesByCount().map(function (entry) {
        var li = el('li');
        li.append(el('span', 'index__country', entry.country));
        /* A column of "1"s says nothing — only show a number worth reading. */
        if (entry.count > 1) li.append(el('span', 'index__count', String(entry.count)));
        return li;
      }));
    },

    memberCount: function (node) {
      node.textContent = plural(members.length, 'member');
    },

    principles: function (node) {
      var items = get('about.principles') || [];
      node.replaceChildren.apply(node, items.map(function (item) {
        var li = el('li');
        li.append(el('h3', null, item.title), el('p', null, item.text));
        return li;
      }));
    },

    highlights: function (node) {
      var items = get('community.highlights') || [];
      node.replaceChildren.apply(node, items.map(function (text) {
        return el('li', null, text);
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

    if (!member.image) return fallback;

    var img = el('img', 'member__avatar');
    img.src = member.image;
    /* The name sits next to the image, so repeating it here would only make
       screen readers say it twice. Decorative by intent. */
    img.alt = '';
    img.width = 46;
    img.height = 46;
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

  function memberCard(member) {
    var card = el('article', 'member');
    card.dataset.country = member.country;

    var head = el('div', 'member__head');
    var meta = el('div');
    meta.append(
      el('h3', 'member__name', member.name),
      el('p', 'member__country', member.country)
    );
    head.append(avatar(member), meta);

    card.append(head, el('p', 'member__desc', member.description || ''));

    var links = memberLinks(member);
    if (links) card.append(links);

    return card;
  }

  function initMembers() {
    var grid = document.getElementById('member-grid');
    var filterBar = document.getElementById('member-filter');
    var status = document.getElementById('member-status');
    var empty = document.getElementById('member-empty');
    if (!grid) return;

    grid.replaceChildren.apply(grid, members.map(memberCard));

    function setStatus(country, shown) {
      if (!status) return;
      status.textContent = country
        ? plural(shown, 'creator') + ' in ' + country
        : plural(members.length, 'creator') + ' from ' +
          plural(countriesByCount().length, 'country', 'countries');
    }

    setStatus('', members.length);

    if (!filterBar) return;

    var countries = countriesByCount()
      .map(function (c) { return c.country; })
      .sort(function (a, b) { return a.localeCompare(b); });

    /* A filter is only worth showing once there is something to filter. */
    if (countries.length < 3) {
      filterBar.remove();
      return;
    }

    ['All'].concat(countries).forEach(function (country, i) {
      var button = el('button', 'filter__btn', country);
      button.type = 'button';
      button.dataset.country = i === 0 ? '' : country;
      button.setAttribute('aria-pressed', i === 0 ? 'true' : 'false');
      filterBar.append(button);
    });

    filterBar.addEventListener('click', function (event) {
      var button = event.target.closest('.filter__btn');
      if (!button) return;

      var country = button.dataset.country;

      Array.prototype.forEach.call(filterBar.children, function (b) {
        b.setAttribute('aria-pressed', String(b === button));
      });

      var shown = 0;
      Array.prototype.forEach.call(grid.children, function (card) {
        var match = !country || card.dataset.country === country;
        card.hidden = !match;
        if (match) shown++;
      });

      setStatus(country, shown);
      if (empty) empty.hidden = shown > 0;
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
     Start
     ---------------------------------------------------------------------- */

  applyBindings();
  runRenderers();
  initMembers();
  applyMeta();
  initNav();
})();
