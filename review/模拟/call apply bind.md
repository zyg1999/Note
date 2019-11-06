### call
- 检测是否是`Function.prototype.myCall()`直接调用
- 使用Symbol创建唯一值，避免属性重复
- 执行函数并接收返回结果
- 删除`Symbol`属性
- 返回结果
```js
Function.prototype.myCall=function(context=window,...args){
    if(this === Function.prototype){
        return undefined
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
    if(this === Function.prototype){
        return undefined
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
- 处理参数，返回一个闭包
- 判断是否为构造函数调用，如果是则使用new调用
- 若不是，使用apply，将context和处理好的参数传入
```js
Function.prototype.myBind=function(context=window,...args1){
    if(this === Function.prototype){
        return undefined
    }
    const _this=this
    return function F(...args2){
        if(this instanceof F){
            return new _this(...args1,...args2)
        }
        return _this.apply(context,args1.concat(args2))
    }
}
```
