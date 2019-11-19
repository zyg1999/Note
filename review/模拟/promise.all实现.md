### promise.all

Promise.all 接收一个 promise 对象的数组作为参数，当这个数组里的所有 promise 对象全部变为resolve或 有 reject 状态出现的时候，它才会去调用 .then 方法,它们是并发执行的。

### 特点

1. 接收一个 Promise 实例的数组或具有 Iterator 接口的对象，
2. 如果元素不是 Promise 对象，则使用 Promise.resolve 转成 Promise 对象
3. 如果全部成功，状态变为 resolved，返回值将组成一个数组传给回调
4. 只要有一个失败，状态就变为 rejected，返回值将直接传递给回调
   all() 的返回值也是新的 Promise 对象

### 代码实现

```js
function promiseAll(promises) {
  return new Promise(function(resolve, reject) {
    if (!Array.isArray(promises)) {
      return reject(new Error('Promises must be an array'))
    }
    let resolveCount = 0
    let promiseLen = promises.length
    let resolveValue = []
    for (let i = 0; i < promiseLen; i++) {
      Promise.resolve(
        promises[i].then(
          value => {
            resolveValue[i] = value
            resolveCount++
            if (resolveCount === promiseLen) return resolveValue
          },
          err => {
            return reject(err)
          }
        )
      )
    }
  })
}
```

