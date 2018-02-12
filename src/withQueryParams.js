// @flow

import * as React from 'react';
import { parse } from 'query-string';

export function withQueryParams<Props: { location: { search: string } }>(
  WrappedComponent: React.ComponentType<Props>,
  defaultQueryParams: Object
) {
  return function WrapperComponent(props: Props) {
    const currentParams = parse(props.location.search);

    const queryParams = { ...defaultQueryParams, ...currentParams };
    const propsWithDefaultQueryParams = { ...props, queryParams };
    return <WrappedComponent {...propsWithDefaultQueryParams} />;
  };
}
