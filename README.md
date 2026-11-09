# industrial-audit

A coding-agent skill that audits software deployed in manufacturing and process plants. It finds two kinds of defect:

- **Security**: a vulnerability that crosses a real trust boundary, such as a write that reaches a controller without the intended approval.
- **Data integrity**: a value, timestamp, unit, quality code, tag identity or record that reaches an operator, a record or an automated action differently from what the source produced, with no visible sign. Examples are a bad-quality sample stored as good, a stale value shown as live, or an audit entry that a restore drops.

It covers historians, SCADA and HMI software, MES, LIMS, batch and quality records, OPC UA and MQTT/Sparkplug integrations, fieldbus gateways, edge devices, operator displays and alarms, and AI models or agents that read plant data or act on it. Ordinary web, cloud, native and supply-chain code is covered too.

## Built on Cloudflare's security-audit skill

This is a fork of Cloudflare's [security-audit-skill](https://github.com/cloudflare/security-audit-skill) (MIT), forked at upstream commit `c1c8a8c`. Cloudflare's commit history is kept in this repository. The method is theirs: isolated hunters, adversarial verifiers that never check their own work, schema-validated records, and a coverage ledger that accumulates across runs. So is the bar: confirm only what source and bounded local evidence establish. Cloudflare describe how the skill grew into their vulnerability harness in [Build your own vulnerability harness](https://blog.cloudflare.com/build-your-own-vulnerability-harness).

The fork adds plant knowledge and keeps the bar. [CHANGES-FROM-UPSTREAM.md](CHANGES-FROM-UPSTREAM.md) lists every change. In short:

- **A second finding kind.** `data_integrity` records carry a `data_path` (source, transformations, destination, consumer, and the decision it informs) and use their own severity anchors, rated by the decision the wrong result reaches.
- **Seven industrial companion files**, covering OT boundaries and control writes; industrial protocols and devices; process-data integrity; records, audit trails and signatures; alarms, HMI and displays; AI in plant operations; and governance, configuration and change.
- **Plant safety rules.** No connection to any live plant system, even read-only. No writes or commands beyond a single dummy message to a shipped simulator. Functional safety is out of scope, and leads that touch safety instrumented systems go to the safety owner.
- **Standards crosswalk.** [STANDARDS.md](skills/industrial-audit/STANDARDS.md) maps the new classes to ISA/IEC 62443, NIST SP 800-82r3, MITRE ATT&CK for ICS, 21 CFR Part 11, EU GMP Annex 11, ALCOA+, ISA-18.2, ISA-101, the CISA AI-in-OT principles, the NIST AI RMF, the EU AI Act, and the OPC UA, Sparkplug and MQTT specifications. Findings may cite these identifiers. The audit never claims that a system is compliant.
- **Typed hand-offs.** A lead that needs a running system becomes `needs_validation`, with a `runtime` check family (role matrix, fault injection, protocol conformance, agent injection, configuration review, records review) for whoever runs live tests.

## What it does

The skill runs a structured audit in six phases:

1. **Reconnaissance** -- map architecture, trust boundaries, input surfaces, plant placement and data paths, prior evidence, and deterministic coverage in `architecture.md` and `coverage-ledger.json`.
2. **Coverage-led hunting** -- assign isolated hunters from ledger units, record their checks, and use coverage critics to find gaps.
3. **Candidate validation** -- give every unique candidate to a fresh verifier that tries to disprove it.
4. **Structured output** -- write `confirmed`, `needs_validation`, and `rejected` records to `findings.json` and validate them against `report-schema.json`.
5. **Independent record verification** -- fresh agents verify final source claims. Material replacements receive another independent verifier.
6. **Target-neutral reporting** -- derive `REPORT.md`, `FINDINGS-DETAIL.md`, and `NEEDS-VALIDATION.md` from the verified records and coverage ledger.

The parent runs `validate-coverage-ledger.cjs` after creating the ledger and after each later ledger update. It runs `validate-findings.cjs` in Phase 4 and again after every Phase 5 replacement.

The verdicts are distinct: `confirmed` has a complete source trace and bounded observed result, `needs_validation` has an exact unresolved fact and no severity, and `rejected` records a disproved candidate.

Multiple runs against the same repo are additive. The skill uses prior ledgers and findings to target gaps, revalidate changed source, and carry forward current-source evidence without treating stale or unresolved work as covered.

## Files

| File | Purpose |
|------|---------|
| `SKILL.md` | Setup, the two finding kinds, plant-system safety rules, core principles, severity anchors, workflow overview, and audit anti-patterns |
| `RECONNAISSANCE.md` | Phase 1 reconnaissance prompts, plant placement, and synthesis instructions |
| `HUNTING.md` | Phase 2 orchestration, hunting methodology, and validation rules |
| `ATTACK-CLASSES.md` | Core, wildcard, and obvious-things attack prompts, and the companion-selection list |
| `MEMORY-SAFETY-AND-BINARY.md` | Memory-safety, binary, and kernel hunting classes for native targets |
| `AI-AND-LLM.md` | Prompt-injection, agent/tool, and output-handling hunting classes for LLM-backed targets |
| `WEB-PROTOCOL-AND-AUTH.md` | HTTP request-framing, cache, and authentication-protocol hunting classes for HTTP-protocol and auth targets |
| `CLIENT-SIDE.md` | DOM-injection, messaging-trust, UI-redress, and prototype-pollution hunting classes for client-side/browser targets |
| `SUPPLY-CHAIN-AND-RELEASE.md` | Dependency, CI, release, signing, update, plugin, and extension hunting classes |
| `CLOUD-AND-DEPLOYMENT.md` | IAM, infrastructure-as-code, container, serverless, ingress, and runtime-configuration hunting classes |
| `PROTOCOLS-RPC-AND-MESSAGING.md` | RPC, serialization, queue, broker, webhook, and streaming-protocol hunting classes |
| `RESOURCE-EXHAUSTION-AND-AVAILABILITY.md` | Shared resource, quota, queue, worker, and operator-spend hunting classes |
| `DATA-ISOLATION-AND-LIFECYCLE.md` | Tenant isolation, cache, search, export, backup, migration, deletion, and restore hunting classes |
| `DESKTOP-MOBILE-AND-LOCAL-IPC.md` | Native app, deep-link, webview, exported-component, helper, daemon, and local-IPC hunting classes |
| `OT-BOUNDARY-AND-CONTROL-WRITES.md` | Write-down paths, approval binding, downloads, zone and conduit crossings, remote access, and bypass modes |
| `INDUSTRIAL-PROTOCOLS-AND-DEVICES.md` | OPC UA, MQTT and Sparkplug, fieldbus, historian-interface, gateway, and hostile-device hunting classes |
| `PROCESS-DATA-INTEGRITY.md` | Quality codes, staleness, timestamps and time zones, units, aggregation, gaps, late data, tag identity, and lab data |
| `RECORDS-AUDIT-AND-SIGNATURES.md` | Audit-trail completeness and tamper evidence, electronic signatures, retention, restore, and certified copies |
| `ALARMS-HMI-AND-DISPLAY.md` | Stale and bad-quality display, units and time on screen, trends, shelving and suppression, and notification failure |
| `AI-IN-PLANT-OPERATIONS.md` | AI recommendations reaching actions, grounding on plant data, fabricated tags, cross-site leakage, and model change control |
| `GOVERNANCE-CONFIGURATION-AND-CHANGE.md` | Change control, segregation of duties, shared and break-glass accounts, site isolation, updates, and configuration restore |
| `STANDARDS.md` | Crosswalk from the industrial classes to verified standards identifiers, with sources |
| `VALIDATION-AND-REPORTING.md` | Phases 3–6 candidate validation, structured output, record verification, and reporting |
| `report-schema.json` | JSON schema for all three `findings.json` verdicts and both finding kinds |
| `validate-findings.cjs` | Zero-dependency validator for `findings.json` in Phases 4 and 5 |
| `validate-findings.test.cjs` | Findings-validator tests and producer-compatible fixture checks |
| `validate-coverage-ledger.cjs` | Zero-dependency validator for `coverage-ledger.json` in Phases 1–5 |
| `validate-coverage-ledger.test.cjs` | Coverage-ledger validator tests |

## Installation

Install the skill with the [Skills CLI](https://skills.sh):

```bash
npx skills add https://github.com/willwatsonglads-ui/industrial-audit-skill \
  --skill industrial-audit
```

Use `--global` for a user-level installation:

```bash
npx skills add https://github.com/willwatsonglads-ui/industrial-audit-skill \
  --skill industrial-audit \
  --global
```

Run `npx skills --help` for agent-selection and non-interactive options.

## Usage

Start your coding agent in (or pointed at) the codebase you want to audit, then ask:

```
audit this historian connector for security and data-integrity issues
```

```
review the audit trail and e-signature code in ./records
```

```
do an industrial audit of this repo, quick profile, output to ~/audits/gateway
```

A direct codebase audit or pen-test request uses full audit mode. Questions and focused reviews ("is this OPC UA client configuration safe?") use guidance mode, unless you ask for report artifacts. In full audit mode, an unspecified output directory defaults to `~/industrial-audit-skill/<repo-name>/run-<N>`. The workflow writes inside the target repository only when you explicitly select a directory that version control ignores.

## Requirements

- A coding agent with a model that supports tool use and parallel sub-agents
- Node.js for the zero-dependency findings and coverage-ledger validators, on Linux, macOS, or Windows. On Windows, where Node has no no-follow open, the validators check the file without following links and then confirm that the opened file is the one they checked.
- An OS-enforced sandbox for target-controlled builds, tests, processes, browsers, emulators, fuzzers, and fixtures. It must disable external networking, use a sanitized allowlisted environment, enforce resource limits, and allow writes only to assigned scratch paths. Without these controls, the workflow keeps the lead as `needs_validation` instead of executing target code.
- No access to plant systems. The skill never needs it and refuses to use it.

## Design principles

- **Only confirm established boundary failures and wrong results.** Keep a source-grounded blocked lead as `needs_validation` with its exact unresolved fact.
- **Adversarial validation.** The agent that checks a finding is never the agent that found it.
- **Severity requires impact.** For security, likelihood × impact, not deviation from a checklist. For data integrity, the decision the wrong result reaches, never an imagined physical consequence.
- **Defense-in-depth gaps are not vulnerabilities.** If Layer A prevents the attack, the absence of Layer B is a hardening note.
- **A standard's recommendation is not a finding.** Standards identifiers point to related requirements. Findings rest on demonstrated results, and the audit makes no compliance claims.
- **Multiple runs improve coverage.** In Cloudflare's test runs, a single run found roughly half of the vulnerabilities that repeated runs found in total.

## Development

```bash
node --test skills/industrial-audit/*.test.cjs   # validator tests
node scripts/check-skill.cjs                     # companion template, links, README table, unique class names
```

## License

MIT -- see [LICENSE](LICENSE). The original work is copyright Cloudflare, Inc.; the industrial additions are copyright William Watson. MITRE ATT&CK® is a registered trademark of The MITRE Corporation; see the attribution notice in [STANDARDS.md](skills/industrial-audit/STANDARDS.md).
