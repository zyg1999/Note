### 扩展运算符`...`
- 作用：将数组转为用逗号分隔的参数序列。
- 主要用于函数调用
- > 扩展运算符如果放在括号中，JavaScript 引擎就会认为这是函数调用。如果这时不是函数调用，就会报错。
```js
(...[1, 2])
// Uncaught SyntaxError: Unexpected number

console.log(...[1, 2])
// 1 2
```
**替代函数apply方法**

由于扩展运算符可以展开数组，所以不需要apply方法将数组转为函数参数。举个例子
```js
//es5
Math.max.apply(null,[14,3,77]);
//es6
Math.max(...[14,3,77]);
//等同于
Math.max(14,3,77);
```
### 扩展运算符的应用
**复制数组**<br>
 
数组是复合的数据类型，直接复制的话，只是复制了指向底层数据结构的指针，而不是克隆一个全新的数组。<br>

ES5利用`concat`实现如下
```js
const a1 = [1,2];
const a2 = a1.concat();

a2[0]=2;
console.log(a1);//[1,2]
```
 ES6可用扩展运算符实现
```js
const a1 = [1,2];
const a2=[...a1];
//或者
//const [...a2]=a1;
a2[0]=2;
console.log(a1);//[1,2]
```
**合并数组**
```js
let arr1 = [1,2,3];
let arr2 = [7,8];
let arr3 = [9,{a:10}];
//ES5写法
arr1=arr1.concat(arr2,arr3);
//ES6写法
// arr1 = [...arr1,...arr2,...arr3];
arr3[0]=99;
arr3[1].a=100;
console.log(arr1);//[1, 2, 3, 7, 8, 9, {a:100}]
```
观察上述代码，可以发现两种方法都是浅拷贝。
> 浅拷贝：如果数组元素是基本类型，就会拷贝一份，互不影响，而如果是对象或者数组，就会只拷贝对象和数组的引用，这样我们无论在新旧数组进行了修改，两者都会发生变化.

**与解构赋值结合**

<br>扩展运算符可以与解构赋值结合起来，用于生成数组。
```js
const [first, ...rest] = [1, 2, 3, 4, 5];
first // 1
rest  // [2, 3, 4, 5]
```
如果将扩展运算符用于数组赋值，只能放在参数的最后一位，否则会报错。
```js
const [...butLast, last] = [1, 2, 3, 4, 5];//Error
```
**字符串**

将字符串转成真正的数组,并且能够正确识别四个字节的 Unicode 字符。
```js
console.log([...'hello']);//["h", "e", "l", "l", "o"]
```
**实现了遍历器接口的对象**

对于实现了遍历器的对象，都可用扩展运算符转为真正的数组。
```js
let nodeList = document.querySelectorAll('div');
let array = [...nodeList];//数组
```
原因：NodeList实现了遍历器。
<br>实现Number遍历器接口
```js
Number.prototype[Symbol.iterator]=function*(){//Generator函数赋给对象的Symbol.iterator属性，可使该对象具有Iterator接口。
  let i = 0;
  let num = this.valueOf();
  while(i<num){
    yield i++;
  }
}
console.log([...5]);//[0, 1, 2, 3, 4]
```
对于那些没有部署 Iterator 接口的类似数组的对象，扩展运算符就无法将其转为真正的数组。可使用Array.form()方法将其转为真正的数组。

**Map 和 Set 结构，Generator 函数**

扩展运算符内部调用的是数据结构的 Iterator 接口，因此只要具有 Iterator 接口的对象，都可以使用扩展运算符，比如 Map 结构。
### Array of
es6新增数组创建方法是为了避免通过Array构造函数创建数组时的怪异行为。如下：
```js
let item = Array(2);
console.log(item.length);//2
console.log(item[0],item[1]);//undefined undefined
```
Generator 函数运行后，返回一个遍历器对象，所以可以使用扩展运算符。
```js
const go = function*(){
    yield 1;
    yield 2;
    yield 3;
};
console.log([...go()]);//[1,2,3]
```

### Array.from()
Array.from方法用于将两类对象转为真正的数组：类似数组的对象（array-like object）和可遍历（iterable）的对象（包括 ES6 新增的数据结构 Set 和 Map）。<br>
常见的类似数组的对象是 DOM 操作返回的 NodeList 集合，以及函数内部的arguments对象
```js
function foo() {
  let args = Array.from(arguments);
  console.log(args);
}
foo(1,2,3);//[1, 2, 3]
```
字符串和 Set 结构部署了Iterator接口，可被Array.from转为数组。<br>

扩展运算符背后调用的是遍历器接口（Symbol.iterator），如果一个对象没有部署这个接口，就无法转换。Array.from方法还支持类似数组的对象，任何有length属性的对象，都可以通过Array.from方法转为数组，而此时扩展运算符就无法转换。<br>
**对于没有部署的，可以用Array.prototype.slice方法代替。**
```js
const toArray(()=>
    Array.from ? Array.from : obj => [].slice.call(obj)
)();
```
**Array.from可接收第二个参数,作用类似数组map方法，对每个元素处理，处理后放入返回的数组**
```js
let arr=[1,2,3];
console.log(Array.from(arr,x=>x*x));
//相当于
console.log(Array.from(arr).map(x=>x*x));
```
**返回各种数据的类型**
```js
function typesOf () {
  return Array.from(arguments, value => typeof value)
}
typesOf(null, [], NaN)
// ['object', 'object', 'number']
```
**字符串转数组**
```js
function countSymbols(string) {
  return Array.from(string).length;
}
```
### 数组实例的copyWithin()
在**当前数组内部**，将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组。
接收三个参数：
- target（必须）：从该位置开始替换数据。负值表示倒数。
- start（可选）：从该位置开始读取，默认0。负值表示倒数。
- end（可选）：到该位置前停止读取数据，默认等于数组长度。如果为负值，表示倒数。
```js
//将3号位置复制到0号位置
[1, 2, 3, 4, 5].copyWithin(0, 3, 4)
```
### 数组实例find()和findIndex()
#### find()
数组实例的find方法，用于找出第一个符合条件的数组成员。它的参数是一个回调函数，所有数组成员依次执行该回调函数，直到找出第一个返回值为true的成员，然后返回该成员。如果没有符合条件的成员，则返回undefined。
举例如下
```js
[1,4,-5,10].find((n)=>n<0)
//-5
```
#### findIndex()
数组实例的findIndex方法，返回第一个符合条件的数组成员的位置，如果所有成员都不符合条件，则返回-1。
```js
function f(v){
  return v > this.age;
}
let person = {name: 'John', age: 20};
[10, 12, 26, 15].find(f, person);    // 26
```
**这两个方法都可以发现NaN,弥补indexOf方法的不足。**
```js
[NaN].indexOf(NaN)
// -1

[NaN].findIndex(y => Object.is(NaN, y))
// 0
```
### 数组实例fill()
使用给定值，填充一个数组。
- 数组初始化
```js
new Array(3).fill(8);//[8, 8, 8]
```
- fill方法还可以接受第二个和第三个参数，用于指定填充的起始位置和结束位置。
```js
['a','b','c'].fill(7,1,2);
```
fill从1号位置开始，向原数组填充7，到2号之前结束。
- 如果填充的类型为对象，那么被赋值的是同一个内存地址的对象，而不是深拷贝对象。
### 数组实例的 entries(),keys()和values()
- 用途：遍历数组。
- 唯一的区别是keys()是对键名的遍历、values()是对键值的遍历，entries()是对键值对的遍历。
- 返回一个遍历器对象，可以用for...of循环进行遍历，也可以手动调用遍历器对象的next方法，进行遍历。
```js
for (let index of ['a', 'b'].keys()) {
  console.log(index);
}
// 0
// 1

for (let elem of ['a', 'b'].values()) {
  console.log(elem);
}
// 'a'
// 'b'

for (let [index, elem] of ['a', 'b'].entries()) {
  console.log(index, elem);
}
// 0 "a"
// 1 "b"

//next遍历
let letter = ['a', 'b', 'c'];
let entries = letter.entries();
console.log(entries.next().value); // [0, 'a']
console.log(entries.next().value); // [1, 'b']
console.log(entries.next().value); // [2, 'c']
```
### 数组实例的includes()
返回一个布尔值，表示某个数组是否包含给定的值，与字符串的includes方法类似。
- 参数1：所要找寻的的字符；
- 参数2：搜索起始位置。如果第二个参数为负数，则表示倒数的位置，如果这时它大于数组长度（比如第二个参数为-4，但数组长度为3），则会重置为从0开始。
```js
[1,2,3].includes(2);//true
[1,2,3].includes(4);//flase
[1,2,NaN].includes(NaN);//true

[1,2,3].includes(3,-1);//true
```
> indexOf缺陷:

> 不够语义化，参数值的第一个出现位置，所以要去比较是否不等于-1，表达起来不够直观；<br>
> 内部使用严格相等运算符（===）进行判断，对NaN误判。

### 数组实例的 flat()，flatMap()
**flat()**：
- 将嵌套的数组“拉平”，变成一维的数组。该方法返回一个新数组，对原数据没有影响。
- 默认拉平一层嵌套，若拉平多层，可将层数传给flat();
- 如果不管有多少层嵌套，都要转成一维数组，可以用Infinity关键字作为参数。 
```js
 [1, [2, [3]]].flat(Infinity);// [1, 2, 3]
```
- 如果原数组有空位，flat()方法会跳过空位。
**flatMap()**
flatMap()方法对原数组的每个成员执行一个函数（相当于执行Array.prototype.map()），然后对返回值组成的数组执行flat()方法。该方法返回一个新数组，不改变原数组。
- 只能展开一层
- 参数是一个遍历函数，该函数接收3个参数
  - 当前数组成员
  - 当前数组成员的位置
  - 原数组
### 数组的空位
数组的某一个位置没有任何值。比如，Array构造函数返回的数组都是空位。<br>
空位不是undefined，一个位置的值等于undefined，依然是有值的。空位是没有任何值。