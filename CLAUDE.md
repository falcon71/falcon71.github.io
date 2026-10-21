# CLAUDE.md

This repository is falcon71's GitHub Pages site. Its content is the pilot's manual of the KLN 90B simulation for
Microsoft Flight Simulator 2024, an Astro/Starlight site in `kln90b/`, served at https://falcon71.github.io/kln90b/.
`README.md` says how to build it and how a page shows a screen. (`kln90b/AGENTS.md` is Astro's generic advice.)

**Read [docs/style-guide.md](docs/style-guide.md) before you write, coordinate or review anything.** It is the
specification of the manual and its style guide in one.

## Roles

The maintainer starts the coordinator session; the coordinator starts researchers, writers and reviewers as
subagents and names each one's role in its prompt (style guide, section 4). The prompt for the coordinator is
[docs/coordinator-prompt.md](docs/coordinator-prompt.md). If no role was given and the task touches the manual's text,
ask.

- **A writer never reads a real KLN manual or anything derived from one**: not the reference library, not Claude's
  index of it, not the kln90b project's Claude memory, not a copy found on the web. Writers work from the code and tests in
  `vendor/kln90b`, the kln90b wiki pages the style guide names, and the simulated unit through the screen generator.
  kln90b's other `docs/` files and its issues paraphrase the manual and are not a writer's source (section 4).
- The coordinator and the reviewers may read the manuals (this project's memory says where), but nothing from them is
  ever copied into this repository, an issue or a message to a writer.
- Never put a manual page number ("3-29") into the manual or this repository.

## Rules

- **Never change `vendor/kln90b`.** It is the pinned kln90b submodule; the pin moves only by a deliberate commit
  (`kln90b/generator/README.md`, "Moving the pin"). The kln90b project must not learn about this manual.
- Bugs in the simulation go to https://github.com/falcon71/kln90b/issues, errors in the manual to this repository's
  issues, both with the `bug` label after a search for duplicates. Never close an issue. Details: style guide, section 5.
- Commit messages are plain sentences in American English.
