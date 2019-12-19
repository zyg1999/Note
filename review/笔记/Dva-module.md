### 什么是dva?

是一个轻量级应用框架

具体来说是`redux`+`redux-saga`+`react-router`+`fetch`

前俩是数据流方案，后俩是为了简化开发体验，内置的

## 特性

- **易学易用**，仅有 6 个 api，对 redux 用户尤其友好，[配合 umi 使用](https://umijs.org/guide/with-dva.html)后更是降低为 0 API
- **elm 概念**，通过 reducers, effects 和 subscriptions 组织 model
- **插件机制**，比如 [dva-loading](https://github.com/dvajs/dva/tree/master/packages/dva-loading) 可以自动处理 loading 状态，不用一遍遍地写 showLoading 和 hideLoading
- **支持 HMR**，基于 [babel-plugin-dva-hmr](https://github.com/dvajs/babel-plugin-dva-hmr) 实现 components、routes 和 models 的 HMR

### 前置知识

- State：一个对象，保存整个应用状态
- View：React 组件构成的视图层
- Action：一个对象，描述事件
- connect 方法：一个函数，绑定 State 到 View
- dispatch 方法：一个函数，发送 Action 到 State

### Dva-module 

着重介绍一下module，先看特性

#### namespace

- 命名空间，全局state上的属性
- 字符串

#### state

- 初始值
- 优先级低于`opts.initialState`

#### reducers

- `Key-value`形式
- 处理同步操作
- **唯一可修改**`state`的地方，由`action`触发
- 格式：`(state, action) => newState` 或 `[(state, action) => newState, enhancer]`

#### effect

- `key-value`形式
- 处理异步操作和业务逻辑
- `action`触发,可以触发 `action`，可以和服务器交互，可以获取全局 `state` 的数据(使用`select`内置函数)等
- 格式：`*(action, effects) => void` 或 `[*(action, effects) => void, { type }]`
  - `type`类型
    - takeEvery
    - takeLatest
    - throttle
    - watcher

> dva 为了控制副作用的操作，底层引入了[redux-sagas](http://superraytin.github.io/redux-saga-in-chinese)做异步流程控制，由于采用了[generator的相关概念](http://www.ruanyifeng.com/blog/2015/04/generator.html)，所以将异步转成同步写法，从而将effects转为纯函数。

#### subscriptions

- Key-value形式
- 用于订阅一个数据源，根据需要`dispatch`相应`action`
- `app.start()`被执行，数据源可为当前时间、服务器`websocket`连接、`keyboard`输入、`geolocation`（位置信息H5）变化、`history`路由变化

### module例子

- UI组件

```react
import React from 'react';
import PropTypes from 'prop-types';
import { Table, Popconfirm, Button } from 'antd';

const ProductList = ({ onDelete, products }) => {
  static propTypes = {
  	onDelete: PropTypes.func.isRequired,
  	products: PropTypes.array.isRequired,
	};
  const columns = [{
    title: 'Name',
    dataIndex: 'name',
  }, {
    title: 'Actions',
    render: (text, record) => {
      return (
        <Popconfirm title="Delete?" onConfirm={() => onDelete(record.id)}>
          <Button>Delete</Button>
        </Popconfirm>
      );
    },
  }];
  return (
    <Table
      dataSource={products}
      columns={columns}
    />
  );
};


export default ProductList;
```

- 定义Module

```react
export default {
  namespace: 'products',
  state: [],
  reducers: {
    'delete'(state, { payload: id }) {
      return state.filter(item => item.id !== id);
    },
  },
};
```

- 使用connect连接起来

```react
import React from 'react';
import { connect } from 'dva';
import ProductList from '../components/ProductList';

export default connect(({products})=>({
  //如果需要改名字可以在这里进行转换
  products,
}))(function Product({ dispatch, products }) => {
  function handleDelete(id) {
    dispatch({
      type: 'products/delete',
      payload: id,
    });
  }
  return (
    <div>
      <h2>List of Products</h2>
      <ProductList onDelete={handleDelete} products={products} />
    </div>
  );
);
```



在UI组件可以通过`dispatch({ type: 'products/delete',payload: id, });`调用effect，然后effect中找对应reducer

## select、call 和 put

**select** ：用来获取当前module中的state数据

dva 提供多个 effect 函数内部的处理函数，比较常用的是 `call` 和 `put`。

- **call**：执行异步函数
- **put**：发出一个 Action，类似于 dispatch

### 参考

官方文档：[https://dvajs.com/guide/#%E7%89%B9%E6%80%A7](https://dvajs.com/guide/#特性)