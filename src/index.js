const createCSVStream = require(`csv-stringify`);
const { createWriteStream } = require(`fs`);

const defaultColumns = [
  `text`,
  `utterance`,
  `word`,
  `token`,
];

function concordance(
  wordforms = [],
  dir = `.`,
  outputPath = `concordance.tsv`
) {

  wordforms = Array.from(wordforms); // eslint-disable-line no-param-reassign

  const csvOptions = {
    columns:   defaultColumns,
    delimiter: `\t`,
    header:    true,
    quote:     ``,
  };

  const csvStream   = createCSVStream(csvOptions);
  const writeStream = createWriteStream(outputPath, `utf8`);

  csvStream
  .on(`error`, console.error)
  .pipe(writeStream)
  .on(`error`, console.error);

  csvStream.end();

}

module.exports = concordance;
