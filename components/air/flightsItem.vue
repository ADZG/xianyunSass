<template>
  <div class="flight-item">
    <div @click="hindle">
      <!-- 显示的机票信息 -->
      <el-row type="flex" align="middle" class="flight-info">
        <el-col :span="6">
          <span>{{data.airline_name}}</span> {{data.flight_no}}
        </el-col>
        <el-col :span="12">
          <el-row type="flex" justify="space-between" class="flight-info-center">
            <el-col :span="8" class="flight-airport">
              <strong>{{data.dep_time}}</strong>
              <span>{{data.org_airport_name}}</span>
            </el-col>
            <el-col :span="8" class="flight-time">
              <span>{{rankTime}}</span>
            </el-col>
            <el-col :span="8" class="flight-airport">
              <strong>{{data.arr_time}}</strong>
              <span>{{data.dst_airport_name}}</span>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6" class="flight-info-right">
          ￥
          <span class="sell-price">{{data.base_price/2}}</span>起
        </el-col>
      </el-row>
    </div>
    <div class="flight-recommend" v-if="currnet">
      <!-- 隐藏的座位信息列表 -->
      <el-row type="flex" justify="space-between" align="middle">
        <el-col :span="4">低价推荐</el-col>
        <el-col :span="20">
          <el-row
            type="flex"
            justify="space-between"
            align="middle"
            v-for="(item, index) in data.seat_infos"
            :key="index"
            class="flight-sell"
          >
            <el-col :span="16" class="flight-sell-left">
              <span>{{item.name}}</span>
              | {{item.supplierName}}
            </el-col>
            <el-col :span="5" class="price">{{item.org_settle_price}}</el-col>
            <el-col :span="3" class="choose-button">
              <!-- 这里传item，就是每一个小项的item，这一整个订单列表，只是大数据中一个，在外面该组件被
              遍历渲染了多次 -->
              <el-button type="warning" size="mini" @click="handlebuy(item)">选择</el-button>
              <p>剩余：{{item.discount}}</p>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      currnet: false
    };
  },
  computed: {
    rankTime() {
      const dep = this.data.dep_time.split(":"); //将时间分割成["08","29"]
      const arr = this.data.arr_time.split(":");
      const depval = dep[0] * 60 + +dep[1];
      //将时间转化成分钟 这里后面dep[1]位字符串格式，需要多一个+强制转化为数字类型
      const arrval = arr[0] * 60 + +arr[1];
      // 两个时间相减
      let dip =arrval-depval
      if(dip<0){
        // 如果说两个时间相减小于，说明到了第二天
       dip= arrval+60*24-depval
      }
      return `${Math.floor(dip/60)}时${dip%60}分`
    }
  },
  methods: {
    hindle() {
      console.log(this.data)
      this.currnet = !this.currnet;
    },
    handlebuy(item){
      console.log(item)
      this.$router.push({
        path:"/air/order",
        query:{
          id:this.data.id,
          seat_xid:item.seat_xid
        }
      })
    }
  }
};
</script>
<style lang="less" scoped>
.flight-item {
  border: 1px #ddd solid;
  margin-bottom: 10px;

  .flight-info {
    padding: 15px;
    cursor: pointer;

    > div {
      &:first-child,
      &:last-child {
        text-align: center;
      }
    }
  }

  .flight-info-center {
    padding: 0 30px;
    text-align: center;

    .flight-airport {
      strong {
        display: block;
        font-size: 24px;
        font-weight: normal;
      }
      span {
        font-size: 12px;
        color: #999;
      }
    }

    .flight-time {
      span {
        display: inline-block;
        padding: 10px 0;
        border-bottom: 1px #eee solid;
        color: #999;
      }
    }
  }

  .flight-info-right {
    .sell-price {
      font-size: 24px;
      color: orange;
      margin: 0 2px;
    }
  }
}

.flight-recommend {
  background: #f6f6f6;
  border-top: 1px #eee solid;
  padding: 0 20px;

  .flight-sell {
    border-bottom: 1px #eee solid;
    padding: 10px 0;

    &:last-child {
      border-bottom: none;
    }

    .flight-sell-left {
      font-size: 12px;
      span {
        color: green;
      }
    }

    .price {
      font-size: 20px;
      color: orange;
    }

    .choose-button {
      text-align: center;
      color: #666;
      button {
        display: block;
        width: 100%;
        margin-bottom: 5px;
      }
    }
  }
}
</style>
