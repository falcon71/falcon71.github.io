---
name: update-pin
description: Use when the maintainer asks to update, move or bump the kln90b pin or the vendor/kln90b submodule, to follow a new kln90b release or commit, or to regenerate the screens after kln90b changed; also when `npm run screens` refuses because screens/kln90b-commit.txt names another commit than the submodule.
---

# Updating the kln90b pin

## Overview

The manual describes the kln90b commit it is pinned to. Moving the pin is three jobs in one branch: move the
submodule, make every screen generate again, and bring the manual's text in line with what changed between the old
and the new pin. The mechanics are in `kln90b/generator/README.md` ("Moving the pin") and the procedure in
`docs/style-guide.md`, section 19; this skill adds what those leave out.

**You are the coordinator for this work** (`docs/coordinator-prompt.md`). You move the pin, fix the generator and the
screen descriptions, and commit. You write no manual text: writers and reviewers do, as subagents.

## 1. Move the pin

1. If an earlier pin update is on a branch that is not merged into main yet, ask the maintainer what to do with it
   before you start. Otherwise create a branch from main before the first edit:
   `git switch -c update-kln90b-<tag or short sha>`.
2. Note where you start: `BASE`, the commit of this repository before the pin moves (`git rev-parse HEAD`), and
   `OLD`, the old pin (`git -C vendor/kln90b rev-parse HEAD`). Shell variables do not survive between commands; once
   the pin commit exists, `BASE` is its parent and `OLD` is `git rev-parse <BASE>:vendor/kln90b`.
3. `git -C vendor/kln90b fetch origin --tags`. **The target is the newest commit, `origin/main`**, even when it is
   ahead of the newest tag: the maintainer wants the manual to follow kln90b's main, not only its releases.
4. `git -C vendor/kln90b checkout <new>`, then `git add vendor/kln90b` and commit "Move the kln90b pin to <tag>
   (<short sha>)" when a tag points at it (`git -C vendor/kln90b describe --tags origin/main` prints the bare tag),
   "Move the kln90b pin to <short sha>" otherwise.
5. `npm ci --prefix vendor/kln90b` (the dependencies change between pins).
6. `git -C vendor/kln90b diff <OLD> <new> -- test/harness/navdata/builders.ts`. If it is not empty, follow
   `kln90b/generator/harness-lgpl/README.md` ("Moving the pin").

Never edit anything in `vendor/kln90b`, never push.

## 2. Regenerate the screens

Run `npm run screens` in `kln90b/` **without filters, every time**. A full run takes seconds. A filtered run refuses
until a full run has passed and written the new commit to `screens/kln90b-commit.txt`. Do not get around that by
starting Vitest yourself or by editing the manifest: a manifest that names the new commit over screens of the old one
is a lie the build cannot catch.

A screen that fails at a step or a field usually means the unit behaves differently. One that fails to compile or
import means the harness changed (a helper moved or changed its signature): fix the import or the call in this
repository, never in the submodule. For a behavior change, find it in the code
(`git -C vendor/kln90b log -p <OLD>..<new> -- <file>`), then fix the description to stage what a pilot would now do.

| Failure | Usual cause | Fix |
| --- | --- | --- |
| `cursorTo: no field "..."` | The unit skips or changed a step (a list it no longer shows) | Change the shared steps in `screens/shared/`; remove the screens of the vanished step (below) |
| `a message is pending` | A message now comes at another time, often later than the step that answered it | Wait for it before answering (`wait(...)` with the constant exported by kln90b, not a literal); `adjustCourseIndicator` does nothing without the message |
| `... matches no element of map X` | The element is drawn but lights no pixel of its own (another element covers it), or its point is named differently | Drop the locator for a moment: the error `... belongs to no field` lists every element; compare with `git show <BASE>:kln90b/screens/<id>/map-X.svg` |
| `matches ... more than once` / regex finds nothing | Layout or text of the page changed | Rewrite the regex to the new text; the field explanation then needs a writer |

While debugging, too, every run is a full `npm run screens`; the failures you are not looking at only add lines to the
output. To see what the unit does inside the steps: `KLN_TEST_LOG=1 npm run screens` shows `console.log` (it is
swallowed otherwise; in PowerShell `$env:KLN_TEST_LOG='1'; npm run screens`), or throw an `Error` with what you want
to see (`await u.panel.readMessages()`, or `Screen.read().dump()`
with `Screen` from `vendor/kln90b/test/harness/render/screen`). Remove all of it before committing.

**Removing a screen whose state no longer exists:** `git rm -r screens/<id>`, then
`grep -rn "<id>" kln90b/src kln90b/screens docs/manual-plan.md` and remove every `<KlnScreen screen="<id>" />` and
every mention; dated plans and specs under `docs/superpowers/` stay as they are. If the page still has that variant
in another situation (the runway list of a procedure whose runways differ), the page reference needs a screen of it
staged elsewhere (style guide, section 13): a new screen, with a writer for its `fields.mdx`.

Then, in `kln90b/`: `npm run screens:test` and
`node ../vendor/kln90b/node_modules/typescript/bin/tsc -p generator --noEmit`. A generator test that staged the old
behavior is changed to stage the new one, never loosened. A test that still passes after the pin moved may pass for
the wrong reason (a message that no longer exists is trivially "answered"). For every test you changed, verify by
mutation (the maintainer's CLAUDE.md): break the subject, see it fail, restore, `git diff` clean. The subject of a
generator test is the generator (`kln90b/generator/`, a helper such as `adjustCourseIndicator`), so that is where
the mutation goes; `vendor/kln90b` is never mutated.

Commit the screens and the generator changes before the text work starts, so that writers see the committed screens.

## 3. Update the manual

Collect the changes, as coordinator. You may read the commit messages and the issues to find what changed; only the
writers may not.

- `git -C vendor/kln90b log --oneline <OLD>..<new>`; every `fixes #NN` names a kln90b issue to read.
- `grep -rn "kln90b#NN" kln90b/src kln90b/screens` for every fixed issue: those paragraphs, field explanations and
  comments in screen descriptions describe the old behavior.
- `git diff --stat <BASE> HEAD -- kln90b/screens` (after the screens commit): every changed, added or removed
  `screen.txt` or `map-*.svg`, and every page that shows it (`grep -rln 'screen="<id>"' kln90b/src`).
- `git -C vendor/kln90b diff --stat <OLD> <new> -- <path>` over what a pilot sees, paths inside the submodule:
  `kln90b/pages`, `kln90b/controls`, `kln90b/data/PersistentMessages.ts` (messages),
  `kln90b/settings/KLN90BPlaneSettings.ts` (installation options, told in pilot terms), `kln90b/HEvents.ts` (External
  hardware), `kln90b/data/navdata` and `kln90b/services` (procedures, EFB).
- The major version for the footer (`kln90b/src/components/Footer.astro`).

Record in the coordinator's plan file, `docs/manual-plan.md`, only what it holds anyway: the screens added or
removed and the status of each page to rewrite. The list of what changed stays in your scratchpad, because writers read
the plan. Then start one writer per affected page group and a
reviewer for each draft, with the prompts of `docs/coordinator-prompt.md` ("Starting agents"; `model` always set,
never a fork). Tell a writer **where** to look (the page, the screen ids, the files and functions that changed, the
`kln90b#NN` comments to resolve), never **what** changed: commit messages, issues and kln90b's `docs/` paraphrase
the real manual and are not a writer's source. Remove each `kln90b#NN` comment once its paragraph describes the fixed
behavior. New bugs go through style guide section 5.

## 4. Finish

`npm run build` in `kln90b/` passes without new `[page links]` warnings. Run `npm run screens` once more on the
committed tree: it must leave `git status` clean. Report to the maintainer what moved, which screens changed or went,
which pages were rewritten, and what could not be checked (the tutorial flights are flown by the maintainer only).
Merge into main only after the maintainer approves, then delete the branch with `git branch -d`.

## Common mistakes

- Taking the newest tag when the newest commit is ahead of it.
- Running one screen through Vitest directly, or editing `kln90b-commit.txt`, to skip the full run.
- Deleting a screen folder but leaving its `<KlnScreen>` on a page (the build fails) or in the plan file.
- Answering a message before the unit has posted it: the screen passes only because it is captured before the
  message comes, and a screen with a few more steps on the same shared state flashes `msg`.
- Passing a writer the content of a commit message or an issue instead of the code to read.
