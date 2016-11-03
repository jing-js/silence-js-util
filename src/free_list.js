var Logger = {
  serror(section, ...args) {
    console.log(...args);
  },
  sinfo(section, ...args) {
    console.log(...args);
  }
};

const MAX_ERROR_COUNT = 3000;

class FreeList {
  static __init(logger) {
    Logger = logger;
  }
  constructor(constructor, size = 10000) {
    this._constructor = constructor;
    this._buffer = new Array(size);
    this._avaliable = -1;
    // we use __errorCount to avoid dead lock
    this.__errorCount = 0;
    this._init();
  }
  _init() {
    for(let i = 0; i < this._buffer.length; i++) {
      // we do not handle potential errors in constructor function
      // as if error occurs, the whole application will terminate.
      let obj = new this._constructor();
      obj.$$freeListPosition = i;
      obj.$$freeListNext = i - 1;
      this._buffer[i] = obj;
    }
    this._avaliable = this._buffer.length - 1;
  }
  __incErrorCount() {
    this.__errorCount++;
    if (this.__errorCount === MAX_ERROR_COUNT) {
      Logger.serror('freelist', 'error occurs too many times');
    }
  }
  alloc(...args) {
    if (this._avaliable < 0 || this.__errorCount >= MAX_ERROR_COUNT) {
      let obj = new this._constructor();
      obj.$$freeListInit(...args);
      obj.$$freeListPosition = -1;
      return obj;
    }
    let obj = this._buffer[this._avaliable];
    try {
      obj.$$freeListInit(...args);
    } catch(ex) {
      // error here is almost impossible
      // but we still handle it
      // we create a new item to replace error one
      this.__incErrorCount();
      let new_obj = new this._constructor();
      new_obj.$$freeListPosition = obj.$$freeListPosition;
      new_obj.$$freeListNext = obj.$$freeListNext;
      this._buffer[this._avaliable] = new_obj;
      Logger.serror('freelist', ex);
      throw ex;
    }
    this._avaliable = obj.$$freeListNext;
    return obj;
  }
  free(obj) {
    try {
      obj.$$freeListFree();
      if (obj.$$freeListPosition < 0) {
        return;
      }
      obj.$$freeListNext = this._avaliable;
      this._avaliable = obj.$$freeListPosition;
    } catch(ex) {
      // error here is almost impossible
      // but we still handle it
      // we create a new item to replace error one
      this.__incErrorCount();
      let new_obj = new this._constructor();
      new_obj.$$freeListPosition = obj.$$freeListPosition;
      new_obj.$$freeListNext = this._avaliable;
      this._avaliable = new_obj.$$freeListPosition;
      this._buffer[obj.$$freeListPosition] = new_obj;
      Logger.serror('freelist', ex);
    }
  }
}

module.exports = FreeList;
