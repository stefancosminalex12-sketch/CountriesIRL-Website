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
    logo: 'assets/logo/mark.svg',
    // Used for SEO canonical + Open Graph tags. Include the trailing slash.
    url: 'https://countriesirl.github.io/'
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
     ------------------------------------------------------------------ */
  members: {
    title: 'Members',
    lead:
      'Every member is an independent creator running their own channel. ' +
      'They are listed here in the order they joined.',
    list: [
      {
        name: 'Meridian Reels',
        country: 'Romania',
        image: '',
        description:
          'Short documentaries about places that never make the itinerary — ' +
          'border towns, closed factories, roads that stop halfway.',
        website: '',
        links: [
          { label: 'YouTube', url: 'https://www.youtube.com/@meridianreels' },
          { label: 'Instagram', url: 'https://www.instagram.com/meridianreels' }
        ]
      },
      {
        name: 'Terrace Nine',
        country: 'Portugal',
        image: '',
        description:
          'Food and neighbourhood history, filmed one street at a time in ' +
          'Lisbon and the towns along the Tagus.',
        website: '',
        links: [
          { label: 'YouTube', url: 'https://www.youtube.com/@terracenine' },
          { label: 'TikTok', url: 'https://www.tiktok.com/@terracenine' }
        ]
      },
      {
        name: 'Northbound Notes',
        country: 'Norway',
        image: '',
        description:
          'Long-form field recordings and essays on life above the Arctic ' +
          'Circle, published fortnightly.',
        website: '',
        links: [
          { label: 'YouTube', url: 'https://www.youtube.com/@northboundnotes' }
        ]
      },
      {
        name: 'Kite & Compass',
        country: 'Philippines',
        image: '',
        description:
          'Island-hopping travel films with an unusual amount of attention ' +
          'paid to the ferries, the budgets and the paperwork.',
        website: '',
        links: [
          { label: 'YouTube', url: 'https://www.youtube.com/@kiteandcompass' },
          { label: 'Instagram', url: 'https://www.instagram.com/kiteandcompass' }
        ]
      },
      {
        name: 'Studio Aster',
        country: 'Poland',
        image: '',
        description:
          'Animation and motion design. Builds the title sequences and maps ' +
          'that show up in half the videos on this page.',
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/studioaster' },
          { label: 'Behance', url: 'https://www.behance.net/studioaster' }
        ]
      },
      {
        name: 'The Long Way Round',
        country: 'Ireland',
        image: '',
        description:
          'A podcast about why people leave a country and what happens when ' +
          'they go back. Two seasons, no sponsors yet.',
        website: '',
        links: [
          { label: 'Spotify', url: 'https://open.spotify.com/show/thelongwayround' },
          { label: 'YouTube', url: 'https://www.youtube.com/@thelongwayround' }
        ]
      },
      {
        name: 'Baobab Frames',
        country: 'Kenya',
        image: '',
        description:
          'Documentary photography and short video on Nairobi’s music ' +
          'scene, plus a monthly newsletter on the business behind it.',
        website: '',
        links: [
          { label: 'Instagram', url: 'https://www.instagram.com/baobabframes' },
          { label: 'YouTube', url: 'https://www.youtube.com/@baobabframes' }
        ]
      },
      {
        name: 'Quiet Cartography',
        country: 'Canada',
        image: '',
        description:
          'Maps, and the arguments behind them. Explains border disputes and ' +
          'census oddities without turning them into a quiz.',
        website: '',
        links: [
          { label: 'YouTube', url: 'https://www.youtube.com/@quietcartography' },
          { label: 'X', url: 'https://x.com/quietcarto' }
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
