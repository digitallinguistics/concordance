const createCSVStream = require(`csv-stringify`);
const JSONStream      = require(`JSONStream`);
const path            = require(`path`);
const ProgressBar     = require(`progress`);
const recurse         = require(`recursive-readdir`);

const {
  createReadStream,
  createWriteStream,
  readJSON,
} = require(`fs-extra`);

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

const kwicColumns = [...defaultColumns.slice(0, 3), `pre`, `token`, `post`];

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
 * Accepts an array of DLx Word Token objects and concatenates their transcriptions
 * @param  {Array}  words An array of DLx Word Tokens
 * @return {String}
 */
function concatWords(words) {
  return words
  .map(({ transcription: t }) => getTranscription(t))
  .join(` `);
}

/**
 * Retrieves the value of a transcription
 * @param  {Object|String} txn The value of the DLx transcription property
 * @return {String}
 */
function getTranscription(txn) {
  return typeof txn === `string` ?
    txn :
    txn.eng
    || txn.en
    || txn[Object.keys(txn)[0]];
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
 * @param  {Object}  options     The options passed to the concordance method
 * @return {Promise}
 */
// eslint-disable-next-line max-params
function processFile(filePath, wordforms, csvStream, progressBar, options) {
  return new Promise((resolve, reject) => {

    const title        = path.basename(filePath, `.json`);
    const readStream   = createReadStream(filePath);
    const jsonStream   = JSONStream.parse(`utterances.*`);
    let   utteranceNum = 0;

    jsonStream.on(`data`, ({ words }) => {

      utteranceNum++;

      words.forEach(({ transcription }, i) => {

        const txn = getTranscription(transcription);

        if (!wordforms.includes(txn)) return;

        const wordNum = i + 1;
        const record  = [title, utteranceNum, wordNum];

        if (options.KWIC) {

          const pre  = concatWords(words.slice(0, i));
          const post = concatWords(words.slice(i + 1));

          record.push(...[pre, txn, post]);

        } else {

          record.push(txn);

        }

        csvStream.write(record);

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
 * @param  {Object}  options     The options passed to the concordance method
 * @return {Promise}
 */
function processFiles(files, wordforms, csvStream, progressBar, options) { // eslint-disable-line max-params
  return Promise.all(files.map(file => processFile(file, wordforms, csvStream, progressBar, options)));
}

// MAIN

/**
 * Create a concordance file for a set of wordforms in a JSON corpus
 * @param  {Object}       [options={}]                           An options hash
 * @param  {String}       [options.dir=`.`]                      The directory where the JSON corpus is located
 * @param  {String}       [options.outputPath=`concordance.tsv`] The path where the concordance file should be generated
 * @param  {Boolean}      [options.KWIC=false]                   Whether to output the concordance in Keyword in Context (KWIC) format, with "pre" and "post" columns
 * @param  {String|Array} [options.wordforms=[]]                 A wordform or array of wordforms to concordance
 * @param  {String}       [options.wordlist=undefined]           Path to a file containing a JSON array of words to concordance
 * @return {Promise}
 */
async function concordance(options = {}) {

  const {
    dir        = `.`,
    KWIC       = false,
    outputPath = `concordance.tsv`,
    wordlist,
  } = options;

  let { wordforms = [] } = options;

  if (wordlist) wordforms = await readJSON(wordlist);
  else wordforms = Array.from(wordforms);

  const files      = await recurse(dir, [ignore]);
  const fileGroups = chunk(files, 10);

  const csvOptions = {
    columns:   KWIC ? kwicColumns : defaultColumns,
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
      progressBar,
      { KWIC }
    );
  }

  csvStream.pipe(writeStream);

}

module.exports = concordance;
