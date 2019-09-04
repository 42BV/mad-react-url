# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.2.2] - 2019-09-04

- Bugfix: useQueryParams now properly updates when changing the QueryParams.

## [2.2.1] - 2019-08-07

- Bugfix the type of the pathParams was incorrectly set to QueryParam
  in the urlBuilder. Now has its own generic called PathParam.

## [2.2.0] - 2019-07-29

- Removed QueryParams as a model now expecting the user to provide
  them via generics instead.

## [2.1.0] - 2019-07-16

- Changed package name to '42.nl/react-url'
- Added useQueryParams hook

## [2.0.0] - 2019-04-17

- Converted project to TypeScript

## [1.0.0] - 2018-07-23

This release contains breaking changes, to migrate do the following:

Use the `urlBuilder` instead of the `urlQueryBuilder` now. The
`urlQueryBuilder` has been renamed to `urlBuilder`, and the old
`urlBuilder` is no longer exposed. So everything should work
as intended.

Changes:

- Reduced the API surface of the library exposing one builder called:
  `urlBuilder`. It behaves the same as `urlQueryBuilder` did.

- `withQueryParams` now converts the query params from strings to
  a more concrete type based on the default query params.

## [0.0.1] - 2018-01-15

### Added

- The first version of this library.
