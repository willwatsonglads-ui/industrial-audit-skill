# Standards crosswalk

This file maps the classes in the seven industrial companion files to standards identifiers that a reader can look up. A finding may cite them in its optional `references` list, each entry made of a `framework` key from `report-schema.json` and an `id` written exactly as it appears here, for example `{"framework": "IEC-62443-3-3", "id": "SR 2.1"}` or `{"framework": "21-CFR-11", "id": "11.10(e)"}`. This list is the allowed set: cite nothing that is not listed here, and add an identifier only after checking it against the public source named under Sources. The identifiers point readers to related requirements. A finding that cites one is not a conformance assessment, and the audit never claims that a system complies with any standard or regulation.

## Sources

Verification states: VERIFIED means the identifier was read in the primary text or on the publisher's page. VERIFIED-2ND means it was confirmed only through secondary sources because the primary text is paywalled or could not be opened. All checks were made on 2026-11-09.

| Framework key | Full title and edition or date | Publisher | Public URL | Verification | Note |
|---|---|---|---|---|---|
| IEC-62443-3-2 | ANSI/ISA-62443-3-2-2020, Security for industrial automation and control systems, Part 3-2: Security risk assessment for system design | ISA | https://www.isa.org/standards-and-publications/isa-standards/isa-iec-62443-series-of-standards | VERIFIED (part title and edition) | Identifier only; text not reproduced. Cited at document level only |
| IEC-62443-3-3 | ISA-62443-3-3-2013, Part 3-3: System security requirements and security levels | ISA | same as above | Part title VERIFIED; SR numbers and titles VERIFIED-2ND | Identifier and short title only; text not reproduced |
| IEC-62443-4-1 | ANSI/ISA-62443-4-1-2018, Part 4-1: Secure product development lifecycle requirements | ISA | same as above | Part title VERIFIED; practice prefixes VERIFIED-2ND | Cite the practice prefix only (for example `SUM`) |
| IEC-62443-4-2 | ANSI/ISA-62443-4-2-2018, Part 4-2: Technical security requirements for IACS components | ISA | same as above | Part title VERIFIED; CR numbering scheme VERIFIED-2ND | Only `CR 1.1` has a confirmed title; no other CR is listed |
| NIST-SP-800-82r3 | NIST SP 800-82 Rev. 3, Guide to Operational Technology (OT) Security, September 2023 | NIST | https://csrc.nist.gov/pubs/sp/800/82/r3/final | VERIFIED (PDF read) | Section numbers from the PDF. A Rev. 4 initial public draft is open for comment until 30 November 2026; cite Rev. 3 |
| MITRE-ATTACK-ICS | MITRE ATT&CK for ICS, techniques matrix (current release, checked 2026-11-09) | The MITRE Corporation | https://attack.mitre.org/techniques/ics/ | VERIFIED (technique list and technique pages) | Several techniques were renamed or moved to new IDs; see Identifier notes. Attribution under Notices |
| 21-CFR-11 | 21 CFR Part 11, eCFR text current as of 2026-11-01 | U.S. Food and Drug Administration (text via eCFR) | https://www.ecfr.gov/current/title-21/chapter-I/subchapter-A/part-11 | VERIFIED (eCFR text) | Free text; cite by section and paragraph |
| EU-GMP-Annex-11 | EudraLex Volume 4, Annex 11: Computerised Systems (2011 text, in operation from 30 June 2011) | European Commission | https://health.ec.europa.eu/system/files/2016-11/annex11_01-2011_en_0.pdf | VERIFIED (PDF read) | Cite 2011 clause numbers only. A revision is in draft; see Identifier notes |
| ALCOA+ | MHRA, 'GXP' Data Integrity Guidance and Definitions, Revision 1, March 2018 | UK Medicines and Healthcare products Regulatory Agency | https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/687246/MHRA_GxP_data_integrity_guide_March_edited_Final.pdf | VERIFIED (PDF read) | Names the "+" attributes: complete, consistent, enduring and available |
| ALCOA+ | PIC/S PI 041-1, Good Practices for Data Management and Integrity in Regulated GMP/GDP Environments, 1 July 2021 | PIC/S | https://picscheme.org/docview/4234 | VERIFIED (PDF read) | Uses ALCOA and ALCOA+ |
| ALCOA+ | WHO Technical Report Series No. 1033, Annex 4, Guideline on data integrity, 2021 | World Health Organization | https://www.who.int/publications/m/item/annex-4-trs-1033 | VERIFIED (document text read) | Refers to the attributes as "ALCOA+"; replaces TRS 996 Annex 5 |
| ALCOA+ | Data Integrity and Compliance With Drug CGMP: Questions and Answers, Guidance for Industry, December 2018 | U.S. Food and Drug Administration | https://www.fda.gov/media/119267/download | VERIFIED (PDF read) | Defines the five ALCOA attributes only, without the "+" |
| ISA-18.2 | ANSI/ISA-18.2-2016, Management of Alarm Systems for the Process Industries; with technical reports ISA-TR18.2.1 to ISA-TR18.2.7 | ISA | https://webstore.ansi.org/Standards/ISA/ANSIISA182016 ; technical reports listed at https://www.isa.org/intech-home/2019/january-february/features/applying-alarm-management | VERIFIED-2ND (title, year, report titles and concepts from store listings and published summaries) | Identifier and short paraphrased title only; text not reproduced |
| ISA-101 | ANSI/ISA-101.01-2015, Human Machine Interfaces for Process Automation Systems | ISA | https://www.isa.org/products/isa-101-01-2015-human-machine-interfaces-for | VERIFIED (title and year, publisher page) | Cited at document level only; no clause or concept checked |
| OWASP-LLM | OWASP Top 10 for LLM Applications 2025 | OWASP | https://genai.owasp.org/llm-top-10/ | VERIFIED (publisher page) | IDs and names as listed |
| OWASP-Agentic | OWASP Top 10 for Agentic Applications for 2026, published 9 December 2025 | OWASP | https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/ | Title and date VERIFIED; IDs and names VERIFIED-2ND | ASI02 and ASI06 wording unconfirmed; see Identifier notes |
| CISA-AI-OT | Principles for the Secure Integration of Artificial Intelligence in Operational Technology, 3 December 2025 | CISA and the Australian Signals Directorate's ACSC, with partner agencies | https://www.cisa.gov/resources-tools/resources/principles-secure-integration-artificial-intelligence-operational-technology | VERIFIED (PDF read) | Cite principle or section numbers. PDF: https://www.cisa.gov/sites/default/files/2026-01/joint-guidance-principles-for-the-secure-integration-of-artificial-intelligence-in-operational-technology-508cV2.pdf |
| NIST-AI-RMF | NIST AI 100-1, Artificial Intelligence Risk Management Framework (AI RMF 1.0), January 2023 | NIST | https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf | VERIFIED (PDF read) | Subcategory IDs from the Core tables |
| NIST-AI-RMF | NIST AI 600-1, Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile, July 2024 | NIST | https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf | VERIFIED (PDF read) | Cite as `AI 600-1 <risk name>` |
| EU-AI-Act | Regulation (EU) 2024/1689 (Artificial Intelligence Act), as amended by Regulation (EU) 2026/1744 | European Union (Official Journal) | https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng | VERIFIED-2ND (article text read on a public copy of the Official Journal text; EUR-Lex could not be opened at check time) | Confirm wording on EUR-Lex. Status notes under Identifier notes |
| OPC-UA | OPC Unified Architecture specification, version 1.05, online reference | OPC Foundation | https://reference.opcfoundation.org/Core/Part4/v105/docs/7.38.1 (pattern: `/Core/Part<N>/v105/docs/<section>`) | VERIFIED (sections read) | Cite as `Part <N> <section>` |
| Sparkplug-B | Eclipse Sparkplug Specification, version 3.0.0, chapter 5 (Operational Behavior) | Eclipse Foundation | https://sparkplug.eclipse.org/specification/version/3.0/ ; chapter source https://github.com/eclipse-sparkplug/sparkplug/blob/master/specification/src/main/asciidoc/chapters/Sparkplug_5_Operational_Behavior.adoc | VERIFIED (chapter source read; IDs rechecked against it) | Cite the requirement's TCK ID in full |
| MQTT-5 | MQTT Version 5.0, OASIS Standard | OASIS | https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html | VERIFIED (sections read) | Cite by section or table number |
| (none) | Computer Software Assurance for Production and Quality Management System Software, issued 3 February 2026 (supersedes the 24 September 2025 version) | U.S. Food and Drug Administration | https://www.fda.gov/media/188844/download | VERIFIED (PDF read) | Background only. The schema has no key for it, so findings cannot cite it |
| (none) | IEC 62682:2022 (edition 2.0), Management of alarm systems for the process industries | IEC | https://webstore.iec.ch/publication/65543 | VERIFIED (title, edition, year) | Background only; no key. Equivalence with ISA-18.2-2016 not confirmed |
| (none) | EEMUA Publication 191, Edition 4 (November 2024), Alarm systems: a guide to design, management and procurement | EEMUA | https://eemua.org/products/publications/print/eemua-publication-191 | VERIFIED (edition and year) | Background only; no key. Identifier only; text not reproduced |

## Crosswalk

Each cell lists `FRAMEWORK id` pairs. "—" means no verified identifier maps soundly to the class.

### OT-BOUNDARY-AND-CONTROL-WRITES.md

| Class | Identifiers |
|---|---|
| Read-only claim and latent write-path gaps | `IEC-62443-3-3 SR 7.7`, `MITRE-ATTACK-ICS T0836`, `MITRE-ATTACK-ICS T1692.001` |
| Indirect write-down through an intermediate system | `IEC-62443-3-3 SR 2.1`, `MITRE-ATTACK-ICS T0836` |
| Recipe, program, and configuration download exposure | `IEC-62443-3-3 SR 2.1`, `IEC-62443-3-3 SR 3.4`, `MITRE-ATTACK-ICS T0843`, `MITRE-ATTACK-ICS T0889`, `MITRE-ATTACK-ICS T1693` |
| Mode-change and command-method exposure | `IEC-62443-3-3 SR 2.1`, `OPC-UA Part 3 5.7.1`, `MITRE-ATTACK-ICS T1692.001`, `MITRE-ATTACK-ICS T0831` |
| Control-write approval binding to tag, value, unit, and target | `IEC-62443-3-3 SR 2.1`, `MITRE-ATTACK-ICS T0836` |
| Approved-write staleness, expiry, and replay | `IEC-62443-3-3 SR 2.1`, `MITRE-ATTACK-ICS T1692.001` |
| Writable-point allowlist matching and ownership gaps | `IEC-62443-3-3 SR 2.1`, `OPC-UA Part 3 5.6.2`, `MITRE-ATTACK-ICS T0836` |
| Write-enable switch default and disable propagation | `IEC-62443-3-3 SR 7.6`, `IEC-62443-3-3 SR 7.7` |
| Outbound-only claim and inbound command channel gaps | `IEC-62443-3-2 ANSI/ISA-62443-3-2-2020`, `IEC-62443-3-3 SR 5.1`, `IEC-62443-3-3 SR 5.2`, `NIST-SP-800-82r3 5.2.3.1`, `NIST-SP-800-82r3 E.1.2` |
| DMZ brokering and pass-through relay gaps | `IEC-62443-3-2 ANSI/ISA-62443-3-2-2020`, `IEC-62443-3-3 SR 5.2`, `NIST-SP-800-82r3 5.2.3.1`, `NIST-SP-800-82r3 5.4.1` |
| Store-and-forward and replication direction reversal | `IEC-62443-3-3 SR 5.2`, `NIST-SP-800-82r3 E.1.2` |
| Remote-access reach beyond the named control-zone asset | `IEC-62443-3-3 SR 1.13`, `IEC-62443-3-3 SR 2.1`, `NIST-SP-800-82r3 6.2.10`, `NIST-SP-800-82r3 E.3.6`, `MITRE-ATTACK-ICS T0822`, `MITRE-ATTACK-ICS T0886` |
| Engineering project and controller-artifact trust | `IEC-62443-3-3 SR 3.4`, `IEC-62443-3-3 SR 4.1`, `MITRE-ATTACK-ICS T0889`, `MITRE-ATTACK-ICS T0882` |
| Bypass, maintenance, and simulation mode leakage | `IEC-62443-3-3 SR 2.1`, `IEC-62443-3-3 SR 7.6` |
| Safety instrumented system adjacency | — |

### INDUSTRIAL-PROTOCOLS-AND-DEVICES.md

| Class | Identifiers |
|---|---|
| OPC UA security mode and policy downgrade | `OPC-UA Part 2 4.8`, `OPC-UA Part 4 7.20`, `IEC-62443-3-3 SR 3.1`, `IEC-62443-3-3 SR 4.1`, `MITRE-ATTACK-ICS T0830` |
| OPC UA certificate trust and identity binding gaps | `OPC-UA Part 2 4.10`, `IEC-62443-3-3 SR 1.2`, `MITRE-ATTACK-ICS T0830` |
| OPC UA user token and session identity weakness | `OPC-UA Part 4 7.42`, `OPC-UA Part 2 4.9`, `IEC-62443-3-3 SR 1.1`, `IEC-62443-4-2 CR 1.1`, `MITRE-ATTACK-ICS T0859` |
| Discovery, endpoint, and reverse-connect trust confusion | `OPC-UA Part 2 4.10`, `IEC-62443-3-3 SR 1.2`, `MITRE-ATTACK-ICS T0830` |
| Write and method authority checked against the wrong identity | `OPC-UA Part 3 5.6.2`, `OPC-UA Part 3 5.7.1`, `OPC-UA Part 18 4.1`, `IEC-62443-3-3 SR 2.1` |
| Hosted address-space and method overexposure | `OPC-UA Part 3 5.7.1`, `OPC-UA Part 2 4.11`, `OPC-UA Part 18 4.1`, `IEC-62443-3-3 SR 2.1`, `IEC-62443-3-3 SR 7.7` |
| Unauthenticated fieldbus write reachability | `IEC-62443-3-3 SR 2.1`, `MITRE-ATTACK-ICS T0836`, `MITRE-ATTACK-ICS T1692.001`, `MITRE-ATTACK-ICS T0848` |
| Protocol gateway identity and authorization loss | `IEC-62443-3-3 SR 2.1` |
| Sparkplug command and rebirth reachability | `Sparkplug-B tck-id-operational-behavior-data-commands-rebirth-name`, `Sparkplug-B tck-id-operational-behavior-data-commands-ncmd-rebirth-verb`, `Sparkplug-B tck-id-operational-behavior-data-commands-rebirth-action-1`, `Sparkplug-B tck-id-operational-behavior-host-reordering-rebirth`, `IEC-62443-3-3 SR 2.1`, `MITRE-ATTACK-ICS T1692.001` |
| Sparkplug edge identity, birth, and death spoofing | `Sparkplug-B tck-id-message-flow-edge-node-birth-publish-will-message`, `Sparkplug-B tck-id-message-flow-edge-node-birth-publish-will-message-payload-bdSeq`, `Sparkplug-B tck-id-message-flow-edge-node-birth-publish-nbirth-payload-bdSeq`, `IEC-62443-3-3 SR 1.2`, `MITRE-ATTACK-ICS T1692.002` |
| Primary host STATE spoofing | `Sparkplug-B tck-id-operational-behavior-host-application-connect-will-topic`, `Sparkplug-B tck-id-operational-behavior-host-application-host-id`, `Sparkplug-B tck-id-operational-behavior-primary-application-state-with-multiple-servers-state-subs`, `Sparkplug-B tck-id-message-flow-edge-node-birth-publish-phid-wait`, `Sparkplug-B tck-id-message-flow-edge-node-birth-publish-phid-wait-timestamp`, `MITRE-ATTACK-ICS T1692.002` |
| Retained-message and wildcard subscription trust | `MQTT-5 3.3.1.3`, `MQTT-5 3.8.3.1`, `Sparkplug-B tck-id-message-flow-edge-node-birth-publish-nbirth-retained` |
| Broker authorization denial read as success or silence | `MQTT-5 3.9.3`, `MQTT-5 2.4`, `IEC-62443-3-3 SR 3.7` |
| Historian write, replace, and backfill exposure through a read surface | `IEC-62443-3-3 SR 2.1`, `IEC-62443-3-3 SR 3.4` |
| Device and gateway administration surface exposure | `IEC-62443-3-3 SR 2.1`, `IEC-62443-3-3 SR 7.6`, `MITRE-ATTACK-ICS T0886` |
| Hostile server and device response trust | `IEC-62443-3-3 SR 3.5`, `OWASP-LLM LLM01:2025` |

### PROCESS-DATA-INTEGRITY.md

| Class | Identifiers |
|---|---|
| Quality-code loss and misclassification | `OPC-UA Part 4 7.38.1`, `OPC-UA Part 4 7.11.1`, `OPC-UA Part 4 7.11.5`, `OPC-UA Part 8 7.3.2` |
| Stale value and liveness misrepresentation | `OPC-UA Part 4 7.38.2`, `OPC-UA Part 8 7.3.2`, `OPC-UA Part 4 5.11.2`, `Sparkplug-B tck-id-operational-behavior-edge-node-termination-host-action-ndeath-node-tags-stale`, `MQTT-5 3.8.3.1` |
| Timestamp source and clock-skew confusion | `OPC-UA Part 4 7.11.3`, `OPC-UA Part 4 7.11.4`, `OPC-UA Part 4 7.39`, `NIST-SP-800-82r3 6.2.12` |
| Time-zone, daylight-saving, and epoch-unit errors | `OPC-UA Part 6 5.2.2.5`, `OPC-UA Part 4 7.11.3`, `Sparkplug-B tck-id-operational-behavior-host-application-connect-will-payload` |
| Engineering-unit loss and double conversion | `OPC-UA Part 8 5.6.4`, `ALCOA+ Accurate` |
| Raw-count scaling, range clamping, and storage precision loss | `OPC-UA Part 8 7.3.2`, `ALCOA+ Accurate` |
| Counter and totalizer reset and rollover errors | — |
| Interpolation across gaps and stepped signals | `OPC-UA Part 13 5.4.3`, `OPC-UA Part 11 6.5.3` |
| Aggregate quality and weighting contamination | `OPC-UA Part 13 5.4.3` |
| Compression and deadband misreading | — |
| Gap filling, zero substitution, and silent row loss | `OPC-UA Part 4 7.38.1`, `OPC-UA Part 4 7.11.5`, `ALCOA+ Complete` |
| Late and corrected sample write-rule conflicts | `ALCOA+ Original`, `ALCOA+ Consistent` |
| Reconnect, replay, and history-into-live duplication | `MQTT-5 Table 3-2`, `MQTT-5 3.3.1.1`, `Sparkplug-B tck-id-operational-behavior-data-publish-nbirth-order` |
| Tag identity drift and name reuse | — |
| Lab sample, result, and entry time confusion | `ALCOA+ Contemporaneous`, `ALCOA+ Accurate` |
| Censored, text, and specification-limit coercion | `EU-GMP-Annex-11 5`, `ALCOA+ Accurate`, `ALCOA+ Original` |

### RECORDS-AUDIT-AND-SIGNATURES.md

| Class | Identifiers |
|---|---|
| Audit-entry content gaps | `21-CFR-11 11.10(e)`, `EU-GMP-Annex-11 9`, `EU-GMP-Annex-11 12.4`, `ALCOA+ Attributable`, `ALCOA+ Complete`, `IEC-62443-3-3 SR 2.8` |
| Unaudited write paths | `21-CFR-11 11.10(e)`, `EU-GMP-Annex-11 9`, `IEC-62443-3-3 SR 2.8` |
| Audit entry outside the change transaction | `21-CFR-11 11.10(e)`, `ALCOA+ Complete`, `IEC-62443-3-3 SR 2.10` |
| Skippable or defaulted reason for change | `EU-GMP-Annex-11 9` |
| Audit-trail mutability by the recorded role | `21-CFR-11 11.10(e)`, `EU-GMP-Annex-11 9`, `IEC-62443-3-3 SR 3.9` |
| Hash-chain re-chain, truncation, and unrun verification | `21-CFR-11 11.10(a)`, `IEC-62443-3-3 SR 3.4`, `IEC-62443-3-3 SR 3.9` |
| Audit-entry clock and time-zone gaps | `21-CFR-11 11.10(e)`, `EU-GMP-Annex-11 12.4`, `ALCOA+ Contemporaneous`, `IEC-62443-3-3 SR 2.11`, `NIST-SP-800-82r3 6.2.12` |
| Shared-account and proxy-identity attribution loss | `21-CFR-11 11.100`, `21-CFR-11 11.300`, `EU-GMP-Annex-11 12.4`, `ALCOA+ Attributable`, `IEC-62443-3-3 SR 1.1`, `IEC-62443-3-3 SR 2.12` |
| Signature manifestation gaps | `21-CFR-11 11.50`, `EU-GMP-Annex-11 14` |
| Signature-to-record-version binding gaps | `21-CFR-11 11.70`, `EU-GMP-Annex-11 14` |
| Signature replay and re-authentication gaps | `21-CFR-11 11.200`, `21-CFR-11 11.100`, `21-CFR-11 11.300` |
| Release sequencing and separation-of-duties bypass | `21-CFR-11 11.10(f)`, `21-CFR-11 11.10(g)`, `EU-GMP-Annex-11 15`, `IEC-62443-3-3 SR 2.1` |
| Correction and deletion that obscure prior values | `21-CFR-11 11.10(e)`, `EU-GMP-Annex-11 9`, `ALCOA+ Original` |
| Record-life retention shortfall | `21-CFR-11 11.10(c)`, `21-CFR-11 11.10(e)`, `EU-GMP-Annex-11 17`, `ALCOA+ Enduring`, `ALCOA+ Available` |
| Restore and archive trail loss | `21-CFR-11 11.10(c)`, `EU-GMP-Annex-11 7`, `EU-GMP-Annex-11 17`, `ALCOA+ Enduring` |
| True-copy, export, and dynamic-record fidelity gaps | `21-CFR-11 11.10(b)`, `EU-GMP-Annex-11 8`, `ALCOA+ Original`, `ALCOA+ Complete` |

### ALARMS-HMI-AND-DISPLAY.md

| Class | Identifiers |
|---|---|
| Quality and status rendering loss | `OPC-UA Part 4 7.38.1`, `Sparkplug-B tck-id-operational-behavior-edge-node-termination-host-action-ndeath-node-tags-stale`, `ISA-101 ANSI/ISA-101.01-2015` |
| Last-known value presented as live | `OPC-UA Part 4 7.38.2`, `OPC-UA Part 8 7.3.2`, `Sparkplug-B tck-id-operational-behavior-edge-node-termination-host-action-ndeath-node-tags-stale`, `ISA-101 ANSI/ISA-101.01-2015` |
| Loading, error, and empty states rendered as normal | — |
| Modeled values styled as measurements | `OPC-UA Part 8 7.3.2`, `ISA-101 ANSI/ISA-101.01-2015` |
| Units, time zone, and sample-time omission | `OPC-UA Part 8 5.6.4`, `OPC-UA Part 4 7.11.3`, `ISA-101 ANSI/ISA-101.01-2015` |
| Rounding, truncation, and sign distortion | — |
| Trend scaling, gap, and downsampling distortion | `OPC-UA Part 13 5.4.3` |
| Mixed time-base trend alignment | `OPC-UA Part 4 7.11.3`, `OPC-UA Part 4 7.11.4` |
| Shelving, suppression, and out-of-service authorization gaps | `ISA-18.2 Shelved`, `ISA-18.2 Suppressed by design`, `ISA-18.2 Out of service`, `IEC-62443-3-3 SR 2.1`, `IEC-62443-3-3 SR 2.8`, `MITRE-ATTACK-ICS T0878` |
| Acknowledgement scope and source confusion | `ISA-18.2 ANSI/ISA-18.2-2016`, `IEC-62443-3-3 SR 2.1` |
| Flood and chatter masking of distinct alarms | `ISA-18.2 Monitoring and assessment`, `ISA-18.2 ISA-TR18.2.5` |
| Alarm and notification deduplication collapse | — |
| Self-silencing monitoring and health indicators | `IEC-62443-3-3 SR 6.2` |
| Silent notification delivery failure | — |
| Notification and lock-screen content disclosure | `IEC-62443-3-3 SR 4.1` |
| Dashboard and report cache age concealment | `OPC-UA Part 4 5.11.2`, `OPC-UA Part 4 7.11.4` |

### AI-IN-PLANT-OPERATIONS.md

| Class | Identifiers |
|---|---|
| AI recommendation-to-action bypass | `CISA-AI-OT 2.4`, `CISA-AI-OT 4.1`, `OWASP-LLM LLM06:2025`, `OWASP-Agentic ASI02`, `NIST-AI-RMF MAP 3.5`, `EU-AI-Act Art. 14` |
| Approval not re-checked against current process state | `CISA-AI-OT 4.1`, `NIST-AI-RMF MAP 3.5` |
| Approval card built from model narrative | `OWASP-Agentic ASI09`, `EU-AI-Act Art. 14(4)(c)` |
| Indirect plant write reach through connected systems | `CISA-AI-OT 2.4`, `OWASP-LLM LLM06:2025`, `OWASP-Agentic ASI02` |
| Generated plant logic and configuration promotion | `CISA-AI-OT 4.1`, `OWASP-LLM LLM05:2025`, `MITRE-ATTACK-ICS T0889` |
| Fabricated tag, value, and citation acceptance | `CISA-AI-OT 1.1`, `OWASP-LLM LLM09:2025`, `NIST-AI-RMF AI 600-1 Confabulation` |
| Grounding context stripped of quality, time, or unit | `CISA-AI-OT 2.2`, `OPC-UA Part 4 7.38.1` |
| Model unit and time-zone confusion | `OWASP-LLM LLM05:2025`, `OPC-UA Part 8 5.6.4` |
| Cross-site tag and asset resolution in grounding | `OWASP-LLM LLM08:2025` |
| AI provenance gaps in plant records | `CISA-AI-OT 4.1`, `EU-AI-Act Art. 12`, `21-CFR-11 11.10(e)`, `ALCOA+ Attributable` |
| Model, prompt, and tool change outside change control | `CISA-AI-OT 3.1`, `NIST-AI-RMF MANAGE 4.1`, `EU-GMP-Annex-11 10` |
| Unfounded confidence and measurement-styled inference | `OWASP-LLM LLM09:2025`, `NIST-AI-RMF MEASURE 2.5`, `EU-AI-Act Art. 13` |
| Silent fallback when the model is unavailable | `CISA-AI-OT 2.4`, `CISA-AI-OT 4.2`, `NIST-AI-RMF MEASURE 2.6`, `EU-AI-Act Art. 15(4)` |
| OT data pull and egress beyond the stated boundary | `CISA-AI-OT 2.2`, `CISA-AI-OT 2.4`, `CISA-AI-OT 4.1`, `OWASP-LLM LLM02:2025`, `IEC-62443-3-3 SR 5.2` |
| Cross-site learning-set and embedding leakage | `CISA-AI-OT 2.3`, `OWASP-LLM LLM02:2025`, `OWASP-LLM LLM08:2025` |
| Model output in safety-function paths | `CISA-AI-OT 1.1`, `CISA-AI-OT 4.2`, `EU-AI-Act Art. 6(1)` |

### GOVERNANCE-CONFIGURATION-AND-CHANGE.md

| Class | Identifiers |
|---|---|
| Out-of-band configuration change paths | `IEC-62443-3-3 SR 7.6`, `IEC-62443-3-3 SR 2.8`, `EU-GMP-Annex-11 10` |
| Management-of-change gate enforcement gaps | `EU-GMP-Annex-11 10`, `21-CFR-11 11.10(f)` |
| Site template and mapping copy drift | — |
| Test and simulation settings in production builds | `IEC-62443-3-3 SR 7.7` |
| Change self-approval and role-combination gaps | `IEC-62443-3-3 SR 2.1`, `21-CFR-11 11.10(g)` |
| Delegated and impersonated authority carryover | `IEC-62443-3-3 SR 2.1`, `IEC-62443-3-3 SR 2.12`, `21-CFR-11 11.100` |
| Shared, service, and break-glass account lifecycle gaps | `IEC-62443-3-3 SR 1.3`, `IEC-62443-3-3 SR 1.5`, `MITRE-ATTACK-ICS T0859` |
| Remote-support and vendor access lifecycle gaps | `IEC-62443-3-3 SR 1.13`, `IEC-62443-3-3 SR 2.6`, `NIST-SP-800-82r3 6.2.10`, `MITRE-ATTACK-ICS T0822`, `MITRE-ATTACK-ICS T0886` |
| Site identifier trust in multi-site deployments | `IEC-62443-3-3 SR 1.2`, `IEC-62443-3-3 SR 2.1` |
| Asset inventory and SBOM claim gaps | `IEC-62443-3-3 SR 7.8` |
| Offline and air-gapped update acceptance gaps | `IEC-62443-4-1 SUM`, `IEC-62443-3-3 SR 3.4`, `MITRE-ATTACK-ICS T0862` |
| Configuration backup and restore resurrection | `IEC-62443-3-3 SR 7.3`, `IEC-62443-3-3 SR 7.4` |
| License, certificate, and subscription expiry that stops data silently | — |
| Default and fleet-shared credentials | `MITRE-ATTACK-ICS T1694.001`, `MITRE-ATTACK-ICS T1694.002`, `IEC-62443-3-3 SR 1.5` |
| Plain-text secrets on shared plant workstations | `IEC-62443-3-3 SR 1.5`, `IEC-62443-3-3 SR 4.1` |
| Security-event emission and forwarding loss | `IEC-62443-3-3 SR 2.8`, `IEC-62443-3-3 SR 2.10`, `IEC-62443-3-3 SR 6.2`, `NIST-SP-800-82r3 6.2.6.1`, `NIST-SP-800-82r3 5.2.3.2` |

## Identifier notes

**ISA/IEC 62443.** The framework keys name parts of the ISA/IEC 62443 series; the editions checked are the ISA ones in Sources. SR numbers and titles for 62443-3-3 were confirmed only through secondary sources that agree with each other, and the capitalization of the FR3 to FR7 titles is editorial. Check them against the standard before relying on them. Short titles of the SRs cited: SR 1.1 human user identification and authentication; SR 1.2 software process and device identification and authentication; SR 1.3 account management; SR 1.5 authenticator management; SR 1.13 access via untrusted networks; SR 2.1 authorization enforcement; SR 2.6 remote session termination; SR 2.8 auditable events; SR 2.10 response to audit processing failures; SR 2.11 timestamps; SR 2.12 non-repudiation; SR 3.1 communication integrity; SR 3.4 software and information integrity; SR 3.5 input validation; SR 3.7 error handling; SR 3.9 protection of audit information; SR 4.1 information confidentiality; SR 5.1 network segmentation; SR 5.2 zone boundary protection; SR 6.2 continuous monitoring; SR 7.3 control system backup; SR 7.4 control system recovery and reconstitution; SR 7.6 network and security configuration settings; SR 7.7 least functionality; SR 7.8 control system component inventory. For 62443-4-1, cite only the practice prefix; `SUM` is security update management. For 62443-4-2, only `CR 1.1` (human user identification and authentication) has a confirmed title. 62443-3-2 is cited by document identifier only.

**NIST SP 800-82r3.** Section numbers come from the PDF's headings; cited are 5.2.3.1 Network Architecture, 5.2.3.2 Centralized Logging, 5.4.1 DCS-based OT systems (DMZ guidance), 6.2.6.1 Logging, 6.2.10 Remote Access, 6.2.12 Time Synchronization, E.1.2 Unidirectional Gateways and E.3.6 Remote Access. The document does not place historians in the DMZ, and this file makes no such claim.

**MITRE ATT&CK for ICS.** Names of the techniques cited: T0822 External Remote Services; T0830 Adversary-in-the-Middle (formerly named Man in the Middle); T0831 Manipulation of Control; T0836 Modify Parameter; T0843 Program Download; T0848 Rogue Master; T0859 Valid Accounts; T0862 Supply Chain Compromise; T0878 Alarm Suppression; T0882 Theft of Operational Information; T0886 Remote Services; T0889 Modify Program; T1692.001 Unauthorized Message: Command Message; T1692.002 Unauthorized Message: Reporting Message; T1693 Modify Firmware; T1694.001 Insecure Credentials: Default Credentials; T1694.002 Insecure Credentials: Hardcoded Credentials. Unauthorized command messages and default credentials now sit under the sub-techniques above; their earlier standalone IDs were not confirmed and are not used. The T1692.002 page does not say that it replaces the earlier "Spoof Reporting Message" technique. ATT&CK has no technique for engineering-workstation compromise, so none is cited.

**21 CFR Part 11 and FDA guidance.** Identifiers are section and paragraph numbers of the eCFR text, such as `11.10(e)`, `11.50`, `11.70`, `11.100`, `11.200` and `11.300`. The current Computer Software Assurance guidance is the 3 February 2026 version, which supersedes the 24 September 2025 one. The schema has no key for it, so it is background only.

**EU GMP Annex 11.** Cite only the 2011 clause numbers: 5 Data, 7 Data Storage, 8 Printouts, 9 Audit Trails, 10 Change and Configuration Management, 12.4 recording operator identity with date and time, 14 Electronic Signature, 15 Batch release, 17 Archiving. A revised Annex 11 was put to public consultation from 7 July to 7 October 2025. Its draft numbers clauses differently (in the draft, Audit Trails is clause 12), and no final text had been found as of 2026-11-09. Do not cite draft clause numbers.

**ALCOA+.** IDs are attribute names: Attributable, Legible, Contemporaneous, Original, Accurate (the five ALCOA attributes in the FDA Q&A, where the third reads "contemporaneously recorded" and the fourth "original or a true copy"), and Complete, Consistent, Enduring, Available (the "+" attributes in the MHRA, PIC/S and WHO guidance). The attributes come from GxP data-integrity guidance and apply where the records are GxP records.

**ISA-18.2.** IDs name the standard, a technical report (ISA-TR18.2.5 is alarm system monitoring, assessment and audit) or a concept that public summaries of the standard describe: the shelved, suppressed-by-design and out-of-service alarm states, and the monitoring-and-assessment lifecycle stage. Those summaries describe the 2009 edition, and the standard's state transitions were not confirmed, so do not cite specific transitions. Alarm-rate and flood figures that published summaries attribute to the standard or to EEMUA 191 are not identifiers and are not cited.

**ISA-101.** Only the document identifier is confirmed. Display hierarchy levels, colour used only for abnormal states and data-quality display conventions are often attributed to it, but were not confirmed against the standard and are not cited. A citation of ANSI/ISA-101.01-2015 points to HMI design requirements in general. It does not confirm that the standard addresses the specific defect.

**OPC UA.** Section numbers follow version 1.05 of the online reference. Part 2 sections 4.10 (Application Authentication) and 4.11 (User Authorization) were confirmed from the Part 2 contents list only. The Part 11 section 6.5.3 (ReadRawModifiedDetails) content was served at a URL ending `6.4.3`. Security policies deprecated in Part 7 and the Part 12 trust-list rules were not confirmed on the primary pages and are not cited.

**Sparkplug B.** IDs are the specification's TCK requirement IDs, cited in full and rechecked against the chapter 5 source on 2026-11-09. The host application's retained Death flag is `tck-id-operational-behavior-host-application-death-retained`, not a `connect-` ID. Payload-chapter rules (per-metric timestamps, `is_historical`, alias definitions) were not read and are not cited.

**MQTT 5.0.** `Table 3-2` defines QoS 1 as at-least-once delivery; the body of section 4.3.2 was not read. MQTT 3.1.1 was not checked and is not cited.

**OWASP.** LLM Top 10 IDs carry the `:2025` suffix. Agentic IDs and the names cross-checked across secondary sources: ASI01 Agent Goal Hijack, ASI02 Tool Misuse and Exploitation, ASI03 Identity and Privilege Abuse, ASI04 Agentic Supply Chain Vulnerabilities, ASI05 Unexpected Code Execution (RCE), ASI06 Memory & Context Poisoning, ASI07 Insecure Inter-Agent Communication, ASI08 Cascading Failures, ASI09 Human-Agent Trust Exploitation, ASI10 Rogue Agents. The wording of ASI02 (also listed as "Tool Misuse") and ASI06 (also listed as "Memory & Context Injection") is unconfirmed; check the official document before quoting either name.

**CISA AI in OT principles.** IDs are the guidance's section numbers: 1.1 understanding AI's unique risks and potential impact to OT (its Table 2 covers reliability, hallucination and safety decisions), 2.2 managing OT data security risks for AI systems, 2.3 the role of OT vendors in AI integration, 2.4 challenges in AI-OT system integration, 3.1 governance mechanisms, 4.1 monitoring and oversight mechanisms, 4.2 safety and failsafe mechanisms. The document names Principle 4 inconsistently: its contents list and heading say "Embed Oversight and Failsafe Practices Into AI and AI-Enabled OT Systems", while its introduction and conclusion say "Embed Safety and Security Practices". Cite the section number.

**NIST AI RMF.** Subcategory IDs come from the AI 100-1 Core tables: MAP 3.5 human oversight processes, MEASURE 2.5 validity and reliability, MEASURE 2.6 safety and failing safely, MANAGE 4.1 post-deployment monitoring, including change management. AI 600-1 risks are cited by their exact names, for example `AI 600-1 Confabulation`. AI 100-1 has no GOVERN subcategory dedicated to data provenance; do not cite one.

**EU AI Act (status checked through secondary sources only).** Article text was read on a public copy of the Official Journal text, not on EUR-Lex. Articles cited: 6(1) high-risk classification of safety components of products under Annex I legislation, 12 record-keeping, 13 transparency to deployers, 14 human oversight, 14(4)(c) correct interpretation of output, 15(4) redundancy and fail-safe plans. Amendment: Regulation (EU) 2026/1744 of 8 July 2026 (the Digital Omnibus on AI) was published in the Official Journal on 24 July 2026 and entered into force on 27 July 2026. It moves the obligations for stand-alone Annex III high-risk systems from 2 August 2026 to 2 December 2027, and for Annex I product-embedded high-risk systems from 2 August 2027 to 2 August 2028; most Article 50 transparency duties still apply from 2 August 2026. Annex III point 2 covers safety components in critical digital infrastructure, road traffic, and the supply of water, gas, heating or electricity. It does not name chemical manufacturing, so plant AI is more likely to come into scope through Annex I as a safety component of a product under listed harmonisation legislation, such as pressure equipment or ATEX. As amended, the Machinery Regulation (EU) 2023/1230 is listed in Annex I Section B, and AI in machinery is largely exempted from direct classification. Whether a system is high-risk is a legal determination that this audit does not make. Confirm the current application dates on EUR-Lex before relying on them.

## Notices

This file reproduces MITRE ATT&CK for ICS technique IDs and names.

© 2026 The MITRE Corporation. This work is reproduced and distributed with the permission of The MITRE Corporation.

"The MITRE Corporation (MITRE) hereby grants you a non-exclusive, royalty-free license to use ATT&CK® for research, development, and commercial purposes." "Any copy you make for such purposes is authorized provided that you reproduce MITRE's copyright designation and this license in any such copy." Full terms: https://attack.mitre.org/resources/legal-and-branding/terms-of-use/
