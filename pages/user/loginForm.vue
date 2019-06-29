<template>
  <div>
    <el-form
      label-width="70px"
      :label-position="labelPosition"
      :model="loginForm"
      :rules="rules"
      ref="ruleForm"
      class="demo-ruleForm"
      style="margin-top:20px"
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="loginForm.username" placeholder="用户名/手机"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="loginForm.password" placeholder="密码" type="password"></el-input>
      </el-form-item>
      <p class="form-text">
        <nuxt-link to="#">忘记密码</nuxt-link>
      </p>
      <el-button class="submit" type="primary" @click="handleLoginSubmit('ruleForm')">登录</el-button>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      labelPosition: "left",
      loginForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [{ required: true, message: "账号", trigger: "blur" }],
        password: [{ required: true, message: "密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    handleLoginSubmit(){
        this.$refs["ruleForm"].validate((valid)=>{
            if(valid){
                this.$store.dispatch("user/login",this.loginForm).then((res)=>{
                    this.$message.success("登录成功")
                    this.$router.push("/")
                })
            }else{
                return false
            }
        })
    }
  }
};
</script>
<style lang="less" scoped>
.submit {
  width: 100%;
  margin-top: 10px;
}
.form-text {
  font-size: 12px;
  color: #409eff;
  text-align: right;
  line-height: 1;
}
</style>
