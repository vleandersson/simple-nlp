import { stemmer } from "./stemmerHelpers";

const porterStemFn = (token: string) => {
  switch (token) {
    case "cutting":
      return "cut";

    case "running":
      return "run";

    default:
      return "NULL";
  }
};

test("Stemmer should use porterStemFn to stem an array of words", () => {
  expect(stemmer(["cutting", "running"], porterStemFn)).toEqual(["cut", "run"]);
});
