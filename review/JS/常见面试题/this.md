### 看代码说输出结果

#### 例1：

```js
function Foo() {
  getName = function() {
    console.log(1)
  }
  return this
}
Foo.getName = function() {
  console.log(2)
}
Foo.prototype.getName = function() {
  console.log(3)
}
var getName = function() {
  console.log(4)
}

function getName() {
  console.log(5)
}

//请写出以下输出结果：
Foo.getName() //-> 2    Foo对象上的getName() ，这里不会是3，因为只有Foo的实例对象才会是3，Foo上面是没有3的
getName() //-> 4    window上的getName，console.log(5)的那个函数提升后，在console.log(4)的那里被重新赋值
Foo().getName() //-> 1    在Foo函数中，getName是全局的getName，覆盖后输出 1
getName() //-> 1    window中getName();
new Foo.getName() //-> 2    Foo后面不带括号而直接 '.'，那么点的优先级会比new的高，所以把 Foo.getName 作为构造函数
new Foo().getName() //-> 3    此时是Foo的实例，原型上会有输出3这个方法
```

#### 例2

```js
function a() {
  this.b = 3 //this指向window
}
a.prototype.b = 7
var t = new a() //new之后this指向实例
var b = 2 //在这一步,b被替换为2
a() //执行a后b变为3
console.log(t.b) //3
console.log(b) //3
```

### 例3

 以最小的改动解决以下代码的错误 

```js
const obj = {
name: " jsCoder",
skill: ["es6", "react", "angular"],
say: function () {
 for(var i = 0, len = this.skill.length; i< len; i++){
   setTimeout(function(){
     console.log('No.' + i + this.name);
     console.log(this.skill[i]);
     console.log('--------------------------');
   }, 0);
   console.log(i);
 }
}
};
obj.say();
```

![]( https://uploadfiles.nowcoder.com/images/20191107/5097896_1573106521909_62B29BD26061B47E81ED3150A290E160 )

- 将`for`循环i的声明改为`let`
- 将`setTimeout`函数回调改为箭头函数`()=>{}`

###  实现ES5中Function原型的bind方法， 使得以下程序最后能输出'success' 

```js
function Animal(name, color) {
 this.name = name;
 this.color = color;
}
Animal.prototype.say = function () {
 return `I'm a ${this.color} ${this.name}`;
};
const Cat = Animal.bind(null, 'cat');
const cat = new Cat('white');
if (cat.say() === 'I\'m a white cat' && cat instanceof Cat && cat instanceof Animal) {
 console.log('success');
}
```

```js
Function.prototype.myBind = function(context = window, ...args1) {
  if (typeof this !== 'function') {
    throw TypeError('必须是函数调用')
  }
  const _this = this
  let fT = function(){}
  let fn = function(...args2) {
    return _this.apply(
      this instanceof fn ? this : context,
      args1.concat(args2)
    )
  }
  this.prototype ? (fT.prototype = this.prototype) : null
  fn.prototype = new fT()
  return fn
}
```

### 看代码说结果

```js
let a = {
  b: function() { 
    console.log(this) 
  },
  c: () => {
    console.log(this)
  }
}

a.b()   // a
a.c()   // window

let d = a.b
d()     //相当于window.d() window
```

### 看代码说结果

```js
var name1 = 1;

function test() {
	var name1 = 'kin';
	let a = {
		name1: 'jack',
		fn: () => {
      		var name1 = 'black'
      		console.log(this.name1)
    	}
   }
	return a;
}

test().fn() // ?
```

答案： 输出1 

因为fn处绑定的是箭头函数，箭头函数并不创建this，它只会从自己的作用域链的上一层继承this。这里它的上一层是test()，非严格模式下test中this值为window。 

 - 如果在绑定fn的时候使用了function，那么答案会是 'jack'

- 如果将test第一行name1前面的`var`去掉则，答案为kin