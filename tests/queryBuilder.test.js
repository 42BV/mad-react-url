// @flow

import { queryBuilder } from '../src/queryBuilder';

const url = '/test';

describe('test queryBuilder', () => {
  test('no query parameters', () => {
    const generatedUrl = queryBuilder({ url, defaultQueryParams: {} });
    expect(generatedUrl).toBe('/test');
  });
  test('no query parameters', () => {
    const generatedUrl = queryBuilder({ url, defaultQueryParams: {} });
    expect(generatedUrl).toBe('/test');
  });

  test('with query parameters which match default query params', () => {
    const generatedUrl = queryBuilder({
      url,
      queryParams: { query: 'test' },
      defaultQueryParams: { query: 'test' }
    });
    expect(generatedUrl).toBe('/test');
  });

  test('with query parameters and default query parameters', () => {
    const generatedUrl = queryBuilder({
      url,
      queryParams: { query: 'test' },
      defaultQueryParams: { query: 'default' }
    });
    expect(generatedUrl).toBe('/test?query=test');
  });
});
