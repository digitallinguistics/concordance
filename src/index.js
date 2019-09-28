const createCSVStream = require(`csv-stringify`);
const { createWriteStream } = require(`fs`);

const defaultColumns = [
  `text`,
  `utterance`,
  `word`,
  `token`,
];

function concordance(
  wordforms,
  dir = `.`,
  outputPath = `concordance.tsv`
) {
  return new Promise((resolve, reject) => {

    wordforms = Array.from(wordforms); // eslint-disable-line no-param-reassign

    const csvOptions = {
      columns:   defaultColumns,
      delimiter: `\t`,
      header:    true,
      quote:     false,
    };

    const csvStream   = createCSVStream(csvOptions);
    const writeStream = createWriteStream(outputPath, `utf8`);

    csvStream
    .on(`error`, reject)
    .pipe(writeStream)
    .on(`error`, reject);

    csvStream.end();
    resolve();

  });

}

module.exports = concordance;
