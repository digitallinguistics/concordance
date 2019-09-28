#!/usr/bin/env node

const concordance = require(`./src`);
const program     = require(`commander`);
const { version } = require(`./package.json`);

program.version(version, `-v, --version`, `output the current version`)
.arguments(`<wordforms>`, formatList)
.option(`-d, --dir <dir>`, `directory where the corpus is located`)
.option(`-o, --outputPath <outputPath>`, `location where the concordance file should be generated`);

program.parse(process.argv);

const [wordformsArg] = program.args;

if (!wordformsArg) {
  console.error(new Error(`Please pass a wordform or comma-separated list of wordforms as the first argument.`));
}

function formatList(str) {
  return str.split(/\s*,\s*/u);
}

const wordforms           = formatList(wordformsArg);
const { dir, outputPath } = program.opts();

concordance(wordforms, dir, outputPath);
