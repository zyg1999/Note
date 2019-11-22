## 水平居中
### 1.行内元素
- 父元素：`text-align:center;`
- 子元素：`display:inline-block;`
```html
<div class="father">
    <div class="son">123</div>
</div>
```
```css
.father {
    text-align: center;
    background-color: cornflowerblue;
}

.son {
    display: inline-block;
    background-color: antiquewhite;
}
```
### 2.块级元素 定宽
- 子元素`margin: 0 auto;`
> 定宽块级元素时`text-align:center;`不起作用
```html
<div class="father">
    <div class="son"></div>
</div>
```
```css
.father {
    background-color: cornflowerblue;
}

.son {
    width: 200px;
    margin: 0 auto;
    background-color: antiquewhite;
}
```
### 3.fit-content
若子元素包含 float:left 属性, 为了让子元素水平居中, 则可让父元素宽度设置为fit-content,并且配合margin, 作如下设置:
```css
.father {
    width: fit-content;
    margin: 0 auto;
    background-color: cornflowerblue;
}

.son {
    width: 200px;
    margin: 0 20px;
    float: left;
    background-color: antiquewhite;
}
```
### 4.flex
- 父元素：`display:flex;flex-direction:column;`主轴为垂直
- 子元素：`align-self:center;`
```html
html同上
```
```css
.father {
    display: flex;
    flex-direction: column;
    background-color: cornflowerblue;
}

.son {
    align-self: center;
    background-color: antiquewhite;
}
```
flex第二种
- 父元素：`display: flex;justify-content: center;`
```html
<div class="father">
    <div class="son">123</div>
</div>
```
```css
.father {
    display: flex;
    justify-content: center;
    background-color: cornflowerblue;
}

.son {
    background-color: antiquewhite;
}
```
### 5.transform
- 子元素设置如下
```css
.son{
  position:absolute;
  left:50%;
  transform:translate(-50%,0);
}
```
### 6.绝对定位+负margin-left
```css
.son{
    position:absolute;
    width:固定;
    left:50%;
    margin-left:-0.5宽度;
}
```
## 垂直居中
假定父元素是盒子容器且高度已经设定
### 1.单行文本
- 设置 line-height 等于父元素高度
### 2. 父元素设定display:table-cell;vertical-align:middle;
```css
.father {
    height: 200px;
    width: 200px;
    display: table-cell;
    vertical-align: middle;
    background-color: cornflowerblue;
}

.son {
    background-color: antiquewhite;
}
```
### 3.inline-block+vertical-align: middle+伪元素 兼容ie7
基本思想是使用display: inline-block, vertical-align: middle和一个伪元素让内容块处于容器中央。
```css
.father {
    width: 200px;
    height: 200px;
    border: 1px solid red;
}
.son {
    width: 50px;
    height: 50px;
    background-color: aliceblue;
}
.father::after,
.son {
    display: inline-block;
    vertical-align: middle;
}
.father::after {
    content: '';
    height: 100%;
}
```
### 4.flex
- 父元素 `display:flex;align-items:center;`
```css
.father {
    height: 200px;
    width: 200px;
    display: flex;
    align-items: center;
    background-color: cornflowerblue;
}

.son {
    background-color: antiquewhite;
}
```
### 5.transform
- 父元素`position:relative;`
- 子元素`position:absolute;top:50%;transform:translate(0,-50%)`
```css
.father {
    position: relative;
    height: 200px;
    width: 200px;
    background-color: cornflowerblue;
}

.son {
    position: absolute;
    top: 50%;
    transform: translate(0, -50%);
    background-color: antiquewhite;
}
```
### 6.盒模型
子元素是块级元素且高度已经设定，通过margin-top或margin-bottom实现。计算（父元素高度-子元素高度）/ 2；
```css
.father {
    width: 200px;
    height: 300px;
    border: 2px solid #ccc;
}
.son {
    width: 100px;
    height: 100px;
    margin-top: 100px;
    background: darkblue;
}
```

## 水平竖直居中
flex, 盒模型, transform+绝对定位
### flex
- 父元素`display:flex;justify-content: center;align-items: center;`
```css
.father {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100px;
    width: 100px;
    background-color: cadetblue;
}

.son {
    width: 20px;
    height: 20px;
    background-color: antiquewhite;
}
```
### 盒模型
```css
.father {
    height: 100px;
    width: 100px;
    background-color: cadetblue;
    overflow: hidden; /* 解决嵌套关系父级塌陷 */
}

.son {
    width: 20px;
    height: 20px;
    margin: 40px 0 0 40px;
    background-color: antiquewhite;
}
```
### 绝对定位+transform
```css
.father {
    height: 100px;
    width: 100px;
    background-color: cadetblue;
    position: relative;
}

.son {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: antiquewhite;
}
```
