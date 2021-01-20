import { renderHook } from '@testing-library/react-hooks';

import { useQueryParams, Config } from '../src/useQueryParams';

type QueryParams = {
  query: string;
};

describe('useQueryParams', () => {
  test('that it changes based on location search', () => {
    const { result, rerender } = renderHook<Config<QueryParams>, QueryParams>(
      (config) => useQueryParams(config),
      {
        initialProps: {
          location: { search: '?query=hallo' },
          defaultQueryParams: { query: 'default' }
        }
      }
    );

    // Test that the first result will be 'hallo'
    const initialResult = result.current;
    expect(initialResult).toEqual({ query: 'hallo' });

    // Change to the same 'hallo' for 'query' it should not change now
    rerender({
      location: { search: '?query=hallo' },
      defaultQueryParams: { query: 'default' }
    });

    const secondResult = result.current;
    expect(secondResult).toEqual({ query: 'hallo' });

    // Test that the initial and second results are in fact the same
    // by reference equality.
    expect(secondResult).toBe(initialResult);

    // Change to 'bert'
    rerender({
      location: { search: '?query=bert' },
      defaultQueryParams: { query: 'default' }
    });

    expect(result.current).toEqual({ query: 'bert' });

    // Change to '' so it uses the default
    rerender({
      location: { search: '' },
      defaultQueryParams: { query: 'default' }
    });

    expect(result.current).toEqual({ query: 'default' });

    // Change to 'henk'
    rerender({
      location: { search: '?query=henk' },
      defaultQueryParams: { query: 'default' }
    });

    expect(result.current).toEqual({ query: 'henk' });

    // Change to 'henk&jan'
    rerender({
      location: { search: '?query=henk%26jan' },
      defaultQueryParams: { query: 'default' }
    });

    expect(result.current).toEqual({ query: 'henk&jan' });

    // Change to undefined so it uses the default
    rerender({
      location: { search: undefined },
      defaultQueryParams: { query: 'default' }
    });

    expect(result.current).toEqual({ query: 'default' });
  });
});
