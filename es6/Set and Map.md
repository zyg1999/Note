## Set
### 基本用法
类似数组，成员值唯一。<br>
本身是构造函数，new生成，Set函数可接受数组或类似数组的对象（dom集合）
。<br>
可用来数组、字符串去重
```js
[...new Set([1,2,3,1,5])];//[1,2,3,5]
[...new Set([1,2,3,'1',5])]//[1, 2, 3, "1", 5]

[...new Set('ababbc')].join('')
// "abc"
```
> Set 不会进行强制类型转换。1和'1'是两个不同的值，类似于精确等于`===`,区别在于NaN等于自身，精确相等运算符认为NaN不等于自身。

两个对象总是不等的
```js
let set = new Set();

set.add({});
set.size // 1

set.add({});
set.size // 2
```
### Set 实例属性和方法
#### 属性
- Set.prototype.constructor：构造函数，默认就是Set函数
- Set.prototype.size：返回Set实例的成员总数。
#### 方法
Set 实例方法分为两大类：操作方法和遍历方法。
##### 操作方法
- `add(value)`: 添加某个值，返回Set结构本身。
- `delete(value)`: 删除某个值，返回布尔值，成功true,失败false。
- `has(value)`: 返回一个布尔值，表示该值是否为Set的成员。
- `clear()`: 清除所有成员，无返回。
> Array.from方法可以将 Set 结构转为数组。
> 数组去重一种方法
```js
function dedupe(array) {
  return Array.from(new Set(array));
}

dedupe([1, 1, 2, 3]) // [1, 2, 3]
```
##### 遍历方法
- keys()返回键名  
- values返回键值  ，可省略values用for of遍历
- entries返回键值对(Set结构键名键值同一个值) 

> Set 结构的实例默认可遍历，它的默认遍历器生成函数就是它的values方法。
`Set.prototype[Symbol.iterator] === Set.prototype.values `
> 意味可以省略values方法，直接用for of循环遍历Set
```js
let set = new Set(['red', 'green', 'blue']);

for (let x of set) {
  console.log(x);
}
//red 
//green 
//blue
```
- forEach 使用回调函数遍历每个成员
对每个成员执行某种操作，没有返回值。
```js
let set = new Set([1, 4, 9]);
set.forEach((value, key) => console.log(key + ' : ' + value))
// 1 : 1
// 4 : 4
// 9 : 9
```
> forEach方法的参数就是一个处理函数。该函数的参数与数组的forEach一致，依次为键值、键名、集合本身（上例省略了该参数）。这里需要注意，Set 结构的键名就是键值（两者是同一个值），因此第一个参数与第二个参数的值永远都是一样的。<br>
> 第二个参数表示绑定处理函数内部的this对象。
##### 遍历应用
扩展运算符内部使用for  of循环。结合使用可去重
```js
let set = new Set(['red', 'green', 'blue','red']);
let arr = [...set];
// ['red', 'green', 'blue']
```
数组的map和filter方法也可以间接用于 Set 了。
```js
let set = new Set([1, 2, 3]);
set = new Set([...set].map(x => x * 2));
// 返回Set结构：{2, 4, 6}

let set = new Set([1, 2, 3, 4, 5]);
set = new Set([...set].filter(x => (x % 2) == 0));
// 返回Set结构：{2, 4}
```
> Set 可以很容易地实现并集（Union）、交集（Intersect）和差集.

若想同步改变原 Set 结构。可利用Set结构映射新的结构，赋值给原来的Set结构；也可以利用Array.from方法。
```js
// 方法一
let set = new Set([1, 2, 3]);
set = new Set([...set].map(val => val * 2));
// set的值是2, 4, 6

// 方法二
let set = new Set([1, 2, 3]);
set = new Set(Array.from(set, val => val * 2));
// set的值是2, 4, 6
```
## WeakSet
与Set的区别：
- WeakSet 的成员只能是对象，而不能是其他类型的值。
- WeakSet 中的对象都是弱引用。即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中。ES6 规定 WeakSet 不可遍历。
### 语法
WeakSet 是一个构造函数，可以使用new命令，创建 WeakSet 数据结构。接受一个数组或类似数组的对象作为参数，该数组的所有成员，都会自动成为 WeakSet 实例对象的成员。
```js
const a = [[1, 2], [3, 4]];
const ws = new WeakSet(a);
// WeakSet {[1, 2], [3, 4]}

console.log(ws.has([1,2]));//false
console.log(ws.has(a[0]));//true
```
这意味着， WeakSet存的是a的成员的的引用。<br>

WeakSet 结构有以下三个方法。
```js
WeakSet.prototype.add(value)：向 WeakSet 实例添加一个新成员。
WeakSet.prototype.delete(value)：清除 WeakSet 实例的指定成员。
WeakSet.prototype.has(value)：返回一个布尔值，表示某个值是否在 WeakSet 实例之中。
```
> WeakSet 不能遍历，是因为成员都是弱引用，随时可能消失，遍历机制无法保证成员的存在，很可能刚刚遍历结束，成员就取不到了。WeakSet 的一个用处，是储存 DOM 节点，而不用担心这些节点从文档移除时，会引发内存泄漏。
## Map
### 含义和基本用法
JavaScript 的对象（Object），本质上是键值对的集合（Hash 结构），但是传统上只能用字符串当作键。非字符串会被自动转为字符串[object HTMLDivElement]。<br>
ES6 提供了 Map 数据结构。它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键.Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应
```js
const m = new Map();
const o = {p: 'Hello World'};

m.set(o, 'content')
m.get(o) // "content"

m.has(o) // true
m.delete(o) // true
m.has(o) // false
```
使用 Map 结构的set方法，将对象o当作m的一个键，然后又使用get方法读取这个键，接着使用delete方法删除了这个键。<br>
```js
const map = new Map();

map.set(['a'], 555);
map.get(['a']) // undefined 内存地址是不一样的
let arr=['a'];
map.set(arr[0],'555');
map.get(arr[0]);//555
```
只有对同一个对象的引用，Map 结构才将其视为同一个键。这一点要非常小心。

> Map 的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键。这就解决了同名属性碰撞（clash）的问题，我们扩展别人的库的时候，如果使用对象作为键名，就不用担心自己的属性与原作者的属性同名。<br>
> 如果 Map 的键是一个简单类型的值（数字、字符串、布尔值），则只要两个值严格相等，Map 将其视为一个键。
### 实例属性和操作方法
- size属性：返回 Map 结构的成员总数
```js
const map = new Map();
map.set('foo', true);
map.set('bar', false);

map.size // 2
```
- set(key, value): 设置键名key对应的键值为value，然后返回整个 Map 结构。可采用链式写法。
- get(key): 读取key对应的键值，若找不到key，返回undefined。
- has(key)：返回一个布尔值，表示某个键是否在当前 Map 对象之中。
- delete(key)：删除某个键，返回true。如果删除失败，返回false。
- clear方法清除所有成员，无返回值。
### 遍历方法
结构原生提供三个遍历器生成函数和一个遍历方法。
- keys()：返回键名的遍历器。
- values()：返回键值的遍历器。
- entries()：返回所有成员的遍历器。
- forEach()：遍历 Map 的所有成员。
> Map 的遍历顺序就是插入顺序

Map 结构转为数组结构，比较快速的方法是使用扩展运算符（...）.结合数组的map方法、filter方法，可以实现 Map 的遍历和过滤（Map 本身没有map和filter方法）。
```js
const map0 = new Map()
  .set(1, 'a')
  .set(2, 'b')
  .set(3, 'c');

const map1 = new Map(
  [...map0].filter(([k, v]) => k < 3)
);
// 产生 Map 结构 {1 => 'a', 2 => 'b'}

const map2 = new Map(
  [...map0].map(([k, v]) => [k * 2, '_' + v])
    );
// 产生 Map 结构 {2 => '_a', 4 => '_b', 6 => '_c'}
```
forEach方法，与数组的forEach方法类似，也可以实现遍历。可以接受第二个参数，用来绑定this.
```js
const reporter = {
  report: function(key, value) {
    console.log("Key: %s, Value: %s", key, value);
  }
};

map.forEach(function(value, key, map) {
  this.report(key, value);
}, reporter);
```
### 与其他数据结构互换
- Map 转数组
```
const myMap = new Map()
  .set(true, 7)
  .set({foo: 3}, ['abc']);
[...myMap]
// [ [ true, 7 ], [ { foo: 3 }, [ 'abc' ] ] ]
```
- 数组转Map:将数组传入 Map 构造函数
- Map转对象：如果所有 Map 的键都是字符串，它可以无损地转为对象。如果有非字符串的键名，那么这个键名会被转成字符串，再作为对象的键名。
```js
function strMapToObj(strMap) {
  let obj = Object.create(null);
  for (let [k,v] of strMap) {
    obj[k] = v;
  }
  return obj;
}

const myMap = new Map()
  .set('yes', true)
  .set('no', false);
strMapToObj(myMap)
// { yes: true, no: false }
```
- 对象转Map
```js
function objToStrMap(obj) {
  let strMap = new Map();
  for (let k of Object.keys(obj)) {
    strMap.set(k, obj[k]);
  }
  return strMap;
}

objToStrMap({yes: true, no: false})
// Map {"yes" => true, "no" => false}
```
- Map 转JSON
  - Map 的键名都是字符串，这时可以选择转为对象 JSON。
  ```js
  function strMapToJson(strMap) {
  return JSON.stringify(strMapToObj(strMap));
    }
    
    let myMap = new Map().set('yes', true).set('no', false);
    strMapToJson(myMap)
    // '{"yes":true,"no":false}'
  ```
  - Map 的键名有非字符串，这时可以选择转为数组 JSON。
  ```js
  function mapToArrayJson(map) {
      return JSON.stringify([...map]);
  }
    
    let myMap = new Map().set(true, 7).set({foo: 3}, ['abc']);
    mapToArrayJson(myMap)
    // '[[true,7],[{"foo":3},["abc"]]]'
  ```
- JSON 转为 Map
   - 正常情况下，所有键名都是字符串
   ```js
   function jsonToStrMap(jsonStr) {
      return objToStrMap(JSON.parse(jsonStr));
    }
    
    jsonToStrMap('{"yes": true, "no": false}')
    // Map {'yes' => true, 'no' => false}
   ```
   - 整个 JSON 就是一个数组，且每个数组成员本身，又是一个有两个成员的数组，这时，它可以一一对应地转为 Map
   ```js
   function jsonToMap(jsonStr) {
      return new Map(JSON.parse(jsonStr));
    }
    
    jsonToMap('[[true,7],[{"foo":3},["abc"]]]')
    // Map {true => 7, Object {foo: 3} => ['abc']}
   ```
 ## WeakMap
 ###  与 Map 区别
 - WeakMap只接受对象作为键名（null除外），不接受其他类型的值作为键名
 - WeakMap 的键名所引用的对象都是弱引用，即垃圾回收机制不将该引用考虑在内。只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放该对象所占用的内存。
 > WeakMap的设计目的在于，有时我们想在某个对象上面存放一些数据，但是这会形成对于这个对象的引用。垃圾回收机制无法将其清除。
 
 > WeakMap 弱引用的只是键名，而不是键值.
 #### 方法
 get()、set()、has()、delete()。
 ### 应用场合
 DOM 节点作为键名；部署私有属性。