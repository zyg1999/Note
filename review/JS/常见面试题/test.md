作者：歐陽深蹲
链接：https://www.nowcoder.com/discuss/346582?type=2&order=0&pos=1&page=1
来源：牛客网

# 11/15 头条前端
 
## 两数之和
 
O(n)的做法
 
### 哈希表
 
```js
const twoSum = function (nums, target) {
  const arrMap = new Map()
  for (let i = 0; i < nums.length; i++) {
    const result = target - nums[i];
    if (arrMap.has(result)) {
      return [arrMap.get(result), i]
    }
    arrMap.set(nums[i], i)
  }
};
```
 
### 双指针
 
```js
const twoSum = function (nums, target) {
  nums.sort((a,b)=>a-b)
  let low = 0;
      high = nums.length - 1;
 
  while (low < high) {
    let sum = nums[low] + nums[high];
    if (sum < target) {
      low ++
    } else if (sum > target) {
      high --
    } else {
      return [low+1, high+1]
    }
  }
};
```
 
## 前端存储
 
### cookie
 
最早存储是用cookie，不超过4k。
 
存每次请求都要带的信息。每次请求都自动写在http请求头里面
 
为了辨识身份、session跟踪等。类似于通行证。
 
域名隔离。同源的网站cookie都能读写。
 
domain是域名，path是路径，两者加起来就构成了 URL。domain和path一起来限制 cookie 能被哪些 URL 访问、发送。
 
在设置的过期时间之前，一直在。
 
cookie有状态，服务器会记录session信息。
 
### token
 
cookie有跨站请求伪造CSRF的问题，所以出现了token
 
只要绕开同源策略，如form之类，就可以用其他域的cookie来向其他域发送请求，因为cookie是自动添加到请求头的
 
token是临时的证书签名。不会自动添加，其他域也无法访问token
 
token无状态，服务器不记录。带上token就是通过。登出客户端就销毁token
 
可以存在localstorage或cookie中
 
- 可以防止跨站请求伪造csrf
 
- 可以被多个域使用，需要多个服务授权的应用很适合。
 
### localStorage
 
cookie和token都存不下，于是出现了local/session storage。可以达到5M
 
除非删除，不然一直在浏览器当中。关闭了也在。
 
同一域名***享。即，相同协议、主机名、端口，才能读写。
 
### sessionStorage
 
可以达到5M。
 
临时存储。同源网页之间数据共享，但关闭tab或浏览器就没了。
 
session就是一次和同源网站的链接，刷新或进入同源另一页面，session依然存在。
 
### indexDB
 
为了存储更大量数据。
 
cookie和local/session storage都不够用了。而且只能存string。
 
同源，只能访问同域存储的数据。
 
#### 事务：
 
- 原子性、一致性：保证数据库操作，要么全部成功，要么全部失败。
 
如果修改多条数据，前面的成功了，有一条失败了，那么回滚返回错误，一条也不修改。
 
- 隔离性：并发执行，一个事物不会影响其他事务。
- 持久性：已提交的就永久保存。
 
## 跨域怎么解决
 
### 同源策略
 
- 协议相同
- 域名相同
- 端口相同
 
举例来说，`http://www.example.com/dir/page.html`这个网址，协议是`http://`，域名是`www.example.com`，端口是`80`（默认省略）
 
为了保证用户信息的安全，防止恶意的网站窃取数据。
 
同源即要设置相同的document.domain
 
### 非同源限制：
 
- Cookie、LocalStorage 和 IndexDB 无法读取。
- DOM 无法获得。
  如iframe和window.open打开的窗口，与父窗口无法通信。
  不然可以做假网站，直接获取用户名密码
- AJAX 请求，只能发送同源网址。
 
### 非同源，解决跨域窗口通信：
 
- 片段识别符（fragment identifier），URL的`#`号后面的部分
  改变它页面不会刷新
- window.name
  无论是否同源，只要在同一个窗口里，前一个网页设置了这个属性，后一个网页可以读取它。
- 跨文档通信API（Cross-document messaging），`window.postMessage`方法
  允许跨窗口通信，不论这两个窗口是否同源。
  还能读取其他窗口的localstorage
 
### 绕开ajax跨域限制：
 
- 服务器***，请求同源服务器，然后服务器再请求外部服务
  万能方法
- jsonp
  图像ping
- websocket
- cors
 
#### 原理
 
一个域名的 JS ，在未经允许的情况下，不得读取另一个域名的内容。但浏览器并不阻止你向另一个域名发送请求。
 
对方觉得不安全可以丢一边不管，但不能让你未经允许获取信息。
 
跨域问题只是浏览器V8引擎强加给js的规则而已，世界本无跨域限制。是浏览器强制不允许js访问别的域，但是浏览器却没有限制它自己。
 
比如说img标签可以加载任何域的图片，script可以加载任何域的js。再比如说你不能从前端js去调淘宝的接口获取ip对应的城市地址信息，但是你可以手敲在浏览器地址栏，直接打开。
 
#### jsonp
 
网页动态插入一个`<script>`元素，向跨域服务器请求JSON数据。服务器收到请求后，将数据放在一个指定名字的回调函数里传回来。
 
这种做法不受同源政策限制，目前最流行。
 
只支持get
 
```js
function foo(data) {
  // 客户端要定义一个foo函数，来接受返回值
  console.log('Your public IP address is: ' + data.ip);
};
 
function addScriptTag(src) {
  var script = document.createElement('script');
  script.setAttribute("type","text/javascript");
  script.src = src;
  document.body.appendChild(script);
}
 
window.onload = function () {
  addScriptTag('http://example.com/ip?callback=foo');
  // callback指定回调参数名字，是必须的。
}
 
// 后端识别并返回：
foo({
  "ip": "8.8.8.8"
});
// 浏览器收到后立即执行foo()
```
 
`<script>`请求的脚本，直接作为代码运行。只要浏览器定义`foo()`，就会立即调用。
 
json数据是js对象，而不是字符串，因此不用json.parse
 
##### img跨域
 
img不受同源策略影响，可以跨域引用资源。通过src属性跨域。
 
- 可以用来实现，跟踪用户点击页面或动态广告曝光次数
- 只支持get，只能单向通信，浏览器无法访问服务器响应文本。
 
 
 
#### websocket
 
WebSocket是一种通信协议，使用`ws://`（非加密）和`wss://`（加密）作为协议前缀。
 
该协议不实行同源政策，只要服务器支持，就可以通过它进行跨源通信。
 
协议里面有一个origin，服务器可以根据这个判断，如果域名在白名单内，就能通信。
 
### cors
 
CORS是跨源资源分享（Cross-Origin Resource Sharing）的缩写，是跨源AJAX请求的根本解决方法。相比JSONP只能发`GET`请求，CORS允许任何类型的请求。
 
代码和ajax完全一样。浏览器如果发现ajax跨源，就会自动添加附加头部信息。主要是服务器的支持。
 
#### 简单请求/非简单请求
 
条件：
 
- 请求方法：head/get/post之一
- 头部信息不超出以下字段
  - accept
  - accept-language
  - content-language
  - last-event-id
  - content-type: application/x-www-form-urlencoded, multipart/form-data, text/plain
 
#### 简单请求
 
简单请求直接发出cors请求，在头中增加origin字段，说明本次请求来自哪个源（协议 + 域名 + 端口），服务器判断是否回应。
 
如果浏览器发现，回应的头信息没有包含`Access-Control-Allow-Origin`字段，就知道出错了，从而抛出一个错误，被`XMLHttpRequest`的`onerror`回调函数捕获。
 
注意，这种错误无法通过状态码识别，因为HTTP回应的状态码有可能是200。
 
CORS请求默认不发送Cookie和HTTP认证信息。
 
如果要把Cookie发到服务器，一方面要服务器同意，指定`Access-Control-Allow-Credentials`字段；另一方面，开发者必须在AJAX请求中打开`withCredentials`属性。
 
#### 非简单请求
 
种对服务器有特殊要求的请求，比如请求方法是`PUT`或`DELETE`，或者`Content-Type`字段的类型是`application/json`。
 
在正式通信之前，增加一次HTTP查询请求，称为"预检"请求（preflight）。先问问自己是否在白名单中。
 
## 三列布局，左右定宽，中间自适应屏幕宽度
 
### float
 
左右定宽，右边元素要在中间元素之前
 
```html
<div>
   <div class="left"></div> 
   <div class="right"></div>
  <div class="middle"></div> 
</div>
```
 
```css
.left , .right{
  width:60px;
  height:30px;
}
.left{
  float:left;
}
.middle{
  margin-right:70px;
  margin-left:70px;
  height:30px
 
}
.right{
  float:right;
}
```
 
### flex
 
父元素display：flex,左右定宽，中间flex：1 自适应
 
```html
<div class="container">
   <div class="left"></div>
   <div class="middle"></div>
   <div class="right"></div>
</div>
```
 
```css
.container{
  display: flex;
}
.left , .right{
  width: 60px;
  height:30px;
}
.middle{
  flex:1;
  margin-left:10px;
  margin-right:10px;
}
```
 
### grid
 
```html
<div class="container">
   <div class="left"></div>
   <div class="middle"></div>
   <div class="right"></div>
</div>
```
 
```css
.container{
  display:grid;
  width:100%;
  grid-template-rows:30px;
  grid-template-columns:60px auto 60px
}
.middle{
  margin-left:10px;
  margin-right:10px;
}
```
 
## 原型链
 
求输出结果：
 
```js
Object.prototype.a='Object'
Function.prototype.a = 'Function'
function Person(){}
var child = new Person()
 
console.log(Person.a)
console.log(child.a)
console.log(child.__proto__)
console.log(child.__proto__.__proto__)
console.log(child.__proto__.__proto__.constructor)
console.log(child.__proto__.__proto__.constructor.constructor)
console.log(child.__proto__.__proto__.constructor.constructor.constructor)
```
 
### 初始化
 
初始状态是这样的：
 
![image-20191119222107054](https://tva1.sinaimg.cn/large/006y8mN6gy1g93pov06wvj315o0j6tcc.jpg)
 
`Function()`new了`Object()`出来。然后他们各自的`.prototype`，也是各自new出来的。
 
这里面的指向有几个规则，也有几个特例：
 
#### 规则
 
1. 构造函数/对象，都是对象。
 
   只要是对象，下面就有两个属性：`constructor`和`__proto__`
 
- `.constructor`：谁new的我 我就指谁。
  这是用来记录谁是构造函数的
 
- `.__proto__`：谁new的我 我指他`.prototype`
 
  顺着`constructor`找到爹，然后在下面找到他的`.prototype`，指向他。
 
  这是用来记录，该去哪继承方法/属性的。
   
  自己下面找不到方法/函数，就去`.__proto__`的指针地址里面找。
 
2. 构造函数下面多一个属性，叫`.prototype`
 
   这只有构造函数才有，所以`Function.prototype`相当于`Function().prototype`
 
   构造函数在出生的时候，同时会自动new一个对象出来，`.prototype`会指向这个对象
 
   这个对象，对于这个构造函数没啥用，主要是给new出来的孩子们用的。即其他对象找不到了方法/属性，就通过`.__proto__`找到这里，在这里面继续找。类似于存放给人继承的东西的地方
 
#### 特例
 
1. `Function()`非常特殊，几乎整个都是特例
 
- `Function()`可以看作是自己new了自己，因此`.constructor`指的是自己，`.__proto__`指的也是自己的`.prototype`
 
- `Function()`new出的`Function.prototype`，是个函数
 
  而其他构造函数，new出来的都是对象，图中我以颜***分。
 
- `Function.prototype.__proto__`应该是`Function.prototype`才是呀，但是这样就变成死循环了，自己下面找不到的方法/属性，还是找不到
 
  所以就指向了`Object.prototype`，去继承了`Object.prototype`的方法
 
2. `Object.prototype.__proto__`，指向的是`null`
 
   理应是指向`Object.prototype`的，但那样的话又死循环了，于是就让它指向null，他都没有的方法就全世界都没有了
 
   这下`Object.prototype`就变成了万物方法/属性之源了
    
3. 由`Function`new出来的构造函数，它的`.prototype`的`.__proto__`，指向的是`Objet.prototype`，这个下面再说
 
   感觉就是，遇到死循环不知道该继承谁，就去继承`object.prototype`
   然后`Object.prototype.__proto__`就去继承`null`
 
 
 
 
```js
Object.prototype.a='Object'
Function.prototype.a = 'Function'
```
 
这是在两个`.prototype`下面多加了两个属性，像这样：
 
![image-20191120071138367](https://tva1.sinaimg.cn/large/006y8mN6gy1g9450tvow5j31480ion01.jpg)
 
```js
function Person(){}
```
 
这是在通过`Function()`，构造了一个`Person()`函数。相当于：
 
`var Person = new Function()`
 
![image-20191120074024678](https://tva1.sinaimg.cn/large/006y8mN6gy1g945urnufzj314f0u0dk***g)
 
然后套路还是一样的，`.constructor`指向new自己的人，`.__proto__`指向爹的`.prototype`
 
但是`Person.prototype.__proto__`，理应指向，`Person.prototype`，但那样的话又变成死循环了
 
所以就按照特例3，把它指向了`Object.prototype`
 
 
 
```js
var child = new Person()
```
 
构造函数`Person()`新建了一个`child`
 
![image-20191120075124302](https://tva1.sinaimg.cn/large/006y8mN6gy1g94667s4vlj31010u00y1.jpg)
 
这个就，没有特例那种幺蛾子
 
全局：
 
![image-20191120075213850](https://tva1.sinaimg.cn/large/006y8mN6gy1g94672qdkej31230u00xt.jpg)
 
```js
console.log(Person.a)
// Function
// Person()下面找不到，沿着.__proto__找它爹Function.prototype，里面找到了a=Function，就是结果了。
console.log(child.a)
// Object
// child下面没有a，沿着.__proto__找爹，Person.prototype下面也没有a，再沿着Person.prototype.__proto__找爹，找到了Object.prototype下面有个a是Object，输出
console.log(child.__proto__)
// {constructor: Person()}
// 也就是Person.prototype
console.log(child.__proto__.__proto__)
// {constructor: Object()}
// 也就是Object.prototype
console.log(child.__proto__.__proto__.constructor)
// Object()
console.log(child.__proto__.__proto__.constructor.constructor)
// Function()
console.log(child.__proto__.__proto__.constructor.constructor.constructor)
// Function()
```
 
 
 
## 闭包
 
实现一个foo函数，返回自身调用次数：
 
```js
a=foo()
b=foo()
c=foo()
// 此时 a===1, b===2, c===3
foo.reset()
d=foo()
// d===1
```
 
```js
var helper = function() {
  let count = 0
  return function() {
    count++
    console.log("count", count)
  }
}
var foo = helper()
```