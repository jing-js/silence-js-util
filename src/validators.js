'use strict';

module.exports = {
  isArray(val) {
    return Array.isArray(val);
  },
  minLength(length, val) {
    return val.length >= length;
  },
  maxLength(length, val) {
    return val.length <= length;
  },
  rangeLength(minLength, maxLength, val) {
    return val.length >= minLength && val.length <= maxLength;
  },
  max(bound, val) {
    return val <= bound;
  },
  min(bound, val) {
    return val >= bound;
  },
  equal(expect, val) {
    return val === expect;
  },
  inArray(array, val) {
    return array.indexOf(val) >= 0;
  },
  length(length, val) {
    return val.length === length;
  }
};