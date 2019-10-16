### instanceof
```js
a instanceof Object
```
判断Object的prototype是否在a的原型链上。
### 实现
```js
function myInstanceOf(target, origin) {
  const proto = target.__proto__
  if (proto) {
    if (proto === origin.prototype) {
      return true
    } else {
      return myInstanceOf(proto, origin)//如果没找到，沿着原型链往上找
    }
  } else {
    return false
  }
}
```