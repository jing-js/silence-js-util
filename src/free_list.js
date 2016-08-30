
const BUF_SIZE = 1000;

class FreeList {
  constructor(constructor, max = 10) {
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
        // console.log(`new ${this.constructor.name}`);
        obj = new this.constructor(...args);
        this.list[i] = obj;
        return obj;
      } else if (!obj.$$freeListIsUsed) {
        // console.log(`resuse ${this.constructor.name}`);
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
    // 如果 this.max (默认为 10000) 个空间都被用完了, 直接返回新实例。
    // 同时发起请求用户达到 10000 我擦! 同时在线用户岂不是上千万。。。
    return new this.constructor(...args);
  }
  free(obj) {
    obj.$$freeListFree();
    if (this.list.length < this.max) {
      this.list.push(obj);
      return true;
    }
    return false;
  }
}

module.exports = FreeList;
