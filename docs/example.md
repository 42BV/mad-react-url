---
layout: default
title: Example
permalink: /example
nav_order: 6
---

Here's an example containing a `Dashboard` component which has
both query params and path parameters.

For a [rationale on why and how mad-react-url works click here]({{ "rationale" | prepend: site.baseurl }}).

## Dashboard.js

```js
import React, { Component } from 'react';
import { RouterHistory, Location, Match } from 'react-router-dom';
import { Url, withQueryParams, urlBuilder } from 'mad-react-url';

import { toDashboard } from './links';

interface DashboardPathParams {
  id: number;
}

interface DashboardQueryParams {
  page: number;
  query: string;
}

export function defaultDashboardQueryParams(): DashboardQueryParams {
  return {
    page: 1,
    query: ''
  };
}

interface Props {
  history: RouterHistory;
  location: Location;
  queryParams: DashboardQueryParams;
  match: Match;
}

interface State {
  name: string;
}

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

  async loadData(queryParams: DashboardQueryParams) {
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

export default withQueryParams(Dashboard, defaultDashboardQueryParams());

export function toDashboard(
  pathParams?: DashboardPathParams,
  queryParams?: Partial<DashboardQueryParams>
): Url {
  return urlBuilder({
    url: '/dashboard/:id',
    pathParams,
    queryParams,
    defaultQueryParams: defaultDashboardQueryParams()
  });
}
```

## Routes.js

```js
import React from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';

import Dashboard, { toDashboard } from './Dashboard';

export default function Routes() {
  return (
    <BrowserRouter>
      <div>
        <Link to={toDashboard({ id: 1 })}>Dashboard</Link>

        <Switch>
          <Route exact path={toDashboard()} component={Dashboard} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}
```
