<template>
  <!-- 最新mv -->
  <div class="mvs-container">
    <div class="wrap-container">
      <div class="section-wrap">
        <!-- 分类切换地区 -->
        <span class="section-type">地区:</span>
        <ul class="tabs-wrap">
          <li class="tab">
            <span
              class="title"
              :class="{ active: area == '全部' }"
              @click="area = '全部'"
              >全部</span
            >
          </li>
          <li class="tab">
            <span
              class="title"
              :class="{ active: area == '内地' }"
              @click="area = '内地'"
              >内地</span
            >
          </li>
          <li class="tab">
            <span
              class="title"
              :class="{ active: area == '欧美' }"
              @click="area = '欧美'"
              >欧美</span
            >
          </li>
          <li class="tab">
            <span
              class="title"
              :class="{ active: area == '日本' }"
              @click="area = '日本'"
              >日本</span
            >
          </li>
          <li class="tab">
            <span
              class="title"
              :class="{ active: area == '韩国' }"
              @click="area = '韩国'"
              >韩国</span
            >
          </li>
        </ul>
      </div>
      <div class="type-wrap">
        <span class="type-type">类型:</span>
        <ul class="tabs-wrap">
          <li class="tab">
            <span
              class="title"
              :class="{ active: type == '全部' }"
              @click="type = '全部'"
              >全部</span
            >
          </li>
          <li class="tab">
            <span
              class="title"
              :class="{ active: type == '官方版' }"
              @click="type = '官方版'"
              >官方版</span
            >
          </li>
          <li class="tab">
            <span
              class="title"
              :class="{ active: type == '原声' }"
              @click="type = '原声'"
              >原声</span
            >
          </li>
          <li class="tab">
            <span
              class="title"
              :class="{ active: type == '现场版' }"
              @click="type = '现场版'"
              >现场版</span
            >
          </li>
          <li class="tab">
            <span
              class="title"
              :class="{ active: type == '网易出品' }"
              @click="type = '网易出品'"
              >网易出品</span
            >
          </li>
        </ul>
      </div>
      <div class="order-wrap">
        <span class="order-type">排序:</span>
        <ul class="tabs-wrap">
          <li class="tab">
            <span
              class="title"
              :class="{ active: order == '上升最快' }"
              @click="order = '上升最快'"
              >上升最快</span
            >
          </li>
          <li class="tab">
            <span
              class="title"
              :class="{ active: order == '最热' }"
              @click="order = '最热'"
              >最热</span
            >
          </li>
          <li class="tab">
            <span
              class="title"
              :class="{ active: order == '最新' }"
              @click="order = '最新'"
              >最新</span
            >
          </li>
        </ul>
      </div>
    </div>

    <div class="items">
      <div class="import-item" v-for="(item, index) in mvs" :key="index">
        <div class="item">
          <div class="img-wrap">
            <img :src="item.cover" alt="" />
            <i class="iconfont icon-bofangbeifen13"  @click="toMV(item.id)"></i>
            <div class="num-wrap">
              <span class="iconfont"></span>
              <div class="num">{{ item.playCount }}</div>
            </div>
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
    <!-- 
      分页器
      total 总条数
      current-page 当前页
      page-size 每页多少条数据
      current-change 页码改变事件
     -->
     <div class="bottom-bar">
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
  </div>
</template>

<script>
import Playicon from '../components/Playicon'
export default {
  components:{
    Playicon
  },
  data() {
    return {
      // 总条数
      total: 20,
      // 页码
      page: 1,
      // 页容量
      limit: 12,
      // 地区
      area: "全部",
      // 类型
      type: "全部",
      // 排序
      order: "上升最快",
      // 推荐mv
      mvs: [],
    };
  },
  created() {
    this.getList();
  },
  // 侦听器
  watch: {
    area() {
      // 返回第一页
      this.page=1;
      this.getList();
    },
    type() {
      // 返回第一页
      this.page=1;
      this.getList();
    },
    order() {
      // 返回第一页
      this.page=1;
      this.getList();
    },
  },
  methods: {
    // 获取列表数据
    getList() {
      // 当前台要传数据给后台时，就会在地址栏上加上参数
      this.axios({
        url: "/mv/all",
        methods: "get",
        params: {
          area: this.area,
          type: this.type,
          order: this.order,
          // 数量
          limit: this.limit,
          // 偏移值 分页 是指从第几条记录开始返回 其从0开始编号(与id没有任何关系)
          offset: (this.page - 1) * this.limit,
        },
      }).then((res) => {
        // console.log(res);
        this.mvs = res.data.data;
        // 处理次数
        for (let i = 0; i < this.mvs.length; i++) {
          if (this.mvs[i].playCount > 100000) {
            this.mvs[i].playCount =
              parseInt(this.mvs[i].playCount / 10000) + "万";
          }
        }
        // 保存总条数
        if(res.data.count){
          this.total=res.data.count;
        }
      });
    },
    // 页码改变的回调函数
    handleCurrentChange(val){
      // 保存页面 重新获取数据
      this.page=val;
      this.getList();
    },
    // 去mv详情页
    toMV(id) {
      this.$router.push(`/mv?q=${id}`);
    },
  },
};
</script>

<style>
.mvs-container {
  width: 1000px;
  margin: 0 auto;
}

.mvs-container img {
  width: 100%;
  border-radius: 3px;
}
.mvs-container .items {
  display: flex;
  flex-wrap: wrap;
  text-align: left;
}

.mvs-container .items .import-item {
  flex: 0 0 25%;
  padding: 0 10px;
  margin-bottom: 20px;
}

.mvs-container .items .import-item:nth-child(4n + 1) {
  padding-left: 0px;
}

.mvs-container .items .import-item:nth-child(4n) {
  padding-right: 0px;
}

/* .mvs .items .import-item .item{
  background-color: yellow;
} */

.mvs-container .items .import-item .item .img-wrap {
  position: relative;
}

.mvs-container .items .import-item .item .img-wrap .num-wrap {
  position: absolute;
  top: 0;
  right: 0;
}

.mvs-container .items .import-item .item .img-wrap .num-wrap .num {
  padding: 5px;
  color: white;
  text-align: right;
  font-size: 12px;
}
.mvs-container .items .import-item .item .img-wrap i{
  display: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: fadeIn 0.3s linear;
  cursor: pointer;
  color: rgba(253, 240, 237, 0.7);
}
.mvs-container .items .import-item .item .img-wrap:hover i{
  display: block;
}
.mvs-container .items .import-item .item .info-wrap .name {
  padding: 5px 0;
  font-size: 14px;
}
.mvs-container .items .import-item .item .info-wrap .singer {
  color: #666;
  font-size: 13px;
}

.mvs-container .pag {
  margin: 20px 0;
  text-align: center;
}
.mvs-container .wrap-container > div {
  display: flex;
  margin-bottom: 15px;
}

.mvs-container .wrap-container {
  margin: 30px 0;
}
.mvs-container .tabs-wrap {
  display: flex;
}

.mvs-container .tabs-wrap .tab .title {
  padding: 5px 10px;
  border-radius: 50%;
  margin: 0 10px;
  cursor: pointer;
}
.mvs-container .tabs-wrap .tab .active {
  background-color: #ffe8ef;
  color:#ee3688;
}
.bottom-bar{
  margin-bottom: 100px;
}

.el-pagination.is-background .el-pager li:not(.disabled).active{
  background-color: #ee458f !important;
}

.el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li{
  background-color: #ede4e2 !important;
}
.el-pagination .btn-next .el-icon, .el-pagination .btn-prev .el-icon{
  text-align: center;
}
.mvs .el-pagination.is-background .btn-next:hover, .el-pagination.is-background .btn-prev:hover, .el-pagination.is-background .el-pager li:hover{
  color:#ee458f !important;
}
</style>