
## why?
用循环语句迭代时，必须初始化变量记录每一次迭代在集合中的位置，而迭代器对象返回迭代过程中集合的每一个元素。极大地简化了数据操作。
### 什么是迭代器
迭代器是一种特殊对象，所有的迭代器对象都有一个next()方法，每次调用都返回一个结果对象。<br>
next方法返回一个对象，表示当前数据成员的信息。这个对象具有value和done两个属性，value属性返回当前位置的成员，done属性是一个布尔值，表示遍历是否结束。
### 模拟实现
```js
function creatIterator(items){
    var  i =0;
    return {
      next:function(){
        var done=(i>=items.length);
        var value=!done?items[i++]:undefined;
        return {
        done:done,
        value:value
      }
      }
    }
  }
  var iterator=creatIterator([1,2,3]);
  console.log(iterator.next());//{done: false, value: 1}
  console.log(iterator.next());//{done: false, value: 2}
  console.log(iterator.next());//{done: false, value: 3}
  console.log(iterator.next());//{done: true, value: undefined}
```
根据描述，可写出如上模拟代码。不过，依然是十分的复杂，所以引入生成器。
## 什么是生成器
生成器是一种返回迭代器的函数，通过function关键字后加*来表示，函数中会用到关键字yield。
```
function *creatIterator(){
    yield 1;
    yield 2;
    yield 3;
}
//生成器调用方式与普通函数相同，不过返回的是一个迭代器
let iterator = creatIterator();
console.log(iterator);迭代器_proto_指向Generator
console.log(iterator.next().value);//1
console.log(iterator.next().value);//2
console.log(iterator.next().value);//3
```
在每执行完一条yield语句后函数就会自动停止执行。再次调用next方法才会继续执行。<br>
使用yield关键字可返回任何值或表达式。因此可以通过生成器函数批量地给迭代器添加元素。
```
function *creatIterator(items){
    for(let i=0;i<items.length;i++){
      yield items[i];
    }
}
//生成器调用方式与普通函数相同，不过返回的是一个迭代器
let iterator = creatIterator([1,2,3]);

console.log(iterator.next().value);//1
console.log(iterator.next().value);//2
console.log(iterator.next().value);//3
console.log(iterator.next().value);//undefined
```
### yield使用限制
yield关键字只能在生成器内部使用，其他地方会导致程序报错。
典型错误
```js
//错误示范
function *createIterator(items){
    items.forEach(function(item){
        yield item+1;
    })
}
//Uncaught SyntaxError: Unexpected identifier
```
> 不能用箭头函数创建生成器

### 生成器作为对象的方法
```js
let o={
  *createIterator(items){//es6写法
    for(let i=0;i<items.length;i++){
      yield items[i];
    }
  }
}
let iterator=o.createIterator([1,2,3]);
```
### 可迭代对象和for-of循环

#### 访问默认迭代器

Iterator 接口的目的，就是为所有数据结构，提供了一种统一的访问机制，即for...of循环。当使用for...of循环遍历某种数据结构时，该循环会自动去寻找 Iterator 接口。

for-of循环每执行一次调用一次迭代对象next()方法，并将迭代器返回的结果对象的value属性存储在一个变量中，循环直至返回对象done属性为true。

可以通过Symbol.iterator来访问对象默认的迭代器。

原生具备 Iterator 接口的数据结构<br>
- Array
- Map
- Set
- String
- TypedArray
- 函数的 arguments 对象
- NodeList 对象


#### 创建可迭代对象
默认情况下，自定义对象都是不可迭代对象，若给Symbol.iterator属性添加一个生成器，则可将其变为可迭代对象。
```js
 let es6 = {
  edition: 6,
  committee: "TC39",
  standard: "ECMA-262"
};
console.log(typeof es6[Symbol.iterator]==="function");//false
```
改进
```js
let es6 = {
  *[Symbol.iterator](){
    yield 6;
    yield "TC39";
    yield "ECMA-262";
  }
};
console.log(typeof es6[Symbol.iterator]==="function");//true
for(let i of es6){
  console.log(i);// 6 "TC39" "ECMA-262"
}
```
#### 内建迭代器

有些数据结构是在现有数据结构的基础上，计算生成的。比如，ES6 的数组、Set、Map 都部署了以下三个方法，调用后都返回遍历器对象。

- entries() 返回一个遍历器对象，用来遍历[键名, 键值]组成的数组。对于数组，键名就是索引值；对于  Set，键名与键值相同。Map 结构的 Iterator 接口，默认就是调用entries方法。
- keys() 返回一个遍历器对象，用来遍历所有的键名。
- values() 返回一个遍历器对象，用来遍历所有的键值。
```js
let arr = ['a', 'b', 'c'];
for (let pair of arr.entries()) {
  console.log(pair);
}
// [0, 'a']
// [1, 'b']
// [2, 'c']
```

**不具有Iterator接口的类似数组对象，使用for-of**

解决：利用Array.from方法将其转为数组。
```js
let obj={length: 2, 0: 'a', 1: 'b' };
for(let i of obj){
  console.log(i);//Untitled-3.html:174 Uncaught TypeError: obj is not iterable
}
for(let i of Array.from(obj)){
  console.log(i);
}
//a b
```
> for...of循环可以自动遍历 Generator 函数运行时生成的Iterator对象，且此时不再需要调用next方法。
>  区别：一旦next方法的返回对象的done属性为true，for...of循环就会中止，且不包含该返回对象。即return语句用for-of遍历不到。

除了for...of循环以外，扩展运算符（...）、解构赋值和Array.from方法内部调用的，都是遍历器接口。这意味着，它们都可以将 Generator 函数返回的 Iterator 对象，作为参数。
```js
function* numbers(){
  yield 1;
  yield 2;
  return 3;
  yield 4;
}
console.log([...numbers()]);//[1,2]
console.log(Array.from(numbers()));//[1,2]
let [x,y]=numbers();
console.log(x,y);//1 2
for(let i of numbers()){
  console.log(i);
}
//1 2
```
### next()、throw()、return() 的共同点
- next()是将yield表达式替换成一个值。
- throw()是将yield表达式替换成一个throw语句。在函数体外抛出错误，然后在 Generator 函数体内捕获。
- return()是将yield表达式替换成一个return语句。返回给定的值，并且终结遍历 Generator 函数。


### 嵌套调用generator
使用yield*
```js
function* foo(){
  yield 'a';
  yield 'b';
}
function* bar(){
  yield 'x';
  yield* foo();
  yield 'y';
}
//等同
function* bar (){
  yield 'x';
  yield 'a';
  yield 'b';
  yield 'y';
}
for(let i of bar()){
  console.log(i);
}
```