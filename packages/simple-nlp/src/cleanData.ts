interface ICleanData {
  tokenizer: (text: string) => string[];
  stemmer?: (text: string[]) => string[];
  text: string;
}

export function cleanData({ text, tokenizer, stemmer }: ICleanData) {
  const tokenized = tokenizer(text);

  const stemmed = stemmer ? stemmer(tokenized) : tokenized;

  return stemmed;
}
