# Package: failures (the FLR chapter; Simulated failures)

Second package of the full run, at the maintainer's request: the FLR pages are new and pilots need guidance for
them. Everything in this package is Simulator only (style guide, sections 3 and 11).

The pointers below come from the planning survey of the code (paths relative to `vendor/kln90b/kln90b/`). They tell
the researcher where to look; they are not checked facts.

## Pages

### Simulated failures (`operation/failures.mdx`), Operation, new

Planned sections (the session settles them after the research):

1. Summary, in the Simulator only box's company: the simulation can let parts of the unit and of its installation
   fail, at random or at the pilot's command, and they stay failed until they are repaired.
2. Turning random failures on and off; what the setting means; which failures never come at random.
3. Failing a part on purpose, and repairing it.
4. Service: what it repairs and resets.
5. What can fail, as a lookup list in groups (the receiver and the antenna, interference and a faulty satellite, the
   inputs from the aircraft, the outputs to the aircraft, the annunciators, the unit's memory, the battery). Each
   entry: the name as FLR shows it, what the pilot notices, the message if there is one (quoted, linked to the list),
   what ends it. Only failures of equipment the aircraft has are offered: say so in pilot terms (Availability box if
   it fits), never with a configuration key.
6. When the unit notices a failure: the self test (`TEST FAIL`), the delay in operation, failures the unit never
   reports.
7. The battery: how it runs down, the warning, the loss of the user data at power-on, what survives. A Good to know
   box is likely here.
8. Links on: the FLR pages, GPS reception and RAIM, Power-on and initialization, the message lists.

Split the page if the list of section 5 outgrows it: the session decides after the research whether the list
becomes a page of its own.

### FLR pages (`pages/flr.mdx`), page reference, new

1. The FLR pages as a type: Simulator only box; they are not on the left outer knob; how they open from SET 10 and
   how the pilot leaves them. This section owns that topic.
2. FLR 1: random failures, the battery and service. Variants: the confirmation of the service, the status line
   after it.
3. FLR 2: the active failures. Variants: an empty list, the repair question.
4. FLR 3: the failures that can be set. Variant: the fail question.
5. Links to Simulated failures.

## Topics this package owns

Simulated failures owns what can fail, what each failure does, detection, random failures, the battery and the
loss of user data, and service. The FLR chapter owns the pages and the way into them. Other pages say nothing about
failures; the message lists give text, meaning and the link.

What these pages link to instead of explaining: the receiver states and RAIM (GPS reception and RAIM, package sta);
the self test and the power-on sequence (Power-on, planned); what the unit normally keeps while off (Power-on,
planned); the cursor and lists with `CLR` and `ENT` (Controls and display, planned anchors); SET 10 as a page (the
SET chapter, planned).

## Where to look

- The pages: `pages/left/Flr1Page.tsx`, `Flr2Page.tsx`, `Flr3Page.tsx`, `FailureListPage.tsx`; the way in:
  `pages/left/Set10Page.tsx`, `pages/MainPage.tsx` (`openFailurePages`); the entry of the hours:
  `controls/editors/MtbfEditor.tsx`.
- The failures: `failures/FailureCatalog.ts` (every failure, its name on FLR, its message, when it is offered),
  `failures/Failures.ts`, `FailureTrigger.ts` (random failures), `FailureDetector.ts` (when the unit notices),
  `Battery.ts`, `GpsFailures.ts`, `ReceiverErrors.ts`, `Transmitters.ts`, `EepromCalibration.ts`,
  `FailureOutputs.ts`.
- The effects elsewhere: `PowerSupply.ts` and `settings/UserMemory.ts` (the loss of user data),
  `pages/left/SelfTestLeftPage.tsx` (`TEST FAIL`), `pages/left/Sta1Page.tsx`, `Sensors.ts` and `Interconnect.ts`
  (inputs and outputs), `data/PersistentMessages.ts` (the failure messages).
- Tests that pin each failure: `test/render/failures/`, `test/unit/failures/`.
- **Not a source:** `vendor/kln90b/docs/failures.md` and `docs/superpowers/specs/`, which the code comments cite
  (style guide, section 4). The researcher and the writers do not open them.

## Screens

Planned by this package's session after its research. The session checks first that the generator can open the FLR
pages through SET 10 and set a failure; what it cannot stage is listed here afterwards.

## Notes for the session

- **Page links.** The FLR pages are not in `kln90b/src/data/pageTree.ts`, which lists the knob order for the knob
  demo and the page links. Before the writers start, the coordinator reads README, "Page links", and
  `kln90b/src/plugins/remarkPageLinks.*` and settles how FLR 1 to FLR 3 become page names that link to
  `pages/flr`, without the knob demo treating FLR as a stop of the outer knob. That is a change to the site, so it
  goes to the maintainer first.
- **The sidebar** generates the page reference from the folder; the session sets `sidebar.order` so that FLR stands
  after SET, and checks the order of the chapters that exist.
- The failures are the simulation's own design: the real manuals do not describe the FLR pages, so the reviewer
  checks the facts against the code and the staged unit, and checks against the real manuals only the names of
  real things (the messages, the annunciators, the interfaces) and the behavior of the real unit that a failure
  imitates.
- The code marks the draws and delays as its own choice. The pages describe what the pilot observes and give a
  number only where the pilot can use it.
- Names of interfaces (ARINC 429, RS-232) appear on FLR as the unit shows them. The pages explain each in pilot
  terms (what the aircraft gets from it or sends over it) and name no configuration.
- Models: Sonnet for the FLR chapter; Opus for Simulated failures and for the reviews.
- Glossary: the names FLR shows for the failures are used on these screens only, so they are explained in the
  field explanations and in the list of Simulated failures, not in the glossary (style guide, section 14).

## Notes from other packages

None yet. The package sta notes here what its pages said about a failed receiver, jamming, spoofing and a faulty
satellite, so that this package uses the same terms.

## Changes to earlier pages

To be listed by the session: the sentences of the sta package's pages that name a failure get their link to the
section that now exists.
