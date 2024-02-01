# handlebars-helper-ternary

A [Handlebars][] ternary helper.

[![npm Version][npm-badge]][npm]
[![Build Status][build-badge]][build-status]
[![Test Coverage][coverage-badge]][coverage-result]
[![Dependency Status][dep-badge]][dep-status]

## Installation

Install using npm:

    $ npm install handlebars-helper-ternary

## Usage

**helpers.js**

Example helpers file that requires in Handlebars and registers the ternary
helper under the name "ternary".

```js
var Handlebars = require('handlebars');

Handlebars.registerHelper('ternary', require('handlebars-helper-ternary'));
```

**templates/example.handlebars**

Example template file that makes use of the ternary helper.  This helper
accepts three arguments: a `test` argument to evaluate for truthiness, a `yes`
argument to return in the case that `test` is truthy, and a `no` argument to
return in the case that `test` is falsy.


```
<button type="button">{{ternary isNew "Add" "Save"}}</button>
```

## Changelog

### 1.0.0 - 2015-07-17
- Initial release

## License

MIT

[Handlebars]: http://handlebarsjs.com/
[build-badge]: https://img.shields.io/travis/jimf/handlebars-helper-ternary/master.svg
[build-status]: https://travis-ci.org/jimf/handlebars-helper-ternary
[npm-badge]: https://img.shields.io/npm/v/handlebars-helper-ternary.svg
[npm]: https://www.npmjs.org/package/handlebars-helper-ternary
[coverage-badge]: https://img.shields.io/coveralls/jimf/handlebars-helper-ternary.svg
[coverage-result]: https://coveralls.io/r/jimf/handlebars-helper-ternary
[dep-badge]: https://img.shields.io/david/jimf/handlebars-helper-ternary.svg
[dep-status]: https://david-dm.org/jimf/handlebars-helper-ternary
