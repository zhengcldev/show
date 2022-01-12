<template>
  <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="password-box">
    <el-form-item label="原密码" prop="prePass">
      <el-input type="password" v-model="ruleForm.prePass" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="新密码" prop="pass">
      <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="checkPass">
      <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>


<script>
export default {
  name: 'UserPassword',
  data() {
    let checkPrePass = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('愿密码不能为空'));
      }
      setTimeout(() => {
        if (value.length > 15) {
          callback(new Error('密码长度不能超过15位'));
        }
      }, 1000);
    };
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入新密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else if (value.length > 15) {
        callback(new Error('密码长度不能超过15位'));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        prePass: '',
        pass: '',
        checkPass: ''
      },
      rules: {
        pass: [
          {validator: validatePass, trigger: 'blur'}
        ],
        checkPass: [
          {validator: validatePass2, trigger: 'blur'}
        ],
        prePass: [
          {validator: checkPrePass, trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        let data = {
          userId: window.sessionStorage.getItem("userId"),
          password: this.ruleForm.prePass,
          newPassword: this.ruleForm.checkPass
        };
        console.log(data);
        if (valid) {
          this.postRequest("/skyline/updatePassword", data).then(resp => {
            if (resp.data) {
              if (resp.data.data) {
                this.$message.success("密码修改成功，请重新登陆");
                this.$router.replace('/login');
                //this.route.replace('/login');
              } else {
                this.$message.error('原密码输入不正确，请重新输入');
              }
            } else {
              this.$message.error('未知错误，请重新输入');
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
}
</script>

<style lang="scss" scoped>
.password-box {
  background-clip: padding-box;
  width: 400px;
  margin: 100px auto 120px;
  padding: 20px;
  border: 1px solid #DCDFE6;
  border-radius: 5px;
  box-shadow: 0 0 30px #DCDFE6;
}
</style>
