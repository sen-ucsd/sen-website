# Stitch Prompt for the SEN Website

Use the prompt below in Google Stitch. Upload `SEN_Logo.png` as an image input alongside it. The full design system, copy rules, and animation spec live in `design.md`. Paste the design.md contents into the Stitch project notes or the "context" panel if Stitch supports it. The prompt is intentionally short and atmospheric, the way Stitch likes it. Iterate screen by screen.

---

## Step 1 — Initial generation prompt

> Design a long-scroll marketing website for the **Student Entrepreneurs Network**, a global network of college student builders. The San Diego chapter at UC San Diego is the founding chapter. The website tells the story of a network expanding from one campus to many, then around the world.
>
> Aesthetic: deep space navy canvas, warm gold accent, off-white cream type. Premium and editorial, calm and ambitious, made for serious people. Layered radial light and a faint grain texture. No flat gradients. No purple. No corporate stock look.
>
> Use the attached circular logo (rocket inside a gold ring with the motto Per Ardua Ad Astra). Crop it to the circle. Use it small in the top-left of the navigation and again in the footer.
>
> The site uses these exact colors: background `#050816`, navy panels `#0A0E1A` and `#141B2D`, gold `#D4A843` with a lighter gold `#E8C97A` for glow, cream `#F0ECE4` for type. Pair an editorial display font with a clean modern body font. Do not use Inter, Roboto, Arial, or Space Grotesk.
>
> Sections, in order:
>
> 1. Fixed transparent navigation with the logo, the wordmark **SEN**, links (Vision, Network, Programs, Start a Chapter, Apply), and a small chapter selector showing **San Diego** with a downward chevron.
> 2. Full-viewport hero with an interactive world-map animation: one warm gold dot pulsing on San Diego, then more dots igniting across the United States with thin connecting lines, then the camera pulling back to a global view as more dots light up across continents. Faint hairline lines weave a constellation. Over the animation, a left-aligned headline in three short lines reads: **A global network of student builders. Born in San Diego.** A short subhead, a primary gold pill button **Start a Chapter**, and a secondary link **See the Network →**. A bottom stat strip reads `1 founding chapter · 12 cities applying · 4 continents in motion`.
> 3. A vision section in two columns. Left: a literary headline `Every great company starts in a dorm room. We make sure those rooms are connected.` Right: three short pillar blocks (Build, Network, Ship) with a tiny gold dot before each. Behind everything, place an oversized faint watermark of `PER ARDUA AD ASTRA` in the display font at 8% opacity.
> 4. A wide network section. Horizontally arranged chapter cards, the first one is **San Diego / UC San Diego / Founding Chapter** with a quote from the founding president. Other cards show realistic placeholder cities (Boston, NYC, Austin, Seattle, London, Tokyo, Singapore, São Paulo) with statuses like Launching Q3 or Applications open. Each card has a tiny continent fragment with a gold dot, the city, the university, the status, and a one-line quote.
> 5. A programs section with four asymmetric blocks (mix portrait and landscape). Titles: **Build Nights**, **Founder Conversations**, **The Inter-Chapter Exchange**, **Capital Connections**. Each has a thin line-art icon in gold and two lines of body copy.
> 6. A near-full-bleed Start a Chapter section. Centered display headline `Bring SEN to your campus.`, a short subhead, a horizontal three-step visual `Apply → Interview → Charter`, and one big gold pill CTA `Start the Application`. Below the CTA, a small line `Reviewed weekly. Reply within seven days.`
> 7. A wall of 12 founder portraits in a tight square grid. Eyebrow above the grid reads `The People Behind the Network`. Hovering a portrait reveals the founder's name and city.
> 8. Tall footer with three columns plus a bottom bar. Left column: logo, the wordmark SEN, the motto, and `Founding Chapter / San Diego, California`. Middle column: site links. Right column: a one-field email signup labeled `Updates from the network`. Bottom bar with copyright and three social icons in cream 35%.
>
> Motion principles: text fades up 12px on scroll, buttons scale 1.02 on hover with a soft gold glow, chapter dots pulse, the hero map animation is the centerpiece. Use a faint grain overlay at 3% opacity across the whole page.
>
> Copy voice: calm, direct, literary. No exclamation marks, no em-dashes, no "not X but Y" sentence structures, no staccato three-fragment rhythms. Sentences vary in length and read like prose.
>
> Output the full long-scroll desktop design first.

---

## Step 2 — Refinement passes (one at a time, after the first generation)

Use these as follow-up prompts in order. Make one change per prompt.

1. `Refine the hero. The map animation must clearly start with a single pulsing gold dot on San Diego, labeled "San Diego · Founding Chapter", before the other chapter dots appear. Show the still frame of this opening moment, with a faint outline of the world map behind it.`
2. `Now show the end state of the same animation. Same hero, but the map is fully populated: dots glowing across the US, Europe, Asia, South America, and Australia, with hairline gold lines connecting them into a network constellation. Keep the headline and CTAs in the same position.`
3. `Increase the editorial feel of the typography. The display font should feel like it belongs on a serious magazine cover, not a SaaS site. Tighten letter-spacing on the hero headline and increase its visual weight without making it bolder.`
4. `Add the chapter selector dropdown to the navigation. Open state: a small panel listing San Diego (Active), Boston (Launching Q3), NYC (Applications open), and three more cities marked "Coming soon" in cream 35%.`
5. `Design the mobile version of the hero. Stack the headline above the animation. Keep the gold CTA button full width but generous in padding.`
6. `Add a faint grain texture across the entire page at about 3% opacity. The texture should be visible against the navy background but never against the gold accent.`

---

## Notes for working with Stitch

- Upload the logo image when you submit Step 1
- If Stitch lets you attach context files, attach `design.md`
- Do not paste the entire design.md into one prompt; Stitch struggles past about 5000 characters
- After each generation, save a screenshot before iterating
- If a generation drifts off-brand (purple, generic gradients, wrong fonts), do not refine it, regenerate from Step 1 with one extra clarifying line about the issue you want avoided
- Export to Figma or HTML when the layout settles, then animate the hero map separately in code
