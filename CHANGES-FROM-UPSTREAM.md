# Changes from upstream

Upstream: [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill), commit `c1c8a8c147` ("Clarify guidance and full audit modes", 2026-09-14). Upstream history is kept in this repository. Everything below was changed after that commit.

## Renamed
- `skills/security-audit/` → `skills/industrial-audit/`. The skill name is `industrial-audit`, and the default output directory is `~/industrial-audit-skill/<repo-name>/run-<N>`.

## Findings contract
- `report-schema.json`:
  - Every verdict now requires `kind`: `security` or `data_integrity`.
  - `confirmed` and `needs_validation` records gain an optional `data_path` (`source`, `transformations`, `destination`, `consumer`, `decision_affected`) and an optional `references` list (`framework`, `id`).
  - `conditions.kind` gains `process_state`, `network_zone`, `physical_access`, `engineering_mode` and `time_source`.
  - `needs_validation.validation_plan` gains an optional `runtime` hand-off (`family`, `description`).
  - There are still three `oneOf` branches, in the same order.
- `validate-findings.cjs`: one new semantic check. A `data_integrity` `confirmed` or `needs_validation` record requires `data_path`, and a `security` record must not have one. Nothing else changed: no new schema keywords, and the same input limits and safe-open behaviour.
- `validate-findings.test.cjs`: the existing fixtures carry `kind: "security"`. There are three new tests for the new fields, the kind/`data_path` pairing, and malformed values.
- `validate-coverage-ledger.cjs` and its tests: unchanged. Industrial companion classes use the existing `FILE.md#<class name>` references.

## Prose
- `SKILL.md`:
  - new description and introduction covering the two finding kinds;
  - a "Plant systems" subsection under Universal execution safety: no connection to live plant systems; no writes, commands or rebirth requests beyond one dummy message to a shipped simulator; functional safety out of scope;
  - the core principle "Require a data path and a wrong result";
  - OT additions to the security severity anchors;
  - separate severity anchors for data-integrity records;
  - three new anti-patterns.
- `RECONNAISSANCE.md`:
  - plant systems added to the no-contact list;
  - Agent 1a item 7, plant role;
  - plant authority added to Agent 1b item 4;
  - plant surfaces and data-path tracing added to Agent 1c, including every write path toward plant systems;
  - architecture item 9, plant placement, with a word cap of about 1,300 when it applies.
- `ATTACK-CLASSES.md`:
  - seven industrial target entries in the companion-selection list;
  - two plant items under Obvious things;
  - the `confirmed` rule extended to data-integrity records.
- `HUNTING.md`:
  - the hunter method extended to data-integrity units;
  - plant systems added to the no-contact list;
  - `kind` and `data_path` added to the candidate contract;
  - write paths, regulated records and operating displays added to the priority order.
- `VALIDATION-AND-REPORTING.md`:
  - verifier step 7 for data-integrity candidates;
  - the record contract for `kind`, `data_path`, `references` and `runtime`;
  - `REPORT.md` split into security and data-integrity tables, with a standards column;
  - a rule against compliance claims.
- `README.md`: rewritten for the fork, with credit to the upstream work.
- `LICENSE`: Cloudflare's notice kept; a copyright line added for the industrial additions.

## Added
- Seven companion files in the upstream companion template:
  - `OT-BOUNDARY-AND-CONTROL-WRITES.md`
  - `INDUSTRIAL-PROTOCOLS-AND-DEVICES.md`
  - `PROCESS-DATA-INTEGRITY.md`
  - `RECORDS-AUDIT-AND-SIGNATURES.md`
  - `ALARMS-HMI-AND-DISPLAY.md`
  - `AI-IN-PLANT-OPERATIONS.md`
  - `GOVERNANCE-CONFIGURATION-AND-CHANGE.md`
- `STANDARDS.md`: a crosswalk from the industrial classes to standards identifiers, each checked against a public source. Paywalled standards are cited by identifier only.
- `scripts/check-skill.cjs`: structural checks for companion headings, selection-list links, the README file table, and unique class names.
- `.github/workflows/test.yml`: runs the validator tests and the structure check on Linux.
- This file.
