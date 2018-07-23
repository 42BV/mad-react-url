// @flow

import type { Url } from './models';
import { pathParamsBuilder } from './pathParamsBuilder';
import { queryParamsBuilder } from './queryParamsBuilder';

export type UrlBuilderOptions = {
  url: Url,
  pathParams?: Object,
  queryParams?: Object,
  defaultQueryParams?: Object
};

/**
 * Has two use cases:
 *
 * 1. Returns the abstract Url when only the `url` option key is
 *    provided. For example urlBuilder({ url: '/users/:id' }) returns.
 *
 * 2. Replaces all the matching keys in the path params in the url with the value,
 *    and adds all query params key value pairs as string key=value to the url minus
 *    all the key value matching in the defaultQueryParams
 *
 * The idea behind this is that `urlBuilder` can be used to either defined
 * urls for routes, and actually navigating to those routes.
 *
 * @example
 *  urlBuilder({ url: '/users/:id' })
 *
 *  results in: '/users/:id'
 *
 * @example
 *  urlBuilder({
 *    url: '/users/:id',
 *    pathParams: {
 *      id: 1
 *    },
 *    queryParams: {
 *      search: 'hello',
 *      page: 1
 *    },
 *    defaultQueryParams: {
 *      search: '',
 *      page: 1
 *    }
 *   })
 *
 * results in: '/users/1?search=hello
 *
 * @param {String} options.url The url to be parsed
 * @param {Object} options.pathParams Consists of the matching key in the url to be replaced by the value.
 * @param {Object} options.queryParams
 * @param {Object} options.defaultQueryParams
 */
export function urlBuilder(options: UrlBuilderOptions): Url {
  const { url, pathParams, queryParams, defaultQueryParams } = options;

  // If we have no pathParams and queryParams return the abstract url.
  if (!pathParams && !queryParams) {
    return url;
  }

  const urlPath = pathParams
    ? pathParamsBuilder({ url, pathParams: pathParams })
    : url;

  if (queryParams && defaultQueryParams) {
    return queryParamsBuilder({
      url: urlPath,
      queryParams,
      defaultQueryParams
    });
  } else {
    return urlPath;
  }
}
