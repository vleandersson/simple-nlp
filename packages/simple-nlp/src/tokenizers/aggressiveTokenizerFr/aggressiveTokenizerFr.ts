import { trim } from "../../helpers";

export function aggressiveTokenizerFr(text: string) {
  return trim(text.split(/[^a-z0-9äâàéèëêïîöôùüûœç]+/i));
}
