import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
  // 在各个页面中共享的状态数据
  state:{
    isPlay:false,  //是否播放中
    id:'',         //歌曲id
    url:''         //歌曲地址
  },
  getters:{
    isPlay:state => {
      let isPlay=state.isPlay;
      if(!isPlay){
        isPlay=JSON.parse(window.sessionStorage.getItem('isPlay')||null)
      }
    },
    url:state => {
      let url=state.url;
      if(!url){
        url=JSON.parse(window.sessionStorage.getItem('url')||null)
      }
    },
    id:state => {
      let id=state.id;
      if(!id){
        id=JSON.parse(window.sessionStorage.getItem('id')||null)
      }
    },
  },
  mutations:{
    setIsPlay:(state,isPlay) => {
      state.isPlay=isPlay;
      window.sessionStorage.setItem('isPlay',JSON.stringify(isPlay));
    },
    setUrl:(state,url)=>{
      state.url=url;
      window.sessionStorage.setItem('url',JSON.stringify(url));
    },
    setId:(state,id)=>{
      state.id=id;
      window.sessionStorage.setItem('id',JSON.stringify(id));
    }
  },
  actions:{

  }
})