/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
const sinon = require('sinon');

const assert = require('chai').assert;
const Environment = require('../addons/environment');

const Request = require('../../client/lib/request');
const ErrorMocks = require('../mocks/errors');
describe('request module', function() {
  var RequestMocks;
  var request;
  var env;

  beforeEach(function() {
    env = new Environment();
    RequestMocks = env.RequestMocks;
    request = new Request(env.authServerUrl, env.xhr);
  });

  it('#heartbeat', function() {
    var heartbeatRequest = env
      .respond(
        request.send('/__heartbeat__', 'GET'),
        RequestMocks.heartbeat
      )
      .then(function(res) {
        assert.ok(res);
      }, assert.notOk);

    return heartbeatRequest;
  });

  it('#error', function() {
    request = new Request('http://', env.xhr);

    request.send('/', 'GET').then(assert.notOk, function() {
      assert.ok(true);
    });
  });

  it('#timeout', function() {
    request = new Request('http://google.com:81', env.xhr, {
      timeout: 200,
    });

    var timeoutRequest = env.respond(
      request.send('/', 'GET'),
      ErrorMocks.timeout
    );

    return timeoutRequest.then(assert.notOk, function(err) {
      assert.equal(err.error, 'Timeout error');
    });
  });

  it('#bad response format error', function() {
    request = new Request('http://example.com/', env.xhr);

    // Trigger an error response that's in HTML
    var response = env.respond(
      request.send('/nonexistent', 'GET'),
      ErrorMocks.badResponseFormat
    );

    return response.then(assert.notOk, function(err) {
      assert.equal(err.error, 'Unknown error');
    });
  });

  // it('#ensure is usable', function() {
  //   request = new Request('http://google.com:81', env.xhr, {
  //     timeout: 200,
  //   });
  //   sinon.stub(env.xhr.prototype, 'open').throws();
  //
  //   return env
  //     .respond(
  //       request.send('/__heartbeat__', 'GET'),
  //       RequestMocks.heartbeat
  //     )
  //     .then(null, function(err) {
  //       assert.ok(err);
  //       env.xhr.prototype.open.restore();
  //     });
  // });
});
