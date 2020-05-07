<template>
  <div class="login" v-loading="loading">
    <div class="login-back">
      <img src="../assets/img/bgf.png" @click="$router.back()" />
      <span>手机号{{isLogin?"登录":"注册"}}</span>
    </div>
    <div class="login-form">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" class="demo-ruleForm">
        <el-form-item prop="nickname" v-if="!isLogin">
          <el-input type="text" v-model="ruleForm.nickname" autocomplete="off" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="username">
          <el-input
            type="text"
            v-model="ruleForm.username"
            autocomplete="off"
            placeholder="请输入手机号码"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="ruleForm.password"
            autocomplete="off"
            placeholder="请输入密码"
          ></el-input>
        </el-form-item>

        <el-form-item v-if="!isLogin" class="register-button">
          <el-button type="primary" @click="submitForm('ruleForm')" class="button">注册</el-button>
          <el-button @click="resetForm('ruleForm')" class="button">重置</el-button>
        </el-form-item>
        <el-form-item v-if="isLogin">
          <el-button type="primary" @click="loginForm('ruleForm')" class="login-button">登录</el-button>
        </el-form-item>
      </el-form>
      <div class="switch" @click="switchover">{{isLogin?'没有账号?立即注册':'已有账号?立即登录'}}</div>
    </div>
  </div>
</template>


<script>
import { mapMutations } from "vuex";
import { SET_ISLOGIN, SET_USER } from "../store/mutation-types";
export default {
  data() {
    //表单验证
    var valiUserName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else {
        if (value.length < 2) {
          callback(new Error("用户名太短了"));
        } else {
          if (value.length > 16) {
            callback(new Error("用户名太长了"));
          } else {
            callback();
          }
        }
      }
    };
    var valiPhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号码"));
      } else {
        if (value.length != 11 || Number.isInteger(value)) {
          callback(new Error("请输入正确的手机号码"));
        } else {
          callback();
        }
      }
    };
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };

    return {
      isLogin: true, //登录注册切换
      loading: false, //加载显示
      ruleForm: {
        nickname: "", //用户名
        username: "", //手机号
        password: "" //密码
      },
      rules: {
        nickname: [{ validator: valiUserName, trigger: "blur" }],
        username: [{ validator: valiPhone, trigger: "blur" }],
        password: [{ validator: validatePass, trigger: "blur" }]
      }
    };
  },
  methods: {
    ...mapMutations({
      setIsLogin: SET_ISLOGIN,
      setUser: SET_USER
    }),
    //提示框
    message(text) {
      this.$message.closeAll();
      this.$message({
        message: text,
        center: true,
        duration: 2000,
        customClass: "part-message",
        offset: 100
      });
    },
    //注册
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          new Promise((resolve, reject) => {
            let options = {
              ...this.ruleForm,
              appKey: window.WebIM.config.appKey,
              success: function(res) {
                resolve(res);
              },
              error: function(err) {
                reject(err);
              },
              apiUrl: window.WebIM.config.apiUrl
            };
            window.WebIM.conn.registerUser(options);
          })
            .then(res => {
              console.log(res);
              this.loading = false;
              this.message("注册成功");
              this.isLogin = true;
            })
            .catch(err => {
              console.log(err);
              this.loading = false;
              this.message("注册失败,该账号已注册");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //登录
    loginForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true;
          new Promise((resolve, reject) => {
            let options = {
              apiUrl: window.WebIM.config.apiUrl,
              user: this.ruleForm.username,
              pwd: this.ruleForm.password,
              appKey: window.WebIM.config.appkey,
              success: function(res) {
                resolve(res);
              },
              error: function(err) {
                reject(err);
              }
            };
            window.WebIM.conn.open(options);
          })
            .then(res => {
              console.log(res);
              this.loading = false;
              this.message("登录成功");
              this.setIsLogin(true);
              this.setUser(res.user.username);
              let result = window.localStorage.getItem(
                `user_${res.user.username}`
              );
              if (result) {
                window.localStorage.setItem("user", result);
              } else {
                result = { account: res.user.username, collect: [] };
                window.localStorage.setItem(
                  `user_${res.user.username}`,
                  JSON.stringify(result)
                );
              }

              this.$router.push({ name: "My" });
            })
            .catch(err => {
              console.log(err);
              this.loading = false;
              this.message("手机号或密码错误");
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //切换注册/登录
    switchover() {
      this.isLogin = !this.isLogin;
      this.ruleForm.nickname=""
      this.ruleForm.username=""
      this.ruleForm.password=""
    },
    //清空表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>


<style lang="less" scoped>
.login {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: calc(100vh - 50px);
  background-color: #fff;
  box-sizing: border-box;
  padding-right: 40px;
}
.login-back {
  height: 50px;
  display: flex;
  align-items: center;
  padding-left: 20px;
  img {
    width: 28px;
    height: 28px;
    margin-left: -5px;
  }
  span {
    font-size: 18px;
    padding-left: 10px;
    padding-top: 2px;
  }
}
.login-form {
  padding-top: 30px;
  margin-left: 40px;
  .login-button {
    width: 100%;
    border-radius: 20px;
  }
  .switch {
    text-align: right;
    font-style: 12px;
    color: #409eff;
  }
  .register-button {
    width: 100%;
    .button {
      width: calc(50% - 5px);
    }
  }
}
</style>