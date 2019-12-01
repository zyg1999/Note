## 一、margin塌陷（外边距重叠）问题的分类
#### 类型一：父子嵌套
```css
.farther{
    width:400px;
    height:400px;
    background: #00FFFF;
    margin-top: 20px;
  }  
.son{
    width:200px;
    height:200px;
    background: #FE2EF7;
    margin-top: 40px;
}
```
 我们对一对嵌套的盒子作如上样式设置，我们期望父级上边距为20px;子元素上边距为40px;实际上，父元素和子元素的上边距都变成了40px。

**结论：当一个块级元素包含在另一个块级元素之中时，子元素与父元素之间也会产生重叠现象，重叠后的外边距取其中最大者。**

Ps:margin重叠时margin值计算方法：
- 全部都为正值，取最大者；
- 不全是正值，直接相加；
- 无正值，取小。

	

针对类型一：触发父级BFC（Block Formatting Context ），改变父级的渲染规则(子元素与父级不属于同一个BFC)

* float的属性不是none; 
* overflow的属性不是visible; 
* position:absolute / fixed; 
* display：inline-block / table-cells / table-caption.

**解决方案各有优缺点，`例如：overflow:hidden; 溢出部分隐藏 但溢出部分有用时，不能用这个方法`   在解决这个问题时要根据实际情况进行选取。哪个不影响用哪个***

#### 类型二  
```css
.box1{
    width:200px;
    height:200px;
    background: #00FFFF;
    margin-bottom: 40px;
  }  
.box2{
    width:200px;
    height:200px;
    background: #FE2EF7;
    margin-top: 20px;
}
```
  &nbsp; &nbsp; &nbsp;   在css中对垂直相邻块级元素作如上样式设置，我们期望的间距是60px,实际上，它们之间的距离只有40px。

**结论：两个垂直相邻的块级元素，当上下两个边距相遇时，起外边距会产生重叠现象，且重叠后的外边距，等于其中较大者。**

针对类型二：

*   我们可以在设置边距时只设置一个边距来解决。

### 浮动模型
当盒子设置float：left/right就变成浮动元素。这些元素站队边界是父级边界。
```css
.father{
    border: 5px solid black;
    width: 300px;
  }  
.son1{
    border: 5px solid #f66;
    width: 100px;
    height: 100px;
    float: left;

}
.son2{
    border: 5px solid #f66;
    width:100px;
    height: 100px;
    float: left;
}
```
效果图：![这里写图片描述](https://img-blog.csdn.net/20180624160209473?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2dhb3NoYW55YW5nemhpXzE5OTk=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

**原因**: 浮动元素产生浮动流，所有产生浮动流的元素，块级元素看不到它们，但产生了bfc的元素和文本元素类属性（inline）以及文本都能看到浮动元素。

**解决方案：清除浮动流**

*  最后一个子元素添加
```css
p{
clear:both;
}
```

* 伪元素清除浮动：

```css
.father::after {
    content: '';
    display: block;
    clear: both;
}
```
> 解释一下为什么要用`display:block`?
> clear 很特殊，想让他生效，必须是块级元素才可以，而::after 是行级元素
* 触发父级BFC 
 内部把元素转换成inline-block，让父级元素可以“看到”浮动元素，从而解决问题。
 ![这里写图片描述](https://img-blog.csdn.net/20180624161527301?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2dhb3NoYW55YW5nemhpXzE5OTk=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)
### 补充
#### 1.行级元素，也叫内联元素 inline
**特点**
 - 内容决定元素所占位置
 - 不可以通过 CSS 改变宽高

 例 span，strong，em，a，del等
span 自带隐藏属性 display:inline; 可以通过改成 block 变成块级元素
 #### 2.块级元素，block
 **特点**
 - 独占一行
- 可以通过 CSS 改变宽高

例 div、p、h1…h6、ol、ul、dl、table、address、blockquote、form等
#### 3. 行级块元素 inline-block
**特点**
- 内容决定大小
- 可以改变宽高

例: img、input
我们可以通过 display 更改元素属性
