<template>
  <div class="playlist">
    <div class="top-wrap">
      <div class="img-wrap">
        <img :src="playlist.coverImgUrl" alt="" />
      </div>
      <div class="info-wrap">
        <!-- 名字 -->
        <p class="title">{{ playlist.name }}</p>
        <div class="author-wrap">
          <!-- 头像 -->
          <img class="avatar" :src="playlist.creator.avatarUrl" alt="" />
          <span class="name">{{ playlist.creator.nickname }}</span>
          <span class="time">{{ playlist.createTime }} 创建</span>
        </div>
        <div class="tag-wrap">
          <span class="title">标签:</span>
          <!-- 分类标签 -->
          <ul>
            <li v-for="(item, index) in playlist.tags" :key="index">
              {{ item }}
            </li>
          </ul>
        </div>
        <div class="desc-wrap">
          <span class="title">简介:</span>
          <!-- 简介 -->
          <span class="desc">{{ playlist.description }}</span>
        </div>
      </div>
    </div>
    <div class="tabs">
      <el-tabs v-model="activeIndex">
        <el-tab-pane label="歌曲">
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
              <tr
                class="tr-con"
                v-for="(item, index) in musicdata"
                :key="index"
              >
                <td>{{ index + 1 }}</td>
                <td>
                  <div class="img-wrap">
                    <el-image
                      :src="item.al.picUrl"
                      alt=""
                      lazy
                      class="img"
                    ></el-image>
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
                <td>{{ item.ar[0].name }}</td>
                <td>{{ item.al.name }}</td>
                <td>{{ item.dt }}</td>
              </tr>
            </tbody>
          </table>
        </el-tab-pane>
        <el-tab-pane label="评论">
          <div class="comment-wrap">
            <p class="title">
              精彩评论
              <span class="number">({{ hotCount }})</span>
            </p>
            <div class="comments-wrap">
              <!-- 评论 -->
              <div
                class="item"
                v-for="(item, index) in hotComment"
                :key="index"
              >
                <div class="icon-wrap">
                  <img :src="item.user.avatarUrl" alt="" />
                </div>
                <div class="content-wrap">
                  <div class="content">
                    <span class="name">{{ item.user.nickname }}:</span>
                    <span class="comment">{{ item.content }}</span>
                  </div>
                  <!-- 评论的回复 -->
                  <div class="re-content" v-if="item.beReplied.length != 0">
                    <span class="name"
                      >{{ item.beReplied[0].user.nickname }}:</span
                    >
                    <span class="comment">{{ item.beReplied[0].content }}</span>
                  </div>
                  <div class="date">2020-11-10 20:21</div>
                </div>
              </div>
            </div>
          </div>
          <div class="comment-wrap">
            <p class="title">
              最新评论
              <span class="number">({{ total }})</span>
            </p>
            <div class="comments-wrap">
              <!-- 评论 -->
              <div class="item" v-for="(item, index) in comments" :key="index">
                <div class="icon-wrap">
                  <img :src="item.user.avatarUrl" alt="" />
                </div>
                <div class="content-wrap">
                  <div class="content">
                    <span class="name">{{ item.user.nickname }}:</span>
                    <span class="comment">{{ item.content }}</span>
                  </div>
                  <!-- 评论的回复 -->
                  <div class="re-content" v-if="item.beReplied.length != 0">
                    <span class="name"
                      >{{ item.beReplied[0].user.nickname }}:</span
                    >
                    <span class="comment">{{ item.beReplied[0].content }}</span>
                  </div>
                  <div class="date">2020-11-10 20:21</div>
                </div>
              </div>
            </div>
          </div>
          <!-- 
      分页器
      total 总条数
      current-page 当前页
      page-size 每页多少条数据
      current-change 页码改变事件
     -->
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
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "0",
      // 总条数
      total: 0,
      // 页码
      page: 1,
      // 歌单详情数据
      playlist: {},
      // 歌曲列表
      musicdata: [],
      // 热门评论
      hotComment: [],
      // 热门评论的个数
      hotCount: 0,
      // 普通评论
      comments: 0,
    };
  },
  created() {
    // 获取歌单信息
    this.axios({
      url: "/playlist/detail",
      method: "get",
      params: {
        id: this.$route.query.q,
      },
    }).then((res) => {
      console.log(res);
      this.playlist = res.data.playlist;
    });
    // 获取评论
    this.axios({
      url: "/comment/hot",
      method: "get",
      params: {
        id: this.$route.query.q,
        type: 2,
      },
    }).then((res) => {
      this.hotComment = res.data.hotComments;
      // 保存个数
      this.hotCount = res.data.total;
    });
    // 获取最新评论
    this.axios({
      url: "/comment/playlist",
      method: "get",
      params: {
        id: this.$route.query.q,
        limit: 10,
      },
    }).then((res) => {
      // console.log(res);
      // 总个数
      this.total = res.data.total;
      // 评论数
      this.comments = res.data.comments;
    });

    // 获取歌曲信息
    this.axios({
      url: "/playlist/detail",
      method: "get",
      params: {
        id: this.$route.query.q
      },
    }).then((res) => {
      // 未登录状态下不完整 只有三首
      // console.log(res);
      this.musicdata = res.data.playlist.tracks;
      // console.log(this.musicdata);
      // 计算歌曲时间
      for (let i = 0; i < this.musicdata.length; i++) {
        let min = parseInt(this.musicdata[i].dt / 1000 / 60);
        let sec = parseInt((this.musicdata[i].dt / 1000) % 60);
        if (min < 10) {
          min = "0" + min;
        }
        if (sec < 10) {
          sec = "0" + sec;
        }
        // console.log(min + ":" + sec);
        this.musicdata[i].dt = min + ":" + sec;
      }
    });
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val;
      // 重新获取数据
      // 获取最新评论
      this.axios({
        url: "/comment/playlist",
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
    playMusic(id){
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
    }
  },
};
</script>

<style>
.playlist {
  width: 900px;
  margin: 0 auto;
}
.playlist .top-wrap {
  display: flex;
  margin-top: 30px;
}
.playlist .top-wrap .img-wrap {
  flex: 0 0 25%;
}
.playlist .top-wrap .img-wrap img {
  width: 100%;
}
.playlist .top-wrap .info-wrap {
  flex: 0 0 75%;
  padding-left: 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.playlist .top-wrap .info-wrap .title {
  font-size: 25px;
  font-weight: bold;
}
.playlist .top-wrap .info-wrap .author-wrap {
  display: flex;
  line-height: 30px;
}
.playlist .top-wrap .info-wrap .author-wrap .avatar {
  border-radius: 50%;
  width: 30px;
  height: 30px;
}
.playlist .top-wrap .info-wrap .author-wrap .name {
  font-size: 18px;
  white-space: nowrap;
  padding-left: 10px;
}
.playlist .top-wrap .info-wrap .author-wrap .time {
  width: 100%;
  font-size: 14px;
  white-space: nowrap;
  padding-left: 10px;
}
.playlist .top-wrap .info-wrap .play-wrap {
  width: 100%;
}
.playlist .top-wrap .info-wrap .play-wrap span {
  width: 100%;
  white-space: nowrap;
}
.playlist .top-wrap .info-wrap .play-wrap .text {
  width: 100%;
  white-space: nowrap;
}
.playlist .top-wrap .info-wrap .tag-wrap {
  display: flex;
  line-height: 18px;
}
.playlist .top-wrap .info-wrap .tag-wrap .title {
  font-size: 18px;
  white-space: nowrap;
}
.playlist .top-wrap .info-wrap .tag-wrap ul {
  font-size: 14px;
  display: flex;
  white-space: nowrap;
}
.playlist .top-wrap .info-wrap .tag-wrap ul li {
  width: 100%;
}
.playlist .top-wrap .info-wrap .tag-wrap ul li::after {
  content: "/ ";
  font-weight: bold;
  padding: 0 5px;
  font-size: 15px;
}
.playlist .top-wrap .info-wrap .tag-wrap ul li:last-child::after {
  content: "";
}
.playlist .top-wrap .info-wrap .desc-wrap {
  line-height: 18px;
}
.playlist .top-wrap .info-wrap .desc-wrap .title {
  font-size: 18px;
  white-space: nowrap;
}
.playlist .top-wrap .info-wrap .desc-wrap .desc {
  font-size: 14px;
  color: #666;
}
.playlist .tabs {
  width: 100%;
}
.playlist .tabs .comment-wrap {
  margin-top: 20px;
}
.playlist .tabs .comment-wrap .title {
  font-size: 20px;
  font-weight: bold;
}
.playlist .tabs .comment-wrap .title .number {
  font-size: 20px;
}
.playlist .tabs .comment-wrap .comments-wrap {
  margin-top: 20px;
}
.playlist .tabs .comment-wrap .comments-wrap .item {
  display: flex;
}
.playlist .tabs .comment-wrap .comments-wrap .item .icon-wrap {
  width: 40px;
  margin-top: 20px;
  margin-right: 20px;
}
.playlist .tabs .comment-wrap .comments-wrap .item .icon-wrap img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.playlist .tabs .comment-wrap .comments-wrap .item .content-wrap {
  width: 100%;
  padding: 20px 0;
  border-bottom: 1px solid rgb(233, 231, 231);
}
.playlist .tabs .comment-wrap .comments-wrap .item .content-wrap .content {
  font-size: 16px;
  margin-bottom: 10px;
}
.playlist
  .tabs
  .comment-wrap
  .comments-wrap
  .item
  .content-wrap
  .content
  .name {
  color: #ee458f;
  white-space: nowrap;
}

.playlist .tabs .comment-wrap .comments-wrap .item .content-wrap .re-content {
  width: inherit;
  background-color: #ede4e2;
  padding: 10px 10px;
  border-radius: 3px;
  margin-bottom: 10px;
}
.playlist
  .tabs
  .comment-wrap
  .comments-wrap
  .item
  .content-wrap
  .re-content
  .name {
  color: #ee458f;
  white-space: nowrap;
}

.playlist .tabs .comment-wrap .comments-wrap .item .content-wrap .date {
  font-size: 14px;
  color: lightgray;
}

.playlist .el-tabs__active-bar {
  background-color: #ee458f;
}
.playlist .el-tabs__item.is-active {
  color: #ee458f;
}
.playlist .el-tabs__item:hover {
  color: #ee458f;
}

.playlist .playlist-table {
  border-spacing: 0px 5px;
  border-collapse: separate;
  width: 100%;
  margin-bottom: 100px;
}
.playlist .header-con th {
  height: 40px;
  line-height: 40px;
}
.playlist .header-con th:nth-child(3) {
  padding: 0 30px;
}

.playlist .tr-con {
  /* height: 80px; */
  /* line-height: 80px; */
  background-color: #ede4e2;
  transition: all 0.3s;
}
.playlist .tr-con:hover {
  background-color: #d1b7b3;
}
.playlist .tr-con td:nth-child(1) {
  text-align: center;
  padding:0 10px;
}

.playlist .tr-con td:nth-child(2) {
  padding: 5px 0px;
  width: 80px;
}
.playlist .tr-con td:nth-child(2) .img {
  border-radius: 3px;
  vertical-align: top;
}

.playlist .tr-con td:nth-child(3) {
  padding: 0px 30px;
}

.playlist .tr-con td:nth-child(4),
.playlist .tr-con td:nth-child(5) {
  font-size: 14px;
}

.playlist .tr-con td:nth-child(6) {
  font-size: 14px;
  padding-right: 10px;
}

.playlist .img-wrap {
  position: relative;
}
.playlist .img-wrap i {
  display: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: fadeIn 0.3s linear;
  cursor: pointer;
  color: rgba(253, 240, 237, 0.7);
}

.playlist .tr-con:hover .img-wrap i {
  display: block;
}
</style>