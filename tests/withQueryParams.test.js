// @flow

import React from 'react';
import { shallow } from 'enzyme';

import { withQueryParams } from '../src/withQueryParams';

describe('Test withQueryParams HOC', () => {
  let Welcome;

  beforeEach(() => {
    Welcome = (props: { location: { search: string}, name: string }) => {
      return <h1>Hello, {props.name}</h1>;
    };

    Welcome = withQueryParams(Welcome, { query: 'default' });
  });

  it('should use the default params when search is empty', () => {
    const welcome = shallow(<Welcome location={{ search: ''}} name="hallo" />);

    expect(welcome.props().queryParams.query).toBe('default');
  });

  it('should use the query params if they are provided', () => {
    const location = { search: '?query=hallo' };

    const welcome = shallow(<Welcome location={location} name="hallo" />);

    expect(welcome.props().queryParams.query).toBe('hallo');
  });
});
