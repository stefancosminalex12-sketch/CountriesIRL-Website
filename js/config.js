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
     The same wording is written into the <head> of index.html, so search
     engines and link previews see it without running JavaScript — change
     it there too.
     ------------------------------------------------------------------ */
  meta: {
    title: 'CountriesIRL — a global network of country-focused creators',
    description:
      'Creators from around the world covering countries, culture, history and ' +
      'geography, through educational and entertaining content and documentaries.',
    ogImage: 'assets/og-image.png'
  },

  /* ------------------------------------------------------------------
     3. HOME / HERO
     ------------------------------------------------------------------ */
  hero: {
    // The small line above the headline. Set it to '' to hide it entirely.
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
    secondaryCta: { label: 'About', href: '#about' }
  },

  /* ------------------------------------------------------------------
     3b. THE NETWORK IN NUMBERS
     The three figures in the band under the hero. 'auto:members' counts
     the member list below; any other value is printed as written, and one
     that starts with a digit counts up as you scroll onto it.
     ------------------------------------------------------------------ */
  stats: [
    { value: '300K+',           label: 'Followers across the network' },
    { value: 'auto:members',    label: 'Creators in the network' },
    { value: 'Est. 2026',       label: 'Founded in March, 2026' }
  ],
  /* ------------------------------------------------------------------
     4. ABOUT
     `body` is a list of paragraphs — add or remove lines freely.
     ------------------------------------------------------------------ */
  about: {
    title: 'What is CountriesIRL?',
    lead: '',                            // empty hides it; the paragraph below says it all
    body: [
      'CountriesIRL is a project built around the countries, cultures, people, ' +
      'and history that make up our world. By combining education and ' +
      'entertainment through our network of creators, we aim to make learning ' +
      'about history, geopolitics, culture, geography, tourism, and current ' +
      'events more accessible while developing educational content, ' +
      'documentaries, and projects that bring perspectives from different ' +
      'parts of the world to a wider audience.'
    ],

    /* The short version of where the network came from. Sits between the
       paragraphs above and the three points below. */
    origin: {
      title: 'How it started',
      body: [
        'CountriesIRL started on March 3, 2026, as a single country-focused ' +
        'Instagram page created by RomaniaIRL. After finding success during ' +
        'its first week and gaining its initial few members, we realized the ' +
        'same concept could work across multiple country-focused pages, each ' +
        'representing a different part of the world.',
        'As the network grew, the project expanded beyond Instagram to YouTube ' +
        'and TikTok, while we began developing our own website, tools, and ' +
        'infrastructure. We also shifted our focus toward producing ' +
        'higher-quality content. The concept of country-focused pages was not ' +
        'entirely new, but bringing multiple creators together under one ' +
        'shared IRL identity was. CountriesIRL grew into a network and a hub ' +
        'for creators who want to represent their countries, collaborate, and ' +
        'develop their own identity as creators.'
      ]
    }
  },

/* ------------------------------------------------------------------
     5. MEMBERS
     --------------------------------------------------------------------
     >>> TO ADD A MEMBER: copy one of the blocks below, paste it into the
     >>> list, and edit the values. Mind the comma between entries.
     >>> The cards are built from this list, and the count above them is
     >>> simply how many entries are here.
     >>>
     >>> ORDER: members with a `priority` number come first, 1 before 2 and
     >>> so on; everyone else follows in alphabetical order of their name.
     >>> The page sorts them itself, so a new member never needs placing —
     >>> the list below is kept in that same order only to make it easy to read.
     >>>
     >>>   {
     >>>     name: 'Country',                      // required, the only text on the card
     >>>     flag: 'assets/flags/xx.png',          // the flag shown beside it
     >>>     links: []                             // add links here when you have them
     >>>   }
     >>>
     >>> `flag` is an explicit path, so an entry can fly a flag that is not
     >>> its own — the Soviet Union uses su.svg, Nebraska uses Nebraska.svg. Flags
     >>> live in assets/flags/, one PNG per ISO code. If the file is missing
     >>> the card falls back to the member's initials rather than breaking.
     >>>
     >>> A member may also carry `country`, `image`, `description` and
     >>> `website`; all four are optional and none are in use right now,
     >>> because the cards are meant to show the name and nothing else.
     >>>
     >>> For the globe in the hero (js/globe.js) a member can also carry:
     >>>   geo        Where it sits. Leave it out for a country: it is read
     >>>              from the flag file name, so ro.png is Romania. Use
     >>>              'US-OH' for a U.S. state, or { at: [lon, lat] } for a
     >>>              place with no modern border, like a historical capital.
     >>>   origin     true on the account the network started from.
     >>>   followers  A real follower count for the globe card, e.g. 12345.
     >>>              Leave it out when unknown: the card just leaves that
     >>>              line off. Without it the card uses the follower
     >>>              tracker's exact figure (data/stats.json) for the
     >>>              member's current Instagram handle, if it has one.
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
        priority: 1,
        origin: true,                    // where the network started
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/romaniairl/' },
          { label: 'YouTube', url: 'https://www.youtube.com/@romaniairl' },
          { label: 'TikTok', url: 'https://www.tiktok.com/@romaniairl' }
        ]
      },
      {
        name: 'United Kingdom',
        flag: 'assets/flags/gb.png',
        priority: 2,
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/brituishirl/' },
          { label: 'YouTube', url: 'https://www.youtube.com/@brituishirl' },
          { label: 'TikTok', url: 'https://www.tiktok.com/@unitedkingdomirl' }
        ]
      },
      {
        name: 'United States',
        flag: 'assets/flags/us.png',
        priority: 3,
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/unitedstatesirl/' },
          { label: 'YouTube', url: 'https://www.youtube.com/@unitedstatesirl' },
          { label: 'TikTok', url: 'https://www.tiktok.com/@unitedstatesirl' }
        ]
      },
      {
        name: 'Russia',
        flag: 'assets/flags/ru.png',
        priority: 4,
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/russiairl/' }
        ]
      },
      {
        name: 'China',
        flag: 'assets/flags/cn.png',
        priority: 5,
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/chinairl_/' },
          { label: 'YouTube', url: 'https://www.youtube.com/@chinairlmain' },
          { label: 'TikTok', url: 'https://www.tiktok.com/@chinairlmain' }
        ]
      },
      {
        name: 'Fiji',
        flag: 'assets/flags/fj.png',
        priority: 6,
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/fijiirlmain/' },
          { label: 'YouTube', url: 'https://www.youtube.com/@Fijiirl' },
          { label: 'TikTok', url: 'https://www.tiktok.com/@fijiirl' }
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
        name: 'Alabama',
        flag: 'assets/flags/Alabama.png',
        geo: 'US-AL',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/alabama.irl/' },
          { label: 'TikTok', url: 'https://www.tiktok.com/@alabama_irl' }
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
        name: 'Belgium',
        flag: 'assets/flags/be.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/belgiumirl/' }
        ]
      },
      {
        name: 'Byzantine Empire',
        flag: 'assets/flags/byzantine.svg',
        geo: { at: [28.98, 41.01] },     // Constantinople
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/byzantineempire.irl/' }
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
        name: 'Czechoslovakia',
        flag: 'assets/flags/cz.png',
        geo: { at: [14.42, 50.09] },     // Prague
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/czechoslovakiairlmain/' }
        ]
      },
      {
        name: 'Czech Republic',
        flag: 'assets/flags/cz.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/czechrepublicirl/' },
          { label: 'TikTok', url: 'https://www.tiktok.com/@czechrepublicirl' }
        ]
      },
      {
        name: 'Finland',
        flag: 'assets/flags/fi.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/finlandirl_/' },
          { label: 'YouTube', url: 'https://www.youtube.com/@FinlandIRL' },
          { label: 'TikTok', url: 'https://www.tiktok.com/@finlandirl' }
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
        // Internal key, never shown: keeps the country apart from a future
        // entry for the U.S. state of Georgia.
        id: 'georgia-country',
        name: 'Georgia',
        flag: 'assets/flags/ge.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/sakartveloirl/' }
        ]
      },
      {
        name: 'Germany',
        flag: 'assets/flags/de.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/germanyirl_/' }
        ]
      },
      {
        name: 'Gibraltar',
        flag: 'assets/flags/gi.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/gibraltar_irl/' },
          { label: 'TikTok', url: 'https://www.tiktok.com/@gibraltar_irl' }
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
        name: 'Iraq',
        flag: 'assets/flags/iq.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/iraqirl_/' }
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
        name: 'Lebanon',
        flag: 'assets/flags/lb.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/lebanonirlmain/' }
        ]
      },
      {
        name: 'Lithuania',
        flag: 'assets/flags/lt.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/lithuaniairl/' },
          { label: 'YouTube', url: 'https://www.youtube.com/@Lithuaniairl' }
        ]
      },
      {
        name: 'Nebraska',
        flag: 'assets/flags/Nebraska.svg',
        geo: 'US-NE',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/nebraskairl/' }
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
        name: 'Ohio',
        flag: 'assets/flags/Ohio.svg',
        geo: 'US-OH',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/ohio_irl/' },
          { label: 'TikTok', url: 'https://www.tiktok.com/@ohio.irl1' }
        ]
      },
      {
        name: 'Ottoman Empire',
        flag: 'assets/flags/Ot.jpg',
        geo: { at: [28.98, 41.01] },     // Constantinople
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/ottoman_irl/' }
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
        name: 'Philippines',
        flag: 'assets/flags/ph.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/philippinesirlmain/' }
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
        name: 'Portugal',
        flag: 'assets/flags/pt.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/portugalirlmain/' }
        ]
      },
      {
        name: 'Roman Empire',
        flag: 'assets/flags/roman.png',
        geo: { at: [12.48, 41.89] },     // Rome
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/romanempireirl/' }
        ]
      },
      {
        name: 'Russian Empire',
        flag: 'assets/flags/russian-empire.svg',
        geo: { at: [30.31, 59.94] },     // Saint Petersburg
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/russian.empire_irl/' }
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
        name: 'Soviet Union',
        flag: 'assets/flags/su.svg',
        geo: { at: [37.62, 55.75] },     // Moscow
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/sovietunionirl/' },
          { label: 'TikTok', url: 'https://www.tiktok.com/@sovietunionirl' }
        ]
      },
      {
        name: 'Türkiye',
        flag: 'assets/flags/tr.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/turkiyeirlmain/' }
        ]
      },
      {
        name: 'Turkmenistan',
        flag: 'assets/flags/tm.png',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/turkmenistanirl/' }
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
      'CountriesIRL is built around the connections between its members. ' +
      'Creators can exchange ideas, collaborate on projects, and learn from ' +
      'people representing different countries and backgrounds.',
    body: [
      'As the network grows, so does the community around it. The goal is to ' +
      'create a space where people can discover new perspectives, take part ' +
      'in discussions, and connect with others who share an interest in the ' +
      'world and its many stories.'
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
    lead: 'Applications are checked every few days.',
    cta: { label: 'Start an application', href: 'https://www.youtube.com/watch?v=QDia3e12czc' },
    /* The lead above already promises a review, so this line carries the
       practical part instead of repeating it two lines later. */
    /* The line beside the form. Keep it to one sentence. */
    quote: 'From one page to a global network.',
    /* Sits under the quote, quietly. */
    founded: 'Founded in March 2026',

    /* Second button, for anyone not ready to apply yet. */
    discordCta: { label: 'Join our Discord', href: 'https://discord.gg/w9qV9nzG2Y' },
    note: 'Tell us which country you represent and link your account. Not ready to apply? Come and ask in the Discord.'
  },

  /* ------------------------------------------------------------------
     8. CONTACT + SOCIAL
     Social links appear in the footer. Add or remove entries freely.
     ------------------------------------------------------------------ */
  contact: {
    email: 'countriesirlhub@gmail.com'
  },

  social: [
    { label: 'YouTube', url: 'https://www.youtube.com/@countriesirl' },
    { label: 'Instagram', url: 'https://www.instagram.com/countriesirl' },
    { label: 'TikTok', url: 'https://www.tiktok.com/@countriesirl' },
    { label: 'Discord', url: 'https://discord.gg/w9qV9nzG2Y' }
  ],

  /* ------------------------------------------------------------------
     9. FOOTER
     ------------------------------------------------------------------ */
  footer: {
    note: 'An independent network. Everyone owns their own account.'
  }
};
