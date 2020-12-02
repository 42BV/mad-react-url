import React, { FunctionComponent } from 'react';
import { shallow } from 'enzyme';

import { withQueryParams, WithQueryProps } from '../src/withQueryParams';

type QueryParams = {
  query: string;
};

type Props = {
  location: { search: string };
  name: string;
};

describe('Test withQueryParams HOC', () => {
  let Welcome: React.ComponentClass<Props & WithQueryProps<QueryParams>>;

  beforeEach(() => {
    const component: FunctionComponent<Props> = (props): React.ReactElement => {
      return <h1>Hello, {props.name}</h1>;
    };

    Welcome = withQueryParams(component, { query: 'default' });
  });

  it('should use the default params when search is empty', () => {
    const location = { search: '' };

    const welcome = shallow(<Welcome location={location} name="hallo" />);

    expect(welcome.props().queryParams.query).toBe('default');
  });

  it('should use the query params if they are provided', () => {
    const location = { search: '?query=hallo' };

    const welcome = shallow(<Welcome location={location} name="hallo" />);

    expect(welcome.props().queryParams.query).toBe('hallo');
  });
});
