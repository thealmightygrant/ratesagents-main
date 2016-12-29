"use strict";

var glob = require('glob')
var convict = require('convict')

// Define a schema
var conf = convict({
  env: {
    doc: "The applicaton environment.",
    format: ["production", "development", "test"],
    default: "development",
    env: "NODE_ENV"
  },
  ip: {
    doc: "The IP address to bind.",
    format: "ipaddress",
    default: "127.0.0.1",
    env: "IP_ADDRESS",
  },
  port: {
    doc: "The port to bind.",
    format: "port",
    default: 3000,
    env: "PORT"
  },
  domain: {
    doc: "domain for cookies",
    format: String,
    default: "ratesandagents.com",
    env: "SITE_DOMAIN"
  },
  pages: {
    //TODO: add schema for pages, redo pages structure
    doc: "data used for pages",
    format: Object,
    default: {}
  },
  session: {
    keys: {
      doc: "keys for session security",
      format: Array,
      default: null
    }
  },
  sequelize: {
    username: {
      format: String,
      default: "george"
    },
    password: {
      format: String,
      default: "sherrick"
    },
    database: {
      format: String,
      default: "one badass db"
    },
    host: {
      format: 'ipaddress',
      default: '0.0.0.0'
    },
    dialect: {
      format: ["postgres"],
      default: "postgres"
    },
    logging: {
      format: Boolean,
      default: true
    }
  },
  auth: {
    //TODO: add custom format for auth
    facebookAuth: {
      clientID: {
        format: String,
        default: "trex-mannnnnnn"
      },
      clientSecret: {
        format: String,
        default: "raaaarrrrrrr"
      },
      realtorCallbackURL: {
        format: 'url',
        default: "https://somebacllback.com/callback"
      },
      homeownerCallbackURL: {
        format: 'url',
        default: "https://someothercallback.com/callback"
      }
    }
  },
  apis: {
    format: Object,
    default: {}
  }
});

const pageFiles = glob.sync("./config/pages/*.json") || []
const env = conf.get('env');
conf.loadFile(pageFiles.concat('./config/' + env + '.json'))

const validateOpts = env !== 'production' ? {strict: true} : {}
conf.validate(validateOpts)

module.exports = conf;
