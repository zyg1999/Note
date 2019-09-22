import { Element, renderDom, setAttr } from './element'

let allPatches
let index = 0 // 哪个需要打补丁

function patch(node, patches) {
  allPatches = patches
  // 给某个元素打补丁
  walk(node)
}
function walk(node) {
  let current = allPatches[index++]
  let childNodes = node.childNodes
  //先序深度遍历
  childNodes.forEach(child => walk(child))
  if (current) {
    doPatch(node, current)
  }
}
function doPatch(node, patches) {
  patches.forEach(patch => {
    switch (patch.type) {
      case 'ATTR':
        for (let key in patch.attr) {
          let value = patch.attr[key]
          if (value) {
            setAttr(node, key, value)
          } else {
            node.removeAttribute(key)
          }
        }
        break
      case 'TEXT':
        node.textContent = patch.text
        break
      case 'REPLACE':
        let newNode = patch.newNode
        //判断是虚拟dom节点还是文本节点
        newNode =
          newNode instanceof Element
            ? renderDom(newNode)
            : document.createTextNode(newNode)
        node.parentNode.replaceChild(newNode, node)
        break
      case 'REMOVE':
        node.parentNode.removeChild(node)
        break
      default:
        break
    }
  })
}
export default patch
