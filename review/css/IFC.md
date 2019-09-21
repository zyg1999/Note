### 什么是IFC?
行内级格式化上下文。
IFC的line box（线框）高度由其包含行内元素中最高的实际高度计算而来（不受到竖直方向的padding/margin影响)
### 布局规则

- 内部的盒子会在水平方向，一个接一个地放置。
- 这些盒子垂直方向的起点从包含块盒子的顶部开始。
- 摆放这些盒子的时候，它们在水平方向上的 padding、border、margin 所占用的空间都会被考虑在内。
- 在垂直方向上，这些框可能会以不同形式来对齐（vertical-align）：它们可能会使用底部或顶部对齐，也可能通过其内部的文本基线（baseline）对齐。
- 能把在一行上的框都完全包含进去的一个矩形区域，被称为该行的行框（line box）。行框的宽度是由包含块（containing box）和存在的浮动来决定。
- IFC中的 line box 一般左右边都贴紧其包含块，但是会因为float元素的存在发生变化。float 元素会位于IFC与与 line box 之间，使得 line box 宽度缩短。
- IFC 中的 line box 高度由 CSS 行高计算规则来确定，同个 IFC 下的多个 line box 高度可能会不同（比如一行包含了较高的图片，而另一行只有文本）
- 当 inline-level boxes 的总宽度少于包含它们的 line box 时，其水平渲染规则由 text-align 属性来确定，如果取值为 justify，那么浏览器会对 inline-boxes（注意不是inline-table 和 inline-block boxes）中的文字和空格做出拉伸。
- 当一个 inline box 超过 line box 的宽度时，它会被分割成多个boxes，这些 boxes 被分布在多个 line box 里。如果一个 inline box 不能被分割（比如只包含单个字符，或 word-breaking 机制被禁用，或该行内框受 white-space 属性值为 nowrap 或 pre 的影响），那么这个 inline box 将溢出这个 line box。

### 应用

**水平居中**：当一个块要在环境中水平居中时，设置其为 inline-block 则会在外层产生 IFC，通过设置父容器 text-align:center 则可以使其水平居中。
> 设置一个块为 inline-block ，以单个封闭块来参与外部的 IFC，而内部则生成了一个 BFC。

**垂直居中**：创建一个IFC，用其中一个元素撑开父元素的高度，然后设置其 vertical-align:middle，其他行内元素则可以在此父元素下垂直居中。