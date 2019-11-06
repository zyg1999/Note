### new 做了什么？
当一个函数使用new创造一个实例时，内部做了如下事情
- 创建一个对象obj
- `obj.__proto__ = fn.prototype`
- 构造函数的this指向创建的对象
- 当构造函数返回对象，就返回执行后对象，否则，返回创建的对象
### 模拟
```js
Function.prototype.myNew = function() {
  let obj = {}
  let fn = [].shift.call(arguments)
  obj.__proto__ = fn.prototype
  let res = fn.apply(obj, arguments)
  return typeof res === 'object' ? res : obj
}
```
