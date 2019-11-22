 ### 发布订阅设计模式 

主要方法

- on
- emit
- off
- once

```js
class EventEmitter {
  constructor() {
    this._eventpool = {}
  }
  on(event, callback) {
    this._eventpool[event]
      ? this._eventpool[event].push(callback)
      : (this._eventpool[event] = [callback])
  }
  emit(event, ...args) {
    this._eventpool[event] &&
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