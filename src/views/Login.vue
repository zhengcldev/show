<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" class="login-box">
      <h3 class="login-title">欢迎登陆</h3>
      <el-form-item label="账号" prop="userId">
        <el-input type="text" placeholder="请输入账号" v-model="form.userId"></el-input>
      </el-form-item>

      <el-form-item label="密码" prop="password">
        <el-input type="password" placeholder="请输入密码" v-model="form.password"></el-input>
      </el-form-item>

      <!-- 验证码 显示 -->
      <el-form-item label="验证码" prop="code">
        <el-input type="text" placeholder="请输入验证码" v-model="form.code"
                  style="width: 150px;margin-right: 10px;"></el-input>
        <img id="verifyimg" @click="getvCode" alt="点击更换验证码" src=""/>
      </el-form-item>

      <el-form-item>
        <el-checkbox v-model="checked">记住我</el-checkbox>
        <el-button type="primary" style="width: 100%" @click="submitForm('form')">登陆</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      checked:'',
      captchaUrl: '',
      form: {
        userId: '',
        password: '',
        code: ''
      },
      rules: {
        userId: [{
          required: true,
          message: '请输入账号',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }],
        code: [{
          required: true,
          message: '请输入验证码',
          trigger: 'blur'
        }]
      }
    }
  },
  mounted() {
    this.getvCode();
  },
  methods: {
    getvCode() {
      document.getElementById("verifyimg").src = this.timestamp("http://127.0.0.1:8864/skyline/verifyCode");
    },
    timestamp(url) {
      let getTimestamp = new Date().getTime();
      if (url.indexOf("?") > -1) {
        url = url + "&timestamp=" + getTimestamp
      } else {
        url = url + "?timestamp=" + getTimestamp
      }
      return url;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.postRequest('/skyline/login', this.form).then(rep => {
            if (rep) {
              if (rep.data.data) {
                if (rep.data.data.isLogin) {
                  sessionStorage.setItem('isLogin', 'true');
                  if(rep.data.data.isSupper===1){
                    window.sessionStorage.setItem("isSupper",'true');
                  }else{
                    window.sessionStorage.setItem("isSupper",'false');
                  }
                  window.sessionStorage.setItem("userId", this.form.userId);
                  this.$router.push({
                    name: 'Home',
                    params: {
                      name: this.form.userId
                    }
                  });
                } else {
                  this.getvCode();
                  this.$message({
                    message: rep.data.data.Msg,
                    type: 'error'
                  });
                }
              } else {
                this.$message({
                  message: '未知错误',
                  type: 'error'
                });
              }
            }
          }).catch(function (error) {
            console.log(error);
          });
        } else {
          this.$message({
            message: '请输入用户名或密码',
            type: 'warning'
          });
          return false;
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.login-box {
  background-clip: padding-box;
  width: 350px;
  margin: 120px auto;
  border: 1px solid #DCDFE6;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 30px #DCDFE6;
}

.login-title {
  text-align: center;
}
</style>
