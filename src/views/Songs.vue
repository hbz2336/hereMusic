<template>
  <div class="songs">
    <div class="tab-bar">
      <span class="item" @click="tag = 0" :class="{ active: tag == 0 }"
        >全部</span
      >
      <span class="item" @click="tag = 7" :class="{ active: tag == 7 }"
        >华语</span
      >
      <span class="item" @click="tag = 96" :class="{ active: tag == 96 }"
        >欧美</span
      >
      <span class="item" @click="tag = 8" :class="{ active: tag == 8 }"
        >日本</span
      >
      <span class="item" @click="tag = 16" :class="{ active: tag == 16 }"
        >韩国</span
      >
    </div>
    <table class="playlist-table">
      <thead class="header-con">
        <th></th>
        <th></th>
        <th>音乐标题</th>
        <th>歌手</th>
        <th>专辑</th>
        <th>时长</th>
      </thead>
      <tbody
        infinite-scroll-distance="20"
        v-infinite-scroll="loadMore"
        infinite-scroll-disabled="busy"
        :infinite-scroll-immediate-check="true"
      >
        <tr v-for="(item, index) in lists" :key="index" class="tr-con">
          <td>{{ index + 1 }}</td>
          <td>
            <div class="img-wrap">
              <el-image :src="item.album.picUrl" alt="" lazy class="img"></el-image>
              <!-- 播放按钮 -->
              <i class="iconfont icon-bofangbeifen13"  @click="playMusic(item.id)"></i>
              <!-- < @click="playMusic(item.id)" class="el-icon-video-play"></i> -->
            </div>
          </td>
          <td>
            <div class="song-wrap">
              <div class="name-wrap">
                <span>{{ item.name }}</span>
                <span class="iconfont icon-mv"></span>
              </div>
              <span></span>
            </div>
          </td>
          <td>{{ item.album.artists[0].name }}</td>
          <td>{{ item.album.name }}</td>
          <td>{{ item.duration }}</td>
        </tr>
      </tbody>
    </table>
    <!-- 底部的table -->
  </div>
</template>

<script>
export default {
  name: "songs",
  data() {
    return {
      // 歌曲列表
      lists: JSON.parse(localStorage.getItem('slists')) || [],
      // 分类
      tag: "0",
      
    };
  },
  watch: {
    tag() {
      this.getList();
    },
  },
  created() {
    this.getList();
  },
  methods: {
    // 获取最新音乐数据
    getList() {
      this.axios({
        url: "/top/song",
        methods: "get",
        params: {
          // 传递设置的数据
          type: this.tag,
        },
      }).then((res) => {
        // console.log(res);
        this.lists = res.data.data;
        localStorage.setItem('slists',JSON.stringify(res.data.data));
        // 处理时长
        for (let i = 0; i < this.lists.length; i++) {
          // 获取总毫秒数
          let duration = this.lists[i].duration;
          // 秒 1./1000
          // 分 2./60
          // 秒 3.%60
          let min = parseInt(duration / 1000 / 60);
          let sec = parseInt((duration / 1000) % 60);
          if (min < 10) {
            min = "0" + min;
          }
          if (sec < 10) {
            sec = "0" + sec;
          }
          this.lists[i].duration = `${min}:${sec}`;
        }
      });
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
        // console.log(res);
        let url = res.data.data[0].url;
        // console.log(this.$parent);
        // 直接获取父组件 可以修改任意的值
        this.$parent.musicUrl = url;
      });
      // 跳转并携带数据
      this.$router.push(`/song?q=${id}`);
    },
  },
};
</script>

<style>
.songs {
  width: 1000px;
  margin: 0 auto;
  text-align: left;
}
.songs .img {
  width: 80px;
  border-radius: 3px;
  vertical-align:bottom;
}
.songs .tab-bar {
  margin: 20px 0;
}
.songs .header-con th {
  height: 40px;
  line-height: 40px;
}
.songs .header-con th:nth-child(3) {
  padding: 0 30px;
}

.songs .playlist-table {
  border-spacing: 0px 5px;
  border-collapse: separate;
}
.songs .tr-con {
  height: 80px;
  background-color: #ede4e2;
  transition: all 0.3s;
}
.songs .tr-con:hover {
  background-color: #d1b7b3;
}
.songs .tr-con td:nth-child(1) {
  text-align: center;
}

.songs .tr-con td:nth-child(2) {
  padding: 5px 0px;
}

.songs .tr-con td:nth-child(3) {
  padding: 0px 30px;
}

.songs .tr-con td:nth-child(4),
.songs .tr-con td:nth-child(5) {
  font-size: 14px;
}

.songs .tr-con td:nth-child(6) {
  font-size: 14px;
  padding-right: 10px;
}

.songs .img-wrap {
  position: relative;
}
.songs .img-wrap i{
  display: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: fadeIn 0.3s linear;
  cursor: pointer;
  color:rgba(253, 240, 237, 0.7);
}

.songs .tr-con:hover .img-wrap i {
  display: block;
}
</style>