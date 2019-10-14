## reduce 
数组归并方法
- 参数1：函数`function(prev,cur,index,array)`
     - prev:前一个值
     - cur:当前值
     - index:当前索引(可选)
     - array:数组对象(可选)

**这个函数返回的任何值，都会作为第一参数自动传给下一次迭代**
- 参数2（可选）：归并基础值
## map
- 参数1：函数`function(cur,index,array)`
    - cur:当前值
    - index:当前索引(可选)
    - array:数组对象(可选)
- 参数2：thisValue

**明确map作用：对于数组中给定每一项，返回每次函数调用返回结果组成的数组**
### 模拟实现
```js
Array.prototype.myMap = function(handler) {
  return this.reduce((prev, cur, index) => {
    prev.push(handler.call(this, cur, index))//将每次结果push进数组
    return prev
  }, [])//提供初始值[]
}
```
## filter
- 参数1：函数`function(cur,index,array)`
    - cur:当前值
    - index:当前索引(可选)
    - array:数组对象(可选)
- 参数2：thisValue
**filter作用：检测数值元素，并返回符合条件所有元素的数组。**
### 模拟实现
```js
//在push时比map多了一层判断
Array.prototype.myFilter = function(handler) {
  return this.reduce((prev, cur, index) => {
    if (handler.call(this, cur, index)) {
      prev.push(cur)
    }
    return prev
  }, [])
}
```