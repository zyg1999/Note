### class继承
- extends关键字实现继承
- 在子类中必须调用super
```js
class Point {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

class ColorPoint extends Point {
  constructor(x, y, color) {
    super(x, y)//// 调用父类的constructor(x, y)
    this.color = color
  }
}

let p1 = new ColorPoint(1, 2, 'red')
```
> super关键字，表示父类的构造函数，用来新建父类的this对象。子类自己的this对象，必须先通过父类的构造函数完成塑造，得到与父类同样的实例属性和方法，然后再对其进行加工。

> 只有调用super之后，才可以使用this关键字

实质：**先将父类实例对象的属性和方法，加到this上面（所以必须先调用super方法），然后再用子类的构造函数修改this。**

**父类的静态方法可以被子类继承，不可被父类的实例继承**

### super关键字
#### 作函数
- 代表父类的构造函数。super内部的this指的是实例
- `super()`只能用在子类的构造函数之中
#### 作对象
##### 在普通函数中
- `super`指向父类的原型对象。也就是说`super`只能取到父类原型对象中的方法和属性。
- 在子类普通方法中通过`super`调用父类的方法时，方法内部的`this`指向当前的**子类实例**
##### 在静态方法中
- `super`指向父类
- 在子类的静态方法中通过`super`调用父类的方法时，方法内部的`this`指向**当前的子类**