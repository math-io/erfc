'use strict';

// MODULES //

var tape = require( 'tape' );
var NINF = require( 'const-ninf-float64' );
var PINF = require( 'const-pinf-float64' );
var abs = require( 'math-abs' );
var erfc = require( './../lib' );


// FIXTURES //

var largerNegative = require( './fixtures/larger_negative.json' );
var largerPositive = require( './fixtures/larger_positive.json' );
var largeNegative = require( './fixtures/large_negative.json' );
var largePositive = require( './fixtures/large_positive.json' );
var mediumNegative = require( './fixtures/medium_negative.json' );
var mediumPositive = require( './fixtures/medium_positive.json' );
var smallNegative = require( './fixtures/small_negative.json' );
var smallPositive = require( './fixtures/small_positive.json' );
var smaller = require( './fixtures/smaller.json' );
var tinyNegative = require( './fixtures/tiny_negative.json' );
var tinyPositive = require( './fixtures/tiny_positive.json' );
var subnormal = require( './fixtures/subnormal.json' );


// FUNCTIONS //

function almostEqual( a, b, tol ) {
	var delta = abs( a - b );
	tol = tol * Math.max( 1, abs( a ), abs( b ) );
	return ( delta <= tol );
}


// TESTS //

tape( 'main export is a function', function test( t ) {
	t.equal( typeof erfc, 'function', 'main export is a function' );
	t.end();
});

tape( 'the function evaluates the complementary error function for `x` on the interval `[-5,-100]', function test( t ) {
	var expected;
	var bool;
	var tol;
	var x;
	var y;
	var i;

	tol = 2e-16;

	expected = largerNegative.expected;
	x = largerNegative.x;
	for ( i = 0; i < x.length; i++ ) {
		y = erfc( x[i] );
		if ( y === expected[i] ) {
			t.equal( y, expected[i], 'x: '+x[i]+', y: '+y+', expected: '+expected[i] );
		}  else {
			bool = almostEqual( y, expected[i], tol );
			t.ok( bool, 'within tolerance. x: '+x[i]+'. y: '+y+'. Expected: '+expected[i]+'. Tolerance: '+tol+'.' );
		}
	}
	t.end();
});

tape( 'the function evaluates the complementary error function for `x` on the interval `[5,100]`', function test( t ) {
	var expected;
	var bool;
	var tol;
	var x;
	var y;
	var i;

	tol = 2e-16;

	expected = largerPositive.expected;
	x = largerPositive.x;
	for ( i = 0; i < x.length; i++ ) {
		y = erfc( x[i] );
		if ( y === expected[i] ) {
			t.equal( y, expected[i], 'x: '+x[i]+', y: '+y+', expected: '+expected[i] );
		}  else {
			bool = almostEqual( y, expected[i], tol );
			t.ok( bool, 'within tolerance. x: '+x[i]+'. y: '+y+'. Expected: '+expected[i]+'. Tolerance: '+tol+'.' );
		}
	}
	t.end();
});

tape( 'the function evaluates the complementary error function for `x` on the interval `[-2.5,-28]`', function test( t ) {
	var expected;
	var bool;
	var tol;
	var x;
	var y;
	var i;

	tol = 2e-16;

	expected = largeNegative.expected;
	x = largeNegative.x;
	for ( i = 0; i < x.length; i++ ) {
		y = erfc( x[i] );
		if ( y === expected[i] ) {
			t.equal( y, expected[i], 'x: '+x[i]+', y: '+y+', expected: '+expected[i] );
		}  else {
			bool = almostEqual( y, expected[i], tol );
			t.ok( bool, 'within tolerance. x: '+x[i]+'. y: '+y+'. Expected: '+expected[i]+'. Tolerance: '+tol+'.' );
		}
	}
	t.end();
});

tape( 'the function evaluates the complementary error function for `x` on the interval `[2.5,28]`', function test( t ) {
	var expected;
	var bool;
	var tol;
	var x;
	var y;
	var i;

	tol = 2e-16;

	expected = largePositive.expected;
	x = largePositive.x;
	for ( i = 0; i < x.length; i++ ) {
		y = erfc( x[i] );
		if ( y === expected[i] ) {
			t.equal( y, expected[i], 'x: '+x[i]+', y: '+y+', expected: '+expected[i] );
		}  else {
			bool = almostEqual( y, expected[i], tol );
			t.ok( bool, 'within tolerance. x: '+x[i]+'. y: '+y+'. Expected: '+expected[i]+'. Tolerance: '+tol+'.' );
		}
	}
	t.end();
});

tape( 'the function evaluates the complementary error function for `x` on the interval `[-1,-3]`', function test( t ) {
	var expected;
	var bool;
	var tol;
	var x;
	var y;
	var i;

	tol = 2e-16;

	expected = mediumNegative.expected;
	x = mediumNegative.x;
	for ( i = 0; i < x.length; i++ ) {
		y = erfc( x[i] );
		if ( y === expected[i] ) {
			t.equal( y, expected[i], 'x: '+x[i]+', y: '+y+', expected: '+expected[i] );
		}  else {
			bool = almostEqual( y, expected[i], tol );
			t.ok( bool, 'within tolerance. x: '+x[i]+'. y: '+y+'. Expected: '+expected[i]+'. Tolerance: '+tol+'.' );
		}
	}
	t.end();
});

tape( 'the function evaluates the complementary error function for `x` on the interval `[1,3]`', function test( t ) {
	var expected;
	var bool;
	var tol;
	var x;
	var y;
	var i;

	tol = 2e-16;

	expected = mediumPositive.expected;
	x = mediumPositive.x;
	for ( i = 0; i < x.length; i++ ) {
		y = erfc( x[i] );
		if ( y === expected[i] ) {
			t.equal( y, expected[i], 'x: '+x[i]+', y: '+y+', expected: '+expected[i] );
		}  else {
			bool = almostEqual( y, expected[i], tol );
			t.ok( bool, 'within tolerance. x: '+x[i]+'. y: '+y+'. Expected: '+expected[i]+'. Tolerance: '+tol+'.' );
		}
	}
	t.end();
});

tape( 'the function evaluates the complementary error function for `x` on the interval `[-0.8,-1]`', function test( t ) {
	var expected;
	var bool;
	var tol;
	var x;
	var y;
	var i;

	tol = 3e-16;

	expected = smallNegative.expected;
	x = smallNegative.x;
	for ( i = 0; i < x.length; i++ ) {
		y = erfc( x[i] );
		if ( y === expected[i] ) {
			t.equal( y, expected[i], 'x: '+x[i]+', y: '+y+', expected: '+expected[i] );
		}  else {
			bool = almostEqual( y, expected[i], tol );
			t.ok( bool, 'within tolerance. x: '+x[i]+'. y: '+y+'. Expected: '+expected[i]+'. Tolerance: '+tol+'.' );
		}
	}
	t.end();
});

tape( 'the function evaluates the complementary error function for `x` on the interval `[0.8,1]`', function test( t ) {
	var expected;
	var x;
	var y;
	var i;

	expected = smallPositive.expected;
	x = smallPositive.x;
	for ( i = 0; i < x.length; i++ ) {
		y = erfc( x[i] );
		t.equal( y, expected[i], 'x: '+x[i]+', y: '+y+', expected: '+expected[i] );
	}
	t.end();
});

tape( 'the function evaluates the complementary error function for `x` on the interval `[-0.8,0.8]`', function test( t ) {
	var expected;
	var x;
	var y;
	var i;

	expected = smaller.expected;
	x = smaller.x;
	for ( i = 0; i < x.length; i++ ) {
		y = erfc( x[i] );
		t.equal( y, expected[i], 'x: '+x[i]+', y: '+y+', expected: '+expected[i] );
	}
	t.end();
});

tape( 'the function evaluates the complementary error function for `x` on the interval `[-1e-300,-1e-308]`', function test( t ) {
	var expected;
	var x;
	var y;
	var i;

	expected = tinyNegative.expected;
	x = tinyNegative.x;
	for ( i = 0; i < x.length; i++ ) {
		y = erfc( x[i] );
		t.equal( y, expected[i], 'x: '+x[i]+', y: '+y+', expected: '+expected[i] );
	}
	t.end();
});

tape( 'the function evaluates the complementary error function for `x` on the interval `[1e-300,1e-308]`', function test( t ) {
	var expected;
	var x;
	var y;
	var i;

	expected = tinyPositive.expected;
	x = tinyPositive.x;
	for ( i = 0; i < x.length; i++ ) {
		y = erfc( x[i] );
		t.equal( y, expected[i], 'x: '+x[i]+', y: '+y+', expected: '+expected[i] );
	}
	t.end();
});

tape( 'the function evaluates the complementary error function for subnormal `x`', function test( t ) {
	var expected;
	var x;
	var y;
	var i;

	expected = subnormal.expected;
	x = subnormal.x;
	for ( i = 0; i < x.length; i++ ) {
		y = erfc( x[i] );
		t.equal( y, expected[i], 'x: '+x[i]+', y: '+y+', expected: '+expected[i] );
	}
	t.end();
});

tape( 'if provided `-0`, the function returns `1`', function test( t ) {
	var y = erfc( -0 );
	t.equal( y, 1, 'returns 1' );
	t.end();
});

tape( 'if provided `+0`, the function returns `1`', function test( t ) {
	var y = erfc( +0 );
	t.equal( y, 1, 'returns 1' );
	t.end();
});

tape( 'if provided `-infinity`, the function returns `2`', function test( t ) {
	var y = erfc( NINF );
	t.equal( y, 2, 'returns 2' );
	t.end();
});

tape( 'if provided `+infinity`, the function returns `0`', function test( t ) {
	var y = erfc( PINF );
	t.equal( y, 0, 'returns 0' );
	t.end();
});

tape( 'if provided `NaN`, the function returns `NaN`', function test( t ) {
	var y = erfc( NaN );
	t.ok( y !== y, 'returns NaN' );
	t.end();
});
