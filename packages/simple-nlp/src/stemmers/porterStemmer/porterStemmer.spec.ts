import { porterStemmer } from "./porterStemmer";

describe("English Porter Stemmer", () => {
  test("Stemmer function should stem", () => {
    expect(porterStemmer(["run"])).toEqual(["run"]);
    expect(porterStemmer(["running"])).toEqual(["run"]);
    expect(porterStemmer(["cut"])).toEqual(["cut"]);
    expect(porterStemmer(["cutting"])).toEqual(["cut"]);
  });
});
