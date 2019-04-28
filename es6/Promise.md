### Promise出现原因
在 Promise 出现前，处理一个异步网络请求如下：
```js
请求1(function(请求结果1){
    处理请求结果1
})
```
若后一步处理总依赖上一步，需求很大如下：
```js
请求1(function(请求结果1){
    请求2(function(请求结果2){
        请求3(function(请求结果3){
            请求4(function(请求结果4){
                请求5(function(请求结果5){
                    ...
                })
            })
        })
    })
})
```
这便是臭名昭著的回调地狱。<br>
这样一来，在处理越多的异步逻辑时，就需要越深的回调嵌套，这种编码模式的问题主要有以下几个：
- 代码臃肿。
- 可读性差。
- 耦合度过高，可维护性差。
- 代码复用性差。
- 容易滋生 bug。
### Promise
Promise对象是一个构造函数，用来生成Promise实例。Promise构造函数接受一个函数作为参数，该函数的两个参数分别是resolve和reject。它们是两个函数，由 JavaScript 引擎提供，不用自己部署。

Promise实例生成以后，可以用then方法分别指定resolved状态和rejected状态的回调函数。
### Promise 生命周期
每个 Promise 都会经历一个短暂的生命周期：先是处于进行中（pending）的状态，此时操作并未完成，所以也是未处理（unsettled）的。当函数返回Promise时它变为pending（进行中）状态，操作结束后，Promise可能会进入下面两个状态中的其中一个：
- fulfilled:Promise异步操作成功完成。
- rejected：由于程序错误或其他原因，表示Promise异步操作未能成功完成。

内部属性[[PromiseState]]被用来表示Promise的3种状态："pending"、"fulfilled"和"rejected"。这个属性不暴露在promise对象上，只有当Promise状态改变时，通过then()方法采取特定行动。

**Promise都有then()方法**：
- 参数：第一个参数是fulfilled状态的回调函数；第二个参数（可选）是rejected状态的回调函数。

```js
//简单例子
function timeout(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms, 'done');
  });
}

timeout(100).then((value) => {
  console.log(value);
});
```
timeout方法返回一个Promise实例，表示一段时间以后才会发生的结果。过了指定的时间（ms参数）以后，Promise实例的状态变为resolved，就会触发then方法绑定的回调函数。
### 创建未完成的Promise
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;用 Promise 构造函数可以创建新的 Promise，构造函数只接受一个参数：包含初始化 Promise 代码的执行器函数。执行器函数接受两个参数：resolve()函数和reject()函数。执行器成功完成时调用resolve()函数，失败时调用reject()函数。
> 创建未处理的 Promise 最好用 Promise 的构造函数，因为Promise执行器具有动态性。
- Promise 的执行器会立即执行，然后才执行后续流程中的代码。
```js
let promise = new Promise(function(resolve, reject) {
  console.log('Promise');
  resolve();
});
console.log('Hi!');

// Promise
// Hi!
```
- Promise完成处理程序和拒绝处理程序总是在执行器完成后被添加到任务队列的末尾。then方法指定的回调函数，将在当前脚本所有同步任务执行完才会执行，所以resolved最后输出。
```js
let promise = new Promise(function(resolve, reject) {
  console.log('Promise');
  resolve();
});

promise.then(function() {
  console.log('resolved.');
});

console.log('Hi!');

// Promise
// Hi!
// resolved
```

- 调用resolve或reject以后，Promise 的使命就完成了，后继操作应该放到then方法里面，而不应该直接写在resolve或reject的后面。所以，最好在它们前面加上return语句，这样就不会有意外。
```js
new Promise((resolve, reject) => {
  return resolve(1);
  // 后面的语句不会执行
  console.log(2);
})
```
### 创建已处理的Promise
- 使用Promise.resolve()
Promise.resolve() 方法之接收一个参数并返回一个完成态的Promise，即不会有任务编排的过程，而且需要向Promise添加一至多个完成处理程序获取值。
```js
let promise = Promise.resolve(42);
promise.then(function(value){
    console.log(value);//42
});
```
该代码创建一个已完成Promise，完成处理程序的形参 value 接受了传入值42，由于该Promise永远不会存在拒绝状态，因而拒绝处理程序永远不会被调用。
- 使用Promise.reject()
```js
let promise = Promise.reject(42);

promise.catch(function(value){
    console.log(value);//42
})
```
> 如果向Promise.resolve()方法或Promise.reject()方法传入一个Promise，这个Promise会被直接返回。
- 非Promise的Thenable对象

**拥有then()方法并且接受resolve和reject这两个参数的普通对象就是非Promise的Thenable对象**
```js
let thenable = {
      then: function(resolve, reject) {
        resolve(42);
      }
    };

let p1 = Promise.resolve(thenable);
p1.then(function(value){
    console.log(value);//42
});
```
在上面代码中，Promise.resolve()调用的是 thenable.then(),所以Promise的状态可以被检测到。由于then()方法内部调用了resolve(42),所以thenable对象的Promise对象的状态是已完成。新创建的已完成的promise p1从thenable对象接受传入的值（42），p1的完成处理程序将42赋值给形参value。
### 执行器错误
若执行器内部抛出一个错误，Promise 的拒绝处理程序就会被调用。每个执行器都隐含一个try-catch块，所以错误会被捕获并传入拒绝处理程序。
```js
let promise = new Promise(function(resolve,reject){
    try{
        throw new Error('Explosion');
    }catch(ex){
        reject(ex);
    }
    
});
promise.catch(function(error){
    console.log(error.message);//"Explosion"
});
```
为了简化这种常见的用例，执行器会捕获所有抛出的错误，但只有当拒绝处理程序存在时才会记录执行器中抛出的错误，否则错误会被忽略掉。
### 串联的Promise
每次调用then()方法或catch()方法时实际上创建并返回了一个promise，只有当第一个promise完成或被拒绝后，第二个才会被解决。
```js
let p1 = new Promise(function(resolve,reject) {
  resolve(42);
});
p1.then(function(value){
  console.log(value);
}).then(function(){
  console.log("Bingo")
});
//42
//Bingo
```
将其拆解开，如同下面这样：
```js
let p1 = new Promise(function(resolve,reject) {
  resolve(42);
});
let p2=p1.then(function(value){
    console.log(value);
});

p2.then(function(){
    console.log("Bingo");
});
```
在非串联版本中，调用p1.then()的结果被存储在了p2中，然后p2.then()被调用来添加最终完成处理程序。同理调用p2.then()返回的也是一个Promise，只是在实例中并未使用。
### Promise 链的返回值
Promise 链可以给下游Promise传递数据。如果在完成处理程序中指定一个返回值，则可以沿着这条连传递数据。
```js
let p1 = new Promise(function(resolve,reject){
  resolve(42);
});
p1.then(function(value){
  console.log(value);//42
  return value+1;
}).then(function(value){
  console.log(value);//43
});
```
在拒绝处理程序中同样也可以做相同的事情。
```js
let p1 = new Promise(function(resolve,reject){
  reject(42);
})
p1.catch(function(value){
  console.log(value);//42
  return value+1;
}).then(function(value){
  console.log(value);//43
})
```
> 在必要时，即使其中一个Promise失败也能恢复整条链的执行。

### 在Promise中返回Promise
```js
let p1 = new Promise(function(resolve,reject){
  resolve(42);
});
let p2 = new Promise(function(resolve,reject){
  resolve(43);
});
p1.then(function(value){
  //第一个完成处理程序
  console.log(value);//42
  return p2;
}).then(function(value){
  //第二个完成处理程序
  console.log(value);//43
})
```
在这段代码中，p1编排任务解决并传入42，然后p1的完成处理程序返回一个以解决状态的p2,由于p2已经被完成，因此第二个完成处理程序被调用；如果p2被拒绝，则调用拒绝处理程序。

**需要注意的是：第二个完成处理程序被添加到了第三个Promise上。** 所以上面代码等价于下列代码：
```js
let p1 = new Promise(function(resolve,reject){
  resolve(42);
});
let p2 = new Promise(function(resolve,reject){
  resolve(43);
});
let p3 = p1.then(function(value){
  //第一个完成处理程序
  console.log(value);//42
  return p2;
})
p3.then(function(value){
  //第二个完成处理程序
  console.log(value);//43
})
```
> 这虽然是一个细小的点，但非常重要。若p2被拒绝，那么第二个完成处理程序将不会被调用。

在完成或拒绝处理程序中返回Thenable对象不会改变Promise执行器的执行时机，先定义的Promise的执行器先执行，后定义的后执行。在完成处理程序中创建新的Promise可以推迟完成处理程序的执行。

如果需要在一个Promise被解决后触发一个Promise,那么这个模式很适合。
```js
let  p1=new Promise(function(resolve,reject){
   resolve(42);
});
p1.then(function(value){
console.log(value);//42

//创建一个新的Promise
let p2 = new Promise(function(resolve,reject){
 resolve(43);
});

return p2;
}).then(function(value){
  console.log(value);//43
})
```
### 响应多个Promise
#### Promise.all()
Promise.all方法用于将多个 Promise 实例，包装成一个新的 Promise 实例。

`const p = Promise.all([p1, p2, p3]);`

Promise.all方法只接受一个数组作为参数，p1、p2、p3都是 Promise 实例，如果不是，就会先调用下面讲到的Promise.resolve方法，将参数转为 Promise 实例，再进一步处理。（Promise.all方法的参数可以不是数组，但必须具有 Iterator 接口，且返回的每个成员都是 Promise 实例。）

p的状态由p1、p2、p3决定，分成两种情况。
- 只有p1、p2、p3的状态都变成fulfilled，p的状态才会变成fulfilled，此时p1、p2、p3的返回值组成一个数组，传递给p的回调函数。

- 只要p1、p2、p3之中有一个被rejected，p的状态就变成rejected，此时第一个被reject的实例的返回值，会传递给p的回调函数。
- 如果作为参数的 Promise 实例，自己定义了catch方法，那么它一旦被rejected，并不会触发Promise.all()的catch方法。
#### Promise.race()
Promise.race方法同样是将多个 Promise 实例，包装成一个新的 Promise 实例。

`const p = Promise.race([p1, p2, p3]);`

只要p1、p2、p3之中有一个实例率先改变状态，p的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给p的回调函数。

Promise.race方法的参数与Promise.all方法一样，如果不是 Promise 实例，就会先调用下面讲到的Promise.resolve方法，将参数转为 Promise 实例，再进一步处理。
### Promise.resolve() 
有时需要将现有对象转为 Promise 对象，Promise.resolve方法就起到这个作用。

Promise.resolve方法的参数分成四种情况。
- 参数是一个 Promise 实例
如果参数是 Promise 实例，那么Promise.resolve将不做任何修改、原封不动地返回这个实例
- 参数是一个thenable对象
Promise.resolve方法会将这个对象转为 Promise 对象，然后就立即执行thenable对象的then方法。
- 参数不是具有then方法的对象，或根本就不是对象
如果参数是一个原始值，或者是一个不具有then方法的对象，则Promise.resolve方法返回一个新的 Promise 对象，状态为resolved。
- 不带有任何参数
Promise.resolve()方法允许调用时不带参数，直接返回一个resolved状态的 Promise 对象。

  - 立即resolve()的 Promise 对象，是在本轮“事件循环”（event loop）的结束时执行，而不是在下一轮“事件循环”的开始时。
  ```js
    setTimeout(function () {
      console.log('three');
    }, 0);
    
    Promise.resolve().then(function () {
      console.log('two');
    });
    
    console.log('one');
    
    // one
    // two
    // three
  ```
  setTimeout(fn, 0)在下一轮“事件循环”开始时执行，Promise.resolve()在本轮“事件循环”结束时执行，console.log('one')则是立即执行，因此最先输出。
#### Promise.reject()
Promise.reject(reason)方法也会返回一个新的 Promise 实例，该实例的状态为rejected。
```js
const thenable = {
  then(resolve, reject) {
    reject('出错了');
  }
};

Promise.reject(thenable)
.catch(e => {
  console.log(e === thenable)
})
// true
```
Promise.reject()方法的参数，会原封不动地作为reject的理由，变成后续方法的参数。这一点与Promise.resolve方法不一致。
