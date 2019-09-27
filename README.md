# Concordance

The Digital Linguistics (DLx) Concordance library is a Node.js library for performing concordance-related tasks on [corpora][corpus] (collections of texts in a language) which are formatted according to the [Data Format for Digital Linguistics][DaFoDiL] (<abbr title='Data Format for Digital Linguistics'>DaFoDiL</abbr>) (a JSON-based format). It is useful for anybody doing research involving linguistic corpora. If your data are not yet in DaFoDiL format, there are several converters available [here][converters].

**NOTE:** _This project is still in initial development phases, but should be ready for initial release by the end of September 2019._

## Planned Features

* Can be installed locally or globally. If installed globally, can be run using the `dlx-conc` command on the command line.

* Can be run as a module or from the command line.

* Accepts three arguments:

  1. **wordform(s):** wordform or array of wordforms to concordance

  2. **directory:** the directory where the corpus of DLx texts are located

  3. **destination:** the path where the concordance file should be generated

* Generates a tab-delimited file with the following columns (essentially a [Keyword-in-Context][KWIC] (KWIC) format):

  - `text`: the title of the text (taken from either the English title, the first title in the title object, or the name of the file)

  - `utterance`: the number of the utterance in the text (starting at 1)

  - `pre`: the text immediately prior to the token within the utterance

  - `token`: the transcription of the token

  - `post`: the text immediately after the token within the utterance

  - `transcription`: the transcription of the utterance

  - `translation`: the translation of the utterance

  If no transcription is available, it is constituted by concatenating the individual tokens within the utterance.

* Supports the following options:

  - `KWIC = true`: If `true`, includes the `pre` and `post` columns.

  - `transcription = false`: If `true`, includes the `transcription` column. Can also pass a string with the abbreviation of the preferred orthography to use.

  - `translation = false`: If `true`, includes the `translation` column. Can also pass a string with the abbreviation of the preferred orthography to use.

[converters]: https://developer.digitallinguistics.io/#converters
[corpus]:     https://en.wikipedia.org/wiki/Text_corpus
[DaFoDiL]:    https://format.digitallinguistics.io/
[KWIC]:       https://en.wikipedia.org/wiki/Key_Word_in_Context
