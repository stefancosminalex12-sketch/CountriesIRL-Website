/* ==========================================================================
   CountriesIRL — site configuration
   --------------------------------------------------------------------------
   This is the only file you need to edit to change the website's content.
   Everything below is plain JavaScript: text in quotes, lists in [ brackets ],
   groups in { braces }. Keep the commas where they are and you cannot go wrong.

   Open config.html in a browser for a visual reference of every value here,
   plus a form that writes new member entries for you.
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
    title: 'CountriesIRL — the biggest countries network in the world',
    description:
      'CountriesIRL is the biggest countries network in the world. Country ' +
      'accounts from every corner of the map, working together in one place.',
    ogImage: 'assets/og-image.png'
  },

  /* ------------------------------------------------------------------
     3. HOME / HERO
     ------------------------------------------------------------------ */
  hero: {
    title: 'The biggest countries network in the world.',
    description:
      'No other countries network comes close. Country accounts from every ' +
      'corner of the map, in one place, run by the people behind them. ' +
      'Members collab on posts, swap ideas and grow each other\'s pages.',
    primaryCta: { label: 'Apply to join', href: '#join' },
    secondaryCta: { label: 'About', href: '#about' },
    /* The three figures under the hero buttons. `value: 'auto'` is filled in
       from the member list below, so the numbers can never go stale. */
    stats: [
      { value: 'auto:members',   label: 'Country accounts' },
      { value: '100m+',          label: 'Views across the network' },
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
      'The biggest countries network in the world, run by the people behind ' +
      'the accounts.',
    body: [
      'CountriesIRL started with a few country accounts who kept running into ' +
      'the same thing. You post, you grow slowly, and there\'s nobody to ' +
      'compare notes with. The network came out of that. Whatever a member ' +
      'has figured out, everyone else gets to use.',
      'The accounts are spread across a lot of time zones and they don\'t all ' +
      'post the same thing, which is the point. Two accounts from different ' +
      'countries aren\'t chasing the same followers, so helping each other ' +
      'costs nothing.'
    ],
    /* Three short statements about how the network actually operates.
       Add a fourth if you need one — the layout takes any number. */
    principles: [
      {
        title: 'Collabs',
        text:
          'Members team up on posts, edits and shoutouts. Nobody is asked to ' +
          'hand over their account or their followers.'
      },
      {
        title: 'Second opinions',
        text:
          'Members ask each other before something goes out. Somebody in the ' +
          'server has usually already hit whatever you\'re stuck on.'
      },
      {
        title: 'New accounts',
        text:
          'The network keeps growing. New members get introduced to everyone ' +
          'else properly, so nobody\'s joining a room full of strangers.'
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
      'Every account in the network, each one run by a different person.',
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
      'The network runs on a Discord server. That\'s where most of it happens.',
    body: [
      'Most of what happens there is unglamorous. Members plan collabs, ask ' +
      'each other for a second opinion before they post, and pass on things ' +
      'they can\'t take themselves. It\'s the part of the network that never ' +
      'shows up on any of the accounts.'
    ],
    cta: { label: 'Visit the community', href: 'https://discord.gg/w9qV9nzG2Y' }
  },

  /* ------------------------------------------------------------------
     7. JOIN
     `cta.href` — point this at your application form, or leave it as
     'mailto:' + your contact email to take applications over email.
     ------------------------------------------------------------------ */
  join: {
    title: 'Join the network',
    lead:
      'Applications are read by the members already here.',
    who: {
      title: 'Who we are looking for',
      items: [
        'Accounts that post consistently, whatever the follower count',
        'People who give feedback as often as they ask for it',
        'Anyone who actually knows the country they post about',
        'Editors, designers and translators are welcome too'
      ]
    },
    gets: {
      title: 'What members get',
      items: [
        'A spot on this page with your links',
        'Introductions to the accounts closest to yours',
        'Feedback before you post'
      ]
    },
    cta: { label: 'Start an application', href: 'mailto:join@countriesirl.com?subject=CountriesIRL%20application' },
    note: 'Every application gets read.'
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
