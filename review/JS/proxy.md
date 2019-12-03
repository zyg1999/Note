### Object.definePropety

es5中，定义对象新属性或修改现有属性，返回这个对象

` Object.defineProperty(obj, 属性名, 描述符) `描述符为非必需，但字段必须，就是说不定义也要写个`{}`

```js
let obj={}
Object.definedPropety(obj,"num",{
    value:1,
    writable:true,//可以被写
    enumerable:true,//可以枚举
    configurable:true,//能够改变和删除
    get:function(){return value},//取
    set:function(nv){value=nv}//存
})
```

### proxy

用于修改某些操作的默认行为。可理解为在目标对象之前架设一层“拦截”。无需一层层递归为每个属性添加代理，一次即可完成以上操作，性能上更好， 可以重定义更多的行为，比如 **in、delete、函数调用**等更多行为。 
### 用法
```js
const proxy = {
//target为代理后的对象，receiver是被代理的对象
  get(target, key, receiver) {},
  set(target, key, value, receiver) {}
}
```
> 如果new Proxy({}, {})，那么直接落到被代理的对象身上。
`target` 代表需要添加代理的对象，`handler` 用来自定义对象中的操作，比如可以用来自定义 set 或者 get 函数。

```js
let onWatch = (obj, setBind, getLogger) => {
  let handler = {
    set(target, property, value, receiver) {
      setBind(value, property)
      return Reflect.set(target, property, value)
    },
    get(target, property, receiver) {
      getLogger(target, property)
      return Reflect.get(target, property, receiver)
    }
  }
  return new Proxy(obj, handler)
}

let obj = { a: 1 }
let p = onWatch(
  obj,
  (v, property) => {
    console.log(`监听到属性${property}改变为${v}`)
  },
  (target, property) => {
    console.log(`'${property}' = ${target[property]}`)
  }
)
p.a = 2 // 控制台输出：监听到属性a改变
p.a // 'a' = 2
```

自定义 set 和 get 函数的方式，在原本的逻辑中插入了我们的函数逻辑，实现了在对对象任何属性进行读写时发出通知。

### 其他拦截
- has(target, key): 拦截key in obj
- deleteProperty(target, key): 拦截delete obj.key
- getOwnPropertyDescriptor(target, key): 拦截Object.getOwnPropertyDescriptor(obj, key)
- defineProperty(target, key, descriptor): 拦截Object.defineProperty(obj, key, descriptor)
- preventExtensions(target): 拦截Object.preventExtensions(obj),返回boolean
- constructor(target, args, fn): 拦截new target()
- getPrototypeOf(target): 拦截Object.getPrototypeOf(obj)
- setPrototypeOf(target, prototype): 拦截Object.setPrototypeOf(obj, proto)
- apply(target, obj, args): 拦截target.apply(obj, ...args)、target()、target.call()
- ownKeys(target): 拦截Object.getOwnPropertyNames()、Object.keys()、for in、Object.getOwnPropertySymbols, 返回一个string数组，不过这些都得等到对象中存在对应的key时才行。
### Proxy.revocable
返回一个对象
```js
let target = {};
let handler = {};

let {proxy, revoke} = Proxy.revocable(target, handler);

proxy.foo = 123;
proxy.foo // 123

revoke();
proxy.foo // TypeError: Revoked
```
### proxy和Object.definedProerty区别
- Object.defineProperty()只能对某个key进行监测，如果想对每个属性都监测的话就需要遍历，而Proxy是直接监测整个对象，不需要遍历
- 前者对数组的监测只能是：arr[0] = 1,不能对可以改变原数组的方法进行监测，而proxy可以
- proxy的兼容性目前还没有提上来，并且对应的polyfill也不完善