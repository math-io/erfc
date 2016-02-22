# To run this script, `cd` to the `./test/fixtures` directory and then, from the Julia terminal, `include("./runner.jl")`.

import JSON

function gen( x, name )
	y = Array( Float64, length( x ) );
	for i in eachindex(x)
		y[i] = erfc( x[i] );
	end

	data = Dict([
		("x", x),
		("expected", y)
	]);

	outfile = open( name, "w" );
	write( outfile, JSON.json(data) );
	close( outfile );
end

# Subnormal values:
x = linspace( 1e-309, 1e-324, 500 );
gen( x, "subnormal.json" );

# Negative tiny values:
x = linspace( -1e-300, -1e-308, 500 );
gen( x, "tiny_negative.json" );

# Positive tiny values:
x = linspace( 1e-300, 1e-308, 500 );
gen( x, "tiny_positive.json" );

# Small(er) values:
x = linspace( -0.8, 0.8, 500 );
gen( x, "smaller.json" );

# Negative small values:
x = linspace( -0.8, -1.0, 500 );
gen( x, "small_negative.json" );

# Positive small values:
x = linspace( 0.8, 1.0, 500 );
gen( x, "small_positive.json" );

# Negative medium values:
x = linspace( -1.0, -3.0, 500 );
gen( x, "medium_negative.json" );

# Positive medium values:
x = linspace( 1.0, 3.0, 500 );
gen( x, "medium_positive.json" );

# Large negative values:
x = linspace( -2.5, -28.0, 500 );
gen( x, "large_negative.json" );

# Large positive values:
x = linspace( 2.5, 28.0, 500 );
gen( x, "large_positive.json" );

# Larger negative values:
x = linspace( -5.0, -100.0, 500 );
gen( x, "larger_negative.json" );

# Larger positive values:
x = linspace( 5.0, 100.0, 500 );
gen( x, "larger_positive.json" );