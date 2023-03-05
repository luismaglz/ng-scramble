import { pickRandomListItem } from './pick-random-list-item';

export function scrambleRandom(
  scrambledText: string,
  originalText: string,
  scrambleCharacters: string[]
): string {
  const indexToScramble = pickRandomListItem(
    scrambledText
      .split('')
      .map((char, index) => {
        if (char === originalText[index]) {
          return index;
        } else {
          return -1;
        }
      })
      .filter((x) => x > -1)
  );

  const newString = scrambledText.split('');
  newString[indexToScramble] = pickRandomListItem(
    scrambleCharacters.filter((x) => x !== newString[indexToScramble])
  );

  return newString.join('');
}
