'use strict';

/**
* NOTE: the following copyright and license, as well as the long comment were part of the original implementation available as part of [FreeBSD]{@link https://svnweb.freebsd.org/base/release/9.3.0/lib/msun/src/s_erf.c?revision=268523&view=co}.
*
* The implementation follows the original, but has been modified for JavaScript.
*/

/**
* ====================================================
* Copyright (C) 1993 by Sun Microsystems, Inc. All rights reserved.
*
* Developed at SunPro, a Sun Microsystems, Inc. business.
* Permission to use, copy, modify, and distribute this
* software is freely granted, provided that this notice
* is preserved.
* ====================================================
*/

/**
* double erfc(double x)
*                                 x
*                        2       |\
*        erf(x)  = -----------   | exp(-t*t)dt
*                     sqrt(pi)  \|
*                                0
*
*        erfc(x) = 1-erf(x)
*
*   Note that
*
*        erf(-x)  = -erf(x)
*        erfc(-x) = 2 - erfc(x)
*
* Method:
*	1. For |x| in [0, 0.84375),
*
*        erf(x)  = x + x*R(x^2)
*        erfc(x) = 1 - erf(x)           if x in [-.84375,0.25]
*                = 0.5 + ((0.5-x)-x*R)  if x in [0.25,0.84375]
*
*      where R = P/Q where P is an odd polynomial of degree 8 and Q is an odd polynomial of degree 10.
*
*        | R - (erf(x)-x)/x | <= 2**-57.90
*
*      Remark: the formula is derived by noting
*
*        erf(x) = (2/sqrt(pi))*(x - x^3/3 + x^5/10 - x^7/42 + ....)
*
*      and that
*
*        2/sqrt(pi) = 1.128379167095512573896158903121545171688
*
*      is close to one. The interval is chosen because the fix point of erf(x) is near 0.6174 (i.e., erf(x)=x when x is near 0.6174), and, by some experiment, 0.84375 is chosen to guarantee the error is less than one ulp for erf.
*
*   2. For |x| in [0.84375,1.25), let s = |x| - 1, and c = 0.84506291151 rounded to single (24 bits)
*
*        erf(x)  = sign(x) * (c + P1(s)/Q1(s))
*        erfc(x) = (1-c) - P1(s)/Q1(s) if x > 0
*                  1+(c+P1(s)/Q1(s))   if x < 0
*        |P1/Q1 - (erf(|x|)-c)| <= 2**-59.06
*
*      Remark: here we use the Taylor series expansion at x=1.
*
*        erf(1+s) = erf(1) + s*Poly(s)
*                 = 0.845.. + P1(s)/Q1(s)
*
*      That is, we use a rational approximation to approximate
*
*        erf(1+s) - (c = (single)0.84506291151)
*
*      Note that |P1/Q1|< 0.078 for x in [0.84375,1.25] where
*
*        P1(s) = degree 6 poly in s
*        Q1(s) = degree 6 poly in s
*
*   3. For x in [1.25,1/0.35(~2.857143)),
*
*        erfc(x) = (1/x)*exp(-x*x-0.5625+R1/S1)
*        erf(x)  = 1 - erfc(x)
*
*      where
*
*        R1(z) = degree 7 poly in z, (z=1/x^2)
*        S1(z) = degree 8 poly in z
*
*   4. For x in [1/0.35,28],
*
*        erfc(x) = (1/x)*exp(-x*x-0.5625+R2/S2)       if x > 0
*                = 2.0 - (1/x)*exp(-x*x-0.5625+R2/S2) if -6 < x < 0
*                = 2.0 - tiny                         if x <= -6
*        erf(x)  = sign(x)*(1.0 - erfc(x))            if x < 6, else
*        erf(x)  = sign(x)*(1.0 - tiny)
*
*      where
*
*        R2(z) = degree 6 poly in z, (z=1/x^2)
*        S2(z) = degree 7 poly in z
*
*   Note1:
*       To compute exp(-x*x-0.5625+R/S), let s be a single precision number and s := x; then
*
*        -x*x = -s*s + (s-x)*(s+x)
*        exp(-x*x-0.5626+R/S) = exp(-s*s-0.5625)*exp((s-x)*(s+x)+R/S);
*
*   Note2:
*       Here 4 and 5 make use of the asymptotic series
*
*                     exp(-x*x)
*         erfc(x) ~  ----------- * ( 1 + Poly(1/x^2) )
*                     x*sqrt(pi)
*
*       We use a rational approximation to approximate
*
*           g(s) = f(1/x^2) = log(erfc(x)*x) - x*x + 0.5625
*
*       Here is the error bound for R1/S1 and R2/S2
*
*           |R1/S1 - f(x)| < 2**(-62.57)
*           |R2/S2 - f(x)| < 2**(-61.52)
*
*   5. For inf > x >= 28,
*
*        erf(x)  = sign(x) * (1 - tiny)   (raise inexact)
*        erfc(x) = tiny*tiny              (raise underflow) if x > 0
*                = 2 - tiny               if x<0
*
*   6. Special cases:
*
*        erf(0) = 0
*        erf(inf) = 1
*        erf(-inf) = -1
*        erfc(0) = 1
*        erfc(inf) = 0
*        erfc(-inf) = 2,
*        erf(NaN) is NaN
*        erfc(NaN) is NaN
*/

// MODULES //

var evalpoly = require( 'math-evalpoly' ).factory;
var exp = require( 'math-exp' );
var setLowWord = require( 'math-float64-set-low-word' );


// CONSTANTS //

var PINF = require( 'const-pinf-float64' );
var NINF = require( 'const-ninf-float64' );

var TINY = 1e-300;

// 2**-56 = 1/(2**56) = 1/72057594037927940
var SMALL = 1.3877787807814457e-17;

var ERX = 8.45062911510467529297e-1; // 0x3FEB0AC1, 0x60000000

// Coefficients for approximation to erf on [0, 0.84375)
var PPC = 1.28379167095512558561e-1;  // 0x3FC06EBA, 0x8214DB68
var PP = [
	-3.25042107247001499370e-1, // 0xBFD4CD7D, 0x691CB913
	-2.84817495755985104766e-2, // 0xBF9D2A51, 0xDBD7194F
	-5.77027029648944159157e-3, // 0xBF77A291, 0x236668E4
	-2.37630166566501626084e-5  // 0xBEF8EAD6, 0x120016AC
];
var QQC = 1.0;
var QQ = [
	3.97917223959155352819e-1, // 0x3FD97779, 0xCDDADC09
	6.50222499887672944485e-2, // 0x3FB0A54C, 0x5536CEBA
	5.08130628187576562776e-3, // 0x3F74D022, 0xC4D36B0F
	1.32494738004321644526e-4, // 0x3F215DC9, 0x221C1A10
	-3.96022827877536812320e-6 // 0xBED09C43, 0x42A26120
];

// Coefficients for approximation to erf on [0.84375, 1.25)
var PAC = -2.36211856075265944077e-3; // 0xBF6359B8, 0xBEF77538
var PA = [
	4.14856118683748331666e-1,  // 0x3FDA8D00, 0xAD92B34D
	-3.72207876035701323847e-1, // 0xBFD7D240, 0xFBB8C3F1
	3.18346619901161753674e-1,  // 0x3FD45FCA, 0x805120E4
	-1.10894694282396677476e-1, // 0xBFBC6398, 0x3D3E28EC
	3.54783043256182359371e-2,  // 0x3FA22A36, 0x599795EB
	-2.16637559486879084300e-3  // 0xBF61BF38, 0x0A96073F
];
var QAC = 1.0;
var QA = [
	1.06420880400844228286e-1, // 0x3FBB3E66, 0x18EEE323
	5.40397917702171048937e-1, // 0x3FE14AF0, 0x92EB6F33
	7.18286544141962662868e-2, // 0x3FB2635C, 0xD99FE9A7
	1.26171219808761642112e-1, // 0x3FC02660, 0xE763351F
	1.36370839120290507362e-2, // 0x3F8BEDC2, 0x6B51DD1C
	1.19844998467991074170e-2  // 0x3F888B54, 0x5735151D
];

// Coefficients for approximation to erfc on [1.25, 1/0.35)
var RAC = -9.86494403484714822705e-3; // 0xBF843412, 0x600D6435
var RA = [
	-6.93858572707181764372e-1, // 0xBFE63416, 0xE4BA7360
	-1.05586262253232909814e1,  // 0xC0251E04, 0x41B0E726 
	-6.23753324503260060396e1,  // 0xC04F300A, 0xE4CBA38D
	-1.62396669462573470355e2,  // 0xC0644CB1, 0x84282266
	-1.84605092906711035994e2,  // 0xC067135C, 0xEBCCABB2
	-8.12874355063065934246e1,  // 0xC0545265, 0x57E4D2F2
	-9.81432934416914548592     // 0xC023A0EF, 0xC69AC25C
];
var SAC = 1.0;
var SA = [
	1.96512716674392571292e1,  // 0x4033A6B9, 0xBD707687
	1.37657754143519042600e2,  // 0x4061350C, 0x526AE721
	4.34565877475229228821e2,  // 0x407B290D, 0xD58A1A71
	6.45387271733267880336e2,  // 0x40842B19, 0x21EC2868
	4.29008140027567833386e2,  // 0x407AD021, 0x57700314
	1.08635005541779435134e2,  // 0x405B28A3, 0xEE48AE2C
	6.57024977031928170135,    // 0x401A47EF, 0x8E484A93
	-6.04244152148580987438e-2 // 0xBFAEEFF2, 0xEE749A62
];

// Coefficients for approximation to erfc on [1/0.35, 28]
var RBC = -9.86494292470009928597e-3; // 0xBF843412, 0x39E86F4A
var RB = [
	-7.99283237680523006574e-1, // 0xBFE993BA, 0x70C285DE
	-1.77579549177547519889e1,  // 0xC031C209, 0x555F995A
	-1.60636384855821916062e2,  // 0xC064145D, 0x43C5ED98
	-6.37566443368389627722e2,  // 0xC083EC88, 0x1375F228
	-1.02509513161107724954e3,  // 0xC0900461, 0x6A2E5992
	-4.83519191608651397019e2,  // 0xC07E384E, 0x9BDC383F
];
var SBC = 1.0;
var SB = [
	3.03380607434824582924e1, // 0x403E568B, 0x261D5190
	3.25792512996573918826e2, // 0x40745CAE, 0x221B9F0A
	1.53672958608443695994e3, // 0x409802EB, 0x189D5118
	3.19985821950859553908e3, // 0x40A8FFB7, 0x688C246A
	2.55305040643316442583e3, // 0x40A3F219, 0xCEDF3BE6
	4.74528541206955367215e2, // 0x407DA874, 0xE79FE763
	-2.24409524465858183362e1 // 0xC03670E2, 0x42712D62
];


// FUNCTIONS //

// Compile functions to evaluate polynomials based on the above coefficients...
var polyvalPP = evalpoly( PP );
var polyvalQQ = evalpoly( QQ );
var polyvalPA = evalpoly( PA );
var polyvalQA = evalpoly( QA );
var polyvalRA = evalpoly( RA );
var polyvalSA = evalpoly( SA );
var polyvalRB = evalpoly( RB );
var polyvalSB = evalpoly( SB );


// ERFC //

/**
* FUNCTION: erfc( x )
*	Evaluates the complementary error function.
*
* @param {Number} x - input value
* @returns {Number} evaluated complementary error function
*/
function erfc( x ) {
	var sign;
	var ax;
	var z;
	var r;
	var s;
	var y;
	var p;
	var q;

	// Special case: NaN
	if ( x !== x ) {
		return NaN;
	}
	// Special case: +infinity
	if ( x === PINF ) {
		return 0.0;
	}
	// Special case: -infinity
	if ( x === NINF ) {
		return 2.0;
	}
	// Special case: +-0
	if ( x === 0 ) {
		return 1.0;
	}
	if ( x < 0 ) {
		sign = true;
		ax = -x;
	} else {
		sign = false;
		ax = x;
	}
	// |x| < 0.84375
	if ( ax < 0.84375 ) {
		if ( ax < SMALL ) {
			return 1.0 - x; // raise inexact
		}
		z = x * x;
		r = PPC + z*polyvalPP( z );
		s = QQC + z*polyvalQQ( z );
		y = r / s;

		// x < 1/4
		if ( x < 0.25 ) {
			return 1.0 - (x + x*y);
		}
		r = x * y;
		r += x - 0.5;
		return 0.5 - r;
	}
	// 0.84375 <= |x| < 1.25
	if ( ax < 1.25 ) {
		s = ax - 1.0;
		p = PAC + s*polyvalPA( s );
		q = QAC + s*polyvalQA( s );
		if ( sign ) {
			return 1.0 + ERX + p/q;
		}
		return 1.0 - ERX - p/q;
	}
	// |x| < 28
	if ( ax < 28 ) {
		s = 1.0 / (ax*ax);

		// |x| < 1/0.35 ~ 2.857143
		if ( ax < 2.857142857142857 ) {
			r = RAC + s*polyvalRA( s );
			s = SAC + s*polyvalSA( s );
		}
		// |x| >= 1/0.35 ~ 2.857143
		else {
			// x < -6
			if ( x < -6 ) {
				return 2.0 - TINY; // raise inexact
			}
			r = RBC + s*polyvalRB( s );
			s = SBC + s*polyvalSB( s );
		}
		z = setLowWord( ax, 0 ); // pseudo-single (20-bit) precision x
		r = exp( -z*z - 0.5625 ) * exp( (z-ax)*(z+ax) + r/s );
		if ( sign ) {
			return 2.0 - r/ax;
		}
		return r/ax;
	}
	if ( sign ) {
		return 2.0 - TINY; // raise inexact; ~2
	}
	return TINY * TINY; // raise inexact; ~0
} // end FUNCTION erfc()


// EXPORTS //

module.exports = erfc;