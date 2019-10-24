### 利用ES5模拟set/map
Set、Map和数组、对象相似，都是集合，区别在于Set中的元素是唯一的，而数组中的元素可以重复。看看如何模拟
```js
let map = Object.create(null)
map[3]='some'
map[3]//"some"

//Object的key只能是string,所以数字5隐式转换为'5'
//若使用{}作为key，隐式转化为[object Object]
//不同{}标识的的值是同一个

let set=Object.create(null)
undefined
set['5']='hello'
set['5']//"hello"
```
Object模拟map set存在很多不便，ES6中引入无序列表。
### set
```js
/* 可以给构造函数中传入可迭代对象进行初始化：数组、set、map
 *  自动去重
 */
let set = new Set([2, 2, 3, 4])
set.add(/*要增加的值*/) //返回set
set.has(/*要检测的值*/) //返回布尔值
set.delete(/*要删除的值*/)//返回布尔值
set.size //元素数量
set.clear() //删除set中的所有值 无返回
```
遍历 `forEach`
```js
let arr = []
arr.forEach(function(item, index, arr) {
  //arr[index]===item
})

let obj = {
  name: 'Mike'
}
let set = new Set([1, 2, 3])
set.forEach(function(value, key, set) {
  console.log(value, key)
  console.log(this.name) //'Mike'
  // console.log(set[key])//undefined不能通过这样调用
}, obj)
```
Set的forEach和数组唯一不同的就是，Set不存在索引。
forEach第二个参数为callback中的this指向
### Set和Object/Array的区别
- 在Set中，不会对值进行隐式转换，数字5和字符串'5'、{}和{}都是作为两个截然不同并且独立的存在
- Set和数组一样都有forEach，唯一的区别就是forEach的第一个参数callback中的前两个值相同，可以理解成Set的key和value是一个东西。
- 在数组或者对象中，可以直接通过key（数组是index）来访问元素，但是Set中不行，如果需要可以将Set转换为数组(通过`Array.from(set)`或者`[...set]`)。
### weakSet
是一种特殊的set，区别如下：
- weakset只能接受**非原始值**作为元素
- 不可迭代
- 不支持`size forEach clear`等属性，只有`add has delete`
- 保存的对象是弱引用
> 弱引用：在引用对象的同时仍然允许对该对象进行垃圾回收

> 这意味Weak Set中保存的对象不在JavaScript引擎的GC考虑之中
### Map
set像数组，Map像对象。

Object 结构提供了“字符串—值”的对应，Map 结构提供了“值—值”的对应。
```js
let map = new Map([[key, value], [key, value]])
map.set([key, value]) //添加
map.get(key) //获取
map.has(key) //检测
map.delete(key) //删除
map.clear() //清空
map.size //返回元素个数
```
除了以上属性，还有forEach，参数同set
### WeakMap
WeakMap是特殊的Map,区别如下：
- WeakMap是**不可迭代**对象。
- 不支持`forEach、size、clear`等属性，只支持`set、get、has、delete`。
- 只接受**对象**作为key，但是value没有这个限制。
- 作为key的对象同WeakSet，是弱引用。
### Set和Map的区别
一般来说，Set集合常被用于检查对象中是否存在某个key，而Map用户获取已存的信息
### 和数组对象相比，优点有哪些？
- 判断是否存在，不需要担心值为falsy，也不担心in会遍历原型链上的属性等等
- 如果某个元素不存在时，直接返回undefined，而数组、对象还会遍历原型链浪费性能
- key能够是非基本类型的值