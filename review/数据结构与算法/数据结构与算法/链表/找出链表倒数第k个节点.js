//front先走，当index>k时behind再走 双指针

function FindKthToTail(head, n) {
  if (!head || !n) return undefined
  let front = head,
    behind = head
  let index = 1
  while (front.next) {
    index++
    front = front.next
    if (index > n) {
      behind = behind.next
    }
  }
  return n <= index && behind
}
