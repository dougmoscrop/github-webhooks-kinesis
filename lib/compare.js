'use strict';

const crypto = require('crypto');

const equal = require('timing-safe-equal');

module.exports = function compare(signature, body) {
  const hmac = crypto.createHmac('sha1', process.env.secret);

  hmac.update(body, 'utf-8');

  const hash = `sha1=${hmac.digest('hex')}`;

  return (hash.length === signature.length)
    && equal(new Buffer(hash), new Buffer(signature));
};
