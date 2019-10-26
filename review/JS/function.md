### 函数参数
#### arguments
- 非严格模式下，arguments与**实参**保持同步
```js
 function fn(a, b) {
  console.log(a === arguments[0]) //true
  a = 'hehe'
  console.log(a === arguments[0]) //true
  b = 2
  console.log(b === arguments[1], arguments[1]) //false undefined
}
fn(1)
```
> 诶？这里b怎么不同步？

> 这里说的是与实参保持同步，而实参并没有传入b，因此修改b也不会一致
- 严格模式下，arguemnts 与实参不同步
#### 默认参数
**不传或者手动传递undefined**都会使用默认的参数。
```js
function foo(a,b=2){
	console.log(a,b)//1 2
	let a;//Uncaught SyntaxError: Identifier 'a' has already been declared
}
foo(1)
```
**与ES5区别**
- 形参列表里的参数，相当于使用let声明（存在TDZ）
- 默认参数可以是形参列表里的变量，不可以是函数体内的变量
- 使用了默认参数，说明当前使用的ES6，所以当前scope都是处于strict模式下的
> 在函数体内声明函数形参，会报错
#### 默认参数对arguments影响
严格模式下，**arguments和传入的实参一样且不同步**
```js
function fn(a, b = 1) {
  console.log(arguments[0] === a) // true
  console.log(arguments[1] === b) // false
}
fn(1)
```
#### 无名参数
```js
function fn(a,...args){}
```
限制
- 不定参数只能在列表最后
- 不定参数不能用在setter中，因为setter的参数只能有一个value，在不定参数的定义中是可以有无限多。这两者在当前上下文中不允许

tips:
- arguments中只存储传入的参数
- fn.length则是命名参数的个数，也就是说fn的length属性是不包括args中的东西
```js
function fn(a, ...args) {}
fn.length // 1
```
### 箭头函数
与普通函数的区别
- 没有`this、super、arguments和new target`绑定。这些东西在外围最近一层非箭头函数决定。
- 不能被`new`调用。没有[[construct]]
- 没有prototype属性
- 不可以改变this绑定。在定义时决定
- 不支持arguments,所以必须通过参数和不定参数访问函数参数
- 不能有同名参数
- 不能使用yield关键字，所以也就不能当做generator函数
### 函数的name属性
name属性为了辨别函数
```js
const a = function() {}
const b = a
a.name //"a"
b.name //"a"
const d = function fn() {}
d.name //"fn"
```
- 赋值语句创建，则name为对应变量名
- 函数声明创建，name为function关键字后面的string.
- function.name一旦确定，赋给其他变量也不会改

特殊
```js
var person = {
  get firstName() {
    return 1
  },
  syaName() {}
}
person.firstName.name //undefined(书上说为get firstName)
```
> bind出来的函数,name前带有"bound"前缀；Function创建的函数带有`anonymous`
>
函数的name属性不一定同步于引用变量，只是一个协助调试用的额外信息而已，所以不要使用name属性来获取函数的引用
### 尾递归
函数被作为另一个函数的最后一条语句被调用

es5中，尾调用的实现和普通的函数调用一样，都是创建一个新的stack frame，将其push到调用栈，来表示函数调用，如果在循环调用中，每一个未用完的stack frame都会保存在内存中，调用栈的大小过大就会爆栈。

尾递归优化：不在创建新的stack frame，而是清除掉当前的stack frame，然后重用即可

以下情况发生优化
- 尾调用不访问当前stack frame的变量。也就是说函数不能是一个闭包
- 在函数内部，必须是最后一条语句
- 尾调用的结果作为返回值返回