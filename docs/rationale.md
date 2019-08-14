---
layout: default
title: Rationale
permalink: /rationale
nav_order: 2
---

This library helps you solve the following two problems:

## Problem one: `routes are strings`

With react-router you can define routes which map components to
certain URLs, however all these URLs are simple strings. This
comes with the following drawbacks:

1. A URL is easy to get wrong: `/user` vs `/uzer` for example.

2. Changing a URL requires you to find and replace strings in your
   project, so it is easy to miss something.

The solution is a function called `urlBuilder` which is explained
[here]({{ "defining-urls" | prepend: site.baseurl }}).

The `urlBuilder` helps you create so called `Url functions`. Which are
simple functions which allow you to navigate to routes.

## Problem two: `query params are strings and optional`

Also with `react-router` the query params are provided to you as
a `search` string for example: `"?query=somestring&page=1"`. This
is not very friendly and typesafe to work with.

Also the query params can be empty, which is very annoying because
this means a lot of null checks to prove that the query param exists.

The solution is a `hook` called `useQueryParams` which is explained
[here]({{ "query-params" | prepend: site.baseurl }}).

The `useQueryParams` hook makes sure the query params are always defined
and converts strings to more concrete values.