import * as index from '../src';

describe('index', () => {
  test('exports', () => {
    expect(index).toMatchInlineSnapshot(`
      Object {
        "urlBuilder": [Function],
        "useQueryParams": [Function],
        "withQueryParams": [Function],
      }
    `);
  });
});
