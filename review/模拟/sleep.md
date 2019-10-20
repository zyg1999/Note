### promise + async await
```js
function sleep(ms, i) {
  return new Promise(resolve => {
    setTimeout(() => resolve(i), ms)
  })
}
async function start() {
  //async表示函数里有异步操作，await表示紧跟在后面的表达式需要等待结果。async函数的返回值是 Promise 对象
  for (let i = 0; i < 6; i++) {
    let result = await sleep(1000, i)
    console.log(result)
  }
}
start()
```