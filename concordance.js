#!/usr/bin/env node

const concordance = require(`./src`);
const program     = require(`commander`);
const { version } = require(`./package.json`);

function formatList(str) {
  return str.split(/\s*,\s*/u);
}

program.version(version, `-v, --version`, `output the current version`)
.option(`-d, --dir <dir>`, `directory where the corpus is located`, `.`)
.option(`-k, --KWIC`, `whether to output the concordance in Keyword in Context (KWIC) format; if true, "pre" and "post" fields are added`, false)
.option(`-l, --wordlist <wordlist>`, `location where the list of words to concordance (as a JSON array) is located; overrides wordforms option if present`)
.option(`-o, --outputPath <outputPath>`, `location where the concordance file should be generated`, `concordance.tsv`)
.option(`-w, --wordforms <wordforms>`, `comma-separated list of words to concordance`, formatList);

program.parse(process.argv);

const options = program.opts();

concordance(options);
