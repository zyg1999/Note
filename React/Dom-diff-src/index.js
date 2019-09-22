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
