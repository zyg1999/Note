### 背景
在Ajax出现以前，用户与服务器进行交互是十分漫长的，服务器处理每一个用户请求都需要重新加载网页。比如点开网页登录，在输完用户名和密码后点击登录，发送HTTP请求，如果密码不对，服务端将原网页原封不动返回，在用户看来就是一次重新加载的过程，用户体验极差。

### What is Ajax?
AJAX代表异步JavaScript和XML。 简而言之，就是**使用XMLHttpRequest对象与服务器进行通信**。 它可以发送和接收各种格式的信息，包括JSON，XML，HTML和文本文件。 AJAX最吸引人的特点是其“异步”性质，这意味着它可以与服务器通信，交换数据和更新页面，而不必刷新页面。

这里为什么要在异步加上引号？
> 因为对于一次Ajax请求并不是完全异步， 在readyState变为2之前，都是同步。

> 从send方法内部开始, 浏览器为将要发生的网络请求创建了新的http请求线程, 这个线程独立于js引擎线程, 于是网络请求异步被发送出去了. 另一方面, js引擎并不会等待 ajax 发起的http请求收到结果, 而是直接顺序往下执行.

AJAX的两个主要功能使您可以执行以下操作：

- 向服务器发出请求，而无需重新加载页面
- 从服务器接收和处理数据
### Ajax与setTimeout排队问题
通常, ajax 和 setTimeout 的事件回调都被同等的对待, 按照顺序自动的被添加到 任务队列 的末尾, 等待js引擎空闲时执行. 但请注意, 并非xhr的所有回调执行都滞后于setTImeout的回调. 
```js
function ajax(url, method) {
  var xhr =
    new XMLHttpRequest() ||
    new ActiveXObject('Msxml2.XMLHTTP') ||
    new ActiveXObject('Microsoft.XMLHTTP') //全平台兼容
  xhr.onreadystatechange = function() {
    console.log('xhr.readyState:' + this.readyState)
  }
  xhr.onloadstart = function() {
    console.log('onloadStart')
  }
  xhr.onload = function() {
    console.log('onload')
  }
  xhr.open(method, url, true)
  xhr.setRequestHeader('Cache-Control', 3600)
  xhr.send()
}
var timer = setTimeout(function() {
  console.log('setTimeout')
}, 0)
ajax(
  'https://user-gold-cdn.xitu.io/2017/3/15/c6eacd7c2f4307f34cd45e93885d1cb6.png',
  'GET'
)
console.warn('这里的log并不是最先打印出来的.')
```
打印内容如下
```js
 xhr.readyState:1
 onloadStart
 这里的log并不是最先打印出来的.
 setTimeout
 xhr.readyState:2
 xhr.readyState:3
 xhr.readyState:4
 onload
```
### XHR属性
如图

![image](https://note.youdao.com/favicon.ico)
#### 继承关系
```js
var xhr = new XMLHttpRequest(),
    i=0;
for(var key in xhr){
    if(xhr.hasOwnProperty(key)){
       i++;
   }
}
console.log(i);//0
console.log(XMLHttpRequest.prototype.hasOwnProperty('timeout'));//true
xhr具有以下继承关系
```
`xhr<<XMLHttpRequest.prototype<<XMLHttpRequestEvent.prototype<<EventTarget.prototype<<Object.prototype`

#### xhr实例拥有10个普通属性+9个方法
##### readyState属性，只读

状态码 | 含义
---|---
0 | 未初始化。未调用open()
1 | 启动。已调用open()，未调用send()
2 | 发送。调用send(),但未收到响应
3 | 接收。受到部分响应数据
4 | 完成。接收全部响应数据，且可以在客户端使用。

##### onReadyStateChange

在`readyState`改变时触发该事件回调。在一个收到响应的ajax请求周期中, onreadystatechange 方法会被触发4次. 因此可以在 onreadystatechange 方法中绑定一些事件回调, 比如:
```js
xhr.onreadystatechange = function(e){
  if(xhr.readystate==4){
    var s = xhr.status;
    if((s >= 200 && s < 300) || s == 304){
      var resp = xhr.responseText;
      
    }
  }
}
```
##### status

只读，响应的HTTP状态。初始0，若服务器没有显式指定状态码，200位默认值
##### statusText

只读， statusText表示服务器的响应状态信息, 它是一个 UTF-16 的字符串, 请求成功且status==20X时, 返回大写的 OK；失败返回空；其他情况下返回相应的状态描述.举例，302的 `Found`；400的`Bad Request`
##### onloadstart

onloadstart事件回调方法在ajax请求发送之前触发, 触发时机在 `readyState == 1` 状态之后, `readyState == 2` 状态之前.

该方法中传入ProgressEvent事件进度对象
有三个只读属性
- lengthComputable 表长度是否可计算，初始值`false`
- loaded 已加载资源大小，如果使用http下载资源, 它仅仅表示已下载内容的大小, 而不包括http headers等. 它是一个无符号长整型, 初始值为0.
- total 表示资源总大小, 如果使用http下载资源, 它仅仅表示内容的总大小, 而不包括http headers等, 它同样是一个无符号长整型, 初始值为0.
##### onprogress
在 readyState==3 状态时开始触发, 默认传入 ProgressEvent 对象, 可通过 e.loaded/e.total 来计算加载资源的进度, 该方法用于获取资源的下载进度.
##### onload
ajax请求成功后触发，触发时机在 `readyState==4` 状态之后。捕捉到一个ajax异步请求的成功状态
##### onloadend
在ajax请求完成后触发, 触发时机在 readyState == 4 状态之后(收到响应时) 或者 readyState == 2 状态之后(未收到响应时).
##### timeout
该属性用于指定ajax的超时时长.
通过它可以灵活地控制ajax请求时间的上限. timeout的值满足如下规则:

- 0 不生效.
- 设置为字符串时, 如果字符串中全部为数字, 它会自动将字符串转化为数字, 反之该设置不生效.
- 设置为对象时, 如果该对象能够转化为数字, 那么将设置为转化后的数字.
##### ontimeout
该方法在ajax请求超时时触发，可做一些后续处理
```js
xhr.ontimeout = function(e){
    console.error("请求超时")
}
```
##### responseText
均为只读属性, response表示服务器的响应内容, 相应的, responseText表示服务器响应内容的文本形式.
##### responseXML
只读属性, responseXML表示xml形式的响应数据, 缺省为null, 若数据不是有效的xml, 则会报错.
##### responseType
responseType表示响应的类型, 缺省为空字符串, 可取 `"arraybuffer" , "blob" , "document" , "json" , and "text"` 共五种类型.
##### responseURL
返回ajax请求最终的URL, 若请求中存在重定向, 那么responseURL表示重定向之后的URL。
##### withCredentials
withCredentials是一个布尔值, 默认为false, 表示跨域请求中不发送cookies等信息. 当它设置为true时, `cookies ,` `authorization headers` 或者`TLS`客户端证书 都可以正常发送和接收. 显然它的值对同域请求没有影响.
##### abort
abort方法用于取消ajax请求, 取消后, readyState 状态将被设置为 0 (UNSENT)。
##### getResponseHeader
getResponseHeader方法用于**获取ajax响应头中指定name的值**. 如果response headers中存在相同的name, 那么它们的值将自动以字符串的形式连接在一起.
```js
console.log(xhr.getResponseHeader('Content-Type'));//"text/html"
```
##### getAllResponseHeaders
getAllResponseHeaders 方法用于获取**所有安全的ajax响应头**, 响应头以字符串形式返回. 每个HTTP报头名称和值用冒号分隔, 如key:value, 并以\r\n结束.
```js
xhr.onreadystatechange = function() {
  if(this.readyState == this.HEADERS_RECEIVED) {
    console.log(this.getAllResponseHeaders());
  }
}
//Content-Type: text/html"
```
##### setRequestHeader
设置请求头，xhr.setRequestHeader(key,value)
##### onerror
onerror方法用于在ajax请求出错后执行. 通常只在网络出现问题时或者`ERR_CONNECTION_RESET`时触发(如果请求返回的是407状态码, chrome下也会触发onerror).
##### upload
upload属性默认返回一个 XMLHttpRequestUpload 对象, 用于上传资源. 该对象具有如下方法:

onloadstart
onprogress
onabort
onerror
onload
ontimeout
onloadend

##### overrideMimeType
overrideMimeType方法用于强制指定response 的 MIME 类型, 即强制修改response的 Content-Type .
#### XHR一级
XHR1 即 XMLHttpRequest Level 1. XHR1时, xhr对象具有如下缺点:

- 仅支持文本数据传输, 无法传输二进制数据.
- 传输数据时, 没有进度信息提示, 只能提示是否完成.
- 受浏览器 同源策略 限制, 只能请求同域资源.
- 没有超时机制, 不方便掌控ajax请求节奏.

#### XHR二级
XHR2 即 XMLHttpRequest Level 2. XHR2针对XHR1的上述缺点做了如下改进:

- 支持二进制数据, 可以上传文件, 可以使用FormData对象管理表单.
- 提供进度提示, 可通过 xhr.upload.onprogress 事件回调方法获取传输进度.
- 依然受 同源策略 限制, 这个安全机制不会变. XHR2新提供 Access-Control-Allow-Origin 等headers, 设置为 * 时表示允许任何域名请求, 从而实现跨域CORS访问(有关CORS详细介绍请耐心往下读).
- 可以设置timeout 及 ontimeout, 方便设置超时时长和超时后续处理.
### Axios 一款轻量级http库
- 基于promise语法
- 支持node
- 短小，轻量