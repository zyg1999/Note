JS变量和类型
​
## 基本类型
- `Null`:只包含一个值`null`
- `Undefined`:只包含一个值`undefined`
- `Boolean`:包含两个值`true`和`false`
- `Numver`:整数或浮点数，还包括特殊值（`-Infinity`、`+Infinity`、`NaN`）
- `String`:一串表示文本值的字符序列
- `Symbol`：一种实例是唯一且不可改变的数据类型
- `BigInt`:es10新增
## 对象类型
`Object`:除了常用的Object，Array、Function等都属于特殊的对象
## 区别
### 基本类型
- 存储在栈中
- 大小固定，不可变性
- 有人可能会疑惑
- 做函数参数传递时，原始类型将值本身赋给局部变量。
```js
let str='123';
str+='6'
console.log(str)//1236
//str确实变了，但实际上他会开辟新的内存进行存储
```
- 比较时比较值，若值相等==》true
#### 栈
- 存储的值大小固定
- 空间较小
- 可以直接操作其保存的变量，运行效率高
- 由系统自动分配存储空间
### 引用类型

- 值存储在堆中，栈中存储固定长度地址，指向堆中
- 引用的比较，比较地址，若地址同==》true，否则false
- 做函数参数传递时，引用类型复制的是指向堆的地址。
#### 堆
- 存储的值大小不定，可动态调整
- 空间较大，运行效率低
- 无法直接操作其内部存储，使用引用地址读取
- 通过代码进行分配空间

> ECMAScript中所有函数都是按值传递的。

## null 和 undefined
- null转数字为 0 ，对象赋值为null表示空
- undefined，表示“缺少值”，即此处应有一个值，但还没有定义。转数字为NaN。

## Symbol
### 独一无二

直接使用Symbol()创建新的symbol变量，可选用一个字符串用于描述。当参数为对象时，将调用对象的toString()方法。
```js
var sym1 = Symbol();  // Symbol() 
var sym2 = Symbol('ConardLi');  // Symbol(ConardLi)
var sym3 = Symbol('ConardLi');  // Symbol(ConardLi)
var sym4 = Symbol({name:'ConardLi'}); // Symbol([object Object])
console.log(sym2 === sym3);  // false
```
相同字符串创建symbol并不相等。
如果我们想创造两个相等的Symbol变量，可以使用Symbol.for(key)。

> 使用给定的key搜索现有的symbol，如果找到则返回该symbol。否则将使用给定的key在全局symbol注册表中创建一个新的symbol。
### 原始类型

注意是使用Symbol()函数创建symbol变量，并非使用构造函数，使用new操作符会直接报错。

我们可以使用typeof运算符判断一个Symbol类型：
```
typeof Symbol() === 'symbol'
typeof Symbol('ConardLi') === 'symbol'
```
### 不可枚举
不可使用for in枚举属性，可用`Object.getOwnPropertySymbols()`获取Symbol属性
````
var obj = {
  name:'ConardLi',
  [Symbol('name2')]:'code秘密花园'
}
Object.getOwnPropertyNames(obj); // ["name"]
Object.keys(obj); // ["name"]
for (var i in obj) {
   console.log(i); // name
}
Object.getOwnPropertySymbols(obj) // [Symbol(name)]
````
### 应用

#### 私有属性
```js
const privateField = Symbol();
class myClass {
  constructor(){
    this[privateField] = 'ConardLi';
  }
  getField(){
    return this[privateField];
  }
  setField(val){
    this[privateField] = val;
  }
}
```
### 防止属性污染
模拟call
````js
Function.prototype.myCall = function (context) {
  if (typeof this !== 'function') {
    return undefined; // 用于防止 Function.prototype.myCall() 直接调用
  }
  context = context || window;
  const fn = Symbol();
  context[fn] = this;
  const args = [...arguments].slice(1);
  const result = context[fn](...args);
  delete context[fn];
  return result;
}
````
## Number类型
Number 类型存在问题：小数计算不精确。例如：0.1+0.2!==0.3

计算机中所有的数据都是以二进制存储的，所以在计算时计算机要把数据先转换成二进制进行计算，然后在把计算结果转换成十进制。
#### js对二进制小数的存储方式
小数的二进制大多数都是无限循环的。而JS遵循IEEE 754标准。使用64位固定长度来表示。

#### IEEE 754
IEEE 754标准包含一组实数的二进制表示法。它有三部分组成：

- 符号位: 标识正负的，1表示负，0表示正
- 指数位: 存储科学计数法的指数
- 尾数位: 存储科学计数法后的有效数字


JavaScript 使用的是64位双精度浮点数编码，所以它的符号位占1位，指数位占11位，尾数位占52位。

0.1为例

它的二进制为：`0.0001100110011001100...`

为了节省存储空间，在计算机中它是以科学计数法表示的，也就是
`1.100110011001100... X 2-4`

所以我们通常看到的二进制，其实是计算机实际存储的尾数位.

由于限制,有效数字第 53 位及以后的数字是不能存储的，它遵循，如果是1就向前一位进1，如果是0就舍弃的原则。所以0.1会发生精度丢失，0.2也是。导致了`0.1+0.2!=0.3`
#### JavaScript能表示的最大数字
由与IEEE 754双精度64位规范的限制：

指数位能表示的最大数字：1023(十进制)

尾数位能表达的最大数字即尾数位都位1的情况

所以JavaScript能表示的最大数字即位

1.111...X 2^1023 这个结果转换成十进制是`1.7976931348623157e+308`,这个结果即为Number.MAX_VALUE
#### 最大安全数字
JavaScript中Number.MAX_SAFE_INTEGER表示最大安全数字,计算结果是9007199254740991，即在这个数范围内不会出现精度丢失（小数除外）,这个数实际上是1.111...X 2^52.
官方也考虑到了这个问题，bigInt类型在es10中被提出，现在Chrome中已经可以使用，使用bigInt可以操作超过最大安全数字的数字

## 另外的引用类型
平时使用的很多引用类型的变量，并不是由Object构造的，但是它们原型链的终点都是Object，这些类型都属于引用类型
- Array 数组
- Date 日期
- RegExp 正则
- Function 函数
### 包装类型
为了便于操作基本类型值，ECMAScript还提供了几个特殊的引用类型
- String
- Number
- Boolean
包装类型与原始类型的区别
```js
true === new Boolean(true) // false
123 === new Number(123) // false
'Mike' === new String('Mike') // false
console.log(typeof new String('Mike')) // object
console.log(typeof 'Mike') // string
```
> 主要区别就是对象的生存期，使用new操作符创建的引用类型的实例，在**执行流离开当前作用域之前都一直保存在内存中**，而基本类型则只**存在于一行代码的执行瞬间**，然后立即被销毁，这意味着我们不能在运行时为基本类型添加属性和方法。
### 装箱和拆箱
- 装箱转换：基本类型转换为对应的包装类型
- 拆箱操作：引用类型转换为基本类型

每当我们操作一个基础类型时，后台就会自动创建一个包装类型的对象
```js
const name = 'Mike'
const name2 = name.substring(2)
console.log(name2)//ke
```
发生如下过程
- 创建一个String的包装类型实例
- 在实例上调用substring方法
- 销毁实例

拆箱的过程中，一般会调用引用类型的valueOf和toString方法，你也可以直接重写toPeimitive方法。

一般转换成不同类型的值遵循的原则不同，例如：

- 引用类型转换为`Number`类型，先调用`valueOf`，再调用`toString`
- 引用类型转换为`String`类型，先调用`toString`，再调用`valueOf`

若valueOf和toString都不存在，或者没有返回基本类型，则抛出TypeError异常。

还可以手动进行拆箱和装箱操作。我们可以直接调用包装类型的valueOf或toString，实现拆箱操作：
```js
var num =new Number("123");  
console.log( typeof num.valueOf() ); //number
console.log( typeof num.toString() ); //string
```