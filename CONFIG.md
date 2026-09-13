# Configuring the site

Everything on the CountriesIRL website — the logo, the wording, the member list, the
links — comes from one file:

```
js/config.js
```

Open it in any text editor, change the text between the quote marks, save, and reload
the page. You do not need to touch the HTML, the CSS or `js/main.js`.

Two rules keep the file valid:

- Text goes **between single quotes**: `name: 'CountriesIRL'`
- Every entry ends with a **comma**, except the last one in a group

If the page ever loads blank, it is almost always a missing comma or a missing quote.
Open the browser console (<kbd>F12</kbd>) — it will name the line.

---

## Contents

- [Adding a member](#adding-a-member) — the thing you will do most often
- [Changing the logo](#changing-the-logo)
- [Full reference](#full-reference)
- [Before you publish](#before-you-publish)

---

## Adding a member

Find this part of `js/config.js`:

```js
members: {
  title: 'Members',
  lead: '…',
  list: [
    { … },
    { … }        // ← the last member
  ]
}
```

Add a comma after the final `}` in the list, then paste a new block:

```js
      {
        name: 'Channel or creator name',
        country: 'Portugal',
        image: '',
        description: 'One or two sentences about what they make.',
        website: '',
        links: [
          { label: 'YouTube', url: 'https://www.youtube.com/@handle' },
          { label: 'Instagram', url: 'https://www.instagram.com/handle' }
        ]
      }
```

Save, reload, and the card appears. Nothing else needs changing — the member count and
the hero figures update themselves, and the card picks up its country's flag.

### The fields

| Field | Required | Notes |
| --- | --- | --- |
| `name` | yes | Shown as the card heading. |
| `country` | yes | Also chooses the flag on the card and feeds the counts. Spell it the same way each time — `UK` and `United Kingdom` count as two countries. |
| `description` | no | One or two sentences about what the account actually posts. Leave it `''` and the card shows just the flag, name and links — better than a line that restates the flag. |
| `image` | no | Path to a profile image or channel logo. Leave as `''` to use the country's flag. |
| `flag` | no | Path to a flag image, when the country is not one of the 120 in `assets/flags/`. Falls back to initials if there is nothing to show. |
| `website` | no | Added to the card as a **Website** link. |
| `links` | no | Any number of platforms. Each is a `label` and a `url`. |
| `id` | no | Hidden internal identifier, never shown on the page. It is written to the card as `data-member-id`. Use it when two members share a visible name — the country Georgia is `georgia-country`, so a future U.S. state entry could be `georgia-state`. |
| `geo` | no | Where the member sits on the hero globe. Leave it out for a country — it is read from the flag file name, so `ro.png` is Romania. Use `'US-OH'` for a U.S. state, or `{ at: [lon, lat] }` for a place with no modern border, such as a historical capital. |
| `origin` | no | `true` on the account the network started from. The globe lights it slightly warmer. |
| `followers` | no | A real follower count to show on the globe card, such as `followers: 12345`. Leave it out when you don't know it — the card simply leaves that line off, and never shows an estimate. Without it, the card uses the follower tracker's exact Instagram figure (`data/stats.json`) for the member's current handle, when the tracker has one. |

### Notes on the globe

The globe in the hero (`js/globe.js`) reads this same member list, so adding,
removing or renaming a member updates it with everything else. Country and state
outlines come from `data/globe.json`, derived from Natural Earth (public domain).

- **Countries** need nothing extra — the flag file name says which country it is.
- **U.S. states** set `geo: 'US-XX'` and are drawn on top of the United States.
- **Historical entities** set `geo: { at: [lon, lat] }` and appear as a marker at
  their historical capital rather than as a modern border. Members that share a
  place — the Byzantine and Ottoman Empires, both at Constantinople — share a
  marker, and its card lists both.
- **Small countries** too small for the outlines (San Marino, Gibraltar) appear as
  a marker automatically.

### Notes on `links`

The label is free text, so any platform works without touching the code — `YouTube`,
`Twitch`, `Spotify`, `Substack`, `Bandcamp`, whatever the member actually uses. Keep
labels to one word where you can; they render as small capitals on the card.

Links open in a new tab and are marked `rel="noopener noreferrer"` automatically.
A link with an empty `label` or `url` is skipped rather than rendered broken.

### Notes on `image`

- Save the file in `assets/members/`
- Square, at least 200 × 200 pixels
- JPG or PNG for photos, SVG for logos
- Reference it as `'assets/members/filename.jpg'` — no leading slash

If `image` is empty **or the file is missing**, the card falls back to the member's
initials. A broken image path will never break the layout, but it is worth fixing.

### Removing a member

Delete their `{ … }` block, including the comma that separates it from the next one.

---

## Changing the logo

1. Put your file in `assets/logo/`
2. Point `brand.logo` at it:

```js
brand: {
  name: 'CountriesIRL',
  logo: 'assets/logo/IRLLOGO-web.png',
  url: 'https://countriesirl.com/'
}
```

That single value drives the logo in the navigation and in the footer. An SVG or a
square PNG of at least 128 × 128 pixels works best.

Two icon files are referenced directly from `index.html` rather than the config,
because browsers read them before any JavaScript runs. If you replace the logo, replace
these too:

| File | Used for | Referenced in |
| --- | --- | --- |
| `assets/logo/favicon.png` | Browser tab icon | `<link rel="icon">` in `index.html` |
| `assets/logo/apple-touch-icon.png` | Home-screen icon | `<link rel="apple-touch-icon">` in `index.html` |
| `assets/og-image.png` | Link preview when the site is shared (1200 × 630) | `meta.ogImage`, plus `og:image` in `index.html` |

---

## Full reference

### `brand`

| Key | What it does |
| --- | --- |
| `brand.name` | Website name, shown beside the logo in the header and footer. |
| `brand.logo` | Path to the logo file. |
| `brand.url` | The published address, with a trailing slash. Used to build the canonical link and the absolute URLs in the social preview tags. |

### `meta`

| Key | What it does |
| --- | --- |
| `meta.title` | Browser tab and search-result heading. |
| `meta.description` | The summary under the search result, and in link previews. |
| `meta.ogImage` | Image used when the site is shared as a link. |

These are applied to the page when it loads. The same values are also written into
`index.html` as static tags so that crawlers and link-preview bots see them without
running JavaScript — **if you change the wording here, change it in the `<head>` of
`index.html` too.** Two more things are repeated there for the same reason, each with a
comment beside it: the hero headline inside the `<h1>`, and the structured data block,
which lists the network's official profiles from `social` (all but the Discord invite).

### `hero` — the Home section

| Key | What it does |
| --- | --- |
| `hero.eyebrow` | The small line above the headline (currently `EST. 2026`). Set it to `''` to hide it. |
| `hero.title` | The headline. |
| `hero.description` | Paragraph beneath it. |
| `hero.primaryCta` | The filled button — `{ label, href }`. |
| `hero.secondaryCta` | The outlined button — `{ label, href }`. |
| `hero.stats` | The three figures in the band below the hero. Each is `{ value, label }`; `'auto:members'` and `'auto:countries'` are counted from the member list, and any value starting with a number counts up as you scroll onto it. |

An `href` starting with `#` scrolls to that section. A full `https://` address opens in
a new tab. Both button styles accept either.

### `about`

| Key | What it does |
| --- | --- |
| `about.title` | Section heading. |
| `about.lead` | The larger opening line under the heading. |
| `about.body` | A list of paragraphs. Add or remove entries freely. |
| `about.origin.title` | Caption above the origin story. |
| `about.origin.body` | The origin story, as a list of paragraphs. |
| `about.principles` | The rows beneath the text. Each is `{ title, text }`. Any number works. |

### `members`

| Key | What it does |
| --- | --- |
| `members.title` | Section heading. |
| `members.lead` | Line under the heading. |
| `members.list` | The creators. See [Adding a member](#adding-a-member). |

Flags come from `assets/flags/`, one PNG per ISO country code, matched on the member's
`country`. Qualifiers in brackets are ignored, so `United States (Texas)` flies the US
flag. Historical and fictional entries have no flag file and fall back to initials.

### `community`

| Key | What it does |
| --- | --- |
| `community.title` | Section heading. |
| `community.lead` | The larger opening line. |
| `community.body` | A list of paragraphs. |
| `community.ctaPrompt` | The quiet line above the community link. Set it to `''` to hide it. |
| `community.cta` | Where the community link points — `{ label, href }`. |

### `join`

| Key | What it does |
| --- | --- |
| `join.title` | Section heading. |
| `join.lead` | The larger opening line. |
| `join.who.title` / `join.who.items` | Heading and list for who the network is looking for. |
| `join.gets.title` / `join.gets.items` | Heading and list for what members receive. |

Both `items` lists take either a plain string or a `{ title, text }` pair. A pair puts
the title on its own line above the description — which is how both lists read now.
Mixing the two forms in one list is fine.
| `join.cta` | The application button — `{ label, href }`. Use a form URL, or a `mailto:` address to take applications by email. |
| `join.note` | Small line under the button. |

### `contact`, `social`, `footer`

| Key | What it does |
| --- | --- |
| `contact.email` | Shown in the footer and included in the site's structured data. |
| `social` | The "Elsewhere" column in the footer. Each entry is `{ label, url }`. When an official profile is added or changes, update `sameAs` in the structured data in `index.html` as well. |
| `footer.note` | The line under the logo in the footer. |

---

## Before you publish

- [ ] Replace the sample members with your real creators and their real links
- [ ] Set `brand.url` to the address the site will actually live at
- [ ] Point `join.cta.href` at your application form or contact address
- [ ] Point `community.cta.href` at your real community invite
- [ ] Check `contact.email` and every `social` URL is an account you own
- [ ] Update the `<title>` and meta tags in `index.html` if you changed `meta.title` or `meta.description`
- [ ] Replace `assets/og-image.png` if you want a different link preview
- [ ] Open the site and check the browser console is clean
