import { stringify } from 'query-string';
import { Url } from './models';

export type QueryParamsBuilderOptions<QueryParams> = {
  url: Url;
  queryParams: QueryParams;
  defaultQueryParams: QueryParams;
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
export function queryParamsBuilder<QueryParams>(
  options: QueryParamsBuilderOptions<QueryParams>
): Url {
  const { url, queryParams, defaultQueryParams } = options;

  const params = ignoreDefaultQueryParameters(queryParams, defaultQueryParams);

  // @ts-expect-error stringify will work because the params is an object.
  const urlParams = stringify(params, { encode: false });
  if (urlParams) {
    return `${url}?${urlParams}`;
  } else {
    return url;
  }
}

function ignoreDefaultQueryParameters<QueryParams>(
  queryParams: QueryParams,
  defaultQueryParams: QueryParams
): QueryParams {
  // Remove all values from the queryParams which match the defaultQueryParams
  const defaultRemovedQueryParams: Record<string, unknown> = {};

  Object.keys(queryParams).forEach((key: string) => {
    // @ts-expect-error This is safe because it should have the same type as the QueryParams
    const defaultValue = defaultQueryParams[key];

    // @ts-expect-error This is safe because the key came from the query param.
    const actualValue = queryParams[key];

    // Only if it is not equal to the default value keep it.
    if (actualValue !== defaultValue) {
      defaultRemovedQueryParams[key] = actualValue;
    }
  });

  return defaultRemovedQueryParams as QueryParams;
}
