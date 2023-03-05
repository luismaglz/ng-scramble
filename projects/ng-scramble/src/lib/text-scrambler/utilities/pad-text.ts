import { max, padEnd, padStart } from 'lodash';

export function padText(
  quotes: string[],
  pad: 'left' | 'right' = 'left'
): string[] {
  const maxLength = max(quotes.map((q) => q.length)) || 0;
  const padChar: string = '\u00A0';

  return quotes.map((quote) => {
    if (pad === 'left') {
      return padStart(quote, maxLength, padChar);
    } else {
      return padEnd(quote, maxLength, padChar);
    }
  });
}
