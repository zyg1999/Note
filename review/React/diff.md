### 什么是虚拟DOM
用JS去按照DOM结构来实现的树形结构对象，可以叫做DOM对象
#### 创建虚拟DOM
element.js 编写创建虚拟dom并渲染成真正的dom
```js
//虚拟DOM类，构建实例对象，用来描述DOM
class Element{
    constructor(type, props, children) {
        this.type = type
        this.props = props
        this.children = children
  }
}
//创建虚拟DOM，返回虚拟节点(object)
function createElement(type,props,children){
    return new Element(type,props,children)
}
export {
    Element,
    createElement
}
```
#### 使用createElement
index.js
```js
// 首先引入对应的方法来创建虚拟DOM
import { createElement } from './element';

let virtualDom = createElement('ul', {class: 'list'}, [
    createElement('li', {class: 'item'}, ['a']),
    createElement('li', {class: 'item'}, ['b']),
    createElement('li', {class: 'item'}, ['c'])
]);

console.log(virtualDom);

```
createElement 接收三个参数，分别是type，props和children

**参数分析**
- type: 指定元素的标签类型，如'li', 'div', 'a'等
- props: 表示指定元素身上的属性，如class, style, 自定义属性等
- children: 表示指定元素是否有子节点，参数以数组的形式传入。
#### 渲染虚拟DOM为真实DOM
element.js
```js
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
```
#### 调用renderDom方法
```js
import { createElement, renderDom, append } from './element'
import diff from './diff'
import patch from './patch'
let virtualDom1 = createElement('ul', { class: 'list' }, [
  createElement('li', { class: 'item' }, ['a']),
  createElement('li', { class: 'item' }, ['b']),
  createElement('li', { class: 'item' }, ['c'])
])
let virtualDom2 = createElement('ul', { class: 'list' }, [
  createElement('li', { class: 'item' }, ['1']),
  createElement('li', { class: 'item' }, ['b']),
  createElement('li', { class: 'item' }, ['3'])
])

console.log(virtualDom1)

//将虚拟dom转化成真实dom并渲染到页面
let el = renderDom(virtualDom1)
append(el, window.root)
```
实现了虚拟DOM并进行了渲染真实DOM到页面中,所以下面来看diff
### DOM-diff
DOM-diff 比较两个对象的区别，采用深度优先遍历，返回一个patch对象，即补丁对象，根据特定操作解析patch,渲染

dif作用 :**根据两个虚拟对象创建出补丁，描述改变的内容，将这个补丁用来更新DOM**
#### diff.js
```js
function diff(oldTree, newTree) {
  // 声明变量patches用来存放补丁的对象
  let patches = {}
  // 第一次比较应该是树的第0个索引
  let index = 0
  // 递归树 比较后的结果放到补丁里
  walk(oldTree, newTree, index, patches)

  return patches
}
function walk(oldNode, newNode, index, patches) {
  // 每个元素都有一个补丁
  let current = []
  if (!newNode) {
    //若不存在，删除
    current.push({ type: 'REMOVE', index })
  } else if (isString(oldNode) && isString(newNode)) {
    //判断节点文本是否相同
    if (oldNode !== newNode) {
      current.push({ type: 'TEXT', text:newNode })
    }
  }
  //节点类型相同，去看属性是否相同
  else if (oldNode.type === newNode.type) {
    //比较属性
    let attr = diffAttr(oldNode.props, newNode.props)
    if (Object.keys(attr).length > 0) {
      current.push({ type: 'ATTR', attr })
    }
    // 如果有子节点，遍历子节点
    diffChildren(oldNode.children, newNode.children, patches)
  } else {
    //节点替换
    current.push({ type: 'REPLACE', newNode })
  }
  // 当前元素确实有补丁存在
  if (current.length) {
    // 将元素和补丁对应起来，放到大补丁包中
    patches[index] = current
  }
}
function isString(node) {
  return typeof node === 'string'
}
function diffAttr(oldAttr, newAttr) {
  let patch = {}
  //老节点属性与新节点属性差异，若删除 返回undefined
  for (let key in oldAttr) {
    if (oldAttr[key] !== newAttr[key]) {
      patch[key] = newAttr[key]
    }
  }
  //查看新增属性，打补丁
  for (let key in newAttr) {
    if (!oldAttr.hasOwnProperty(key)) {
      patch[key] = newAttr[key]
    }
  }
  return patch
}
let num = 0
function diffChildren(oldChildren, newChildren, patches) {
  oldChildren.forEach((child, index) => {
    walk(child, newChildren[index], ++num, patches)
  })
}
export default diff

```
#### diff 比较规则
- 新的 dom 节点不存在，{type:'REMOVE',index:xxx}
- 节点类型相同，看属性是否相同 产生一个属性的补丁包{type:'ATTRS',attrs:{class:'list-gruop'}}
- 节点类型不同，采用替换模式{type:'REPLACE',newNode:newNode}
- 文本变化 {type:'TEXT',text:'1'}
#### walk解析
每个元素都有一个补丁，所以需要创建一个放当前补丁的数组

- 如果没有new节点的话，说明进行了删除，就直接将type为REMOVE的类型放到当前补丁里，并标记标号
```js
if (!newNode) {
    current.push({ type: 'REMOVE', index });
}
```
- 如果新老节点是文本的话，判断一下文本是否一致，再指定类型TEXT并把新节点放到当前补丁
```js
else if (isString(oldNode) && isString(newNode)) {
    if (oldNode !== newNode) {
        current.push({ type: 'TEXT', text: newNode });
    }
}
```
- 如果新老节点的类型相同，那么就来比较一下他们的属性props
    - 属性比较(diffAttr)
        - 比较新老相同Attr，修改赋给patch
        - 把newAttr的键值对赋给patch对象上并返回此对象
    - 然后如果有子节点的话就再比较一下子节点的不同（diffChildren），再调一次walk（先序深度优先）
        - 遍历oldChildren，然后递归调用walk再通过child和newChildren[index]去diff
    
```js
    else if (oldNode.type === newNode.type) {
        // 比较属性是否有更改
        let attr = diffAttr(oldNode.props, newNode.props);
        if (Object.keys(attr).length > 0) {
            current.push({ type: 'ATTR', attr });
        }
        
        // 如果有子节点，遍历子节点
        diffChildren(oldNode.children, newNode.children, patches);
    }
```
- 上面三个如果都没有发生的话，那就表示节点单纯的被替换了，type为REPLACE，直接用newNode替换即可
```js
else {
     current.push({ type: 'REPLACE', newNode});
}
```
- 当前补丁里确实有值的情况，就将对应的补丁放进大补丁包里
```js
if (current.length > 0) {
    // 将元素和补丁对应起来，放到大补丁包中
    patches[index] = current;
}
```
### patch补丁更新
patch.js
```js
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
        console.log(patch.text)
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
```
#### 解析patch
- 将所有补丁包存入allPatches
- patch方法接收两个参数(node, patches)
    - 在方法内部调用walk(node)方法，给某个元素打上补丁
- walk方法里获取所有的子节点
    - 给子节点也进行先序深度优先遍历，递归walk
    - 如果当前的补丁是存在的，那么就对其打补丁(doPatch)
- doPatch(node, patches)
    - 对补丁进行遍历解析，进行相应dom操作
- 将patch方法默认导出方便调用
### 使用Diff
```js
import { createElement, renderDom, append } from './element'
import diff from './diff'
import patch from './patch'
let virtualDom1 = createElement('ul', { class: 'list' }, [
  createElement('li', { class: 'item' }, ['a']),
  createElement('li', { class: 'item' }, ['b']),
  createElement('li', { class: 'item' }, ['c'])
])
let virtualDom2 = createElement('ul', { class: 'list' }, [
  createElement('li', { class: 'item' }, ['1']),
  createElement('li', { class: 'item' }, ['b']),
  createElement('li', { class: 'item' }, ['3'])
])
console.log(virtualDom1)
//将虚拟dom转化成真实dom并渲染到页面
let el = renderDom(virtualDom1)
append(el, window.root)

let patches = diff(virtualDom1, virtualDom2)
console.log(patches)
patch(el, patches)
```
### DOM-diff过程
- 用 js 对象模拟虚拟 DOM
- 将虚拟 DOM 转换为真实 DOM 插入页面
- 发生修改了虚拟DOM，比较新老差异，得到差异对象
- 将差异对象应用到真实DOM树