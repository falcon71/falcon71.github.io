# Package: messages (Messages; the two message lists; the Glossary page)

The lists come after the pages they summarize, so that every entry can link to the page that explains its cause.
Pointers come from the planning survey of the code (paths relative to `vendor/kln90b/kln90b/`); they are not
checked facts.

## Pages

### Messages (`operation/messages.mdx`)

1. Summary.
2. How the unit announces a message; the MSG page (shown and explained here); reading, and what stays until its
   cause is gone.
3. Messages of the status line: where they appear and for how long.
4. The annunciators of the aircraft (Availability box).
5. Links to the two lists.

### Message page messages (`lists/messages.md`) and Status line messages (`lists/status-line-messages.md`)

Form: style guide, section 10 ("Lists"): alphabetical by the text as the unit shows it; each entry the text, the
meaning, what to do, and the link to the owning section. The researcher builds the complete list of texts from the
code; a text that takes a value (an identifier, a course, a code) is listed once with the place of the value
marked.

### Glossary (`lists/glossary.mdx`)

The page is generated from `kln90b/src/data/glossary.ts`. The session checks it against the rule of the style
guide, section 14: the common terms have an entry, no entry belongs to a single screen, and no entry is a
placeholder.

## Topics this package owns

The MSG page, how messages arrive and are read, the annunciators; the texts with meaning and action.

## Where to look

`data/PersistentMessages.ts`, `data/MessageHandler.ts`, `controls/MessagePage.tsx`, `controls/StatusLine.tsx` (the
status line texts), `failures/FailureCatalog.ts` (the failure messages), and the places that raise one-time
messages: `Gps.ts`, `KLN90BCore.ts`, `pages/WelcomePage.tsx`, `pages/left/Set2Page.tsx`, `pages/PageManager.ts`,
`pages/right/Apt7Page.tsx`, `Apt8Page.tsx`, `services/Flightplanloader.ts`, `services/KlnEfbLoader.ts`; the wiki
page `External-Annunciators.md` as background.

## Notes from other packages

- A message of several lines is quoted with its lines, in a code block (style guide, section 12, "Text the unit
  shows"; maintainer, 2026-11-16).
- Earlier packages quote message texts where they are raised and link to these lists by page; the seam check
  sharpens those links to the entries.

## Changes to earlier pages

To be listed by the session: links from earlier pages to single entries.
