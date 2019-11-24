interface BaseOptions {
  negations?: string[];
}

interface VocSenticonOptions extends BaseOptions {
  vocabulary: {
    [key: string]: { pol: string };
  };
  type: "senticon";
}

interface VocPatternOptions extends BaseOptions {
  vocabulary: {
    [key: string]: { polarity: string };
  };
  type: "pattern";
}

interface VocAfinnOptions extends BaseOptions {
  vocabulary: {
    [key: string]: string;
  };
  type: "afinn";
}

export type SentimentAnalyzerOptions =
  | VocPatternOptions
  | VocSenticonOptions
  | VocAfinnOptions;

export class SentimentAnalyzer {
  private negations?: string[];
  private vocabulary: { [key: string]: number };

  constructor(options: SentimentAnalyzerOptions) {
    this.vocabulary = {};
    this.negations = options.negations;

    switch (options.type) {
      case "senticon":
        Object.keys(options.vocabulary).forEach(word => {
          const polarity = options.vocabulary[word].pol;
          this.vocabulary[word] = polarity ? parseFloat(polarity) : 0;
        });
        break;

      case "pattern":
        Object.keys(options.vocabulary).forEach(word => {
          const polarity = options.vocabulary[word].polarity;

          this.vocabulary[word] = polarity ? parseFloat(polarity) : 0;
        });
        break;

      case "afinn":
        Object.keys(options.vocabulary).forEach(word => {
          this.vocabulary[word] = parseFloat(options.vocabulary[word]);
        });
        break;

      default:
        throw new Error("Unknown vocabulary type");
    }
  }

  public getSentiment(tokens: string[]) {
    let score = 0;
    let negator = 1;
    let nrHits = 0;

    tokens.forEach(token => {
      if (this.negations && this.negations.indexOf(token) > -1) {
        negator = -1;
        nrHits++;
      } else if (this.vocabulary[token]) {
        score += negator * this.vocabulary[token];
        nrHits++;
      }
    });

    score = score / nrHits;

    return { score, nrHits };
  }
}
