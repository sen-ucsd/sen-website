# SEN Brand Guide

Developer-facing brand reference. This is the **as-built** system — the actual fonts, colors, and components in use across the codebase. For the design *intent* and the original brief, read `design.md`. When the two drift, this file is the source of truth for what's deployed; update both together.

---

## 1. Identity

| Field | Value |
|---|---|
| Full name | **Student Entrepreneurs Network** |
| Abbreviation | **SEN** |
| Motto | *Per Ardua Ad Astra* (use sparingly, never as a tagline) |
| Founding chapter | **San Diego** at UC San Diego |
| A new location | **chapter** (lowercase). Never "branch" or "club." |
| A person | **member** or **builder**. Never "user." |

---

## 2. Logo

| File | Use |
|---|---|
| `public/SEN_Logo_cropped.png` (1024×1024) | Square emblem. Default for icons, OG cards, hero. |
| `public/SEN_Logo.png` (1320×2868) | Full vertical lockup. Use rarely; usually crop to the circle instead. |
| `src/app/favicon.ico` | Browser tab favicon, generated from the cropped emblem at 16/32/48/64/128/256. |
| `src/app/icon.png` (512×512) | Modern browser high-res icon. |
| `src/app/apple-icon.png` (180×180) | iOS home-screen icon. |

**Rules.** Don't stretch, recolor, or place on a busy background. Always crop to the circle for the emblem. Don't add drop shadows; add a soft gold radial halo instead (see `Hero.tsx#LogoEmblem`).

To regenerate the favicon set after a logo update:

```bash
magick public/SEN_Logo_cropped.png -resize 256x256 \
  -define icon:auto-resize=16,32,48,64,128,256 src/app/favicon.ico
magick public/SEN_Logo_cropped.png -resize 512x512 src/app/icon.png
magick public/SEN_Logo_cropped.png -resize 180x180 src/app/apple-icon.png
```

---

## 3. Color

Exact tokens. No purple, no teal, no cyan accents. Avoid pure white (use cream) and pure black (use the background hex).

| Token | Hex | CSS / Tailwind | Use |
|---|---|---|---|
| Background | `#050816` | — | Page background, the deepest layer. |
| Navy | `#0A0E1A` | — | Section panels, the inside of the logo emblem. |
| Navy elevated | `#141B2D` | `bg-navy-elevated` | Cards, modals, raised surfaces. |
| Navy line | `#1E2A45` | `border-navy-line` | Borders, dividers, hairlines. |
| Gold | `#D4A843` | — | Primary accent. CTAs, chapter dots, key headlines. |
| Gold light | `#E8C97A` | — | Hover states, halos around dots. |
| Gold dim | `#A07C2E` | — | Trailing line color, deactivated accent. |
| Cream | `#F0ECE4` | `text-cream` | Body text and most type. |
| Cream 60% | `rgba(240,236,228,0.6)` | `text-cream-60` | Secondary text. |
| Cream 35% | `rgba(240,236,228,0.35)` | `text-cream-35` | Tertiary text and metadata. |

Backgrounds may layer **soft radial light** at low opacity (gold behind heroes, navy under cards). A 3% grain overlay sits across the page (`.grain` in `globals.css`). Avoid simple two-stop linear gradients — they read generic.

---

## 4. Typography

Two Google Fonts, loaded via `next/font/google` in `src/app/layout.tsx`:

| Role | Family | CSS variable | Tailwind | Notes |
|---|---|---|---|---|
| Display / serif | **Newsreader** | `var(--font-newsreader)` | `font-display` | Editorial serif. Hero headlines, wordmarks, large quotes. |
| Body / sans | **Manrope** | `var(--font-manrope)` | (default sans) | Geometric sans. Body, eyebrows, UI labels. |

Weights loaded: 300, 400, 500, 600, 700 for both. Newsreader includes italic.

### Type rules

- **Hero headline** — Newsreader, weight 500, `clamp(48px, 6.5vw, 96px)`, line-height 0.98, letter-spacing −0.02em.
- **Section headline** — Newsreader, weight 500, ~clamp(22–32px), line-height 1.15.
- **Body** — Manrope, weight 400, 16–18px, line-height 1.65.
- **Eyebrow** — Manrope, weight 500, 11px, uppercase, letter-spacing 0.25em, in `Cream 60%` or `Gold dim`. Use the `.text-eyebrow` utility.
- **Tabular data** — Manrope with `font-variant-numeric: tabular-nums`.

Avoid italic body text. Avoid all-caps body text. Use small caps only for eyebrows.

**Banned families** (per `design.md`): Inter, Roboto, Arial, Helvetica, Poppins, Montserrat, Space Grotesk. They read generic.

### Using the brand fonts inside `next/og` ImageResponse

`next/og` runs satori, which needs TTF data. Don't rely on system fallbacks — fetch the brand fonts at request time using the helper pattern in `src/app/opengraph-image.tsx`:

```ts
async function loadGoogleFont(family: string, weight: number, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await fetch(url).then((r) => r.text());
  const match = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/);
  if (!match) throw new Error("font url not found");
  return fetch(match[1]).then((r) => r.arrayBuffer());
}
```

Pass the `text=` of the actual glyphs you'll render so Google subsets to a small TTF.

---

## 5. Voice

Direct, calm, slightly literary. Sounds like prose, not bullet points. Hard rules from `design.md`:

1. **No em-dashes.** Restructure or use a period or comma.
2. **No "not X, but Y"** sentence shape. No "this isn't a club, it's a network."
3. **No staccato.** Avoid sequences of three short sentences in a row.
4. **No exclamation marks.**
5. **No "we / our / us"** in headlines. Headlines describe a state of the world, not narrate ourselves.
6. **No corporate hedging** ("we strive to," "we aim to," "our mission is to").
7. **No filler words** — *actually*, *really*, *very*, *just*.
8. **No hashtags or emojis.**
9. **Digits for real data** (1 chapter, 12 cities); spelled out for vague claims (one quiet truth).

CTAs are verbs: *Start a Chapter*, *See the Network*, *Apply Now*. Not nouns.

---

## 6. Motion

Animation is part of the brand. Every still frame should imply motion.

- **Page load** — soft fade-up reveal staggered across hero elements (~0.4s each, eased).
- **Hero map** — the set piece. SD pulse → US ignite → world tour. Slow continuous eastward pan once landed; never reset visibly (see `HeroMap.tsx`).
- **Section reveals on scroll** — text fades up 12px, opacity 0→1, 0.6s ease-out cubic.
- **Buttons** — scale to 1.02 on hover; gold glow at ~20% opacity expanding outward.
- **Cards** — lift 2px on hover, gold border brightens, soft inner glow.
- **Grain overlay** — 3% opacity, slow drift, organic warmth on the dark canvas.

Easing curve we keep reusing: `cubic-bezier(0.16, 1, 0.3, 1)` (a soft ease-out).

Avoid bouncy springs, parallax that moves the wrong direction, and scroll-jacking.

---

## 7. Iconography & Imagery

- **Icons** — line-art, gold, ~1.25px stroke, 28px size. Match the rocket emblem's energy.
- **Photographs** — warm, slightly desaturated, dark backgrounds. Founder portraits in tight square crops.
- **Maps** — minimal outlines only. Never literal Google Maps tiles. The world map in the hero is a hand-stylized SVG (`src/data/world-svg.ts`).
- **Network visuals** — gold dots over navy, hairline gold connecting lines, halos that pulse.

---

## 8. Where things live in the repo

| Concern | Location |
|---|---|
| Font loading | `src/app/layout.tsx` |
| Tailwind config | `postcss.config.mjs` + `src/app/globals.css` |
| Color tokens | `src/app/globals.css` |
| Logo source | `public/SEN_Logo_cropped.png`, `public/SEN_Logo.png` |
| Favicon set | `src/app/favicon.ico`, `src/app/icon.png`, `src/app/apple-icon.png` |
| Social share card | `src/app/opengraph-image.tsx`, `src/app/twitter-image.tsx` |
| Page metadata (OG / Twitter / metadataBase) | `src/app/layout.tsx` |
| Hero / map / network components | `src/components/Hero.tsx`, `HeroMap.tsx`, `MapExplorer.tsx` |
| Chapter data | `src/data/chapters.ts` |
| Admin portal (private) | `src/components/admin/*` |

---

## 9. Quick "is it on-brand?" checklist

Before merging UI work, ask:

- [ ] Background is `#050816`, not pure black.
- [ ] Text is cream, not pure white.
- [ ] Display type is Newsreader; sans is Manrope. No fallback fonts in production code.
- [ ] Gold accent is `#D4A843` / `#E8C97A` / `#A07C2E`. No off-brand yellow.
- [ ] No em-dashes in copy. No "we / our / us" in headlines. No exclamation marks.
- [ ] Motion uses the soft ease-out curve. No bouncy springs.
- [ ] Cards have a hairline navy-line border, not a thick fill.
- [ ] Logo on a colored background uses the navy/gold emblem cropped to the circle.
