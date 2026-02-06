import { queryParamsFromLocation } from '../src/queryparams';

describe('queryParamsFromLocation', () => {
  it('should know how to convert strings that start with a question mark', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { search: '?query=hallo' }
    });

    expect(
      queryParamsFromLocation({
        defaultQueryParams: { query: 'default' },
        debugName: 'debug'
      })
    ).toEqual({
      query: 'hallo'
    });
  });

  it('should know how to convert strings that start without a question mark', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { search: 'query=hallo' }
    });

    expect(
      queryParamsFromLocation({
        defaultQueryParams: { query: 'default' },
        debugName: 'debug'
      })
    ).toEqual({
      query: 'hallo'
    });
  });

  it('should fallback to default query parameters when params are misssing', () => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { search: '' }
    });
    const defaultQueryParams = {
      number: 42,
      numbers: [1, 2, 3],
      float: 1.42,
      floats: [1, 2, 3],
      string: 'small',
      strings: ['small', 'large'],
      falseBoolean: false,
      trueBoolean: true,
      booleans: [false, true, false]
    };

    const queryParams = queryParamsFromLocation({
      defaultQueryParams,
      debugName: 'AppComponent'
    });
    expect(queryParams).toEqual({
      number: 42,
      numbers: [1, 2, 3],
      float: 1.42,
      floats: [1, 2, 3],
      string: 'small',
      strings: ['small', 'large'],
      falseBoolean: false,
      trueBoolean: true,
      booleans: [false, true, false]
    });

    // Check reference equality of arrays, that they are actually the
    // exact same value in memory.
    expect(queryParams.numbers).toBe(defaultQueryParams.numbers);
    expect(queryParams.floats).toBe(defaultQueryParams.floats);
    expect(queryParams.strings).toBe(defaultQueryParams.strings);
    expect(queryParams.booleans).toBe(defaultQueryParams.booleans);
  });

  describe('conversions', () => {
    it('should warn when default query parameters does not contain a query param', () => {
      jest.spyOn(console, 'warn').mockImplementation(() => undefined);

      Object.defineProperty(window, 'location', {
        writable: true,
        value: { search: '?color=red' }
      });
      const defaultQueryParams = {};

      const queryParams = queryParamsFromLocation({
        defaultQueryParams,
        debugName: 'AppComponent'
      });
      expect(queryParams).toEqual({ color: 'red' });

      expect(console.warn).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(
        `@42.nl/react-url: no default query param defined for "color" for: "AppComponent".`
      );
    });

    it('should leave strings and unhandled types alone', () => {
      Object.defineProperty(window, 'location', {
        writable: true,
        value: { search: '?color=red' }
      });
      const defaultQueryParams = { color: 'blue' };

      const queryParams = queryParamsFromLocation({
        defaultQueryParams,
        debugName: 'AppComponent'
      });
      expect(queryParams).toEqual({ color: 'red' });
    });

    describe('number', () => {
      it('should know how to transform whole numbers', () => {
        Object.defineProperty(window, 'location', {
          writable: true,
          value: { search: '?id=42' }
        });
        const defaultQueryParams = { id: 1 };

        const queryParams = queryParamsFromLocation({
          defaultQueryParams,
          debugName: 'AppComponent'
        });
        expect(queryParams).toEqual({ id: 42 });
      });

      it('should know how to transform fractured numbers', () => {
        Object.defineProperty(window, 'location', {
          writable: true,
          value: { search: '?id=1.12' }
        });
        const defaultQueryParams = { id: 33.3 };

        const queryParams = queryParamsFromLocation({
          defaultQueryParams,
          debugName: 'AppComponent'
        });
        expect(queryParams).toEqual({ id: 1.12 });
      });
    });

    describe('boolean', () => {
      it('should know how to transform string "true" to boolean true', () => {
        Object.defineProperty(window, 'location', {
          writable: true,
          value: { search: '?visible=false' }
        });
        const defaultQueryParams = { visible: true };

        const queryParams = queryParamsFromLocation({
          defaultQueryParams,
          debugName: 'AppComponent'
        });
        expect(queryParams).toEqual({ visible: false });
      });

      it('should know how to transform string "false" to boolean false', () => {
        Object.defineProperty(window, 'location', {
          writable: true,
          value: { search: '?visible=false' }
        });
        const defaultQueryParams = { visible: true };

        const queryParams = queryParamsFromLocation({
          defaultQueryParams,
          debugName: 'AppComponent'
        });
        expect(queryParams).toEqual({ visible: false });
      });
    });

    describe('array', () => {
      it('should leave arrays of strings alone', () => {
        Object.defineProperty(window, 'location', {
          writable: true,
          value: { search: '?sizes=medium&sizes=large&sizes=small' }
        });
        const defaultQueryParams = { sizes: ['small'] };

        const queryParams = queryParamsFromLocation({
          defaultQueryParams,
          debugName: 'AppComponent'
        });
        expect(queryParams).toEqual({ sizes: ['medium', 'large', 'small'] });
      });

      it('should know how to tranform arrays of numbers', () => {
        Object.defineProperty(window, 'location', {
          writable: true,
          value: { search: '?numbers=1&numbers=2&numbers=3' }
        });
        const defaultQueryParams = { numbers: [42] };

        const queryParams = queryParamsFromLocation({
          defaultQueryParams,
          debugName: 'AppComponent'
        });
        expect(queryParams).toEqual({ numbers: [1, 2, 3] });
      });

      it('should know how to tranform arrays of booleans', () => {
        Object.defineProperty(window, 'location', {
          writable: true,
          value: { search: '?visible=true&visible=false&visible=false' }
        });
        const defaultQueryParams = { visible: [true] };

        const queryParams = queryParamsFromLocation({
          defaultQueryParams,
          debugName: 'AppComponent'
        });
        expect(queryParams).toEqual({ visible: [true, false, false] });
      });

      it('should when it cannot guess the type, due to empty default, revert to strings', () => {
        Object.defineProperty(window, 'location', {
          writable: true,
          value: { search: '?sizes=medium&sizes=large&sizes=small' }
        });
        const defaultQueryParams = { sizes: [] };

        const queryParams = queryParamsFromLocation({
          defaultQueryParams,
          debugName: 'AppComponent'
        });
        expect(queryParams).toEqual({ sizes: ['medium', 'large', 'small'] });
      });

      describe('when encountering a singular value', () => {
        it('should convert to an array of strings when a singular string is given', () => {
          Object.defineProperty(window, 'location', {
            writable: true,
            value: { search: '?sizes=large' }
          });
          const defaultQueryParams = { sizes: ['small'] };

          const queryParams = queryParamsFromLocation({
            defaultQueryParams,
            debugName: 'AppComponent'
          });
          expect(queryParams).toEqual({ sizes: ['large'] });
        });

        it('should convert to an array of numbers when a singular number is given', () => {
          Object.defineProperty(window, 'location', {
            writable: true,
            value: { search: '?numbers=1' }
          });
          const defaultQueryParams = { numbers: [42] };

          const queryParams = queryParamsFromLocation({
            defaultQueryParams,
            debugName: 'AppComponent'
          });
          expect(queryParams).toEqual({ numbers: [1] });
        });

        it('should convert to an array of booleans when a singular boolean is given', () => {
          Object.defineProperty(window, 'location', {
            writable: true,
            value: { search: '?visible=true' }
          });
          const defaultQueryParams = { visible: [false] };

          const queryParams = queryParamsFromLocation({
            defaultQueryParams,
            debugName: 'AppComponent'
          });
          expect(queryParams).toEqual({ visible: [true] });
        });

        it('should convert to an array of the singular value when an empty default is given', () => {
          Object.defineProperty(window, 'location', {
            writable: true,
            value: { search: '?sizes=medium' }
          });
          const defaultQueryParams = { sizes: [] };

          const queryParams = queryParamsFromLocation({
            defaultQueryParams,
            debugName: 'AppComponent'
          });
          expect(queryParams).toEqual({ sizes: ['medium'] });
        });
      });
    });
  });
});
