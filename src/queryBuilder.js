// @flow

import { stringify } from 'query-string';
import reduce from 'lodash.reduce';

import type { Url } from './models';

export type QueryBuilderOptions = {
  url: Url,
  queryParams?: Object,
  defaultQueryParams: Object
};

export function queryBuilder(options: QueryBuilderOptions): Url {
  const { url, queryParams, defaultQueryParams } = options;

  if (queryParams) {
    const params = ignoreDefaultQueryParameters(
      queryParams,
      defaultQueryParams
    );

    const urlParams = stringify(params, { encode: false });
    if (urlParams) {
      return `${url}?${urlParams}`;
    } else {
      return url;
    }
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
