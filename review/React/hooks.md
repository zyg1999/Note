### useState

返回`state`和一个更新`state`的函数

> 传入相同原始值，不会重新渲染。
>
> 传递一个对象，无论是否一样都会渲染

 `useState` 不会自动合并更新对象 ，可使用函数式setState，结合展开运算符，合并对象。

```react
setState(prevState => {
  // 也可以使用 Object.assign
  return {...prevState, ...updatedValues};
});
```

useState()方法可以传递值也可以传递函数，可延迟初始化，此函数在多次渲染时只运行一次。

```react
function App(props) {
  const [count, setCount] = useState(() => {
    console.log('only run one time');
    return props.defaultCount || 0;
  });
  return <div></div>;
}
```

### useEffect

- 副作用调用时机
  - mount 后
  - update 前
  - unmount 前

useEffect 返回函数的作用是清除上一次副作用遗留下来的状态。

```react
function App() {
  const [count, setCount] = useState(0);
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  console.log('======== render ======== ');

  const onResize = () => {
    setSize({
      width: window.innerWidth,
      height: window.innerHeight
    });
  };

  useEffect(() => {
    document.title = count;
  });

  useEffect(() => {
    window.addEventListener('resize', onResize, false);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const onClick = () => {
    console.log('click');
  };

  // 需要频繁清理并绑定的副作用
  useEffect(() => {
    document.getElementById('size').addEventListener('click', onClick);
    return () => {
      document.getElementById('size').removeEventListener('click', onClick);
    };
  });

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>
        {' '}
        Count: {count} 点了之后 id 为 size 的元素就会被替换
      </button>

      <br />
      {count % 2 ? (
        <button id="size">
          size: {size.width} x {size.height}，点击有console
        </button>
      ) : (
        <div id="size">
          size: {size.width} x {size.height}，点击有console
        </div>
      )}
    </div>
  );
}
```

#### 😎每次运行都有它自己的所有东西

```react
function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      console.log(`You clicked ${count} times`);
    }, 3000);
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
//连续点击3次，打印如下
// You clicked 0 times
// You clicked 1 times
// You clicked 2 times
```

```react
componentDidUpdate() {
    setTimeout(() => {
      console.log(`You clicked ${this.state.count} times`);
    }, 3000);
}
//连续点击3次，打印如下
// You clicked 0 times
// You clicked 1 times
// You clicked 1 times
```

 `this.state.count`总是指向最新的count值 ， 是由于React 修改了class中的`this.state`使其指向最新状态 。

使用闭包也可以解决class中的问题

```react
componentDidUpdate() {
    const count = this.state.count;
    setTimeout(() => {
      console.log(`You clicked ${count} times`);
    }, 3000);
  }
```

 

对于Hooks来说，**当封闭的值始终不会变的情况下闭包是非常棒的。这使它们非常容易思考因为你本质上在引用常量。**  props和state在某个特定渲染中是不会改变的。因此 **每一个**组件内的函数（包括事件处理函数，effects，定时器或者API调用等等）会捕获某次渲染中定义的props和state。 

在hooks中如果想读取最新的值，使用Ref。

#### 🤔effect怎样清理？

```react
useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.id, handleStatusChange);
    };
});
```

 假设第一次渲染的时候`props`是`{id: 10}`，第二次渲染的时候是`{id: 20}` 。过程如下

- **React 渲染`{id: 20}`的UI。**
- 浏览器绘制。我们在屏幕上看到`{id: 20}`的UI。
- **React 清除`{id: 10}`的effect。**
- React 运行`{id: 20}`的effect。

> 为什么effect可以清除上一次的props?
>
> 前面已经说了， *组件内的每一个函数（包括事件处理函数，effects，定时器或者API调用等等）会捕获定义它们的那次渲染中的props和state。* 所以 effect的清除并不会读取“最新”的props。它只能读取到定义它的那次渲染中的props值： 



------

假如说有个递增效果要写在effect中，计数器递增效果，类似于`setCount(c => c + 1)`这样的更新形式比`setCount(count + 1)` 能减少effect的依赖（后者需要在effect中添加count依赖），但是这样灵活性不够强，假如说有两个互相依赖的状态，或者我们想基于一个prop来计算下一次的state，它并不能做到 。

#### 解耦来自Actions的更新

举个例子： 定时器会每次在count上增加一个`step`值 。

```react
function Counter() {
  const [count, setCount] = useState(0);
  const [step, setStep] = useState(1);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => c + step);
    }, 1000);
    return () => clearInterval(id);
  }, [step]);

  return (
    <>
      <h1>{count}</h1>
      <input value={step} onChange={e => setStep(Number(e.target.value))} />
    </>
  );
}
```

这样写修改`step`会重启定时器 - 因为它是依赖项之一 。 假如我们不想在`step`改变后重启定时器 。该怎样解除step依赖？**当你想更新一个状态，并且这个状态更新依赖于另一个状态的值时，你可能需要用`useReducer`去替换它们。**

 当你写类似`setSomething(something => ...)`这种代码的时候，也许就是考虑使用reducer的契机。reducer可以让你**把组件内发生了什么(actions)和状态如何响应并更新分开表述。** 

```react
function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { count, step } = state;

  useEffect(() => {
    const id = setInterval(() => {
      dispatch({ type: 'tick' });
    }, 1000);
    return () => clearInterval(id);
  }, [dispatch]);

  return (
    <>
      <h1>{count}</h1>
      <input value={step} onChange={e => {
        dispatch({
          type: 'step',
          step: Number(e.target.value)
        });
      }} />
    </>
  );
}

const initialState = {
  count: 0,
  step: 1,
};

function reducer(state, action) {
  const { count, step } = state;
  if (action.type === 'tick') {
    return { count: count + step, step };
  } else if (action.type === 'step') {
    return { count, step: action.step };
  } else {
    throw new Error();
  }
}
//这样写，有人会问那要是step是Counter的参数看你还怎么办？
//这种情况下我们可以将reducer写到Counter里面（这种模式会使一些优化失效，所以你应该避免滥用它）
//你可能会疑惑：这怎么可能？在之前渲染中调用的reducer怎么“知道”新的props？答案是当你dispatch的时候，React只是记住了action - 它会在下一次渲染中再次调用reducer
```

 **如果某些函数仅在effect中调用，你可以把它们的定义移到effect中** 

```react
function SearchResults() {
  const [query, setQuery] = useState('react');

  useEffect(() => {
    function getFetchUrl() {
      return 'https://hn.algolia.com/api/v1/search?query=' + query;
    }

    async function fetchData() {
      const result = await axios(getFetchUrl());
      setData(result.data);
    }

    fetchData();
  }, [query]); // ✅ Deps are OK

  // ...
}
```

但当逻辑需要复用时，分为2中情况

-  **如果一个函数没有使用组件内的任何值，你应该把它提到组件外面去定义** 
- 若有依赖，使用useCallback包一层，添加依赖。这时 如果`query` 保持不变，`getFetchUrl`也会保持不变，我们的effect也不会重新运行。 

代码如下：

```react
function SearchResults() {
  const [query, setQuery] = useState('react');

  const getFetchUrl = useCallback(() => {
    return 'https://hn.algolia.com/api/v1/search?query=' + query;
  }, [query]);  

  useEffect(() => {
    const url = getFetchUrl();
    // ... Fetch data and do something ...
  }, [getFetchUrl]); 
  // ...
}
```



### useReducer

  useRef

作用：获取DOM和保存变量， 保存事件程序 

```react
const timer = useRef<NodeJS.Timeout>()

useEffect(() => {
	//...
    return () => {
      timer.current && clearTimeout(timer.current)
    }
}, [])

timer.current = setTimeout(() => {
  //....
}, 500)
```

### useCallback

`useCallback(fn, deps)`

返回一个 [memoized](https://en.wikipedia.org/wiki/Memoization) 回调函数。

把内联回调函数及依赖项数组作为参数传入 `useCallback`，它将返回该回调函数的 memoized 版本，该回调函数仅在某个依赖项改变时才会更新。当你把回调函数传递给经过优化的并使用引用相等性去避免非必要渲染（例如 `shouldComponentUpdate`）的子组件时，它将非常有用。

`useCallback(fn, deps)` 相当于 `useMemo(() => fn, deps)`。

### useMemo

`useMemo(() => fn, deps)`。

返回一个 [memoized](https://en.wikipedia.org/wiki/Memoization) 回调函数。

 如果没有提供依赖项数组，`useMemo` 在每次渲染时都会计算新的值 

## 关于HOOK的问答

### hook为什么不能写到if代码块里面

react hook底层是基于链表实现，调用的条件是每次组件被render的时候都会顺序执行所有的hooks 

