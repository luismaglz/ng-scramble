import { last } from 'lodash';
import { pickRandomListItem } from './pick-random-list-item';

export function scrambleRightToLeft(
  originalText: string,
  scrambledText: string,
  scrambleCharacters: string[]
): string {
  const indexToScramble = last(
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

  if (indexToScramble !== undefined) {
    const newString = scrambledText.split('');
    newString[indexToScramble] = pickRandomListItem(
      scrambleCharacters.filter((x) => x !== newString[indexToScramble])
    );
    return newString.join('');
  }

  return scrambledText;
}
