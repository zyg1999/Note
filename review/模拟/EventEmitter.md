### 观察者模式
类似微信平台订阅公众号 , 当它有新的文章发表后，就会推送给我们所有订阅的人。
### 观察者模式优点
- 可以广泛应用于异步编程，它可以代替我们传统的回调函数
- 我们不需要关注对象在异步执行阶段的内部状态，我们只关心事件完成的时间点
- 取代对象之间硬编码通知机制，一个对象不必显式调用另一个对象的接口，而是松耦合的联系在一起 。

虽然不知道彼此的细节，但不影响相互通信。更重要的是，其中一个对象改变不会影响另一个对象。
```js
function myEventEmitter() {
      //加上下划线，表示私有，约定
      this._maxListeners = 10
      this._events = Object.create(null)
    }
    // 向事件队列添加事件
    // prepend为true表示向事件队列头部添加事件
    myEventEmitter.prototype.addListener = function(type, listener, perpend) {
      if (!this._events) {
        this._events = Object.create(null)
      }
      if (this._events[type]) {
        if (perpend) {
          this._events[type].unshift(listener)
        } else {
          this._events[type].push(listener)
        }
      } else {
        this._events[type] = [listener]
      }
    }
    //移除某个事件
    myEventEmitter.prototype.removeListener = function(type, listener) {
      if (Array.isArray(this._events[type])) {
        if (!listener) {
          delete this._events[listener]
        } else {
          this._events[type] = this._events[type].filter(
            e => e != listener && e.origin !== origin
          )
        }
      }
    }
    //向事件队列添加事件，只执行一次
    myEventEmitter.prototype.once = function(type, listener) {
      const only = (...args) => {
        listener.apply(this, args) 
        this.removeListener(type, listener)
      }
      only.origin = listener
      this.addListener(type, only)
    }
    //执行某类事件
    myEventEmitter.prototype.emit = function(type, ...args) {
      if (Array.isArray(this._events[type])) {
        this._events[type].forEach(fn => {
          fn.apply(this, args)
        })
      }
    }
    myEventEmitter.prototype.setMaxListeners = function(count) {
      this._maxListeners = count
    }
```