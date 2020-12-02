import { urlBuilder } from '../src/urlBuilder';
import { Url } from '../src/models';

describe('urlBuilder', () => {
  it('should when path param is not provided return as is', () => {
    const url = '/users/:id';

    expect(urlBuilder({ url })).toBe(url);
  });

  it('should when path param is not provided return as is, but remove optional path params', () => {
    const url = '/users/:id/:action?';

    expect(urlBuilder({ url })).toBe('/users/:id');
  });

  it('should know how to return full urls with paths params', () => {
    const url = '/users/:id';
    const pathParams = { id: 891 };

    const expected = '/users/891';

    expect(urlBuilder({ url, pathParams })).toBe(expected);
  });

  it('should know how to return full urls with paths params and optional path params', () => {
    const url = '/users/:id/:action?';
    const pathParams = { id: 891 };

    const expected = '/users/891';

    expect(urlBuilder({ url, pathParams })).toBe(expected);
  });

  it('should know how to return urls with query params', () => {
    const url = '/users';
    const queryParams = { search: 'awesome', num: 23 };
    const defaultQueryParams = { num: 23 };

    const expected = '/users?search=awesome';

    expect(urlBuilder({ url, queryParams, defaultQueryParams })).toBe(expected);
  });

  it('should know how to return urls with query params with no default query params, and simply only use the query params then', () => {
    const url = '/users';
    const queryParams = { search: 'awesome', num: 23 };
    const defaultQueryParams = undefined;

    const expected = '/users?num=23&search=awesome';

    expect(urlBuilder({ url, queryParams, defaultQueryParams })).toBe(expected);
  });

  it('should know how to return urls with paths params and query params', () => {
    const url = '/users/:id';
    const pathParams = { id: 891 };
    const queryParams = { search: 'awesome', num: 23 };
    const defaultQueryParams = {};

    const expected = '/users/891?num=23&search=awesome';

    expect(
      urlBuilder({ url, pathParams, queryParams, defaultQueryParams })
    ).toBe(expected);
  });

  test('scenario which testes the typescript types', () => {
    // We are testing the typescript types here so a failure means
    // TypeScript will complain about the following code.

    type DashboardPathParams = {
      id: number;
    };

    type DashboardQueryParams = {
      page: number;
      query: string;
    };

    function defaultDashboardQueryParams(): DashboardQueryParams {
      return {
        page: 1,
        query: ''
      };
    }

    function toDashboard(
      pathParams?: DashboardPathParams,
      queryParams?: Partial<DashboardQueryParams>
    ): Url {
      return urlBuilder({
        url: '/dashboard/:id',
        pathParams,
        queryParams,
        defaultQueryParams: defaultDashboardQueryParams()
      });
    }

    expect(toDashboard()).toBe('/dashboard/:id');
    expect(toDashboard({ id: 42 })).toBe('/dashboard/42');
    expect(toDashboard({ id: 42 }, { page: 1337 })).toBe(
      '/dashboard/42?page=1337'
    );
  });
});
