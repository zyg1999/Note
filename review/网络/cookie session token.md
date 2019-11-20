# cookie和session

## 应用场景

cookie: 
登录网站，第一天输入用户名密码登录了，第二天再打开很多情况下就直接打开了。这个时候用到的一个机制就是cookie。

session: 
session一个场景是购物车，添加了商品之后客户端处可以知道添加了哪些商品，而服务器端如何判别呢，所以也需要存储一些信息就用到了session。


## cookie

服务器通过设置`set-cookie`这个响应头，将cookie信息返回给浏览器，浏览器将响应头中的cookie信息保存在本地，当下次向服务器发送HTTP请求时，浏览器会自动将保存的这些cookie信息添加到请求头中。

通过cookie，服务器就会识别出浏览器，从而保证返回的数据是这个用户的。

 - 通过`set-cookie`设置
 - 下次请求会自动带上
 - 键值对，可设置多个


### cookie属性

 - max-age
   - 过期时间有多长
   - 默认在浏览器关闭时失效
 - expires
   - 到哪个时间点过期
 - secure
   - 表示这个cookie只会在https的时候才会发送
 - HttpOnly
   - 设置后无法通过在js中使用document.cookie访问
   - 保障安全，防止攻击者盗用用户cookie
 - domain
   - 表示该cookie对于哪个域是有效的。 


## session

 - 存放在服务器的一种用来存放用户数据的类似HashTable的结构
 - 浏览器第一次发送请求时，服务器自动生成了HashTable和SessionID来唯一标识这个hash表，并将sessionID存放在cookie中通过响应发送到浏览器。浏览器第二次发送请求会将前一次服务器响应中的sessionID随着cookie发送到服务器上，服务器从请求中提取sessionID，并和保存的所有sessionID进行对比，找到这个用户对应的hash表。
   - 一般这个值是有时间限制的，超时后销毁，默认30min
 - 当用户在应用程序的web页面间挑转时，存储在session对象中的变量不会丢失而是在整个用户会话中一直存在下去。
 - session依赖于cookie，因为sessionID是存放在cookie中的。


## sesssion与cookie的区别

 - cookie存在客户端，session存在于服务端。
 - cookie在客户端中存放，容易伪造，不如session安全
 - session会消耗大量服务器资源，cookie在每次HTTP请求中都会带上，影响网络性能
 - 域的支持范围不一样，比方说a.com的Cookie在a.com下都能用，而www.a.com的Session在api.a.com下都不能用



### 为什么要有token

sessionID当数量增大到一定程度，会造成服务器压力。

若用两个机器组成了一个集群，甲通过机器A登录了系统，  那session id会保存在机器A上，要是下一次请求被转发至B怎么办？只好进行**session复制**，将sessionId在两个机器间搬来搬去。

 session id **集中存储**到一个地方， 所有的机器都来访问这个地方的数据 ，不用复制，但**增加了单点失败的可能性**，负责session的机器挂了，所有人都得重新登录。

虽然 单点的机器也搞出集群，增加可靠性 ，但session是个沉重的负担。

### token工作原理

1. 登录时候,客户端通过用户名与密码请求登录
2. 服务端收到请求区验证用户名与密码
3. 验证通过,服务端会对数据做一个签名作为Token,再把这个Token发给客户端.
4. 客户端收到Token,存储到本地,如Cookie,SessionStorage,LocalStorage.我们是存在SessionStorage
5. 客户端每次像服务器请求API接口时候,都要带上Token，放在请求头.
6. 服务端收到请求,验证Token（用同样的算法和密钥， 对数据再计算一次签名 ）,如果通过就返回数据,否则提示报错信息.