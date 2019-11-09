/* 
给定一个包含 n 个整数的数组 nums，判断 nums 中是否存在三个元素 a，b，c ，使得 a + b + c = 0 ？找出所有满足条件且不重复的三元组。

注意：答案中不可以包含重复的三元组。

例如, 给定数组 nums = [-1, 0, 1, 2, -1, -4]，

满足要求的三元组集合为：
[
  [-1, 0, 1],
  [-1, -1, 2]
] 
*/
/* 
1.对数组排序
2.对数组遍历，确定一个基准值nums[i]
3.在数组中找两个基点left(i+1)和right(length-1)
4.判断nums[i]+nums[left]+nums[right]是否等于0，若相等，加入结果，分别将left、right移动一位
5.若结果>0,right左移一位，向结果逼近
6.若结果<0,left右移一位，向结果逼近 
*/
var threeNums = function(nums) {
  const reslut = []
  nums.sort((a, b) => a - b)
  for (let i = 0; i < nums.length; i++) {
    if (i && nums[i] === nums[i - 1]) {
      continue
    }
    let left = i + 1
    let right = nums.length - 1
    while (left < right) {
      const sum = nums[i] + nums[left] + nums[right]
      if (sum > 0) {
        right--
      } else if (sum < 0) {
        left++
      } else {
        reslut.push([nums[i], nums[left], nums[right]])
        //跳过重复值
        while (nums[left] === nums[left - 1]) {
          left++
        }
        while (nums[right] === nums[right + 1]) {
          right--
        }
      }
    }
  }
  return reslut
}
