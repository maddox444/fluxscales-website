# Fluxscales — Design Brief (from the flux-eng Miro board)

Source: Miro board "flux-eng" (https://miro.com/app/board/uXjVEO-ODWA=/), read in full on
19 November 2026. Frames used: Design Verdict, Design Scorecard, FD1–FD10, F1–F10,
6 Website Design, VISUAL REDESIGN, HOMEPAGE DIRECTION, ILLUSTRATION LIBRARY,
DESIGN ENGINEERING, REFERENCE STUDY, FLUXCODE REVIEW, FLUXCODE DESIGN DECISIONS,
CASE STUDY DIRECTION.

Scope: this brief drives the separate draft "Neue Webseite (Design)". The main site stays
untouched and nothing is published from this brief.

## 1. Board verdict

- Design Scorecard: Fluxscales 72/100, Psychological. 63/100.
- Fluxscales leads: first impression 9, typography 8, layout rhythm 8, imagery 7,
  components/CTA 7.
- Fluxscales trails: colour and contrast 7, mobile 6, accessibility and craft 6,
  fit for target clients 6.
- Verdict: "Fluxscales is the more finished, premium design system."
- Best of both: keep the Fluxscales discipline and finish, add proof-first thinking.
- Motto: "Make the design feel made, not generated."

## 2. Already done — do not redo

- Contact form shortened to name, email, project.
- Cookie banner is a thin bar along the bottom edge.
- Form input borders raised above the old 1.6:1.
- Mono labels raised from 11px to 13px.
- /boutique-branding-agency page exists and is linked from Services.
- Hero serves responsive AVIF / WebP / JPEG with a high-priority preload.
- Mobile nav drawer with Escape close and body scroll lock.

## 3. Remaining design work, in this order

1. **Studio metrics.** The board's clearest complaint: the four figures sit in a 2x2 grid of
   separate tiles — "the clearest card-like component in the page". Replace with an editorial
   strip: large numbers on one shared baseline, hairline dividers, labels beneath, no individual
   card backgrounds. Keep the user's figures: 2026 founded, 32+ projects, 12 wks, team of 4.
2. **Header.** Reduce the backdrop blur and translucent glass. "Make the header feel like a
   precise strip, not glass." Same nav items, same logo.
3. **Marquee.** The continuous ticker "can feel like a template when it repeats without adding
   information". Test a quieter static statement line, or slow motion with a pause and a
   reduced-motion fallback.
4. **Process drawings.** Add four original monochrome line drawings, one per step, aligned to the
   baseline, not inside boxes. Exact wording from the board's illustration library:
   - 01 INTERROGATE — "Look closer. Ask better questions. Find what is really happening."
   - 02 DEFINE — "Find the one clear idea. Give it words and direction."
   - 03 DESIGN — "Build the system. Test the details. Make every part work together."
   - 04 DEPLOY — "Launch with care. Measure what matters. Keep improving after go-live."
   Illustration rules: monochrome line work, one consistent stroke weight with occasional bold
   emphasis, draw objects related to the work (paper, type, grids, lenses, tools, people),
   imperfect enough to feel made but clean enough to feel precise. Forbidden: random squiggles,
   3D blobs, gradient spheres, floating emoji, abstract AI stock visuals, generic icon packs.
   Draw them as inline SVG in the code.
5. **Hero.** Keep the existing wave/background image and the line "Brands that hold their shape."
   Simplify the layered effects if they compete with the image: fewer overlay layers, still frame
   or slower movement, no extra floating UI.
6. **Typography craft.** Fix headline line-break spacing so screen readers do not hear
   "thathold theirshape". Load only the fonts actually in use (Oswald and Noto Kufi are flagged as
   loaded but unused) and only the weights used.
7. **Signature detail.** The board calls the dark monochrome "cold and common" and asks for "one
   signature detail, such as grain or motion". Add one restrained, controllable detail. Nothing more.

## 4. Build rules the board specifies

**Grid.** Desktop 12 columns, max-width around 1240px, 24px gutters. Tablet 8 columns, 32px page
margins, 20px gutters. Mobile 4 columns, 20px margins, 16px gutters. Let sections breathe; do not
add a card simply to fill a gap.

**Type.** DISPLAY clamp(3rem, 7vw, 7rem) · H1 3.5rem / 1.0 · H2 2.25rem / 1.1 · BODY 1.125rem /
1.55 · SMALL 0.875rem / 1.4 · LABEL 0.75rem mono. One display face, one readable body face, mono
only for small labels.

**Interaction.** One strong primary action per section, quiet text links for secondary actions.
Hover = underline, invert or subtle opacity shift; no glow, no bounce. Motion 180–240ms for small
transitions; no constant floating movement. Clear visible focus ring. Keyboard-operable menu and
forms. Respect prefers-reduced-motion, including Boot, Reveal and the marquee.

**Mobile reading order.** 1. Wordmark and menu 2. Headline and concise offer 3. One meaningful
visual 4. One clear action 5. Work immediately after. No tiny floating labels, no text over busy
imagery.

**Performance.** Responsive AVIF/WebP with correct srcset and sizes. Set width, height or
aspect-ratio to prevent layout shift. Lazy-load below-the-fold imagery. Load only the font weights
actually used; preload only critical fonts.

## 5. Remove (the board's anti-template list)

Floating rounded cards, gradient blobs and glass effects, generic AI icon sets, equal boxes with
identical layouts, decorative shapes without meaning, unnecessary padding. Replace with editorial
type, strong spacing, thin rules, open layouts and custom monochrome line drawings.

## 6. Hard limits — do not invent

No fake case studies, no fake client logos, no invented stats, no stock "team" photos, no invented
testimonials. The board's case-study direction is a structure only (CLIENT / INDUSTRY / YEAR,
one-sentence challenge, large real visual, detail shot, in-context application, Challenge /
Approach / Outcome; story order Context, Insight, Making, System, Outcome). Do not populate it with
made-up projects. If a section needs real material that does not exist, leave it out and list it as
a question for the user.

## 7. Known contradiction — do not resolve by deleting

The board says consolidate the five Instagram accounts into 1–2. The user explicitly asked for all
five handles (.mt, .ua, .uk, .eu, .ly) to stay. Keep all five.

## 8. Quality gate before reporting done

- Every CTA opens the right destination.
- Contact form gives a clear success and a clear error state.
- Test at 360, 390, 768, 1024 and 1440px.
- No horizontal overflow, no overlapping labels.
- Useful alt text; decorative art hidden from screen readers.
- Keyboard navigation and focus states work.
- Reduced motion is respected.
- Privacy, cookie and analytics behaviour matches the policy.
- All seven languages, the contact form, consent analytics and the legal pages keep working.
