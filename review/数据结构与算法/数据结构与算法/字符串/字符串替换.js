//将空格替换为%20
//使用js的replace函数
function repalceSpace(str) {
  return str.replace(' ', '%20')
}
console.log(repalceSpace('Hello World!'))
//使用循环
/*思路：
 *遍历一遍字符串，统计空格个数，由此计算出字符串总长
 *从后面开始复制和替换，准备两个指针p1,p2,p1:原始字符串末尾，p2:替换后字符串末尾
 *向前移动指针p1，将p1指向字符逐个复制至p2，直至空格
 *碰到空格，将p1前移一格，p2之前插入%20，p2前移3
 *继续向前，重复以上操作，直至遍历完
 */
function repalceSpace2(str) {
  if (!str) return
  const oldLen = str.length
  let spaceNums = 0
  for (let i = 0; i < str.length; i++) {
    if (str[i] === ' ') spaceNums++
  }
  const newLen = oldLen + spaceNums * 2
  let p1 = oldLen
  let p2 = newLen
  while (p1 > 0 && p2 > p1) {
    if (str[p1] === ' ') {
      str[p2--] = '0'
      str[p2--] = '2'
      str[p2--] = '%'
    } else {
      str[p2--] = str[p1]
    }
    p1--
  }
  return str
}
console.log(repalceSpace2('Hello World!'))
