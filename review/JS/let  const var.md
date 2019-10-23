### let const var声明次数区别
- 同一块级作用域中，`let、const`只能声明一次，`var`可多次声明
```js
var a
var a

let b
let b //Uncaught SyntaxError: Identifier 'b' has already been declared

const c = 1
const c = 2 //Uncaught SyntaxError: Identifier 'c' has already been declared
```
**const声明的常量必须要进行初始化**
### 作用域区别
- var 在声明之前可以被访问，值为`undefined`。var没有块级作用域
- let、const在声明之前访问会报错（包括typeof），这就是所谓的临时死区TDZ，并且他们都有块级作用域。let、const的TDZ只在其所在的块级作用域内才会生效。
```js
console.log(a) //undefined
{
  console.log(a) //undefined
  var a = 2
}
console.log(a) //2

console.log(b) //Uncaught ReferenceError: Cannot access 'b' before initialization
{
  console.log(b) //Uncaught ReferenceError: Cannot access 'b' before initialization
  let b = 3
}
console.log(b) //Uncaught ReferenceError: Cannot access 'b' before initialization

console.log(c) // Uncaught ReferenceError: c is not defined
if (true) {
  console.log(c) // Uncaught ReferenceError: i is not defined
  const c = 0
}
console.log(c) // Uncaught ReferenceError: c is not defined
```
### 全局声明区别
- 全局`var`声明，成为`Global(window)`属性。具有覆盖性
- `let const`声明的变量保存在名为Script的作用域中

![image](https://github.com/zyg1999/Note/blob/master/review/JS/pic/TIM%E5%9B%BE%E7%89%8720191020195815.png)
### for循环中的区别
- `let const`声明i不受闭包影响
- 用`let const`声明的变量在每次循环都会重新声明一个新的变量，并用之前的值去初始化。
- for的每次循环都是一个新的作用域，只不过初始化用的是之前的值
```js
var fn = []
for (var i = 0; i < 10; i++) {
  fn[i] = function() {
    console.log(i)
  }
} //去执行每个函数时都打印10

var fn = []
for (let i = 0; i < 10; i++) {
  fn[i] = function() {
    console.log(i)
  }
} // 去执行每个函数会打印1~10
```
### const的注意点
当使用const声明对象时，绑定不允许修改，但可修改值。
