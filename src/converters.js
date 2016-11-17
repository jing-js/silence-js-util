module.exports = {
  'string'(val) {
    return val === undefined || val === null ? undefined : val.toString();
  },
  'number'(val) {
    val = Number(val);
    if (!Number.isFinite(val) || Number.isNaN(val)) {
      return undefined;
    } else {
      return val;
    }
  },
  'boolean'(val) {
    return !!val && val !== 'false';
  }
};