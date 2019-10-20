```js
const box = document.getElementById('box')
drag(box)

function drag(elem) {
  let offsetX = 0
  let offsetY = 0
  elem.addEventListener('mousedown', e => {
    offsetX = -e.offsetX
    offsetY = -e.offsetY
    window.addEventListener('mousemove', handleMouseMove)
  })
  elem.addEventListener('mouseup', () => {
    window.removeEventListener('mousemove', handleMouseMove)
  })
  function handleMouseMove(e) {
    elem.style.left = `${e.pageX + offsetX}px`
    elem.style.top = `${e.pageY + offsetY}px`
  }
}    
```
- offsetX/offsetY为鼠标点击处，相对于元素的位置
- pageX/pageY 鼠标指针位置相对于当前窗口的 坐标，其中客户区域包括窗口自身的控件和滚动条