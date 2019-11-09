import { aggressiveTokenizerEn } from "./aggressiveTokenizerEn";

describe("Aggressive tokenizer", () => {
  test("normal sentence", () => {
    expect(aggressiveTokenizerEn("I am running")).toEqual([
      "I",
      "am",
      "running"
    ]);
  });

  test("should swallow punctuation", function() {
    expect(aggressiveTokenizerEn("these are things, no")).toEqual([
      "these",
      "are",
      "things",
      "no"
    ]);
  });

  test("should swallow final punctuation", function() {
    expect(aggressiveTokenizerEn("these are things, no?")).toEqual([
      "these",
      "are",
      "things",
      "no"
    ]);
  });

  test("should swallow initial punctuation", function() {
    expect(aggressiveTokenizerEn(".these are things, no")).toEqual([
      "these",
      "are",
      "things",
      "no"
    ]);
  });

  test("should swallow duplicate punctuation", function() {
    expect(aggressiveTokenizerEn("i shal... pause")).toEqual([
      "i",
      "shal",
      "pause"
    ]);
  });
});
