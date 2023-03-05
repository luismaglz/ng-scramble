import { pickRandomListItem } from './pick-random-list-item';

export function scrambleText(
  textToScramble: string,
  scrambleCharacters: string[]
): string {
  return textToScramble
    .split('')
    .map((char) =>
      pickRandomListItem(scrambleCharacters.filter((x) => x !== char))
    )
    .join('');
}
