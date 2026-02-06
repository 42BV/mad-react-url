import * as index from '../src';

describe('index', () => {
  test('exports', () => {
    expect(index).toMatchInlineSnapshot(`
      {
        "Url": undefined,
        "UrlBuilderOptions": undefined,
        "queryParamsFromLocation": [Function],
        "urlBuilder": [Function],
        "useQueryParams": [Function],
        "withQueryParams": [Function],
      }
    `);
  });
});
