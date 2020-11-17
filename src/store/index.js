import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  // 在各个页面中共享的状态数据
  state:{
    // 标识用户是否已经登录
    isLogined:0,
    username:'Tom',
  },
})

