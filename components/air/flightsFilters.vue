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
            :label="`${item.from}:00-${item.to}:00`"
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
    // 起飞机场筛选触发
    handleAirport(value) {
      let arr =this.data.flights.map(v => {
        // 将机票列表与当前选中的值进行比较，
        return v.org_airport_name === value;
      });
    },
    // 起飞时间筛选触发
    handleFlightTimes(value) {
      this.flightTimes = value.from + ":00-" + value.to + ":00";
      // 选择后是一个对象，将他转化

      const arr = this.data.flights.filter(v => {
        // 开始的小时数字
        const start = +v.dep_time.split(":")[0];

        return value.from <= start && value.to > start;
      });

      // 触发修改机票列表的方法 setDataList
      this.$emit("setDataList", arr);
    },
    // 选择航空公司触发
    handleCompany(value) {
      let arr = this.data.flights.map(v => {
        return v.airline_name === value;
      });

      this.$emit("setDataList", arr);
    },
    // 选择机型大小触发
    handleAirSize(value) {
      let arr = this.data.flights.map(v => {
        return v.plane_size === value;
      });

      this.$emit("setDataList", arr);
    },
    // 撤销所有筛选条件触发
    handleFiltersCancel() {
      this.airport = "";
      this.flightTimes = "";
      this.company = "";
      this.airSize = "";
      // 清空所有选择项
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