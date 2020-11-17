<template>
  <div class="playlists">
    <!-- 同步 -->
    <div class="top-card">
      <div class="icon-wrap">
        <!-- 封面 -->
        <img :src="topList.coverImgUrl" alt="" />
      </div>
      <div class="content-wrap">
        <div class="tag">精品歌单</div>
        <!-- 标题 -->
        <div class="title">
          {{ topList.name }}
        </div>
        <!-- 介绍 -->
        <div class="info">
          {{ topList.description }}
        </div>
      </div>
    </div>
    <div class="tab-container">
      <div class="tab-bar">
        <span
          class="item"
          :class="{ active: tag == '全部' }"
          @click="tag = '全部'"
          >全部</span
        >
        <span
          class="item"
          :class="{ active: tag == '欧美' }"
          @click="tag = '欧美'"
          >欧美</span
        >
        <span
          class="item"
          :class="{ active: tag == '华语' }"
          @click="tag = '华语'"
          >华语</span
        >
        <span
          class="item"
          :class="{ active: tag == '流行' }"
          @click="tag = '流行'"
          >流行</span
        >
        <span
          class="item"
          :class="{ active: tag == '说唱' }"
          @click="tag = '说唱'"
          >说唱</span
        >
        <span
          class="item"
          :class="{ active: tag == '摇滚' }"
          @click="tag = '摇滚'"
          >摇滚</span
        >
        <span
          class="item"
          :class="{ active: tag == '民谣' }"
          @click="tag = '民谣'"
          >民谣</span
        >
        <span
          class="item"
          :class="{ active: tag == '电子' }"
          @click="tag = '电子'"
          >电子</span
        >
        <span
          class="item"
          :class="{ active: tag == '轻音乐' }"
          @click="tag = '轻音乐'"
          >轻音乐</span
        >
        <span
          class="item"
          :class="{ active: tag == '影视原声' }"
          @click="tag = '影视原声'"
          >影视原声</span
        >
        <span
          class="item"
          :class="{ active: tag == 'ACG' }"
          @click="tag = 'ACG'"
          >ACG</span
        >
        <span
          class="item"
          :class="{ active: tag == '怀旧' }"
          @click="tag = '怀旧'"
          >怀旧</span
        >
        <span
          class="item"
          :class="{ active: tag == '治愈' }"
          @click="tag = '治愈'"
          >治愈</span
        >
        <span
          class="item"
          :class="{ active: tag == '旅行' }"
          @click="tag = '旅行'"
          >旅行</span
        >
      </div>
      <div class="tab-content">
        <div class="flex-con">
          <div class="items" v-for="(item, index) in list" :key="index" @click="toPlaylist(item.id)">
            <div class="item">
              <div class="img-wrap">
                播放量:
                <span class="num">{{ item.playCount }}</span>
              </div>
              <el-image :src="item.coverImgUrl" alt="" lazy />
              <span class="iconfont icon-play"></span>
            </div>
            <p class="name">{{ item.name }}</p>
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
      :page-size="10"
      class="pag"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "playlists",
  data() {
    return {
      // tab栏
      activeName: "second",
      // 总条数
      total: 0,
      // 页码
      page: 1,
      // 顶部的推荐歌单
      topList: {},
      // 歌单列表
      list: [],
      // 当前选择的数据
      tag: "全部",
    };
  },
  // 侦听器
  watch: {
    tag() {
      // 顶部的精品歌单
      this.topData();
      // 歌单
      this.listData();
      // 修改页码为1
      this.page = 1;
    },
  },
  created() {
    // 顶部的精品歌单
    this.topData();
    // 歌单
    this.listData();
  },
  methods: {
    // 去歌单详情页
    toPlaylist(id){
      // 跳转并携带数据
      this.$router.push(`/playlist?q=${id}`);
    },
    // 抽取的方法1 顶部的数据
    topData() {
      this.axios({
        url: "/top/playlist/highquality",
        methods: "get",
        params: {
          limit: 1,
          cat: this.tag,
        },
      }).then((res) => {
        this.topList = res.data.playlists[0];
      });
    },
    // 抽取的方法2 列表的数据
    listData() {
      this.axios({
        url: "/top/playlist/top/playlist",
        methods: "get",
        params: {
          limit: 10,
          // 起始的值 (页码-1)*每页多少条数据
          offset: (this.page - 1) * 10,
          cat: this.tag,
        },
      }).then((res) => {
        this.list = res.data.playlists;
        this.total = res.data.total;
      });
    },
    handleCurrentChange(val) {
      // console.log(`当前页：${val}`);
      // 保存页码
      this.page = val;
      // 重新获取数据
      this.listData();
    },
  },
};
</script>

<style>
.playlists {
  width: 1000px;
  margin: 10px auto;
  text-align: left;
}
.playlists img {
  width: 100%;
  border-radius: 3px;
  vertical-align: bottom;
}

.playlists .top-card {
  position: relative;
  display: flex;
  background-color: rbga(0, 0, 0, 0.4);
  border-radius: 3px;
  overflow: hidden;
}

.playlists .top-card .icon-wrap {
  flex: 0 0 20%;
  padding: 20px;
}
.playlists .top-card .icon-wrap img {
  width: 100%;
}
.playlists .top-card .content-wrap {
  flex: 0 0 80%;
  margin: 20px;
}
.playlists .top-card .content-wrap .tag {
  width: 100px;
  padding: 5px 15px;
  font-size: 16px;
  border: 1px solid #ee458f;
  border-radius: 3px;
  color: #ee458f;
  cursor: pointer;
}
.playlists .top-card .content-wrap .title {
  padding: 10px 0;
  font-size: 18px;
  font-weight: bold;
  color: black;
}
.playlists .top-card .content-wrap .info {
  width: 90%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  overflow: hidden;
  text-overflow: ellipsis;
  /* 自动换行 */
  word-break: break-word;
  font-size: 13px;
  line-height: 20px;
  color: #666;
}

.tab-container {
  margin-top: 20px;
}
/* tab栏 */
.tab-bar {
  text-align: right;
  margin: 10px 0px;
  cursor: pointer;
}

.tab-bar .item {
  padding: 0 8px;
}

.tab-bar .active {
  color: #ee458f;
}
/* 推荐歌单 */
.playlists .flex-con {
  display: flex;
  flex-wrap: wrap;
}

.playlists .flex-con .items {
  margin-top: 10px;
  margin-right: 1%;
  flex: 0 0 19%;
}
.playlists .flex-con .items:nth-child(5n) {
  margin-right: 0;
}
.playlists .flex-con .item {
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.playlists .flex-con .img-wrap {
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
.playlists .flex-con .item:hover .img-wrap {
  display: block;
}

.playlists .flex-con .items .name {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 14px;
  margin: 10px 0;
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

.pag {
  margin: 20px 0;
  text-align: center;
  margin-bottom: 100px;
}

.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #ee458f !important;
}

.el-pagination.is-background .btn-next,
.el-pagination.is-background .btn-prev,
.el-pagination.is-background .el-pager li {
  background-color: #ede4e2 !important;
}
.el-pagination .btn-next .el-icon,
.el-pagination .btn-prev .el-icon {
  text-align: center;
}
.el-pagination.is-background .btn-next:hover,
.el-pagination.is-background .btn-prev:hover,
.el-pagination.is-background .el-pager li:hover {
  color: #ee458f !important;
}
</style>