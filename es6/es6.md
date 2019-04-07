es6兼容性——IE10+、Chrome、Firefox、移动端、nodejs
## 编译转换
1.在线转换
2.提前编译（推荐）
browser.js
- 在线编译
```js
<script src="browser.js" charset="utf-8"></script>
<script type="text/bable">
```
## 新特性
1. 变量
2. 函数
3. 数组
4. 字符串
5. 面向对象
6. Promise
7. generator//把同步拆成异步
8. 模块化

## 变量
- var 缺陷
  - 可重复声明
  - 无法限制修改
  - 没有块级作用域
- let
  - 不能重复声明
  - 变量，可修改
  - 块级作用域
- const
  - 不能重复声明 
  - “常量”（引用），可修改
  - 块级作用域
## 箭头函数
1.如果只有一个参数，（）可以省
2.如果只有一个return，{}可以省
```js
let arr=[12,5,7,92,35]
arr.sort(function(x,y){
    return x-y;
})

arr.sort((x,y)=>{
    return x-y;
});

alert(arr);
```
> 注意：this指向:函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象。

```js
function Timer(){
        this.s1 = 0;
        this.s2 = 0;
        //箭头函数
        setInterval(()=>this.s1++,1000);
        //普通函数
        setInterval(function(){
            this.s2++;
        },1000);

    }

    let timer = new Timer();

    setTimeout(()=>console.log('s1:',timer.s1),3000);
    setTimeout(()=>console.log("s2:",timer.s2),3000);
```
如上面代码所示，前者的this绑定定义时所在的作用域（即Timer函数），后者的this指向运行时所在的作用域（即全局对象）。所以，3100 毫秒之后，timer.s1被更新了 3 次。

## 函数参数
1.参数扩展、数组展开
 - 收集剩余参数
 ```js
 function show(a,b,...args){}//args必须是最后一个
 ```
 - 展开数组
 ```js
  let arr1 = [1,2,3];
  let arr2 = [4,5,6];
  
  lat arr =[...arr1,...arr2];
  alert(arr);//1,2,3,4,5,6
 ```
2.默认参数
```js
function show(a,b=12,c=5){
    console.log(a,b,c);
}

show(99);//99,12,5
show(99,15,6);//99,15,6
```