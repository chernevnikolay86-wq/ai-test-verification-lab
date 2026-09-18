"use strict";

function fail(message) {
  throw new Error(message);
}

function deepEqual(actual, expected, label) {
  const actualText = JSON.stringify(actual);
  const expectedText = JSON.stringify(expected);
  if (actualText !== expectedText) {
    fail(`${label}: expected ${expectedText}, got ${actualText}`);
  }
}

function throws(fn, ErrorType, messageFragment, label) {
  try {
    fn();
  } catch (error) {
    if (!(error instanceof ErrorType)) {
      fail(`${label}: expected ${ErrorType.name}, got ${error.constructor.name}`);
    }
    if (messageFragment && !error.message.includes(messageFragment)) {
      fail(`${label}: expected error containing ${JSON.stringify(messageFragment)}, got ${JSON.stringify(error.message)}`);
    }
    return;
  }
  fail(`${label}: expected ${ErrorType.name} to be thrown`);
}

function runSuite(suite, implementation) {
  const failures = [];
  for (const testCase of suite.cases) {
    try {
      testCase.run(implementation, { deepEqual, throws });
    } catch (error) {
      failures.push({ name: testCase.name, message: error.message });
    }
  }
  return {
    name: suite.name,
    total: suite.cases.length,
    passed: suite.cases.length - failures.length,
    failures,
  };
}

module.exports = { runSuite };
