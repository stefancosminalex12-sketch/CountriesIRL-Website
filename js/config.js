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
    title: 'The global network of creators behind the world’s countries.',
    description:
      'CountriesIRL brings creators together to represent the countries they ' +
      'know and care about, through entertainment, culture, history, current ' +
      'events and more. We believe content can help people look beyond ' +
      'borders, understand different perspectives, and discover the world ' +
      'through the people who live it.',
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
    },

    /* Three short statements about how the network actually operates.
       Add a fourth if you need one — the layout takes any number. */
    principles: [
      {
        title: 'Represented by people who know it',
        text:
          'A country should be covered by someone with a real connection to ' +
          'it — born there, raised there, living there, or close enough that ' +
          'it never shows. For smaller countries that often means creators ' +
          'abroad who carry the culture with them.'
      },
      {
        title: 'Entertainment first',
        text:
          'Nothing here is a lecture. Culture, history and current events ' +
          'travel further when the content is worth watching on its own.'
      },
      {
        title: 'Bigger than one account',
        text:
          'Members share what they have worked out, build on each other’s ' +
          'reach, and take on projects no single page would get to alone.'
      }
    ]
  },

/* ------------------------------------------------------------------
     5. MEMBERS
     --------------------------------------------------------------------
     >>> TO ADD A MEMBER: copy the block between the braces below, paste it
     >>> at the end of the list, and edit the values. Mind the comma between
     >>> entries. The website builds the member cards from this list, so
     >>> nothing else needs changing.
     >>>
     >>>   {
     >>>     name:        'Channel or creator name',   // required
     >>>     country:     'Country',                   // required
     >>>     image:       'assets/members/file.jpg',   // optional — leave '' for the flag
     >>>     description: 'One or two sentences.',     // optional
     >>>     website:     'https://example.com',       // optional
     >>>     links: [                                  // optional, any platform
     >>>       { label: 'YouTube',   url: 'https://…' },
     >>>       { label: 'Instagram', url: 'https://…' }
     >>>     ]
     >>>   }
     >>>
     >>> Profile images: square, at least 200×200px, saved in assets/members/.
     >>> With no image the card shows the country's flag, and with no flag on
     >>> file it shows the member's initials. A missing photo never breaks it.

     NOTE ON DESCRIPTIONS: most entries deliberately have none. The ones that
     were here before only restated the flag already shown on the card, in the
     same sentence 35 times over, which is the single clearest tell that copy
     was generated rather than written. Add a real line when you know one —
     what the account actually posts — and it will appear on the card. An
     empty description simply renders nothing.
     ------------------------------------------------------------------ */
 
     members: {
    title: 'Members',
    lead:
      'The people behind the pages — individual creators now, creative teams ' +
      'before long. Each covers a country, a region or a piece of history ' +
      'they know from the inside, in their own language.',
    list: [
      {
        name: 'Romania',
        country: 'Romania',
        image: '',
        description: 'Founder\'s account. The network started here.',
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/romaniairl' }
        ]
      },
      {
        name: 'chinairl',
        country: 'China',
        image: '',
        description: '',
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/chinairlmain' }
        ]
      },
      {
        name: 'United Kingdom',
        country: 'United Kingdom',
        image: '',
        description: '',
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/unitedkingdomirl1' }
        ]
      },
      {
        name: 'canadairl',
        country: 'Canada',
        image: '',
        description: '',
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/canadairlmain' }
        ]
      },
      {
        name: 'Switzerland',
        country: 'Switzerland',
        image: '',
        description: '',
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/switzerland.irl' }
        ]
      },
      {
        name: 'Belgium',
        country: 'Belgium',
        image: '',
        description: '',
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/belgiumirl' }
        ]
      },
      {
        name: 'poland',
        country: 'Poland',
        image: '',
        description: '',
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/poland.irl' }
        ]
      },
      {
        name: 'Pakistan',
        country: 'Pakistan',
        image: '',
        description: '',
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/pakistaniirl' }
        ]
      },
      {
        name: 'Afghanistan',
        country: 'Afghanistan',
        image: '',
        description: '',
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/afghanistan.irl' }
        ]
      },
      {
        name: 'IRAQ',
        country: 'Iraq',
        image: '',
        description: '',
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/iraqirl_' }
        ]
      },
      {
        name: 'SYRIAIRL',
        country: 'Syria',
        image: '',
        description: '',
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/syriairlmain' }
        ]
      },
      {
        name: 'Portugal irl',
        country: 'Portugal',
        image: '',
        description: '',
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/portugalirlmain' }
        ]
      },
      {
        name: 'Hungary',
        country: 'Hungary',
        image: '',
        description: '',
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/hungary.irl_' }
        ]
      },
      {
        name: 'Bangladesh',
        country: 'Bangladesh',
        image: '',
        description: '',
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/bangladesh.irl_' }
        ]
      },
      {
        name: 'Turkmenistan',
        country: 'Turkmenistan',
        image: '',
        description: '',
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/turkmenistanirl' }
        ]
      },
      {
        name: 'Kyrgyzstan.irl',
        country: 'Kyrgyzstan',
        image: '',
        description: '',
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/kyrgyzstan.irl' }
        ]
      },
      {
        name: 'Bahrain',
        country: 'Bahrain',
        image: '',
        description: '',
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/bahrain.irl' }
        ]
      },
      {
        name: 'Lebanon',
        country: 'Lebanon',
        image: '',
        description: '',
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/lebanonirlmain' }
        ]
      },
      {
        name: 'georgia',
        country: 'Georgia',
        image: '',
        description: '',
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/sakartveloirl' }
        ]
      },
      {
        name: 'Moldova',
        country: 'Moldova',
        image: '',
        description: '',
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/moldovaairl' }
        ]
      },
      {
        name: 'Slovakia',
        country: 'Slovakia',
        image: '',
        description: '',
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/slovakiairl' }
        ]
      },
      {
        name: 'bosniaherzegovinairl',
        country: 'Bosnia and Herzegovina',
        image: '',
        description: '',
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/bosniaherzegovinairl' }
        ]
      },
      {
        name: 'croatiairl',
        country: 'Croatia',
        image: '',
        description: '',
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/croatiairlmain' }
        ]
      },
      {
        name: 'Roman Empire.irl',
        country: 'Roman Empire',
        image: '',
        description: '',
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/roman.empire.irl' }
        ]
      },
      {
        name: 'byzantineempire.irl',
        country: 'Byzantine Empire',
        image: '',
        description: '',
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/byzantineempire.irl' }
        ]
      },
      {
        // Display name was cut off in the screenshot ("Make Yugoslav..."); using the handle.
        name: 'yugosiavia',
        country: 'Yugoslavia',
        image: '',
        description: '',
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/yugosiavia' }
        ]
      },
      {
        name: 'kingdomofpolandirl',
        country: 'Kingdom of Poland',
        image: '',
        description: '',
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/kingdomofpolandirl' }
        ]
      },
      {
        // TODO: confirm this handle. Display name was cut off ("United States of K...").
        name: 'kurdistanirl',
        country: 'Kurdistan',
        image: '',
        description: '',
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/kurdistanirl' }
        ]
      },
      /* Not published: the screenshot cut off both the name and the handle, and
         the flag only resembled Serbia. Fill in the real details and uncomment.

      {
        name: '',
        country: '',
        image: '',
        description: '',
        website: '',
        links: [
          { label: 'Instagram', url: '' }
        ]
      },
      */
      {
        name: 'Antarctica',
        country: 'Antarctica',
        image: '',
        description: '',
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/antarcticairlmain' }
        ]
      },
      {
        name: 'Texas',
        country: 'United States (Texas)',
        image: '',
        description: '',
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/texas.irl_' }
        ]
      },
      {
        name: 'ohio_irl',
        country: 'United States (Ohio)',
        image: '',
        description: '',
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/ohio_irl' }
        ]
      },
      {
        name: 'Alabama',
        country: 'United States (Alabama)',
        image: '',
        description: '',
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/alabama.irl' }
        ]
      },
      {
        name: 'Nebraska',
        country: 'United States (Nebraska)',
        image: '',
        description: '',
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/nebraskairl' }
        ]
      },
      {
        name: 'North Pole',
        country: 'North Pole',
        image: '',
        description: '',
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/northpoleirl' }
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
      'CountriesIRL is not only the creators. It is also everyone who turns ' +
      'up for the content.',
    body: [
      'Around the accounts there is a growing audience of people who like ' +
      'finding out how somewhere else actually works — the geography, the ' +
      'history, the news that never travels, the jokes that only land if you ' +
      'live there.',
      'The Discord is where that crowd and the creators end up in the same ' +
      'room. Ask a member something, settle an argument about a flag, or ' +
      'watch the next round of posts come together.'
    ],
    cta: { label: 'Join the Discord', href: 'https://discord.gg/w9qV9nzG2Y' }
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
