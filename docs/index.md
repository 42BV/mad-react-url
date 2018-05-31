---
layout: default
---

# About

This library makes it easy to define URL's and type them with flow.

# Installation

`npm install mad-react-url --save`

# Example

If you just want to see a complete [example in code go here](/example).

# The problems with routes in react-router

This library wants to solve the following two problems:

Problem one: routes are strings

With react-router you can define routes which map components to
certain Url's. In react-router all URL's are simply strings. This
comes with the following drawbacks:

1. A Url is easy to get wrong: `/user` vs `/uzer` for example.
2. Changing a Url requires you to find and replace strings in your
   project, so it is easy to miss something.

Problem two: query params are strings

Also with react-router the query params are provided to you as
a `search` string for example: `"?query=somestring&page=1"`. This
is not very friendly and typesafe to work with.

# Solutions

## Solution one: routes are strings

`mad-react-url` fixes the `string based route` problem, via one simple 
abstraction: Url functions. Url functions are functions which return Url's. 
Optionally these Url functions take query parameter's and path parameters
as arguments.

A function is a url function if it matches the following criteria:

1. The function has a return type of Url.
2. If the Url has query parameters, they are a parameter to the url function.
3. If the Url has path parameter, they are parameters to the url function.
4. If the url function is called without parameters it returns the meta url.

A meta url is simply the url without filled in placeholders. Take
this meta url for example: `users/:id/edit`. In this url the `:id`
should be replaced with some `id` for example: `users/42/edit`. By
calling the url function without a provided id it should return 
`users/:id/edit`. Which is what exactly what react-router needs.

So the url function has two features:

  1. It knows how to supply a route definition to react-router.
  2. It know how to build a url to navigate to.

Lets look at some examples:

The easiest url function is one that simply returns a string:

```js
//@flow

import type { Url } from 'mad-react-url';

// The simplest way to define a Url function is to return a string.
export function toUserCreate(): Url {
  return '/users/create';
}

// To use it in react-router to define a route you simply call it:
<Route path={toUserCreate()} component={UserCreate}/>

// To use it to navigate to a route you simply call it:
<Link to={toUserCreate()}>/users/create</Link>

// Or programmatically
this.props.history.push(toUserCreate());
```

If the route has path parameters:

```js
//@flow

import type { Url } from 'mad-react-url';
import { urlQueryBuilder } from 'mad-react-url';

// We recommend defining this type in the UserEdit component's file.
type UserEditPathParams = { id: number };

// This url function takes a path parameter called :id
export function toUserEdit(pathParams?: UserEditPathParams): Url {
  return urlQueryBuilder({
    url: '/users/:id/edit',
    pathParams
  });
}

// To use it in react-router to define a route you simply call it:
<Route path={toUserEdit()} component={UserEdit} />

// To use it to navigate to a route you simply call it:
<Link to={toUserEdit({ id: 42 })}>/users/42/edit</Link>

// Or programmatically
this.props.history.push(toUserEdit({ id: 42 }));
```

If the route has query params:

```js
//@flow

import type { Url } from 'mad-react-url';
import { urlQueryBuilder } from 'mad-react-url';

// We recommend defining this type in the UserList component's file.
type UserListQueryParams = { page: number, search: string };

// We recommend defining the default query params in the UserList component's file.
const defaultUserListQueryParams = { page: 1, search: '' };

// This url function has query params page and search, they are both
// optional because of $Shape. $Shapes takes an object type definition
// and makes all keys optional, and does not allow unknown keys.
export function toUsers(queryParams?: $Shape<UserListQueryParams>): Url {
  return urlQueryBuilder({
    url: '/users',
    queryParams,
    defaultQueryParams: defaultUserListQueryParams
  });
}

// To use it in react-router to define a route you simply call it:
<Route path={toUsers()} component={UserEdit} />

// To use it to navigate to a route you simply call it:
<Link to={toUsers({ page: 13 })}>/users?page=13</Link>

// Or programmatically
this.props.history.push(toUsers({ page: 13 }));
```

The query parameters are not appended to the url when they match
the default query parameters exactly. The reason for this is so
the urls are as small as possible.

Here are some examples:

```js
toUsers({page: 1, search: ''})        // /users
toUsers({page: 42, search: ''})       // /users?page=42
toUsers({page: 1, search: 'answer'})  // /users?answer=42
```

## Solution two: query params are strings

`mad-react-url` fixes the `query params are strings` problem, via one simple 
abstraction: withQueryParams. withQueryParams is a higher order function
which makes all query params available as React props.

For example:

```js
// @flow

import React, { Component } from 'react';
import type { RouterHistory, Location } from 'react-router-dom';
import { withQueryParams } from 'mad-react-url';

// toUsers is a url function
import { toUsers } from './links';

export type UserListQueryParams = {
  page: number,
  query: string
};

// You should freeze the object to prevent manipulation.
export const defaultUserListQueryParams: UserListQueryParams = Object.freeze({
  page: 1,
  query: ''
});

type Props = {
  history: RouterHistory,
  location: Location,
  queryParams: UserListQueryParams
};

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
 
export default withQueryParams(UserList, defaultUserListQueryParams);
```

Now you can render it in a route, and the query params will be
available in the props:

```js
 <Route exact path={links.toUsers()} component={UserList} />
```