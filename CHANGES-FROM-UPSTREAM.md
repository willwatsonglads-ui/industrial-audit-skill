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
- `validate-coverage-ledger.cjs`: no schema or ledger changes. Industrial companion classes use the existing `FILE.md#<class name>` references.
- Both validators run on Windows. Upstream refuses all input where Node lacks `O_NOFOLLOW` and `O_NONBLOCK`. The fork keeps that open path wherever the flags exist, and adds a Windows fallback in `openInputDescriptor`:
  - refuse device and namespace paths (`\\.\`, `\\?\`);
  - `lstat` the leaf, and refuse symlinks and anything that is not a regular file;
  - open read-only;
  - require the opened handle to have the same volume and file ID as the checked path, so a swap between the check and the open is refused.

  Other platforms without the flags still refuse all input. The test suites treat Windows as a safe-open platform and add a Windows test for symlink and device-path refusal. CI runs on Linux, Windows, and macOS.

## Prose
- `SKILL.md`:
  - new description and introduction covering the two finding kinds;
  - a "Plant systems" subsection under Universal execution safety: no connection to live plant systems; no writes, commands or rebirth requests beyond one dummy message to a shipped simulator; functional safety out of scope;
  - the core principle "Require a data path and a wrong result";
  - OT additions to the security severity anchors;
  - separate severity anchors for data-integrity records, with audit-trail defects rated high for a record the software claims to audit, medium under an uncommon condition, and never above deliberate tampering, which stays a `security` record;
  - three new anti-patterns;
  - the `quick` profile seeds one ledger unit per companion class group instead of one per class (defined in `RECONNAISSANCE.md`); `standard` and `deep` are unchanged;
  - anti-pattern 5 now treats a separation of requester and approver that the software states as the boundary, so self-approval that defeats it is not dismissed as same-principal authority.
- `RECONNAISSANCE.md`:
  - plant systems added to the no-contact list;
  - Agent 1a item 7, plant role, and item 8, the software's own placement and egress claims;
  - plant authority added to Agent 1b item 4; Agent 1b also maps how each request gets its permissions, the role model and stated separations, and every non-human execution identity (agents, MCP servers, automations, schedules) with its credential, run-time authority, reachable tools, owner and token lifetime;
  - plant surfaces and data-path tracing added to Agent 1c, including every write path toward plant systems; Agent 1c also treats each side-effecting agent tool and each run with no live user session as its own surface, lists outbound connections, connection-target features and shared credentials without resolving any host name, and lists every writer and copy path of each evidence record family;
  - Agent 1d item 8, the listeners and network defaults that shipped installers and configurations open;
  - architecture item 1 gains an authority map;
  - architecture item 9, plant placement, with egress claims, listeners, outbound destinations, caller-chosen targets and record writers, and a word cap of about 1,400 when it applies;
  - each record writer and copy path becomes a ledger surface, so jobs and migrations get coverage units;
  - in `quick`, a companion unit's attack-class reference is the group heading, with each applicable class of the group in `selected_companion_blocks`, each inapplicable one in `excluded_blocks`, and a check per selected class before the unit closes. The ledger validator is unchanged; it already accepts heading references.
- `ATTACK-CLASSES.md`:
  - seven industrial target entries in the companion-selection list, with the OT-boundary entry also selected by listeners, plant-host connections, placement or egress claims and server-side script engines, governance also selected for role administration, permission resolution, stored connection credentials and agents and automations acting under a stored or forwarded identity, and the AI entry also selecting the caller-chosen-target class when an agent tool can open a connection;
  - a rule to select only the class groups of a companion whose boundary reconnaissance found, and to record the rest in `excluded_blocks`;
  - three plant items under Obvious things, the first also asking whether authentication is off until enabled or requests are answered before first-run setup, the third for connection strings shown below administrator and for debug or host-network ports in shipped files;
  - three Access control questions: revocation reaching sessions, tokens, jobs and agent runs; every route, socket event and scheduler entry enforcing the software's own role matrix, with exemption lists and guest or malformed tokens; and read-only roles triggering outbound side effects. Plant hosts are named in the SSRF item;
  - the `confirmed` rule extended to data-integrity records.
- `HUNTING.md`:
  - the hunter method extended to data-integrity units, with record state and the audit trail in the invariant and imports, jobs, migrations and restores among the triggers;
  - plant systems added to the no-contact list;
  - `kind` and `data_path` added to the candidate contract;
  - write paths, regulated records and operating displays added to the priority order;
  - candidate gate rule 3: a same-principal action that defeats a separation of duties the software states is a boundary result.
- `VALIDATION-AND-REPORTING.md`:
  - verifier step 7 for data-integrity candidates;
  - the record contract for `kind`, `data_path`, `references` and `runtime`, with a `data_path` mapping for audit-trail and record defects;
  - demotion to `needs_validation` only for a decisive unknown fact; a deployment control that would only compensate for the software's own shipped behaviour is recorded as a condition;
  - `REPORT.md` split into security and data-integrity tables, with a standards column;
  - a rule against compliance claims.
- `AI-AND-LLM.md`: **Excessive agency and confused-deputy authority** also requires the dispatcher, not the tool list shown to the model, to enforce role and tool switches, and covers MCP servers and connectors that hold one shared credential.
- `DATA-ISOLATION-AND-LIFECYCLE.md`: **Stale authorization and derived copy use** gains checks for where each request gets its permissions and for streams authorized once at connect time.
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

  They hold 128 classes: 18 for the OT boundary, 17 for protocols, 18 for process data, 18 for records, 16 for alarms and displays, 21 for AI in plant operations and 20 for governance. Among them are agent and automation authority (grant ceilings, stored runs after the owner loses access, agent approval of its own proposals, agent reach into permission settings, AI disable switches and autonomy levels), permission resolution that fails open, audit-trail review and refused or partial actions, calculated-value and contract versioning, ingest checkpoints and store-and-forward spools, shipped listeners, undeclared egress and proxy routing, caller-chosen plant connection targets, connection secret readback and credential forwarding, model provider routing and residency, retention of prompts and derived stores, and in-product script and test-run engines. Every class is bounded to what the target software itself claims or to a demonstrated wrong result.

  Besides the sources listed in `STANDARDS.md`, the classes were also informed by the public documentation of industrial data and AI platforms and by published advisories in open-source industrial software. No vendor, product or advisory is named in the skill, and no vendor wording is reproduced.
- `STANDARDS.md`: a crosswalk from the industrial classes to standards identifiers, each checked against a public source. Paywalled standards are cited by identifier only.
- `scripts/check-skill.cjs`: structural checks for companion headings, selection-list links, the README file table, unique class names, and `FILE.md#Class` cross-references that must resolve to a class or heading.
- `.github/workflows/test.yml`: runs the validator tests and the structure check on Linux, Windows, and macOS.
- This file.
