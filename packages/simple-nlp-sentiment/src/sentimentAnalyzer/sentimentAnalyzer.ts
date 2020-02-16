import {
  SenticonVocabulary,
  PatternVocabulary,
  AfinnVocabulary
} from "../languageDB/vocabulary";

interface BaseOptions {
  negations?: string[];
}

interface VocSenticonOptions extends BaseOptions {
  vocabulary: SenticonVocabulary;
  type: "senticon";
}

interface VocPatternOptions extends BaseOptions {
  vocabulary: PatternVocabulary;
  type: "pattern";
}

interface VocAfinnOptions extends BaseOptions {
  vocabulary: AfinnVocabulary;
  type: "afinn";
}

interface GetSentimentOptions {
  denominator: "tokenLength" | "nrOfHits";
}

export type SentimentAnalyzerOptions =
  | VocPatternOptions
  | VocSenticonOptions
  | VocAfinnOptions;

export class SentimentAnalyzer {
  private negations?: string[];
  private vocabulary: Map<string, number>;
  private __vocabulary: Map<string, number>;

  constructor(options: SentimentAnalyzerOptions) {
    this.vocabulary = new Map();
    this.negations = options.negations;

    switch (options.type) {
      case "senticon":
        Object.keys(options.vocabulary).forEach(word => {
          const polarity = options.vocabulary[word].pol;
          const parsedPolarity = polarity ? parseFloat(polarity) : 0;

          this.vocabulary.set(word, parsedPolarity);
        });
        break;

      case "pattern":
        Object.keys(options.vocabulary).forEach(word => {
          const polarity = options.vocabulary[word].polarity;
          const parsedPolarity = polarity ? parseFloat(polarity) : 0;

          this.vocabulary.set(word, parsedPolarity);
        });
        break;

      case "afinn":
        Object.keys(options.vocabulary).forEach(word => {
          const parsedPolarity = parseFloat(options.vocabulary[word]);

          this.vocabulary.set(word, parsedPolarity);
        });
        break;

      default:
        throw new Error("Unknown vocabulary type");
    }

    // Store the original version of the vocabulary
    this.__vocabulary = new Map(this.vocabulary);
  }

  /**
   * Stems the stored vocabulary with a given stemmer
   * This should be done using the same stemmer as used
   * on the corpus
   * @param stemmer
   */
  public stemVocabulary(stemmer: (text: string[]) => string[]) {
    const stemmedVocabulary: { [key: string]: number[] } = {};
    this.vocabulary.clear();

    this.__vocabulary.forEach((score, token) => {
      const stemmedToken = stemmer([token])[0];

      if (stemmedVocabulary[stemmedToken]) {
        stemmedVocabulary[stemmedToken].push(score);
      } else {
        stemmedVocabulary[stemmedToken] = [score];
      }
    });

    // Calculate the mean score for each token
    Object.keys(stemmedVocabulary).map(key => {
      const mean =
        stemmedVocabulary[key].reduce((acc, res) => {
          return acc + res;
        }) / stemmedVocabulary[key].length;

      this.vocabulary.set(key, mean);
    });
  }

  public getSentiment(tokens: string[], options?: GetSentimentOptions) {
    let score = 0;
    let negator = 1;
    let nrHits = 0;

    tokens.forEach(token => {
      const vocaScore = this.vocabulary.get(token);

      if (this.negations && this.negations.indexOf(token) > -1) {
        negator = -1;
        nrHits++;
      } else if (vocaScore !== undefined) {
        score += negator * vocaScore;
        nrHits++;
      }
    });

    switch (options && options.denominator) {
      case "nrOfHits":
        score /= nrHits;
        break;

      case "tokenLength":
      default:
        score /= tokens.length;
        break;
    }

    return { score, nrHits };
  }
}
