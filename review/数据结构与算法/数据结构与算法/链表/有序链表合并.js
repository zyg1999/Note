function mergeTowList(h1, h2) {
  if (!h1) return h2
  if (!h2) return h1
  let p = { val: -1, next: null },
    head = p
  while (h1 && h2) {
    if (h1.val < h2.val) {
      p.next = h1
      h1 = h1.next
    } else {
      p.next = h2
      h2 = h2.next
    }
    p = p.next
  }
  p.next = h1 || h2
  return head.next
}
