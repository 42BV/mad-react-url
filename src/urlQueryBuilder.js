// @flow

import type { Url } from './models';
import { urlBuilder } from './urlBuilder';
import { queryBuilder } from './queryBuilder';

export type UrlOptions = {
  url: Url,
  pathParams?: Object,
  queryParams?: Object,
  defaultQueryParams: Object
};

/**
 * Replaces all the matching keys in the path params in the url with the value.
 * And adds all query params key value pairs as string key=value to the url minus
 * all the key value matching in the defaultQueryParams
 * 
 * @example
 *  urlQueryBuilder({
        url: '/users/:idd',
        pathParams: {
            idd: 1
        },
        queryParams: {
            search: 'hello',
            page: 1
        },
        defaultQueryParams: {
            page: 1
        }
    })
 * results in '/users/1?search=hello
 * 
 * @param {String} options.url The url to be parsed
 * @param {Object} options.pathParams Consists of the matching key in the url to be replaced by the value. 
 * @param {Object} options.queryParams
 * @param {Object} options.defaultQueryParams
 */
export function urlQueryBuilder(options: UrlOptions): Url {
  const { url, pathParams, queryParams, defaultQueryParams } = options;

  return queryBuilder({
    url: urlBuilder({ url, pathParams }),
    queryParams,
    defaultQueryParams
  });
}
