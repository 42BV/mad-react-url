import React, { FunctionComponent } from 'react';
import { withQueryParams, WithQueryProps } from '../src/withQueryParams';
import { render } from '@testing-library/react';

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
      return <>{JSON.stringify(props, null, 2)}</>;
    };

    Welcome = withQueryParams(component, { query: 'default' });
  });

  it('should use the default params when search is empty', () => {
    const location = { search: '' };

    const { container } = render(<Welcome location={location} name="hallo" />);

    expect(container).toMatchInlineSnapshot(
      `
      <div>
        {
        "queryParams": {
          "query": "default"
        },
        "name": "hallo"
      }
      </div>
    `
    );
  });

  it('should use the query params if they are provided', () => {
    const location = { search: '?query=hallo' };

    const { container } = render(<Welcome location={location} name="hallo" />);

    expect(container).toMatchInlineSnapshot(
      `
      <div>
        {
        "queryParams": {
          "query": "hallo"
        },
        "name": "hallo"
      }
      </div>
    `
    );
  });
});
