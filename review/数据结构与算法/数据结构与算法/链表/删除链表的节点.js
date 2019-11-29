function deleteListNode(head, val) {
  if (head === null) return null
  let temp = { val: -1, next: head }
  let p = temp
  while (p.next.val != val) {
    p = p.next
  }
  p.next = p.next.next
  return temp.next
}
