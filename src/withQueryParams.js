// @flow

import * as React from 'react';
import { parse } from 'query-string';
import type { Location } from 'react-router-dom';

export function withQueryParams<Props: { location: Location }>(
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
