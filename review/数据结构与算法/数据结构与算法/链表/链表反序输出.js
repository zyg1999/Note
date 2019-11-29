//典型的先进后出，使用栈
function printListFromTailToHead(h) {
  let stack = []
  while (h) {
    stack.push(h)
    h = h.next
  }
  while (stack.length != 0) {
    console.log(stack.pop().val)
  }
}
