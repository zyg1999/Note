 ### 发布订阅设计模式 

主要方法

- on  订阅事件 
- emit  将所有订阅方法取出执行 
- off  退订 
- once  将事件订阅“一次”，当这个事件触发过就不会再次触发了。其原理是将订阅的方法再包裹一层函数，在执行后将此函数移除即可 

```js
class EventEmitter {
  constructor() {
    this._eventpool = {}
  }
  on(event, callback) {
    this._eventpool[event]
      ? this._eventpool[event].push(callback)
      : this._eventpool[event] = [callback]
  }
  emit(event, ...args) {
      if(this._eventpool[event])
        this._eventpool[event].forEach(cb => cb(...args))
  }
  off(event) {
    if (this._eventpool[event]) {
      delete this._eventpool[event]
    }
  }
  once(event, callback) {
    this.on(event, (...args) => {
      callback(...args)
      this.off(event)
    })
  }
}
```