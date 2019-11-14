interface VocSenticon {
  vocabulary: {
    [key: string]: { pol: number };
  };
  type: "senticon";
}

interface VocPattern {
  vocabulary: {
    [key: string]: { polarity: number };
  };
  type: "pattern";
}

interface VocAfinn {
  vocabulary: {
    [key: string]: number;
  };
  type: "afinn";
}

type Vocabulary = VocPattern | VocSenticon | VocAfinn;

export function sentimentAnalyzer(
  tokens: string[],
  negations: string[] = [],
  voc: Vocabulary
) {
  let _vocabulary: { [key: string]: number };

  switch (voc.type) {
    case "senticon":
      Object.keys(voc.vocabulary).forEach(word => {
        _vocabulary[word] = voc.vocabulary[word].pol;
      });
      break;

    case "pattern":
      Object.keys(voc.vocabulary).forEach(word => {
        _vocabulary[word] = voc.vocabulary[word].polarity;
      });
      break;

    case "afinn":
      _vocabulary = voc.vocabulary;
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
