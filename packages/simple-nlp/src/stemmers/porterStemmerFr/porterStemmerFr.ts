import { stemmer } from "../../helpers/stemmerHelpers/stemmerHelpers";

export const porterStemmerFr = (text: string[]) =>
  stemmer(text, porterStemFrFn);

/**
 * Stem a word thanks to Porter Stemmer rules
 * @param  {String} token Word to be stemmed
 * @return {String}       Stemmed word
 */
function porterStemFrFn(token: string) {
  token = prelude(token.toLowerCase());

  if (token.length == 1) return token;

  const regs = regions(token);

  let r1_txt, r2_txt, rv_txt;
  r1_txt = token.substring(regs.r1);
  r2_txt = token.substring(regs.r2);
  rv_txt = token.substring(regs.rv);

  // Step 1
  const beforeStep1 = token;
  let suf, pref2, pref3, letterBefore, letter2Before, i;
  let doStep2a = false;

  if (
    (suf = endsinArr(r2_txt, [
      "ance",
      "iqUe",
      "isme",
      "able",
      "iste",
      "eux",
      "ances",
      "iqUes",
      "ismes",
      "ables",
      "istes"
    ])) != ""
  ) {
    token = token.slice(0, -suf.length); // delete
  } else if (
    (suf = endsinArr(token, [
      "icatrice",
      "icateur",
      "ication",
      "icatrices",
      "icateurs",
      "ications"
    ])) != ""
  ) {
    if (
      endsinArr(r2_txt, [
        "icatrice",
        "icateur",
        "ication",
        "icatrices",
        "icateurs",
        "ications"
      ]) != ""
    ) {
      token = token.slice(0, -suf.length); // delete
    } else {
      token = token.slice(0, -suf.length) + "iqU"; // replace by iqU
    }
  } else if (
    (suf = endsinArr(r2_txt, [
      "atrice",
      "ateur",
      "ation",
      "atrices",
      "ateurs",
      "ations"
    ])) != ""
  ) {
    token = token.slice(0, -suf.length); // delete
  } else if ((suf = endsinArr(r2_txt, ["logie", "logies"])) != "") {
    token = token.slice(0, -suf.length) + "log"; // replace with log
  } else if (
    (suf = endsinArr(r2_txt, ["usion", "ution", "usions", "utions"])) != ""
  ) {
    token = token.slice(0, -suf.length) + "u"; // replace with u
  } else if ((suf = endsinArr(r2_txt, ["ence", "ences"])) != "") {
    token = token.slice(0, -suf.length) + "ent"; // replace with ent
  }
  // ement(s)
  else if ((suf = endsinArr(r1_txt, ["issement", "issements"])) != "") {
    if (!isVowel(token[token.length - suf.length - 1])) {
      token = token.slice(0, -suf.length); // delete
      r1_txt = token.substring(regs.r1);
      r2_txt = token.substring(regs.r2);
      rv_txt = token.substring(regs.rv);
    }
  } else if ((suf = endsinArr(r2_txt, ["ativement", "ativements"])) != "") {
    token = token.slice(0, -suf.length); // delete
  } else if ((suf = endsinArr(r2_txt, ["ivement", "ivements"])) != "") {
    token = token.slice(0, -suf.length); // delete
  } else if ((suf = endsinArr(token, ["eusement", "eusements"])) != "") {
    if ((suf = endsinArr(r2_txt, ["eusement", "eusements"])) != "")
      token = token.slice(0, -suf.length);
    // delete
    else if ((suf = endsinArr(r1_txt, ["eusement", "eusements"])) != "")
      token = token.slice(0, -suf.length) + "eux";
    // replace by eux
    else if ((suf = endsinArr(rv_txt, ["ement", "ements"])) != "")
      token = token.slice(0, -suf.length); // delete
  } else if (
    (suf = endsinArr(r2_txt, [
      "ablement",
      "ablements",
      "iqUement",
      "iqUements"
    ])) != ""
  ) {
    token = token.slice(0, -suf.length); // delete
  } else if (
    (suf = endsinArr(rv_txt, [
      "ièrement",
      "ièrements",
      "Ièrement",
      "Ièrements"
    ])) != ""
  ) {
    token = token.slice(0, -suf.length) + "i"; // replace by i
  } else if ((suf = endsinArr(rv_txt, ["ement", "ements"])) != "") {
    token = token.slice(0, -suf.length); // delete
  }
  // ité(s)
  else if ((suf = endsinArr(token, ["icité", "icités"])) != "") {
    if (endsinArr(r2_txt, ["icité", "icités"]) != "")
      token = token.slice(0, -suf.length);
    // delete
    else token = token.slice(0, -suf.length) + "iqU"; // replace by iqU
  } else if ((suf = endsinArr(token, ["abilité", "abilités"])) != "") {
    if (endsinArr(r2_txt, ["abilité", "abilités"]) != "")
      token = token.slice(0, -suf.length);
    // delete
    else token = token.slice(0, -suf.length) + "abl"; // replace by abl
  } else if ((suf = endsinArr(r2_txt, ["ité", "ités"])) != "") {
    token = token.slice(0, -suf.length); // delete if in R2
  } else if (
    (suf = endsinArr(token, ["icatif", "icative", "icatifs", "icatives"])) != ""
  ) {
    if (
      (suf = endsinArr(r2_txt, ["icatif", "icative", "icatifs", "icatives"])) !=
      ""
    ) {
      token = token.slice(0, -suf.length); // delete
      r2_txt = token.substring(regs.r2);
      rv_txt = token.substring(regs.rv);
    }
    if ((suf = endsinArr(r2_txt, ["atif", "ative", "atifs", "atives"])) != "") {
      token = token.slice(0, -suf.length - 2) + "iqU"; // replace with iqU
      r2_txt = token.substring(regs.r2);
      rv_txt = token.substring(regs.rv);
    }
  } else if (
    (suf = endsinArr(r2_txt, ["atif", "ative", "atifs", "atives"])) != ""
  ) {
    token = token.slice(0, -suf.length); // delete
  } else if ((suf = endsinArr(r2_txt, ["if", "ive", "ifs", "ives"])) != "") {
    token = token.slice(0, -suf.length); // delete
  } else if ((suf = endsinArr(token, ["eaux"])) != "") {
    token = token.slice(0, -suf.length) + "eau"; // replace by eau
  } else if ((suf = endsinArr(r1_txt, ["aux"])) != "") {
    token = token.slice(0, -suf.length) + "al"; // replace by al
  } else if ((suf = endsinArr(r2_txt, ["euse", "euses"])) != "") {
    token = token.slice(0, -suf.length); // delete
  } else if ((suf = endsinArr(r1_txt, ["euse", "euses"])) != "") {
    token = token.slice(0, -suf.length) + "eux"; // replace by eux
  } else if ((suf = endsinArr(rv_txt, ["amment"])) != "") {
    token = token.slice(0, -suf.length) + "ant"; // replace by ant
    doStep2a = true;
  } else if ((suf = endsinArr(rv_txt, ["emment"])) != "") {
    token = token.slice(0, -suf.length) + "ent"; // replace by ent
    doStep2a = true;
  } else if ((suf = endsinArr(rv_txt, ["ment", "ments"])) != "") {
    // letter before must be a vowel in RV
    letterBefore = token[token.length - suf.length - 1];
    if (isVowel(letterBefore) && endsin(rv_txt, letterBefore + suf)) {
      token = token.slice(0, -suf.length); // delete
      doStep2a = true;
    }
  }

  // re compute regions
  r1_txt = token.substring(regs.r1);
  r2_txt = token.substring(regs.r2);
  rv_txt = token.substring(regs.rv);

  // Step 2a
  const beforeStep2a = token;
  let step2aDone = false;
  if (beforeStep1 === token || doStep2a) {
    step2aDone = true;
    if (
      (suf = endsinArr(rv_txt, [
        "îmes",
        "ît",
        "îtes",
        "i",
        "ie",
        "Ie",
        "ies",
        "ir",
        "ira",
        "irai",
        "iraIent",
        "irais",
        "irait",
        "iras",
        "irent",
        "irez",
        "iriez",
        "irions",
        "irons",
        "iront",
        "is",
        "issaIent",
        "issais",
        "issait",
        "issant",
        "issante",
        "issantes",
        "issants",
        "isse",
        "issent",
        "isses",
        "issez",
        "issiez",
        "issions",
        "issons",
        "it"
      ])) != ""
    ) {
      letterBefore = token[token.length - suf.length - 1];
      if (!isVowel(letterBefore) && endsin(rv_txt, letterBefore + suf))
        token = token.slice(0, -suf.length); // delete
    }
  }

  // Step 2b
  if (step2aDone && token === beforeStep2a) {
    if (
      (suf = endsinArr(rv_txt, [
        "é",
        "ée",
        "ées",
        "és",
        "èrent",
        "er",
        "era",
        "erai",
        "eraIent",
        "erais",
        "erait",
        "eras",
        "erez",
        "eriez",
        "erions",
        "erons",
        "eront",
        "ez",
        "iez",
        "Iez"
      ])) != ""
    ) {
      token = token.slice(0, -suf.length); // delete
      r2_txt = token.substring(regs.r2);
      rv_txt = token.substring(regs.rv);
    } else if (
      (suf = endsinArr(rv_txt, ["ions"])) != "" &&
      endsinArr(r2_txt, ["ions"])
    ) {
      token = token.slice(0, -suf.length); // delete
      r2_txt = token.substring(regs.r2);
      rv_txt = token.substring(regs.rv);
    }
    // add 'Ie' suffix to pass test for 'évanouie'
    else if (
      (suf = endsinArr(rv_txt, [
        "âmes",
        "ât",
        "âtes",
        "a",
        "ai",
        "aIent",
        "ais",
        "ait",
        "ant",
        "ante",
        "antes",
        "ants",
        "as",
        "asse",
        "assent",
        "asses",
        "assiez",
        "assions"
      ])) != ""
    ) {
      token = token.slice(0, -suf.length); // delete

      letterBefore = token[token.length - 1];
      if (letterBefore === "e" && endsin(rv_txt, "e" + suf))
        token = token.slice(0, -1);

      r2_txt = token.substring(regs.r2);
      rv_txt = token.substring(regs.rv);
    }
  }

  // Step 3
  if (!(token === beforeStep1)) {
    if (token[token.length - 1] === "Y") token = token.slice(0, -1) + "i";
    if (token[token.length - 1] === "ç") token = token.slice(0, -1) + "c";
  } // Step 4
  else {
    letterBefore = token[token.length - 1];
    letter2Before = token[token.length - 2];

    if (
      letterBefore === "s" &&
      ["a", "i", "o", "u", "è", "s"].indexOf(letter2Before) == -1
    ) {
      token = token.slice(0, -1);
      r1_txt = token.substring(regs.r1);
      r2_txt = token.substring(regs.r2);
      rv_txt = token.substring(regs.rv);
    }

    if ((suf = endsinArr(r2_txt, ["ion"])) != "") {
      letterBefore = token[token.length - suf.length - 1];
      if (letterBefore === "s" || letterBefore === "t") {
        token = token.slice(0, -suf.length); // delete
        r1_txt = token.substring(regs.r1);
        r2_txt = token.substring(regs.r2);
        rv_txt = token.substring(regs.rv);
      }
    }

    if ((suf = endsinArr(rv_txt, ["ier", "ière", "Ier", "Ière"])) != "") {
      token = token.slice(0, -suf.length) + "i"; // replace by i
      r1_txt = token.substring(regs.r1);
      r2_txt = token.substring(regs.r2);
      rv_txt = token.substring(regs.rv);
    }
    if ((suf = endsinArr(rv_txt, "e")) != "") {
      token = token.slice(0, -suf.length); // delete
      r1_txt = token.substring(regs.r1);
      r2_txt = token.substring(regs.r2);
      rv_txt = token.substring(regs.rv);
    }
    if ((suf = endsinArr(rv_txt, "ë")) != "") {
      if (token.slice(token.length - 3, -1) === "gu")
        token = token.slice(0, -suf.length); // delete
    }
  }

  // Step 5
  if ((suf = endsinArr(token, ["enn", "onn", "ett", "ell", "eill"])) != "") {
    token = token.slice(0, -1); // delete last letter
  }

  // Step 6
  i = token.length - 1;
  while (i > 0) {
    if (!isVowel(token[i])) {
      i--;
    } else if (
      i !== token.length - 1 &&
      (token[i] === "é" || token[i] === "è")
    ) {
      token =
        token.substring(0, i) + "e" + token.substring(i + 1, token.length);
      break;
    } else {
      break;
    }
  }

  return token.toLowerCase();
}

/**
 * Compute r1, r2, rv regions as required by french porter stemmer algorithm
 * @param  {String} token Word to compute regions on
 * @return {Object}       Regions r1, r2, rv as offsets from the begining of the word
 */
function regions(token: string) {
  let r1, r2, rv, len;
  let i;

  r1 = r2 = rv = len = token.length;

  // R1 is the region after the first non-vowel following a vowel,
  for (let i = 0; i < len - 1 && r1 == len; i++) {
    if (isVowel(token[i]) && !isVowel(token[i + 1])) {
      r1 = i + 2;
    }
  }
  // Or is the null region at the end of the word if there is no such non-vowel.

  // R2 is the region after the first non-vowel following a vowel in R1
  for (i = r1; i < len - 1 && r2 == len; i++) {
    if (isVowel(token[i]) && !isVowel(token[i + 1])) {
      r2 = i + 2;
    }
  }
  // Or is the null region at the end of the word if there is no such non-vowel.

  // RV region
  const three = token.slice(0, 3);
  if (isVowel(token[0]) && isVowel(token[1])) {
    rv = 3;
  }
  if (three === "par" || three == "col" || three === "tap") rv = 3;
  // the region after the first vowel not at the beginning of the word or null
  else {
    for (i = 1; i < len - 1 && rv == len; i++) {
      if (isVowel(token[i])) {
        rv = i + 1;
      }
    }
  }

  return {
    r1: r1,
    r2: r2,
    rv: rv
  };
}

/**
 * Pre-process/prepare words as required by french porter stemmer algorithm
 * @param  {String} token Word to be prepared
 * @return {String}       Prepared word
 */
function prelude(token: string) {
  token = token.toLowerCase();

  let result = "";
  let i = 0;

  // special case for i = 0 to avoid '-1' index
  if (token[i] === "y" && isVowel(token[i + 1])) {
    result += token[i].toUpperCase();
  } else {
    result += token[i];
  }

  for (i = 1; i < token.length; i++) {
    if (
      (token[i] === "u" || token[i] === "i") &&
      isVowel(token[i - 1]) &&
      isVowel(token[i + 1])
    ) {
      result += token[i].toUpperCase();
    } else if (
      token[i] === "y" &&
      (isVowel(token[i - 1]) || isVowel(token[i + 1]))
    ) {
      result += token[i].toUpperCase();
    } else if (token[i] === "u" && token[i - 1] === "q") {
      result += token[i].toUpperCase();
    } else {
      result += token[i];
    }
  }

  return result;
}

/**
 * Return longest matching suffixes for a token or '' if no suffix match
 * @param  {String} token    Word to find matching suffix
 * @param  {Array} suffixes  Array of suffixes to test matching
 * @return {String}          Longest found matching suffix or ''
 */
function endsinArr(token: string, suffixes: string[] | string) {
  let i,
    longest = "";
  for (i = 0; i < suffixes.length; i++) {
    if (endsin(token, suffixes[i]) && suffixes[i].length > longest.length)
      longest = suffixes[i];
  }

  return longest;
}

// TODO: Let this be an array and do vowelArray.includes(letter)
function isVowel(letter: string) {
  return (
    letter == "a" ||
    letter == "e" ||
    letter == "i" ||
    letter == "o" ||
    letter == "u" ||
    letter == "y" ||
    letter == "â" ||
    letter == "à" ||
    letter == "ë" ||
    letter == "é" ||
    letter == "ê" ||
    letter == "è" ||
    letter == "ï" ||
    letter == "î" ||
    letter == "ô" ||
    letter == "û" ||
    letter == "ù"
  );
}

function endsin(token: string, suffix: string) {
  if (token.length < suffix.length) return false;
  return token.slice(-suffix.length) == suffix;
}
