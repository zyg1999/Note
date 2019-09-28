### 淘宝
```js
(function () {
    var dpr = window.devicePixelRatio;
    var meta = document.createElement('meta');
    var scale = 1 / dpr;
    meta.setAttribute('name', 'viewport');
    meta.setAttribute('content', 'width=device-width, user-scalable=no, initial-scale=' + scale +
      ', maximum-scale=' + scale + ', minimum-scale=' + scale);
    document.getElementsByTagName('head')[0].appendChild(meta);
    // 动态设置的缩放大小会影响布局视口的尺寸
      function resize() {
      var deviceWidth  = document.documentElement.clientWidth;
      document.documentElement.style.fontSize = (deviceWidth / 10) +'px';
         }
    resize();
    window.onresize = resize;
  })()
```
### 网易
```html
<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
```
```js
(function () {
    function resize() {
      var deviceWidth = document.documentElement.clientWidth;
    document.documentElement.style.fontSize = (deviceWidth / 6.4) +'px';
   }
    resize();
    window.onresize = resize;
  })()
```
### vh vw
100vw就是布局视口的宽度
