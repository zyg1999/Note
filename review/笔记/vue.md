### 当发生 v-if 和 v-for 需要同时出现在同一标签的时候，解决方法有两种

情景如下：

```vue
<ul>
  <li
    v-for="user in users"
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
```

#### 方案1: 计算属性 computed

```vue
<ul>
  <li
    v-for="user in activeUsers"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</ul>
<script>
export default{
  computed: {
   activeUsers: function () {
       return this.users.filter(function (user) {
       return user.isActive
   })
   }
 }
}
</script>
```

#### 方案2：借助template

```vue
<ul>
  <template v-for="user in users">
  <li
    v-if="user.isActive"
    :key="user.id"
  >
    {{ user.name }}
  </li>
</template>
</ul>
```

**对比**

方案1，性能消耗比较大；方案2