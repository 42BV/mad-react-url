// @flow

import { stringify } from 'query-string';
import reduce from 'lodash.reduce';

import type { Url } from './models';

export type QueryParamsBuilderOptions = {
  url: Url,
  queryParams: Object,
  defaultQueryParams: Object
};

/**
 * Takes a URL and query builder options and appends the query parameters
 * to the URL. It ignores query parameters which match the default query
 * parameters.
 *
 * @example
 * queryParamsBuilder({url: 'users/1', queryParams: { visible: true }, { defaultQueryParams: visible: false} }) === '/users/1?visible=true
 *
 * @param {String} options.url The url which get the query parameters appended.
 * @param {Object} options.queryParams The query params as an object.
 * @param {Object} options.defaultQueryParams The default query parameters.
 */
export function queryParamsBuilder(options: QueryParamsBuilderOptions): Url {
  const { url, queryParams, defaultQueryParams } = options;

  const params = ignoreDefaultQueryParameters(queryParams, defaultQueryParams);

  const urlParams = stringify(params, { encode: false });
  if (urlParams) {
    return `${url}?${urlParams}`;
  } else {
    return url;
  }
}

function ignoreDefaultQueryParameters(queryParams, defaultQueryParams) {
  // Remove all values from the queryParams which match the defaultQueryParams
  return reduce(
    queryParams,
    (result, value, key) => {
      if (value !== defaultQueryParams[key]) {
        result[key] = value;
      }
      return result;
    },
    {}
  );
}
