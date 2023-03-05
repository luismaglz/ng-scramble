export function unscrambleRightToLeft(
  scrambledText: string,
  originalText: string
) {
  let foundChar: boolean = false;
  const r_scrambledQuote = scrambledText.split('').reverse().join('');
  const r_quote = originalText.split('').reverse().join('');

  const q = r_scrambledQuote.split('').map((char, index) => {
    if (foundChar) {
      return char;
    }

    if (char !== r_quote[index]) {
      foundChar = true;
      return r_quote[index];
    } else {
      return char;
    }
  });

  return q.reverse().join('');
}
