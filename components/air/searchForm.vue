<template>
  <div class="contain">
    <el-row type="flex" justify="space-between" class="info">
      <span
        v-for="(item, index) in tabs"
        :key="index"
        @click="handleSearch(index)"
        :class="{active:current==index}"
      >
        <i :class="item.icon"></i>
        {{item.name}}
      </span>
    </el-row>
    <div class="change" v-if="current==0">
      <span @click="change">换</span>
    </div>
    <el-form
      v-if="current==0"
      :model="form"
      status-icon
      label-width="80px"
      label-position="left"
      style="padding:20px;"
    >
      <el-form-item label="出发城市">
        <el-autocomplete
          v-model="form.departCity"
          :fetch-suggestions="SearchStart"
          placeholder="请输入出发城市"
          @select="handleSelectStart"
          style="width:210px"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="到达城市">
        <el-autocomplete
          v-model="form.destCity"
          :fetch-suggestions="SearchArrive"
          placeholder="请搜索到达城市"
          @select="handleSelectArrive"
          style="width:210px"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="出发时间">
        <el-date-picker
          v-model="form.departDate"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-DD"
          style="width:210px"
          @change="handleStartTime"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm" style="width:210px">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-form v-if="current==1"></el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      current: 0,
      tabs: [
        { icon: "iconfont icondancheng", name: "单程" },
        { icon: "iconfont iconshuangxiang", name: "往返" }
      ],
      form: {
        departCity: "",
        departCode: "",
        destCity: "",
        destCode: "",
        departDate: ""
      }
    };
  },
  methods: {
    handleSearch(index) {
      if (index === 1) {
        this.$confirm("目前暂不支持往返，请使用单程选票！", "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          type: "warning"
        });
      }
    },
    // 搜索出发点
    // 出发城市输入框获得焦点时触发
    // value 是选中的值，cb是回调函数，接收要展示的列表
    SearchStart(value, cb) {
      this.querySearchAsync(value).then(res => {
        if (res.length > 0) {
          // 如果不在下拉列表选择，则默认选中第一项
          this.form.departCity = res[0].value;
          this.form.departCode = res[0].sort;
        }
        cb(res);
      });
    },
    // 搜索到达点
    SearchArrive(value, cb) {
      this.querySearchAsync(value).then(res => {
        if (res.length > 0) {
            // 如果用户有输入，但是选择，则默认选中第一项
          // 如果不在下拉列表选择，则默认选中第一项
          this.form.destCity = res[0].value;
          this.form.destCode = res[0].sort;
        }
        cb(res);
      });
    },
    // 选择出发点触发的事件
    handleSelectStart(v) {
      this.form.departCity = v.value;
      this.form.departCode = v.sort;
    },
    // 选择抵达点触发的事件
    handleSelectArrive(v) {
      this.form.destCity = v.value;
      this.form.destCode = v.sort;
    },
    handleStartTime(time) {
      this.form.departDate = time;
    },
    // 输入信息交换
    change() {
      let { departCity, departCod, destCity, destCode } = this.form;
      this.form.departCity = destCity;
      this.form.departCode = destCode;
      this.form.destCity = departCity;
      this.form.destCode = departCod;
    },
    // 搜索航班
    submitForm() {
      //   先验证表单内是否有数据
      const rules = {
        depart: { value: this.form.departCity, message: "请选择出发城市" },
        dest: { value: this.form.destCity, message: "请选择到达城市" },
        departDate: { value: this.form.departDate, message: "请选择到达日期" }
      };
      let valid = true;
      Object.keys(rules).forEach(v => {
        if (!v) return;
        const item = rules[v];
        if (!item.value) {
          valid = false;
          this.$confirm(item.message, "提示", {
            confirmButtonText: "确定",
            showCancelButton: false,
            type: "warning"
          });
        }
        // 如果valid为false 则不用继续向下执行
        if (!valid) return;
        this.$router.push({
          path: "/air/flights",
          query: this.form
        });
        this.$store.commit("air/getSearchDate",this.form)
      });
    },
    // 查询城市的方法
    querySearchAsync(queryString) {
      return new Promise((resolve, reject) => {
        // 如果关键字是空，则直接返回
        if (!queryString) {
          return resolve([]);
        }
        this.$axios({
          url: `/airs/city`,
          params: {
            name: queryString
          }
        }).then(res => {
          const { data } = res.data;
          // 下拉提示列表必须要有value字段
          const arr = data.map(v => {
            return {
              ...v,
              value: v.name.replace("市", "")
            };
          });
          resolve(arr);
        });
      });
    }
  }
};
</script>
<style lang="less" scoped>
.contain {
  position: relative;
  height: 350px;
  border: 1px solid #dddddd;
}
.info {
  width: 360px;
  span {
    display: block;
    height: 48px;
    text-align: center;
    flex: 1;
    border: 1px solid #cccccc;
    box-sizing: border-box;
    line-height: 48px;
  }
  .active {
    border-top-color: orange;
    background: #dddddd;
  }
}
.change {
  width: 50px;
  height: 50px;
  border: 2px solid #cccccc;
  position: absolute;
  right: 6%;
  top: 27%;
  border-left: none;
  span {
    cursor: pointer;
    text-align: center;
    line-height: 20px;
    position: absolute;
    right: -11px;
    top: 50%;
    transform: translateY(-50%);
    border: 1px solid #cccccc;
    width: 20px;
    height: 20px;
    color: #ffffff;
    background-color: #cccccc;
  }
}
</style>
