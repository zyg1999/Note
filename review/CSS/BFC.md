### 什么是BFC
BFC全称是Block Formatting Context，即块格式化上下文。首先来看看什么是视觉格式化模型(FC)。
### 视觉格式模型
视觉格式化模型(visual formatting model)是用来**处理文档并将它显示在视觉媒体上的机制**，它也是CSS中的一个概念。

视觉格式化模型定义了盒（Box）的生成，盒主要包括了块盒、行内盒、匿名盒（没有名字不能被选择器选中的盒）以及一些实验性的盒（未来可能添加到规范中）。盒的类型由display属性决定。

### 块盒（block box）
特性：

- display为block，list-item或 table时，它是块级元素；
- 视觉上呈现为块，竖直排列；
- 块级盒参与(块格式化上下文)；
- 每个块级元素至少生成一个块级盒，称为主要块级盒(principal block-level box)。一些元素，比如<li>，生成额外的盒来放置项目符号，不过多数元素只生成一个主要块级盒。 
- 块状元素排斥其他元素与其位于同一行，可以设定元素的宽（width）和高（height），块级元素一般是其他元素的容器，可容纳块级元素和行内元素

### 行内盒（inline box）
特性：
- 当元素的CSS属性display的计算值为inline，inline-block或inline-table时，称它为行内级元素；
- 视觉上它将内容与其它行内级元素排列为多行；典型的如段落内容，有文本(可以有多种格式譬如着重)，或图片，都是行内级元素；
- 行内级元素生成行内级盒(inline-level boxes)，参与行内格式化上下文(inline formatting context)。同时参与生成行内格式化上下文的行内级盒称为行内盒(inline boxes)。所有display:inline的非替换元素生成的盒是行内盒；
- 不参与生成行内格式化上下文的行内级盒称为原子行内级盒(atomic inline-level boxes)。这些盒由可替换行内元素，或 display 值为 inline-block 或 inline-table 的元素生成，不能拆分成多个盒；
- 行内元素不可设置宽高，但可以与其他行内元素位于同一行，行内元素内一般不可以包含块级元素。行内元素的高度一般由元素内部的字体大小决定，宽度由内容的长度控制。
### 三个定位方案
在定位的时候，浏览器会根据元素的盒类型和上下文对这些元素进行定位，可以说盒就是定位的基本单位。定位时，有三种定位方案，分别是常规流，浮动、绝对定位。
#### 常规流
- 在常规流中，盒一个接着一个排列;
- **在块级格式化上下文里面， 它们竖着排列**；
- **在行内格式化上下文里面， 它们横着排列**;
- 当position为static或relative，并且float为none时会触发常规流；
- 对于**静态定位**(static positioning)，position: static，盒的位置是**常规流布局**里的位置；
- 对于**相对定位**(relative positioning)，position: relative，盒偏移位置由这些属性定义top，bottom，left，right。即使**有偏移**，仍然**保留原有的位置**，**其它常规流不能占用这个位置。**
#### 浮动
- 盒称为浮动盒(floating boxes)；
- 它位于当前行的开头或末尾；
- 这导致常规流环绕在它的周边，除非设置 clear 属性；或者触发BFC
- 浮动会导致父级坍塌 [解决办法](https://github.com/zyg1999/Note/blob/master/review/css/margin%E5%A1%8C%E9%99%B7%E3%80%81%E6%B5%AE%E5%8A%A8%E6%A8%A1%E5%9E%8B.md)
#### 绝对定位
- 如果元素的属性position为absolute或fixed，它是绝对定位元素；
- 绝对定位方案，盒从常规流中被移除，不影响常规流的布局；
- 它的定位相对于它的包含块，相关CSS属性：top，bottom，left及right；
- 对于position: absolute，元素定位将相对于最近的一个非static的父元素，如果没有则相对于body；
### 块格式化上下文(BFC)
块格式上下文是页面CSS 视觉渲染的一部分，用于**决定块盒子的布局及浮动相互影响范围的一个区域。**
#### BFC创建方法
- 根元素或包含根元素的元素
- 浮动 (元素的 float 不为 none)
- 绝对定位元素 (元素的 position 为 absolute 或 fixed)
- `display:inline-block / table-cells / table-caption.` 
- 匿名表格单元格元素（元素的 display为 table、table-row、 table-row-group、table-header-group、table-footer-group（分别是HTML table、row、tbody、thead、tfoot的默认属性）或 inline-table`）
- overflow 的值不为 visible 的元素
- display 的值为 float-root的元素
- 弹性元素（display为 flex 或 inline-flex元素的直接子元素）
- 网格元素（display为 grid 或 inline-grid 元素的直接子元素）
- 多列容器（元素的 column-count 或 column-width 不为 auto，包括 column-count为1`）

### BFC范围
BFC包含创建该上下文元素的所有子元素，但不包括创建了新BFC的子元素的内部元素。
```html
<div id='div_1' class='BFC'>
    <div id='div_2'>
        <div id='div_3'></div>
        <div id='div_4'></div>
    </div>
    <div id='div_5' class='BFC'>
        <div id='div_6'></div>
        <div id='div_7'></div>
    </div>
</div>
```
根据定义，#div_1创建了一个块格式上下文，这个上下文包括了`#div_2、#div_3、#div_4、#div_5`。由于#div_5创建了新的BFC，所以#div_6和#div_7就被排除在外层的BFC之外。

也就是说，**一个元素不能同时存在于两个BFC中。**

这也是为什么BFC可以解决浮动触发的问题，因为起到了隔离作用。
### 布局规则
- 内部的Box会在垂直方向，一个接一个地放置。Box垂直方向的距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生重叠
- BFC的区域不会与float box重叠。（清除浮动）
- BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。（解决margin塌陷）
- 计算BFC的高度时，浮动元素也参与计算(解决父级高度塌陷)
### 应用
- 自适应两栏布局
- 可以阻止元素被浮动元素覆盖，清除浮动
- 分属于不同的BFC时可以阻止margin重叠
- 解决父元素高度塌陷
