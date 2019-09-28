const createCSVStream = require(`csv-stringify`);
const JSONStream      = require(`JSONStream`);
const path            = require(`path`);
const ProgressBar     = require(`progress`);
const recurse         = require(`recursive-readdir`);

const {
  createReadStream,
  createWriteStream,
} = require(`fs`);

// CONSTANTS

/**
 * Default columns to include in the concordance file
 * @type {Array}
 */
const defaultColumns = [
  `text`,
  `utterance`,
  `word`,
  `token`,
];

// METHODS

/**
 * Groups items in an array into groups of the specified length
 * @param  {Array}   arr The array to chunk
 * @return {Integer}     The size of each chunk
 */
function chunk(arr, size) {

  const chunks = [];
  let   i      = 0;

  while (i < arr.length) {
    chunks.push(arr.slice(i, size + i));
    i += size;
  }

  return chunks;

}

/**
 * Ignore method passed to recursive-readdir. Ignores all non-JSON files.
 * @param  {String}  filePath The file path to check
 * @param  {Object}  stats    An fs.stats object
 * @return {Boolean}          Returns true if the file should be ignored
 */
function ignore(filePath, stats) {
  if (stats.isDirectory()) return false;
  return path.extname(filePath) !== `.json`;
}

/**
 * Adds the specified wordforms from the provided file to the concordance file
 * @param  {String}  filePath    The path to the file to concordance
 * @param  {Array}   wordforms   An array of wordforms to concordance
 * @param  {Stream}  csvStream   The CSV stream
 * @param  {Object}  progressBar The progress bar to increment
 * @return {Promise}
 */
function processFile(filePath, wordforms, csvStream, progressBar) {
  return new Promise((resolve, reject) => {

    const title        = path.basename(filePath, `.json`);
    const readStream   = createReadStream(filePath);
    const jsonStream   = JSONStream.parse(`utterances.*`);
    let   utteranceNum = 0;

    jsonStream.on(`data`, ({ words }) => {

      utteranceNum++;

      words.forEach(({ transcription }, i) => {

        const txn = typeof transcription === `string` ?
          transcription :
          transcription.eng
            || transcription.en
            || transcription[Object.keys(transcription)[0]];

        if (!wordforms.includes(txn)) return;

        const wordNum = i + 1;

        csvStream.write([
          title,
          utteranceNum,
          wordNum,
          txn,
        ]);

      });

    });

    jsonStream.on(`end`, () => {
      progressBar.tick();
      resolve();
    });

    readStream
    .on(`error`, reject)
    .pipe(jsonStream)
    .on(`error`, reject);

  });
}

/**
 * Adds tokens to concordance file from each of the specified files.
 * Processes the group of files in parallel.
 * @param  {Array}   files       Array of file paths to process
 * @param  {Array}   wordforms   Array of wordforms to list the tokens of
 * @param  {Stream}  csvStream   The CSV stream
 * @param  {Object}  progressBar The progress bar to increment
 * @return {Promise}
 */
function processFiles(files, wordforms, csvStream, progressBar) {
  return Promise.all(files.map(file => processFile(file, wordforms, csvStream, progressBar)));
}

// MAIN

async function concordance(
  wordforms,
  dir = `.`,
  outputPath = `concordance.tsv`
) {

  wordforms = Array.from(wordforms); // eslint-disable-line no-param-reassign

  const files      = await recurse(dir, [ignore]);
  const fileGroups = chunk(files, 10);

  const csvOptions = {
    columns:   defaultColumns,
    delimiter: `\t`,
    header:    true,
    quote:     false,
  };

  const csvStream   = createCSVStream(csvOptions);
  const writeStream = createWriteStream(outputPath, `utf8`);
  const progressBar = new ProgressBar(`:bar`, { total: files.length });

  csvStream.on(`error`, console.error);
  writeStream.on(`error`, console.error);

  // process each group of files sequentially
  for (const fileGroup of fileGroups) {
    await processFiles( // eslint-disable-line no-await-in-loop
      fileGroup,
      wordforms,
      csvStream,
      progressBar
    );
  }

  csvStream.pipe(writeStream);

}

module.exports = concordance;
