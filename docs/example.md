---
layout: default
---

# Example

Here's an example containing a `Dashboard` component which has
both query params and path parameters.

For a [rationale on why and how mad-react-url works click here](/).

## Dashboard.js

```js
// @flow

import React, { Component } from 'react';
import type { RouterHistory, Location, Match } from 'react-router-dom';
import { withQueryParams } from 'mad-react-url';

import { toDashboard } from './links';

export type DashboardPathParams = {
  id: number
};

export type DashboardQueryParams = {
  page: number,
  query: string
};

export const defaultDashboardQueryParams: DashboardQueryParams = Object.freeze({
  page: 1,
  query: ''
});

type Props = {
  history: RouterHistory,
  location: Location,
  queryParams: DashboardQueryParams,
  match: Match
};

type State = {
  name: string
};

export class Dashboard extends Component<Props, State> {
  state = {
    name: 'stranger'
  };

  componentDidMount() {
    this.loadData(this.props.queryParams);
  }

  componentDidUpdate(prevProps: Props) {
    const queryParams = this.props.queryParams;

    if (isEqual(queryParams, prevProps.queryParams)) {
      return;
    }

    this.loadData(queryParams);
  }

  async loadData(queryParams: UserListQueryParams) {
    const id = parseInt(this.props.match.params.id, 10);

    const response = await fetch(`api/user/${id}?page=${queryParams.page}&query=${queryParams.query}`);
    const user = await response.json();

    this.setState({ name: user.name });
  }

  queryChanged(query: string) {
    this.props.history.push(
      toDashboard({ id: this.props.match.params.id }, { query })
    );
  }

  render() {
    const { page, query } = this.props.queryParams;
    const { name } = this.state;

    return (
      <div>
        <h1>
          Hello {name} You are on page {page} with query {query}.
        </h1>

        <input
          type="text"
          value={name}
          onChange={event => queryChanged(event.target.value)}
        />
      </div>
    );
  }
}

export default withQueryParams(UserList, defaultUserListQueryParams);
```

## Links.js

```js
//@flow

import type { Url } from 'mad-react-url';
import { urlQueryBuilder } from 'mad-react-url';

import type { DashboardPathParams, DashboardQueryParams } from './Dashboard';

export function toDashboard(
  pathParams?: DashboardPathParams,
  queryParams?: $Shape<DashboardQueryParams>
): Url {
  return urlQueryBuilder({
    url: '/dashboard/:id',
    pathParams,
    queryParams,
    defaultQueryParams: defaultUserListQueryParams
  });
}
```

## Routes.js

```js
// @flow

import React from 'react';

import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';

import Dashboard from './Dashboard';

import * as links from './links';

export default function Routes() {
  return (
    <BrowserRouter>
      <div>
        <Link to={toDashboard({ id: 1 })}>Dashboard</Link>

        <Switch>
          <Route exact path={links.toDashboard()} component={Dashboard} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}
```
