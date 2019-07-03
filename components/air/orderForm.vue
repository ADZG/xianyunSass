<template>
  <div class="main">
    <div class="air-column">
      <h2>乘机人</h2>
      <el-form class="member-info">
        <div class="member-info-item" v-for="(item, index) in users" :key="index">
          <el-form-item label="乘机人类型">
            <el-input placeholder="姓名" class="input-with-select" v-model="item.username">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="成人" value="1"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <el-form-item label="证件类型">
            <el-input placeholder="证件号码" class="input-with-select" v-model="item.id">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="身份证" value="1" :checked="true"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <span class="delete-user" @click="handleDeleteUser(index)">-</span>
        </div>
      </el-form>

      <el-button class="add-member" type="primary" @click="handleAddUsers">添加乘机人</el-button>
    </div>

    <div class="air-column">
      <h2>保险</h2>
      <div v-for="(item, index) in insuinfo" :key="index">
        <div class="insurance-item">
          <el-checkbox
            :label="`${item.type}：￥${item.price}/份×1  最高赔付${item.compensation}`"
            border
            @change="handleInsuinfo(item)"
          ></el-checkbox>
        </div>
      </div>
    </div>

    <div class="air-column">
      <h2>联系人</h2>
      <div class="contact">
        <el-form label-width="60px">
          <el-form-item label="姓名">
            <el-input v-model="contactName"></el-input>
          </el-form-item>

          <el-form-item label="手机">
            <el-input placeholder="请输入内容" v-model="contactPhone">
              <template slot="append">
                <el-button @click="handleSendCaptcha">发送验证码</el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="验证码">
            <el-input v-model="tel"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="warning" class="submit" @click="handleSubmit">提交订单</el-button>
      </div>
      <input type="hidden" :value="calculate" />
    </div>
  </div>
</template>
<script>
export default {
  props: {
    insuinfo: {
      type: Array,
      default: []
    }, //保险服务数组
    price: {
      type: Object,
      default: {}
    } //机票单价
  },
  data() {
    return {
      users: [{ username: "", id: "" }],
      insurances: [],
      contactName: "",
      contactPhone: "13177889999",
      invoice: false,
      tel: "000000",
      captcha: "000000"
    };
  },
  methods: {
    // 添加乘机人
    handleAddUsers() {
      // 将当前的客户列表结构，在添加一个新的对象进去，增加了一个位置
      this.users = [...this.users, { username: "", id: "" }];
    },
    // 移除乘机人
    handleDeleteUser(index) {
      this.users = this.users.splice(index, 1);
    },
    handleInsuinfo(item) {
      // 首页检查该id是否存在于数组中，如果有则找到对应的索引
      const index = this.insurances.indexOf(item.id);
      if (index === -1) {
        //  如果不存在，则添加到数组中
        this.insurances.push(item.id);
      } else {
        //  如果存在着，则删除该索引位置的数据
        this.insurances.splice(index, 1);
      }
    },
    // 发送手机验证码
    handleSendCaptcha() {
      //   先检测有没有输入手机号
      if (this.contactPhone === "") {
        this.$message({
          showClose: true,
          message: "请先输入手机号",
          type: "error"
        });
        return false;
      }
      if (this.contactPhone.length !== 11) {
        this.$notify({
          title: "警告",
          message: "手机号码必须11位",
          type: "warning"
        });
        return false;
      }
      this.$store.dispatch("user/authCode", this.contactPhone).then(res => {
        this.$notify({
          title: "提示",
          message: "验证码已经发送",
          type: "warning"
        });
      });
    },
    // 提交订单
    handleSubmit() {
      this.$axios({
        url: "/airorders",
        method: "post",
        data: {
          users: this.users,
          insurances: this.insurances,
          contactName: this.contactName,
          contactPhone: this.contactPhone,
          captcha: this.captcha,
          invoice: false,
          seat_xid: this.$route.query.seat_xid,
          air: this.$route.query.id
        },
        // 本次请求需要在请求头中添加token秘钥
        headers: {
          Authorization: `Bearer ${this.$store.state.user.userInfo.token}`
        }
      }).then(res => {
        this.$message({
          message: "正在生成订单！请稍等",
          type: "success"
        });
      });
    }
  },
  computed: {
    calculate() {
      if (!this.price.money) return 0;
      let pic = 0;
      const usersLength = this.users.length;
      // 计算总价
      pic += this.price.money * usersLength;
      // 保险总价
      this.insurances.forEach(v => {
        pic += this.insuinfo[v - 1].price * usersLength;
      });
      pic = pic + this.price.oil * usersLength;
      this.$emit("sendPrice", pic);
      return pic;
    }
  }
};
</script>
<style lang="less" scoped>
.air-column {
  border-bottom: 1px #ddd dashed;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.air-column h2 {
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: normal;
}

/deep/ .el-select .el-input {
  width: 130px;
}

.input-with-select {
  width: 590px;
}

.input-with-select /deep/ .el-input-group__prepend {
  background-color: #fff;
}
.member-info /deep/ .el-form-item {
  margin-bottom: 0;
}

.member-info-item {
  border-bottom: 1px #eee dashed;
  padding-bottom: 20px;
  position: relative;

  &:first-child {
    .delete-user {
      display: none;
    }
  }
}

.add-member {
  margin-top: 20px;
}

.delete-user {
  display: block;
  background: #ddd;
  width: 16px;
  height: 16px;
  font-size: 14px;
  text-align: center;
  line-height: 16px;
  color: #fff;
  cursor: pointer;
  border-radius: 50px;
  position: absolute;
  right: -30px;
  top: 50%;
}

.insurance {
  > div {
    margin-top: 10px;
  }
}

.insurance-item {
  margin-bottom: 20px;
}

.contact {
  /deep/ .el-input {
    width: 50%;
  }
}

.submit {
  margin: 50px auto;
  display: block;
  width: 250px;
  height: 50px;
}
</style>
