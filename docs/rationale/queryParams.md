---
layout: default
title: Query params
permalink: /query-params
parent: Rationale
nav_order: 2
---

`mad-react-url` fixes the `query params are strings` problem, via one simple 
abstraction: withQueryParams. withQueryParams is a higher order function
which makes all query params available as React props.

For example:

```js
import React, { Component } from 'react';
import { RouterHistory, Location } from 'react-router-dom';
import { withQueryParams } from 'mad-react-url';

interface UserListQueryParams {
  page: number;
  query: string;
}

// You should freeze the object to prevent manipulation.
export function defaultUserListQueryParams(): UserListQueryParams {
  return {
    page: 1,
    query: ''
  };
}

interface Props {
  history: RouterHistory;
  location: Location;
  queryParams: UserListQueryParams;
}

type State = {};

export class UserList extends Component<Props, State> {
  
  // If a query param needs to change simply route to it!
  queryChanged(query: string) {
    this.props.history.push(toUsers({ query }))
  }

  render() {
    // Grab the query params from the props.
    const { page, query } = this.props.queryParams;

    /* 
      Because we have defined default query parameters, page and
      query will always have values, so no undefined checking is
      required.
    */

    // Use the query params in the render.
  }
}
 
export default withQueryParams(UserList, defaultUserListQueryParams());
```

Now you can render it in a route, and the query params will be
available in the props:

```js
 <Route exact path={toUsers()} component={UserList} />
```

Query params by default are strings, `mad-react-url` tries to convert
them to more concrete types. It does does based on the default query
params you give to `withQueryParams`. It does the following 
transformations:

1. If the default query param is a boolean it converts to boolean.
2. If the default query param is a number it converts to number.
   Also works for fractions such as `3.14`.
3. If the default query param is an array of booleans in converts
   to an array of booleans.
4. If the default query param is an array of numbers in converts
   to an array of numbers.

It does not transform values when:

1. The default query param is a string.
2. The default query param is an empty array.

