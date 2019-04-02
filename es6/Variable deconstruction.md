### 为什么要进行解构？我们以对象解构进行举例
我们在开发中常常遇到，从对象中提取数据的需求，如下：
```js
let options={
  repeat:true,
  save:false
};
let repeat = options.repeat;
let save = options.save;
```
这样的数据提取，在数据量小的时候，还比较方便，那么数据量特别大时呢？若还有嵌套信息呢？es6新增解构就可以很容易解决掉这个问题。
```js
let options={
  repeat:true,
  save:false
};
let {repeat,save}=options;
//此处是变量声明时进行解构，也可先声明再给变量赋值
//let repeat;
//let save;
//({repeat,save}=options)；
console.log(repeat);//true
console.log(save);//false
```
> 若使用var、let、const进行解构声明变量时，必须进行初始化。
>
>函数传参时，也可以用。
> 在第二种写法下，那对圆括号是必须的吗？是的，js引擎将一对开放的花括号视为一个代码块，代码块语句不允许出现在赋值语句左侧，添加小括号后就会转化为一个表达式。

**默认值**
在解构时，指定的属性不存在时，解构后是undefined。
```js
let {repeat2,save}=options;
console.log(repeat2,save);//undefined false

let {repeat,save,value}=options;
console.log(repeat2,save,value);//true false undefined
```
我们可以定义默认值，但只有当对象上无该属性或属性值为undefined时，默认值才生效。如下
```js
let {repeat,save,value=true}=options;
console.log(repeat2,save,value);//true false true
```
**为非同名局部变量赋值**
在上面的例子中，我们解构赋值使用的都是与对象属性名同名的局部变量，下面我们来看非同名的例子。
```js
let options={
  repeat:true,
  save:false
};
let {repeat:localRepeat,save:localSave}=options;
console.log(localRepeat,localSave);//true false
```
当然，也可以添加默认属性
```js
let options={
  repeat:true,
  save:false
};
let {repeat:localRepeat,save:localSave,name:localName='zyg'}=options;
console.log(localRepeat,localSave,localName);//true false "zyg"
```
**嵌套对象解构**
```js
let node={
    type:'Identifier',
    name:'mike',
    loc:{
        start:{
            line:1,
            column:1
        },
        end:{
            line:1,
            column:2
        }
    }
};
let {loc:{start}}=node;
console.log(start.column,start.line);//1 1
```
在此例中，所有冒号前的标识符都代表在对象中的检索位置，其右侧为被复制的变量名；若冒号后是花括号，则意味要赋予的最终值嵌套在对象内部更深的层级中。

若不想用对象默认的属性名进行解构可以进行下列操作
```js
//只展示了不同部分
let {loc:{start:localStart}}=node;
console.log(localStart.column,localStart.line);//1 1
```
### 数组解构
通过值在数组中的位置进行选取，可存储在任意变量中，在这个过程中，数组本身不会发生任何变化。
```js
let colors=["red","green","blue"]
let [firstColor,secondColor]=colors;
console.log(firstColor,secondColor);//"red" "green"
```
**部分解构**
```js
let colors=["red","green","blue"]
let [,,thirdColor]=colors;//逗号是占位符
console.log(thirdColor);//"blue"
```
> 在使用 var let const 数组解构绑定时，必须初始化。

**变量交换**
在es5中，我们交换变量需要引入一个中间变量，但是利用数组解构可省去中间变量。
```js
let a=1,
    b=2;
[a,b]=[b,a];
console.log(a,b);//2 1
```
> 若右侧为null或undefined会报错。

**默认值**
```js
let colors=["red"]
let [firstColor,secondColor="blue"]=colors;
console.log(firstColor,secondColor);//red blue
```
**嵌套数组解构**
```js
let colors=["red",["green","yellow"],"blue"];
let [firstColor,[secondColor]]=colors;
console.log(firstColor,secondColor);//"red" "green"
```
**不定元素**
```js
let colors=["red","green","blue"]
let [firstColor,...restColor]=colors;//逗号是占位符
console.log(firstColor,restColor);//"red" ["green", "blue"]
```
**利用不定元素进行数组克隆**
```js
//es6
let arr=[1,2,3,4,5];
let [...numsArr]=arr;
console.log(numsArr);
//es5 数组克隆写法
let numsArr=arr.concat();
```
> 不定元素必须是最后一个条目。

### 混合解构
```js
let node={
    type:'Identifier',
    name:'mike',
    loc:{
        start:{
            line:1,
            column:1
        },
        end:{
            line:1,
            column:2
        }
    },
    range:[1,2]
};
let {
    loc:{start},
    range:[startNum]
}=node;
console.log(start.line,start.column,startNum);
```
### 解构参数
定义一个大量可选参数函数时，常常用对象传入，但只看函数声明，无法辨识函数预期参数。这时，利用解构参数就十分明了了。
```js
function setCookie(name,value,{secure,path,domain,expires}){
    //设置cookie
}
setCookie("type","js",{
    secure:true,
    expires:60000
})
```
**若想实现参数可选，可以这么改**
```js
function setCookie(name,value,{secure,path,domain,expires}={}){
    //设置cookie
}
```
**解构参数的默认值**
```js
const setCookieDefaults={
    secure:false,
    path:"/",
    domain:"example.com",
    expires:new Date(Date.now()+360000000)
}
function setCookie(name,value,
    {
        secure=setCookieDefaults.secure,
        path=setCookieDefaults.path,
        domain=setCookieDefaults.domain,
        expires=setCookieDefaults.expires
    }
){
    //设置cookie
}
```