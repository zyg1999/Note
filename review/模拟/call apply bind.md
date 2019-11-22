### call
- 检测是否是`Function.prototype.myCall()`直接调用
- 使用Symbol创建唯一值，避免属性重复
- 执行函数并接收返回结果
- 删除`Symbol`属性
- 返回结果
```js
Function.prototype.myCall=function(context=window,...args){
    if(typeof this !== 'functiuon'){
        throw TypeError('call must be called on a function')
    }
    const fn = Symbol()
    context[fn]=this
    const result = context[fn](...args)
    delete context[fn]
    return result
}
```
### apply
与call类似，只是参数不同
```js
Function.prototype.myApply=function(context=window,args){
    if(typeof this !== 'functiuon'){
       throw TypeError('apply must be called on a function')
    }
    const fn = Symbol()
    context[fn]=this
    const result
    if(Array.isArray(args)){
        result = context[fn](...args)
    }else{
        result = context[fn]()
    }
    delete context[fn]
    return result
}
```
### bind

- 保存this
- 构建中间函数保存原函数原型
- 返回一个闭包，判断是否用于构造函数`this instanceof fn `

- 箭头函数的 `this` 永远指向它所在的作用域
```js
Function.prototype.myBind = function(context = window, ...args1) {
      if (typeof this !== 'function') {
        throw TypeError('Bind must be called on a function')
      }
      // 保存 this
      const _this = this
      // 构建一个干净的函数，用于保存原函数的原型，并且避免重复执行
      var ft = function() {}
      let fn = function(...args2) {
         // this instanceof fn, 判断是否使用 new 来调用 fn
        // 如果是 new 来调用的话，this的指向就是其实例，
        // 如果不是 new 调用的话，就改变 this 指向到指定的对象
        return _this.apply(
          this instanceof fn ? this : context, // 判断是否用于构造函数
          args1.concat(args2)
        )
      }
      // 维护原型关系
      this.prototype ? (ft.prototype = this.prototype) : null
      fn.prototype = new ft()
      return fn
    }
```
