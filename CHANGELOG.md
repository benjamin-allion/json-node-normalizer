# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.4] - In progress, release soon...
### Warning
- Normalization field type configuration has been renamed :

Before : 
```javascript
    const config = {
      fieldNames: {
        type: 'normalization_type'
      }
    };
```

Now :
```javascript
    const config = {
      typeFieldName: 'normalization_type',
      formatFieldName: 'normalization_format'
    };
```

### Added
- String formatting support (See #14, #15).
- Refactoring & fix some methods documentation problems.
- Fix config merge deep problem.

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
