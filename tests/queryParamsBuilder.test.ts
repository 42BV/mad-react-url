import { queryParamsBuilder } from '../src/queryParamsBuilder';

const url = '/test';

describe('test queryParamsBuilder', () => {
  test('with query parameters which match default query params', () => {
    const generatedUrl = queryParamsBuilder({
      url,
      queryParams: { query: 'test' },
      defaultQueryParams: { query: 'test' },
    });
    expect(generatedUrl).toBe('/test');
  });

  test('with query parameters which do not match the default query params', () => {
    const generatedUrl = queryParamsBuilder({
      url,
      queryParams: { query: 'test' },
      defaultQueryParams: { query: 'default' },
    });
    expect(generatedUrl).toBe('/test?query=test');
  });
});
