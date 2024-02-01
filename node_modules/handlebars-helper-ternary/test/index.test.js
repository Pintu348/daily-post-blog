'use strict';

var test = require('tape'),
    Handlebars = require('handlebars'),
    ternaryHelper = require('..'),
    source = '{{ternary value "yes" "no"}}',
    template;

Handlebars.registerHelper('ternary', ternaryHelper);
template = Handlebars.compile(source);

test('ternary', function(assert) {
    var cases = {};

    assert.plan(7);

    cases.truthy = [
        { value: true },
        { value: 1 },
        { value: 'yes' },
        { value: function() { return true; } }
    ];

    cases.falsy = [
        { value: false },
        { value: 0 },
        { value: function() { return false; } }
    ];

    cases.truthy.forEach(function(testcase) {
        var actual = template(testcase);
        assert.equal(actual, 'yes',
            'should return "yes" value when test is truthy');
    });

    cases.falsy.forEach(function(testcase) {
        var actual = template(testcase);
        assert.equal(actual, 'no',
            'should return "no" value when test is falsy');
    });
});
