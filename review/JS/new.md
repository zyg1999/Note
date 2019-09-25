### new是什么
new 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象类型之一
### 举例
```js
function Person(name, age) {
  this.strength = 60
  this.age = age

  return {
    name: name,
    habit: 'sport'
  }
}

let person = new Person('Mike', 18)
console.log(person)//{habit: "sport",name: "Mike"}
```
```js
function Person(age) {
  this.strength = 60
  this.age = age

  return 'habit is sport'
}

let person = new Person('Mike', 18)
console.log(person)//Person {strength: 60, age: 18}
```
这启发我们，模拟`new`时判断返回的值是不是一个对象，如果是一个对象，我们就返回这个对象，如果没有，我们该返回什么就返回什么。
### 模拟
```js
function myNew() {
  let obj = new Object()
  let Constructor = [].shift.call(arguments) //取出构造函数
  obj.__proto__ = Constructor.prototype
  let ret = Constructor.apply(obj, arguments)
  return typeof ret === 'object' ? ret : obj
}
```