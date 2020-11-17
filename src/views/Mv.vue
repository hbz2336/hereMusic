<template>
  <div class="mv">
    <div class="mv-wrap">
      <h3 class="title">mv详情</h3>
      <div class="video-wrap">
        <video :src="url" controls autoplay></video>
      </div>
      <!-- mv信息 -->
      <div class="info-warp">
        <div class="singer-info">
          <div class="avatar-wrap">
            <img :src="mvInfo.cover" alt="" />
          </div>
          <span class="name">{{ mvInfo.artistName }}</span>
        </div>
        <div class="mv-info">
          <h2 class="title">{{ mvInfo.name }}</h2>
          <span class="date">发布：{{ mvInfo.publishTime }}</span>
          <span class="number">播放：{{ mvInfo.playCount }}</span>
          <p class="desc">{{ mvInfo.desc }}</p>
        </div>
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
          <p class="title">
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
    </div>
    <div class="refer-wrap">
      <h3 class="title">相关推荐</h3>
      <div class="mvs">
        <div class="items">
          <div class="item" v-for="(item, index) in simiMvs" :key="index">
            <div class="img-wrap">
              <img :src="item.cover" alt="" />
              <i
                class="iconfont icon-bofangbeifen13"
                @click="toMV(item.id)"
              ></i>
            </div>
            <div class="num-wrap">
              <div class="num">{{ item.playCount }}</div>
            </div>
            <span class="time">{{ item.duration }}</span>
            <div class="info-wrap">
              <div class="name">{{ item.name }}</div>
              <div class="singer">by {{ item.artistName }}</div>
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
      // 总条数
      total: 0,
      // 页码
      page: 1,
      // mv地址
      url: "",
      simiMvs: [],
      mvInfo: [],
      // 普通评论
      comments: [],
      // 热门评论
      hotComment: [],
      hotCount: 0,
    };
  },
  created() {
    // 获取相关的mv
    this.axios({
      url: "/simi/mv",
      method: "get",
      params: {
        mvid: this.$route.query.q,
      },
    }).then((res) => {
      this.simiMvs = res.data.mvs;
      // 处理次数
      for (let i = 0; i < this.simiMvs.length; i++) {
        if (this.simiMvs[i].playCount > 100000) {
          this.simiMvs[i].playCount =
            parseInt(this.simiMvs[i].playCount / 10000) + "万";
        }
      }
      // 处理时长
      for (let i = 0; i < this.simiMvs.length; i++) {
        // 获取总毫秒数
        let duration = this.simiMvs[i].duration;
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
        this.simiMvs[i].duration = `${min}:${sec}`;
      }
    });
    // 获取mv的播放地址
    this.axios({
      url: "/mv/url",
      method: "get",
      params: {
        id: this.$route.query.q,
      },
    }).then((res) => {
      this.url = res.data.data.url;
    });
    // 获取mv的信息
    this.axios({
      url: "/mv/detail",
      method: "get",
      params: {
        mvid: this.$route.query.q,
      },
    }).then((res) => {
      // mv信息
      // console.log(res);
      this.mvInfo = res.data.data;
      // 处理次数
      if (this.mvInfo.playCount > 100000) {
        this.mvInfo.playCount =
          parseInt(this.mvInfo.playCount / 10000) + "万";
      }
    });
    // 获取mv的评论
    this.axios({
      url: "/comment/mv",
      method: "get",
      params: {
        id: this.$route.query.q,
        limit: 10,
        offset: 0,
      },
    }).then((res) => {
      // mv信息
      this.total = res.data.total;
      this.comments = res.data.comments;
      this.hotComment = res.data.hotComments;
      this.hotCount = res.data.hotComments.length;
      // 处理发出时间
      for (let i = 0; i < this.comments.length; i++) {
        let timer = new Date(this.comments[i].time);
        this.comments[i].time = timer.toLocaleString();
      }
      for (let i = 0; i < this.hotComment.length; i++) {
        let timer = new Date(this.hotComment[i].time);
        this.hotComment[i].time = timer.toLocaleString();
      }
    });
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val;
      // 重新获取数据
      // 获取最新评论
      this.axios({
        url: "/comment/mv",
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
    // 去mv详情页
    toMV(id) {
      this.$router.push(`/mv?q=${id}`);
      this.$router.go(0);
    },
  },
};
</script>

<style>
.mv {
  width: 1000px;
  margin: 0 auto;
  display: flex;
}

.mv .mv-wrap {
  flex: 0 0 66.7%;
}
.mv .title {
  font-size: 20px;
  font-weight: bold;
  margin: 20px 0;
}
.mv .mv-wrap .video-wrap {
  width: 100%;
}
.mv .mv-wrap .video-wrap video {
  width: 100%;
}
.mv .mv-wrap .info-warp {
}
.mv .mv-wrap .info-warp .singer-info {
  display: flex;
  margin: 20px 0;
}
.mv .mv-wrap .info-warp .singer-info .avatar-wrap {
  width: 50px;
  height: 50px;
}
.mv .mv-wrap .info-warp .singer-info .avatar-wrap img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}
.mv .mv-wrap .info-warp .singer-info .name {
  padding: 0 15px;
  line-height: 50px;
}
.mv .mv-wrap .info-warp .mv-info {
  width: 100%;
  margin-bottom: 50px;
}
.mv .mv-wrap .info-warp .mv-info .title {
  font-size: 25px;
  font-weight: bolder;
  margin: 10px 0;
}
.mv .mv-wrap .info-warp .mv-info .date {
  color: lightgray;
  font-size: 13px;
  padding-right: 20px;
}
.mv .mv-wrap .info-warp .mv-info .number {
  color: lightgray;
  font-size: 12px;
}
.mv .mv-wrap .info-warp .mv-info .desc {
  font-size: 14px;
  margin: 10px 0;
  line-height: 18px;
  color: rgb(124, 124, 124);
}
.mv .refer-wrap {
  flex: 0 0 33.3%;
  padding-left: 30px;
}

.mv .refer-wrap .mvs {
}
.mv .refer-wrap .mvs .items {
  display: flex;
  flex-direction: column;
}
.mv .refer-wrap .mvs .items .item {
  position: relative;
  display: flex;
  margin-bottom: 20px;
}
.mv .refer-wrap .mvs .items .item .img-wrap {
  position: relative;
  flex: 0 0 50%;
}
.mv .refer-wrap .mvs .items .item i {
  display: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: rgba(253, 240, 237, 0.7);
  animation: fadeIn 0.3s linear;
  cursor: pointer;
}
.mv .refer-wrap .mvs .items .item:hover .img-wrap i {
  display: block;
}
.mv .refer-wrap .mvs .items .item .img-wrap img {
  width: 100%;
  border-radius: 3px;
}
.mv .refer-wrap .mvs .items .item .num-wrap {
  position: absolute;
  top: 5px;
  right: 160px;
}
.mv .refer-wrap .mvs .items .item .num-wrap .num {
  font-size: 12px;
  color: white;
}
.mv .refer-wrap .mvs .items .item .time {
  position: absolute;
  bottom: 5px;
  right: 160px;
  font-size: 12px;
  color: white;
}
.mv .refer-wrap .mvs .items .item .info-wrap {
  flex: 0 0 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding-left: 10px;
}
.mv .refer-wrap .mvs .items .item .info-wrap .name {
  font-size: 14px;
}
.mv .refer-wrap .mvs .items .item .info-wrap .singer {
  font-size: 14px;
  color: rgb(185, 184, 184);
}

/* 评论 */
.mv .comment-wrap {
  margin-top: 20px;
}
.mv .comment-wrap .title {
  font-size: 20px;
  font-weight: bold;
}
.mv .comment-wrap .title .number {
  font-size: 20px;
}
.mv .comment-wrap .comments-wrap {
  margin-top: 20px;
}
.mv .comment-wrap .comments-wrap .item {
  display: flex;
}
.mv .comment-wrap .comments-wrap .item .icon-wrap {
  width: 40px;
  margin-top: 20px;
  margin-right: 20px;
}
.mv .comment-wrap .comments-wrap .item .icon-wrap img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.mv .comment-wrap .comments-wrap .item .content-wrap {
  width: 100%;
  padding: 20px 0;
  border-bottom: 1px solid rgb(233, 231, 231);
}
.mv .comment-wrap .comments-wrap .item .content-wrap .content {
  font-size: 14px;
  margin-bottom: 10px;
  line-height: 20px;
}
.mv .comment-wrap .comments-wrap .item .content-wrap .content .name {
  color: #ee458f;
  white-space: nowrap;
}

.mv .comment-wrap .comments-wrap .item .content-wrap .re-content {
  width: inherit;
  background-color: #ede4e2;
  padding: 10px 10px;
  border-radius: 3px;
  margin-bottom: 10px;
  line-height: 20px;
  font-size: 14px;
}
.mv .comment-wrap .comments-wrap .item .content-wrap .re-content .name {
  color: #ee458f;
  white-space: nowrap;
}

.mv .comment-wrap .comments-wrap .item .content-wrap .date {
  font-size: 14px;
  color: lightgray;
}
</style>