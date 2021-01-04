import { Url } from './models';

export type PathParamsBuilderOptions = {
  url: Url;
  pathParams: Record<string, unknown>;
};

/**
 * Replaces all the matching keys in the path params in the url with the
 * value. A path param as a placeholder for a value in the url denoted
 * by a colon (:). For example in the following url:
 *
 * `users/:id/:tab?` there are two path params :id and :tab?. A question
 * mark at the end of a path param denotes an optional path param.
 *
 * Optional path params are removed when no value is supplied.
 *
 * @example
 * pathParamsBuilder({url: '/users/:id', pathParams: {id: 1}}) // '/users/1
 * pathParamsBuilder({url: '/users/:id/:tab?', pathParams: {id: 1}}) // '/users/1
 * pathParamsBuilder({url: '/users/:id/:tab?', pathParams: {id: 1, tab: 'profile' }}) // '/users/1/profile
 *
 * @param {String} options.url The url to be parsed
 * @param {Object} options.pathParams Consists of the matching key in the url to be replaced by the value.
 */
export function pathParamsBuilder(options: PathParamsBuilderOptions): Url {
  const { url, pathParams } = options;

  // Convert '/users/:id/:tab?' to ["", "users", ":id", ":tab?"]
  const replacedUrl = url
    .split('/')
    .map((part) => processPart(part, pathParams))
    .join('/');

  return stripEndingSlashes(replacedUrl);
}

// Take a part of the path and process it, when it is a path param
// replace it with its value, otherwise leave it alone.
function processPart(
  part: string,
  pathParams: Record<string, unknown>
): unknown {
  if (!isPathParam(part)) {
    return part;
  }

  const key = pathParamToKey(part);
  const value = pathParams[key];

  if (value) {
    return value;
  } else {
    return isOptionalPathParam(part) ? '' : part;
  }
}

// If a part starts with a ":" it is a path param
function isPathParam(part: string): boolean {
  return part[0] === ':';
}

// If a path param ends with a "?" it is optional
function isOptionalPathParam(pathParam: string): boolean {
  const lastCharIndex = pathParam.length - 1;

  return pathParam[lastCharIndex] === '?';
}

// Transform: ':id?' to 'id'
function pathParamToKey(pathParam: string): string {
  // Either stop at the ? or stop at the end of the pathParam
  const end =
    pathParam[pathParam.length - 1] === '?'
      ? pathParam.length - 1
      : pathParam.length;

  return pathParam.substring(1, end);
}

function stripEndingSlashes(url: string): string {
  // If the url is only a '/' which is the case for the home url
  // then leave it a is.
  if (url === '/') {
    return url;
  }

  return url.replace(/\/+$/, '');
}
