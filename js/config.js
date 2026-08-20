/* ==========================================================================
   CountriesIRL — site configuration
   --------------------------------------------------------------------------
   This is the only file you need to edit to change the website's content.
   Everything below is plain JavaScript: text in quotes, lists in [ brackets ],
   groups in { braces }. Keep the commas where they are and you cannot go wrong.

   Open config.html in a browser for a visual reference of every value here,
   plus a form that writes new member entries for you.

   NOTE: the members further down are sample entries. Replace them with your
   real creators (and their real links) before publishing the site.
   ========================================================================== */

window.SITE_CONFIG = {

  /* ------------------------------------------------------------------
     1. BRAND
     The logo is a file path, relative to the site root. Drop a new file
     into assets/logo/ and point `logo` at it — nothing else to change.
     ------------------------------------------------------------------ */
  brand: {
    name: 'CountriesIRL',
    logo: 'assets/logo/IRLLOGO.png',
    // Used for SEO canonical + Open Graph tags. Include the trailing slash.
    url: 'https://countriesirl.com/'
  },

  /* ------------------------------------------------------------------
     2. SEO / SOCIAL PREVIEW
     ------------------------------------------------------------------ */
  meta: {
    title: 'CountriesIRL — a creator network across borders',
    description:
      'CountriesIRL is an independent creator network. Creators from different ' +
      'countries share what they know, collaborate on work, and grow together.',
    ogImage: 'assets/og-image.png'
  },

  /* ------------------------------------------------------------------
     3. HOME / HERO
     ------------------------------------------------------------------ */
  hero: {
    eyebrow: 'Independent creator network',
    title: 'Creators from different countries, working in the same room.',
    description:
      'CountriesIRL exists for creators who want collaborators instead of ' +
      'competitors — people to build with, ask for a second opinion, and share ' +
      'an audience with. One network, many borders.',
    primaryCta: { label: 'Apply to join', href: '#join' },
    secondaryCta: { label: 'What the network is', href: '#about' }
  },

  /* ------------------------------------------------------------------
     4. ABOUT
     `body` is a list of paragraphs — add or remove lines freely.
     ------------------------------------------------------------------ */
  about: {
    title: 'What CountriesIRL is',
    lead:
      'A network, not a platform. There is no algorithm here — just creators ' +
      'who decided that working alone was the slow way round.',
    body: [
      'CountriesIRL started with a handful of creators who kept hitting the ' +
      'same wall: work they were proud of, an audience that grew a few people ' +
      'at a time, and nobody to compare notes with. The network is the answer ' +
      'to that. Members bring what they know — editing, research, reach, a ' +
      'language, a local audience — and put it in reach of everyone else.',
      'Members are spread across time zones and make very different things. ' +
      'That is deliberate. A creator in Manila and a creator in Lisbon are not ' +
      'fighting over the same viewers, which makes it far easier to be ' +
      'genuinely useful to each other.'
    ],
    /* Three short statements about how the network actually operates.
       Add a fourth if you need one — the layout takes any number. */
    principles: [
      {
        title: 'Collaboration over competition',
        text:
          'Members are matched for joint videos, guest appearances, translation ' +
          'help and cross-promotion. Nobody is asked to hand over their audience.'
      },
      {
        title: 'Growth you can point at',
        text:
          'Feedback rounds on work before it ships, shared analytics benchmarks, ' +
          'and members who have already solved the problem you are stuck on.'
      },
      {
        title: 'A community with a door',
        text:
          'Small enough that people know each other, open enough that new ' +
          'members are introduced properly rather than dropped into a channel.'
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
     >>>     image:       'assets/members/file.jpg',   // optional — leave '' for initials
     >>>     description: 'One or two sentences.',     // required
     >>>     website:     'https://example.com',       // optional
     >>>     links: [                                  // optional, any platform
     >>>       { label: 'YouTube',   url: 'https://…' },
     >>>       { label: 'Instagram', url: 'https://…' }
     >>>     ]
     >>>   }
     >>>
     >>> Profile images: square, at least 200×200px, saved in assets/members/.
     >>> If `image` is empty or the file is missing, the card falls back to the
     >>> member's initials — so a missing photo never breaks the layout.

     NOTE: Descriptions below are generic placeholders based on each account's
     flag/name, since no real bios were available — swap in proper copy for
     each member when you have it. Two entries are flagged TODO where the
     screenshot cut off the name/handle before it could be confirmed.
     ------------------------------------------------------------------ */
 
     members: {
    title: 'Members',
    lead:
      'The accounts that make up the .irl network, founded and run from Romania. ' +
      'Members are listed here roughly in order of country importance.',
    list: [
      {
        // TODO: add the real Instagram handle — 'romania.irl' below is a guessed placeholder
        name: 'Romania',
        country: 'Romania',
        image: '',
        description:
          "Founder's account and the home of the .irl network — flying Romania's blue, yellow and red tricolour.",
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/romania.irl' }
        ]
      },
      {
        name: 'chinairl',
        country: 'China',
        image: '',
        description:
          "China's entry in the .irl network, flying the red field with gold stars.",
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/chinairlmain' }
        ]
      },
      {
        name: 'United Kingdom',
        country: 'United Kingdom',
        image: '',
        description:
          'Represented by the Union Flag — one of the accounts in the .irl network.',
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/unitedkingdomirl1' }
        ]
      },
      {
        name: 'canadairl',
        country: 'Canada',
        image: '',
        description:
          "Canada's presence in the .irl network, flying the red maple leaf.",
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/canadairlmain' }
        ]
      },
      {
        name: 'Switzerland',
        country: 'Switzerland',
        image: '',
        description:
          "Switzerland's entry in the .irl network, flying the white cross on red.",
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/switzerland.irl' }
        ]
      },
      {
        name: 'Belgium',
        country: 'Belgium',
        image: '',
        description:
          "A verified presence in the .irl network, carrying Belgium's black, yellow and red tricolour.",
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/belgiumirl' }
        ]
      },
      {
        name: 'poland',
        country: 'Poland',
        image: '',
        description:
          "Poland's official presence in the .irl network — the account's admin.",
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/poland.irl' }
        ]
      },
      {
        name: 'Pakistan',
        country: 'Pakistan',
        image: '',
        description:
          "Pakistan's presence in the .irl network, flying the green field with the white crescent and star.",
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/pakistaniirl' }
        ]
      },
      {
        name: 'Afghanistan',
        country: 'Afghanistan',
        image: '',
        description:
          "Afghanistan's presence in the .irl network, flying the black, red and green tricolour.",
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/afghanistan.irl' }
        ]
      },
      {
        name: 'IRAQ',
        country: 'Iraq',
        image: '',
        description:
          "Iraq's entry in the .irl network, flying the red, white and black tricolour.",
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/iraqirl_' }
        ]
      },
      {
        name: 'SYRIAIRL',
        country: 'Syria',
        image: '',
        description:
          "Syria's presence in the .irl network, flying the green, white and black tricolour with red stars.",
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/syriairlmain' }
        ]
      },
      {
        name: 'Portugal irl',
        country: 'Portugal',
        image: '',
        description:
          "Portugal's account in the .irl network, marked by the green-and-red flag and national shield.",
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/portugalirlmain' }
        ]
      },
      {
        name: 'Hungary',
        country: 'Hungary',
        image: '',
        description:
          "Hungary's presence in the .irl network, flying the red, white and green tricolour.",
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/hungary.irl_' }
        ]
      },
      {
        name: 'Bangladesh',
        country: 'Bangladesh',
        image: '',
        description:
          "Bangladesh's account in the .irl network, flying the green field and red disc.",
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/bangladesh.irl_' }
        ]
      },
      {
        name: 'Turkmenistan',
        country: 'Turkmenistan',
        image: '',
        description:
          "Turkmenistan's presence in the .irl network, flying the green field with the ornate carpet-pattern stripe.",
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/turkmenistanirl' }
        ]
      },
      {
        name: 'Kyrgyzstan.irl',
        country: 'Kyrgyzstan',
        image: '',
        description:
          "Kyrgyzstan's presence in the .irl network, flying the red field with the golden sun and tunduk.",
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/kyrgyzstan.irl' }
        ]
      },
      {
        name: 'Bahrain',
        country: 'Bahrain',
        image: '',
        description:
          "Bahrain's presence in the .irl network, flying the country's red-and-white serrated flag.",
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/bahrain.irl' }
        ]
      },
      {
        name: 'Lebanon',
        country: 'Lebanon',
        image: '',
        description:
          "Lebanon's account in the .irl network, marked by the green cedar on red and white.",
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/lebanonirlmain' }
        ]
      },
      {
        name: 'georgia',
        country: 'Georgia',
        image: '',
        description:
          "Georgia's account in the .irl network, marked by the five-cross white-and-red flag.",
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/sakartveloirl' }
        ]
      },
      {
        name: 'Moldova',
        country: 'Moldova',
        image: '',
        description:
          "Moldova's presence in the .irl network, flying the blue, yellow and red tricolour with the national emblem.",
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/moldovaairl' }
        ]
      },
      {
        name: 'Slovakia',
        country: 'Slovakia',
        image: '',
        description:
          "Slovakia's presence in the .irl network, flying the white, blue and red tricolour with the national shield.",
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/slovakiairl' }
        ]
      },
      {
        name: 'bosniaherzegovinairl',
        country: 'Bosnia and Herzegovina',
        image: '',
        description:
          "Bosnia and Herzegovina's entry in the .irl network, flying the blue field with the golden triangle and stars.",
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/bosniaherzegovinairl' }
        ]
      },
      {
        name: 'croatiairl',
        country: 'Croatia',
        image: '',
        description:
          "Croatia's account in the .irl network, marked by the familiar red-and-white checkerboard shield.",
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/croatiairlmain' }
        ]
      },
      {
        name: 'Roman Empire.irl',
        country: 'Roman Empire (historical)',
        image: '',
        description:
          "A historical entry in the .irl network, carrying the SPQR laurel wreath of Rome.",
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/roman.empire.irl' }
        ]
      },
      {
        name: 'byzantineempire.irl',
        country: 'Byzantine Empire (historical)',
        image: '',
        description:
          "A historical entry in the .irl network, carrying the empire's gold cross on red.",
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/byzantineempire.irl' }
        ]
      },
      {
        // TODO: name was truncated in the screenshot ("Make Yugoslav...") — confirm full text
        name: 'Make Yugoslavia... (name truncated, please confirm)',
        country: 'Yugoslavia (historical)',
        image: '',
        description:
          "A historical entry in the .irl network, carrying the blue, white and red tricolour and red star of the former Yugoslavia.",
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/yugosiavia' }
        ]
      },
      {
        name: 'kingdomofpolandirl',
        country: 'Poland (historical — Kingdom of Poland)',
        image: '',
        description:
          "A historical entry in the .irl network, carrying the white eagle on red of the old Kingdom of Poland.",
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/kingdomofpolandirl' }
        ]
      },
      {
        // TODO: name shown as "United States of K..." — inferred as Kurdistan from the
        // flag colours (red/white/green with gold sun), please confirm.
        name: 'United States of Kurdistan (name truncated, please confirm)',
        country: 'Kurdistan (aspirational/fictional)',
        image: '',
        description:
          "Kurdistan's presence in the .irl network, flying the red, white and green tricolour with the golden sun.",
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/kurdistanirl' }
        ]
      },
      {
        // TODO: both name and handle were cut off in the screenshot ("the.republic.of...").
        // Flag looked like the Serbian tricolour with the double-headed eagle crest —
        // please confirm the account before publishing, the URL below is a guess.
        name: 'the.republic.of... (name & handle truncated, please confirm)',
        country: 'Unconfirmed — flag resembles Serbia',
        image: '',
        description:
          'Screenshot cut off before the full name and handle — confirm before publishing.',
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/the.republic.of' }
        ]
      },
      {
        name: 'Antarctica',
        country: 'Antarctica',
        image: '',
        description:
          "Antarctica's seat in the .irl network — 'The Last Continent,' emblem and all.",
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/antarcticairlmain' }
        ]
      },
      {
        name: 'Texas',
        country: 'United States (Texas)',
        image: '',
        description:
          "A US state entry in the .irl network, represented by the Texas Lone Star flag.",
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/texas.irl_' }
        ]
      },
      {
        name: 'ohio_irl',
        country: 'United States (Ohio)',
        image: '',
        description:
          "A US state entry in the .irl network, represented by Ohio's distinctive burgee flag.",
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/ohio_irl' }
        ]
      },
      {
        name: 'Alabama',
        country: 'United States (Alabama)',
        image: '',
        description:
          "A US state entry in the .irl network, represented by Alabama's red St Andrew's cross.",
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/alabama.irl' }
        ]
      },
      {
        name: 'Nebraska',
        country: 'United States (Nebraska)',
        image: '',
        description:
          "A US state entry in the .irl network, represented by Nebraska's blue state seal.",
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/nebraskairl' }
        ]
      },
      {
        name: 'North Pole',
        country: 'North Pole (fictional)',
        image: '',
        description:
          "A fictional entry in the .irl network, flying the North Pole, Alaska badge.",
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
      'The network runs on a private server where the actual work of being a ' +
      'network happens.',
    body: [
      'Most of what CountriesIRL does is unglamorous and useful: someone posts ' +
      'a rough cut and gets six honest replies, a member in another country ' +
      'records a voice-over overnight, two channels realise their next videos ' +
      'overlap and decide to make one instead.',
      'There are weekly feedback threads, a channel for briefs and paid work ' +
      'that members pass on to each other, and a monthly call where whoever ' +
      'shows up talks through what worked and what did not.'
    ],
    highlights: [
      'Weekly feedback rounds on work in progress',
      'Collaboration matching across countries and formats',
      'Briefs, rates and opportunities shared between members',
      'A monthly call, recorded for anyone in the wrong time zone'
    ],
    cta: { label: 'Visit the community', href: 'https://discord.gg/countriesirl' }
  },

  /* ------------------------------------------------------------------
     7. JOIN
     `cta.href` — point this at your application form, or leave it as
     'mailto:' + your contact email to take applications over email.
     ------------------------------------------------------------------ */
  join: {
    title: 'Join the network',
    lead:
      'Applications are read by existing members. We keep the network small ' +
      'enough that everyone can actually know everyone.',
    who: {
      title: 'Who we are looking for',
      items: [
        'Creators publishing consistently — the format and the size of the audience matter less than the habit',
        'People who will give feedback as often as they ask for it',
        'Anyone whose work is rooted in a place, a language or a culture they know well',
        'Editors, illustrators, translators and producers, not only on-camera creators'
      ]
    },
    gets: {
      title: 'What members get',
      items: [
        'A listing on this page with your links',
        'Introductions to members who make work adjacent to yours',
        'Feedback on drafts before they go out',
        'First sight of paid briefs and partnerships that come to the network',
        'A say in who joins next'
      ]
    },
    cta: { label: 'Start an application', href: 'mailto:join@countriesirl.com?subject=CountriesIRL%20application' },
    note: 'Applications are reviewed in batches. Expect a reply within two weeks.'
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
    { label: 'Discord', url: 'https://discord.gg/countriesirl' }
  ],

  /* ------------------------------------------------------------------
     9. FOOTER
     ------------------------------------------------------------------ */
  footer: {
    note: 'An independent network. Every member owns their own work.'
  }
};
