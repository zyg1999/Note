//递归
function printListFromTailToHead(h) {
  if (h && h.next) {
    printListFromTailToHead(h.next)
  }
  console.log(h.val)
}