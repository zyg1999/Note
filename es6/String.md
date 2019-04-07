### codePointAt()方法
```js
var s = "𠮷a";

s.length // 3
s.charAt(0) // ''
s.charAt(1) // ''
s.charCodeAt(0) // 55362
s.charCodeAt(1) // 57271
s.codePointAt(0);//134071
s.codePointAt(1) // 57271
s.codePointAt(2) // 97
```
“𠮷”字码点是0x20BB7,UTF-16 编码为0xD842 0xDFB7（十进制为55362 57271），需要4个字节储存。JavaScript 不能正确处理，字符串长度会误判为2，而且charAt方法无法读取整个字符，charCodeAt方法只能分别返回前两个字节和后两个字节的值。codePointAt 方法在第一个字符上，正确地识别了“𠮷”，返回了它的十进制码点 134071（即十六进制的20BB7）。在第二个字符（即“𠮷”的后两个字节）和第三个字符“a”上，codePointAt方法的结果与charCodeAt方法相同。

**上述codePointAt参数仍是不正确的，a的正确位置应该是1而不是2，此时可使用for···of**
```js
let s="𠮷a";
for(let ch of s){
    console.log(ch.codePointAt(0));
}
//134071
//97
```
> for···of循环可以正确识别32位UTF-16字符。

**charCodeAt返回码点10进制值，若想返回16进制，利用`tosting()方法`**

**检测一个字符占用的编码单元数量**
```js
function is32Bit(c){
    return c.codePointAt(0)>0xFFFF;
}
console.log(is32Bit("吉"));//true
console.log(is32Bit("a"));//false
```
> charCodeAt()方法只是返回位置0处的第一个编码单元，codePointAt()方法返回完整的码位。

### String.fromCodePoint()
此方法可以根据指定码位生成一个字符。
```js
console.log(String.fromCodePoint(134071));//𠮷
```

> fromCodePoint方法定义在String对象上，而codePointAt方法定义在字符串的实例对象上。

### 字符串的遍历器接口
**字符串可以被`for···of`遍历，该遍历器的优点是可以识别大于0xFFFF的码点，传统的for循环无法识别这样的码点。**
```js
let text = String.fromCodePoint(0x20BB7);

for (let i = 0; i < text.length; i++) {
  console.log(text[i]);
}
// " "
// " "

for (let i of text) {
  console.log(i);
}
// "𠮷"
```
### includes(), startsWith(), endsWith()
- includes()：返回布尔值，表示是否找到了参数字符串。
- startsWith()：返回布尔值，表示参数字符串是否在原字符串的头部。
- endsWith()：返回布尔值，表示参数字符串是否在原字符串的尾部。
- 以上方法均支持第二个参数，即开始搜索位置。
```js
let s='Hellow World';
console.log(s.startsWith('H',0));//true
console.log(s.endsWith('d',5));//false
console.log(s.includes('H',6));//false
```
> 观察以上代码不难发现，在我们不传第二个参数时，三个函数的默认搜索位置是不同的。`endsWith`从后往前，其余两个是从前往后。在传参后，endsWith针对前n个字符，其余两个搜索从第n个位置直到字符串结束。

### repeat()
该方法返回一个新的字符串，表示将原字符串重复几次。
简单总结一下**参数规则**：
**小数取整，负数或无穷报错，0到-1等同0，NaN等同0，字符串会被转化为数字**.
### 字符串补全 padStart()，padEnd()
` padStart() 用于头部补全 padEnd() 用于尾部补全`
- 共接受两个参数，第一个参数是字符串补全生效的最大长度，第二个参数是用来补全的字符串。
- 若原字符串长等于或大于最大长度，该方法不生效，返回原字符串。
`'xxx'.padStart(2, 'ab') // 'xxx'`
- 若用来补全的字符串与原字符串两者长度之和大于最大长度，则截去超出位数的补全字符串。
`'abc'.padStart(10, '0123456789')// '0123456abc'`
- 省略第二个参数，默认使用空格补全。
- padStart()的常见用途
   - 为数值补全指定位数。
   ```js
   '1'.padStart(10, '0') // "0000000001"
   '12'.padStart(10, '0') // "0000000012"
   ```
   - 提示字符串格式
   ```js
   '12'.padStart(10, 'YYYY-MM-DD') // "YYYY-MM-12"
   '09-12'.padStart(10, 'YYYY-MM-DD') // "YYYY-09-12"
   ```
### matchAll() 
返回一个正则表达式在当前字符串的所有匹配
### 模板字符串
输出模板我们通常这样写
```js
let innerHtml=
'There are <b>' + basket.count + '</b> ' +
  'items in your basket, ' +
  '<em>' + basket.onSale +
  '</em> are on sale!'
```
这样的写法是十分繁琐的，es6引入模板字符串就是为了解决这个问题。
模板字符串是字符串的增强版，用 ` 标识。可以用来当做普通字符串，可以定义多行字符串，可以在字符串中嵌入变量。
```js
//普通字符串
`I am happy,and you?`

//多行字符串（输出保留空格，可用tirm方法消除）
`I am happy,
and you?`

//嵌入变量
let person={
    name:"Mike",
    time:"today"
};
console.log(`Hello ${person.name}, how are you ${person.time}?`);//"Hello Mike, how are you today?"
```
- 模板字符串中嵌入变量，需要将变量名写在${}之中。大括号内部可以放入任意的 JavaScript 表达式，可以进行运算，以及引用对象属性和函数调用。若未声明则报错。
- 若在模板字符串中需要使用反引号，则前面要用反斜杠转义。
- 如果需要引用模板字符串本身，在需要时执行，可以写成函数。

**模板字符串嵌套**
```js
const tmpl = addrs => `
  <table>
  ${addrs.map(addr => `
    <tr><td>${addr.first}</td></tr>
    <tr><td>${addr.last}</td></tr>
  `).join('')}
  </table>
`;
const data = [
    { first: '<Jane>', last: 'Bond' },
    { first: 'Lars', last: '<Croft>' },
];

console.log(tmpl(data));
```
### 标签模板
模板字符串可以紧跟在一个函数名后面，该函数将被调用来处理这个模板字符串
```js
let x = 'Hi', y = 'Mike';
let litrerals=[ "", ", I am ", "" ];
function message(literals, ...values) {
	let result = literals.reduce((prev, next, i) => {
	    let value = values[i - 1];
	    return prev + value + next;
	});
	return result;
console.log(message(litrerals,x,y));//'Hi, I am Mike'
//或如下调用，可省去litrerals定义
console.log(message`${x},I am ${y}`);
```
**过滤 HTML 字符串，防止用户输入恶意内容**
```js
let sender = '<script>alert("abc")</script>';
let message =
  SaferHTML`<p>${sender} has sent you a message.</p>`;

function SaferHTML(templateData) {
  let s = templateData[0];
  for (let i = 1; i < arguments.length; i++) {
    let arg = String(arguments[i]);

    s += arg.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

    s += templateData[i];
  }
  return s;
}
```
