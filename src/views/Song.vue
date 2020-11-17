<template>
  <div class="song">
    <div class="song-wrap">
      <div class="img-wrap">
        <img :src="songInfo.al.picUrl" alt="" />
        <!-- <i class="iconfont icon-bofangbeifen13"></i> -->
      </div>
      <div class="lyric-wrap">
        <h3 class="title">{{ songInfo.name }}</h3>
        <span class="artist" v-if="songInfo.al.name!=''">专辑:{{ songInfo.al.name}}</span>
        <span class="singer">歌手:{{ songInfo.ar[0].name }}</span>
        <div class="desc">
          <ul v-if="lyric.length" class="has-lyric">
            <li v-for="(item, index) in lyric" :key="index">
              <!-- {{index%2==1?} -->{{ item[1] }}
            </li>
          </ul>
          <div v-else>暂无歌词数据</div>
        </div>
      </div>
    </div>
    <div class="word-wrap">
      <div class="big-wrap">
        <!-- 精彩评论 -->
        <div class="comment-wrap">
          <p class="title">
            精彩评论
            <span class="number">({{ hotCount }})</span>
          </p>
          <div class="comments-wrap">
            <div class="item" v-for="(item, index) in hotComment" :key="index">
              <div class="icon-wrap">
                <img :src="item.user.avatarUrl" alt="" />
              </div>
              <div class="content-wrap">
                <div class="content">
                  <span class="name">{{ item.user.nickname }}:</span>
                  <span class="comment">{{ item.content }}</span>
                </div>
                <div class="re-content" v-if="item.beReplied.length != 0">
                  <span class="name"
                    >{{ item.beReplied[0].user.nickname }}:</span
                  >
                  <span class="comment">{{ item.beReplied[0].content }}</span>
                </div>
                <div class="date">{{ item.time }}</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 最新评论 -->
        <div class="comment-wrap">
          <p class="title mt-50">
            最新评论
            <span class="number">({{ total }})</span>
          </p>
          <div class="comments-wrap">
            <div class="item" v-for="(item, index) in comments" :key="index">
              <div class="icon-wrap">
                <img :src="item.user.avatarUrl" alt="" />
              </div>
              <div class="content-wrap">
                <div class="content">
                  <span class="name">{{ item.user.nickname }}:</span>
                  <span class="comment">{{ item.content }}</span>
                </div>
                <div class="re-content" v-if="item.beReplied.length != 0">
                  <span class="name"
                    >{{ item.beReplied[0].user.nickname }}:</span
                  >
                  <span class="comment">{{ item.beReplied[0].content }}</span>
                </div>
                <div class="date">{{ item.time }}</div>
              </div>
            </div>
          </div>
        </div>
        <el-pagination
          @current-change="handleCurrentChange"
          background
          layout="prev, pager, next"
          :total="total"
          :current-page="page"
          :page-size="5"
          class="pag"
        >
        </el-pagination>
      </div>

      <div class="refer-wrap">
        <h3 class="title">相关推荐</h3>
        <div class="songs">
          <div class="items">
            <div class="item" v-for="(item, index) in simiSong" :key="index">
              <div class="img-wrap">
                <img :src="item.album.picUrl" alt="" />
                <i
                  class="iconfont icon-bofangbeifen13"
                  @click="playMusic(item.id)"
                ></i>
              </div>
              <div class="info-wrap">
                <div class="name">{{ item.name }}</div>
                <div class="singer">{{ item.artists[0].name }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: 1,
      total: 0,
      // 歌曲信息
      songInfo: [],
      // 相似歌曲
      simiSong: [],
      // 普通评论
      comments: [],
      // 热门评论
      hotComment: [],
      hotCount: 0,
      lyric: JSON.parse(localStorage.getItem('lyric')) || "",
      // 当前歌曲在歌单中的位置
      // listIndex:'0',
      // 当前歌曲播放到的位置
      curTime: this.$parent.currentTime,
    };
  },
  created() {
    // 获取歌曲信息
    this.axios({
      url: "/song/detail",
      method: "get",
      params: {
        ids: this.$route.query.q,
      },
    }).then((res) => {
      this.songInfo = res.data.songs[0];
    });
    // 获取相似歌曲
    this.axios({
      url: "/simi/song",
      method: "get",
      params: {
        id: this.$route.query.q,
      },
    }).then((res) => {
      this.simiSong = res.data.songs;
    });
    // 获取热门评论
    this.axios({
      url: "/comment/hot",
      method: "get",
      params: {
        id: this.$route.query.q,
        type: 0,
      },
    }).then((res) => {
      this.hotComment = res.data.hotComments;
      this.hotCount = res.data.hotComments.length;
      for (let i = 0; i < this.hotComment.length; i++) {
        let timer = new Date(this.hotComment[i].time);
        this.hotComment[i].time = timer.toLocaleString();
      }
    });
    // 获取普通评论
    this.axios({
      url: "/comment/music",
      method: "get",
      params: {
        id: this.$route.query.q,
        limit: 10,
        offset: (this.page - 1) * 10,
      },
    }).then((res) => {
      this.total = res.data.total;
      this.comments = res.data.comments;
      // 处理发出时间
      for (let i = 0; i < this.comments.length; i++) {
        let timer = new Date(this.comments[i].time);
        this.comments[i].time = timer.toLocaleString();
      }
    });
    // 获取歌词
    this.axios({
      url: "/lyric",
      method: "get",
      params: {
        id: this.$route.query.q,
      },
    }).then((res) => {
      let lyr = res.data.lrc.lyric;
      let lines = lyr.split("\n");
      let pattern = /\[\d{2}:\d{2}.(\d{3}|\d{2})\]/g;
      let reg = /\[.+\]/;
      let result = [];
      if (!reg.test(lyr)) {
        return [[0, lyr]];
      }
      while (!pattern.test(lines[0])) {
        lines = lines.slice(1);
      }
      for (let item of lines) {
        // console.log(item);
        //存前面的时间段
        let time = item.match(pattern);
        // console.log(time);
        // 存后面的歌词
        let value = item.replace(pattern, "");
        // console.log(value);
        for (let item1 of time) {
          // 取出时间换算成数组
          let t = item1.slice(1, -1).split(":");
          // console.log(t);
          if (value != "") {
            result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
          }
        }
        this.lyric = result;
        // console.log(this.lyric);
      }
      localStorage.setItem('lyric',JSON.stringify(this.lyric));
    });
    setInterval(() => {
      this.curTime = this.$parent.currentTime;
    }, 100);
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val;
      // 重新获取数据
      // 获取最新评论
      this.axios({
        url: "/comment/music",
        method: "get",
        params: {
          id: this.$route.query.q,
          limit: 10,
          offset: (this.page - 1) * 10,
        },
      }).then((res) => {
        // console.log(res);
        // 总个数
        this.total = res.data.total;
        // 评论数
        this.comments = res.data.comments;
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
      this.$router.go(0);
    },
  },
  watch: {
    // 监听播放时间
    curTime() {
      let des=document.querySelector('.desc');
      let list=document.querySelectorAll(".has-lyric li");
      // console.log(des);
      if (this.lyric.length > 0) {
        for (let i = 0; i < this.lyric.length; i++) {
          if (this.$parent.currentTime >= this.lyric[i][0]) {
            for (let j = 0; j < this.lyric.length; j++) {
              list[j].setAttribute("class","nocon");
              // console.log(ul.style.top);
            }
            if (i >= 0) {
              list[i].setAttribute("class","con");
              // console.log(ul.scrollTop);
              des.scrollTop=-100+29*i;
            }
          }
        }
      }
    },
  },
};
</script>

<style>
.song {
  width: 900px;
  margin: 20px auto;
}
.song .mt-50 {
  margin-top: 50px;
}
.song .song-wrap {
  display: flex;
}
.song .song-wrap .img-wrap {
  position: relative;
  flex: 0 0 50%;
  height: 400px;
  animation: anima 20s linear infinite;
  /* background-color: #fff; */
}
.song .song-wrap .img-wrap img {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 320px;
  height: 320px;
  border-radius: 50%;
  box-shadow: rgba(187, 187, 187, 1) 0 0 10px 5px;
}

.song .song-wrap .lyric-wrap {
  flex: 0 0 50%;
  height: 400px;
  padding-right: 20px;
  padding-left:20px;
}
.song .song-wrap .lyric-wrap .title {
  margin-top: 20px;
  font-size: 30px;
  font-weight: bolder;
  margin-bottom: 10px;
}
.song .song-wrap .lyric-wrap .singer {
  font-size: 14px;
  color: #666;
}
.song .song-wrap .lyric-wrap .artist {
  font-size: 14px;
  color: #666;
  padding-right: 20px;
}

.song .song-wrap .lyric-wrap .desc {
  height: 310px;
  margin-top: 20px;
  font-size: 15px;
  color: #666;
  line-height: 30px;
  overflow: auto;
  transition: all .4s;
}
/*修改滚动条样式*/
.song .song-wrap .lyric-wrap .desc::-webkit-scrollbar{
  width:8px;
  height:10px;
}
.song .song-wrap .lyric-wrap .desc::-webkit-scrollbar-track{
  background: #ede4e2;
  border-radius:8px;
}
.song .song-wrap .lyric-wrap .desc::-webkit-scrollbar-thumb{
  background:#fccfd8;
  /* background: #f7d4d6; */
  border-radius:8px;
}
.song .song-wrap .lyric-wrap .desc::-webkit-scrollbar-thumb:hover{
  background:#efa5b1;
}
.song .song-wrap .lyric-wrap .desc::-webkit-scrollbar-corner{
  background: #179a16;
}
.nocon{
  color: #666;
  font-size: 15px;
  font-weight: normal;
  transition: all .4s;
}
.con{
  color:#ec1e7e;
  font-size:18px;
  font-weight: bold;
  transition: all .4s;
}

.song .word-wrap {
  display: flex;
  margin-top: 60px;
}
.song .word-wrap .big-wrap {
  flex: 0 0 70%;
}

.song .word-wrap .refer-wrap {
  flex: 0 0 30%;
  padding-left: 20px;
}
.song .word-wrap .refer-wrap .title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}
.song .word-wrap .refer-wrap .songs {
  width: 100%;
}
.song .word-wrap .refer-wrap .songs .items {
  width: 100%;
}
.song .word-wrap .refer-wrap .songs .items .item {
  display: flex;
  margin-bottom: 20px;
}
.song .word-wrap .refer-wrap .songs .items .item .img-wrap {
  width: 100px;
  height: 100px;

}
@keyframes anima {
  from{
    transform: rotate(0deg);
  }
  to{
    transform: rotate(360deg);
  }
}
.song .word-wrap .refer-wrap .songs .items .item .img-wrap img {
  width: 100px;
  height: 100px;
  border-radius: 3px;
}
.song .word-wrap .refer-wrap .songs .items .item .img-wrap i {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(253, 240, 237, 0.7);
  animation: fadeIn 0.3s linear;
  cursor: pointer;
}
.song .word-wrap .refer-wrap .songs .items .item .img-wrap:hover i {
  display: block;
}
.song .word-wrap .refer-wrap .songs .items .item .info-wrap {
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.song .word-wrap .refer-wrap .songs .items .item .info-wrap .name {
  font-size: 14px;
}
.song .word-wrap .refer-wrap .songs .items .item .info-wrap .singer {
  font-size: 14px;
  color: rgb(185, 184, 184);
}

/* 评论 */
.song .comment-wrap .title {
  font-size: 20px;
  font-weight: bold;
}

.song .comment-wrap .title .number {
  font-size: 20px;
}
.song .comment-wrap .comments-wrap {
  margin-top: 20px;
}

.song .comment-wrap .comments-wrap .item {
  display: flex;
}
.song .comment-wrap .comments-wrap .item .icon-wrap {
  width: 40px;
  margin-top: 20px;
  margin-right: 20px;
}
.song .comment-wrap .comments-wrap .item .icon-wrap img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.song .comment-wrap .comments-wrap .item .content-wrap {
  width: 100%;
  padding: 20px 0;
  border-bottom: 1px solid rgb(233, 231, 231);
}
.song .comment-wrap .comments-wrap .item .content-wrap .content {
  font-size: 14px;
  margin-bottom: 10px;
  line-height: 20px;
}
.song .comment-wrap .comments-wrap .item .content-wrap .content .name {
  color: #ee458f;
  white-space: nowrap;
}

.song .comment-wrap .comments-wrap .item .content-wrap .re-content {
  width: inherit;
  background-color: #ede4e2;
  padding: 10px 10px;
  border-radius: 3px;
  margin-bottom: 10px;
  line-height: 20px;
  font-size: 14px;
}
.song .comment-wrap .comments-wrap .item .content-wrap .re-content .name {
  color: #ee458f;
  white-space: nowrap;
}

.song .comment-wrap .comments-wrap .item .content-wrap .date {
  font-size: 14px;
  color: lightgray;
}
</style>