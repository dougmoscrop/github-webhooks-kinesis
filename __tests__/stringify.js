'use strict';

const test = require('ava');

const stringify = require('../lib/stringify');

test('stringify is the same as JSON.parse', t => {
  const event = 'issues';
  const payload = `{"blah":"blah","assignee":"user"}`;

  const expected = JSON.stringify({
    Event: event,
    Payload: JSON.parse(payload)
  });

  const actual = stringify(event, payload)

  t.deepEqual(expected, actual);
});
