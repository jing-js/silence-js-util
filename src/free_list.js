
const BUF_SIZE = 1000;

class FreeList {
  constructor(constructor, max = 50) {
    this.constructor = constructor;
    this.max = max * BUF_SIZE;
    this.len = BUF_SIZE;
    this.list = new Array(this.len);
  }
  alloc(...args) {
    let i = 0;
    for(; i < this.len; i++) { // 这里使用的是线性遍历的方法, 使用时间换空间效率
      let obj = this.list[i];
      if (!obj) {
        obj = new this.constructor(...args);
        this.list[i] = obj;
        return obj;
      } else if (!obj.$$freeListIsUsed) {
        obj.$$freeListInit(...args);
        return obj;
      }
    }

    if (this.len < this.max) {
      this.len += BUF_SIZE;
      this.list.length = this.len; // 扩容
      let obj = new this.constructor(...args);
      this.list[i] = obj;
      return obj;
    }
    // 如果 this.max (默认为 50 * 1000) 个空间都被用完了, 直接返回新实例。
    // 同时发起请求用户达到 50000 我擦!
    console.log('MAX_FREE_LIST');
    return new this.constructor(...args);
  }
  free(obj) {
    obj.$$freeListFree();
  }
}

module.exports = FreeList;
