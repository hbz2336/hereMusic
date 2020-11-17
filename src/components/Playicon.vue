<template>
  <div class="playIcon">
    <i class="iconfont icon-bofangbeifen13" v-if="isPlay==true"  @click="playMusic(item.id)"></i>
    <i class="iconfont icon-bofangbeifen14" v-else @click="stopM"></i>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isPlay: true,
    };
  },
  methods: {
    playM() {
      this.isPlay = false;
    },
    stopM() {
      this.isPlay = true;
    },
    playMusic(id){
      console.log(id);
    }
  },
  watch:{
    isPlay(a,b){
      console.log(a,b);
      // this.isPlay = true;
    }
  }
};
</script>

<style>
</style>