# Concordance

[![GitHub releases](https://img.shields.io/github/v/release/digitallinguistics/concordance)][releases]
[![status](https://github.com/digitallinguistics/concordance/workflows/tests/badge.svg)][actions]
[![issues](https://img.shields.io/github/issues/digitallinguistics/concordance)][issues]
[![npm downloads](https://img.shields.io/npm/dt/digitallinguistics/concordance)][npm]
[![license](https://img.shields.io/github/license/digitallinguistics/concordance)][license]
[![GitHub stars](https://img.shields.io/github/stars/digitallinguistics/concordance?style=social)][GitHub]

The Digital Linguistics (DLx) Concordance library is a Node.js library for creating a concordance of words in a [corpus][corpus] (a collection of texts in a language) which is formatted according to the [Data Format for Digital Linguistics][DaFoDiL] (<abbr title='Data Format for Digital Linguistics'>DaFoDiL</abbr>) (a JSON-based format). It is useful for anybody doing research involving linguistic corpora. If your data are not yet in DaFoDiL format, there are several converters available [here][converters].

This library produces a tab-delimited file containing information about each token (instance) of the words specified. By default, the concordance is generated in <dfn>Keyword in Context</dfn> (<abbr>KWIC</abbr>) format, where the word is listed along with the immediately preceding and following context. An example of a partial concordance of the word _little_ in _The Three Little Pigs_ is shown in KWIC format below.

text | utterance | word |                        pre | token  | post                     |
---- | --------- | ---- | -------------------------: | :----: | ------------------------ |
3LP  | 1         | 14   | mother pig who had three   | little | pigs and not enough food |
3LP  | 3         | 3    | The first                  | little | pig was very lazy.       |
3LP  | 5         | 3    | The second                 | little | pig worked a little bit  |
3LP  | 5         | 7    | second little pig worked a | little | bit harder but he was    |
3LP  | 7         | 3    | The third                  | little | pig worked hard all day  |

**NOTE:** _This project is still in initial development phases, but should be ready for initial release by the end of September 2019._

## Contributing

[Report an issue or suggest a feature here.][issues]

Pull requests are very welcome. Please make sure you've [opened and issue][issues] for your change first.

You can run the tests for this library by running `npm test` on the command line. Tests are written using [Jasmine][Jasmine].

## About

This library is authored and maintained by [Daniel W. Hieber][me].

[actions]:    https://github.com/digitallinguistics/concordance/actions
[converters]: https://developer.digitallinguistics.io/#converters
[corpus]:     https://en.wikipedia.org/wiki/Text_corpus
[DaFoDiL]:    https://format.digitallinguistics.io/
[GitHub]:     https://github.com/digitallinguistics/concordance
[issues]:     https://github.com/digitallinguistics/concordance/issues
[Jasmine]:    https://jasmine.github.io/
[license]:    https://github.com/digitallinguistics/concordance/blob/master/LICENSE.md
[me]:         https://danielhieber.com/
[npm]:        https://www.npmjs.com/package/@digitallinguistics/concordance
[releases]:   https://github.com/digitallinguistics/concordance/releases
