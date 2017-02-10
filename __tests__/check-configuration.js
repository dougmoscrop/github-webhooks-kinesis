'use strict';

const test = require('ava');

const checkConfiguration = require('../lib/check-configuration');

test.beforeEach(() => {
  process.env.secret = 'bananas';
  process.env.kinesis_stream = 'arn:blah:blah:blah';
})

test.serial('does not fail if configuration is present', () => {
  checkConfiguration();
});

test.serial('fails if secret is missing', (t) => {
  delete process.env.secret;

  t.throws(() => {
    checkConfiguration();
  });
});


test.serial('fails if kinesis_stream is missing', (t) => {
  delete process.env.kinesis_stream;

  t.throws(() => {
    checkConfiguration();
  });
});
