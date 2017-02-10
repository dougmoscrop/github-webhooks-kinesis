'use strict';

const crypto = require('crypto');

const test = require('ava');
const supertest = require('supertest-as-promised');
const nock = require('nock');

const app = require('../webhook');

test.beforeEach(() => {
  process.env.secret = 'bananas';
  process.env.kinesis_stream = 'arn:blah:blah:blah';
})

test('rejects with missing signature', t => {
  return supertest(app.callback())
    .post('/')
    .send({ foo: 'bar' })
    .set('X-GitHub-Event', 'ping')
    .then((res) => {
      t.is(res.statusCode, 400);
    })
});

test('rejects with bad signature', t => {
  return supertest(app.callback())
    .post('/')
    .send({ foo: 'bar' })
    .set('X-Hub-Signature', 'abc')
    .set('X-GitHub-Event', 'ping')
    .then((res) => {
      t.is(res.statusCode, 400);
    })
});

test('rejects with wrong length signature', t => {
  return supertest(app.callback())
    .post('/')
    .send({ foo: 'bar' })
    .set('X-Hub-Signature', 'sha1=abcdef')
    .set('X-GitHub-Event', 'ping')
    .then((res) => {
      t.is(res.statusCode, 400);
    })
});

test('accepts with correct signature', t => {
  nock('https://kinesis.us-east-1.amazonaws.com').post('/').reply(200);

  const body = { foo: 'bar' };

  const hmac = crypto.createHmac('sha1', 'bananas');

  hmac.setEncoding('hex');
  hmac.write(JSON.stringify(body));
  hmac.end();

  const hash = hmac.read();

  return supertest(app.callback())
    .post('/')
    .send(body)
    .set('X-Hub-Signature', `sha1=${hash}`)
    .set('X-GitHub-Event', 'ping')
    .then((res) => {
      t.is(res.statusCode, 204);
    })
});

test('fails with correct signature but missing event type', t => {
  const body = { foo: 'bar' };

  const hmac = crypto.createHmac('sha1', 'bananas');

  hmac.setEncoding('hex');
  hmac.write(JSON.stringify(body));
  hmac.end();

  const hash = hmac.read();

  return supertest(app.callback())
    .post('/')
    .send(body)
    .set('X-Hub-Signature', `sha1=${hash}`)
    .then((res) => {
      t.is(res.statusCode, 400);
    })
});
