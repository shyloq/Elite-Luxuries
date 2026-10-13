---
name: VULT LABEL
description: The store as the vault's security system. Concrete ground, grey camera feeds, white on-screen lettering, one red recording dot.
colors:
  concrete: "#d4d4cf"
  concrete-deep: "#c3c3bd"
  field: "#e3e3de"
  line: "#a9aaa4"
  feed-hi: "#b4b6b1"
  feed-lo: "#8b8d88"
  signal-lost: "#2c2d2b"
  rack: "#161716"
  ink: "#121312"
  ink-soft: "#4a4c49"
  osd: "#f5f5f0"
  osd-dim: "#c9cac4"
  rec: "#e0281e"
  error: "#8f1710"
typography:
  display:
    fontFamily: "'Archivo Variable', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(38px, 6vw, 96px)"
    fontWeight: 900
    lineHeight: 0.92
    letterSpacing: "-0.025em"
    fontVariation: "'wdth' 125"
  headline:
    fontFamily: "'Archivo Variable', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(30px, 3.6vw, 52px)"
    fontWeight: 900
    lineHeight: 0.95
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 125"
  title:
    fontFamily: "'Archivo Variable', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(26px, 2.5vw, 38px)"
    fontWeight: 900
    lineHeight: 0.95
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 112"
  wordmark:
    fontFamily: "'Archivo Variable', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "19px"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 125"
  body:
    fontFamily: "'Archivo Variable', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
    fontFeature: "'tnum' 1"
  lede:
    fontFamily: "'Archivo Variable', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "clamp(18px, 1.55vw, 22px)"
    fontWeight: 450
    lineHeight: 1.45
  label:
    fontFamily: "'Archivo Variable', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0.06em"
    fontVariation: "'wdth' 112"
  nav:
    fontFamily: "'Archivo Variable', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "13px"
    fontWeight: 750
    lineHeight: 1.5
    letterSpacing: "0.05em"
    fontVariation: "'wdth' 112"
  button:
    fontFamily: "'Archivo Variable', 'Helvetica Neue', Arial, sans-serif"
    fontSize: "14px"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.06em"
    fontVariation: "'wdth' 112"
  osd:
    fontFamily: "'VT323', 'Courier New', monospace"
    fontSize: "clamp(17px, 1.5vw, 23px)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.04em"
  osd-data:
    fontFamily: "'VT323', 'Courier New', monospace"
    fontSize: "22px"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.04em"
  osd-price:
    fontFamily: "'VT323', 'Courier New', monospace"
    fontSize: "36px"
    fontWeight: 400
    lineHeight: 1
rounded:
  none: "0px"
  round: "50%"
spacing:
  wall-gap: "6px"
  osd-inset: "14px 16px"
  stack: "16px"
  gutter: "clamp(16px, 2.4vw, 32px)"
  bar-height: "52px"
  section-y: "clamp(64px, 9vw, 136px)"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.osd}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "14px 26px 13px"
    height: "52px"
  button-primary-hover:
    backgroundColor: "{colors.osd}"
    textColor: "{colors.ink}"
  button-on-feed:
    backgroundColor: "{colors.osd}"
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.none}"
    padding: "14px 26px 13px"
    height: "52px"
  button-on-feed-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.osd}"
  icon-button:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    size: "44px"
  icon-button-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.osd}"
  size-chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "0 12px"
    height: "48px"
    width: "58px"
  size-chip-selected:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.osd}"
  input-field:
    backgroundColor: "{colors.field}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.none}"
    padding: "12px"
  top-bar:
    backgroundColor: "{colors.concrete}"
    textColor: "{colors.ink}"
    typography: "{typography.nav}"
    height: "{spacing.bar-height}"
    padding: "0 {spacing.gutter}"
  feed-tile:
    backgroundColor: "{colors.feed-lo}"
    textColor: "{colors.osd}"
    typography: "{typography.osd}"
    rounded: "{rounded.none}"
  feed-tile-lost:
    backgroundColor: "{colors.signal-lost}"
    textColor: "{colors.osd}"
  toast:
    backgroundColor: "#000000"
    textColor: "{colors.osd}"
    typography: "{typography.osd}"
    rounded: "{rounded.none}"
    padding: "10px 14px 8px"
---

# Design System: VULT LABEL

## Overview

**Creative North Star: "The Security Feed"**

The store is the vault's security system. Visitors watch the vault on CCTV: the label speaks in on-screen display lettering over live, grainy grey feeds, and the shop is a monitor wall where every product is a camera. Around the feeds the world is poured concrete: a pale grey ground, near-black ink, hairline and two-pixel rules, square corners everywhere. Nothing is decorated that a security rig would not show.

The system runs on one deliberate light theme. The concrete is the room; the dark rack behind the monitor wall and the dark vault gate are places inside that room, not a dark mode. There is no theme switch and no `prefers-color-scheme` branch (`color-scheme: light`). Density is high and terse: a voice set in a heavy, extra-wide grotesk, product facts in camera lettering, very few words.

Motion is video, not interface. Nearly every transition and animation is quantised with `steps()`: grain jitters, the hero camera drifts in 160 discrete steps, a single scan roll passes on load, the REC dot blinks hard, and opening a product cuts from a horizontal slit to fullscreen. The one smooth movement is the physical vault door swinging open on entry. Reduced motion removes drift, grain movement, the roll, the blink and the cut.

**Key Characteristics:**
- Pale concrete ground, grey feeds, white on-screen lettering with a hard black outline.
- Two typefaces with separate jobs: Archivo for voice and labels, VT323 for camera lettering and data.
- Square corners on every surface and control; circles only for the REC dot and the vault dial.
- Garments show desaturated until their feed is selected.
- Stepped, video-like timing; one smooth exception for the vault door.
- A single light theme by design.

## Colors

A near-achromatic concrete and camera palette (every neutral sits under 0.01 OKLCH chroma) with one saturated red.

### Primary
- **Ink** (`ink`): body text, the primary button fill, all rules and borders, focus outlines on light grounds, text selection background, scrollbar thumb. The page's working colour.
- **Recording Red** (`rec`): the blinking REC dot on every live camera, the favicon's dot, and the square marker on an error toast. The only saturated colour in the system.

### Neutral
- **Pale Concrete** (`concrete`): the page ground, top bar, product view and bag drawer. Also the browser `theme-color`.
- **Deep Concrete** (`concrete-deep`): hover fill on size chips, scrollbar track.
- **Field Concrete** (`field`): the fill of checkout inputs, a step lighter than the ground.
- **Hairline Grey** (`line`): 1px dividers between log rows, bag items and footer rows; borders of unavailable sizes.
- **Feed Highlight / Feed Shadow** (`feed-hi`, `feed-lo`): the radial gradient of every camera feed (tile, product view, bag thumbnail), bright centre falling to shadow.
- **Signal Lost** (`signal-lost`): the near-black of a sold-out feed under heavy static.
- **Rack Black** (`rack`): the monitor wall's housing behind the feed grid.
- **Soft Ink** (`ink-soft`): secondary text on concrete: product description, bag variant, empty-bag and status notes (5.8:1 on concrete).
- **OSD White** (`osd`): on-screen display lettering, text on dark grounds, the primary button's text, the inverted button on the hero feed.
- **OSD Dim** (`osd-dim`): secondary on-screen text on the rack (wall meta) and pending combination steps at the gate.
- **Fault Red** (`error`): error text in the bag and checkout (6.1:1 on concrete). Text only; never a fill.

### Named Rules
**The One Red Rule.** Saturated red belongs to the recording system: the REC dot, and the small marker that flags a fault. Prices, sale states, CTAs and scarcity never turn red.

**The Concrete Room Rule.** One light theme. Dark grounds (the rack, the vault gate, lost feeds, the hero feed) are places in the world, entered and left; they are never a global dark mode.

## Typography

**Display Font:** Archivo Variable (with Helvetica Neue, Arial), self-hosted, weights 100 to 900, widths 62% to 125%
**Body Font:** Archivo Variable
**Label/Mono Font:** VT323 (with Courier New, monospace), self-hosted

**Character:** Archivo at full weight and full width is the label's voice: blunt, wide, uppercase, tightly tracked. VT323 is the camera's own pixel lettering, so it carries only what a security system would burn into the picture.

### Hierarchy
- **Display** (900, width 125%, `clamp(38px, 6vw, 96px)`, line-height 0.92, uppercase, max 12.5ch, balanced): the brand statement over camera 01. One per page.
- **Headline** (900, width 125%, `clamp(30px, 3.6vw, 52px)`, 0.95, uppercase): section titles such as the drop name and "How the vault works".
- **Title** (900, width 112%, `clamp(26px, 2.5vw, 38px)`, 0.95, uppercase): the product name in the product view; 24px at 1.1 for the order confirmation.
- **Wordmark** (900, width 125%, 19px; 16px under 720px, 14px under 380px): the top bar and bag head. The footer repeats it as a giant mark, `clamp(30px, 11vw, 96px)` at line-height 0.88.
- **Body** (400, 16px, 1.5, tabular numerals on): descriptions and notes, capped near 42ch. Lede at 450, `clamp(18px, 1.55vw, 22px)`, 1.45, max 34ch.
- **Label** (800, width 112%, 12 to 13px, 0.06em, uppercase): form labels, size legend, log terms, bag row labels. Nav and footer links use 750 at 13px, 0.05em. Buttons use 800 at 14px, 0.06em.
- **OSD** (VT323, `clamp(17px, 1.5vw, 23px)`, line-height 1, 0.04em, uppercase, OSD White with the hard outline): camera ids, timestamps, product names and status on feeds. Data sizes: 22px for stock, quantities and bag amounts; 36px for the product price; 58px for the vault readout.

### Named Rules
**The Two Jobs Rule.** Archivo speaks; VT323 reports. VT323 appears only as on-screen camera lettering (camera labels, clocks, "No signal", the dial numerals) and as data (prices, stock, quantities, sizes chosen in the bag, subtotals, toasts). Headings, body copy, buttons and form labels are always Archivo. In a row that pairs a label with a value, the label is Archivo and the value is VT323.

**The Wide Voice Rule.** Every Archivo heading is weight 900 at width 112% or 125%, uppercase, with negative tracking. Every Archivo label is 750 to 800, width 112%, uppercase, with positive tracking. Body text is the only Archivo set at normal width and mixed case.

## Layout

The page is a vertical sequence of full-bleed bands: a sticky 52px top bar (48px under 720px), camera 01 at `min(80svh, 840px)` (min 520px), the monitor wall on the rack, an information band, then the footer. Horizontal padding follows the `gutter` token; hero copy and the info band use `clamp(16px, 4vw, 56px)`.

The monitor wall is a tight grid: four columns at 6px gaps, two columns under 900px, tiles at a fixed 4:3 aspect. The narrow gap reads as the bezel of a rack of monitors. On-screen lettering pins to the four corners of every feed, inset 14px by 16px (10px on small tiles).

The information band is a 5:7 two-column grid (title and lede left, the log right), one column under 720px. The log is a definition list ruled by a 2px ink top and 1px hairline rows.

The product view is fixed beneath the top bar (the bar stays usable) and splits 7:5, feed left and details right, the details column centred vertically without clipping. Under 900px it takes the full screen as one scrolling column with a 4:3 feed on top. The bag is a right drawer, `min(440px, 100%)`, over a 60% black scrim. The document reserves its scrollbar gutter (`scrollbar-gutter: stable`) so overlays never shift the page.

Breakpoints observed: 900px (wall to two columns, product view stacks), 720px (smaller bar and OSD, info band stacks), 420px (tile clock hidden), 380px (date hidden, smallest nav).

## Elevation & Depth

Flat by construction. Interface surfaces carry no drop shadows: separation comes from 1px and 2px ink rules, the change of ground between concrete and the dark rack, and a dark scrim under the bag drawer. Depth lives inside the camera picture instead: radial vignettes on feeds, a bottom gradient under the hero statement, animated grain and 1-in-3px scanlines layered over every feed.

### Shadow Vocabulary
- **OSD Outline** (`text-shadow` of 1px hard black in six directions, `--osd-outline`): on every piece of camera lettering. This is the on-screen display's native stroke, not decoration; it keeps white lettering legible on any part of the feed.
- **REC Ring** (`box-shadow: 0 0 0 1px #000`): the black keyline round the recording dot.
- **Statement Lift** (`text-shadow: 0 2px 24px rgba(0, 0, 0, 0.35)`): soft legibility shadow under the display statement on the hero feed only.
- **Vault Door Cast** (`box-shadow: inset 0 0 0 10px #3c3d3b, inset 0 0 0 12px #5d5f5b, 0 30px 60px rgba(0, 0, 0, 0.45)`): the physical door at the entry gate, the one object in the system with mass.

### Named Rules
**The Picture Holds The Depth Rule.** Shadows, vignettes and grain belong to the camera image and the vault itself. Panels, buttons, chips, the drawer and the toast stay flat.

## Shapes

Every rectangle has square corners (0px): buttons, inputs, size chips, icon buttons, feed tiles, the drawer, toasts, combination steps. Circles are reserved for the mechanism and the recording light: the REC dot, the vault door and its dial, the dial's bolts. Borders are 1px ink for controls and panels, 2px ink for emphasis rules (log top, bag foot top, button border), 1px hairline grey for quiet dividers. Selection on a feed is a 3px OSD White frame drawn inside the tile.

## Components

### Buttons
Blunt, ink slabs that invert on contact.
- **Shape:** square (0px), 2px border in the fill colour, min-height 52px, padding 14px 26px 13px.
- **Primary:** Ink fill, OSD White text, Archivo 800 at 14px, width 112%, uppercase, 0.06em. Full-width variant in the product view and bag.
- **Hover / Focus:** inverts to OSD White fill with Ink text in a two-step cut (`0.12s steps(2, end)`). Focus is a 2px Ink outline offset 3px.
- **On a feed:** over camera 01 the button starts inverted (OSD White fill, Ink text) and hovers to Ink; its focus outline turns OSD White.
- **Disabled / Busy:** 45% opacity with a not-allowed cursor; while a request runs, 70% opacity with a progress cursor.
- **Icon button:** 44px square, 1px Ink border, transparent, 18px stroked SVG; hovers to Ink fill.
- **Text actions:** nav, footer and bag links are label-set text with a 2px underline at 5px offset, shown on hover (always shown on bag links).

### Chips (size picker)
- **Style:** 58px by 48px minimum, 1px Ink border, Archivo 700 at 15px, width 112%.
- **State:** hover fills Deep Concrete; selected fills Ink with OSD White text; unavailable sizes take a hairline border, grey text and a strike-through.

### Cards / Containers (feed tiles)
- **Corner Style:** square.
- **Background:** the feed gradient; sold-out tiles switch to Signal Lost with heavy static and a centred "No signal".
- **Shadow Strategy:** none; see Elevation & Depth.
- **Border:** none at rest; a 3px OSD White inner frame on hover and focus.
- **Internal Padding:** the garment art inset 13% 24% 21%; OSD lettering at the corners: camera id top left, clock top right, name and price or units left bottom left.

### Inputs / Fields
- **Style:** Field Concrete fill, 1px Ink border, square, 12px padding, 16px Archivo; labels above in the label style.
- **Focus:** 2px Ink outline at 0 offset.
- **Error:** a single Fault Red message line above the submit button; fields themselves do not turn red.

### Navigation
- **Style:** a concrete top bar with a 1px Ink bottom rule, wordmark left, Drop, Info and the Bag count right in label-set Archivo (750, 13px, 0.05em, uppercase). Hover underlines 2px at 5px offset. The bag count reads `Bag [n]`. Under 380px the gap and size shrink rather than collapsing into a menu.

### Camera Feed (signature)
The system's core unit, used for the hero, every product tile, the product view and bag thumbnails. A grey radial feed, a greyscale drawn subject, a grain layer (32% overlay, `0.6s steps(6)`) with scanlines, and OSD lettering in the corners with a blinking REC dot. Switching cameras is the signature interaction: hovering or focusing a tile brings it live (colour returns over `0.24s steps(3)`, grain drops to 12%, the white frame appears, the REC dot lights), and selecting it cuts to that camera fullscreen as the product view (`0.24s steps(4)` slit-open clip).

### Toast
A black slate with a 1px OSD White border, VT323 at 21px uppercase, pinned under the top bar at the right. Errors carry a 10px Recording Red square marker. One toast at a time.

### Vault Gate (signature)
A full-screen dark gate (`#4f514d` to `#262725` radial) under grain, with camera 00 OSD, the wordmark at display scale, a circular door with eight bolts and a draggable combination dial, a 58px VT323 readout, and the three combination steps as square outlined cells that light and then fill OSD White as each number lands. A wrong turn shakes the dial in four steps; the right code swings the door open on a smooth curve and fades the gate.

## Do's and Don'ts

### Do:
- **Do** set prices, stock, quantities, subtotals and every camera label in VT323; set every heading, label, button and sentence in Archivo.
- **Do** put the hard black OSD outline on all white lettering that sits on a camera picture.
- **Do** keep every control and panel square (0px) and draw structure with 1px and 2px Ink rules.
- **Do** quantise motion with `steps()` and remove drift, grain movement, the scan roll, the REC blink and the camera cut under reduced motion.
- **Do** show a garment greyscale until its feed is hovered, focused or opened.
- **Do** show sold-out pieces as lost signal from real stock, never as a red badge.

### Don't:
- **Don't** add a dark theme or a theme toggle; the system is one light concrete world.
- **Don't** use Recording Red for anything except the REC dot and the fault marker; prices, CTAs and scarcity stay grey and white.
- **Don't** set body copy, buttons or headings in VT323, or data values in Archivo.
- **Don't** round corners on rectangles or give panels, buttons or the drawer drop shadows.
- **Don't** bring back serif type, gold, or the hero-banner-over-card-grid store this world replaced.
