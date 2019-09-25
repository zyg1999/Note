- 作为对象调用时，指向该对象 
```js
obj.b(); // 指向obj 
```
- 作为函数调用
```js
var b = obj.b; b(); // 指向全局window
```
- 作为构造函数调用
```js
var b = new Fun(); // this指向当前实例对象 
```
- 作为call与apply调用 
```js
obj.b.apply(object, []); // this指向当前的object
```

### 普通函数 VS 箭头函数

写法上的区别
箭头函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象。
箭头函数不可以当作构造函数，也就是说，不可以使用new命令，否则会抛出一个错误。
不可以使用arguments对象，该对象在函数体内不存在。如果要用，可以用 rest 参数代替。
不可以使用yield命令，因此箭头函数不能用作 Generator 函数。