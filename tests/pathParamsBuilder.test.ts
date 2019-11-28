import { pathParamsBuilder } from '../src/pathParamsBuilder';

describe('test pathParamsBuilder', () => {
  test('with path params', () => {
    const generatedUrl = pathParamsBuilder({
      url: '/users/:id/edit',
      pathParams: { id: 1 },
    });

    expect(generatedUrl).toBe('/users/1/edit');
  });

  test('with path param at the end', () => {
    const generatedUrl = pathParamsBuilder({
      url: '/users/:id',
      pathParams: { id: 89 },
    });

    expect(generatedUrl).toBe('/users/89');
  });

  test('with optional path param at the end', () => {
    const generatedUrl = pathParamsBuilder({
      url: '/users/:id?',
      pathParams: { id: 89 },
    });

    expect(generatedUrl).toBe('/users/89');
  });

  test('with optional path param missing at the end', () => {
    const generatedUrl = pathParamsBuilder({
      url: '/users/:id?',
      pathParams: {},
    });

    expect(generatedUrl).toBe('/users');
  });

  test('with multiple optional path params missing at the end', () => {
    const generatedUrl = pathParamsBuilder({
      url: '/users/:id?/:action?/:subaction?',
      pathParams: {},
    });

    expect(generatedUrl).toBe('/users');
  });

  test('with some missing/extra params', () => {
    const generatedUrl = pathParamsBuilder({
      url: '/users/:id/edit/:idd/employee',
      pathParams: {
        idd: 3,
        awesome: 'hello',
        do: 'nothing',
      },
    });

    expect(generatedUrl).toBe('/users/:id/edit/3/employee');
  });

  test('with some params missing/extra with an optional params', () => {
    const generatedUrl = pathParamsBuilder({
      url: '/users/:id?/edit/:idd/employee',
      pathParams: {
        id: 42,
        idd: 3,
        awesome: 'hello',
        do: 'nothing',
      },
    });

    expect(generatedUrl).toBe('/users/42/edit/3/employee');
  });

  test('with all path params missing including optional and required', () => {
    const generatedUrl = pathParamsBuilder({
      url: '/users/:id?/edit/:idd/employee',
      pathParams: {},
    });

    expect(generatedUrl).toBe('/users//edit/:idd/employee');
  });
});
