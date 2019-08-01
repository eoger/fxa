/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const assert = require('chai').assert;
const Environment = require('../addons/environment');

if (process.env.useRemoteServer) {
  return;
}

describe('subscriptions', function() {
  var accountHelper;
  var respond;
  var client;
  var RequestMocks;
  let env;

  beforeEach(function() {
    env = new Environment();
    accountHelper = env.accountHelper;
    respond = env.respond;
    client = env.client;
    RequestMocks = env.RequestMocks;
  });

  it('#getActiveSubscriptions - missing token', function() {
    return accountHelper
      .newVerifiedAccount()
      .then(function(account) {
        return respond(
          client.getActiveSubscriptions(),
          RequestMocks.getActiveSubscriptions
        );
      })
      .then(assert.notOk, function(error) {
        assert.include(error.message, 'Missing token');
      });
  });
  it('#getActiveSubscriptions', function() {
    return accountHelper
      .newVerifiedAccount()
      .then(function(account) {
        return respond(
          client.getActiveSubscriptions('saynomore'),
          RequestMocks.getActiveSubscriptions
        );
      })
      .then(function(resp) {
        assert.ok(resp);
      }, assert.notOk);
  });

  it('#createSupportTicket - missing token', function() {
    return accountHelper
      .newVerifiedAccount()
      .then(function(account) {
        return respond(
          client.createSupportTicket(),
          RequestMocks.createSupportTicket
        );
      })
      .then(assert.notOk, function(error) {
        assert.include(error.message, 'Missing token');
      });
  });
  it('#createSupportTicket - missing supportTicket', function() {
    return accountHelper
      .newVerifiedAccount()
      .then(function(account) {
        return respond(
          client.createSupportTicket('redpandas'),
          RequestMocks.createSupportTicket
        );
      })
      .then(assert.notOk, function(error) {
        assert.include(error.message, 'Missing supportTicket');
      });
  });
  it('#createSupportTicket', function() {
    return accountHelper
      .newVerifiedAccount()
      .then(function(account) {
        return respond(
          client.createSupportTicket('redpandas', {
            topic: 'Species',
            subject: 'Cute & Rare',
            message: 'Need moar',
          }),
          RequestMocks.createSupportTicket
        );
      })
      .then(function(resp) {
        assert.ok(resp);
      }, assert.notOk);
  });
});
