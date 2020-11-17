<template>
  <div class="result">
    <div class="title-wrap">
      <h2 class="title">{{ $route.query.q }}</h2>
      <span class="sub-title">找到{{ count }}个结果</span>
    </div>
    <el-tabs v-model="activeIndex">
      <el-tab-pane label="歌曲" name="songs">
        <table class="result-table">
          <thead class="header-con">
            <th>音乐标题</th>
            <th>歌手</th>
            <th>专辑</th>
            <th>时长</th>
          </thead>
          <tbody>
            <tr
              class="tr-con"
              v-for="(item, index) in songList"
              :key="index"
              @click="playMusic(item.id)"
            >
              <td>
                <div class="song-wrap">
                  <div class="name-wrap">
                    <!-- 歌名 -->
                    <span>{{ item.name }}</span>
                    <!-- mv的图标 -->
                    <span v-if="item.alias.mid" class="iconfont icon-mv"></span>
                  </div>
                  <!-- 二级标题 -->
                  <!-- <span v-if="item.alias.length != 0">{{ item.alias[0] }}</span> -->
                </div>
              </td>
              <td>{{ item.artists[0].name }}</td>
              <td>{{ item.album.name }}</td>
              <td>{{ item.duration }}</td>
            </tr>
          </tbody>
        </table>
      </el-tab-pane>
      <el-tab-pane label="歌单" name="lists">
        <div class="tab-content">
          <div class="flex-con">
            <div class="items" v-for="(item, index) in playlists" :key="index" @click="toPlaylist(item.id)">
              <div class="item">
                <div class="img-wrap">
                  播放量:
                  <span class="num">{{ item.playCount }}</span>
                </div>
                <img :src="item.coverImgUrl" alt="" />
                <span class="iconfont icon-play"></span>
              </div>
              <p class="name">{{ item.name }}</p>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="MV" name="mv">
        <div class="mvs">
          <div class="items">
            <div class="import-item" v-for="(item,index) in mv" :key="index">
              <div class="item" @click="toMV(item.id)">
                <div class="img-wrap">
                  <img :src="item.cover" alt="" />
                  <span class="iconfont"></span>
                  <div class="num-wrap">
                    <span class="iconfont"></span>
                    <div class="num">{{ item.playCount }}</div>
                  </div>
                  <span class="time">{{item.duration}}</span>
                </div>
                <div class="info-wrap">
                  <!-- mv名 -->
                  <div class="name">{{ item.name }}</div>
                  <!-- 歌手名 -->
                  <div class="singer">{{ item.artistName }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "songs",
      // 保存查询歌曲
      songList: [],
      // 保存歌单的字段
      playlists: [],
      // 保存mv字段
      mv:[],
      // 搜索结果的总数
      count: 0,
    };
  },
  // 侦听器
  watch: {
    activeIndex() {
      // songs 歌曲
      // lists 歌单
      // mv
      let type = 1;
      let limit=10;
      switch (this.activeIndex) {
        case "songs":
          type = 1;
          limit=10;
          break;
        case "lists":
          type = 1000;
          limit=10;
          break;
        case "mv":
          type = 1004;
          limit=8;
          break;
        default:
          break;
      }

      this.axios({
        url: "/search",
        method: "get",
        params: {
          keywords: this.$route.query.q,
          type,
          // 获取的数据量
          limit: 10,
        },
      }).then((res) => {
        // console.log(res);
        if (type == 1) {
          // 歌曲
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
            // console.log(min + ":" + sec);
            this.songList[i].duration = min + ":" + sec;
          }
          // 保存总数
          this.count = res.data.result.songCount;
        } else if (type == 1000) {
          // 歌单的逻辑
          console.log(res);
          this.playlists = res.data.result.playlists;
          // 总数
          this.count = res.data.result.playlistCount;
          // 处理播放次数
          for (let i = 0; i < this.playlists.length; i++) {
            if (this.playlists[i].playCount > 100000) {
              this.playlists[i].playCount =
                parseInt(this.playlists[i].playCount / 10000) + "万";
            }
          }
        } else {
          // 保存mv
          this.mv=res.data.result.mvs;
          this.count=res.data.result.mvCount;
          // 处理数据
          for(let i=0;i<this.mv.length;i++){
            // 时间
            let min=parseInt(this.mv[i].duration/1000/60);
            let sec=parseInt(this.mv[i].duration/1000%60);
            if(min<10){
              min='0'+min;
            }
            if(sec<10){
              sec='0'+sec
            }
            this.mv[i].duration=min+':'+sec;

            // 播放次数
            if(this.mv[i].playCount>100000){
              this.mv[i].playCount=parseInt(this.mv[i].playCount/10000)+'万';
            }
          }
        }
      });
    },
  },
  // 方法
  methods: {
    // 去mv详情页
    toMV(id){
      this.$router.push(`/mv?q=${id}`)
    },
    // 去歌单详情页
    toPlaylist(id){
      // 跳转并携带数据即可
      this.$router.push(`/playlist?q=${id}`);
    },
    playMusic(id) {
      this.axios({
        url: "/song/url",
        method: "get",
        params: {
          id,
        },
      }).then((res) => {
        let url = res.data.data[0].url;
        this.$parent.musicUrl = url;
      });
      // 跳转并携带数据
      this.$router.push(`/song?q=${id}`);
    }
  },
  // 生命周期钩子 create
  // 回调函数 添加后自动执行
  // 内部可以通过this访问到vue
  created() {
    // 搜索的歌曲信息
    this.axios({
      url: "/search",
      method: "get",
      params: {
        keywords: this.$route.query.q,
        type: 1,
        // 获取的数据量
        limit: 10,
      },
    }).then((res) => {
      // console.log(res);
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
        // console.log(min + ":" + sec);
        this.songList[i].duration = min + ":" + sec;
      }
      // 保存总数
      this.count = res.data.result.songCount;
    });
  },
};
</script>

<style>
.result {
  width: 1000px;
  margin: 0 auto;
}
.result img{
  width:100%;
  border-radius: 3px;
}
.result .el-tabs__active-bar{
  background-color: #ee458f;
}
.result .el-tabs__item.is-active{
  color: #ee458f;
}
.result .el-tabs__item:hover{
  color:#ee458f;
}

.title-wrap{
  display: flex;
  margin-top:20px;
}

.title-wrap .title{
  font-size:30px;
  font-weight: 600;
}
.title-wrap .sub-title{
  display: inline-block;
  font-size:14px;
  color:#666;
  margin-left: 10px;
  line-height:40px;
}
.header-con th{
  height: 40px;
  line-height: 40px;
}

.header-con th:nth-child(3){
  padding:0 30px;
}

.result-table{
  border-spacing: 0px 5px;
  border-collapse:separate;
  width: 100%;
}

.tr-con{
  height: 80px;
  line-height: 80px;
  background-color: #ede4e2;
  transition: all .3s;
}
.tr-con:hover{
  background-color: #d1b7b3;
}

.tr-con:active{
  background-color: #d1b7b3;
}
.tr-con td:nth-child(1){
  padding-left:10px;

}

.tr-con td:nth-child(2),.tr-con td:nth-child(3),.tr-con td:nth-child(4){
  font-size:14px;
}

.result .flex-con {
  display: flex;
  flex-wrap: wrap;
}

.result .flex-con .items {
  margin-top: 10px;
  margin-right: 1%;
  flex: 0 0 19%;
}
.result .flex-con .items:nth-child(5n) {
  margin-right: 0;
}
.result .flex-con .item {
  position: relative;
  background-color: #fff;
  overflow: hidden;
}

.result .flex-con .img-wrap {
  width: 100%;
  display: none;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.4);
  color: white;
  font-size: 13px;
  text-align: left;
  padding: 5px;
  line-height: 18px;
  animation: recom 0.2s linear;
}
/* .playlists .flex-con .img-wrap .num{
  
} */
.result .flex-con .item:hover .img-wrap {
  display: block;
}

.result .flex-con .items .name {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
  margin: 5px 0;
  text-align: left;
}

@keyframes recom {
  0% {
    top: -20px;
  }
  100% {
    top: 0px;
  }
}

/* MV */
.result .mvs .items{
  display: flex;
  text-align: left;
}

.result .mvs .items .import-item{
  flex:0 0 25%;
  padding:0 10px;
}

.result .mvs .items .import-item:nth-child(4n+1){
  padding-left:0px;
}

.result .mvs .items .import-item:nth-child(4n){
  padding-right:0px;
}

/* .mvs .items .import-item .item{
  background-color: yellow;
} */

.result .mvs .items .import-item .item .img-wrap{
  position: relative;
}

.result .mvs .items .import-item .item .img-wrap .num-wrap{
  position: absolute;
  top:0;
  right:0;
}

.result .mvs .items .import-item .item .img-wrap .num-wrap .num{
  padding:5px;
  color:white;
  text-align: right;
  font-size:12px;
}

.result .mvs .items .import-item .item .info-wrap .name{
  padding:5px 0;
  font-size:13px
}
.result .mvs .items .import-item .item .info-wrap .singer{
  color:#666;
  font-size: 12px;
}
</style>