// @flow

import { urlQueryBuilder } from '../src/urlQueryBuilder';

describe('test urlQueryBuilder', () => {
  test('mixin path and query params', () => {
    const url = '/users/:id';
    const pathParams = { id: 891 };
    const queryParams = { search: 'awesome', num: 23 };
    const defaultQueryParams = {};

    const expected = '/users/891?num=23&search=awesome';

    expect(
      urlQueryBuilder({ url, pathParams, queryParams, defaultQueryParams })
    ).toBe(expected);
  });
});
