### this的指向有哪几种情况？

this代表函数调用相关联的对象，通常页称之为执行上下文。

1. 作为函数直接调用，非严格模式下，this指向window，严格模式下，this指向undefined；
2. 作为某对象的方法调用，this通常指向调用的对象。
3. 使用apply、call、bind 可以绑定this的指向。
4. 在构造函数中，this指向新创建的对象
5. 箭头函数没有单独的this值，this在箭头函数创建时确定，它与声明所在的上下文相同。

### 多次bind,上下文是什么？

```js
let a = {}
let fn = function () { console.log(this) }
fn.bind().bind(a)()//window
```

不管我们给函数 bind 几次，fn 中的 this 永远由第一次 bind 决定，所以结果永远是 window。

### 多个this规则出现，this指向哪里？

优先级如下

**new > bind/call/apply >   隐式绑定（即对象调方法）> 默认绑定（即严格undefined，非严格window）**