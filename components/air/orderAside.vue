<template>
  <div class="aside">
    <div class="air-info">
      <el-row type="flex" justify="space-between" class="info-top">
        <div>{{airList.dep_date}}</div>
        <div>{{airList.org_city_name}} - {{airList.dst_city_name}}</div>
      </el-row>
      <el-row type="flex" justify="space-between" align="middle" class="info-step">
        <el-col :span="5" class="flight-airport">
          <strong>{{airList.dep_time}}</strong>
          <span>{{airList.org_airport_name}}{{airList.org_airport_quay}}</span>
        </el-col>
        <el-col :span="14" class="flight-time">
          <span>--- {{rankTime}} ---</span>
          <span>{{airList.airline_name}}{{airList.flight_no}}</span>
        </el-col>
        <el-col :span="5" class="flight-airport">
          <strong>{{airList.arr_time}}</strong>
          <span>{{airList.dst_airport_name}}{{airList.dst_airport_quay}}</span>
        </el-col>
      </el-row>
    </div>
    <el-row type="flex" justify="space-between" class="info-bar">
      <span>订单总价</span>
      <span>金额</span>
      <span>数量</span>
    </el-row>
    <el-row type="flex" justify="space-between" class="info-bar">
      <span>成人机票</span>
      <span>￥{{airList.seat_infos?airList.seat_infos.org_settle_price:""}}</span>
      <span>x1</span>
    </el-row>
    <el-row type="flex" justify="space-between" class="info-bar">
      <span>机建＋燃油</span>
      <span>¥{{airList.airport_tax_audlet}}/人/单程</span>
      <span>x1</span>
    </el-row>
    <el-row type="flex" justify="space-between" align="middle" class="info-bar">
      <span>应付总额：</span>
      <span class="price">￥{{priceNum | toFix}}</span>
    </el-row>
  </div>
</template>
<script>
export default {
  props: {
    airList: {
      type: Object,
      default: {}
    },
    priceNum:{
        type:Number,
        default:0
    }
  },
  data() {
    return {};
  },
  computed: {
    rankTime() {
      if (!this.airList.dep_time) return "";
      const dep = this.airList.dep_time.split(":"); //将时间分割成["08","29"]
      const arr = this.airList.arr_time.split(":");
      const depval = dep[0] * 60 + +dep[1];
      //将时间转化成分钟 这里后面dep[1]位字符串格式，需要多一个+强制转化为数字类型
      const arrval = arr[0] * 60 + +arr[1];
      // 两个时间相减
      let dip = arrval - depval;
      if (dip < 0) {
        // 如果说两个时间相减小于，说明到了第二天
        dip = arrval + 60 * 24 - depval;
      }
      return `${Math.floor(dip / 60)}时${dip % 60}分`;
    },
    getsum(){
        console.log(this.priceNum)
    }
  },
  filters:{
      toFix(priceNum){
          return Number(priceNum).toFixed(2)
      }
  }
};
</script>
<style lang="less" scoped>
.aside {
  width: 350px;
  height: fit-content;
  border: 1px #ddd solid;
}

.air-info {
  padding: 15px;

  .info-top {
    margin-bottom: 10px;
    > div:last-child {
      font-size: 14px;
    }
  }

  .info-step {
    .flight-airport {
      strong {
        display: block;
        font-size: 22px;
        font-weight: normal;
      }

      span {
        font-size: 12px;
        color: #999;
      }
    }

    .flight-time {
      text-align: center;
      font-size: 12px;
      color: #999;
      span {
        display: block;
      }
    }
  }
}

.info-bar {
  border-top: 1px #ddd dashed;
  padding: 10px 15px;
  font-size: 14px;
  color: #666;

  .price {
    font-size: 28px;
    color: orange;
  }
}
</style>
