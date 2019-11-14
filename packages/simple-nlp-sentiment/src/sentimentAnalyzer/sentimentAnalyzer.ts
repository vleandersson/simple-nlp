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

type Options = VocPatternOptions | VocSenticonOptions | VocAfinnOptions;

// TODO add options object
export function sentimentAnalyzer(tokens: string[], options: Options) {
  const negations = options.negations || [];
  let _vocabulary: { [key: string]: number };

  // TODO add try catch for parseInt
  switch (options.type) {
    case "senticon":
      Object.keys(options.vocabulary).forEach(word => {
        _vocabulary[word] = parseInt(options.vocabulary[word].pol);
      });
      break;

    case "pattern":
      Object.keys(options.vocabulary).forEach(word => {
        _vocabulary[word] = parseInt(options.vocabulary[word].polarity);
      });
      break;

    case "afinn":
      Object.keys(options.vocabulary).forEach(polarity => {
        _vocabulary[polarity] = parseInt(options.vocabulary[polarity]);
      });
      break;

    default:
      throw new Error("Unknown vocabulary type");
  }

  var score = 0;
  var negator = 1;
  var nrHits = 0;

  tokens.forEach(token => {
    var lowerCased = token.toLowerCase();
    if (negations.indexOf(lowerCased) > -1) {
      negator = -1;
      nrHits++;
    } else if (_vocabulary[lowerCased] !== undefined) {
      score += negator * _vocabulary[lowerCased];
      nrHits++;
    }
  });

  score = score / tokens.length;

  return { score, nrHits };
}
