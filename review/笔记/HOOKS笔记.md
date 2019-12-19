### useState

- 每一次`setState`操作都会引发`rerender`  
- 可以以函数作为参数，这时可以获取到最新`state`（第一个回调参数）
- 底层是一个环形链表，如下图

![useState](/pic/useState.png)

这也是为什么hook不能写在代码块里的原因，一个hook对象的next指向下一个hooks，所以如果把hook1放到一个if语句中，当这个没有执行时，hook2拿到的state其实是上一次hook1执行后的state（而不是上一次hook2执行后的）

#### useState 运作流程

**初始化：** 构建dispatcher函数和初始值

**更新时：**

1. 调用dispatcher函数，按序插入update(其实就是一个action)
2. 收集update，调度一次React的更新
3. 在更新的过程中将`ReactCurrentDispatcher.current`指向负责更新的Dispatcher
4. 执行到函数组件App()时，`useState`会被重新执行，在resolve dispatcher的阶段拿到了负责更新的dispatcher。
5. `useState`会拿到Hook对象，`Hook.query`中存储了更新队列，依次进行更新后，即可拿到最新的state
6. 函数组件App()执行后返回的nextChild中的count值已经是最新的了。FiberNode中的`memorizedState`也被设置为最新的state
7. Fiber渲染出真实DOM。更新结束。

### useEffect

- 每次运行都相当于class component 中的一次 render，每轮都保存他的闭包；因此useEffect保留了每轮的state和props状态，若依赖不更新，则状态不更新

### useLayoutEffect

- 在`DOM`渲染前执行；而`useEffect`在渲染后执行
- 利用`useLayoutEffect`在DOM渲染前执行的特性，可避免由于DOM渲染后进行操作导致的白屏问题

#### useCallback

- 缓存函数
- 通过手动控制依赖，目的是减少因函数更新导致自组件更新的性能问题

#### useMemo

- 缓存能力；适用于重计算的场景下，减少重复计算次数
- 可缓存组件，起到类似class中shouldComponentUpdate的作用，手动管理以来控制自组件更新（成本高）

### useRef

- 存储对DOM的引用

- 存储mutable的不参与UI显示的变量，可在每一轮render中共享

#### useReducer

实际是对useState的一层封装

```react
function useReducer(reducer,initialState){
  const [state,setState] = useState(initialState);
  
  function dispatch(action){
    const nextState = reducer(state,action);
    setState(nextState);
  }
  return [state,dispatch]
}
```

#### useContext

当有一个Context，并且子组件在Provider包裹，可使用useContext去获取值

可使用Context + useReducer + useContext结合打造Redux