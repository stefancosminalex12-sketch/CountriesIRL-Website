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

Save, reload, and the card appears. Nothing else needs changing — the country filter,
the country index in the hero and the member count all update themselves.

### The fields

| Field | Required | Notes |
| --- | --- | --- |
| `name` | yes | Shown as the card heading. |
| `country` | yes | Also feeds the country filter and the hero index. Spell it the same way each time — `UK` and `United Kingdom` count as two countries. |
| `description` | yes | One or two sentences. Around 120–180 characters keeps the cards even. |
| `image` | no | Path to a profile image or channel logo. Leave as `''` to use initials. |
| `website` | no | Added to the card as a **Website** link. |
| `links` | no | Any number of platforms. Each is a `label` and a `url`. |

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
  logo: 'assets/logo/mark.svg',
  url: 'https://countriesirl.github.io/'
}
```

That single value drives the logo in the navigation and in the footer. An SVG or a
square PNG of at least 128 × 128 pixels works best.

Two icon files are referenced directly from `index.html` rather than the config,
because browsers read them before any JavaScript runs. If you replace the logo, replace
these too:

| File | Used for | Referenced in |
| --- | --- | --- |
| `assets/logo/mark.svg` | Browser tab icon | `<link rel="icon">` in `index.html` |
| `assets/logo/apple-touch-icon.png` | Home-screen icon (180 × 180) | `<link rel="apple-touch-icon">` in `index.html` |
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
`index.html` too.** It is the only place the site repeats itself, and there is a comment
above the tags saying so.

### `hero` — the Home section

| Key | What it does |
| --- | --- |
| `hero.eyebrow` | Small line above the headline. |
| `hero.title` | The headline. |
| `hero.description` | Paragraph beneath it. |
| `hero.primaryCta` | The filled button — `{ label, href }`. |
| `hero.secondaryCta` | The outlined button — `{ label, href }`. |

An `href` starting with `#` scrolls to that section. A full `https://` address opens in
a new tab. Both button styles accept either.

### `about`

| Key | What it does |
| --- | --- |
| `about.title` | Section heading. |
| `about.lead` | The larger opening line on the left. |
| `about.body` | A list of paragraphs. Add or remove entries freely. |
| `about.principles` | The rows beneath the text. Each is `{ title, text }`. Any number works. |

### `members`

| Key | What it does |
| --- | --- |
| `members.title` | Section heading. |
| `members.lead` | Line under the heading. |
| `members.list` | The creators. See [Adding a member](#adding-a-member). |

The country filter appears automatically once members come from three or more
countries. Below that it would be pointless, so it stays hidden.

### `community`

| Key | What it does |
| --- | --- |
| `community.title` | Section heading. |
| `community.lead` | The larger opening line. |
| `community.body` | A list of paragraphs. |
| `community.highlights` | The numbered list on the right. |
| `community.cta` | Where the community link points — `{ label, href }`. |

### `join`

| Key | What it does |
| --- | --- |
| `join.title` | Section heading. |
| `join.lead` | The larger opening line. |
| `join.who.title` / `join.who.items` | Heading and list for who the network is looking for. |
| `join.gets.title` / `join.gets.items` | Heading and list for what members receive. |
| `join.cta` | The application button — `{ label, href }`. Use a form URL, or a `mailto:` address to take applications by email. |
| `join.note` | Small line under the button. |

### `contact`, `social`, `footer`

| Key | What it does |
| --- | --- |
| `contact.email` | Shown in the footer and included in the site's structured data. |
| `social` | The "Elsewhere" column in the footer. Each entry is `{ label, url }`. |
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
