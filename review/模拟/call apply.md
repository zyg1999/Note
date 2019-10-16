### call
该方法调用具有给定this值的函数和单独提供的参数列表。

`function.call(thisArg, arg1, arg2, ...)`
### 参数
`thisArg`
可选。

注意，(this可能不是方法看到的实际值：如果方法是非严格模式下的函数，null并且undefined将被全局对象替换，则原始值将被转换为对象。????)
### arg1, arg2, ...
可选。函数的参数。
### 举例
```js
let obj = {
  name: 'Mike'
}
function sayName() {
  console.log(this.name)
}
sayName.call(obj) //Mike
```

```js
function Foo(a, b) {
  this.a = a
  this.b = b
}
function Bar(a, b) {
  Foo.call(this, a, b)
  this.c = 3
}
let obj = new Bar(1, 2)
console.log(obj)//Bar {a: 1, b: 2, c: 3}
```
### 写一个自己的call
如第一段代码所示，若我们把`obj`修改为下面这个样子，就实现了
```js
obj={
    name:'Mike',
    sayNmae:function (){
        console.log(this.name)
    }
}
```
所以可得步骤：
- 将函数设为对象的属性
- 执行该函数
- 删除该函数
```js
Function.prototype.myCall = function(context) {
  context.fn = this
  context.fn()
  delete context.fn
}
```
这样this绑定了，但是参数还没有传递
```js
Function.prototype.myCall = function(context) {
  let arr = []
  for (let i = 1; i < arguments.length; i++) {
    arr.push(arguments[i])
  }
  console.log(this)//ƒ sayName() {console.log(this.name)}指向调用该函数的函数
  context.fn = this
  context.fn(...arr)
  delete context.fn
}
```
### 传入null或undefined
```js
Function.prototype.myCall = function(context) {
  context = context || window //传入null或undefined时指向window
  context.fn = this //this指向调用它的函数
  let arr = []
  arr = Array.from(arguments).slice(1) //获取从第二个起的参数
  let res = context.fn(...arr)
  delete context.fn
  return res
}

var name = 'Mike'
let obj = {
  name: 'Ann'
}

function sayName(age) {
  console.log(this.name)
  return age
}
console.log(sayName.myCall(null, 12)) //12 Mike
let res = sayName.myCall(obj, 11)
console.log(res) //11 Ann
```
### apply
```js
Function.prototype.myApply = function(context) {
  context = context || window
  context.fn = this
  let arr = []
  arr = Array.from(arguments).slice(1)//将类数组转为数组，并截取第二个元素后面的元素
  let res
  if (!arr) {
    res = context.fn()
  } else {
    res = context.fn(arr)
  }
  delete context.fn
  return res
}
let name = 'Mike'
let obj = {
  name: 'Ann',
  age: 12
}
function sayName(arr) {
  console.log(this.name)
  return arr
}
console.log(sayName.myApply(obj, [1, 2, 3])) //Ann [1, 2, 3]
```