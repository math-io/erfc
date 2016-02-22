'use strict';

var linspace = require( 'compute-linspace' );
var erfc = require( './../lib' );

var x = linspace( -10, 10, 100 );
var y;
var i;

for ( i = 0; i < x.length; i++ ) {
	y = erfc( x[ i ] );
	console.log( 'x: %d, erfc(x): %d', x[ i ], y );
}