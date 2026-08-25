/* ==========================================================================
   CountriesIRL — site configuration
   --------------------------------------------------------------------------
   This is the only file you need to edit to change the website's content.
   Everything below is plain JavaScript: text in quotes, lists in [ brackets ],
   groups in { braces }. Keep the commas where they are and you cannot go wrong.

   CONFIG.md explains what every value below does, and how to add a member.
   ========================================================================== */

window.SITE_CONFIG = {

  /* ------------------------------------------------------------------
     1. BRAND
     The logo is a file path, relative to the site root. Drop a new file
     into assets/logo/ and point `logo` at it — nothing else to change.
     ------------------------------------------------------------------ */
  brand: {
    name: 'CountriesIRL',
    /* IRLLOGO.png is the full-size original (1532px, ~3MB). The header shows
       the mark at 26px, so the site loads IRLLOGO-web.png — the same artwork
       resized to 128px. Re-export it if you change the original. */
    logo: 'assets/logo/IRLLOGO-web.png',
    logoAlt: 'CountriesIRL',
    // Used for SEO canonical + Open Graph tags. Include the trailing slash.
    url: 'https://countriesirl.com/'
  },

  /* ------------------------------------------------------------------
     2. SEO / SOCIAL PREVIEW
     ------------------------------------------------------------------ */
  meta: {
    title: 'CountriesIRL — the creators behind the world’s countries',
    description:
      'CountriesIRL is a global network of creators representing the countries ' +
      'they know — through entertainment, culture, history and current events.',
    ogImage: 'assets/og-image.png'
  },

  /* ------------------------------------------------------------------
     3. HOME / HERO
     ------------------------------------------------------------------ */
  hero: {
    // The small line above the headline. Set it to '' to hide it entirely.
    eyebrow: 'EST. 2026',
    title: 'A global network of creators connecting the world.',
    // One entry per paragraph.
    description: [
      'CountriesIRL connects creators from around the world to share the ' +
      'stories, history, culture, and events that make each country unique. ' +
      'We want to help people discover countries they may know little about, ' +
      'uncover things they’ve never heard of, and see the world from ' +
      'different perspectives.',
      'Through entertaining content, documentaries, and educational projects, ' +
      'we aim to make learning about the world more accessible while ' +
      'promoting the places, people, and cultures that deserve to be ' +
      'discovered.'
    ],
    primaryCta: { label: 'Apply to join', href: '#join' },
    secondaryCta: { label: 'About', href: '#about' },
    /* The three figures under the hero buttons. `value: 'auto:...'` is filled
       in from the member list below, so the numbers can never go stale. */
    stats: [
      { value: 'auto:members',   label: 'Country accounts' },
      { value: '300K+',          label: 'Followers across the network' },
      { value: 'No.1',           label: 'In the world' }
    ]
  },

  /* ------------------------------------------------------------------
     4. ABOUT
     `body` is a list of paragraphs — add or remove lines freely.
     ------------------------------------------------------------------ */
  about: {
    title: 'What CountriesIRL is',
    lead:
      'A creator and media network built around countries, cultures and the ' +
      'people who represent them.',
    body: [
      'Members are creators and teams who cover a country from the inside — ' +
      'their own knowledge, language and point of view, turned into content ' +
      'about the people, history, traditions and current events behind a part ' +
      'of the world. Some of it is funny, some of it is serious, and most of ' +
      'it would not read the same coming from anyone else.',
      'It began as a handful of country-focused social accounts and is growing ' +
      'past that. Short-form and memes are where most members work today. ' +
      'Satire, explainers, history, geography and longer documentary work are ' +
      'the direction it is heading in.'
    ],

    /* The short version of where the network came from. Sits between the
       paragraphs above and the three points below. */
    origin: {
      title: 'How it started',
      body: [
        'CountriesIRL started in March 2026 with Romania IRL and a simple ' +
        'idea: get the people behind country pages talking to each other. ' +
        'There was no organisation behind it and no plan longer than a ' +
        'paragraph.',
        'Other creators saw where it was going and joined. One account became ' +
        'a handful, the handful became a network, and it is still getting ' +
        'bigger.'
      ]
    }
  },

/* ------------------------------------------------------------------
     5. MEMBERS
     --------------------------------------------------------------------
     >>> TO ADD A MEMBER: copy one of the blocks below, paste it at the end
     >>> of the list, and edit the values. Mind the comma between entries.
     >>> The cards are built from this list, and the count above them is
     >>> simply how many entries are here.
     >>>
     >>>   {
     >>>     name: 'Country',                      // required, the only text on the card
     >>>     flag: 'assets/flags/xx.png',          // the flag shown beside it
     >>>     links: []                             // add links here when you have them
     >>>   }
     >>>
     >>> `flag` is an explicit path, so an entry can fly a flag that is not
     >>> its own — Ottoman Empire uses tr.png, Nebraska uses us.png. Flags
     >>> live in assets/flags/, one PNG per ISO code. If the file is missing
     >>> the card falls back to the member's initials rather than breaking.
     >>>
     >>> A member may also carry `country`, `image`, `description` and
     >>> `website`; all four are optional and none are in use right now,
     >>> because the cards are meant to show the name and nothing else.
     ------------------------------------------------------------------ */

     members: {
    title: 'Members',
    lead:
      'The people behind the pages — individual creators now, creative teams ' +
      'before long. Each covers a country, a region or a piece of history ' +
      'they know from the inside, in their own language.',
    list: [
      {
        name: 'Romania (Owner)',
        flag: 'assets/flags/ro.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/romaniairl/' }
        ]
      },
      {
        name: 'Pakistan',
        flag: 'assets/flags/pk.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/pakistaniirl/' }
        ]
      },
      {
        name: 'Italy',
        flag: 'assets/flags/it.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/italyirl/' }
        ]
      },
      {
        name: 'Belgium',
        flag: 'assets/flags/be.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/belgiumirl/' }
        ]
      },
      {
        name: 'USSR',
        flag: 'assets/flags/ru.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/sovietunionirl/' }
        ]
      },
      {
        name: 'Portugal',
        flag: 'assets/flags/pt.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/portugalirlmain/' }
        ]
      },
      {
        name: 'Czech Republic',
        flag: 'assets/flags/cz.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/czechrepublicirl/' }
        ]
      },
      {
        name: 'Greece',
        flag: 'assets/flags/gr.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/greeceirlmain/' }
        ]
      },
      {
        name: 'Lithuania',
        flag: 'assets/flags/lt.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/lithuaniairl/' }
        ]
      },
      {
        name: 'Syria',
        flag: 'assets/flags/sy.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/syriairlmain/' }
        ]
      },
      {
        name: 'Turkmenistan',
        flag: 'assets/flags/tm.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/turkmenistanirl/' }
        ]
      },
      {
        name: 'Poland',
        flag: 'assets/flags/pl.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/poland.irl/' }
        ]
      },
      {
        name: 'United States',
        flag: 'assets/flags/us.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/unitedstatesirl/' }
        ]
      },
      {
        name: 'Türkiye',
        flag: 'assets/flags/tr.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/ottoman_irl/' }
        ]
      },
      {
        name: 'Ottoman Empire',
        flag: 'assets/flags/tr.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/ottoman_irl/' }
        ]
      },
      {
        name: 'San Marino',
        flag: 'assets/flags/sm.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/sanmarinoirl/' }
        ]
      },
      {
        name: 'Russia',
        flag: 'assets/flags/ru.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/russiairlmain/' }
        ]
      },
      {
        name: 'Afghanistan',
        flag: 'assets/flags/af.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/afghanistan.irl/' }
        ]
      },
      {
        name: 'France',
        flag: 'assets/flags/fr.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/franceirlmain/' }
        ]
      },
      {
        name: 'North Macedonia',
        flag: 'assets/flags/mk.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/macedonia.irl/' }
        ]
      },
      {
        name: 'Croatia',
        flag: 'assets/flags/hr.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/croatiairl_/' }
        ]
      },
      {
        name: 'Fiji',
        flag: 'assets/flags/fj.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/fijiirlmain/' }
        ]
      },
      {
        name: 'Byzantine Empire',
        flag: 'assets/flags/gr.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/byzantineempire.irl/' }
        ]
      },
      {
        name: 'Roman Empire',
        flag: 'assets/flags/it.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/romanempireirl/' }
        ]
      },
      {
        name: 'United Kingdom',
        flag: 'assets/flags/gb.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/brituishirl/' }
        ]
      },
      {
        name: 'China',
        flag: 'assets/flags/cn.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/chinairlmain/' }
        ]
      },
      {
        name: 'Nebraska',
        flag: 'assets/flags/us.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/nebraskairl/' }
        ]
      },
      {
        name: 'Bahrain',
        flag: 'assets/flags/bh.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/bahrainirl_/' }
        ]
      },
      {
        name: 'Gibraltar',
        flag: 'assets/flags/gi.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/gibraltar_irl/' }
        ]
      },
      {
        name: 'Lebanon',
        flag: 'assets/flags/lb.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/lebanonirlmain/' }
        ]
      },
      {
        name: 'Iraq',
        flag: 'assets/flags/iq.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/iraqirl_/' }
        ]
      },
      {
        name: 'Alabama',
        flag: 'assets/flags/us.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/alabama.irl/' }
        ]
      },
      {
        name: 'Bangladesh',
        flag: 'assets/flags/bd.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/bangladesh.irl_/' }
        ]
      },
      {
        name: 'Ohio',
        flag: 'assets/flags/us.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/ohio_irl/' }
        ]
      },
      {
        name: 'Hungary',
        flag: 'assets/flags/hu.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/hungary.irl_/' }
        ]
      },
      {
        name: 'Finland',
        flag: 'assets/flags/fi.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/finlandirl_/' }
        ]
      },
      {
        name: 'Georgia (Sakartvelo)',
        flag: 'assets/flags/ge.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/sakartveloirl/' }
        ]
      }
    ]
  },
  /* ------------------------------------------------------------------
     6. COMMUNITY
     ------------------------------------------------------------------ */
  community: {
    title: 'The community',
    lead:
      'CountriesIRL brings creators together from around the world, giving ' +
      'them the opportunity to grow their platforms, represent their ' +
      'countries, and collaborate with other creators as part of a larger ' +
      'network.',
    body: [
      'Through the network, we aim to produce content that makes learning ' +
      'about the world more accessible and engaging. This includes history, ' +
      'culture, geography, tourism, current events, geopolitics, and the ' +
      'stories and facts that are often overlooked.',
      'As CountriesIRL expands, creators can work together on larger projects ' +
      'and reach audiences around the world, with each member contributing ' +
      'their own knowledge, perspective, and experience.'
    ],
    // The quiet line above the Discord link. Set it to '' to hide it.
    ctaPrompt: 'Want to learn more about us?',
    cta: { label: 'Join our Discord', href: 'https://discord.gg/w9qV9nzG2Y' }
  },

  /* ------------------------------------------------------------------
     7. JOIN
     `cta.href` — point this at your application form, or leave it as
     'mailto:' + your contact email to take applications over email.

     The two lists below accept either a plain string or a { title, text }
     pair. A pair puts the title on its own line above the description.
     ------------------------------------------------------------------ */
  join: {
    title: 'Join the network',
    lead: 'Every application is reviewed by our team.',
    who: {
      title: 'Who we are looking for',
      items: [
        {
          title: 'Consistent creators',
          text:
            'Accounts that post regularly and mean to keep building. Minimum ' +
            '1K–3K followers — not a popularity bar, just a sign you are ' +
            'already committed and likely to still be posting next month.'
        },
        {
          title: 'Authentic country representation',
          text:
            'You know the country you represent: the culture, the people, the ' +
            'language, the context behind the news. Living there is not ' +
            'required if the connection is genuine.'
        },
        {
          title: 'Additional creative skills',
          text:
            'Video editing, graphic design, animation, motion design, writing ' +
            '— anything that can feed the wider projects the network takes on.'
        }
      ]
    },
    gets: {
      title: 'What members get',
      items: [
        {
          title: 'Network',
          text: 'A place among creators working on the same idea from across the map.'
        },
        {
          title: 'Support',
          text: 'People to compare notes with, solve problems with and learn from.'
        },
        {
          title: 'Reach',
          text: 'A line into established country pages and the audiences behind them.'
        },
        {
          title: 'Identity',
          text: 'Your page becomes part of something with a name, not just another account.'
        },
        {
          title: 'Opportunities',
          text: 'First access to collaborations and creative projects that come out of the network.'
        },
        {
          title: 'Earnings',
          text:
            'As CountriesIRL expands, members will have the chance to take ' +
            'part in paid projects and other ways of earning through it.'
        }
      ]
    },
    cta: { label: 'Start an application', href: 'mailto:join@countriesirl.com?subject=CountriesIRL%20application' },
    /* The lead above already promises a review, so this line carries the
       practical part instead of repeating it two lines later. */
    note: 'Tell us which country you represent and link your account.'
  },

  /* ------------------------------------------------------------------
     8. CONTACT + SOCIAL
     Social links appear in the footer. Add or remove entries freely.
     ------------------------------------------------------------------ */
  contact: {
    email: 'hello@countriesirl.com'
  },

  social: [
    { label: 'YouTube', url: 'https://www.youtube.com/@countriesirl' },
    { label: 'Instagram', url: 'https://www.instagram.com/countriesirl' },
    { label: 'X', url: 'https://x.com/countriesirl' },
    { label: 'Discord', url: 'https://discord.gg/w9qV9nzG2Y' }
  ],

  /* ------------------------------------------------------------------
     9. FOOTER
     ------------------------------------------------------------------ */
  footer: {
    note: 'An independent network. Everyone owns their own account.'
  }
};
