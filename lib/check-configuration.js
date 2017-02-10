'use strict';

module.exports = function checkConfiguration() {
  if (typeof process.env.secret === 'undefined') {
    throw new Error('Missing secret')
  }

  if (typeof process.env.kinesis_stream === 'undefined') {
    throw new Error('Missing kinesis_stream');
  }
};
