<template>
  <div class="login-wrap">
    <div class="title">
      <h1>轮廓模式挖掘算法展示系统</h1>
    </div>
    <div>
      <el-form ref="form" :model="form" :rules="rules" class="login-box">
        <h3 class="login-title">欢迎登录</h3>
        <el-form-item label="账号" prop="userId">
          <el-input prefix-icon="el-icon-user" type="text" placeholder="请输入账号" v-model="form.userId"></el-input>
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input prefix-icon="el-icon-lock" type="password" placeholder="请输入密码" v-model="form.password"></el-input>
        </el-form-item>

        <!-- 验证码 显示 -->
        <el-form-item label="验证码" prop="code">
          <el-input prefix-icon="el-icon-picture-outline" type="text" placeholder="请输入验证码" v-model="form.code"
                    style="width: 150px;margin-right: 10px;"></el-input>
          <img id="verifyimg" @click="getvCode" alt="点击更换验证码" src=""/>
        </el-form-item>

        <el-form-item>
          <el-checkbox v-model="checked">记住我</el-checkbox>
          <el-button type="primary" style="width: 100%" @click="submitForm('form')">登陆</el-button>
        </el-form-item>

      </el-form>
      <div style="margin-top: -100px;margin-left: 600px;" class="active">Copyright @2022 北方工业大学</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      checked: true,
      captchaUrl: '',
      id: '',
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
  created() {
    this.form.userId=this.$cookies.get("uidInput");
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
                  if(this.checked){
                    this.$cookies.set('uidInput', this.form.userId,24*60*60);
                  }
                  this.$cookies.set('isLogin', 'true',24*60*60);
                  sessionStorage.setItem('isLogin', 'true');
                  if (rep.data.data.isSupper === 1) {
                    this.$cookies.set("isSupper", 'true',24*60*60);
                    window.sessionStorage.setItem("isSupper", 'true');
                  } else {
                    //window.sessionStorage.setItem("isSupper", 'false');
                    this.$cookies.set("isSupper", 'false',24*60*60);
                  }
                  this.$cookies.set("userId",this.form.userId,24*60*60);
                 // window.sessionStorage.setItem("userId", this.form.userId);
                  let params = {
                    userId: this.form.userId,
                    loginTime: new Date().getTime()
                  };
                  this.postRequest("/skyline/insertLog", params).then(resp => {
                    if (resp.data.data) {
                      this.$cookies.set("id", resp.data.data.id,24*60*60)
                      //window.sessionStorage.setItem("id", resp.data.data.id);
                    } else {
                      this.$message.error("日志写入失败");
                    }
                  });

                  this.$router.push({
                    name: '首页',
                    params: {
                      name: this.form.userId
                    }
                  });
                } else {
                  this.getvCode();
                  this.$message({
                    message: rep.data.message,
                    type: 'error'
                  });
                }
              } else {
                //用户已锁定
                if (rep.data.status === "405") {
                  this.$message.error(rep.data.message);
                } else {
                  this.getvCode();
                  this.$message({
                    message: '未知错误',
                    type: 'error'
                  });
                }
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
  background-color: #F8F8FF;
}

.title {
  text-align: center;
  margin-bottom: -80px;
  margin-top: 80px;
  color: #FFFFFF;
}

.login-title {
  text-align: center;
}

.login-wrap {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: #4682B4;
}
.active{
  color:#FFFFFF;
}
</style>
