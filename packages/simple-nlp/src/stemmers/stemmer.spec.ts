import { stemmer } from "./stemmer";
import { porterStemFn } from "./porterStemmer/porterStemmer";

test("Stemmer should use porterStemFn to stem an array of words", () => {
  expect(stemmer(["cutting", "running"], porterStemFn)).toEqual(["cut", "run"]);
});
