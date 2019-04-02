## 说在前面
在说 Symbol 之前，我们先回顾一下 ES5 中的基本类型。共有6种：undefined null Number  Object Boolean String。typeof返回类型字符串，其中用 typeof 进行检测时，typeof(undefined)==='undefined'结果为true。

类型 | 结果
---|---
undefined|'undefined'
null|'object'
Number|'number'
Object|'object'
Boolean|'boolean'
String | 'string'

>对于对象、数组、正则、null的检测都会返回object。之所以null检测返回object,是因为在底层存储中以二进制存储，object类型前3位都为0，而 null 的每一位都为0（自然前3位也是0），所以会被检测为object。
## symbol
ES6 引入了一种新的原始数据类型 Symbol，表示独一无二的值。
1. symbol 值通过 symbol函数生成，使用 typeof 检测返回"symbol"。
2. Symbol 函数前不能使用new命令，否则会报错。这是因为生成的 Symbol 是一个原始类型的值，不是对象。它是一种类似于字符串的数据类型。
3. instanceof 的检测结果为false
```
 var s1 = Symbol('foo');
 console.log(s1 instanceof Symbol);
```
4. Symbol 函数可接受一个字符串作为参数，表示对 Symbol 实例的描述，主要是为了在控制台显示，或者转为字符串时，比较容易区分。
```
var s1 = Symbol('foo');
console.log(s1);//Symbol(foo)
```
5. 如果 Symbol 的参数是一个对象，就会调用该对象的 toString 方法，将其转为字符串，然后才生成一个 Symbol 值。
```
const obj = {
  toString() {
    return 'abc';
  }
};
const sym = Symbol(obj);
console.log(sym); // Symbol(abc)
```
6. Symbol 函数参数只是对当前Symol值的描述，相同参数Symbol 函数返回值是不相等的。Symbol的描述被存储在内部[[Description]]属性中，只有当调用Symbol的toString()方法时才可以读取这个属性。
```
//有参数
var s1 = Symbol();
var s2 = Symbol();
console.log(s1===s2);//false
//无参数
var s1 = Symbol('pool');
var s2 = Symbol('pool');
console.log(s1===s2);//false
```
7. Symbol 值不能与其他类型的值进行运算，会报错。
8. Symbol 被显式转为字符串。
```
var s1 = Symbol('pool');
console.log(s1);//Symbol(pool)
console.log(s1.toString());//'Symbol(pool)'
```
9. Symbol 值可以作为标识符，用于对象的属性名，可以保证不会出现同名的属性。
10. Symbol 作为属性名，该属性使用Object.getOwnPropertySymbols 方法可以获取指定对象的所有 Symbol 属性名。
```
var obj = {};
var a = Symbol('a');
var b = Symbol('b');

obj[a] = 'Hello';
obj[b] = 'World';

var objectSymbols = Object.getOwnPropertySymbols(obj);

console.log(objectSymbols);
// [Symbol(a), Symbol(b)]
```
11. 使用同一个 Symbol 值，使用Symbol.for。
```
var s1 = Symbol.for('foo');
var s2 = Symbol.for('foo');

console.log(s1 === s2); // true
```
12. Symbol.keyFor 方法返回一个已登记的 Symbol 类型值的 key。
```
var s1 = Symbol.for("foo");
console.log(Symbol.keyFor(s1)); // "foo"

var s2 = Symbol("foo");
console.log(Symbol.keyFor(s2) ); // undefined
```