<template>
  <div class="discovery">
    <!-- 个性推荐 -->
    <div class="personal">
      <h3 class="title">个性推荐</h3>
      <el-carousel :interval="4000" type="card" height="200px">
        <!-- 循环获取到的接口数据 -->
        <el-carousel-item v-for="(item, index) in banners" :key="index">
          <img :src="item.imageUrl" alt="" />
        </el-carousel-item>
      </el-carousel>
    </div>
    <!-- 推荐歌单 -->
    <div class="recommand">
      <h3 class="title">推荐歌单</h3>
      <el-row :gutter="30">
        <el-col :span="6" v-for="(item, index) in list" :key="index">
          <div class="item" @click="toPlaylist(item.id)">
            <div class="img-wrap">
              <div class="desc-wrap">
                <span class="desc">{{ item.copywriter }}</span>
              </div>
              <img :src="item.picUrl" alt="" />
              <i class="iconfont icon-bofangbeifen13"></i>
              <!-- <i class="el-icon-video-play"></i> -->
            </div>
            <div class="text-wrap">
              <p class="name">{{ item.name }}</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 最新音乐 -->
    <div class="news">
      <h3 class="title">最新音乐</h3>
      <el-row :gutter="30">
        <el-col :span="12" v-for="(item, index) in songs" :key="index">
          <div class="item">
            <div class="img-wrap">
              <el-image :src="item.picUrl" alt="" lazy />
              <i
                class="iconfont icon-bofangbeifen13"
                @click="playMusic(item.id)"
              ></i>
            </div>
            <div class="song-wrap">
              <!-- 歌名 -->
              <div class="song-name">{{ item.name }}</div>
              <!-- 歌手名 -->
              <div class="singer">{{ item.song.artists[0].name }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 最新mv -->
    <div class="mvs">
      <h3 class="title">推荐MV</h3>
      <el-row :gutter="20">
        <el-col :span="6" v-for="(item, index) in mvs" :key="index">
          <div class="item">
            <div class="img-wrap">
              <el-image :src="item.picUrl" alt="" lazy />
              <div class="num-wrap">
                <i class="el-icon-caret-right"></i>
                <div class="num">{{ item.playCount }}</div>
              </div>
              <i
                class="iconfont icon-bofangbeifen13"
                @click="toMV(item.id)"
              ></i>
            </div>
            <div class="info-wrap">
              <!-- mv名 -->
              <div class="name">{{ item.name }}</div>
              <!-- 歌手名 -->
              <div class="singer">{{ item.artistName }}</div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: "discovery",
  data() {
    return {
      // 轮播图
      banners: JSON.parse(localStorage.getItem('banners')) || [],
      // 推荐歌单
      list: JSON.parse(localStorage.getItem('dlist')) || [],
      // 最新音乐
      songs: JSON.parse(localStorage.getItem('dsongs')) || [],
      // 推荐MV
      mvs: [],
    };
  },
  mounted() {
    this.axios({
      url: "/banner",
      method: "get",
    }).then((res) => {
      this.banners = res.data.banners;
      localStorage.setItem('banners',JSON.stringify(res.data.banners));
    });

    // 推荐歌单
    this.axios({
      url: "/personalized",
      method: "get",
      params: {
        // 获取的数据量
        limit: 8,
      },
    }).then((res) => {
      // console.log(res);
      this.list = res.data.result;
      localStorage.setItem('dlist',JSON.stringify(res.data.result));
    });

    // 最新音乐
    this.axios({
      url: "/personalized/newsong",
      method: "get",
    }).then((res) => {
      // console.log(res.data.result);
      this.songs = res.data.result;
      localStorage.setItem('dsongs',JSON.stringify(res.data.result));
    });

    // 最新mv
    this.axios({
      url: "/personalized/mv",
      method: "get",
    }).then((res) => {
      this.mvs = res.data.result;
    });
  },
  methods: {
    // 去mv详情页
    toMV(id) {
      this.$router.push(`/mv?q=${id}`);
    },
    // 去歌单详情页
    toPlaylist(id) {
      // 跳转并携带数据
      this.$router.push(`/playlist?q=${id}`);
    },
    // 播放音乐并跳转歌曲详情
    playMusic(id) {
      this.axios({
        url: "/song/url",
        method: "get",
        params: {
          id,
        },
      }).then((res) => {
        // 父子组件传参
        let url = res.data.data[0].url;
        // 设置给父组件的播放地址
        this.$parent.musicUrl = url;
        console.log(this.$parent);
        console.log(url);
      });
      // 跳转并携带数据
      this.$router.push(`/song?q=${id}`);
    },
  },
};
</script>

<style>
.discovery {
  width: 1000px;
  margin: 0 auto;
}

.discovery .personal img {
  width: 100%;
  border-radius: 3px;
  vertical-align: bottom;
}

.discovery .title {
  font-size: 20px;
  margin: 20px 0;
  text-align: left;
  font-weight: 600;
}
/* 推荐音乐 */
.el-carousel__indicators--outside button {
  background-color: rgba(231, 122, 143) !important;
}

/* .el-carousel__item--card.is-active{
  z-index: 2 !important;
}

.el-carousel__item--card.is-in-stage{
  z-index: 1 !important;
} */

.discovery .recommand .item {
  position: relative;
  border-radius: 3px;
  overflow: hidden;
  background-color: #fff;
  margin-bottom: 20px;
}
.discovery .recommand .item .img-wrap {
  position: relative;
}
.discovery .recommand .item .img-wrap .desc-wrap {
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 35px;
  line-height: 35px;
  animation: fadeInDown 0.3s linear;
}
.discovery .recommand .item .img-wrap .desc-wrap .desc {
  color: white;
  padding-left: 10px;
}

.discovery .recommand .item .img-wrap img {
  width: 100%;
  vertical-align: middle;
}

.discovery .recommand .item .img-wrap i {
  display: none;
  position: absolute;
  top: 80%;
  left: 80%;
  color: rgba(253, 240, 237, 0.7);
  animation: fadeIn 0.3s linear;
  cursor: pointer;
}

.discovery .recommand .item .text-wrap {
  width: 100%;
  height: 40px;
  line-height: 40px;
  background-color: #ede4e2;
  cursor: pointer;
}

.discovery .recommand .item .text-wrap .name {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  padding: 0 10px;
}

.discovery .recommand .item:hover .text-wrap {
  background-color: #d1b7b3;
  transition: all 0.3s;
}

.discovery .recommand .item:hover .desc-wrap {
  display: block;
}

.discovery .recommand .item:hover .img-wrap i {
  display: block;
}

/* 最新音乐 */
.discovery .news .item {
  position: relative;
  border-radius: 3px;
  background-color: #ede4e2;
  display: flex;
  margin-bottom: 3px;
  transition: all 0.3s;
}
.discovery .news .item .img-wrap {
  position: relative;
  flex: 0 0 25%;
  padding: 5px;
}
.discovery .news .item .img-wrap img {
  width: 100%;
  border-radius: 3px;
}
.discovery .news .item .img-wrap i {
  display: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(253, 240, 237, 0.7);
  animation: fadeIn 0.3s linear;
  cursor: pointer;
}

.discovery .news .item .song-wrap {
  flex: 0 0 75%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  text-align: left;
  padding-left: 20px;
}
.discovery .news .item .song-wrap .song-name {
  font-size: 16px;
  font-weight: 600;
}
.discovery .news .item .song-wrap .singer {
  font-size: 14px;
}

.discovery .news .item:hover {
  background-color: #d1b7b3;
}

.discovery .news .item:hover .img-wrap i {
  display: block;
}

/* 推荐MV */
.discovery .mvs .item {
  position: relative;
  margin-bottom: 100px;
}
.discovery .mvs .item .img-wrap {
  position: relative;
}
.discovery .mvs .item .img-wrap img {
  width: 100%;
  border-radius: 3px;
}

.discovery .mvs .item .img-wrap .num-wrap {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 13px;
  transition: all 0.3s;
  display: flex;
  color: white;
  cursor: pointer;
}
/* .discovery .mvs .item .img-wrap .num-wrap i{
  cursor: pointer;
} */
.discovery .mvs .item .img-wrap .num-wrap .num {
  font-size: 12px;
  margin-left: 3px;
}

.discovery .mvs .item .img-wrap i {
  display: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(253, 240, 237, 0.7);
  animation: fadeIn 0.3s linear;
  cursor: pointer;
}

.discovery .mvs .item .info-wrap {
  position: relative;
}
.discovery .mvs .item .info-wrap .name {
  font-size: 16px;
  padding: 5px 0;
}
.discovery .mvs .item .info-wrap .singer {
  font-size: 13px;
  color: #666;
}

.discovery .mvs .item:hover .img-wrap i {
  display: block;
}
</style>