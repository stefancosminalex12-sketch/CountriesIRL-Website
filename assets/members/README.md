# Member images

Profile pictures and channel logos go in this folder.

- Square, at least 200 × 200 pixels
- JPG or PNG for photographs, SVG for logos
- Keep files under about 150 KB — they load on every visit
- Name them after the member: `terrace-nine.jpg`

Reference the file from `js/config.js`:

```js
image: 'assets/members/terrace-nine.jpg',
```

Leave `image: ''` and the card shows the member's initials instead. That is a
deliberate fallback, not a placeholder — a member without a picture still gets a card
that looks finished.
