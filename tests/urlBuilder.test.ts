import { urlBuilder } from '../src/urlBuilder';

describe('urlBuilder', () => {
  it('should know how to return abstract urls', () => {
    const url = '/users/:id';

    expect(urlBuilder({ url })).toBe(url);
  });

  it('should know how to return full urls with paths params', () => {
    const url = '/users/:id';
    const pathParams = { id: 891 };

    const expected = '/users/891';

    expect(urlBuilder({ url, pathParams })).toBe(expected);
  });

  it('should know how to return urls with query params', () => {
    const url = '/users';
    const queryParams = { search: 'awesome', num: 23 };
    const defaultQueryParams = {};

    const expected = '/users?num=23&search=awesome';

    expect(urlBuilder({ url, queryParams, defaultQueryParams })).toBe(expected);
  });

  it('should know how to return urls with paths params and query params', () => {
    const url = '/users/:id';
    const pathParams = { id: 891 };
    const queryParams = { search: 'awesome', num: 23 };
    const defaultQueryParams = {};

    const expected = '/users/891?num=23&search=awesome';

    expect(urlBuilder({ url, pathParams, queryParams, defaultQueryParams })).toBe(expected);
  });
});
