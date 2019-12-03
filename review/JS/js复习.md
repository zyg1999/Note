### JS变量类型

基本: null  undefined boolean string number symbol bigint

引用类型：object function array

### JS typeOf能检测哪些类型？

undefined function string boolean number symbol function biginint

在检测null的时候会变为object.原因是typeof判断的是机器码

### 堆栈关系

#### 栈

- 存储值大小固定
- 空间较小
- 可直接操作保存的变量，效率高
- 值的比较，由系统分配存储空间

#### 堆

- 存储空间动态，可调整
- 空间大，运行效率低
- 无法直接操作，通过引用读取
- 通过代码分配空间

### instanceOf原理？实现？

基于原型链的查找

```js
function myInstanceOf(target,origin){
    const proto = target.__proto__
    if(proto){
        if(proto===origin.prototype){
            return true
        }else{
            return myInstanceOf(proto,origin)
        }
    }
    return false
}
```



### 判断类型函数

```js
function typeTest(target){
    if(target===null){
        return 'null'
    }
    let typeT = typeOf target
    if(typeT!=='object'){
        return typeT
    }
    return Object.prototype.toString.call(target)
}
```



### 假值

null undefined +0 -0 '' false NaN

### 对象转基本类型

valueOf toString 

 Symbol.toPrimitive 优先级最高

### "a common string"为什么会有length属性

装箱操作 var a = new String('string');

### obj.toString() 和Object.prototype.toString.call(obj)

Array function 对toString方法进行了重写，所以找不到Object上的toString.其中数组toString返回元素组成的字符串，函数toString返回函数体字符串形式

### == 

判断流程：

1. 如果一个操作值为布尔值，则在比较之前先将其转换为数值
2. 如果一个操作值为字符串，另一个操作值为数值，则通过Number()函数将字符串转换为数值
3. 如果一个操作值是对象，另一个不是，则调用对象的valueOf()方法，得到的结果按照前面的规则进行比较
4. null与undefined是相等的
5. 如果一个操作值为NaN，则相等比较返回false
6. 如果两个操作值都是对象，则比较它们是不是指向同一个对象

### JS运行

- 语法分析
- 预编译
- 解释执行

### 预编译

- 创建AO
- 找形参和变量声明，将变量和形参名作为AO属性名，值为undefined.
- 形参实参相统一
- 函数体里找函数声明 提升最前
- 赋值于函数体，执行

### 作用域和作用域链

每个函数是一个对象，有一个[[scope]]属性不可访问，就是函数的作用域，存储了函数执行上下文的集合

**执行期上下文**： 当函数执行时，会创建一个称为执行期上下文的内部对象（AO）。一个执行期上下文定义了一个函数执行时的环境，函数每次执行时对应的执行期上下文都是独一无二的，所以多次调用一个函数会导致创建多个执行期上下文，当函数执行完毕，它所产生的执行上下文被销毁。

**作用域链**

`[[scope]]`中所存储的执行期上下文对象的集合，这个集合呈链式链接，我们称这种链式链接为作用域链。查找变量时，要从作用域链的顶部开始查找。Activation Object（AO）到Global Object（GO）。

### 闭包

闭包 = 函数+ 可访问的自由变量

自由变量：既不是函数参数也不是函数内部变量的变量

闭包存在时，即内部函数保留了对外部变量的引用时，这个作用域链就不会被销毁，此时内部函数依旧可以访问其所在的外部函数的变量，这就是闭包。

闭包解决：立即执行函数、let

闭包用途：封装私有变量

### 实现一个foo函数，返回自身调用次数：（实质：考闭包）

```js
a = foo()
b = foo()
c = foo()
// 此时 a===1, b===2, c===3
foo.reset()
d = foo()
// d===1

var helper = function() {
  let count = 0
  var fn = function() {
    count++
    return count
  }
  fn.reset = function() {
    count = 0
  }
  return fn
}
let foo = helper()
```

### 作用域与变量声明提升

 - 在 JavaScript 中，函数声明与变量声明会被 JavaScript 引擎隐式地提升到当前作用域的顶部 
 - 声明语句中的赋值部分并不会被提升，只有名称被提升
 - 函数声明的优先级高于变量，如果变量名跟函数名相同且未赋值，则函数声明会覆盖变量声明
 - 如果函数有多个同名参数，那么最后一个参数（即使没有定义）会覆盖前面的同名参数

### new 发生了什么

```js
function myNew(func,...args){
    let obj = Object.create(func.prototype)//原型
    let res = fun.apply(obj,args)//初始化对象属性
    return res instanceof object ? res:obj//返回值
}
```

### 事件循环机制

JS主要目的是用来操作Dom。因此单线程特性是为了防止，假定一个线程在某个DOM添加内容，另一个线程删除这个节点，浏览器就不知道该听谁的。为了避免复杂性，JS一直是单线程。

为了利用多核CPU的计算能力。H5提出微博Web Worker，允许JS脚本创建多个线程，但子线程完全受主线程控制，且不的操作DOM。所以并没有改变JS单线程的特性。

#### 事件循环

- JS分为同步任务和异步任务。同步的进入主线程，形成一个执行栈，异步的进入**Event Table** 并注册函数。
- 当指定的事情完成时，**Event Table**会将这个函数移入**Event Queue**。
- 主线程内的任务执行完毕为空，会去**Event Queue**读取对应的函数，进入主线程执行。
- 上述过程会不断重复，也就是常说的Event Loop(事件循环)。

#### 异步任务

- setTimeout、setInterval
- DOM事件
- Promise、async

宏任务：包括script(整体代码)、setTimeout、setInterval、I/O、UI交互事件、postMessage、MessageChannel、setImmediate(Node.js 环境)

**在一个(macro)task执行结束后，在下一个(macro)task 执行开始前，对页面进行重新渲染 **保证有序执行

微任务：在当前宏任务执行完执行的任务。包括Promise.then、process.nextTick(Node.js 环境)、MutaionObserver

#### 执行机制

*   执行一个宏任务（栈中没有就从事件队列中获取）
*   执行过程中如果遇到微任务，就将它添加到微任务的任务队列中
*   宏任务执行完毕后，立即执行当前微任务队列中的所有微任务（依次执行）
*   当前宏任务执行完毕，开始检查渲染，然后GUI线程接管渲染
*   渲染完毕后，JS线程继续接管，开始下一个宏任务（从事件队列中获取）

#### 注意的点

- promise立即执行，async立即执行
- promise.then()是微任务
- await是让出一个线程标志，关键字后面的表达式执行，将后面的代码段放入微任务中，跳出async函数执行后面的代码。

### 原型链与继承

#### 创建对象的方法

- ```js
  let o ={
      name:'mike'
  }
  ```

- ```js
  //构造函数
  var M = function(){this.name='mike'}
  var o = new M()
  ```

- ```js
  Object.create()
  ```

#### 原型

对象的`__proto__`为原型。

当函数对象作为构造函数创建实例，实例`__proto__`将指向函数对象的`prototype`

#### 原型链

`__proto__`连成的链叫原型链。

实例在查找变量和方法时，首先在自己的对象上找，没有时，沿着对象的`__proto__`向上查找

注意： 函数才有prototype，实例对象只有有`__proto__`， 而函数有的`__proto__`是因为函数是Function的实例对象

#### instanceof原理

判断实例对象的`__proto__`属性与构造函数的prototype是不是用一个引用。如果不是，他会沿着对象的`__proto__`向上查找的，直到顶端Object。

#### 判断对象是哪个类的直接实例

使用`对象.construcor`直接可判断

#### 类

类的声明

```js
// 普通写法
function Animal() {
  this.name = 'name'
}

// ES6
class Animal2 {
  constructor () {
    this.name = 'name';
  }
}
```

### 继承

#### 借用构造函数

```js
function father(){
    this.name='father'
}
function son(){
    father.call(this)
    this.name='son'
}
```

原理：将子类的this使用父类的this跑一遍

缺点： **father原型链上的属性和方法并不会被子类继承** 单纯拿到father的属性和方法

#### 原型链实现继承

```js
function father(){
    this.name='father'
}
function son(){
    this.name='son'
}
son.prototype = new father()
```

原理：将父类的实例赋给子类的prototype(原型对象)

缺点：**子类的所有实例保存的是同一个父类的值**（子类只进行了一次原型修改）

对子类实例进行值修改，若是原始类型，在实例上新建一个这样的值；若是引用类型，会去修改子类上唯一一个**父类实例**里面的这个引用类型，影响所有子类实例

#### 组合继承：构造函数＋原型链

```js
function father(){
    this.name = 'father'
}
function son(){
    father.call(this)
    this.name='son'
}
son.prototype = new father()
```

原理：使用构造函数可以继承写在父类构造函数中this上绑定的各属性和方法； 使用原型链可以继承挂载再父类原型上的属性和方法

缺点：  父类构造函数在子类构造函数中执行了一次，在子类绑定原型时又执行了一次

##### 优化1

避免原型链的重新执行

`son.prototype=father.prototype`

缺点：

 - **不能区分这个实例对象是Child的实例还是父类的实例对象**。因为原型上有一个属性为`constructor`，此时直接使用父类的prototype的话那么会导致 实例的constructor为Parent
 - **子类不可直接在prototype上添加属性和方法**，因为会影响父类的原型

注意：这个时候instanseof是可以判断出实例为Child的实例的，因为instanceof的原理是沿着对象的`__proto__`判断是否有一个原型是等于该构造函数的原型的。这里把Child的原型直接设置为了父类的原型，那么: **实例.`__proto__ `=== son.prototype === father.prototype**

##### 优化2：添加中间对象

```js
function father(){
    this.name = 'father'
}
function son(){
    this.name = 'son'
}
son.prototype = Object.create(father.prototype)
son.prototype.constrctor = son
```

Object.create()方法创建一个新对象，使用现有的对象来提供新创建的对象的`__proto__`

#### 原生封装一个继承

```js
function myExtends(father,son){
    let fT = function (){}
    fT.prototype = father.prototype
    son.prototype = new fT()
    son.prototype.constrctor = child
    return son
}
```

#### ES5/ES6除了写法外有什么区别

 - class 声明会提升，但不会初始化赋值。
 - class 声明内部会启用严格模式。
 - class 的所有方法（包括静态方法和实例方法）都是不可枚举的。
 - class 的所有方法（包括静态方法和实例方法）都没有原型对象 prototype，所以也没有[[construct]]，不能使用 new 来调用。
 - 必须使用 new 调用 class。
 - class 内部无法重写类名。

## 作用与相关问题

下面的代码打印什么？为什么

```js
var b =10
var c = function b(){
    b=20
    console.log(b)//这个名字只在新定义函数作用域内有效
}
c()
//打印b的函数体
```

函数表达式声明，会在内部创建一个同名不可写属性，只在该函数内有效。函数声明则不会

```js
b = function c() {
    a = 1; 
    b = 2;
    c = 3;//不可写 
};
b();
console.log(a);    //1
console.log(b);    //2
console.log(c);   // Uncaught ReferenceError: c is not defined
```



简单改造下面的代码使之分别打印10和20

```js
var b = 10;
(function b(){
    b=20
    console.log(b)
})()
```

```js
var b = 10;
(function b(){
    b = 20
    console.log(window.b)//10
})()
```

```js
var b = 10;
(function b(){
    var b=20
    console.log(b)
})()
```

#### 总结一下

- 函数表达式声明，会在内部创建一个同名不可写属性，指向该函数并且只在该函数内有效。赋值无效
- 不加`var`声明的变量挂载在window上

var变量提升

```js
var name = 'Tom';
(function() {
if (typeof name == 'undefined') {
  var name = 'Jack';//这里提升了
  console.log('Goodbye ' + name);
} else {
  console.log('Hello ' + name);
}
})();
// 'Goodbye Jack'
```

###  函数参数

- 非严格模式，arguments对象和 **实参** 保持同步。

- 严格模式， arguments和参数则不会保持同步。只和**传入的参数**相同

  

  ### 默认参数

  - 不传或者手动传递undefined都会使用默认的参数。

  - 形参列表里的参数，都相当于使用let声明的一样(意味着存在TDZ)
  - 默认参数可以是形参列表里的变量，但不可以是函数体内的变量
  - 默认参数，说明当前使用的ES6，所以当前scope都是处于strict模式下的

### 无名参数（即...args）一些注意的点：
* arguments中只存储传入的参数

* fn.length则是命名参数的个数，也就是说fn的length属性是不包括args中的参数

  函数按值传递
  参数如果是基本类型是按值传递，如果是引用类型按共享传递。

> 共享传递:传递**对象的引用的**副本，即引用的拷贝

### 函数没有重载
因为没有函数签名，可提升

### 箭头函数与普通函数区别
* 没有this arguments 这些东西取决于最近一层非箭头函数
* 不能使用new调用，没有[[construct]]内部方法
* 没有prototype

###  闭包
闭包＝函数![img](file:///C:\Users\张银鸽\AppData\Local\Temp\4I`MDUI8B2C]KU_[AI$HZ_Y.png)可访问的自由变量

> 自由变量:既不是函数参数，也不是函数内部变量的变量

Js中基本类型存在栈中，引用类型存在堆中。但在闭包中例外，它的所有变量存在堆中

### 事件流
事件流描述的是**从页面中接收事件的顺序**。
事件冒泡是由最具体的元素逐级向上传播到document上。
事件捕获是从document向目标处传播。意义在于可以在到达预定目标之前捕获它。
DOM事件流分为事件捕获阶段，处于目标阶段，事件冒泡阶段。

### Promise

`Promise` 翻译过来就是承诺的意思，这个承诺会在未来有一个确切的答复，并且该承诺有三种状态，这个承诺一旦从等待状态变成为其他状态就永远不能更改状态了。

 - 等待中（pending）
 - 完成了（resolved）
 - 拒绝了（rejected）

当我们在构造 Promise 的时候，构造函数内部的代码是立即执行的。

```js
new Promise((resolve, reject) => {
  console.log('new Promise')
  resolve('success')
})
console.log('finifsh')

// 先打印new Promise， 再打印 finifsh
```

Promise实现链式调用，是因为每次调用then之后返回一个全新的Promise，如果在then中使用了return，则会被Promise.resolve包装