import { parse } from 'querystring';

/**
 * A function which augments the props with the queryParams from the
 * react-router-dom's `Location.search` string as an actual object.
 *
 * Requires defaultQueryParameters to fill in the blanks when the
 * query parameters are not in the url. This way you are guaranteed
 * to always have values for your query parameters.
 *
 * It also uses the defaultQueryParameters to convert the query
 * parameters (which all come out as strings) to the type of
 * the defaultQueryParameter.
 */
export function queryParamsFromLocation<QueryParams>(
  location: { search?: string },
  defaultQueryParams: QueryParams,
  debugName: string,
): QueryParams {
  const currentQueryParams = location.search ? queryParamsFromSearch(location.search) : {};
  const mergedQueryParamsAsString = { ...defaultQueryParams, ...currentQueryParams };
  return convertQueryParamsToConcreteType(mergedQueryParamsAsString, defaultQueryParams, debugName);
}

function queryParamsFromSearch(search: string): object {
  if (search[0] === '?') {
    search = search.substr(1);
  }

  return parse(search);
}

/**
 * Takes an query params object as created by the query-string's parse
 * function, and a definition for the defaultQueryParams, and tries
 * to convert from 'string' to a more concrete type.
 *
 * query-string's parse always returns strings, since we know the
 * default value for a query param, we can try to convert those
 * strings to the type of the default value for that query param.
 *
 * When an array is encountered it converts all values to the type
 * of the first item in the default values array. If the default
 * values array is empty, it defaults to only strings.
 *
 * @param {Object} queryParams
 * @param {Object} defaultQueryParams
 */
export function convertQueryParamsToConcreteType<QueryParams>(
  queryParams: QueryParams,
  defaultQueryParams: QueryParams,
  debugName: string,
): QueryParams {
  const typedQueryParams: Record<string, any> = {};

  Object.keys(queryParams).forEach((key: string) => {
    // @ts-ignore
    const defaultValue = defaultQueryParams[key];

    if (defaultValue === undefined) {
      console.warn(`@42.nl/react-url: no default query param defined for "${key}" for: "${debugName}".`);
    }

    // @ts-ignore
    const actualValue = queryParams[key];

    /*
      The `queryParams` are the result of calling `parse` from the
      `query-string` library. When it sees a key multiple times it
      transforms it into an array, for example:

      `parse('?filters=GREEN&filters=RED')`

      Becomes:

      `{ filters: ['GREEN', 'RED'] }`

      However there is one gotcha: it will only transform to an array
      when it encounters mulptile values for the same key, so this:

      `parse('?filters=ALL')`

      Becomes:

      `{ filters: 'ALL' }`

      We do not want this, we always want to return an array, when the
      `defaultValue` is an array. So that is why we check if the 
      `defaultValue` is an array.

      If the `defaultValue` is an array, it will make sure that the
      `actualValue` is parsed and becomes an array of that type.
    */
    if (defaultValue instanceof Array) {
      const first = defaultValue[0];

      // Convert to an array if we got a singular value. Because
      // we always want to return an array.
      const actualArray = Array.isArray(actualValue) ? actualValue : [actualValue];

      if (first === undefined) {
        typedQueryParams[key] = actualArray;
      } else {
        switch (typeof first) {
          case 'number':
            typedQueryParams[key] = actualArray.map((s: any) => parseFloat(s));
            break;

          case 'boolean':
            typedQueryParams[key] = actualArray.map(stringToBoolean);
            break;

          default:
            typedQueryParams[key] = actualArray;
            break;
        }
      }
    } else {
      // actualValue should be a string here.
      switch (typeof defaultValue) {
        case 'number':
          typedQueryParams[key] = parseFloat(actualValue);
          break;

        case 'boolean':
          typedQueryParams[key] = stringToBoolean(actualValue);
          break;

        default:
          typedQueryParams[key] = actualValue;
      }
    }
  });

  return typedQueryParams as QueryParams;
}

function stringToBoolean(value: string): boolean {
  return value === 'true' ? true : false;
}
