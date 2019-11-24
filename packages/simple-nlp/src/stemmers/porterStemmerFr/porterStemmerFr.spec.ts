import { porterStemmerFr } from "./porterStemmerFr";

describe("French Porter Stemmer", () => {
  test("Stemmer function should stem", () => {
    expect(porterStemmerFr(["volera"])).toEqual(["vol"]);
    expect(porterStemmerFr(["volerait"])).toEqual(["vol"]);
    expect(porterStemmerFr(["subitement"])).toEqual(["subit"]);
    expect(porterStemmerFr(["tempérament"])).toEqual(["temper"]);
    expect(porterStemmerFr(["voudriez"])).toEqual(["voudr"]);
    expect(porterStemmerFr(["vengeait"])).toEqual(["veng"]);
    expect(porterStemmerFr(["saisissement"])).toEqual(["sais"]);
    expect(porterStemmerFr(["transatlantique"])).toEqual(["transatlant"]);
    expect(porterStemmerFr(["premièrement"])).toEqual(["premi"]);
    expect(porterStemmerFr(["instruments"])).toEqual(["instrument"]);
    expect(porterStemmerFr(["trouverions"])).toEqual(["trouv"]);
    expect(porterStemmerFr(["voyiez"])).toEqual(["voi"]);
    expect(porterStemmerFr(["publicité"])).toEqual(["publiqu"]);
    expect(porterStemmerFr(["pitoyable"])).toEqual(["pitoi"]);
  });
});
