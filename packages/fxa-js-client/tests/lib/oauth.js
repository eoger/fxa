/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const assert = require('chai').assert;
const Environment = require('../addons/environment');

// These tests are intended to run against a mock auth-server. To test
// against a local auth-server, you will need to have it correctly
// configured to send sms and specify a real phone number here.

// TODO: update this
if (process.env.useRemoteServer) {
  return;
}

describe('oauth', function() {
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

  it('#createOAuthCode - missing sessionToken', function() {
    return accountHelper
      .newVerifiedAccount()
      .then(function(account) {
        return respond(
          client.createOAuthCode(null, 'client_id', 'state'),
          RequestMocks.createOAuthCode
        );
      })
      .then(assert.notOk, function(error) {
        assert.include(error.message, 'Missing sessionToken');
      });
  });

  it('#createOAuthCode - missing clientId', function() {
    return accountHelper
      .newVerifiedAccount()
      .then(function(account) {
        return respond(
          client.createOAuthCode(
            account.signIn.sessionToken,
            null,
            'state'
          ),
          RequestMocks.createOAuthCode
        );
      })
      .then(assert.notOk, function(error) {
        assert.include(error.message, 'Missing clientId');
      });
  });

  it('#createOAuthCode - missing state', function() {
    return accountHelper
      .newVerifiedAccount()
      .then(function(account) {
        return respond(
          client.createOAuthCode(
            account.signIn.sessionToken,
            'client_id',
            null
          ),
          RequestMocks.createOAuthCode
        );
      })
      .then(assert.notOk, function(error) {
        assert.include(error.message, 'Missing state');
      });
  });

  it('#createOAuthCode', function() {
    return accountHelper
      .newVerifiedAccount()
      .then(function(account) {
        return respond(
          client.createOAuthCode(
            account.signIn.sessionToken,
            'client_id',
            'state'
          ),
          RequestMocks.createOAuthCode
        );
      })
      .then(function(resp) {
        assert.ok(resp);
      }, assert.notOk);
  });

  it('#createOAuthToken - missing sessionToken', function() {
    return accountHelper
      .newVerifiedAccount()
      .then(function(account) {
        return respond(
          client.createOAuthToken(null, 'client_id'),
          RequestMocks.createOAuthToken
        );
      })
      .then(assert.notOk, function(error) {
        assert.include(error.message, 'Missing sessionToken');
      });
  });

  it('#createOAuthToken - missing clientId', function() {
    return accountHelper
      .newVerifiedAccount()
      .then(function(account) {
        return respond(
          client.createOAuthToken(account.signIn.sessionToken, null),
          RequestMocks.createOAuthToken
        );
      })
      .then(assert.notOk, function(error) {
        assert.include(error.message, 'Missing clientId');
      });
  });

  it('#createOAuthToken', function() {
    return accountHelper
      .newVerifiedAccount()
      .then(function(account) {
        return respond(
          client.createOAuthToken(account.signIn.sessionToken, 'client_id'),
          RequestMocks.createOAuthToken
        );
      })
      .then(function(resp) {
        assert.ok(resp);
      }, assert.notOk);
  });

  it('#getOAuthScopedKeyData - missing sessionToken', function() {
    return accountHelper
      .newVerifiedAccount()
      .then(function(account) {
        return respond(
          client.getOAuthScopedKeyData(null, 'client_id', 'profile'),
          RequestMocks.getOAuthScopedKeyData
        );
      })
      .then(assert.notOk, function(error) {
        assert.include(error.message, 'Missing sessionToken');
      });
  });

  it('#getOAuthScopedKeyData - missing clientId', function() {
    return accountHelper
      .newVerifiedAccount()
      .then(function(account) {
        return respond(
          client.getOAuthScopedKeyData(
            account.signIn.sessionToken,
            null,
            'profile'
          ),
          RequestMocks.getOAuthScopedKeyData
        );
      })
      .then(assert.notOk, function(error) {
        assert.include(error.message, 'Missing clientId');
      });
  });

  it('#getOAuthScopedKeyData - missing scope', function() {
    return accountHelper
      .newVerifiedAccount()
      .then(function(account) {
        return respond(
          client.getOAuthScopedKeyData(
            account.signIn.sessionToken,
            'client_id',
            null
          ),
          RequestMocks.getOAuthScopedKeyData
        );
      })
      .then(assert.notOk, function(error) {
        assert.include(error.message, 'Missing scope');
      });
  });

  it('#getOAuthScopedKeyData', function() {
    return accountHelper
      .newVerifiedAccount()
      .then(function(account) {
        return respond(
          client.getOAuthScopedKeyData(
            account.signIn.sessionToken,
            'client_id',
            'profile'
          ),
          RequestMocks.getOAuthScopedKeyData
        );
      })
      .then(function(resp) {
        assert.ok(resp);
      }, assert.notOk);
  });
});
