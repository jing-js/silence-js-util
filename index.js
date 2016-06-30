'use strict';

const crypto = require('crypto');
const validators = require('./src/validators');
const getClientIp = require('./src/getip');
const converters = {
  'string'(val) {
    return val.toString();
  },
  'number'(val) {
    return Number(val);
  },
  'boolean'(val) {
    return !!val && val !== 'false'
  }
};


function getRandomBytes(size) {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(24, (err, buf) => {
      if (!err) {
        resolve(buf);
      } else {
        reject(err);
      }
    });
  });
}

function genSessionKey() {
  return getRandomBytes(24).then(buf => {
    return buf.toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
  });
}

function merge(src, dst) {
  for(let k in dst) {
    src[k] = dst[k];
  }
  return src;
}

module.exports = {
  validators,
  converters,
  isGenerateFunction(obj) {
    return typeof obj === 'function' && obj.constructor.name === 'GeneratorFunction';
  },
  isFunction(obj) {
    return typeof obj === 'function';
  },
  isObject(obj) {
    return typeof obj === 'object';
  },
  isNumber(obj) {
    return typeof obj === 'number';
  },
  isString(obj) {
    return typeof obj === 'string';
  },
  isUndefined(obj) {
    return typeof obj === 'undefined';
  },
  isDefined(obj) {
    return typeof obj !== 'undefined'
  },
  merge,
  getClientIp,
  genSessionKey,
  getRandomBytes
};
