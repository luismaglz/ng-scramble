export function unscrambleLeftToRight(
  scrambledText: string,
  originalText: string
) {
  let foundChar: boolean = false;
  const q = scrambledText.split('').map((char, index) => {
    if (foundChar) {
      return char;
    }

    if (char !== originalText[index]) {
      foundChar = true;
      return originalText[index];
    } else {
      return char;
    }
  });

  return q.join('');
}
