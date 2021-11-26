# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.11]
- Replace 'cacheId' path param by a value [#60](https://github.com/benjamin-allion/json-node-normalizer/pull/60)

## [1.0.10]
- New cache option to increase performance. [#58](https://github.com/benjamin-allion/json-node-normalizer/issues/58)
- New 'clearCache' method

See README.MD documentation for more information about cache function.

## [1.0.9]
- Dependencies update

## [1.0.8] - 2021-11-16
- Fix default value set for boolean field with false. [#52](https://github.com/benjamin-allion/json-node-normalizer/issues/52)
- Fix dependencies security vulnerability.
 
## [1.0.7] - 2021-04-12
- Add 'default' value support. [#38](https://github.com/benjamin-allion/json-node-normalizer/issues/38)
- Full 'normalizer.js' refactoring [#41](https://github.com/benjamin-allion/json-node-normalizer/issues/41)
- <!> Replace 'normalizePath' function by 'normalizePaths' [#41](https://github.com/benjamin-allion/json-node-normalizer/issues/41)
- <!> New signature for 'normalizeNode' function [#41](https://github.com/benjamin-allion/json-node-normalizer/issues/41)
- Update documentation for 'normalizePaths' & default values [#41](https://github.com/benjamin-allion/json-node-normalizer/issues/41)

## [1.0.6] - 2021-03-31
- Fix dependencies security vulnerability.
- Upgrade all dependencies to last version
- Add new string converter to support object -> string conversion and avoid '[object Object]' values (see #34)

## [1.0.5] - 2019-12-29
- Fix dependencies security vulnerability. (See #28)

## [1.0.4] - 2019-11-06

### Major bugfix
- Fix boolean not correctly normalized / converted. 
  See [#26](https://github.com/benjamin-allion/json-node-normalizer/issues/26)
- Fix number with decimal normalization support. See [#24](https://github.com/benjamin-allion/json-node-normalizer/issues/24)
- Fix JsonNodeNormalizer configuration support.

### Added
- String formatting support (See #14, #15).
  You can now normalize string type into lowercase / uppercase.
- Refactoring & fix some methods documentation problems.
- 'oasFlatten' method to flat the definition (for Swagger 2 & Openapi 3 specifications support)

## [1.0.3] - 2019-07-23
### Added
- Normalization field type configuration support (See #13).
- Optimising dependencies :
  Remove useless development dependencies.
  Upgrade all dependencies to latest versions.
  Fix 'lodash' development dependency security vulnerability. (See #16)

## [1.0.2] - 2019-06-23
### Added
- 'null' type support
- Optimising dependencies :
  Remove 'codacy-coverage' dep. from release version.

## [1.0.1] - 2019-06-17
### Added
- Logging level support
- Documentation about logging level

## [1.0.0] - 2019-06-16
### Added
- First release
- Normalization by Json Schema
- Normalization by Json Path
- Json-Schema $Ref Support
- Type support : number, integer, string, array, boolean
