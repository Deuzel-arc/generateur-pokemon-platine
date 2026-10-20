# Acceleration tooling and quality gates

## Purpose

This repository is a static Pokémon team generator with ROM-derived data. The goal of this tooling is to make each batch auditable and repeatable, detect regressions early, and prevent unverified mappings from silently becoming runtime facts.

## Automated checks

The `Quality checks` GitHub Actions workflow runs on pull requests targeting `main` and manual dispatch. The GitHub Pages workflow runs the same full suite before deployment on pushes to `main`, avoiding duplicate test runs on every push. It installs Node.js 22 dependencies, installs Chromium for Playwright, then runs the complete `npm test` suite:

- `test:static`: generator and data invariants.
- `test:rom-audits`: ROM audit schema and integrity assertions.
- `test:browser`: browser interaction regression tests.
- `test:tooling`: verifies required audit inputs, npm test wiring, CI triggers, and the Pages deployment gate.

The repository currently has no committed npm lockfile, so dependency resolution is not fully locked; workflows intentionally do not use setup-node's lockfile-dependent npm cache. Add and verify a generated lockfile when a trusted npm install environment is available.

A red check means the batch is not validated. Do not label a batch complete or update progress as verified until the workflow passes.

## ROM data rules

- Keep raw IDs, source ROM identity, hashes, and evidence attached to derived records.
- Treat name mappings and gameplay interpretations as candidates until independently verified.
- Never transfer a type/effect interpretation from one ROM profile to another without evidence.
- Keep structural binary comparison separate from semantic certification.
- Unknown entries stay explicitly unknown; never infer names from archive position alone.

## Efficient batch workflow

1. Identify a bounded batch with clear input files and expected output.
2. Run the narrow audit/test for that batch while unrelated, independent audits are prepared in parallel.
3. Run the full `npm test` suite before accepting the batch.
4. Record the source commit, audit inputs, counts, unresolved items, test result, and next action.
5. Reuse existing parsed exports and audit artifacts rather than repeating extraction.
6. Prioritize blockers that unlock multiple downstream tasks; do not parallelize tasks that depend on an unfinished mapping.

## Progress accounting

Progress is evidence-based, not time-based. Track separate workstreams (ROM extraction, mapping verification, generator integration, regression coverage). Each task has a defined acceptance condition and weight. A task only counts as complete when its evidence exists and its acceptance check passes. Report:
- last verified commit SHA and timestamp;
- completed / total weighted tasks per workstream;
- tests run and pass/fail status;
- blockers and unverified assumptions.

Do not average percentages from different workstreams unless a documented weighting model defines how they combine. Do not claim background progress between sessions.

## Deployment

GitHub Pages deployment is configured separately in `.github/workflows/pages.yml`. This quality workflow is a required practical preflight, but repository branch protection is an account-level setting and is not enabled by this file. Configure a required status check in GitHub branch protection if direct pushes must also be prevented.
