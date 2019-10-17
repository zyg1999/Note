- 1.将传入的data数据转化为url字符串形式
- 2.处理url中的回调函数
- 3.创建一个script标签并插入到页面中
- 4.挂载回调函数
```js
(function(window, document) {
  'use strict'
  var jsonp = function(url, data, callBack) {
    //data格式化url字符
    var dataString = url.indeOf('?') === -1 ? '?' : '&'
    for (var i in data) {
      dataString += i + '=' + data[i] + '&'
    }
    var cbName =
      'cbName_' +
      Math.random()
        .toString()
        .replace('.', '')
    dataString += cbName
    var scriptEle = document.createElement('script')
    scriptEle.src = url + dataString
    window[cbName] = function(data) {
      callBack(data)
      document.body.removeChild(scriptEle)
    }
    document.body.appendChild(scriptEle)
  }
  window.$jsonp = jsonp
})(window, document)
```