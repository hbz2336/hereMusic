<template>
  <div class="index">
    <div class="index_container">
      <div class="nav" v-show="isShow">
        <ul>
          <li>
            <router-link to="/discovery"
              ><i class="el-icon-mic"></i>发现音乐</router-link
            >
          </li>
          <li>
            <router-link to="/playlists"
              ><i class="el-icon-document"></i>推荐歌单</router-link
            >
          </li>
          <li>
            <router-link to="/songs"
              ><i class="el-icon-orange"></i>最新音乐</router-link
            >
          </li>
          <li>
            <router-link to="/mvs"
              ><i class="el-icon-film"></i>最新MV</router-link
            >
          </li>
        </ul>
      </div>
      <!-- 主题区域 右侧的容器 需要切换内容-->
      <div class="main">
        <!-- <discovery></discovery> -->
        <!-- 路由的出口 地址命中之后 把组件显示的位置 -->
        <transition :name="tranName">
          <router-view></router-view>
        </transition>
      </div>
    </div>
    <!-- 播放标签 -->
    <!-- <div class="player">
      <div class="music-progress-bar">
        <div class="music-progress-line">
          <i class="el-icon-s-promotion"></i>
        </div>
      </div>
      <div class="bottom-con">
        <el-row>
          <el-col :span="6">
            <div class="grid-content">
              <div class="img-con">
                <img src="" alt="" />
              </div>
              <div class="title-con">
                <p class="name">你是人间四月天</p>
                <p class="singer">aaaa</p>
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content total-con">
              <div class="play-con">
                <a href="#" class="music-pre"
                  ><i class="iconfont icon-shangyishou"></i
                ></a>
                <a href="#" class="music-play" v-if="isPlay == true"
                  ><i class="iconfont icon-bofang"></i
                ></a>
                <a href="#" class="music-play" v-else
                  ><i class="iconfont icon-iconfront-"></i
                ></a>
                <a href="#" class="music-next"
                  ><i class="iconfont icon-xiayishou"></i
                ></a>
              </div>
              <div class="music-voice-bar">
                <div class="music-voice-line"></div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="grid-content">
              <div class="other-con">
                <a href="#" class="music-random"
                  ><i class="el-icon-paperclip"></i
                ></a>
                <a href="#" class="music-circle"
                  ><i class="el-icon-refresh"></i
                ></a>
                <a href="#" class="music-set"
                  ><i class="el-icon-s-operation"></i
                ></a>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div> -->
    <audio
      controls
      autoplay
      :src="musicUrl"
      ref="audio"
      @timeupdate="updateTime"
    >
      <!-- <source :src="musicUrl" type="audio/mp3"> -->
    </audio>
  </div>
</template>

<script>
export default {
  data() {
    return {
      musicUrl: "",
      isShow: true,
      currentTime: "0",
      isPlay: false,
      tranName:''
    };
  },
  methods: {
    //获取当前浏览器宽度
    getCwidth() {
      // 网页可视区域的宽
      let cwidth = document.body.clientWidth;
      let swidth = window.screen.width;
      // console.log(cwidth,swidth);
      if (cwidth < swidth * 0.95) {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
    },
    updateTime(e) {
      // console.log(e);
      this.currentTime = e.target.currentTime;
    },
    // 场景过度效果
    queryTranName(){
      const path=this.$route.path;
      if(path.includes("song")){
        this.tranName="song";
        return;
      }
      this.tranName="video"
    }
  },
  created(){
    this.queryTranName();
  },
  mounted() {
    this.timer = setInterval(this.getCwidth, 500);
    this.timer1 = setInterval(this.updateTime, 100);
  },
  beforeDestroy() {
    clearInterval(this.timer);
    clearInterval(this.timer1);
  },
  watch: {
    currentTime() {
      console.log(this.currentTime);
    },
    $route(){
      this.queryTranName();
    }
  },
};
</script>

<style>
/* 过渡效果 */
.video-enter-active{
  transition: 0.5s;
}
/* 从哪里开始过度 */
.video-enter{
  transform:translateX(-100%);
}
/* 运动完的位置 */
.video-enter-to{
  transform:translateX(0%);
}
.video-leave-active{
  transition: 0.5s;
}
.video-leave{
  opacity: 1;
}
.video-leave-to{
  opacity: 0;
}
.video-enter-active{
  transition: 0.5s;
}
/* 从哪里开始过度 */
.song-enter{
  transform:translateX(-100%);
}
/* 运动完的位置 */
.song-enter-to{
  transform:translateX(0);
}
.song-leave-active{
  transition: 0.5s;
}
.song-leave{
  opacity: 1;
}
.song-leave-to{
  opacity: 0;
}
/* 页面样式 */
.index {
  position: relative;
  z-index: 9;
}
.index a {
  text-decoration: none;
  color: black;
  display: block;
  padding: 30px 0;
  text-align: center;
  outline: none;
}

.index .index_container {
  display: flex;
}
.index .index_container .nav {
  position: relative;
  width: 200px;
  height: 1000px;
  height: inherit;
  background-color: rgb(255, 232, 239);
}

.index .index_container .nav ul {
  position: fixed;
  top: 55px;
  left: 0px;
  width: 200px;
  height: inherit;
}

.index .index_container .nav li:hover {
  background-color: rgba(250, 218, 209);
}
.index .index_container .nav ul i {
  margin-right: 8px;
  text-align: left;
}
.index .main {
  /* 使用剩余的尺寸 */
  flex: 1;
  background-color: #fdf0ed;
}
/* 点击高亮的效果 */
.index a.router-link-active {
  text-decoration: none;
  color: #ec1e7e;
  background-color: #f8c6c5;
  /* background-color: rgba(250, 218, 209); */
}

/* .index .btn-audio audio {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  border-radius: 0;
} */

/* 底部播放器 */
.player {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 2;
  width: 100%;
  height: 60px;
  background: rgba(248, 195, 205);
  /* background-size: cover; */
}
.player .play-con .iconfont {
  font-size: 17px;
}
.player .music-progress-bar {
  width: 100%;
  height: 4px;
  background-color: rgba(178, 150, 147, 0.3);
}

.player .music-progress-bar .music-progress-line {
  width: 400px;
  height: 4px;
  background-color: rgba(231, 122, 143);
}

.player .music-progress-bar .music-progress-line i {
  position: absolute;
  top: -5px;
  left: 396px;
  color: #9f343a;
}
.total-con {
  display: flex;
}
.music-voice-bar {
  margin-top: 25px;
  margin-left: 50px;
  width: 80px;
  height: 4px;
  border-radius: 2px;
  background-color: rgba(178, 150, 147, 0.3);
}
.music-voice-bar .music-voice-line {
  width: 50px;
  height: 4px;
  border-radius: 2px;
  background-color: rgba(231, 122, 143);
}
.player .bottom-con a {
  display: inline-block;
  margin-right: 8px;
  margin-top: 10px;
  padding: 10px;
  border-radius: 50%;
  background-color: rgba(250, 218, 209);
}

.player .other-con {
  text-align: right;
}
.play .btn-audio {
  width: 1200px;
  height: 60px;
  margin: 0 auto;
  background-color: #fff;
}
audio {
  width: 100% !important;
  background-color: #f1f3f4;
  position: fixed;
  bottom: 0;
  left: 0;
}
</style>