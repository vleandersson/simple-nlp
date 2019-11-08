import { porterStemFn } from "./porterStemmer";

test("it should stem run", () => {
  expect(porterStemFn("run")).toEqual("run");
});

test("it should stem running", () => {
  expect(porterStemFn("running")).toEqual("run");
});
