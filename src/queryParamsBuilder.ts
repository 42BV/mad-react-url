// @ts-ignore
import { stringify } from 'query-string';
import reduce from 'lodash.reduce';

import { Url } from './models';

export interface QueryParamsBuilderOptions<QueryParams> {
  url: Url;
  queryParams: QueryParams;
  defaultQueryParams: QueryParams;
}

function ignoreDefaultQueryParameters<QueryParams>(queryParams: QueryParams, defaultQueryParams: QueryParams): QueryParams {
  // Remove all values from the queryParams which match the defaultQueryParams
  return reduce(
    // @ts-ignore
    queryParams,
    (result: Record<string, string>, value: string, key: string) => {
      // @ts-ignore
      if (value !== defaultQueryParams[key]) {
        result[key] = value;
      }
      return result;
    },
    {},
  );
}

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
export function queryParamsBuilder<QueryParams>(options: QueryParamsBuilderOptions<QueryParams>): Url {
  const { url, queryParams, defaultQueryParams } = options;

  const params = ignoreDefaultQueryParameters(queryParams, defaultQueryParams);

  const urlParams = stringify(params, { encode: false });
  if (urlParams) {
    return `${url}?${urlParams}`;
  } else {
    return url;
  }
}
