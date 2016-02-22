
#############
# VARIABLES #

NPM ?= npm
NODE_ENV ?= test

KERNEL ?= $(shell uname -s)
ifeq ($(KERNEL), Darwin)
	OPEN ?= open
else
	OPEN ?= xdg-open
endif


# NOTES #

NOTES ?= 'TODO|FIXME|WARNING|HACK|NOTE'


# TAPE #

TAPE ?= ./node_modules/.bin/tape
TAP_REPORTER ?=  ./node_modules/.bin/tap-spec


# ISTANBUL #

ISTANBUL ?= ./node_modules/.bin/istanbul
ISTANBUL_OUT ?= ./reports/coverage
ISTANBUL_REPORT ?= lcov
ISTANBUL_LCOV_INFO_PATH ?= $(ISTANBUL_OUT)/lcov.info
ISTANBUL_HTML_REPORT_PATH ?= $(ISTANBUL_OUT)/lcov-report/index.html


# BROWSERIFY #

BROWSERIFY ?= ./node_modules/.bin/browserify


# TESTLING #

TESTLING ?= ./node_modules/.bin/testling
TESTLING_DIR ?= ./


# JSHINT #

JSHINT ?= ./node_modules/.bin/jshint
JSHINT_REPORTER ?= ./node_modules/jshint-stylish



# FILES #

SOURCES ?= lib/*.js
TESTS ?= test/*.js




###########
# TARGETS #


# HELP #

.PHONY: help

help:
	@echo ''
	@echo 'Usage: make <cmd>'
	@echo ''
	@echo '  make help                Print this message.'
	@echo '  make notes               Search for code annotations.'
	@echo '  make test                Run tests.'
	@echo '  make test-cov            Run tests with code coverage.'
	@echo '  make test-browsers       Run tests in a local web browser.'
	@echo '  make view-cov            View the most recent code coverage report.'
	@echo '  make view-browser-tests  View browser tests in a local web browser.'
	@echo '  make lint                Run code linting.'
	@echo '  make install             Install dependencies.'
	@echo '  make clean               Clean the build directory.'
	@echo '  make clean-node          Remove Node dependencies.'
	@echo ''



# NOTES #

.PHONY: notes

notes:
	grep -Ern $(NOTES) $(SOURCES) $(TESTS)



# UNIT TESTS #

.PHONY: test test-tape

test: test-tape

test-tape: node_modules
	NODE_ENV=$(NODE_ENV) \
	NODE_PATH=$(NODE_PATH_TEST) \
	$(TAPE) \
		"$(TESTS)" \
	| $(TAP_REPORTER)



# CODE COVERAGE #

.PHONY: test-cov test-istanbul-tape

test-cov: test-istanbul-tape

test-istanbul-tape: node_modules
	NODE_ENV=$(NODE_ENV) \
	NODE_PATH=$(NODE_PATH_TEST) \
	$(ISTANBUL) cover \
		--dir $(ISTANBUL_OUT) \
		--report $(ISTANBUL_REPORT) \
	$(TAPE) -- \
		"$(TESTS)"



# COVERAGE REPORT #

.PHONY: view-cov view-istanbul-report

view-cov: view-istanbul-report

view-istanbul-report:
	$(OPEN) $(ISTANBUL_HTML_REPORT_PATH)



# BROWSER TESTS #

.PHONY: test-browsers test-testling view-browser-tests view-testling

test-browsers: test-testling

test-testling: node_modules
	NODE_ENV=$(NODE_ENV) \
	NODE_PATH=$(NODE_PATH_TEST) \
	$(BROWSERIFY) \
		$(TESTS) \
	| $(TESTLING) \
	| $(TAP_REPORTER)

view-browser-tests: view-testling

view-testling: node_modules
	NODE_ENV=$(NODE_ENV) \
	NODE_PATH=$(NODE_PATH_TEST) \
	$(BROWSERIFY) \
		$(TESTS) \
	| $(TESTLING) \
		--x $(OPEN) \
	| $(TAP_REPORTER)



# LINT #

.PHONY: lint lint-jshint

lint: lint-jshint

lint-jshint: node_modules
	$(JSHINT) \
		--reporter $(JSHINT_REPORTER) \
		./



# NODE #

.PHONY: install clean-node

install: package.json
	$(NPM) install

clean-node:
	rm -rf node_modules



# CLEAN #

.PHONY: clean

clean:
	rm -rf build
