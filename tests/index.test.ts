import * as index from '../src';

describe('index', () => {
  test('exports', () => {
    expect(index).toMatchInlineSnapshot(`
      {
        "queryParamsFromLocation": [Function],
        "urlBuilder": [Function],
        "useQueryParams": [Function],
        "withQueryParams": [Function],
      }
    `);
  });
});
