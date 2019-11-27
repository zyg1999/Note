### hook为什么不能写到if代码块里面

react hook底层是基于链表实现，调用的条件是每次组件被render的时候都会顺序执行所有的hooks 

