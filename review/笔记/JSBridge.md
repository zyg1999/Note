[TOC]

### JSBridge

`JSBridge` 移动混合开发。

#### 现有混合方案

- webView UI: 通过JSBridge 完成H5与Native双向通信
- Native UI:  Week、RN。基于 `js` 原生 `API` 的基础上，通过 `JSBridge` 将js解析成的 `VNode` 传递到 `Native` ，并且使用原生的 `View` 组件进行渲染
- 小程序：通过更加定制化的 `JSBridge` ，使用双 `WebView` 双线程的模式隔离了 `JS` 的逻辑和 `UI` 的渲染。

他们都是通过 `JSbridge` 完成通信，后两种是在第一种的基础之上，通过使用原生的视图进行渲染进一步提高应用的混合程度。 `JSBridge` 是整个hybrid应用的关键部分，微信使用JS-SDK，wx对象就是 `JSBridge` 。

### JSBridge 用途

简单来说，是调用地理位置、摄像头、支付等功能。

实际上，并不简单是调用Native 那么简单，核心是**构建Native与非Native的双向通信通道**，即 JS -> Native 和 Native -> JS

- JS 向 Native 发送消息 : 调用相关功能、通知 Native 当前 JS 的相关状态等。
- Native 向 JS 发送消息 : 回溯调用结果、消息推送、通知 JS 当前 Native 的状态等。

### JSBridge 通信原理

#### JS 调用 Native

- API 注入： `Native` 获取js的context，直接在上面挂载方法，js直接调用即可。Android和iOS有对应的挂载方式
- WebView对`alert、prompt、conosle`的拦截，因为`alert、console`的使用频率较高，一般使用`prompt`以免冲突
- WebView URL Scheme 跳转的拦截

二三种的原理都是通过WebView对js的一些行为的拦截，从而达到通信的目的。

#### WebView URL Scheme

##### 实现原因

在WebView中发出的所有网络请求，`Native`的WebView都能捕获和监听得到。

##### 协议的定制

我们可以发现在进行一些跳转的时候，协议并不是常用的http，而是一个下面这样的东西：

```js
const webURL = url
const targetURL = `sslocal://webview?url=${encodeURIComponent(webURL)}&other_key=other_value`
```

也就是自己定制了一套URL的协议。不同的协议代表了不同的含义，比如我们平时使用的 `http、file` 等，格式都是：

```js
scheme://likehost/path?querystring
```

###### 注意的点

> - **协议语义**。比如整个公司通用的协议可以命名为：`somecompoany://`，某个 `app` 专用则可以是`someapp://`等等
> - 不要使用 `window.location.href` 去进行跳转，因为多个连接连续对 `href` 进行赋值的时候，只有最后一个生效，其余会被忽略。这样会导致 `Native` 忽略相关信息。常用的方式是通过**动态创建 `iframe` ，赋值 `src` 来发送请求信息。**
> - 安全性的考虑，需要在**client设置白名单或者限制**，避免公司内部业务协议被第三方直接调用

##### 协议拦截

Native能够通过相关API实现WebView中发出请求的拦截操作：

- iOS：`shouldStartLoadWithRequest`
- Android： `shouldOverrideUrlLoading`

当解析到请求的URL是自定义协议的时候，就不是发起对资源的请求了，而是parse其params，进行相关的操作，完成实现规定好的映射。

##### 协议的回调

实现双向通信的本质是发送请求，是异步过程。用到JS事件系统中如下两个事件

- `window.addEventListener`: 发送请求的时候，通过协议(作为唯一的标识)注册自定义事件，将`callback`绑定到对应的事件上。Native获取到信息完成操作之后，通过bridge回传data

```js
window.addEventListener(`getNetwork_${id}`, callback)
Bridge.send(`scheme://getNetwork?id=${id}`)
```

> 因为使用唯一标识id，所以一旦id重置的时候，为了避免重复绑定相同的事件，需要对之前的listener进行移除（`removeEventListener(`getNetwordk_${prevId}`)`）

- `window.dispatchEvent`: Native完成对应的操作之后，调用`Bridge`的`dispatch`直接携带data触发该协议的自定义事件。

```js
const event = {
  data: 'some infomation'
}
window.dispatchEvent(event)
```

##### 参数传递

`WebView`对URL长度有限制，因此`get`有长度限制，传递数据有大小限制。使用`base64`或其他编码发送大量数据会超出截断。

因此常用**函数调用**。即`Native`调用 js 函数，并获取返回值。

> 原因在于`Native`可以直接调用js方法（通过相应API），并能获得返回值

#### Native 通知 js 

H5嵌入，因此Native成为js宿主，有更底层权限，这个方向通信简单。

```js
//无法获取返回值
webView.loadUrl("javascript:JSBridge.trigger('NativeCall')")

mWebView.evaluateJavascript(
	"javascript:JSBridge.trigger('NativeCall')",
  @Override
  public void onReceiveValue(String value){
  //value 为返回结果
}
)
```

> 系统版本低于4.4，evaluateJavascript无法使用，而且无法获取到返回值。使用`prompt`进行兼容处理，让H5通过`prompt`进行数据发送，Native 进行拦截并获取数据

### JS接入Bridge

- js：在js注入`bridge`实现的代码（通过`prompt`、`iframe`等，拼装好`scheme`，js调用之用传递参数即可）
- native：拦截URL请求，解析`scheme`，执行约定好的操作

一般将两部分封装为SDK，由Native引入，在初始化WebView时，若页面地址在白名单内，则直接在对应HTML头部注入bridge.js

优点如下：

- 统一维护，避免不一致
- App接入方便
- h5操作简便，多了几个全局API

> h5不知bridge.js什么时候加载好，因此native需要在完成之后通知h5

### Native 接入 h5

##### 1.在线方式：将h5打包好的资源放置server，native直接使用对应URL到WebView中。

- 优点
  - 不影响`native`大小
  - 完全热更新，接入成本低
  - 独立性强，不影响app
- 缺点
  - 完全依赖网络，offline无法加载
  - 首屏加载依赖网络

- 适用场景

​        轻量级页面，如help、tip等

##### 2. 内置h5: 将h5资源进行打包，解压存储至本地

- 优点
  - 首屏不依赖网络
  - 可离线
- 缺点
  - 更新流程复杂，需要客户端、server协助
  - 增加app体积

