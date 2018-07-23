// @flow

import { pathParamsBuilder } from '../src/pathParamsBuilder';

const url = '/users/:id/edit';

describe('test pathParamsBuilder', () => {
  test('with path params', () => {
    const generatedUrl = pathParamsBuilder({ url, pathParams: { id: 1 } });
    expect(generatedUrl).toBe('/users/1/edit');
  });

  test('with path param at the end', () => {
    const generatedUrl = pathParamsBuilder({
      url: '/users/:id',
      pathParams: { id: 89 }
    });
    expect(generatedUrl).toBe('/users/89');
  });

  test('with some missing/extra params', () => {
    const generatedUrl = pathParamsBuilder({
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
