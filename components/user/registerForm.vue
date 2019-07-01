<template lang="">
    <div>
        <el-form ref="form" :model="form" label-width="70px" 
        :label-position="left" 
        style="margin-top:20px"
        :rules="rules">
            <el-form-item label="手机号" prop="username">
                <el-input v-model="form.username" ></el-input>
            </el-form-item>
            <el-form-item label="验证码" prop="captcha">
                <el-input v-model="form.captcha" >
                    <template slot="append">
                       <el-button type="info" disabled v-if="condition">请等待{{time}}秒后再次发送</el-button>
                        <el-button type="info" @click="sendmsg" v-else>发送验证码</el-button>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="用户名" prop="nickname">
                <el-input v-model="form.nickname" ></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="form.password" ></el-input>
            </el-form-item>
            <el-form-item label="确认密码"  prop="checkPassword">
                <el-input v-model="form.checkPassword" ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">立即创建</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      time:10,
      condition:false,
      left: "left",
      form: {
        username: "",
        captcha: "",
        nickname: "",
        password: "",
        checkPassword: ""
      },
      rules: {
        username: [
          { required: true, message: "手机号", trigger: "blur" },
          { min: 11, message: "长度在 11字符", trigger: "blur" }
        ],
        password: [{ required: true, message: "密码", trigger: "blur" }],
        captcha: [{ required: true, message: "验证码", trigger: "blur" }],
        nickname: [{ required: true, message: "用户名", trigger: "blur" }],
        checkPassword: [
          {
            validator: validatePass,
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    //   发送验证码
    sendmsg() {
      //   先检测有没有输入手机号
      if (this.form.username === "") {
        this.$message({
          showClose: true,
          message: "请先输入手机号",
          type: "error"
        });
        return false;
      }
      if (this.form.username.length !== 11) {
        this.$notify({
          title: "警告",
          message: "手机号码必须11位",
          type: "warning"
        });
        return false;
      } else {
        this.condition=true
        var timeid=setInterval(()=>{
          this.time--
          if(this.time===0){
            this.time=10
            this.condition=false
            clearInterval(timeid)
          }
        },1000)
      }

      this.$axios({
        method: "post",
        url: "/captchas",
        data: { tel: this.form.username }
      }).then(res => {
        console.log(res);
      });
    },

    onSubmit() {
      this.$refs["form"].validate(value => {
        if (value) {
          const { checkPassword, ...props } = this.form;
          this.$store.dispatch("user/register", props).then(res => {
            this.time=3
            var timeids=setInterval(()=>{
              this.time--
               this.$message.warning(`注册成功，即将在${this.time}秒后跳转到首页`);
              if(this.time===0){
                this.$store.dispatch("user/login",{username:this.form.username,password:this.form.password})
                this.$router.push("/");
                this.time=10
                clearInterval(timeids)
              }
            },1000)
          });
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
</style>
