/*题目描述：
 * 一个二维数组，每一行从左至右递增，每一列从上到下递增。输入一个整数，判断数组中是否含有该整数
 */
/*思路：
 *1.从右上角开始比较，若数字大于被查找的数，column--(因有序而排除整列，缩小查找范围);若小于则row++
 *2.循环查找条件为：row < rows && column >= 0
 */
/*时间复杂度
 *O(n)
 */
/* 注意的点：
 * 同样，我们可以选取左下角的数字进行比较。但不能选左上或右下，因为既不能剔除行也不能剔除列。
 */

function findNum(arr, rows, columns, number) {
  let found = false
  if (arr && rows > 0 && columns > 0) {
    let row = 0
    let column = columns - 1
    while (row < rows && column >= 0) {
      if (arr[row][column] === number) {
        found = true
        break
      } else if (arr[row][column] > number) {
        column--
      } else {
        row++
      }
    }
  }
  return found
}
console.log(findNum([[1, 2, 3], [3, 4, 5]], 2, 3, 4))
