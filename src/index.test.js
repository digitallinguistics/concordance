const concordance = require(`./index`);
const parseCSV    = require(`csv-parse/lib/sync`);
const path        = require(`path`);

const {
  readFile,
  remove,
}  = require(`fs-extra`);

const concordancePath = path.join(__dirname, `../test/concordance.tsv`);
const corpusDir       = path.join(__dirname, ``);

// const csvOptions = {
//   columns:   true,
//   delimiter: `\t`,
//   quote:     false,
// };
//
// async function readCSV() {
//   const csvData = await readFile(concordancePath, `utf8`);
//   return parseCSV(csvData, csvOptions);
// }

describe(`concordance`, function() {

  beforeAll(() => remove(concordancePath));

  it(`concordance file has default headers`, async function() {

    await concordance([], corpusDir, concordancePath);
    const csvData   = await readFile(concordancePath, `utf8`);
    const [headers] = parseCSV(csvData, { delimiter: `\t`, quote: false });

    const columns = [
      `text`,
      `utterance`,
      `word`,
      `token`,
    ];

    headers.forEach((h, i) => expect(h).toBe(columns[i]));

  });

  afterEach(() => remove(concordancePath));

});
