import {
  englishNegations,
  dutchNegations,
  spanishNegations,
  englishSenticonVocabulary,
  spanishSenticonVocabulary,
  catalanSenticonVocabulary,
  galicianSenticonVocabuary
} from ".";

console.error(englishSenticonVocabulary.default);

const senticonVocabularies = [
  englishSenticonVocabulary
  // spanishSenticonVocabulary,
  // catalanSenticonVocabulary,
  // galicianSenticonVocabuary
];

describe("Language DB", () => {
  test("Negations should be array", () => {
    expect(englishNegations).toBeInstanceOf(Array);
    expect(dutchNegations).toBeInstanceOf(Array);
    expect(spanishNegations).toBeInstanceOf(Array);
  });

  senticonVocabularies.forEach(voc => {
    test("Senticon should have pol property", () => {
      Object.keys(voc).forEach(key => {
        try {
          expect((voc as any)[key]).toHaveProperty("pol");
        } catch {
          // console.log(key, (voc as any)[key]);
          throw new Error(`Word with key "${key}" failed test`);
        }
      });
    });
  });
});
