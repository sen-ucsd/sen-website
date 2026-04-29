# SEN Website Design Brief

This is the design and content reference for the website of the **Student Entrepreneurs Network (SEN)**. Read this in full before generating any screen. Treat it as the source of truth for brand, voice, structure, motion, and copy. The attached logo (a circular emblem with a rocket and "PER ARDUA AD ASTRA") is the only visual asset provided. Everything else is yours to design.

The audience is ambitious college students worldwide. The goal of the site is to communicate that SEN is becoming the premier global network for student entrepreneurs, and to make those students want to start a chapter at their school today.

---

## 1. The Vision (this is the whole story)

The Student Entrepreneurs Network is going international. The San Diego chapter at UC San Diego is the founding chapter and the proof that the model works. From there it expands across U.S. universities, then worldwide. Every chapter is a node in a single network of student builders who help each other ship.

This vision is the centerpiece of the site, not a footnote. The hero experience must communicate it through motion before any words explain it.

The hero animation is the most important moment on the entire website. It must do this:

1. The viewer lands on a dark canvas. A single point of warm gold light pulses gently in the location of San Diego on a barely visible map outline.
2. A label near the dot reads `San Diego · Founding Chapter`.
3. After a beat, the camera pulls back. The single dot becomes one of several across the United States, each lighting up in sequence. Faint connecting lines draw between them as they appear, building a constellation of chapters.
4. The camera pulls back further. The view becomes the whole globe. New dots ignite across continents, with the U.S. cluster glowing brightest. The connecting lines weave a worldwide network.
5. The animation settles into a slow ambient state where dots continue to pulse softly and a few new lines occasionally draw, keeping the page alive without distracting from the headline.

Geolocation is approximate. Place dots near recognizable college cities (Boston, NYC, Austin, Seattle, Atlanta, Ann Arbor for the U.S.; London, Berlin, Paris, Tokyo, Singapore, Sydney, Bangalore, Toronto, Mexico City, São Paulo for the world). The point is the spread, not cartographic accuracy. The map outline should be elegant and minimal, never a literal Google Maps render.

If the full sequence is not technically feasible in a single static frame, design the **end state** of the animation (the populated globe with all chapter nodes glowing) and design the **starting state** (the lone San Diego dot) as separate frames. Indicate that the live site will animate between them.

Be creative with this sequence. The brief above is the intent; you have full creative freedom on execution. Surprise us.

---

## 2. Brand Identity

### 2.1 Personality

- Ambitious without being loud
- Calm, confident, deliberate
- Built by serious people, not hype people
- Premium and intentional, never corporate
- A little mysterious, a little romantic about the work

### 2.2 Logo Use

The provided logo is circular: navy interior, gold ring, white rocket, stars, "STUDENT ENTREPRENEURS NETWORK" wrapping the top, "PER ARDUA AD ASTRA" wrapping the bottom. Use it in the navigation bar at small size and in the footer. Do not stretch or recolor it. Crop to the circle (the source file has vertical padding around it).

The motto "Per Ardua Ad Astra" translates as "Through hardship to the stars." Use it sparingly as a typographic accent, not a tagline.

### 2.3 Naming Conventions

- The organization: **Student Entrepreneurs Network**, abbreviated **SEN**
- The founding chapter: **San Diego Chapter** (at UC San Diego). Do not use "UCSD chapter" as the primary phrasing.
- A new location: **chapter** (lowercase). Never "branch" or "club."
- A member: **member** or **builder**. Never "user."

---

## 3. Color System

These colors are non-negotiable. Use them exactly. No purple, no teal accents, no gradient violet.

| Token | Hex | Use |
|---|---|---|
| Background | `#050816` | Page background. The deepest layer. |
| Navy | `#0A0E1A` | Section panels, the inside of the logo emblem |
| Navy elevated | `#141B2D` | Cards, modals, slightly raised surfaces |
| Navy line | `#1E2A45` | Borders, dividers, subtle outlines |
| Gold | `#D4A843` | Primary accent. Chapter dots, key headlines, CTAs |
| Gold light | `#E8C97A` | Hover states, glow halos around dots |
| Gold dim | `#A07C2E` | Trailing line color, deactivated accent |
| Cream | `#F0ECE4` | Body text and most type. Off-white with warmth. |
| Cream 60% | `rgba(240,236,228,0.6)` | Secondary text |
| Cream 35% | `rgba(240,236,228,0.35)` | Tertiary text and metadata |

Avoid pure white (`#FFFFFF`) anywhere. Always use cream. Avoid pure black; the deepest tone is `#050816`.

Backgrounds may use **layered radial light** (soft gold glow at low opacity behind the hero, soft navy halos under cards) and a **subtle grain or noise overlay** at around 3% opacity on the entire page. Do not use simple linear gradients between two colors. They look generic.

---

## 4. Typography

Pair a distinctive geometric or editorial display face with a clean, contemporary body face. Suggested pairings, in order of preference:

1. **Display:** Editorial New, ITC Garamond, or Migra. **Body:** General Sans or Switzer.
2. **Display:** Söhne Breit or Tobias. **Body:** Söhne or Inter Tight.
3. **Display:** Cabinet Grotesk. **Body:** Satoshi.

Do not use Inter, Roboto, Arial, Helvetica, Poppins, Montserrat, or Space Grotesk. They are over-used and signal generic AI design.

Type rules:

- Hero headline: display face, weight 500–600, size scaled large (clamp from roughly 56px to 120px), line-height 0.95, letter-spacing slightly negative.
- Body: 16–18px, line-height 1.65, regular weight.
- Eyebrow labels: 11px, uppercase, letter-spacing 0.25em, weight 500, in cream 60% or gold dim.
- Numbers and small data labels: tabular figures.

Avoid italic body text. Avoid all-caps body text. Use SMALL CAPS only for the eyebrows.

---

## 5. Site Structure

The site is a single long page with a fixed top navigation. Sections, in order:

### 5.1 Navigation (fixed, transparent until scroll)

- Left: SEN logo at 28–32px, then the wordmark **SEN** in display face.
- Center or right: nav links — **Vision**, **Network**, **Programs**, **Start a Chapter**, **Apply**.
- Right: a small chapter selector showing the current chapter (default: San Diego). On click, it opens a dropdown listing chapters as they come online, with "Coming soon" cities greyed out.

When the user scrolls past the hero, the nav gains a thin frosted-glass background and a hairline gold-dim divider underneath.

### 5.2 Hero — The Network Animation

Full viewport. The animation described in section 1 plays here. Layered on top of the animation, anchored in the lower-left or center-left third:

- Eyebrow: `Student Entrepreneurs Network`
- Headline (display face, 3 short lines, no period at the end):
  ```
  A global network
  of student builders.
  Born in San Diego.
  ```
- Subhead (body, max 26 words): A network for college students who want to actually build things. The San Diego chapter started it. New chapters are joining every quarter.
- Primary CTA: **Start a Chapter** (gold solid button with navy text, pill-shaped)
- Secondary link: **See the Network →** (cream 60%, underline on hover)

A small live-feeling stat strip sits at the bottom of the hero, full width, separated by hairline rules:

```
1 founding chapter   ·   12 cities applying   ·   4 continents in motion
```

### 5.3 Vision — Why SEN exists

A two-column layout with generous whitespace. Left column: a large quote-feeling block of body type. Right column: three short proof points with a tiny gold dot before each, representing three pillars: **Build**, **Network**, **Ship**. Each has 2 sentences max.

Headline above: `Every great company starts in a dorm room. We make sure those rooms are connected.`

Below the columns, place an oversized faint motto in the display face, very large but at 8% opacity: `PER ARDUA AD ASTRA`. It acts as a watermark behind the section.

### 5.4 The Network — Chapters Live and Coming

This is the second hero of the site. A wide horizontal strip showing chapter cards in a horizontally scrollable row (or a 2x4 grid on desktop). Each card:

- Top: a tiny world-fragment showing the chapter's continent with a single gold dot
- City and university (e.g., **San Diego** / *UC San Diego*)
- Status: `Founding Chapter`, `Active`, `Launching Q3`, or `Applications open`
- Founder name and a one-line quote from them, italicized, at low opacity

The first card is San Diego at UC San Diego, founder line from Mina or the current president. The other cards are placeholder cities the user mentioned (Boston, NYC, Austin, etc.) with `Launching` or `Applications open`. Use realistic but obviously placeholder names.

### 5.5 Programs — What every chapter runs

Four blocks, asymmetric layout (two large, two small, mixing portrait and landscape proportions). Each block describes one thing every chapter offers:

- **Build Nights** — Weekly working sessions where members ship side projects together
- **Founder Conversations** — Operators and investors who answer real questions, no pitch decks
- **The Inter-Chapter Exchange** — Members travel between chapters to work alongside other chapters for a week
- **Capital Connections** — Warm intros to the angels, funds, and accelerators in each chapter's region

Each block has an icon (line-art, gold, 28px stroke 1.25), a short title, and 2 lines of body. No bullet lists.

### 5.6 Start a Chapter — The biggest CTA on the site

A near-full-bleed section. Centered. The display face headline reads:
`Bring SEN to your campus.`

Subhead: We are looking for the kind of student who would have started this themselves if no one else did. If that sounds like you, the application is short.

A three-step visual: **Apply → Interview → Charter**. Each step is a small numbered card with one sentence. Below, a single primary CTA: **Start the Application**. Below that, a tiny line: `Reviewed weekly. Reply within seven days.`

### 5.7 Founders — Who's in the network

A simple wall: founder portraits in a tight grid (think 6 across on desktop, square crops, hover reveals their name and city). Above the grid, an eyebrow that reads `The People Behind the Network`. No headline.

Use placeholder portraits. Make the grid feel populated but not crowded — about 12 people.

### 5.8 Footer

Tall footer. Three columns plus a bottom bar.

- Column 1: Logo emblem, the wordmark SEN, and the motto `Per Ardua Ad Astra`. A two-line address-style block: `Founding Chapter` / `San Diego, California`.
- Column 2: Site links — Vision, Network, Programs, Start a Chapter, Apply, Press.
- Column 3: A short newsletter form. One field, one button. Label: `Updates from the network.` Placeholder: `your email`. Button: `Subscribe`.
- Bottom bar: small print on the left (`© 2026 Student Entrepreneurs Network. A global network, built one chapter at a time.`), and on the right, a row of social icons (Instagram, LinkedIn, X). All icons in cream 35%, hovering to gold.

---

## 6. Motion and Interaction

Animation is part of the brand. Design the still frames to imply motion.

- Page load: a soft fade-up reveal staggered across hero elements (0.4s each, eased)
- The hero map animation is the main set piece (described in section 1)
- Section reveals on scroll: text fades up 12px, opacity 0 to 1, over 0.6s with an ease-out cubic
- Buttons: slight scale-up on hover (1.02), with a subtle gold glow at 20% opacity expanding outward
- Chapter cards: on hover, the gold dot on the small map fragment pulses
- Cursor near a chapter dot in the hero animation: the dot brightens and a thin gold line traces from it to the next nearest chapter
- The whole page has a faint, slow-moving grain texture overlay at 3% opacity to add organic warmth to the dark canvas

Avoid bouncy spring animations, parallax that moves in the wrong direction, or aggressive scroll-jacking. Motion should feel like it serves the content, not perform for the camera.

---

## 7. Copy Voice and Hard Rules

The voice is direct, calm, slightly literary. Sentences vary in length naturally and sound like they were written by a person who reads books.

**Hard rules. Do not break these.**

1. **No em-dashes anywhere.** If you would reach for one, restructure the sentence or use a period or comma.
2. **No "not X, but Y" sentence structure.** No "we don't do X. we do Y." No "this isn't a club. it's a network." Find a different way to say it.
3. **No staccato sentence structure.** Avoid sequences of three or four very short sentences in a row. Avoid the rhythm of "Real builders. Real conversations. Zero fluff." Vary your sentence lengths so paragraphs read like prose.
4. **No exclamation marks.**
5. **No "we," "our," or "us" in headlines.** Headlines should describe a state of the world, not narrate ourselves.
6. **No corporate hedging.** Never say "we strive to," "we aim to," "our mission is to."
7. **No filler words.** Cut "actually," "really," "very," "just," and most adverbs.
8. **No hashtags or emojis.**
9. **Numbers in copy are written as digits when they reference real data** (1 chapter, 12 cities), and as words for vague claims (one quiet truth).

When you write CTAs, prefer verbs over nouns: **Start a Chapter**, **Read the Story**, **Apply Now**, **See the Network**.

---

## 8. Layout and Spacing

- 12-column grid, max content width 1240px
- Generous vertical rhythm. Sections are tall. Aim for 160–200px of vertical padding between sections on desktop.
- Hero is full viewport height
- Asymmetric layouts beat centered ones in interior sections
- Images and visual elements may bleed off the right edge intentionally, never the left
- Use hairline 1px gold-dim dividers between sections, never thick blocks of color

---

## 9. What "good" looks like

If you finish a screen and any of these are true, redo it:

- It looks like a SaaS landing page from any year
- It uses a stock-looking gradient
- The headline contains the word "innovate," "empower," "unlock," or "transform"
- The hero animation is missing or replaced with a static image
- The page looks like it could be for any of: a crypto fund, a productivity app, an AI startup, a notes app
- A reasonable visitor would not understand within 8 seconds that SEN is a global student network with a founding chapter in San Diego

If all of these are true, you nailed it:

- It feels like a magazine made by builders
- The map animation makes someone want to send the link to a friend
- Dropping the logo in the corner of any frame would not look out of place
- Reading the copy aloud sounds like a real person, not a brand
