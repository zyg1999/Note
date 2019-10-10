### bind 改变this指向后，函数用作构造函数，导致bind失效
```js
function original() {
  this.maxN = 18
  return this.maxN
}
var obj = {
  minN: 10,
  maxN: 20
}
var newFunc = original.bind(obj)
console.log(newFunc) //这个时候original内部this确实指向obj
var instance = new newFunc() //将实例的__proto__指向构造函数prototype 构造函数this指向实例
console.log(instance) //original {maxN: 18}
console.log(instance.maxN) //18
```
> 在使用bind后，this指向确实改变为obj，但是new操作，使得构造函数的this指向了实例 也就是重写了this，将this指向实例
### 为什么会有变量提升
- 解析和预编译过程中的声明提升可以提高性能，让函数可以在执行时预先为变量分配栈空间
- 声明提升还可以提高JS代码的容错性，使一些不规范的代码也可以正常执行
