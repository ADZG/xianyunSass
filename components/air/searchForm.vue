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
import { promised } from "q";
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
        this.$alert("该模块正在研发中", "哈咯");
      }
    },
    async SearchStart(value, cb) {
      let arr = await this.asyncQuery(value);
      if (arr.length > 0) {
        this.form.departCity = arr[0].value;
        this.form.departCode = arr[0].sort;
      }
      cb(arr);
    },
    async SearchArrive(value, cb) {
      let arr = await this.asyncQuery(value);
      if (arr.length > 0) {
        // 当输入框有输入的时候，先默认选中第一个
        this.form.destCity = arr[0].value;
        this.form.destCode = arr[0].sort;
      }
      cb(arr);
    },
    handleSelectStart(v) {
      this.form.departCity = v.value;
      this.form.departCode = v.sort;
    },
    handleSelectArrive(v) {
      this.form.destCity = v.value;
      this.form.destCode = v.sort;
    },
    handleStartTime(v) {
      this.form.departDate = v;
    },
    submitForm() {
      const rules = {
        depart: {
          value: this.form.departCity,
          message: "请输入出发城市名"
        },
        dest: {
          value: this.form.destCity,
          message: "请输入抵达城市名"
        }
      };
      let valid = true;
      Object.keys(rules).forEach(v => {
        if (!valid) return;
        Object.keys(rules).forEach(v => {
          if (!valid) return;
          const item = rules[v];
          if (!item.value) {
            valid = false;
            this.$confirm(item.message, "提示", {
              confirmButtonText: "确定",
              showCancelButton: false,
              type: "warning"
            });
          }
        });
      });
      if (!valid) return; //如果验证不通过，则不继续执行
      this.$router.push({
        path: "air/flights",
        query: this.form
      });
    },
    asyncQuery(queryString) {
      return new Promise((resolve, reject) => {
        if (!queryString) {
          return resolve([]);
        }
        return this.$axios({
          url: `/airs/city`,
          params: {
            name: queryString
          }
        }).then(res => {
          const { data } = res.data;
          const arr = data.map(v => {
            return { ...v, value: v.name.replace("市", "") };
          });
          resolve(arr);
        });
      });
    },
    change() {}
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
