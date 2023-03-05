import { scrambleRightToLeft } from './scramble-right-to-left';

describe('scrambleRightToLeft', () => {
  it('should last character', () => {
    const result = scrambleRightToLeft('sample-text', 'sample-text', ['1']);
    expect(result).toEqual('sample-tex1');
  });

  it('should scramble second to last char', () => {
    const result = scrambleRightToLeft('sample-text', 'sample-tex1', ['1']);
    expect(result).toEqual('sample-te11');
  });

  it('should scramble first char', () => {
    const result = scrambleRightToLeft('sample-text', 's1111111111', ['1']);
    expect(result).toEqual('11111111111');
  });
});
