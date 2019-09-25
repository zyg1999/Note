`function.bind(thisArg [，arg1 [，arg2 [，...]]])`
### bind参数
- thisObj

`this`调用绑定函数时作为参数传递给目标函数的值。如果使用`new`运算符构造绑定函数，则忽略该值。
- arg1,arg2

参数列表
### 返回值
返回具有指定this值和初始参数的给定函数的副本。

### 模拟实现
```js
Function.prototype.myBind = function(context) {
  if (typeof this !== 'function') {
    throw new Error('调用bind的不是函数')
  }
  let self = this
  let arr = Array.prototype.slice.call(arguments, 1) //让arguments转换成一个数组对象,把调用方法的参数截取出来
  let fTem = function() {} //中转函数
  let fBound = function() {
    let restArr = Array.prototype.slice.call(arguments) //执行时新的传参
    //当返回函数作为构造函数时，this 指向实例，此时结果为 true，将绑定函数的 this 指向该实例
    //当返回函数作为普通函数时，this 指向 window，此时结果为 false，将绑定函数的 this 指向 context
    return self.apply(
      this instanceof fTem ? this : context,
      args.concat(restArr)
    )
  }
  fTem.prototype = this.prototype
  fBound.prototype = new fTem()
  return fBound
}
```
**线上使用要兼容**
```js
Function.prototype.bind = Function.prototype.bind || function () {
    ……
};
```
bind举例
```js
var value = 2
var foo = {
  value: 1,
  bar: bar.bind(foo)
}

function bar() {
  console.log(this.value)
}

foo.bar() //2
```
在变量提升时 value,foo都为undefined，对变量进行初始化时value正常初始化，而在对foo进行初始化时，`bar.bind(foo)`时，foo还是undefined。所以打印2