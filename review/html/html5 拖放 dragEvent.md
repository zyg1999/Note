### 拖放
拖放是一种常见的特性，即抓取对象以后拖到另一个位置。

在 HTML5 中，拖放是标准的一部分，任何元素都能够拖放。
### 拖放分析
#### 设置元素为可拖放
`<div draggable="true"></div>`
#### 拖动什么 - ondragstart 和 setData()
规定当元素被拖动时，会发生什么

ondragstart 属性调用一个函数，规定被拖动的数据
```js
function drag(ev)
{
    ev.dataTransfer.setData("Text",ev.target.id);//dataTransfer.setData() 方法设置被拖数据的数据类型和值
}
```
#### 放到何处 - ondragover
ondragover 事件规定在何处放置被拖动的数据。

默认地，无法将数据/元素放置到其他元素中。如果需要设置允许放置，我们必须阻止对元素的默认处理方式。

这要通过调用 ondragover 事件的 event.preventDefault() 方法：
```js
event.preventDefault()
```
#### 进行放置 - ondrop
当放置被拖数据时，会发生 drop 事件。

在上面的例子中，ondrop 属性调用了一个函数，drop(event)：
```js
function drop(ev)
{
    ev.preventDefault();
    var data=ev.dataTransfer.getData("Text");
    ev.target.appendChild(document.getElementById(data));
}
```
### 拖拽例子
```html
<!DOCTYPE HTML>
<html>
<head>
<style type="text/css">
#div1,#div2 {
    width:198px; 
    height:66px;
    padding:10px;
    border:1px solid #aaaaaa;
}
</style>
<script type="text/javascript">
function allowDrop(ev)
{
    ev.preventDefault();
}

function drag(ev)
{
    ev.dataTransfer.setData("Text",ev.target.id);
}

function drop(ev)
{
    ev.preventDefault();
    var data=ev.dataTransfer.getData("Text");
    ev.target.appendChild(document.getElementById(data));
}
</script>
</head>
<body>

<p>请把方块拖放到矩形中：</p>

<div id="div1" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
<div id="div2" ondrop="drop(event)" ondragover="allowDrop(event)"></div>

<div id="drag1" style="width:50px;height:50px;background-color:red" draggable="true" ondragstart="drag(event)" ></div>

</body>
</html>

```
### 总结
- 被拖拽元素上触发的事件：
    -  ondragstart - 用户开始拖动元素时触发
    -  ondrag - 元素正在拖动时触发
    -  ondragend - 用户完成元素拖动后触发
- 目标元素上触发的事件：
    - ondragenter - 当被鼠标拖动的对象进入其容器范围内时触发此事件
    - ondragover - 当某被拖动的对象在另一对象容器范围内拖动时触发此事件
    - ondragleave - 当被鼠标拖动的对象离开其容器范围内时触发此事件
    - ondrop - 在一个拖动过程中，释放鼠标键时触发此事件
> 另外，需要的知识点就是event对象中的preventDefault()。在ondragover中一定要执行preventDefault()，否则ondrop事件不会被触发。
不过，保存在dataTransfer对象中的数据只能在ondrop事件处理程序中读取。

> 如果是从其他应用软件或是文件中拖东西进来，尤其是图片的时候，默认的动作是显示这个图片或是相关信息，并不是真的执行drop。 
此时需要用用document的ondragover事件把它直接干掉。
### 原生拖拽
```js
var div = document.getElementsByTagName('div')[0];
var disX,
    disY;
div.onmousedown = function(e){
    disX = e.pageX - parseInt(div.style.left);
    disY = e.pageY - parseInt(div.style.top);
    document.onmousemove = function(e){  //要想快速移动不脱离鼠标则用document.  否则div
        div.style.left = e.pageX - disX + "px";
        div.style.top = e.pageY - disY +"px";
    }   
    document.onmouseup = function(){
        document.onmousemove = null;
   }
}
```