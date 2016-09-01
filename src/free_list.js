class FreeList {
  constructor(constructor, size = 10000) {
    this._constructor = constructor;
    this._buffer = new Array(size);
    this._avaliable = -1;
    this._init();
  }
  _init() {
    for(let i = 0; i < this._buffer.length; i++) {
      let obj = new this._constructor();
      obj.$$freeListPosition = i;
      obj.$$freeListNext = i - 1;
      this._buffer[i] = obj;
    }
    this._avaliable = this._buffer.length - 1;
  }
  alloc(...args) {
    if (this._avaliable < 0) {
      console.log('MAX_FREE_LIST');
      let obj = new this._constructor();
      obj.$$freeListInit(...args);
      obj.$$freeListPosition = -1;
      return obj;
    }
    let obj = this._buffer[this._avaliable];
    this._avaliable = obj.$$freeListNext;
    obj.$$freeListInit(...args);
    return obj;
  }
  free(obj) {
    obj.$$freeListFree();
    if (obj.$$freeListPosition < 0) {
      return;
    }
    obj.$$freeListNext = this._avaliable;
    this._avaliable = obj.$$freeListPosition;
  }
}

module.exports = FreeList;
