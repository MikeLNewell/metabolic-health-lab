# Design system | Metabolic Health Laboratory v1.1.0

Design source: *Newell Website Design Implementation Guidebook*, 11 November 2026, especially pages 8–10, 12–13 and 17.

## Concept choice

Selected: **Instrument-first Scientific Control Room**. Prioritises the sampling workflow, data state and RER readout. Dark navy materials are retained but large decorative gradients and uniformly prominent cards are replaced with flatter instrument-like surfaces. Low intensity, vigorous exercise, recovery, calculated results and optional challenges have distinct signifiers.

Alternatives considered: **Light Clinical Field Notebook** (excellent for annotations but lower visual distinction between immediate and calculated measurements) and **Editorial Physiology Atlas** (strong for conceptual explanation but less suited to real-time acquisition). The experiment-first direction is preferable for active laboratory use.

## Design controls

- Colour: deep navy canvas, sea-glass for measured/active, ice blue for derived values, lilac for exercise, amber for recovery/warnings.
- Typography: system sans for navigation and reading, monospaced instrument labels and tabular values. No external font dependency.
- Layout: 246 px sidebar; 65 px topbar; persistent five-window sampling rail; max-width 1310 px content; clear mobile horizontal scroll.
- Shape: control radius 6 px, panel radius 12 px; no gratuitous blobs or oversized cards.
- Depth: flat surfaces with dividing borders; shadows only for modal and notification elevations.
- Motion: 140/260 ms for useful feedback, disabled for reduced-motion users.
- Density: spaced protocol and learning content, denser laboratory inputs and sampling rails.
- Imagery: actual protocol timeline, data readouts and graphs; no stock photography.

## Invariants

- No change to the scientific equations or gas exchange unit conversions in `assets/logic.mjs`.
- No change to local-only storage, CSV/JSON import/export, safety instructions, HRR calculation or seven learning challenges.
- No new dependencies, login, backend or external measurement streams.

## Pre-release checks

Run `npm test`, review mission, protocol, laboratory, analysis, challenges and debrief at 390 px, 768 px and desktop widths, and verify data export after entering realistic and physiologically invalid values. Save screenshots for the design review and use the last known working commit as rollback point.