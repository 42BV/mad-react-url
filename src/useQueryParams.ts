import { useState } from 'react';
import { queryParamsFromLocation } from './queryparams';

export interface Config<QueryParams> {
  location: { search?: string; key?: string };
  defaultQueryParams: QueryParams;
  debugName?: string;
}

export function useQueryParams<QueryParams>({
  location,
  defaultQueryParams,
  debugName = '',
}: Config<QueryParams>): QueryParams {
  const [queryParams, setQueryParams] = useState(() => {
    return queryParamsFromLocation(location, defaultQueryParams, debugName);
  });

  const [search, setSearch] = useState(location.search);

  if (search !== location.search) {
    const params = queryParamsFromLocation(location, defaultQueryParams, debugName);
    setQueryParams(params);
    setSearch(location.search);
  }

  return queryParams;
}
