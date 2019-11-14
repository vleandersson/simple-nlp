/*
  Copyright (c) 2019, Domingo Martín Mancera, Hugo W.L. ter Doest (based on https://github.com/dmarman/lorca)

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/

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
