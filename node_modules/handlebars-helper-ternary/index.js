'use strict';

/**
 * Test a value and return a "yes" or "no" argument based on the result.
 *
 * @param {*} test Value to test for truthiness
 * @param {string} yes Value to return when test is truthy
 * @param {string} no Value to return when test is falsy
 */
module.exports = function(test, yes, no) {
    return (typeof test === 'function' ? test.call(this) : test) ? yes : no;
};
