// @flow

import * as React from 'react';
import { parse } from 'query-string';
import type { Location } from 'react-router-dom';

/**
 * A HoC which augments the props with the queryParams from the
 * react-router-dom's `Location.search` string as an actual object.
 *
 * Requires defaultQueryParameters to fill in the blanks when the
 * query parameters are not in the url. This way you are guaranteed
 * to always have values for your query parameters.
 *
 * It also uses the defaultQueryParameters to convert the query
 * parameters (which all come out as strings) to the type of
 * the defaultQueryParameter.
 *
 * @example
 * withQueryParams(App, { page: 1, search: '', showAll: true })
 *
 * This will create an App component which has a prop queryParams which
 * is an object which contains page a number, search a string, and
 * showAll a boolean.
 *
 * @example
 * withQueryParams(App, { show: ['medium'] })
 *
 * Can also support arrays and convert to actual types as well.
 *
 * @param {String} options.url The url to be parsed
 * @param {Object} options.pathParams Consists of the matching key in the url to be replaced by the value.
 */
export function withQueryParams<Props: { location: Location }>(
  WrappedComponent: React.ComponentType<Props>,
  defaultQueryParams: Object
) {
  const name = getDisplayName(WrappedComponent);

  const WithQueryParams = (props: Props) => {
    const currentParams = parse(props.location.search);

    const queryParamsAsString = { ...defaultQueryParams, ...currentParams };

    const typedQueryParams = convertQueryParamsToConcreteType(
      queryParamsAsString,
      defaultQueryParams,
      name
    );

    return <WrappedComponent queryParams={typedQueryParams} {...props} />;
  };

  WithQueryParams.displayName = `withQueryParams(${name})`;

  return WithQueryParams;
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
export function convertQueryParamsToConcreteType(
  queryParams: Object,
  defaultQueryParams: Object,
  componentName: string
): Object {
  const typedQueryParams = {};

  Object.keys(queryParams).forEach(key => {
    const defaultValue = defaultQueryParams[key];

    if (defaultValue === undefined) {
      console.warn(`mad-react-url: no default query param defined for "${key}" for component: "${componentName}".`)
    }

    const actualValue = queryParams[key];

    if (actualValue instanceof Array) {
      const first = defaultValue[0];

      if (first === undefined) {
        typedQueryParams[key] = actualValue;
      } else {
        switch (typeof first) {
          case 'number':
            typedQueryParams[key] = actualValue.map(s => parseFloat(s));
            break;

          case 'boolean':
            typedQueryParams[key] = actualValue.map(stringToBoolean);
            break;

          default:
            typedQueryParams[key] = actualValue;
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

  return typedQueryParams;
}

function stringToBoolean(value: string): boolean {
  return value === 'true' ? true : false;
}

/* istanbul ignore next */
function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}