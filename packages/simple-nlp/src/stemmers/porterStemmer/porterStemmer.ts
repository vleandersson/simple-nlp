import { stemmer } from "../../helpers/stemmerHelpers/stemmerHelpers";

// denote groups of consecutive consonants with a C and consecutive vowels
// with a V.
function categorizeGroups(token: string) {
  return token
    .replace(/[^aeiouy]+y/g, "CV")
    .replace(/[aeiou]+/g, "V")
    .replace(/[^V]+/g, "C");
}

// denote single consonants with a C and single vowels with a V
function categorizeChars(token: string) {
  return token
    .replace(/[^aeiouy]y/g, "CV")
    .replace(/[aeiou]/g, "V")
    .replace(/[^V]/g, "C");
}

// calculate the "measure" M of a word. M is the count of VC sequences dropping
// an initial C if it exists and a trailing V if it exists.
function measure(token: string | null) {
  if (!token) return -1;

  return (
    categorizeGroups(token)
      .replace(/^C/, "")
      .replace(/V$/, "").length / 2
  );
}

// determine if a token end with a double consonant i.e. happ
function endsWithDoublCons(token: string) {
  return token.match(/([^aeiou])\1$/);
}

// replace a pattern in a word. if a replacement occurs an optional callback
// can be called to post-process the result. if no match is made NULL is
// returned.
function attemptReplace(
  token: string,
  pattern: RegExp | string,
  replacement: string,
  callback?: (result: string) => string | null
) {
  let result = null;

  if (typeof pattern == "string" && token.substr(0 - pattern.length) == pattern)
    result = token.replace(new RegExp(pattern + "$"), replacement);
  else if (pattern instanceof RegExp && token.match(pattern))
    result = token.replace(pattern, replacement);

  if (result && callback) return callback(result);
  else return result;
}

// attempt to replace a list of patterns/replacements on a token for a minimum
// measure M.
function attemptReplacePatterns(
  token: string,
  replacements: string[][],
  measureThreshold?: number | null
) {
  let replacement = token;

  for (let i = 0; i < replacements.length; i++) {
    if (
      measureThreshold === null ||
      (measureThreshold &&
        measure(attemptReplace(token, replacements[i][0], replacements[i][1])) >
          measureThreshold)
    ) {
      replacement =
        attemptReplace(replacement, replacements[i][0], replacements[i][2]) ||
        replacement;
    }
  }

  return replacement;
}

// replace a list of patterns/replacements on a word. if no match is made return
// the original token.
function replacePatterns(
  token: string,
  replacements: string[][],
  measureThreshold: number | null
) {
  return attemptReplacePatterns(token, replacements, measureThreshold) || token;
}

// TODO: this should replace all of the messy replacement stuff above
function replaceRegex(
  token: string,
  regex: RegExp,
  includeParts: number[],
  minimumMeasure: number
) {
  let result = "";

  if (regex.test(token)) {
    const parts = regex.exec(token);

    if (parts !== null) {
      includeParts.forEach(i => {
        result += parts[i];
      });
    }
  }

  if (measure(result) > minimumMeasure) {
    return result;
  }

  return null;
}

// step 1a as defined for the porter stemmer algorithm.
function step1a(token: string) {
  if (token.match(/(ss|i)es$/)) {
    return token.replace(/(ss|i)es$/, "$1");
  }

  if (
    token.substr(-1) == "s" &&
    token.substr(-2, 1) != "s" &&
    token.length > 2
  ) {
    return token.replace(/s?$/, "");
  }

  return token;
}

// step 1b as defined for the porter stemmer algorithm.
function step1b(token: string) {
  if (token.substr(-3) == "eed") {
    if (measure(token.substr(0, token.length - 3)) > 0)
      return token.replace(/eed$/, "ee");
  } else {
    let result = attemptReplace(token, /(ed|ing)$/, "", token => {
      if (categorizeGroups(token).indexOf("V") >= 0) {
        result = attemptReplacePatterns(token, [
          ["at", "", "ate"],
          ["bl", "", "ble"],
          ["iz", "", "ize"]
        ]);

        if (result != token) {
          return result;
        } else {
          if (endsWithDoublCons(token) && token.match(/[^lsz]$/)) {
            return token.replace(/([^aeiou])\1$/, "$1");
          }

          if (
            measure(token) == 1 &&
            categorizeChars(token).substr(-3) == "CVC" &&
            token.match(/[^wxy]$/)
          ) {
            return token + "e";
          }
        }

        return token;
      }

      return null;
    });

    if (result) {
      return result;
    }
  }

  return token;
}

// step 1c as defined for the porter stemmer algorithm.
function step1c(token: string) {
  const categorizedGroups = categorizeGroups(token);

  if (
    token.substr(-1) == "y" &&
    categorizedGroups.substr(0, categorizedGroups.length - 1).indexOf("V") > -1
  ) {
    return token.replace(/y$/, "i");
  }

  return token;
}

// step 2 as defined for the porter stemmer algorithm.
function step2(token: string) {
  token = replacePatterns(
    token,
    [
      ["ational", "", "ate"],
      ["tional", "", "tion"],
      ["enci", "", "ence"],
      ["anci", "", "ance"],
      ["izer", "", "ize"],
      ["abli", "", "able"],
      ["bli", "", "ble"],
      ["alli", "", "al"],
      ["entli", "", "ent"],
      ["eli", "", "e"],
      ["ousli", "", "ous"],
      ["ization", "", "ize"],
      ["ation", "", "ate"],
      ["ator", "", "ate"],
      ["alism", "", "al"],
      ["iveness", "", "ive"],
      ["fulness", "", "ful"],
      ["ousness", "", "ous"],
      ["aliti", "", "al"],
      ["iviti", "", "ive"],
      ["biliti", "", "ble"],
      ["logi", "", "log"]
    ],
    0
  );

  return token;
}

// step 3 as defined for the porter stemmer algorithm.
function step3(token: string) {
  return replacePatterns(
    token,
    [
      ["icate", "", "ic"],
      ["ative", "", ""],
      ["alize", "", "al"],
      ["iciti", "", "ic"],
      ["ical", "", "ic"],
      ["ful", "", ""],
      ["ness", "", ""]
    ],
    0
  );
}

// step 4 as defined for the porter stemmer algorithm.
function step4(token: string) {
  return (
    replaceRegex(
      token,
      /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/,
      [1],
      1
    ) ||
    replaceRegex(token, /^(.+?)(s|t)(ion)$/, [1, 2], 1) ||
    token
  );
}

// step 5a as defined for the porter stemmer algorithm.
function step5a(token: string) {
  const m = measure(token.replace(/e$/, ""));

  if (
    m > 1 ||
    (m == 1 &&
      !(
        categorizeChars(token).substr(-4, 3) == "CVC" && token.match(/[^wxy].$/)
      ))
  ) {
    token = token.replace(/e$/, "");
  }

  return token;
}

// step 5b as defined for the porter stemmer algorithm.
function step5b(token: string) {
  if (measure(token) > 1) {
    return token.replace(/ll$/, "l");
  }

  return token;
}

// perform full stemming algorithm on a single word
const porterStemFn = (token: string) => {
  if (token.length < 3) return token;
  return step5b(
    step5a(step4(step3(step2(step1c(step1b(step1a(token.toLowerCase())))))))
  ).toString();
};

export const porterStemmer = (text: string[]) => stemmer(text, porterStemFn);
