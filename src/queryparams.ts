// Make sure you use `query-string` and not `querystring` which is
// a Node.js library.
import queryString, { type ParsedQuery } from 'query-string';

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
export function queryParamsFromLocation<
  QueryParams extends Record<string, unknown>
>({
  location,
  defaultQueryParams,
  debugName
}: {
  location?: { search?: string };
  defaultQueryParams: QueryParams;
  debugName: string;
}): QueryParams {
  const currentQueryParams = queryParamsFromSearch(
    location ? location.search : window.location.search
  );
  const mergedQueryParams = { ...defaultQueryParams, ...currentQueryParams };
  return convertQueryParamsToConcreteType<QueryParams>(
    mergedQueryParams,
    defaultQueryParams,
    debugName
  );
}

function queryParamsFromSearch(search?: string): ParsedQuery {
  if (!search) {
    return {};
  }

  if (search[0] === '?') {
    search = search.slice(1);
  }

  return queryString.parse(search);
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
 * @param {QueryParams} queryParams The query params extracted from the location
 * @param {QueryParams} defaultQueryParams The default query parameters
 * @param {string} debugName The name to use for debugging purposes
 * @returns {QueryParams} The QueryParams converted to a concrete type.
 */
function convertQueryParamsToConcreteType<
  QueryParams extends Record<string, unknown>
>(
  queryParams: QueryParams,
  defaultQueryParams: QueryParams,
  debugName: string
): QueryParams {
  const typedQueryParams: Record<string, unknown> = {};

  Object.keys(queryParams).forEach((key: string) => {
    const defaultValue = defaultQueryParams[key];

    if (defaultValue === undefined) {
      console.warn(
        `@42.nl/react-url: no default query param defined for "${key}" for: "${debugName}".`
      );
    }

    const actualValue = queryParams[key];

    // If we got a default value we do nothing.
    if (actualValue === defaultValue) {
      typedQueryParams[key] = actualValue;
      return;
    }

    /*
      The `queryParams` are the result of calling `parse` from the
      `query-string` library. When it sees a key multiple times it
      transforms it into an array, for example:

      `parse('?filters=GREEN&filters=RED')`

      Becomes:

      `{ filters: ['GREEN', 'RED'] }`

      However there is one gotcha: it will only transform to an array
      when it encounters multiple values for the same key, so this:

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
      const actualArray: string[] = Array.isArray(actualValue)
        ? actualValue
        : [actualValue];

      if (first === undefined) {
        typedQueryParams[key] = actualArray;
      } else {
        switch (typeof first) {
          case 'number':
            typedQueryParams[key] = actualArray.map((s) => parseFloat(s));
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
          typedQueryParams[key] = parseFloat(actualValue as string);
          break;

        case 'boolean':
          typedQueryParams[key] = stringToBoolean(actualValue as string);
          break;

        default:
          typedQueryParams[key] = actualValue;
      }
    }
  });

  return typedQueryParams as QueryParams;
}

function stringToBoolean(value: string): boolean {
  return value === 'true';
}
