'use strict';

const aws = require('aws-sdk');
const koa = require('koa');
const rawBody = require('raw-body');
const serverless = require('serverless-http');

const stringify = require('./lib/stringify');
const checkConfiguration = require('./lib/check-configuration');
const compare = require('./lib/compare');

aws.config.update({ region: 'us-east-1' });

const app = koa();
const kinesis = new aws.Kinesis();

app.use(function* readEventHeader(next) {
  const header = this.request.header['x-github-event'];

  if (typeof header === 'string' && header.length > 0) {
    this.state.event = header;
    return yield next;
  }

  this.status = 400;
  this.body = 'Missing X-GitHub-Event';
})

app.use(function* readSignatureHeader(next) {
  const header = this.request.header['x-hub-signature'];

  if (typeof header === 'string' && header.match(/sha1=\S+/)) {
    this.state.signature = header;
    return yield next;
  }

  this.status = 400;
  this.body = 'Missing X-Hub-Signature';
});

app.use(function* checkSignature(next) {
  checkConfiguration();

  this.state.body = yield rawBody(this.req, {
    length: this.req.headers['content-length'],
    limit: '1mb',
    encoding: 'utf-8'
  });

  if (compare(this.state.signature, this.state.body)) {
    return yield next;
  }

  this.status = 400;
  this.body = 'Invalid X-Hub-Signature';
});

app.use(function* publish() {
  console.log(`Sending ${this.state.event} to ${process.env.kinesis_stream}`);

  const params = {
    StreamName: process.env.kinesis_stream,
    PartitionKey: this.state.event,
    Data: stringify(this.state.event, this.state.body)
  };

  yield kinesis.putRecord(params).promise();

  this.status = 204;
});

module.exports = app;
module.exports.handler = serverless(app);
