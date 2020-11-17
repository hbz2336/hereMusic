<template>
  <div id="app">
    <!-- 头部组件 -->
    <top></top>
    <!-- 主体组件 -->
    <index></index>
    <!-- <router-view></router-view> -->
  </div>
</template>

<script>
// 导入
import Index from './components/Index.vue'
import Top from './components/Top.vue'
export default {
  // 注册组件
  components:{
    Top,
    Index
  },
  methods:{
    sayHi(){
      alert('你好')
    }
  }
}
</script>

<style>
*{
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
