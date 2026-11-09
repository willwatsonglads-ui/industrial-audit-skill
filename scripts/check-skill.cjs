#!/usr/bin/env node

/**
 * Structural checks for the skill's Markdown files.
 * Usage: node scripts/check-skill.cjs [skill-dir]
 *
 * - every companion file follows the companion template headings, in order;
 * - every file linked from the ATTACK-CLASSES.md target list exists, and every
 *   companion file is linked from it;
 * - the README Files table lists every file in the skill directory;
 * - bold attack-class names are unique across ATTACK-CLASSES.md and the companions,
 *   because coverage-ledger units refer to them as `FILE.md#<exact class name>`.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const NON_COMPANION = new Set([
  "SKILL.md",
  "RECONNAISSANCE.md",
  "HUNTING.md",
  "ATTACK-CLASSES.md",
  "VALIDATION-AND-REPORTING.md",
  "STANDARDS.md",
]);
const TEMPLATE = [
  { label: "# <title> Hunting", test: (line) => /^# .+ Hunting$/.test(line) },
  { label: "#### When to use this file", test: (line) => line === "#### When to use this file" },
  { label: "## Core discipline", test: (line) => line.startsWith("## Core discipline") },
  { label: "## <group> attack classes", test: (line) => /^## .+ attack classes/.test(line) },
  { label: "## Universal moves", test: (line) => line.startsWith("## Universal moves") },
  { label: "## Validation rules", test: (line) => line.startsWith("## Validation rules") },
];

function readLines(file) {
  return fs.readFileSync(file, "utf8").split("\n");
}

function companionErrors(file, lines) {
  const errors = [];
  let step = 0;
  for (const line of lines) {
    if (step < TEMPLATE.length && TEMPLATE[step].test(line)) step++;
  }
  if (step < TEMPLATE.length) errors.push(`${file}: missing or out-of-order heading "${TEMPLATE[step].label}"`);
  if (!lines.some((line) => /^\*\*[^*]+\*\*$/.test(line))) errors.push(`${file}: no bold attack classes`);
  return errors;
}

function classNames(file, lines) {
  const pattern = file === "ATTACK-CLASSES.md" ? /^\*\*([^*]+)\*\* \(subagent_type/ : /^\*\*([^*]+)\*\*$/;
  return lines.map((line) => pattern.exec(line)).filter(Boolean).map((match) => match[1]);
}

function check(skillDir) {
  const errors = [];
  const files = fs.readdirSync(skillDir).filter((name) => fs.statSync(path.join(skillDir, name)).isFile()).sort();
  const markdown = files.filter((name) => name.endsWith(".md"));
  const companions = markdown.filter((name) => !NON_COMPANION.has(name));

  const seen = new Map();
  for (const name of markdown) {
    const lines = readLines(path.join(skillDir, name));
    if (companions.includes(name)) errors.push(...companionErrors(name, lines));
    if (companions.includes(name) || name === "ATTACK-CLASSES.md") {
      for (const className of classNames(name, lines)) {
        if (seen.has(className)) errors.push(`duplicate attack class "${className}" in ${seen.get(className)} and ${name}`);
        else seen.set(className, name);
      }
    }
  }

  const headings = new Map(markdown.map((name) => [name, new Set(readLines(path.join(skillDir, name))
    .map((line) => /^#+ (.+?)(?: \(.*\))?$/.exec(line))
    .filter(Boolean)
    .map((match) => match[1]))]));
  for (const name of markdown) {
    for (const match of fs.readFileSync(path.join(skillDir, name), "utf8").matchAll(/`([A-Z0-9-]+\.md)#([^`]+)`/g)) {
      const [, file, anchor] = match;
      if (anchor === "<exact bold class name>" || anchor === "<class name>" || anchor === "...") continue;
      const resolves = seen.get(anchor) === file || (headings.get(file) && headings.get(file).has(anchor));
      if (!resolves) errors.push(`${name}: reference \`${file}#${anchor}\` does not match a class or heading in ${file}`);
    }
  }

  const attackClasses = readLines(path.join(skillDir, "ATTACK-CLASSES.md"));
  const linked = new Set();
  for (const line of attackClasses.filter((entry) => entry.startsWith(">"))) {
    for (const match of line.matchAll(/\]\(([^)]+\.md)\)/g)) linked.add(match[1]);
  }
  for (const target of linked) {
    if (!files.includes(target)) errors.push(`ATTACK-CLASSES.md links to missing file ${target}`);
  }
  for (const name of companions) {
    if (!linked.has(name)) errors.push(`${name} is not linked from the ATTACK-CLASSES.md target list`);
  }

  const readme = fs.readFileSync(path.join(ROOT, "README.md"), "utf8");
  for (const name of files) {
    if (!readme.includes(`| \`${name}\` |`)) errors.push(`README.md Files table does not list ${name}`);
  }

  return { errors, companions: companions.length, classes: seen.size };
}

if (require.main === module) {
  const skillDir = path.resolve(process.argv[2] || path.join(ROOT, "skills", "industrial-audit"));
  const { errors, companions, classes } = check(skillDir);
  if (errors.length > 0) {
    for (const error of errors) console.error(`FAIL: ${error}`);
    process.exit(1);
  }
  console.log(`PASS: ${companions} companion files, ${classes} unique attack classes`);
}

module.exports = { check };
