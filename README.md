erfc
===
[![NPM version][npm-image]][npm-url] [![Build Status][build-image]][build-url] [![Coverage Status][coverage-image]][coverage-url] [![Dependencies][dependencies-image]][dependencies-url]

> [Complementary error function][complementary-error-function].

The [complementary error function][complementary-error-function] is defined as

<div class="equation" align="center" data-raw-text="\operatorname{erfc}(x) = 1 - \operatorname{erf}(x) = \frac{2}{\sqrt\pi} \int_x^{\infty} e^{-t^2}\, dt" data-equation="eq:complementary_error_function">
	<img src="" alt="Complementary error function.">
	<br>
</div>

The [complementary error function][complementary-error-function] can also be expressed using Craig's formula

<div class="equation" align="center" data-raw-text="\operatorname{erfc}(x) = \frac{2}{\pi} \int_0^{\frac{\pi}{2}} \exp \left( - \frac{x^2}{\sin^2 \theta} \right) d\theta" data-equation="eq:craigs_formula">
	<img src="" alt="Craig's formula of the complementary error function.">
	<br>
</div>


## Installation

``` bash
$ npm install math-erfc
```


## Usage

``` javascript
var erfc = require( 'math-erfc' );
```

#### erfc( x )

Evaluates the [complementary error function][complementary-error-function].

``` javascript
var y = erfc( 2 );
// returns ~0.0047

y = erfc( -1 )
// returns ~1.8427

y = erfc( Number.POSITIVE_INFINITY );
// returns 0

y = erfc( Number.NEGATIVE_INFINITY );
// returns 2
```

If provided `NaN`, the `function` returns `NaN`.

``` javascript
var y = erfc( NaN );
// returns NaN
```


## Examples

``` javascript
var linspace = require( 'compute-linspace' );
var erfc = require( 'math-erfc' );

var x = linspace( -10, 10, 100 );
var y;
var i;

for ( i = 0; i < x.length; i++ ) {
	y = erfc( x[ i ] );
	console.log( 'x: %d, erfc(x): %d', x[ i ], y );
}
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```


---
## Tests

### Unit

This repository uses [tape][tape] for unit tests. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul][istanbul] as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


### Browser Support

This repository uses [Testling][testling] for browser testing. To run the tests in a (headless) local web browser, execute the following command in the top-level application directory:

``` bash
$ make test-browsers
```

To view the tests in a local web browser,

``` bash
$ make view-browser-tests
```

<!-- [![browser support][browsers-image]][browsers-url] -->


---
## License

[MIT license](http://opensource.org/licenses/MIT).


## Copyright

Copyright &copy; 2016. The [Compute.io][compute-io] Authors.


[npm-image]: http://img.shields.io/npm/v/math-erfc.svg
[npm-url]: https://npmjs.org/package/math-erfc

[build-image]: http://img.shields.io/travis/math-io/erfc/master.svg
[build-url]: https://travis-ci.org/math-io/erfc

[coverage-image]: https://img.shields.io/codecov/c/github/math-io/erfc/master.svg
[coverage-url]: https://codecov.io/github/math-io/erfc?branch=master

[dependencies-image]: http://img.shields.io/david/math-io/erfc.svg
[dependencies-url]: https://david-dm.org/math-io/erfc

[dev-dependencies-image]: http://img.shields.io/david/dev/math-io/erfc.svg
[dev-dependencies-url]: https://david-dm.org/dev/math-io/erfc

[github-issues-image]: http://img.shields.io/github/issues/math-io/erfc.svg
[github-issues-url]: https://github.com/math-io/erfc/issues

[tape]: https://github.com/substack/tape
[istanbul]: https://github.com/gotwarlost/istanbul
[testling]: https://ci.testling.com

[compute-io]: https://github.com/compute-io/
[complementary-error-function]: https://en.wikipedia.org/wiki/Error_function
[ieee754]: https://en.wikipedia.org/wiki/IEEE_754-1985