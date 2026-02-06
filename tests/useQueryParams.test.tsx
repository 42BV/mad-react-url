import { renderHook } from '@testing-library/react';

import { useQueryParams, Config } from '../src/useQueryParams';

type QueryParams = {
  query: string;
};

describe('useQueryParams', () => {
  test('that it changes based on location search', () => {
    const { result, rerender } = renderHook<QueryParams, Config<QueryParams>>(
      (config: Config<QueryParams>) => useQueryParams(config),
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

  test('that it uses window location when not providing location', () => {
    const mockSearch = vi.fn();
    Object.defineProperty(window, 'location', {
      value: {
        get search() {
          return mockSearch();
        }
      }
    });
    mockSearch.mockReturnValue('?query=red');

    const defaultQueryParams = { query: 'default' };

    const { result, rerender } = renderHook<QueryParams, Config<QueryParams>>(
      (config: Config<QueryParams>) => useQueryParams(config),
      {
        initialProps: {
          defaultQueryParams
        }
      }
    );

    // Test that the first result will be 'hallo'
    const initialResult = result.current;
    expect(initialResult).toEqual({ query: 'red' });

    // Change to something else
    mockSearch.mockReturnValue('?query=blue');
    rerender({
      defaultQueryParams
    });

    expect(result.current).toEqual({ query: 'blue' });

    // Change to empty string so it uses the default
    mockSearch.mockReturnValue('');
    rerender({
      defaultQueryParams
    });

    expect(result.current).toEqual({ query: 'default' });
  });
});
