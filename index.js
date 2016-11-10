'use strict';

const crypto = require('crypto');
const validators = require('./src/validators');
const fs = require('fs');
const path = require('path');
const formatDate = require('./src/format_date');
const { getClientIp, getRemoteIp } = require('./src/getip');
const FreeList = require('./src/free_list');

const converters = {
  'string'(val) {
    return val.toString();
  },
  'number'(val) {
    return Number(val);
  },
  'boolean'(val) {
    return !!val && val !== 'false';
  }
};


function genRandomBytes(size) {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(size, (err, buf) => {
      if (!err) {
        resolve(buf);
      } else {
        reject(err);
      }
    });
  });
}

function genSessionKey() {
  return genRandomBytes(24).then(buf => {
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

function mkdir(dir) {
  return new Promise((resolve, reject) => {
    fs.access(dir, err => { // 首先检测是否已经存在
      if (err) {
        // 如果不存在，先创建其父亲文件夹。这是一个递归的过程
        let parentDir = path.dirname(dir);
        mkdir(parentDir).then(() => {
          fs.mkdir(dir, err => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        }, reject);
      } else { // 如果已经存在则直接返回
        resolve();
      }
    });
  });
}

function logStatus(status = {}) {
  const cu = process.cpuUsage();
  const mu = process.memoryUsage();
  let sysSatus = {
    cpuUsage: cu,
    memoryUsage: mu
  }
  Object.assign(sysSatus, status);
  let stream = fs.createWriteStream(path.join(process.cwd(), 'status.log'), {
    flags: 'a'
  });
  let info = `====== ${process.title} [${formatDate()}] ======\n`;
  info += JSON.stringify(sysSatus, null, '  ') + '\n';
  stream.write(info);
  stream.end();
}

function formatArray(args) {
  if (args.length === 1) {
    return formatValue(args[0]);
  } else {
    let out = '';
    let e = args.length - 1;
    for(let i = 0; i <= e; i++) {
      out += formatValue(args[i]) + (i === e ? '' : ' ');
    }
    return out;
  }
}

function formatValue(v) {
  if (v === null || v === undefined) {
    return ''
  } else {
    return v.toString();
  }
}
function formatError(err) {
  if (err instanceof Error) {
    return err.stack || err.message || err.toString();
  } else {
    return formatValue(err);
  }
}

module.exports = {
  registerValidators(newValidators) {
    Object.assign(validators, newValidators);
  },
  validators,
  registerConverters(newConverters) {
    Object.assign(converters, newConverters);
  },
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
  formatArray,
  formatValue,
  formatError,
  merge,
  FreeList,
  getClientIp,
  getRemoteIp,
  genSessionKey,
  genRandomBytes,
  formatDate,
  logStatus,
  mkdirP: mkdir
};
