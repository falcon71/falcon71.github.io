# The knob demo as faceplate knobs: design

The Quickstart's "Selecting a page" section has an interactive knob demo (`kln90b/src/components/KnobDemo.astro`).
Today it is four round buttons per side with arrow glyphs and two flat rows of page type and page chips. This rework
draws the knobs as they look on the front panel and the page types as a tree.

## Intent

A pilot who has never seen the unit should learn page selection by turning knobs that look like the real ones, and
should learn that the faceplate labels around each knob give the order of the page types. The demo shows this by
lighting the label of the selected page type.

## What the demo shows

- **The status-line strip stays** at the top, unchanged, with both page names (maintainer's choice). The Quickstart
  text around the demo does not change.
- **Per side, the knob drawing:** the outer and inner knob with the faceplate labels in their two columns, drawn like
  the front-panel drawing in `KlnUnit.astro`: the same geometry, gradients and label font. Nothing else of the unit is
  drawn: no CRSR button, no other buttons, no faceplate outline beyond what the knobs and labels need.
- **Turning.** A click on the left half of a knob turns it one step counterclockwise; a click on the right half turns
  it one step clockwise. The inner knob is the disc inside the outer one, and its halves turn the inner knob; the ring
  around it turns the outer knob.
- **The highlight.** The faceplate label of the selected page type is drawn in the amber of the drawing's markers
  (`#ffc233`) instead of white. The labels run around the knob in a horseshoe (left column bottom to top, then right
  column top to bottom), so the light visibly walks along it.
- **The tree,** below each knob: the page types of that side in knob order, as a literal tree. Only the selected page
  type is expanded, showing its pages as leaves joined by tree lines; the expansion closes when the page type changes.
  The selected page type and the current page are highlighted. The page types use the status-line names (TRI, MOD,
  ACT, SUP), and the faceplate keeps its own spelling (TRIP, MODE, ACTV, SUPL).
- **Behavior stays as today:** both ends wrap around, each page type remembers its last page, the start is NAV 1
  on the left and APT 1 on the right, and optional pages are drawn dashed with the existing note under the demo.

## Approaches

1. **A drawing of its own in `KnobDemo.astro`, with the labels in a shared data module (chosen).** The demo draws one
   side's knob and labels in its own SVG. The label lists and their positions move from `KlnUnit.astro` into a small
   module that both components read, so the faceplate text cannot disagree between them. The interactive parts never
   touch the hero or the front-panel figure. The cost is that the knob's circles and gradients exist twice.
2. **One shared knob-and-labels component** used by `KlnUnit.astro` and the demo. One drawing, but it restructures the
   drawing behind the home page hero and the front-panel figure for the sake of the demo, and the component carries
   options only the demo uses.

The maintainer chose approach 1: the knob drawing is a handful of circles and unlikely to change, and what must stay
identical, the labels and their order, is shared anyway.

## Constraints

- `KlnUnit.astro` must render exactly as before after its labels move to the shared module.
- Responsive from a phone up: the two sides sit side by side where there is room and stack where there is not; each
  knob drawing is as large as its column allows, so that the inner knob's halves stay usable by touch.
- The tree opens below the knob, so the knob never moves under the pointer when a long page type (FPL, 26 pages)
  expands.
- Readable in the light and dark themes. The knob drawing is the dark faceplate in both, like the front-panel figure.
- No third-party code; the demo stays a small inline script.

## Calls left to the builder (marked as Claude's calls, for the maintainer to check)

- **Keyboard and screen readers.** Each knob half is a focusable element with a label ("Left outer knob,
  counterclockwise"); Enter and Space turn it. The page names change in an `aria-live` region, as today.
- **A visible turn.** Each click rotates that knob's grip a few degrees, and the pointer shows which half it is over,
  so that the click target is discoverable without a caption. Hovering over a half shows a faint arrow in its
  direction.
- **PULL SCAN** stays printed on the right inner knob, because it is part of how the knob looks; pulling is not
  simulated.
- **The label module** lives in `kln90b/src/data/faceplate.ts` and holds the label text, its column and its row for
  each side, in knob order, so that the demo can map a page type to its label by index.
