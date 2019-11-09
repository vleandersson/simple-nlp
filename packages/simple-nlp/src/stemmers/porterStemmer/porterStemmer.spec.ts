import { porterStemFn } from "./porterStemmer";

describe("English Porter Stemmer", () => {
  test("Stemmer function should stem", () => {
    expect(porterStemFn("run")).toEqual("run");
    expect(porterStemFn("running")).toEqual("run");
    expect(porterStemFn("cut")).toEqual("cut");
    expect(porterStemFn("cutting")).toEqual("cut");
  });
});
