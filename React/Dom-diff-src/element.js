//虚拟dom元素的类
class Element {
  constructor(type, props, children) {
    this.type = type
    this.props = props
    this.children = children
  }
}
//设置属性
function setAttr(node, key, value) {
  switch (key) {
    case 'value':
      if (
        node.tagName.toUpperCase() === 'INPUT' ||
        node.tagName.toUpperCase() === 'TEXTAREA'
      ) {
        node.value = value
      } else {
        node.setAttribute(key, value)
      }
      break
    case 'style':
      node.style.cssText = value
      break
    default:
      node.setAttribute(key, value)
      break
  }
}
//返回虚拟节点
function createElement(type, props, children) {
  return new Element(type, props, children)
}
//将虚拟节点转化为真实dom
function renderDom(eleObject) {
  let el = document.createElement(eleObject.type)
  for (let key in eleObject.props) {
    //设置属性
    setAttr(el, key, eleObject.props[key])
  }
  //遍历子元素 如果是虚拟dom则继续渲染，不是就代表文本节点
  eleObject.children.forEach(child => {
    child =
      child instanceof Element
        ? renderDom(child)
        : document.createTextNode(child)
    el.appendChild(child)
  })
  return el
}
//将元素插入到页面内
function append(el, root) {
  root.appendChild(el)
}
export { Element, createElement, renderDom, append, setAttr }
