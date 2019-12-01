#### algin-items、algin-self和algin-content

algin-items和algin-content都是设置在容器上，对子元素起作用

algin-self

#### justify-content 的sapce-between  space-around

![image](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015071010.png)
- flex-start（默认值）：左对齐
- flex-end：右对齐
- center： 居中
- space-between：**两端对齐，项目之间的间隔都相等。**
- space-around：**每个项目两侧的间隔相等**。所以，项目之间的间隔比项目与边框的间隔大一倍。

### flex：1是什么意思

首先这是 flex-grow（拉伸因子）、flex-shrink（收缩因子）、flex-basis（初始值）缩写

默认值  0 1 auto 

flex:1时，值为1 1 0

```css
flex-grow : 1; // 这意味着div将以与窗口大小相同的比例增长
flex-shrink : 1; // 这意味着div将以与窗口大小相同的比例缩小
flex-basis : 0; // 这意味着div没有这样的起始值，并且将根据可用的屏幕大小占用屏幕。例如： 如果包装器中有3个div，则每个div将占用33％。
```

