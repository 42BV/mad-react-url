import React, { FunctionComponent } from 'react';
import { shallow } from 'enzyme';
import { Location } from 'history';

import { withQueryParams, convertQueryParamsToConcreteType, WithQueryProps } from '../src/withQueryParams';

interface Props {
  location: object | Location;
  name: string;
}

export function mockLocation(): Location {
  return {
    pathname: 'pathname',
    search: '',
    hash: 'x',
    state: {},
    key: 'key',
  };
}

describe('Test withQueryParams HOC', () => {
  let Welcome: React.ComponentClass<Props & WithQueryProps>;

  beforeEach(() => {
    const component: FunctionComponent<Props> = (props): React.ReactElement => {
      return <h1>Hello, {props.name}</h1>;
    };

    Welcome = withQueryParams(component, { query: 'default' });
  });

  it('should use the default params when search is empty', () => {
    const welcome = shallow(<Welcome location={mockLocation()} name="hallo" />);

    expect(welcome.props().queryParams.query).toBe('default');
  });

  it('should use the query params if they are provided', () => {
    const location = mockLocation();
    location.search = '?query=hallo';

    const welcome = shallow(<Welcome location={location} name="hallo" />);

    expect(welcome.props().queryParams.query).toBe('hallo');
  });
});

describe('convertQueryParamsToConcreteType', () => {
  it('should warn when default query parameters does not contain a query param', () => {
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);

    const queryParams = convertQueryParamsToConcreteType({ color: 'red' }, {}, 'AppComponent');
    expect(queryParams).toEqual({ color: 'red' });

    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith(
      `mad-react-url: no default query param defined for "color" for component: "AppComponent".`,
    );
  });

  it('should leave strings and unhandled types alone', () => {
    const queryParams = convertQueryParamsToConcreteType({ color: 'red' }, { color: 'blue' }, 'AppComponent');
    expect(queryParams).toEqual({ color: 'red' });
  });

  describe('number', () => {
    it('should know how to transform whole numbers', () => {
      const queryParams = convertQueryParamsToConcreteType({ id: '24' }, { id: 1 }, 'AppComponent');
      expect(queryParams).toEqual({ id: 24 });
    });

    it('should know how to transform fractured numbers', () => {
      const queryParams = convertQueryParamsToConcreteType({ id: '1.12' }, { id: 33.3 }, 'AppComponent');
      expect(queryParams).toEqual({ id: 1.12 });
    });
  });

  describe('boolean', () => {
    it('should know how to transform string "true" to boolean true', () => {
      const queryParams = convertQueryParamsToConcreteType({ visible: 'true' }, { visible: true }, 'AppComponent');
      expect(queryParams).toEqual({ visible: true });
    });

    it('should know how to transform string "false" to boolean false', () => {
      const queryParams = convertQueryParamsToConcreteType({ visible: 'false' }, { visible: false }, 'AppComponent');
      expect(queryParams).toEqual({ visible: false });
    });
  });

  describe('array', () => {
    it('should leave arrays of strings alone', () => {
      const queryParams = convertQueryParamsToConcreteType(
        { sizes: ['medium', 'large', 'small'] },
        { sizes: ['small'] },
        'AppComponent',
      );
      expect(queryParams).toEqual({ sizes: ['medium', 'large', 'small'] });
    });

    it('should know how to tranform arrays of numbers', () => {
      const queryParams = convertQueryParamsToConcreteType(
        { numbers: ['1', '2', '3'] },
        { numbers: [42] },
        'AppComponent',
      );
      expect(queryParams).toEqual({ numbers: [1, 2, 3] });
    });

    it('should know how to tranform arrays of booleans', () => {
      const queryParams = convertQueryParamsToConcreteType(
        { visible: ['true', 'false', 'false'] },
        { visible: [true] },
        'AppComponent',
      );
      expect(queryParams).toEqual({ visible: [true, false, false] });
    });

    it('should when it cannot guess the type, due to empty default, revert to strings', () => {
      const queryParams = convertQueryParamsToConcreteType(
        { sizes: ['medium', 'large', 'small'] },
        { sizes: [] },
        'AppComponent',
      );
      expect(queryParams).toEqual({ sizes: ['medium', 'large', 'small'] });
    });
  });
});
