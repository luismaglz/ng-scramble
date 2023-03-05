export function isTextFullyScrambled(
  scrambledQuote: string,
  quote: string
): boolean {
  return scrambledQuote.split('').every((item, index) => quote[index] !== item);
}
