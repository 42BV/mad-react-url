---
layout: default
title: Rationale
permalink: /rationale
nav_order: 2
has_children: true
---

This library helps you solve the following two problems:

## Problem one: `routes are strings`

With react-router you can define routes which map components to
certain URLs, however all these URLs are simple strings. This
comes with the following drawbacks:

1. A URL is easy to get wrong: `/user` vs `/uzer` for example.
2. Changing a URL requires you to find and replace strings in your
   project, so it is easy to miss something.

Solution: [routes.]({{ "routes" | prepend: site.baseurl }})

## Problem two: `query params are strings`

Also with react-router the query params are provided to you as
a `search` string for example: `"?query=somestring&page=1"`. This
is not very friendly and typesafe to work with.

Solution: [query params.]({{ "query-params" | prepend: site.baseurl }})