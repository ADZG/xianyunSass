<template>
  <section class="container">
    <p>
      <span class="iconfont iconfeiji"></span>
      <i>国内机票</i>
    </p>
    <el-row type="flex" justify="space-between">
      <!-- 搜索 -->
      <div>
        <SearchForm></SearchForm>
      </div>

      <div>
        <img src="http://157.122.54.189:9093/images/pic_sale.jpeg">
      </div>
    </el-row>
    <el-row type="flex" justify="space-around" class="info" align="middle">
      <el-col :span="8">
        <div>
          <span class="iconfont iconweibiaoti-_huabanfuben" style="color: rgb(64, 158, 255);"></span>
          <i>100%航协认证</i>
        </div>
      </el-col>
      <el-col :span="8">
        <div>
          <span class="iconfont iconbaozheng" style="color:green"></span>
          <i>出行保障</i>
        </div>
      </el-col>
      <el-col :span="8">
        <div>
          <span class="iconfont icondianhua" style="color:blue"></span>
          <i>7x24小时服务</i>
        </div>
      </el-col>
    </el-row>
    <div class="note">
      <span class="iconfont icontejiajipiao"></span>
      <i>特价机票</i>
    </div>
    <el-row class="sale" justify="space-around">
      <el-col :span="6" v-for="(item, index) in options" :key="index" class="sale_col">
        <nuxt-link
          :to="`/air/flights?departCity=${item.departCity}&departCode=${item.departCode}&destCity=${item.destCity}&destCode=${item.destCode}&departDate=${item.departDate}`"
          style=" position: relative;"
        >
          <img :src="item.cover" alt>
          <el-row class="layer-bar" type="flex" justify="space-between">
            <span>{{item.departCity}}-{{item.destCity}}</span>
            <span>￥{{item.price}}</span>
          </el-row>
        </nuxt-link>
      </el-col>
    </el-row>
  </section>
</template>
<script>
import SearchForm from "@/components/air/searchForm";
export default {
  data() {
    return {
      options: []
    };
  },
  components: {
    SearchForm
  },
  mounted() {
    this.$axios({
      url: "/airs/sale"
    }).then(res => {
      this.options = res.data.data;
    });
  }
};
</script>
<style lang="less" scoped>
.container {
  width: 1000px;
  margin: auto;
  > p {
    color: #ffa500;
    font-size: 20px;
    padding: 20px 0;
    > i {
      padding-left: 5px;
    }
  }
  img {
    width: 100%;
  }
  .info {
    margin: 20px 0;
    background-color: #f5f5f5;
    border: 1px solid #dddddd;
    height: 70px;
    div {
      text-align: center;
      border-right: 1px pink solid;
      font-size: 18px;
      box-sizing: border-box;
      &:last-child {
        border-right: none;
      }
      span {
        font-size: 25px;
      }
    }
  }
  .note {
    padding-bottom: 20px;
    color: skyblue;
    > span {
      font-size: 25px;
    }
    > i {
      font-size: 20px;
    }
  }
  .sale {
    overflow: hidden;
    box-sizing: border-box;
    border: 1px solid #dddddd;
    margin-bottom: 60px;
    .sale_col {
      padding: 15px;
    }
    .layer-bar {
      left: 0;
      bottom: 0;
      position: absolute;
      width: 100%;
      background: rgba(0, 0, 0, 0.5);
      color: #fff;
    }
    img {
      width: 100%;
      height: 140px;
    }
  }
}
</style>
