// @flow

import { urlBuilder } from '../src/urlBuilder';

const url = '/users/:id/edit';

describe('test urlBuilder', () => {
  test('no path params', () => {
    const generatedUrl = urlBuilder({ url });
    expect(generatedUrl).toBe(url);
  });

  test('with path params', () => {
    const generatedUrl = urlBuilder({ url, pathParams: { id: 1 } });
    expect(generatedUrl).toBe('/users/1/edit');
  });

  test('with path param at the end', () => {
    const generatedUrl = urlBuilder({
      url: '/users/:id',
      pathParams: { id: 89 }
    });
    expect(generatedUrl).toBe('/users/89');
  });

  test('with some missing/extra params', () => {
    const generatedUrl = urlBuilder({
      url: '/users/:id/edit/:idd/employee',
      pathParams: {
        idd: 3,
        awesome: 'hello',
        do: 'nothing'
      }
    });
    expect(generatedUrl).toBe('/users/:id/edit/3/employee');
  });
});
