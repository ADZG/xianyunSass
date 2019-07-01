<template>
  <div class="filters">
    <el-row type="flex" class="filters-top" justify="space-between" align="middle">
      <el-col :span="8">
        单程：
        {{data.info.departCity}} - {{data.info.destCity}}
        /
        {{data.info.departDate}}
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="airport" placeholder="起飞机场" @change="handleAirport">
          <el-option
            v-for="(item, index) in data.options.airport"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="flightTimes" placeholder="起飞时间" @change="handleFlightTimes">
          <el-option
            v-for="(item, index) in data.options.flightTimes"
            :key="index"
            :label="`${item.to}:00-${item.from}:00`"
            :value="item"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="company" placeholder="航空公司" @change="handleCompany">
          <el-option
            v-for="(item, index) in data.options.company"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="airSize" placeholder="机型" @change="handleAirSize">
          <el-option
            v-for="(item, index) in plantsize"
            :key="index"
            :label="item.type"
            :value="item.size"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
    <div class="filter-cancel">
      筛选：
      <el-button type="primary" round plain size="mini" @click="handleFiltersCancel">撤销</el-button>
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
      airport: "",
      flightTimes: "",
      company: "",
      airSize: "",
      plantsize: [
        { type: "大", size: "L" },
        { type: "中", size: "M" },
        { type: "小", size: "S" }
      ]
    };
  },
  methods: {
    // 选择机场的时候触发
    handleAirport(value) {
      const arr = this.data.flights.filter(v => {
        //   遍历当前父组件传入的数据列表，如果输入框的数据和父组件的数组有匹配的，则返回新成一个新的数组
        return v.org_airport_name === value;
      });
      this.$emit("setDataList", arr);
    },
    // 选择出发时间触发
    handleFlightTimes(value) {
      const arr = tihs.data.flights.filter(v => {
        // 当前时间的抵达时间小于等于筛选项的抵达时间;
        return (
          value.from <= +v.dep_time.split(":")[0] &&
          value.to > +v.dep_time.split(":")[1]
        );
      });
      this.$emit("setDataList", arr);
    },
    // 选择航空公司触发
    handleCompany(value) {
      // console.log(this.data)
      const arr = this.data.flights.filter(v => {
        //   遍历当前父组件传入的数据列表，如果输入框的数据和父组件的数组有匹配的，则返回新成一个新的数组
        return v.airline_name === value;
      });
      this.$emit("setDataList", arr);
    },
    // 选择机型触发
    handleAirSize(value) {
      const arr = this.data.flights.filter(v => {
        //   遍历当前父组件传入的数据列表，如果输入框的数据和父组件的数组有匹配的，则返回新成一个新的数组
        return v.plane_size === value;
      });
      this.$emit("setDataList", arr);
    },
    // 取消筛选条件
    handleFiltersCancel() {
    //   所有的筛选条件全部清空;
      this.airport = "";
      this.flightTimes = "";
      this.company = "";
      this.airSize = "";
      this.$emit("setDataList", this.data.flights);
    }
  }
};
</script>
<style scoped lang="less">
.filters {
  margin-bottom: 20px;
}

.filters-top {
  > div {
    /deep/ .el-select {
      margin-left: 10px;
    }
  }
}

.filter-cancel {
  margin-top: 10px;
}
</style>