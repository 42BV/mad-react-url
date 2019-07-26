---
layout: default
title: Routes
permalink: /routes
parent: Rationale
nav_order: 1
---

`@42.nl/react-url` fixes the `string based route` problem, via one simple 
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
import { Url } from '@42.nl/react-url';

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
import { Url, urlBuilder } from '@42.nl/react-url';

// We recommend defining this type in the UserEdit component's file.
interface UserEditPathParams { 
  id: number;
}

// This url function takes a path parameter called :id
export function toUserEdit(pathParams?: UserEditPathParams): Url {
  return urlBuilder({
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
import { Url, urlBuilder } from '@42.nl/react-url';

// We recommend defining this type in the UserList component's file.
interface UserListQueryParams { 
  page: number;
  search: string;
}

// We recommend defining the default query params in the UserList component's file.
const defaultUserListQueryParams = { page: 1, search: '' };

// This url function has query params page and search, they are both
// optional because of Partial. Partial takes an object type definition
// and makes all keys optional, and does not allow unknown keys.
export function toUsers(queryParams?: Partial<UserListQueryParams>): Url {
  return urlBuilder({
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