/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

// Middleware to take care of CSP. CSP headers are not sent unless config
// option 'csp.enabled' is set (default true in development), with a special
// exception for the /tests/index.html path, which are the frontend unit
// tests.

const url = require('url');

function getOrigin(link) {
  const parsed = url.parse(link);
  return parsed.protocol + '//' + parsed.host;
}

/**
 * blockingCspMiddleware is where to declare rules that will cause a resource
 * to be blocked if it runs afowl of a rule.
 */
module.exports = function(config) {
  const AUTH_SERVER = getOrigin(config.get('servers.auth.url'));
  const BLOB = 'blob:';
  const CDN_URL = config.get('staticResources.url');
  const DATA = 'data:';
  const GRAVATAR = 'https://secure.gravatar.com';
  const OAUTH_SERVER = getOrigin(config.get('servers.oauth.url'));
  const PROFILE_SERVER = getOrigin(config.get('servers.profile.url'));
  const PROFILE_IMAGES_SERVER = getOrigin(
    config.get('servers.profileImages.url')
  );
  const PUBLIC_URL = config.get('listen.publicUrl');
  const PAIRING_SERVER_WEBSOCKET = PUBLIC_URL.replace(/^http/, 'ws');

  const STRIPE_API_URL = getOrigin(config.get('stripe.apiUrl'));
  const STRIPE_HOOKS_URL = getOrigin(config.get('stripe.hooksUrl'));
  const STRIPE_SCRIPT_URL = getOrigin(config.get('stripe.scriptUrl'));

  //
  // Double quoted values
  //
  const NONE = "'none'";
  // keyword sources - https://www.w3.org/TR/CSP2/#keyword_source
  // Note: "'unsafe-eval'" is not used in this module, and "'unsafe-inline'" is
  // needed for React inline styles.
  const SELF = "'self'";
  const UNSAFE_INLINE = "'unsafe-inline'";

  function addCdnRuleIfRequired(target) {
    if (CDN_URL !== PUBLIC_URL) {
      target.push(CDN_URL);
    }
    return target;
  }

  const rules = {
    directives: {
      connectSrc: [
        SELF,
        AUTH_SERVER,
        OAUTH_SERVER,
        PROFILE_SERVER,
        PAIRING_SERVER_WEBSOCKET,
        STRIPE_API_URL,
      ],
      defaultSrc: [SELF],
      fontSrc: addCdnRuleIfRequired([SELF]),
      frameSrc: [STRIPE_SCRIPT_URL, STRIPE_HOOKS_URL],
      imgSrc: addCdnRuleIfRequired([
        SELF,
        DATA,
        // Gravatar support was removed in #4927, but we don't want
        // to break the site for users who already use a Gravatar as
        // their profile image.
        GRAVATAR,
        PROFILE_IMAGES_SERVER,
      ]),
      mediaSrc: [BLOB],
      objectSrc: [NONE],
      reportUri: config.get('csp.reportUri'),
      scriptSrc: addCdnRuleIfRequired([SELF, STRIPE_SCRIPT_URL]),
      styleSrc: addCdnRuleIfRequired([SELF, UNSAFE_INLINE]),
    },
    reportOnly: false,
    // Sources are exported for unit tests
    Sources: {
      //eslint-disable-line sorting/sort-object-props
      AUTH_SERVER,
      BLOB,
      CDN_URL,
      DATA,
      GRAVATAR,
      NONE,
      OAUTH_SERVER,
      PAIRING_SERVER_WEBSOCKET,
      PROFILE_IMAGES_SERVER,
      PROFILE_SERVER,
      PUBLIC_URL,
      STRIPE_API_URL,
      STRIPE_HOOKS_URL,
      STRIPE_SCRIPT_URL,
      SELF,
    },
  };

  return rules;
};
