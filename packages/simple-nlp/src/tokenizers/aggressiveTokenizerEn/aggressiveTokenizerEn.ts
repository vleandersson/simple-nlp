import { trim } from "../../helpers";

export function aggressiveTokenizerEn(text: string) {
  return trim(text.split(/\W+/));
}
