function diff(oldTree, newTree) {
  // 声明变量patches用来存放补丁的对象
  let patches = {}
  // 第一次比较应该是树的第0个索引
  // 递归树，从根节点开始 比较后的结果放到补丁里
  walk(oldTree, newTree, 0, patches)

  return patches
}
function walk(oldNode, newNode, index, patches) {
  // 每个元素都有一个补丁
  let current = []
  if (!newNode) {
    //删除
    current.push({ type: 'REMOVE', index })
  } else if (isString(oldNode) && isString(newNode)) {
    //判断节点文本是否相同
    if (oldNode !== newNode) {
      current.push({ type: 'TEXT', text: newNode })
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
