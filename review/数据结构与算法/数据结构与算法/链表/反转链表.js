function reserveList(head) {
  let newHead = head,
    cur = null
  while (head && head.next) {
    cur = head.next
    head.next = cur.next
    cur.next = newHead
    newHead = cur
  }
  return newHead
}
