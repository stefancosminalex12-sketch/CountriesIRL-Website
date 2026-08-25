# CountriesIRL

The website for CountriesIRL — an independent network of creators working across
borders. Members bring what they know (editing, research, reach, a language, a local
audience) and put it in reach of everyone else.

The site is a single static page: a hero, an explanation of the network, the member
directory, the community section, and how to apply. It is plain HTML, CSS and
JavaScript with no build step, no framework and no dependencies, so it can be dropped
onto GitHub Pages as-is.

---

## What is in here

```
.
├── index.html          The whole site — one page, five sections
├── css/
│   └── style.css       Design tokens and every style on the site
├── js/
│   ├── config.js       ← all editable content lives here
│   └── main.js         Builds the page from config.js; navigation behaviour
├── assets/
│   ├── logo/           Logo and icon files
│   ├── members/        Member profile images
│   └── og-image.png    Link preview image (1200 × 630)
├── CONFIG.md           What every configuration value does
└── README.md
```

`index.html` holds the structure but almost none of the words. The text, the member
list, the links and the logo path all come from `js/config.js`, and `js/main.js` fills
them in. That means content is edited in exactly one place.

---

## Customising the site

**Everything editable is in [`js/config.js`](js/config.js).**
[`CONFIG.md`](CONFIG.md) explains each value in detail.

Open the file in any text editor, change the text between the quote marks, save, and
reload the page in your browser. There is nothing to compile.

| I want to change… | Edit |
| --- | --- |
| The site name | `brand.name` |
| The logo | `brand.logo` — see [below](#changing-the-logo) |
| The headline and buttons on the home section | `hero` |
| The About wording | `about` |
| The member cards | `members.list` — see [below](#adding-a-member) |
| The Community wording and link | `community` |
| Who can join, what members get, the apply button | `join` |
| The contact address | `contact.email` |
| The footer links | `social`, `footer.note` |
| The search-result and link-preview text | `meta`, plus the `<head>` of `index.html` |

---

## Adding a member

Find `members.list` in `js/config.js`, add a comma after the last `}` in the list, and
paste a block like this:

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

Save and reload. The card appears with its country's flag, and the figures under the
hero update on their own — the member list is defined once and read everywhere.

Only `name` and `country` are required.

- **`image`** — optional. Save a square image of at least 200 × 200 pixels in
  `assets/members/` and reference it as `'assets/members/filename.jpg'`. Leave it as
  `''` and the card shows the member's initials instead. If the file is ever missing,
  the card falls back to initials rather than showing a broken image.
- **`links`** — any platform works. The `label` is free text, so `Twitch`, `Spotify`,
  `Substack` and anything else need no code changes. Links open in a new tab.
- **`website`** — optional; appears on the card as a **Website** link.

To remove a member, delete their `{ … }` block and the comma that separates it from the
next one.

Full field reference: [CONFIG.md → Adding a member](CONFIG.md#adding-a-member).

---

## Changing the logo

Put your file in `assets/logo/` and point `brand.logo` at it:

```js
brand: {
  name: 'CountriesIRL',
  logo: 'assets/logo/IRLLOGO-web.png',
  ...
}
```

That one value drives the logo in the header and the footer. An SVG or a square PNG of
at least 128 × 128 pixels works best.

The browser-tab icon and the home-screen icon are loaded before any JavaScript runs, so
they are referenced directly in the `<head>` of `index.html`. If you replace the logo,
replace `assets/logo/favicon.png` and `assets/logo/apple-touch-icon.png` too — details in
[CONFIG.md](CONFIG.md#changing-the-logo).

---

## Running it locally

The quickest way is to open `index.html` in a browser — double-click it, and the site
works.

To match how it behaves once published, serve it over HTTP instead. From the project
folder:

```bash
python -m http.server 4173
```

Then open <http://localhost:4173>. Any static file server does the same job; if you
have Node installed, `npx serve` works as well.

---

## Deploying to GitHub Pages

1. Push the project to a public GitHub repository. The files must sit at the root of
   the repository, not inside a subfolder.
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to *Deploy from a branch*.
4. Choose your default branch (`main`) and the `/ (root)` folder, then **Save**.
5. Wait a minute or two. The site appears at
   `https://<your-username>.github.io/<repository-name>/`.

Then set `brand.url` in `js/config.js` to that address, and update the `<link rel="canonical">`
and `og:` tags in the `<head>` of `index.html` to match. Those tags decide what search
engines record and what appears when someone shares the link.

> If you publish to `https://<username>.github.io/<repo>/` rather than a domain root,
> the site still works — every path in the project is relative.

---

## Notes

- **No dependencies.** No npm, no build step, no CDN requests. What is in the repository
  is what the browser runs.
- **Accessibility.** Semantic landmarks, a skip link, visible focus styles, keyboard
  operable navigation and filters, `prefers-reduced-motion` respected, and text
  contrast at or above WCAG AA.
- **Fonts.** System fonts only — a serif for headings, the platform UI sans for
  everything else. Nothing is fetched from a font host.
- **Browsers.** Current versions of Chrome, Edge, Firefox and Safari.

## Before publishing

The member entries shipped in `js/config.js` are samples with placeholder links.
Replace them with your real creators, and work through the checklist at the end of
[CONFIG.md](CONFIG.md#before-you-publish).

## License

No license file is included. Add one that suits the network before making the
repository public — member descriptions, images and links belong to the members.

## Deploying

Push to `main` and GitHub Pages rebuilds within a minute.

**One rule when you change `css/style.css`, `js/config.js` or `js/main.js`:**
bump the `?v=` number on that file's tag in `index.html` (any new value —
the date and time works). GitHub Pages serves assets with a ten minute
cache, so without it a visitor can load the new `index.html` against an old
stylesheet or config and see a half-broken page: buttons with no label,
columns that do not appear, copy that is one version behind.
