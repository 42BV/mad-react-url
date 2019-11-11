import { queryParamsFromLocation, convertQueryParamsToConcreteType } from '../src/queryparams';

describe('queryParamsFromLocation', () => {
  it('should know how to convert strings that start with a question mark', () => {
    const location = { search: '?query=hallo' };

    expect(queryParamsFromLocation(location, { query: 'default' }, 'debug')).toEqual({ query: 'hallo' });
  });

  it('should know how to convert strings that start without a question mark', () => {
    const location = { search: 'query=hallo' };

    expect(queryParamsFromLocation(location, { query: 'default' }, 'debug')).toEqual({ query: 'hallo' });
  });
});

describe('convertQueryParamsToConcreteType', () => {
  it('should warn when default query parameters does not contain a query param', () => {
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);

    const queryParams = convertQueryParamsToConcreteType({ color: 'red' }, {}, 'AppComponent');
    expect(queryParams).toEqual({ color: 'red' });

    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith(
      `@42.nl/react-url: no default query param defined for "color" for: "AppComponent".`,
    );
  });

  it('should leave strings and unhandled types alone', () => {
    const queryParams = convertQueryParamsToConcreteType({ color: 'red' }, { color: 'blue' }, 'AppComponent');
    expect(queryParams).toEqual({ color: 'red' });
  });

  describe('number', () => {
    it('should know how to transform whole numbers', () => {
      const queryParams = convertQueryParamsToConcreteType({ id: '24' }, { id: 1 }, 'AppComponent');
      expect(queryParams).toEqual({ id: 24 });
    });

    it('should know how to transform fractured numbers', () => {
      const queryParams = convertQueryParamsToConcreteType({ id: '1.12' }, { id: 33.3 }, 'AppComponent');
      expect(queryParams).toEqual({ id: 1.12 });
    });
  });

  describe('boolean', () => {
    it('should know how to transform string "true" to boolean true', () => {
      const queryParams = convertQueryParamsToConcreteType({ visible: 'true' }, { visible: true }, 'AppComponent');
      expect(queryParams).toEqual({ visible: true });
    });

    it('should know how to transform string "false" to boolean false', () => {
      const queryParams = convertQueryParamsToConcreteType({ visible: 'false' }, { visible: false }, 'AppComponent');
      expect(queryParams).toEqual({ visible: false });
    });
  });

  describe('array', () => {
    it('should leave arrays of strings alone', () => {
      const queryParams = convertQueryParamsToConcreteType(
        { sizes: ['medium', 'large', 'small'] },
        { sizes: ['small'] },
        'AppComponent',
      );
      expect(queryParams).toEqual({ sizes: ['medium', 'large', 'small'] });
    });

    it('should know how to tranform arrays of numbers', () => {
      const queryParams = convertQueryParamsToConcreteType(
        { numbers: ['1', '2', '3'] },
        { numbers: [42] },
        'AppComponent',
      );
      expect(queryParams).toEqual({ numbers: [1, 2, 3] });
    });

    it('should know how to tranform arrays of booleans', () => {
      const queryParams = convertQueryParamsToConcreteType(
        { visible: ['true', 'false', 'false'] },
        { visible: [true] },
        'AppComponent',
      );
      expect(queryParams).toEqual({ visible: [true, false, false] });
    });

    it('should when it cannot guess the type, due to empty default, revert to strings', () => {
      const queryParams = convertQueryParamsToConcreteType(
        { sizes: ['medium', 'large', 'small'] },
        { sizes: [] },
        'AppComponent',
      );
      expect(queryParams).toEqual({ sizes: ['medium', 'large', 'small'] });
    });

    describe('when encountering a singular value', () => {
      it('should convert to an array of strings when a singular string is given', () => {
        const queryParams = convertQueryParamsToConcreteType({ sizes: 'large' }, { sizes: ['small'] }, 'AppComponent');
        expect(queryParams).toEqual({ sizes: ['large'] });
      });

      it('should convert to an array of numbers when a singular number is given', () => {
        const queryParams = convertQueryParamsToConcreteType({ numbers: '1' }, { numbers: [42] }, 'AppComponent');
        expect(queryParams).toEqual({ numbers: [1] });
      });

      it('should convert to an array of booleans when a singular boolean is given', () => {
        const queryParams = convertQueryParamsToConcreteType({ visible: 'true' }, { visible: [false] }, 'AppComponent');
        expect(queryParams).toEqual({ visible: [true] });
      });

      it('should convert to an array of the singular value when an empty default is given', () => {
        const queryParams = convertQueryParamsToConcreteType({ sizes: 'medium' }, { sizes: [] }, 'AppComponent');
        expect(queryParams).toEqual({ sizes: ['medium'] });
      });
    });
  });
});
