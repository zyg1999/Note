递归版
```js
function flat(arr) {
  let res = []
  for (i in arr) {
    if (Array.isArray(arr[i])) {
      res = res.concat(flat(arr[i]))//!!
    } else {
      res.push(arr[i])
    }
  }
  return res
}
```
reduce简化
```js
function flat(arr) {
  return arr.reduce(
    (prev, cur) =>
      Array.isArray(cur) ? prev.concat(flat(cur)) : prev.concat(cur),
    []
  )
}
```

