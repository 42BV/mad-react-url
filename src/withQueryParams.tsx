import React, { ReactNode } from 'react';
import getDisplayName from 'react-display-name';

import { queryParamsFromLocation } from './queryparams';

export type WithQueryProps<QueryParams> = {
  location: { search?: string };
  queryParams?: QueryParams;
};

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
 * @param {React.ComponentType<P>} Component The react component which you want to encapsulate with the withQueryParams HoC
 * @param {Object} defaultQueryParameters The default query parameters which will be used to fill in any blanks in the query params
 * @returns {HoC} which provides the query params as a prop.
 */
export const withQueryParams = <P extends Record<string, unknown>, QueryParams>(
  Component: React.ComponentType<P>,
  defaultQueryParams: QueryParams
): React.ComponentClass<P & WithQueryProps<QueryParams>> => {
  class WithQueryParams extends React.Component<
    P & WithQueryProps<QueryParams>
  > {
    public render(): ReactNode {
      const { location, ...props } = this.props;

      // @ts-expect-error accept that there might be a displayName;
      const debug = WithQueryParams.displayName;

      const typedQueryParams = queryParamsFromLocation(
        location,
        defaultQueryParams,
        debug
      );

      return <Component queryParams={typedQueryParams} {...(props as P)} />;
    }
  }

  // @ts-expect-error accept that there might be a displayName;
  WithQueryParams.displayName = `WithQueryParams(${getDisplayName(Component)})`;

  return WithQueryParams;
};
