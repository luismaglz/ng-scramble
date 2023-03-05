import { max, pad, padEnd, padStart } from 'lodash';

export function padText(
  quotes: string[],
  padMethod: 'LEFT' | 'RIGHT' | 'CENTER' = 'LEFT'
): string[] {
  const maxLength = max(quotes.map((q) => q.length)) || 0;
  const padChar: string = '\u00A0';

  return quotes.map((quote) => {
    if (padMethod === 'LEFT') {
      return padStart(quote, maxLength, padChar);
    } else if (padMethod === 'RIGHT') {
      return padEnd(quote, maxLength, padChar);
    } else {
      return pad(quote, maxLength, padChar);
    }
  });
}
