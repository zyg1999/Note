### Diff策略
- 策略一：忽略Web UI中DOM节点跨层级移动；
- 策略二：拥有相同类型的两个组件产生的DOM结构也是相似的，不同类型的两个组件产生的DOM结构则不近相同
- 策略三：对于同一层级的一组子节点，通过分配唯一唯一id进行区分（key值）

基于以上三个点，React对tree diff、component diff、element diff进行优化，将普适diff的复杂度降低到一个数量级，保证了整体UI界面的构建性能！
### 优化
#### tree diff

React的做法是把dom tree分层级，对于两个dom tree只比较同一层次的节点，忽略Dom中节点跨层级移动操作，只对同一个父节点下的所有的子节点进行比较。如果对比发现该父节点不存在则直接删除该节点下所有子节点，不会做进一步比较，这样只需要对dom tree进行一次遍历就完成了两个tree的比较。

![image](https://github.com/zyg1999/Note/blob/master/review/React/pic/TIM图片20190922181058.png)

如图，react 会销毁旧树上的A节点及其子节点，重新创建一个新的A节点以及相应的子节点。

因此，要避免频繁的溢出或添加节点
#### component diff
- 同一类型组件遵从tree diff
- 不同类型组件，直接替换组件及其子组件

![image](https://github.com/zyg1999/Note/blob/master/review/React/pic/TIM图片20190922181111.png)
如图，当组件D → 组件G时，diff判断为不同类型的组件，虽然它们的结构相似甚至一样，diff仍然不会比较二者结构，会直接销毁D及其子节点，然后新建一个G相关的子tree，这显然会影响性能，在开发中应该尽量避免。
#### element diff
对于同一层级的element节点，diff提供了以下3种节点操作：
1. 	INSERT_MARKUP 插入节点：对全新节点执行节点插入操作
2. MOVE_EXISING 移动节点：组件新集合中有组件旧集合中的类型，且element可更新，即组件调用了receiveComponent，这时可以复用之前的dom，执行dom移动操作
3. REMOVE_NODE 移除节点：此时有两种情况：组件新集合中有组件旧集合中的类型，但对应的element不可更新；旧组件不在新集合里面，这两种情况需要执行节点删除操作
##### key重要性
![image](https://github.com/zyg1999/Note/blob/master/review/React/pic/TIM图片20190922181130.png)
一般diff在比较集合[A,B,C,D]和[B,A,D,C]的时候会进行全部对比，即按对应位置逐个比较，发现每个位置对应的元素都有所更新，则把旧集合全部移除，替换成新的集合。这显然是很影响性能的。

当我们对同级元素加上key之后，React会先进行新集合遍历，for(name in nextChildren)，通过key值判断两个对比集合中是否存在相同的节点，即if(prevChild === nextChild)，如何为true则进行移动操作，在此之前，需要执行被移动节点在新旧（child._mountIndex）集合中的位置比较，if(child._mountIndex < lastIndex)为true时进行移动，否则不执行该操作，这实际上是一种顺序优化，lastIndex是不断更新的，表示访问过的节点在集合中的最右的位置。若当前访问节点在旧集合中的位置比lastIndex大，即靠右，说明它不会影响其他元素的位置，因此不用添加到差异队列中，不执行移动操作，反之则进行移动操作。

简单地说就是，只对节点进行右移操作，然后改变标号。

当有新节点插入时，新节点进行插入，lastindex++，然后遍历下一个。

当完成新集合所有节点中的差异对比后，对旧集合进行遍历，判读旧集合中是否存在新集合中不存在的节点，此时发现D节点符合判断，执行删除D节点的操作

### 不足
![image](https://github.com/zyg1999/Note/blob/master/review/React/pic/TIM图片20190922181217.png)
若[A,B,C,D]->[D,A,B,C]这种情况下，最少的操作只是将D移动到第一位就可以了，实际上diff操作会移动D之前的三个节点到对应的位置。
