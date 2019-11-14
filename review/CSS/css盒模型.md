## box-sizing属性及对应盒模型
CSS中的 box-sizing 属性定义 应该如何计算一个元素的总宽度和总高度。

**属性值**

- content-box

默认值，**标准盒子模型**。 width 与 height 只包括内容的宽和高， 不包括边框（border），内边距（padding），外边距（margin）。

尺寸计算公式：

> width = 内容的宽度

> height = 内容的高度

- border-box

 **怪异盒模型，即IE盒模型**。width 和 height 属性包括内容，内边距和边框，但不包括外边距。
 
 在这种模型下，设置 padding,形象地说就是把盒子content往进挤。
 
尺寸计算公式：
> width = border + padding + 内容的宽度

> height = border + padding + 内容的高度


## 举例
```html
<div class="content-box">Content box</div>
<br>
<div class="border-box">Border box</div>
```
```css
div {
  width: 160px;
  height: 80px;
  padding: 20px;
  border: 8px solid red;
  background: yellow;
}

.content-box { 
  box-sizing: content-box; 
  /* Total width: 160px + (2 * 20px) + (2 * 8px) = 216px
     Total height: 80px + (2 * 20px) + (2 * 8px) = 136px
     Content box width: 160px
     Content box height: 80px */
}

.border-box { 
  box-sizing: border-box;
  /* Total width: 160px
     Total height: 80px
     Content box width: 160px - (2 * 20px) - (2 * 8px) = 104px
     Content box height: 80px - (2 * 20px) - (2 * 8px) = 24px */
}
```