### proxy
用于修改某些操作的默认行为。可理解为在目标对象之前架设一层“拦截”。
### 用法
```js
const proxy = {
//target为代理后的对象，receiver是被代理的对象
  get(target, key, receiver) {},
  set(target, key, value, receiver) {}
}
```
> 如果new Proxy({}, {})，那么直接落到被代理的对象身上。
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