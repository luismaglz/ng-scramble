import { scrambleLeftToRight } from './scramble-left-to-right';

describe('scrambleLeftToRight', () => {
  it('should scramble first character', () => {
    const result = scrambleLeftToRight('sample-text', 'sample-text', ['1']);
    expect(result).toEqual('1ample-text');
  });

  it('should scramble second  char', () => {
    const result = scrambleLeftToRight('sample-text', '1ample-text', ['1']);
    expect(result).toEqual('11mple-text');
  });

  it('should scramble first char', () => {
    const result = scrambleLeftToRight('sample-text', '1111111111t', ['1']);
    expect(result).toEqual('11111111111');
  });
});
