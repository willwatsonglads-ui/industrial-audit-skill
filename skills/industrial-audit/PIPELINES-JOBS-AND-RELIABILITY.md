# Pipeline, Scheduled Job, and Runtime Reliability Hunting

#### When to use this file

Reach for this file when the target moves or derives plant data on its own schedule or in the background: sync scripts and connectors that copy from a historian, lab, or business system into a store; file drop-folder importers; queue and stream consumers; scheduled reports, rollups, and KPI jobs; and any service whose correctness depends on what happens across a restart, a retry, an outage, a slow sink, or a clock change. The data path is source → read position → transform → durable write → derived tables and reports → consumer, and the question at each step is what a consumer sees after the step is interrupted, repeated, or skipped. The classes here produce `data_integrity` findings; no attacker is needed. Use `PROTOCOLS-RPC-AND-MESSAGING.md` and `RESOURCE-EXHAUSTION-AND-AVAILABILITY.md` when a lower-trust producer or caller can cause the duplicate, the reordering, or the stall, `PROCESS-DATA-INTEGRITY.md#Ingest checkpoint and store-and-forward spool loss` for a checkpoint or buffer that is itself lost or overflows, `PROCESS-DATA-INTEGRITY.md` for what happens to each sample's value, time, unit, and quality, `MODELS-BATCH-AND-SIMULATION.md` for the calculations these jobs run, and `ALARMS-HMI-AND-DISPLAY.md#Self-silencing monitoring and health indicators` for how health is shown.

Split large targets by job or pipeline, then by event: first run, normal run, retry, re-run, restart, and catch-up after downtime.

## Core discipline (include in every agent prompt for this domain)

```
- For every job and pipeline step, ask three questions: what does the consumer see if this step runs twice, if it never runs, and if it stops halfway? A wrong, missing, or doubled result with no marker is the defect.
- Completeness must be countable. Rows read must equal rows written plus rows rejected, and each period must be either covered or marked not covered. Look for the place where a count is never taken or a rejected row leaves only a log line.
- A log line is not a marker. The consumer of a report, table, or dashboard does not read logs; the gap, the rejection, or the provisional state has to be in the data or on the surface they use.
- No attacker is required. Name the ordinary event: a restart, a deploy, a retry, a manual re-run, an outage of the source or the sink, a run that takes longer than its interval, a full disk, a clock step, a daylight-saving change, a machine that was off overnight.
- Work from source and in-repo fixtures. Interrupt and repeat jobs against a scratch database in the sandbox; never run a job against a real source or sink.
- Use `confirmed` for a source-complete path plus a bounded local run that shows the wrong, missing, or doubled result. Use `needs_validation` for facts outside the repository: the scheduler's configuration in deployment, the database's durability settings, the host's clock discipline, and how often the triggering event really happens.
```

## Delivery and write completeness attack classes (subagent_type: `general`)

**Consumed-before-committed source acknowledgement**
A message is acknowledged, a file is moved to a processed folder, a queue row is deleted, or a task is marked done before the result it produced is durably written, or a database row and its outbound message are written by two separate calls, so a crash or a failed write between them loses data with no error. Find each acknowledgement, move, delete, and "done" flag and order it against the sink's commit; check that a first full load hands over to the live reader from the position captured before the load began, not from a fresh "now". The read cursor itself is `PROCESS-DATA-INTEGRITY.md#Ingest checkpoint and store-and-forward spool loss`. An acknowledgement inside the same transaction as the write, or after it with an idempotent write, is not a defect.

**Rerun, retry, and backfill duplication**
A retry, a manual re-run, a catch-up run, or a backfill appends rows that an earlier run already wrote, sends a notification again, or overwrites newer rows with older ones, because the write has no key, the key lacks a dimension such as site, unit, tag, or revision, or the job inserts instead of replacing its window. Compare each unique index with what identifies a record in the source, run the job twice on one window, and run a backfill over a window the live job is writing. Check side effects with several steps for a single try/except that repeats the completed ones. A job that replaces its window in one transaction, or upserts on the full natural key, is not a defect.

**Rejected and partially written record accounting**
Records that fail parsing, validation, or the write are skipped with a log line, or a batch write is accepted in part, and the run ends as a success with fewer rows than it read. Read every `continue`, `pass`, and coercion inside a row loop and every bulk write for a per-row or partial-success result that is never inspected. Check that rejected records are stored or counted, that the run compares rows read with rows written plus rows rejected, and that a shortfall fails or marks the run. A run that reports its rejected count where the consumer of its output can see it is not a defect.

**Partial file and local database durability gaps**
A file is written in place into a folder another process watches, renamed into place before its data reaches the disk, or copied across drives, so a reader picks up a truncated file; or a local database file is copied while open, kept on a network share, has its journal files removed, or runs with synchronous writes off, so committed rows vanish or a backup restores mixed state after a power loss. Check file writes for a temporary name, a flush to disk, and a rename on the same file system, and local databases for their journal and sync settings, a busy timeout, and write errors that are caught and dropped. What the deployed disk and file system guarantee is `needs_validation`. A lost write that surfaces as a failed run is not a defect.

**Truncated and failed reads treated as complete**
A read that returned only part of the data is processed as the whole: a paginated call stopped at its first page or at a row cap, a query hit a default limit, a time-out or connection error was turned into an empty list, or a "latest" lookup has no ordering. Check each read loop for a continuation token, total count, or ordering key, each client call for the cap it applies, and each exception handler for an empty result that the caller cannot tell from "no data". Compare the count a read returned with the count the source reports where the source offers one. A read that raises, or returns an explicit unavailable state distinct from empty, is not a defect.

## Scheduled work attack classes (subagent_type: `general`)

**Run window taken from the wall clock**
A scheduled job computes the period it covers from the time it happens to start, such as "yesterday" or "the last hour" relative to now, so a late start, a retry, a re-run, or a catch-up run covers a different period from the one it was scheduled for, leaving gaps and overlaps between consecutive runs. Find every current-time call inside report, rollup, and sync code that defines a window, and check whether the job receives its window start and end from the schedule and stores them with its output. Run the job late and twice in the sandbox with a pinned clock and compare the windows. A job whose window is passed in and recorded is not a defect.

**Missed, doubled, and overlapping scheduled runs**
A run that was due while the host was off, asleep, or redeploying is never made up, several missed runs fire at once, a run that outlasts its interval starts beside its successor, or a schedule in local time is skipped in the missing daylight-saving hour and runs twice in the repeated one. For each schedule, find what the scheduler is configured to do with missed runs, whether one run can cover several missed periods, what stops two copies running together, and the zone the schedule is evaluated in. Check that a period no run covered is visible as missing instead of absent. The scheduler's deployed configuration is `needs_validation` when the repository does not contain it. A documented skip that leaves a visible gap marker is not a defect.

**Period closed before its data is complete**
A report, rollup, or KPI for a period is computed while data for that period can still arrive, such as buffered samples after an outage, late lab results, or corrections, and is then stored, sent, or signed as final and never recomputed or marked. Check what tells the job that a period is complete, whether a late arrival into a closed period triggers a recompute or a visible revision, and whether a value computed early carries a provisional marker to every surface. Use `PROCESS-DATA-INTEGRITY.md#Late and corrected sample write-rule conflicts` for the write rules of the late sample itself. A figure labelled provisional, or one recomputed with a recorded revision, is not a defect.

## Concurrency attack classes (subagent_type: `general`)

**Duplicate active writers after restart or failover**
Two instances of the same collector, job, or service run together, after a restart that left the old process alive, a manual start beside the service, or a failover that did not fence the old node, and both write, so samples double, a "current" row flips between them, or a counter advances twice. Check what stops a second instance: a lock held for the life of the process and released by its death, a lease with an expiry, or nothing. Check lock files whose removal depends on a clean exit, and locks taken through pooled connections. A second instance that detects the first and exits, or writes that are idempotent on a full key, is not a defect.

**Lost update on concurrent edit**
Two writers read the same record, change it, and save, and the later save discards the earlier change with no conflict: two people editing one entry, a background job and a person, or a read-modify-write on a current-value or total row. Find updates whose new value is computed in code from an earlier read, with no version or timestamp condition, row lock, or atomic expression. When the lost change belongs to an audited record, also use `RECORDS-AUDIT-AND-SIGNATURES.md#Correction and deletion that obscure prior values`. An update that fails on a stale version and reports the conflict is not a defect.

## Failure reporting and runtime state attack classes (subagent_type: `general`)

**Failure converted to a default value**
An exception, error return, time-out, or missing key is turned into zero, an empty list, `None` that later becomes zero, the previous value, or a "normal" branch, so a failure travels on as data. Read every broad exception handler that returns a value, every error object a library returns instead of raising, every `get` with a numeric default on a required key, every `or 0` and null-coalescing default on a measurement, and every `else` branch that treats an unknown state as the normal one. Follow each default to where it is stored or shown. A handler that re-raises, or that returns a distinct failed state which every consumer checks, is not a defect.

**Schema and configuration drift read through defaults**
A renamed or removed field, a new enumeration value, a changed unit, or a missing required setting is absorbed by a default, so an upstream change or a configuration mistake produces plausible wrong output instead of an error: a renamed column reads as zero, a new state falls into an existing branch, a missing limit defaults to "no limit", and a reload applies half of a new configuration. Check that required fields and settings raise when absent, that unknown enumeration values are rejected or counted, that each value's unit is stored with it or validated at the interface, and that configuration is validated as a whole before it replaces the running one. A default for a setting that is optional by design is not a defect.

**Data lag and absence hidden by process health**
A status, heartbeat, or "last updated" time is taken from the process being alive, the socket being open, or the last poll returning, while the newest data is hours old, a consumer is far behind its source, or a filter is excluding everything. Find what each health or freshness field is computed from and whether any of them uses the newest source timestamp, the backlog, or a count of records per interval; check that an alert on absent data is raised by something other than the stalled job. How health is drawn belongs to `ALARMS-HMI-AND-DISPLAY.md#Self-silencing monitoring and health indicators`. A status that states what it measures, shown beside a "data current as of" time taken from the data, is not a defect.

**Wall-clock durations and unsynchronized start-up time**
Time-outs, staleness tests, rates, and elapsed times are computed from the wall clock, or from the clocks of two machines, so a clock step produces negative or huge intervals; or a device that boots before its clock is set stamps data with a default date that later sorts as the oldest or newest record. Check duration arithmetic for a monotonic clock, staleness tests for which two clocks they compare, collectors for a start that waits on time synchronization, and writers for a sanity bound that rejects times far from the source's own time or before a build date. Which timestamp a sample keeps is `PROCESS-DATA-INTEGRITY.md#Timestamp source and clock-skew confusion`. A rejected or flagged implausible time is not a defect.

## Universal moves (apply across the above)

- Run each job against a scratch database four ways: once, twice on the same window, killed halfway and restarted, and late. Compare row counts and totals with the single clean run. Any difference without a marker is a candidate.
- For each pipeline, write the reconciliation by hand: rows read, rows written, rows rejected, and the period covered. Then find where the code computes it. If nowhere, name what a missing row would look like to the consumer.
- List every place a failure can become a value: broad `except`, error-returning calls with no check, numeric defaults on lookups, `else` branches, empty results after a time-out. Follow each to storage or display.
- Pin the clock and the zone. Run schedule and window logic across both daylight-saving changes, across a month end, and with a start that is hours late.
- Grep for the idioms that cause these defects: current-time calls inside job bodies, plain inserts in scheduled jobs, `except` followed by `continue`, `pass`, or `return` of a literal, acknowledgement or file-move calls above the write, loops that sleep with no lock, `time.time()` in duration arithmetic, and "latest" queries with a limit and no ordering.

## Validation rules (apply before reporting ANY finding here)

1. Name the job or pipeline step, the ordinary event that interrupts, repeats, delays, or skips it, the store or output it leaves wrong, the consumer, and the decision the output informs.
2. Show the result after the event beside the result of a clean run on the same fixture: the missing, doubled, stale, or defaulted rows or figures. Show that nothing the consumer reads marks the difference; a log entry alone does not count.
3. Reproduce in the sandbox against a scratch store with a pinned clock, and stop at the smallest wrong row count, total, report figure, or status. Simulating a crash by stopping the process between two writes shows what the code leaves behind; it does not show how often that happens.
4. Keep the candidate `needs_validation` when the outcome depends on deployment facts outside the repository: scheduler settings for missed and overlapping runs, database durability and isolation settings, the file system, clock synchronization, or whether two instances can run in the deployed topology.
5. Rule out designed behaviour the consumer can see: an idempotent write, a recorded window, a rejected-row count on the output, a provisional marker, a run that fails loudly.
6. Return `confirmed` only with the complete path and an observed wrong, missing, or doubled result from a source-complete trace and bounded local execution. Return `needs_validation` with the exact deployment or runtime fact required and the fixture or owner check that would settle it.
