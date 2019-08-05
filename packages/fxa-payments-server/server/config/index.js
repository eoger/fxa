/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

const fs = require('fs');
const path = require('path');
const convict = require('convict');

const conf = convict({
  clientAddressDepth: {
    default: 3,
    doc: 'location of the client ip address in the remote address chain',
    env: 'CLIENT_ADDRESS_DEPTH',
    format: Number,
  },
  csp: {
    enabled: {
      default: false,
      doc: 'Send "Content-Security-Policy" header',
      env: 'CSP_ENABLED',
    },
    /*eslint-disable sorting/sort-object-props*/
    reportUri: {
      default: '/_/csp-violation',
      doc: 'Location of "report-uri" for full, blocking CSP rules',
      env: 'CSP_REPORT_URI',
    },
    reportOnly: {
      default: false,
      doc:
        'DEPRECATED - Only send the "Content-Security-Policy-Report-Only" header',
      env: 'CSP_REPORT_ONLY',
    },
    reportOnlyEnabled: {
      default: false,
      doc: 'Send "Content-Security-Policy-Report-Only" header',
      env: 'CSP_REPORT_ONLY_ENABLED',
    },
    reportOnlyUri: {
      default: '/_/csp-violation-report-only',
      doc: 'Location of "report-uri" for report-only CSP rules',
      env: 'CSP_REPORT_ONLY_URI',
    },
    /*eslint-enable sorting/sort-object-props*/
  },
  env: {
    default: 'production',
    doc: 'The current node.js environment',
    env: 'NODE_ENV',
    format: ['development', 'production'],
  },
  hstsMaxAge: {
    default: 31536000, // a year
    doc: 'Max age of the STS directive in seconds',
    // Note: This format is a number because the value needs to be in seconds
    format: Number,
  },
  listen: {
    host: {
      default: '127.0.0.1',
      doc: 'The ip address the server should bind',
      env: 'IP_ADDRESS',
      format: 'ipaddress',
    },
    port: {
      default: 3031,
      doc: 'The port the server should bind',
      env: 'PORT',
      format: 'port',
    },
    publicUrl: {
      default: 'http://127.0.0.1:3031',
      env: 'PUBLIC_URL',
      format: 'url',
    },
    useHttps: {
      default: false,
      doc: 'set to true to serve directly over https',
      env: 'USE_TLS',
    },
  },
  logging: {
    app: { default: 'fxa-payments-server' },
    fmt: {
      default: 'heka',
      env: 'LOGGING_FORMAT',
      format: ['heka', 'pretty'],
    },
    level: {
      default: 'info',
      env: 'LOG_LEVEL',
    },
    routes: {
      enabled: {
        default: true,
        doc: 'Enable route logging. Set to false to trimming CI logs.',
        env: 'ENABLE_ROUTE_LOGGING',
      },
      format: {
        default: 'default_fxa',
        format: ['default_fxa', 'dev_fxa', 'default', 'dev', 'short', 'tiny'],
      },
    },
  },
  productRedirectURLs: {
    default: {
      '123doneProProduct': 'http://127.0.0.1:8080/',
      'prod_Ex9Z1q5yVydhyk': 'https://123done-latest.dev.lcip.org/',
      'prod_FUUNYnlDso7FeB': 'https://123done-stage.dev.lcip.org',
    },
    doc: 'Mapping between product IDs and post-subscription redirect URLs',
    env: 'PRODUCT_REDIRECT_URLS',
    format: Object,
  },
  proxyStaticResourcesFrom: {
    default: '',
    doc:
      'Instead of loading static resources from disk, get them by proxy from this URL (typically a special reloading dev server)',
    env: 'PROXY_STATIC_RESOURCES_FROM',
    format: String,
  },
  sentryDsn: {
    default: '',
    doc: 'Sentry DSN',
    env: 'SENTRY_DSN',
    format: 'String',
  },
  servers: {
    auth: {
      url: {
        default: 'http://127.0.0.1:9000',
        doc: 'The url of the fxa-auth-server instance',
        env: 'AUTH_SERVER_URL',
        format: 'url',
      },
    },
    content: {
      url: {
        default: 'http://127.0.0.1:3030',
        doc: 'The url of the corresponding fxa-content-server instance',
        env: 'CONTENT_SERVER_URL',
        format: 'url',
      },
    },
    oauth: {
      url: {
        default: 'http://127.0.0.1:9010',
        doc: 'The url of the corresponding fxa-oauth-server instance',
        env: 'OAUTH_SERVER_URL',
        format: 'url',
      },
    },
    profile: {
      url: {
        default: 'http://127.0.0.1:1111',
        doc: 'The url of the corresponding fxa-profile-server instance',
        env: 'PROFILE_SERVER_URL',
        format: 'url',
      },
    },
    profileImages: {
      url: {
        default: 'http://127.0.0.1:1112',
        doc: 'The url of the Firefox Account Profile Image Server',
        env: 'FXA_PROFILE_IMAGES_URL',
        format: 'url',
      },
    },
  },
  staticResources: {
    directory: {
      default: 'build',
      doc: 'Directory where static resources are located',
      env: 'STATIC_DIRECTORY',
      format: String,
    },
    maxAge: {
      default: '10 minutes',
      doc: 'Cache max age for static assets, in ms',
      env: 'STATIC_MAX_AGE',
      format: 'duration',
    },
    url: {
      default: 'http://127.0.0.1:3031',
      doc: 'The origin of the static resources',
      env: 'STATIC_RESOURCE_URL',
      format: 'url',
    },
  },
  stripe: {
    apiKey: {
      default: 'pk_test_FL2cOisOukoCQUZsrochvTlk00ff4IakfE',
      doc: 'API key for Stripe',
      env: 'STRIPE_API_KEY',
      format: String,
    },
    apiUrl: {
      default: 'https://api.stripe.com',
      doc: 'Stripe connect-src directive',
      env: 'STRIPE_API_URL',
      format: 'url',
    },
    hooksUrl: {
      default: 'https://hooks.stripe.com',
      doc: 'Stripe frame-src directives',
      env: 'STRIPE_HOOKS_URL',
      format: 'url',
    },
    scriptUrl: {
      default: 'https://js.stripe.com',
      doc: 'Stripe script-src directive',
      env: 'STRIPE_SCRIPT_URL',
      format: 'url',
    }
  },
});

// Always send CSP headers in development mode
if (conf.get('env') === 'development') {
  conf.set('csp.enabled', true);
}

// handle configuration files.  you can specify a CSV list of configuration
// files to process, which will be overlayed in order, in the CONFIG_FILES
// environment variable.

let envConfig = path.join(__dirname, `${conf.get('env')}.json`);
envConfig = `${envConfig},${process.env.CONFIG_FILES || ''}`;
const files = envConfig.split(',').filter(fs.existsSync);
conf.loadFile(files);
conf.validate({ allowed: 'strict' });

module.exports = conf;
