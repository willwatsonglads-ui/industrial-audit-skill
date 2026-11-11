# Build Guide

Read this before writing, extending, or fixing software that handles plant data. It is self-contained: no audit phases, agents, or artifacts. The audit files in this skill describe how such software goes wrong; this file is what to write instead.

Code that runs and passes its own tests can still give an operator, a report, or a model a wrong number that looks right. Almost always the cause is the same: something was unknown (a sensor was bad, data had not arrived, a calculation failed) and the code turned it into a normal-looking value. The rules below exist to stop that.

**How to use it.** Read "Seven rules" and "Settle these first". Then read only the pattern sections that match what you are building. Finish with "Before you call it done". To fix a reported defect, go to "Fixing a finding".

| You are building | Read |
|---|---|
| A reader, connector, importer, or sync from a plant source | A, B, C, D, J |
| A dashboard, trend, report, or API over plant data | B, C, D, F, K |
| Lab results, specifications, pass or fail checks | D, E, K |
| KPIs, shift or daily totals, yields, balances | B, C, F |
| A soft sensor, forecast, or any model on plant data | C, E, G |
| A batch or golden-profile comparison | B, C, H |
| A simulation or digital twin fed with plant data | D, G, I |
| A scheduled job or background pipeline | B, J |
| Anything that can change a plant system, or regulated records | L |

## Seven rules

1. **A sample is five things: value, time, unit, quality, and identity.** Carry all five through every function, table, API response, and file. A bare float has already lost four of them.
2. **Three states, not two.** Every result (a number, a verdict, a KPI, a status) can be valid, invalid, or unknown. Unknown must never come out as zero, a pass, the last value, an empty list, or a blank. If your type cannot say "unknown", change the type.
3. **A failure is not a value.** Never turn an exception, error return, time-out, or missing key into a default. Raise, or return a failed state that every caller has to handle.
4. **Count what you drop and mark what you fill.** Rows read must equal rows written plus rows rejected, and the count goes where the consumer of the output can see it. Every fill has a limit and a flag. A log line is not a marker.
5. **One function per rule, used on every path.** Unit conversion, quality mapping, limit comparison, bucketing, and feature building each live in one place, and live ingest, backfill, API, export, report, model fitting, and model running all call it.
6. **Stamp what produced it.** A stored result carries the version of the formula, model, reference, mapping, and parameters behind it, and the time window of its inputs.
7. **Ask; do not guess plant facts.** The time zone, when the production day starts, each tag's unit and basis, which timestamp is the sample time, the rounding rule of a specification: none of these can be inferred from the data. If nobody can be asked, make the fact a required setting with no default and show the assumption on the output.

## Settle these first

The request will rarely say these. Each one changes the code. Ask before writing; if you cannot ask, apply rule 7.

- **Consumer and decision.** Who or what reads the output, and what do they decide from it? This sets how visible "unknown" has to be.
- **Time.** The plant's time zone. Whether source times are UTC, local, or local with no offset. The start of the production day and of each shift. Which timestamp is the data's own time (source, server, arrival) and whether it can be missing.
- **Each input tag.** Unit and basis (gauge or absolute, mass or molar, wet or dry). Normal update interval, which sets the maximum age. Valid range. Whether it is continuous, stepped, a counter, or a state. Whether the source compresses or reports by exception.
- **Missing data.** What should the consumer see when an input is bad, late, or absent? "Nothing, clearly marked" is usually the right answer and is almost never what untested code does.
- **Lab data.** Which field is the sample time. How results below a detection limit are written. Which result states exist (preliminary, verified, retracted) and which ones count. Retests and replicates. Each limit's unit, rounding rule, and whether it is inclusive.
- **Definitions.** The exact formula of each KPI. What starts and ends a batch. What "good quality" means for this source.
- **Writes.** Whether anything is allowed to change a plant system. Assume not.

## A. Reading and carrying samples

```python
class Quality(Enum):
    GOOD = "good"; UNCERTAIN = "uncertain"; BAD = "bad"

@dataclass(frozen=True)
class Sample:
    tag: str               # a stable identifier, never a display name
    time: datetime         # timezone-aware UTC, taken from the source
    value: float | None    # None whenever quality is BAD
    unit: str
    quality: Quality
    reason: str = ""       # why it is not GOOD

ORDER = [Quality.GOOD, Quality.UNCERTAIN, Quality.BAD]
def worst(qualities):      # no inputs at all is BAD, not GOOD
    return max(qualities, key=ORDER.index, default=Quality.BAD)
```

- **Map quality from the source, with a non-good default.** For an OPC UA status code, severity is the top two bits; never compare the whole code with zero. Unknown and vendor codes map to BAD.
  ```python
  def opcua_quality(status_code: int) -> Quality:
      return (Quality.GOOD, Quality.UNCERTAIN, Quality.BAD, Quality.BAD)[(status_code >> 30) & 0b11]
  ```
  Keep the full code as well: its lower bits say when the server dropped samples (overflow), when a value is pinned at a limit, and when units or ranges changed.
- **A BAD sample has no value.** Store `None`, not the number that came with it, and not the previous value.
- **Check what the server gave you, not what you asked for.** After subscribing, read back the revised sampling interval, queue size, and keep-alive, and the result for each item. An item the server refused never reports, which looks exactly like a steady signal.
- **Some libraries return an error object instead of raising.** For example, a Modbus read in pymodbus returns a response whose `isError()` is true; indexing its registers without that test stores zeros or crashes a worker. Read each client library's failure behaviour before using it.
- **Silence is not liveness.** A subscription that reports only changes says nothing while the source is steady and nothing while it is dead. Decide how you tell them apart: a heartbeat tag, a periodic read, or source timestamps.
- **After a reconnect there is a hole.** Re-read every item, backfill from history if the source has it, and write a gap marker for the outage. Never let a value replayed from before the outage overwrite a newer one.
- **Decode registers from configuration.** Word order, byte order, signedness, scale, and address base are per-device settings with no default. A float decoded with the wrong word order is still a plausible number. Read a multi-register value in one request.
- **Device failure signals are not readings.** NaN, infinity, sentinels such as -9999 or 32767, and a 4–20 mA input outside its valid band become BAD samples with a reason at the first hop. The bands differ by device, so they are configuration.
- **Stamp each value with its own time.** Do not give every tag in a polling cycle the cycle's start time; they were read seconds apart.

## B. Time

- **Store UTC, timezone-aware, from the source.** Never `datetime.utcnow()` or `datetime.now()` (both naive); use `datetime.now(timezone.utc)`, and only for things that really happen now, such as log entries. A sample's time comes from the sample.
- **Parse with an explicit format and let bad stamps fail.** `errors="coerce"` turns them into missing times that later steps drop without a word.
  ```python
  ts = pd.to_datetime(df["time"], format="%Y-%m-%d %H:%M:%S")          # raises on a bad stamp
  ts = ts.dt.tz_localize(PLANT_TZ, ambiguous="raise", nonexistent="raise").dt.tz_convert("UTC")
  ```
  Local times with no offset are ambiguous for one hour each autumn. Raising forces a decision; do not silence it with `ambiguous="NaT"`. If the source can send an offset or UTC, require it.
- **Windows are half-open and they tile.** `start <= t < end`. `BETWEEN` and `<=` on both ends count a sample on the boundary twice.
- **State the bucket's closed side and label** on every resample and window aggregate. Tools differ, and a joined series ends up shifted by one period.
- **A production day is not a calendar day, and not always 24 hours.**
  ```python
  wall = ts_utc.dt.tz_convert(PLANT_TZ).dt.tz_localize(None)            # plant wall-clock time
  prod_day = (wall - pd.Timedelta(hours=DAY_START_HOUR)).dt.date

  def day_edges(d: date, tz: str, start_hour: int):                     # UTC edges of production day d
      zone = ZoneInfo(tz)
      a = datetime.combine(d, time(start_hour), tzinfo=zone)
      b = datetime.combine(d + timedelta(days=1), time(start_hour), tzinfo=zone)
      return a.astimezone(timezone.utc), b.astimezone(timezone.utc)     # b - a is 23, 24, or 25 hours
  ```
  Divide rates by the period's real length. In SQL, pass the plant's zone to the bucket function; the default cuts at UTC or session-zone midnight.
- **Measure durations with a monotonic clock.** `time.monotonic()` for time-outs and elapsed time; the wall clock can step backwards.
- **A job's window comes from its schedule, not from now.** See J.
- **Test** with the zone set to a non-UTC zone that has daylight saving, on both change dates. A test that passes only in UTC proves nothing.

## C. Missing data, fills, and joins

These library defaults are the most common source of wrong plant numbers.

| Call | What it silently does | Write instead |
|---|---|---|
| `sum()` on an empty or all-missing window | returns 0 | `sum(min_count=1)`, which returns missing |
| `mean()`, `min()`, `max()` | skip missing values, so one sample out of sixty gives a normal-looking hourly mean | keep `count()` beside it and enforce a minimum coverage |
| `rolling("10min")` | a time-based window accepts a single sample | set `min_periods`, check the count |
| `ffill()` | carries the last value forward for ever | `ffill(limit=n)` plus a filled flag |
| `interpolate()` | spaces points evenly whatever their timestamps; bridges a gap of any length; `limit=n` fills the first n points of a long gap | `method="time"`, and mask whole gaps longer than the limit (below) |
| `merge_asof()` | matches the nearest earlier row however old | `tolerance=`, then count the unmatched rows |
| `x > limit` with a missing x | is False, and so is `x <= limit` | test for missing first |
| `all([])` | is True | check the count before the verdict |
| `groupby(key)` | drops rows whose key is missing | `dropna=False`, reconcile row counts |
| `merge()` on a non-unique key | multiplies rows | `validate="m:1"` or `"1:1"` |
| `pd.to_numeric(errors="coerce")` | turns `<0.50` and `ND` into missing | parse the qualifier first (E) |
| `read_csv` | reads the strings `NA`, `None`, `NULL` as missing | `keep_default_na=False` with your own list |
| `np.interp` | holds the end value flat outside the table | `left=np.nan, right=np.nan` |
| SQL `AVG`, `SUM` | skip NULL; `COALESCE(x, 0)` then hides it | return `count(x)` and `count(*)` beside it |
| SQL `WHERE x > limit` | drops NULL rows from both "over" and "not over" | an explicit `IS NULL` branch |
| `ORDER BY ... LIMIT 1` for "latest" | returns a row of any age | add a maximum-age predicate and a unique tiebreak |
| `json.dumps` | writes `NaN`, which is not JSON | `allow_nan=False`; send `null` with a quality |

Aggregate with coverage:

```python
g = s.resample("1h", closed="left", label="left")
out = pd.DataFrame({"mean": g.mean(), "n": g.count()})
out["coverage"] = out["n"] / (pd.Timedelta("1h") / SAMPLE_INTERVAL)
out.loc[out["coverage"] < MIN_COVERAGE, "mean"] = np.nan                # and keep n and coverage in the output
total = g.sum(min_count=1)                                              # missing, not 0, for an empty hour
```

For data stored by exception or with compression, a count means nothing: weight by time, and get the rule for "no row" (held, interpolated, or gap) from the source's settings.

Fill short gaps only, and mark them:

```python
gap = s.isna()
run = gap.groupby((~gap).cumsum()).transform("sum")                     # length of each run of missing points
filled = s.interpolate(method="time", limit_area="inside").where(~gap | (run <= MAX_GAP_POINTS))
was_filled = gap & filled.notna()                                       # carry this flag to the consumer
```

Never interpolate a stepped signal, a state, a setpoint, or a counter; hold the last value, with the same limit. When timestamps are irregular a gap is not a missing value but an absent row: find gaps from the difference between consecutive times.

Join with a maximum age:

```python
joined = pd.merge_asof(lab.sort_values("sample_time"), proc.sort_values("time"),
                       left_on="sample_time", right_on="time",
                       direction="backward", tolerance=pd.Timedelta("5min"))
unmatched = joined["time"].isna().sum()                                 # report it; do not drop quietly
```

A three-state check and verdict:

```python
state = np.select([x.isna(), (x >= lo) & (x <= hi)], ["unknown", "in"], default="out")

def verdict(state, min_points, min_coverage):
    known = state != "unknown"
    if known.sum() < min_points or known.mean() < min_coverage:
        return "unknown"                                                # never "in" by default
    return "out" if (state == "out").any() else "in"
```

## D. Units and numbers

- **Keep a per-tag table of unit and basis**, and convert through one function that refuses what it does not know.
  ```python
  def convert(value, frm, to):
      if frm == to:
          return value
      try:
          return value * FACTORS[(frm, to)]
      except KeyError:
          raise ValueError(f"no conversion {frm!r} -> {to!r}") from None   # never a silent factor of 1
  ```
  A units library such as Pint is better than a hand-made table. A literal `273.15`, `101325`, or `14.7` added to a tag value in application code is a sign that the table is missing.
- **Never change the case of a unit string.** `mg` and `Mg`, `mPa` and `MPa` differ by a factor of a billion.
- **Basis is not a unit.** Gauge or absolute pressure; mass, mole, or volume fraction; wet or dry; the reference temperature and pressure behind a "standard" or "normal" volume flow. Store it in its own field and refuse to compare across bases.
- **A temperature difference is not a temperature.** 10 °C of difference is 10 K, not 283.15 K. Give intervals their own conversion.
- **Convert once.** Decide where (at ingest or at output) and make every other place read the unit instead of assuming it. When a tag's unit changes, old rows keep their own unit.
- **Counters.** Take differences per source before adding sources together; after a sum, one counter's reset can no longer be told from a drop in the total. A negative step is a reset, a wrap, or a bad sample: decide which from the counter's configured width, and flag the interval instead of summing it.
- **Precision.** Accumulate in 64-bit floats or integers. Send 64-bit identifiers and counts to browsers as strings; a JavaScript number holds integers exactly only up to 2^53.
- **Round once, at the edge.** Store the raw value; format for display in one place. Never do arithmetic on a displayed value.

## E. Lab results and specifications

- **Join on sample time**, the moment the material left the process. Not the result, approval, or entry time, which can be hours later. Keep a server-captured entry time beside any time a person typed.
- **Keep censored results censored.**
  ```python
  CENSORED = re.compile(r"^\s*([<>]=?)?\s*([-+]?\d+(?:\.\d+)?)\s*$")
  def parse_result(text: str):
      m = CENSORED.match(text)
      if not m:
          return None, None, text.strip()          # "ND", "N/A", a comment: keep the text
      return float(m.group(2)), m.group(1) or "", None   # value, qualifier ("<", ">", or ""), text
  ```
  Store the qualifier in its own column. In every sum, mean, and trend, report how many results were censored instead of counting each at its limit. Decide the decimal separator from the source's locale, not by guessing.
- **Filter by result state.** Reports, release checks, and models read only the states that count. A retest links to its original and never inherits its value or time. Keep each replicate; an excluded one needs a recorded reason.
- **Compare with a limit in one function, in decimal, with the specification's own rule.**
  ```python
  def conforms(result: Decimal, limit: Decimal, method: str, inclusive: bool = True) -> bool:
      if method == "rounding":                     # round to the limit's digits, then compare
          result = result.quantize(limit, rounding=ROUND_HALF_UP)
      return result <= limit if inclusive else result < limit
  ```
  Build decimals from strings, not floats. `round()` in Python rounds half to even and works on the binary value: `round(2.5)` is 2 and `round(2.675, 2)` is 2.67. Whether a specification compares the raw result or the rounded one, and whether the limit is inclusive, are properties of that specification: store them with it. A one-sided limit has a null bound, never 0 or 999999.
- **Compare with the limit in force at the sample time**, in the limit's unit and basis, for the right product or grade.
- **Entry forms default to empty.** A prefilled 0 or "OK" that is saved untouched becomes an observation nobody made.

## F. Totals and KPIs

- **Write the definition down** in the code and on the output. Common KPIs have several definitions.
- **Roll up as a ratio of sums**, never as an average of ratios or of averages.
  ```python
  good, total = df["good"].sum(min_count=1), df["total"].sum(min_count=1)
  kpi = None if pd.isna(total) or total == 0 else good / total          # no production is not 0 % or 100 %
  ```
- **Clip events to the period** before summing, so an event that spans a boundary is split, not counted whole or twice.
  ```python
  overlap = max(timedelta(0), min(end, p_end) - max(start, p_start))
  ```
- **Take every component from the same window and stage.**
- **Do not clip a figure above 100 %**; it means an input or a reference is wrong, and the reader needs to see that.
- **Mark an open period** as provisional, and recompute or revise when late data lands in a closed one.
- **Do not close a balance by assignment.** A term computed as total minus the rest hides a failed meter. Keep measured and calculated terms apart and report the residual.

## G. Estimates and models

An estimate is not a measurement. Its quality comes from its inputs, not from the fact that the code ran.

```python
def estimate(inputs: list[Sample], model, now: datetime) -> Sample:
    reasons = []
    for s in inputs:
        if s.quality is not Quality.GOOD:
            reasons.append(f"{s.tag}: {s.quality.value}")
        elif now - s.time > MAX_AGE[s.tag]:
            reasons.append(f"{s.tag}: stale")
        elif not model.fitted_lo[s.tag] <= s.value <= model.fitted_hi[s.tag]:
            reasons.append(f"{s.tag}: outside fitted range")
    as_of = min(s.time for s in inputs)                                  # as old as its oldest input
    if any(s.value is None for s in inputs):
        return Sample(OUT_TAG, as_of, None, OUT_UNIT, Quality.BAD, "; ".join(reasons))
    y = float(model.predict([[s.value for s in inputs]])[0])
    if not math.isfinite(y):
        return Sample(OUT_TAG, as_of, None, OUT_UNIT, Quality.BAD, "non-finite result")
    quality = Quality.UNCERTAIN if reasons else Quality.GOOD
    return Sample(OUT_TAG, as_of, y, OUT_UNIT, quality, "; ".join(reasons))
```

- **Save the fitted domain with the model**: each input's range, the grades, modes, and equipment it was fitted on, and its version. A model file that holds only weights cannot tell when it is extrapolating.
- **Every filter used when fitting needs a gate when running.** If training kept only steady state or one grade, the running code must detect the other cases and mark its output.
- **One feature function for fitting and running.** Same joins, fills, lags, scaling, and units.
- **No look-ahead.** Every feature window ends at or before the moment the estimate would be made online. `center=True`, `shift(-n)`, back-fill, and interpolation across the sample time all leak the future.
- **Do not drop inconvenient rows without a record.** Dropping `<0.50` results biases low-range estimates high; substituting the limit or half of it understates the spread. Keep them as value plus qualifier and fit with a method that understands censoring (maximum likelihood on censored data; `scipy.stats.CensoredData` covers distribution fits, and a Tobit-type model covers regression). If you cannot, store the lowest value the model can honestly report and mark estimates near it UNCERTAIN. The same holds for outlier filters: count what they remove and where in the range.
- **Evaluate honestly.** Split by time or by batch, with a gap that covers the feature lags, and keep every fitted step inside the pipeline.
  ```python
  cv = TimeSeriesSplit(n_splits=5, gap=GAP_ROWS)
  scores = cross_val_score(make_pipeline(StandardScaler(), Ridge()), X, y, cv=cv)
  ```
  Report error by range and at the specification limit, not one pooled number.
- **Never clamp or hold without a flag.** A clipped output keeps a `clamped` reason and its raw value. A failed calculation writes BAD; it does not republish the last estimate with a new time.
- **Gate automatic corrections.** A bias update or refit uses only verified results, limits its step, records old and new values, and bumps the version that later estimates carry.
- **Label it.** Wherever the estimate appears, it is marked as an estimate, with its quality, its age, and its model version.

## H. Batch and profile comparisons

- **Use the batch system's own start and end events** where they exist. A threshold crossing merges restarts and splits holds.
- **"Unknown" is a verdict.** Use the three-state check in C with a minimum number of real points per phase. A batch that has just started is unknown, not on profile.
- **Never compare across a gap.** Do not resample or interpolate across missing data and then compare; keep the mask, and count filled points as no evidence.
- **Choose the alignment and show it**: elapsed time, time within phase, or a progress variable. If you warp time, constrain it and report the shift; the delay is often the finding.
- **The live view uses only data up to now.** Nothing that needs the finished batch's length.
- **Check the reference before comparing.** Store recipe, grade, unit, equipment, and version with the reference profile and refuse a mismatch. Require a minimum number of reference batches at every point and a floor on the band's width.

## I. Simulation and digital twins

- **Check the solver's own status after every solve, fit, and property call, before reading any result.**
  ```python
  res = least_squares(residuals, x0, bounds=(lo, hi))
  if not res.success:
      raise FitFailed(res.status, res.message)
  if (res.active_mask != 0).any():
      raise FitFailed("a parameter is resting on a bound")
  ```
  A flowsheet simulator has the same kind of flag (a solved state, an error message, per-loop convergence); an optimization library has a termination condition. Read them every time.
- **A failed run publishes a failed status, not numbers.** Model objects keep their previous solution after a failure; reading them gives yesterday's answer under today's timestamp.
- **The result's time is the time of its input data**, stored beside a separate solve time.
- **Inputs are samples.** Refuse BAD or stale ones, limit the spread of timestamps across inputs, and store the input snapshot with the result.
- **Map each tag to a model variable through the unit and basis table in D.** Check that a composition sums to one within a tolerance before setting it; a library that renormalizes will hide a percent-for-fraction mistake.
- **Gate a steady-state model on steadiness.** Test several key tags, store the test's result, and do not publish a model-versus-plant gap from a start-up or grade change as equipment condition.
- **Check validity ranges** of property methods and correlations before the call, and treat a caught property error as a failed run, never as a default.
- **Self-tuning keeps history.** Parameter sets are append-only, each with its data window and fit statistics; a new set replaces the current one only after passing a check on held-back data; every result names its parameter set, model version, and property method.
- **A recommendation carries its limits**: solver status, active constraints, and whether any value lies outside the validated range. An unfinished solve gives no recommendation.

## J. Jobs and pipelines

Ask of every step: what does the consumer see if it runs twice, never runs, or stops halfway?

```python
def run(window_start, window_end):                 # passed in by the scheduler; never computed from now()
    rows, n_read, n_rejected = load(window_start, window_end)
    assert n_read == len(rows) + n_rejected        # reconcile, and fail the run if it does not hold
    with conn:                                     # one transaction: replace the window, record the run
        conn.execute("DELETE FROM hourly WHERE site = ? AND t >= ? AND t < ?", (SITE, window_start, window_end))
        conn.executemany("INSERT INTO hourly(site, tag, t, value, n) VALUES (?, ?, ?, ?, ?)", rows)
        conn.execute("INSERT INTO job_run VALUES (?, ?, ?, ?, ?, ?)",
                     (JOB, window_start, window_end, n_read, len(rows), n_rejected))
```

- **Replace the window or upsert on the full natural key** (site, unit, tag, time, revision). A plain insert doubles on every retry.
- **Advance the read position in the same transaction as the write**, never before it. Acknowledge a message, move a file, or delete a queue row only after the write commits.
- **Decide what happens to missed runs** (catch up, or leave a visible gap) and stop two runs overlapping with a lock that the process's death releases.
- **Keep rejected rows.** Put them in a table or count them, and show the count on the output. `except: continue` in a row loop is how rows vanish.
- **A read is complete only if you can show it.** Follow pagination to the end, order "latest" queries, and never turn a time-out into an empty list.
- **Write files atomically** when another process watches the folder.
  ```python
  def atomic_write(path: str, data: bytes) -> None:
      tmp = path + ".tmp"                          # the watcher must ignore *.tmp
      with open(tmp, "wb") as f:
          f.write(data); f.flush(); os.fsync(f.fileno())
      os.replace(tmp, path)                        # atomic on one file system
  ```
- **Required settings raise when missing.** `config.get("limit", 0)` and `row.get("flow", 0)` turn a typo or a renamed column into data. Unknown enumeration values are rejected, not sent down the "normal" branch.
- **Health comes from the data.** Report "data current as of" from the newest source timestamp and alert on its age from somewhere other than the job that may have stalled. A live process is not evidence of flowing data.

## K. Screens, APIs, and exports

- **Show unit, quality, and age with every value**, in the response and on the screen. A consumer that receives only a number cannot do the right thing.
- **Missing is `null`, never 0**, and the field that explains why travels with it.
- **Loading, failed, and empty are three different states**; none of them looks like "all clear" or a flat line at zero.
- **Draw gaps as gaps.** Do not connect points across missing data or downsample away the excursion.
- **Estimates, manual entries, fills, and overrides look different from measurements**, in tables and exports as well as charts.
- **Say when a list or export was cut** at a row or size limit.

## L. Writes, records, and access

Keep these short rules while building; the audit files hold the detail.

- **Do not write toward a controller, SCADA, or field device** unless the request explicitly asks for it. If it does, the write goes through an allowlist of points, a server-side approval bound to the exact tag, value, and unit, a re-check of the current state, and an expiry. Connect to plant sources with read-only credentials. See `OT-BOUNDARY-AND-CONTROL-WRITES.md`.
- **Listen on localhost unless told otherwise**, ship no default or shared passwords, keep connection secrets out of responses and exports, and make no outbound call the user has not been told about.
- **Check permissions on the server for every route and job**, not in the user interface.
- **For records that claim an audit trail**, write the audit entry in the same transaction as the change, record who, when, old value, new value, and why, and never update or delete a record in place. See `RECORDS-AUDIT-AND-SIGNATURES.md`.
- **Model output is a proposal.** Check any tag, value, or citation a language model produces against the source before showing or storing it as fact. See `AI-IN-PLANT-OPERATIONS.md`.

## Before you call it done

Make a condition table for every output your code produces: each number shown, row stored, verdict, estimate, and status. One row per condition that applies; fill in what the output delivers.

| Condition | The output must show |
|---|---|
| An input is BAD or UNCERTAIN | no value, or the value with lowered quality and the reason |
| An input stopped updating (stale or frozen) | the same, with its age |
| An input is missing, or there is no data yet | "unknown", never 0, a pass, or the last value |
| A gap longer than the fill limit | a gap; no bridged values |
| Too few points for the verdict or aggregate | "unknown" or "insufficient data" |
| A value out of range, non-finite, or a device failure code | BAD with a reason; nothing clamped without a flag |
| A late, duplicated, or corrected sample | one row, the right one; derived values recomputed or marked |
| A censored, preliminary, or retracted lab result | handled by its state and qualifier; counted, not hidden |
| A sample exactly on a window edge | counted once |
| Both daylight-saving changes; a 23- and a 25-hour day | every sample at its true instant; rates over the true length |
| The calculation fails or does not converge | a failed status; no stale numbers under a new time |
| The job runs twice, runs late, or dies halfway | the same result as one clean run, or a visible marker |
| The process restarts or reconnects | the outage marked; no duplicates; nothing old overwriting new |
| A required setting or field is absent or renamed | an error, not a default |

Any row where the honest answer is "unknown" and your output is a normal-looking value is a defect. Fix it, then write one test per row from a small fixture. Run the tests under a non-UTC zone with daylight saving.

Then state, in your summary to the user: the plant facts you assumed (rule 7), what the output shows for missing data, and anything in the table you did not handle.

## Fixing a finding

A fix that recognises the problem but leaves the consumer's result unchanged fixes nothing. Example: a soft sensor dropped `<0.50` lab results from training, so its low-range estimates were biased high and still marked good. A patch that parses the `<` and records the limit, but still leaves those rows out of the fit, changes no estimate.

1. **Restate the invariant** in one sentence: under this condition, the consumer must receive this value, or a visible unknown.
2. **Write the failing test first**, from the finding's fixture, asserting on what the consumer receives (the stored row, the response field, the verdict), not on an internal flag.
3. **Fix at the hop where the information was lost**, not where the symptom shows. A missing quality cannot be restored at the display.
4. **Find the sibling paths.** Search for the same idiom and for every other producer of the same output: fit time and run time, live and backfill, API, export, report. Move the rule into one function and make them all call it (rule 5).
5. **Carry the unknown state to the consumer.** If the fix adds a flag or a quality, follow it to every surface that shows the value.
6. **Re-run the condition-table row** for this defect on every path, then the rest of the tests.
7. **Say what you left unfixed** and why. Do not report a finding as fixed on the strength of a changed line.
