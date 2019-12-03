### promise

Promise` 翻译过来就是承诺的意思，这个承诺会在未来有一个确切的答复，并且该承诺有三种状态，这个承诺一旦从等待状态变成为其他状态就永远不能更改状态了。

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

Promise 实现了链式调用，也就是说**每次调用 then 之后返回的都是一个全新的 Promise**，原因也是因为状态不可变。如果你**在 then 中 使用了 return，那么 return 的值会被 Promise.resolve() 包装**。

### promise 用法
#### **构造实例**
- 接收一个函数作为参数，这个函数有两个函数参数。分别将promise从pending改为成功/失败状态。js引擎提供，不需自己部署。
```js
const promise = new Promise(function(resolve, reject) {})
```
#### **`then(function(value){},function(err){})`**
- then方法接收两个函数（第二个可选），分别为resolve和reject状态的回调函数
- 这两个函数都接受promise传出的值作为参数
- **then方法返回的是一个新的Promise实例**。因此可采用链式写法，前一个状态改变，才会进到下一个
```js
const promise = new Promise(function(resolve, reject) {
  resolve(1)
})
promise.then(
  function(value) {
    console.log(value)
  },
  function(err) {
    console.log(err)
  }
)
```
#### `catch`
- 接受一个函数，用于指定发生错误时（then方法指定回调运行抛错及reject）的回调函数。
- 错误具有“冒泡”性质，错误总是会被下一个catch语句捕获
- 该方法返回一个promise
> 建议不要在then方法里面定义 Reject 状态的回调函数（即then的第二个参数），总是使用catch方法。如下
```js
promise
  .then(function(data) { //cb
    // success
  })
  .catch(function(err) {
    // error
  });
```
#### promise链中返回promise
```js
const p1 = new Promise(function(resolve, reject) {
  resolve(1)
})
const p2 = new Promise(function(resolve, reject) {
  resolve(2)
})

p1.then(function(value) {
  console.log(value)
  return p2
}).then(function(value) {
  console.log(value)
})
//上面第二段等同于
const p3 = p1.then(function(value) {
  console.log(value)
  return p2
})
p3.then(function(value) {
  console.log(value)
})
```
> p1、p2是同时开始异步的

若要在一个promise被解决后再触发一个promise,如下
```js
const p1 = new Promise(function(resolve, reject) {
  resolve(1)
})
p1.then(function(value) {
  console.log(value)
  const p2 = new Promise(function(resolve, reject) {
    reject(2)
  })
  return p2
}).then(function(value) {
  console.log(value)
})
```
### 响应多个promise
#### promise.all
`const p = Promise.all(p1,p2,p3)`
- 接受一个数组，当数组所有promise实例都完成后，才会解决返回的promise
    - 当数组所有`promise`实例都变为`resolve`，p才会变为`resolve`
    - 当数组中有一个为`reject`，p会变为`reject`
- 返回一个promise
#### promise.race
和promise的区别在于，数组中若有一个变为`resolve`，则返回的promise就被解决。