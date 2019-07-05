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
        <el-select size="mini" v-model="filtersitem.airport" placeholder="起飞机场">
          <el-option
            v-for="(item, index) in data.options.airport"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="filtersitem.flightTimes" placeholder="起飞时间">
          <el-option
            v-for="(item, index) in data.options.flightTimes"
            :key="index"
            :label="`${item.from}:00-${item.to}:00`"
            :value="`${item.from}:00-${item.to}:00`"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="filtersitem.company" placeholder="航空公司">
          <el-option
            v-for="(item, index) in data.options.company"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="filtersitem.airSize" placeholder="机型">
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
      filtersitem: {
        airport: "",
        flightTimes: "",
        company: "",
        airSize: ""
      },
      plantsize: [
        { type: "大", size: "L" },
        { type: "中", size: "M" },
        { type: "小", size: "S" }
      ]
    };
  },
  methods: {
    handleFilter(val) {
      var arr = this.data.flights;
      if (val.airport !== "") {
        arr = arr.filter(v => {
          // 将机票列表与当前选中的值进行比较，
          return v.org_airport_name === val.airport;
        });
      }
      if (val.flightTimes !== "") {
        // console.log(val.flightTime);
        let timestr = val.flightTimes.split("-"); //这里是从渲染的数据拿到的，需要重新切割
        let from = timestr[0].split(":")[0]; //筛选的开始起飞时间
        let to = timestr[1].split(":")[0]; //筛选的结束起飞时间
        arr = arr.filter(v => {
          const start = +v.dep_time.split(":")[0]; //起飞时间
          return from <= start && to > start; //需要在起飞时间之间才行
        });
      }
      if (val.company !== "") {
        arr = arr.filter(v => {
          return val.company === v.airline_name;
        });
      }
      if (val.airSize !== "") {
        arr = arr.filter(v => {
          return val.airSize === v.plane_size;
        });
      }
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
  },
  watch: {
    filtersitem: {
      handler(val, oldVal) {
        this.handleFilter(val);
      },
      deep: true
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