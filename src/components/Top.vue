<template>
  <div class="top">
    <div class="top-con">
      <el-row class="top-container">
        <el-col :span="4">
          <div class="grid-content">
            <div class="left-con">
              <!-- <img src="1.png" alt="" /> -->
              <p class="top-title">I'm Here</p>
              <p class="sec-title">Music</p>
            </div>
          </div>
        </el-col>
        <el-col :span="14">
          <div class="grid-content">
            <div class="center-con">
              <a href="#" class="music-pre" @click="backTo"
                ><i class="el-icon-caret-left"></i
              ></a>
              <a href="#" class="music-next" @click="forwardTo"
                ><i class="el-icon-caret-right"></i
              ></a>
              <input
                type="text"
                placeholder="Search Songs"
                v-model="inputValue"
                @keyup.enter="toResult"
              />
              <i class="el-icon-search"></i>
              <div class="search-hide" v-show="isShow">
                <!-- 搜索到的歌单 -->
                <div class="song-list">
                  <!-- 小三角形 -->
                  <i class="tri"></i>
                  <h4 class="title">歌单</h4>
                  <el-row :gutter="20">
                    <el-col
                      :span="12"
                      v-for="(item, index) in playlists"
                      :key="index"
                    >
                      <div class="item" @click="toPlaylist(item.id)">
                        <div class="img-wrap">
                          <img :src="item.coverImgUrl" alt="" />
                        </div>
                        <div class="text-wrap">
                          <p class="name">{{ item.name }}</p>
                          <p class="playnum">
                            <i class="icon"></i>{{ item.playCount }}
                          </p>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </div>
                <!-- 搜索到的歌曲 -->
                <div class="song-songs">
                  <h4 class="title">歌曲</h4>
                  <div
                    class="lists"
                    v-for="(item, index) in songList"
                    :key="index"
                    @click="playMusic(item.id)"
                  >
                    <el-row>
                      <el-col :span="12">
                        <div class="info-wrap">
                          <span class="name">{{ item.name }}</span>
                          <span class="singer">{{ item.artists[0].name }}</span>
                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="time-wrap">
                          <span class="time">{{ item.duration }}</span>
                          <i class=""></i>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                </div>
                <!-- 搜索到的mv信息 -->
                <div class="song-mv">
                  <h4 class="title">mv</h4>
                  <el-row :gutter="20">
                    <el-col :span="12" v-for="(item, index) in mv" :key="index">
                      <div class="mv-item">
                        <div class="img-wrap">
                          <img :src="item.cover" alt="" />
                          <i class="iconfont icon-bofangbeifen13"  @click="toMV(item.id)"></i>
                        </div>
                        <div class="text-wrap">
                          <p class="title">{{ item.name }}</p>
                          <p class="playnum">
                            <i class=""></i>{{ item.playCount }}
                          </p>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content">
            <div class="right-con" v-if="isLogined==1">
              <img src="" alt="" />
              <p>{{username}}</p>
            </div>
            <div class="right-con" v-else>
              <router-link to="/login">登录</router-link>
              <router-link to="/signup">注册</router-link>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import Playicon from "./Playicon";
export default {
  components: {
    Playicon
  },
  data() {
    return {
      inputValue: "",
      isShow: false,
      // 保存查询歌曲
      songList: [],
      // 保存歌单的字段
      playlists: [],
      // 保存mv字段
      mv: [],
      username:'jon'
    };
  },
  methods: {
    toResult() {
      // 如果为空 提示
      if (this.inputValue == "") {
        //提示用户
        this.$message.warning("请输入内容");
      } else {
        // 否则跳转
        // this.$router.push('/result');
        this.isShow = false;
        // 携带数据
        this.$router.push(`/result?q=${this.inputValue}`);
      }
    },
    backTo() {
      this.$router.go(-1);
    },
    forwardTo() {
      this.$router.go(1);
    },
    // 播放歌曲
    playMusic(id) {
      this.axios({
        url: "/song/url",
        method: "get",
        params: {
          id,
        },
      }).then((res) => {
        console.log(res);
        let url = res.data.data[0].url;
        // 此处使用vuex进行优化
        // this.$on.musicUrl = url;
      });
    },
    // 去歌单详情页
    toPlaylist(id){
      this.isShow=false;
      // 跳转并携带数 据
      this.$router.push(`/playlist?q=${id}`);
    },
    // 去mv详情页
    toMV(id) {
      this.isShow=false;
      this.$router.push(`/mv?q=${id}`);
    },
  },
  watch: {
    inputValue() {
      this.isShow = true;
      if (this.inputValue == "") {
        this.isShow = false;
      }
      // 获取两个歌单数据
      this.axios({
        url: "/search",
        method: "get",
        params: {
          keywords: this.inputValue,
          type: 1000,
          // 获取的数据量
          limit: 2,
        },
      }).then((res) => {
        // console.log(res.data.result.playlists);
        this.playlists = res.data.result.playlists;
        // 处理播放次数
        for (let i = 0; i < this.playlists.length; i++) {
          if (this.playlists[i].playCount > 100000) {
            this.playlists[i].playCount =
              parseInt(this.playlists[i].playCount / 10000) + "万";
          }
        }
      });
      // 获取四个歌曲的数据
      this.axios({
        url: "/search",
        method: "get",
        params: {
          keywords: this.inputValue,
          type: 1,
          // 获取的数据量
          limit: 4,
        },
      }).then((res) => {
        // console.log(res.data.result.playlists);
        this.songList = res.data.result.songs;
        // 计算歌曲时间
        for (let i = 0; i < this.songList.length; i++) {
          let min = parseInt(this.songList[i].duration / 1000 / 60);
          let sec = parseInt((this.songList[i].duration / 1000) % 60);
          if (min < 10) {
            min = "0" + min;
          }
          if (sec < 10) {
            sec = "0" + sec;
          }
          this.songList[i].duration = min + ":" + sec;
        }
      });
      // 获取2个mv数据
      this.axios({
        url: "/search",
        method: "get",
        params: {
          keywords: this.inputValue,
          type: 1004,
          // 获取的数据量
          limit: 2,
        },
      }).then((res) => {
        this.mv = res.data.result.mvs;
        // 处理数据
        // 播放次数
        for (let i = 0; i < this.mv.length; i++) {
          if (this.mv[i].playCount > 100000) {
            this.mv[i].playCount =
              parseInt(this.mv[i].playCount / 10000) + "万";
          }
        }
      });
    },
  },
};
</script>

<style>
.top {
  position: relative;
  width: 100%;
  height: 55px;
  z-index: 999;
}
.top a {
  outline: none;
}
.top .top-con {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1;
  background: rgb(252, 207, 216);
  /* background-color: #fdf0ed; */
  box-shadow: rgba(187, 187, 187, 1) 0 0 10px 2px;
}
.top .top-con .top-container {
  width: 1200px;
  margin: 0 auto;
}
.top .left-con {
  padding: 5px 30px;
}
/* .left-con img{
  border-radius: 50%;
  width: 50px;
  height: 50px;
  background-color:#d1b7b3;
} */

.top .left-con .top-title {
  font-size: 22px;
  font-weight: 600;
}

.top .left-con .sec-title {
  font-size: 14px;
}
.top .center-con {
  display: flex;
  align-items: center;
  position: relative;
}

.top .el-icon-search {
  position: absolute;
  top: 20px;
  right: 100px;
  cursor: pointer;
}

.top .center-con .music-pre,
.center-con .music-next {
  width: 25px;
  height: 25px;
  line-height: 25px;
  text-align: center;
  border-radius: 50%;
  /* background-color:  rgba(250, 218, 209); */
  background-color: #d1b7b3;
  cursor: pointer;
}
.top .center-con .music-pre {
  margin-left: 100px;
}
.top .center-con .music-next {
  margin-left: 10px;
}
.top .center-con input {
  width: 400px;
  height: 35px;
  border: 0;
  outline: 0;
  border-radius: 15px;
  background: #ede4e2;
  padding-left: 10px;
  margin: 10px 80px;
  font-size: 14px;
}

.top .right-con {
  display: flex;
  height: 50px;
  justify-content: flex-end;
  align-items: center;
}
.top .right-con a{
  text-decoration: none;
  color:#666;
  padding-left:10px;
}
/* 搜索框 */
.search-hide {
  position: absolute;
  top: 55px;
  right: 80px;
  width: 380px;
  background-color: #fdf0ed;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: rgba(187, 187, 187, 1) 0 0 5px 0;
  z-index: 999;
}

.search-hide .title {
  width: 100%;
  font-size: 20px;
  font-weight: 600;
  padding: 10px 0px;
  /* background-color: #fff; */
}

.search-hide .song-songs .title {
  padding: 10px 10px;
}

/* 歌单搜索信息 */
.search-hide .song-list {
  position: relative;
  padding: 0 10px;
  background: #ffe8ef;
  padding-bottom: 20px;
}
.search-hide .song-list i {
  position: fixed;
  top: 41px;
  left: 51%;
  width: 0;
  height: 0;
  border: 8px solid transparent;
  border-bottom: 8px solid #ffe8ef;
  z-index: 1;
}

.search-hide .song-list .item {
  display: flex;
}
.search-hide .song-list .item .img-wrap {
  width: 60px;
  height: 60px;
  border-radius: 3px;
  /* background-color: gray; */
  margin-right: 15px;
  overflow: hidden;
}
.search-hide .song-list .item .img-wrap img {
  width: 60px;
  height: 60px;
}
.search-hide .song-list .item .text-wrap {
  width: 110px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}
.search-hide .song-list .item .text-wrap .name {
  font-size: 14px;
}
.search-hide .search-box .song-list .item .text-wrap .playnum {
  font-size: 13px;
  color: gray;
}
.search-hide .search-box .song-list .item .text-wrap .playnum .icon {
  /* font-size: 14px; */
}

/* 歌曲搜索信息 */
.search-hide .song-songs {
  position: relative;
}

.search-hide .song-songs .lists {
  /* font-size: 14px; */
  padding: 8px 10px;
  cursor: pointer;
}
.search-hide .song-songs .lists:hover {
  background-color: #f8c3cd;
}
.search-hide .song-songs .lists .info-wrap {
  font-size: 14px;
}
.search-hide .song-songs .lists .info-wrap .name {
  font-size: 14px;
  padding-right: 10px;
}
.search-hide .song-songs .lists .info-wrap .singer {
  font-size: 14px;
  color: gray;
}

.search-hide .song-songs .lists .time-wrap {
  text-align: right;
}

.search-hide .song-songs .lists .time-wrap .time {
  font-size: 14px;
  color: gray;
}

/* mv搜索信息 */
.search-hide .song-mv {
  position: relative;
  /* background-color: #fccfd8; */
  background-color: #ffe8ef;
  padding: 0 10px;
  padding-bottom: 20px;
}

.search-hide .song-mv .mv-item {
  font-size: 14px;
}
.search-hide .song-mv .mv-item .img-wrap {
  position: relative;
  width: 120px;
  height: 60px;
  border-radius: 3px;
  overflow: hidden;
}
.search-hide .song-mv .mv-item .img-wrap img {
  width: 100%;
}

.search-hide .song-mv .mv-item .img-wrap i {
  display: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(253, 240, 237, 0.7);
  animation: fadeIn 0.3s linear;
  cursor: pointer;
}

.search-hide .song-mv .mv-item .img-wrap:hover i {
  display: block;
}
.search-hide .song-mv .mv-item .text-wrap {
  /* font-size: 14px; */
}
.search-hide .song-mv .mv-item .text-wrap .title {
  font-size: 14px;
}
.search-hide .song-mv .mv-item .text-wrap .playnum {
  font-size: 12px;
}
.search-hide .song-mv .mv-item .text-wrap .playnum i {
  /* font-size: 14px; */
}
</style>