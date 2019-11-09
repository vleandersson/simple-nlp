export const stemmer = (
  tokens: string[],
  stemmerFn: (token: string) => string
) => {
  return tokens.map(t => stemmerFn(t));
};
