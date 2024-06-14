import { useEffect, useState } from 'react';
import { queryParamsFromLocation } from './queryparams';

export type Config<QueryParams> = {
  location?: { search?: string; key?: string };
  defaultQueryParams: QueryParams;
  debugName?: string;
};

/**
 * A hook which provides the query params from the react-router-dom's
 * `Location.search` string as an actual typed object.
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
 * type DashboardQueryParams = {
 *   page: number;
 *   query: string;
 *   active: boolean;
 * }
 *
 * export function defaultDashboardQueryParams(): DashboardQueryParams {
 *   return {
 *     page: 1,
 *     query: '',
 *     active: false,
 *   };
 * }
 *
 * function Dashboard() {
 *   const location = useLocation();
 *   const queryParams = useQueryParams({
 *    location,
 *    defaultQueryParams: defaultUserListQueryParams(),
 *    debugName: 'Component',
 *  });
 * }
 *
 * At this point queryParams would be a DashboardQueryParams object.
 *
 * @param {String} options.location The Location object of react-router-dom which contains the query params in the search
 * @param {Object} options.defaultQueryParams The default query parameters which will be used to fill in any blanks in the query params
 * @param {Object} options.debugName The name which will be used for debugging.
 * @returns {Object} The typed object representing the query params
 */
export function useQueryParams<QueryParams extends Record<string, unknown>>(
  options: Config<QueryParams>
): QueryParams {
  const { location, defaultQueryParams, debugName = '' } = options;
  const [queryParams, setQueryParams] = useState(() => {
    return queryParamsFromLocation({ location, defaultQueryParams, debugName });
  });

  useEffect(() => {
    setQueryParams(
      queryParamsFromLocation({
        location,
        defaultQueryParams,
        debugName
      })
    );
  }, [location ? location.search : window.location.search]);

  return queryParams;
}
