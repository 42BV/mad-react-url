import { Url } from './models';

export interface PathParamsBuilderOptions {
  url: Url;
  pathParams: Record<string, any>;
}

function replace(key: string, value: string, url: string): string {
  const regex = new RegExp(`/:${key}/|/:${key}$`);

  return url.replace(regex, match => {
    if (match[match.length - 1] === '/') {
      return `/${value}/`;
    }

    return `/${value}`;
  });
}

/**
 * Replaces all the matching keys in the path params in the url with the value.
 *
 * @example
 * pathParamsBuilder({url: '/users/:id', pathParams: {id: 1}}) === '/users/1
 *
 * @param {String} options.url The url to be parsed
 * @param {Object} options.pathParams Consists of the matching key in the url to be replaced by the value.
 */
export function pathParamsBuilder(options: PathParamsBuilderOptions): Url {
  const { url, pathParams } = options;

  return Object.keys(pathParams).reduce((url, key) => replace(key, pathParams[key], url), url);
}
