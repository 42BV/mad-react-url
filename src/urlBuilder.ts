import { Url } from './models';
import { pathParamsBuilder } from './pathParamsBuilder';
import { queryParamsBuilder } from './queryParamsBuilder';

export type UrlBuilderOptions<PathParams, QueryParams> = {
  url: Url;
  pathParams?: PathParams;
  queryParams?: QueryParams;
  defaultQueryParams?: QueryParams;
};

/**
 * Replaces all the matching keys in the path params in the url with the value,
 * and adds all query params key value pairs as string key=value to the url minus
 * all the key value matching in the defaultQueryParams.
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
 * @param {Object} options.queryParams The query parameters for the url
 * @param {Object} options.defaultQueryParams The default query parameters, the query params which match the defaults will be removed.
 * @returns {String} The build fully built url
 */
export function urlBuilder<
  PathParams extends Record<string, string>,
  QueryParams extends Record<string, unknown>
>(options: UrlBuilderOptions<PathParams, QueryParams>): Url {
  const {
    url,
    pathParams = {},
    queryParams,
    defaultQueryParams = {}
  } = options;

  const urlPath = pathParamsBuilder({ url, pathParams });

  if (queryParams) {
    return queryParamsBuilder({
      url: urlPath,
      queryParams,
      defaultQueryParams
    });
  } else {
    return urlPath;
  }
}
