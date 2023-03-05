import { pickRandomListItem } from './pick-random-list-item';

export function unscrambleRandom(scrambledText: string, originalText: string) {
  const indexToUnscramble = pickRandomListItem(
    scrambledText
      .split('')
      .map((char, index) => {
        if (char === originalText[index]) {
          return -1;
        } else {
          return index;
        }
      })
      .filter((x) => x > -1)
  );

  const newString = scrambledText.split('');
  newString[indexToUnscramble] = originalText[indexToUnscramble];

  return newString.join('');
}
