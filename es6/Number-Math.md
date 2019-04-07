## Number扩展
### 数值是否有限Number.isFinite()
Number.isFinite()用来检查一个数值是否为有限的（finite），即不是Infinity。
> 如果参数类型不是数值，Number.isFinite一律返回false。
### 数值是否NaN Number.isNaN()
检查一个值是否为NaN。在不是NaN的情况下一律返回false。
### 数值转换Number.parseInt()，Number.parseFloat()
```js
Number.parseInt('12.34') // 12
Number.parseFloat('123.45#') // 123.45
```
### 是否整数 Number.isInteger()
```js
Number.isInteger(25);//true
Number.isInteger(25.1);//flase
Number.isInterger(25.0);//true
NumberisInterger('15);//flase
```
> JavaScript 内部，整数和浮点数采用的是同样的储存方法，所以 25 和 25.0 被视为同一个值。

> 如果参数不是数值，Number.isInteger返回false。

**误判情况**

```js
Number.isInteger(3.0000000000000002) // true
```
> js数值存储为64位双精度格式,数值精度最多可以达到 53 个二进制位（1 个隐藏位与 52 个有效位）

> 上面代码造成误判，原因就是这个小数的精度达到了小数点后16个十进制位，转成二进制位超过了53个二进制位，导致最后的那个2被丢弃了。

### Number.EPSILON
极小常量，表示 1 与大于 1 的最小浮点数之间的差。
```js
Number.EPSILON === Math.pow(2, -52)
```
> 对于 64 位浮点数来说，最小浮点数2的-52次方。
> Number.EPSILON实际上是 JavaScript 能够表示的最小精度。误差如果小于这个值，就可以认为已经没有意义了，即不存在误差了。

浮点数的计算式不精确的，Number.EPSILON可以用来设置“能够接受的误差范围”。
```js
0.1 + 0.2
// 0.30000000000000004
```
部署误差检查函数，误差范围设为2的-52次方
```js
function withinErrorMargin (left, right) {
  return Math.abs(left - right) < Number.EPSILON * Math.pow(2, 2);
}

0.1 + 0.2 === 0.3 // false
withinErrorMargin(0.1 + 0.2, 0.3) // true
```
### 安全整数和 Number.isSafeInteger() 
JavaScript 能够准确表示的整数范围在-2^53 到2^53之间（不含两个端点），超过这个范围，无法精确表示这个值。
ES6 引入了Number.MAX_SAFE_INTEGER 和 Number.MIN_SAFE_INTEGER这两个常量，用来表示这个范围的上下限。
```js
Number.MAX_SAFE_INTEGER === Math.pow(2, 53) - 1
// true
Number.MAX_SAFE_INTEGER === 9007199254740991
// true

Number.MIN_SAFE_INTEGER === -Number.MAX_SAFE_INTEGER
// true
Number.MIN_SAFE_INTEGER === -9007199254740991
// true
```
Number.isSafeInteger() 则是用来判断一个整数是否落在这个范围之内。
```js
Number.isSafeInteger(null);//false
Number.isSafeInteger('a');//false

Number.isSafeInteger(3);//true

Number.isSafeInteger(Number.MIN_SAFE_INTEGER - 1);//false
```
函数实现如下
```js
Number.isSafeInteger = function (n) {
  return (typeof n === 'number' &&
    Math.round(n) === n &&
    Number.MIN_SAFE_INTEGER <= n &&
    n <= Number.MAX_SAFE_INTEGER);
}
```

> 使用函数时，不能仅仅只验证运算结果，而且要验证参与运算的每个值。

下面的函数可以同时验证两个运算数和运算结果。
```js
function trusty (left, right, result) {
  if (
    Number.isSafeInteger(left) &&
    Number.isSafeInteger(right) &&
    Number.isSafeInteger(result)
  ) {
    return result;
  }
  throw new RangeError('Operation cannot be trusted!');
}

trusty(9007199254740993, 990, 9007199254740993 - 990)
// RangeError: Operation cannot be trusted!

trusty(1, 2, 3)
// 3
```
## Math扩展
### 去除小数部分 Math.trunc() 
```js
Math.trunc(4.1);//4
Math.trunc(-5.6);//-5

Math.trunc('123.456');//123
Math.trunc(true) //1
Math.trunc(false) // 0
Math.trunc(null) // 0

Math.trunc(NaN);      // NaN
Math.trunc('foo');    // NaN
Math.trunc(undefined) // NaN
```
> 对于非数值，Math.trunc内部使用Number方法将其先转为数值。

> 空值和无法截取整数的值，返回NaN.

### 判断正or负or零 Math.sign()
Math.sign方法用来判断一个数到底是正数、负数、还是零。对于非数值，会先将其转换为数值。
五种返回值：
  - 参数为正，返回+1；
  - 参数为负，返回-1；
  - 参数为0，返回0；
  - 参数为-0，返回-0；
  - 其他值，返回NaN。
 > 如果参数是非数值，会自动转为数值。对于那些无法转为数值的值，会返回NaN。
### 开立方根 Math.cbrt()
对于非数值，Math.cbrt方法内部也是先使用Number方法将其转为数值。
```js
//模拟代码
Math.cbrt = Math.cbrt || function(x) {
  var y = Math.pow(Math.abs(x), 1/3);
  return x < 0 ? -y : y;
};
```
### 转32位无符号整形 Math.clz32()
返回转化后32位值里有多少个前导0.
```js
Math.clz32(0);//32
```
> 对于小数，Math.clz32方法只考虑整数部分。
> <br>对于空值或其他类型的值，Math.clz32方法会将它们先转为数值，然后再计算。

### 对数方法
- Math.expm1()
> Math.expm1(x)返回 ex - 1，即Math.exp(x) - 1。
- Math.log1p()
> Math.log1p(x)方法返回1 + x的自然对数，即Math.log(1 + x)。如果x小于-1，返回NaN。
- Math.log10()
> Math.log10(x)返回以 10 为底的x的对数。如果x小于 0，则返回 NaN。
- Math.log2()
> Math.log2(x)返回以 2 为底的x的对数。如果x小于 0，则返回 NaN。
### 双曲函数方法
- Math.sinh(x) 返回x的双曲正弦（hyperbolic sine）
- Math.cosh(x) 返回x的双曲余弦（hyperbolic cosine）
- Math.tanh(x) 返回x的双曲正切（hyperbolic tangent）
- Math.asinh(x) 返回x的反双曲正弦（inverse hyperbolic sine）
- Math.acosh(x) 返回x的反双曲余弦（inverse hyperbolic cosine）
- Math.atanh(x) 返回x的反双曲正切（inverse hyperbolic tangent）

### 指数运算符 **
```js
2**2;//4

2**3**2;//512 相当于2**(3**2)
```
> 这个运算符的一个特点是右结合，而不是常见的左结合。多个指数运算符连用时，是从最右边开始计算的。

可以与等号结合 **=
```js
let b = 4;
b **= 3;
// 等同于 b = b * b * b;
```