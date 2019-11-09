import { porterStemFrFn } from "./porterStemmerFr";

describe("French Porter Stemmer", () => {
  test("Stemmer function should stem", () => {
    expect(porterStemFrFn("volera")).toEqual("vol");
    expect(porterStemFrFn("volerait")).toEqual("vol");
    expect(porterStemFrFn("subitement")).toEqual("subit");
    expect(porterStemFrFn("tempérament")).toEqual("temper");
    expect(porterStemFrFn("voudriez")).toEqual("voudr");
    expect(porterStemFrFn("vengeait")).toEqual("veng");
    expect(porterStemFrFn("saisissement")).toEqual("sais");
    expect(porterStemFrFn("transatlantique")).toEqual("transatlant");
    expect(porterStemFrFn("premièrement")).toEqual("premi");
    expect(porterStemFrFn("instruments")).toEqual("instrument");
    expect(porterStemFrFn("trouverions")).toEqual("trouv");
    expect(porterStemFrFn("voyiez")).toEqual("voi");
    expect(porterStemFrFn("publicité")).toEqual("publiqu");
    expect(porterStemFrFn("pitoyable")).toEqual("pitoi");
  });
});
