<template>
  <div>
    <div>
      <el-form ref="form" :model="form" label-width="80px" label-position="left" style="border-right: 2px;">
        <el-form :inline="true">
          <el-form-item label="用 户 名" label-width="80px" required="true" class="white-space">
            <el-input style="width: 300px" v-model="form.userName" placeholder="必填字段，用户名"></el-input>
          </el-form-item>
          <el-form-item label="用户账号" required="true">
            <el-input style="width: 300px" v-model="form.userId" placeholder="必填字段，用户账号"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="form.email" style="width: 310px" placeholder="请输入邮箱"></el-input>
          </el-form-item>
        </el-form>
        <el-form :inline="true">
          <el-form-item label="性    别" label-width="100px" class="white-space">
            <el-radio v-model="form.sex" label="男">男</el-radio>
            <el-radio v-model="form.sex" label="女">女</el-radio>
          </el-form-item>

          <el-form-item label="电     话" label-width="80px" class="white-space" style="margin-left: 100px">
            <el-input v-model="form.tel" style="width: 310px;margin-right: 100px;" placeholder="请输入电话号码"></el-input>
          </el-form-item>

          <el-form-item label="是否管理员" required="true" label-width="100px">
            <el-radio v-model="form.isSupper" label="1">是</el-radio>
            <el-radio v-model="form.isSupper" label="0">否</el-radio>
          </el-form-item>

        </el-form>

        <el-form :inline="true">

        </el-form>
        <el-form :inline="true">
          <el-form-item label="  所属机构" label-width="70px" style="width: 300px" class="white-space">
            <el-input style="width: 300px" v-model="form.dept" placeholder="请输入机构名"></el-input>
          </el-form-item>

          <el-form-item label="  个人简介" label-width="70px" style="margin-left:80px;width: 300px" class="white-space">
            <el-input style="width: 300px" v-model="form.introduction" placeholder="请输入个人简介"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit" style="margin-left: 350px">立即创建</el-button>
          </el-form-item>
        </el-form>

        <el-form :model="searchForm" :inline="true" style="margin-top: 25px">
          <el-form-item label="用户账号" label-width="70px" style="margin-left:10px;width: 80px" class="white-space">
            <el-input style="width: 300px" v-model="searchForm.userId" placeholder="请输入查询用户账号"></el-input>
          </el-form-item>

          <el-form-item style="margin-left: 300px">
            <el-button type="primary" @click="onCheck" style="width: 100px">查询用户</el-button>
          </el-form-item>


        </el-form>
      </el-form>
    </div>

    <div>
      <el-table :data="tableData" style="width: 100%" stripe="true">
        <el-table-column prop="id" label="id" sortable width="60px" align="center"></el-table-column>
        <el-table-column prop="userId" label="用户账号" width="120px" align="center"></el-table-column>
        <el-table-column prop="userName" label="用户名" width="100px" align="center"></el-table-column>
        <el-table-column prop="sex" label="性别" width="100px" align="center"></el-table-column>
        <el-table-column prop="isSupper" label="是否管理员" width="100px" align="center">
          <template slot-scope="scope">
            <span v-if=" scope.row.isSupper=== 0 ">否</span>
            <span v-else>是</span>
          </template>
        </el-table-column>
        <el-table-column prop="dept" label="所属机构" width="110px" align="center"></el-table-column>
        <el-table-column prop="state" label="账号状态" width="120px" align="center">
          <template slot-scope="scope">
            <span v-if=" scope.row.state=== 1 ">正常</span>
            <span v-else>锁定</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" sortable label="创建时间" align="center" :formatter="formatDate">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="handleUnlock(scope.$index, scope.row)">解锁</el-button>
            <el-button size="mini" type="danger" @click="handleLock(scope.$index, scope.row)">锁定</el-button>
            <el-button size="mini" type="warning" @click="handleReset(scope.$index, scope.row)">重置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

</template>
<script>
export default {
  name: "UserCreate",
  data() {
    return {
      tableData: [],
      hideUpload: false,
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,//图片预览弹窗
      formLabelWidth: '80px',
      limitNum: 1,
      dialogVisible2: false, //弹窗
      searchForm: {
        userId: '',
      },
      form: {
        id: '',
        userId: '',
        userName: '',
        password: '123',
        sex: '',
        isSupper: '',
        creator: '',
        createTime: '',
        updater: '',
        updateTime: '',
        tel: '',
        email: '',
        dept: '',
        introduction: ''
      }
    }
  },
  created() {
    this.getRequest('/skyline/userInfo', null).then(resp => {
      if (resp.data.data) {
        this.tableData = resp.data.data;
      }
    })
  },
  methods: {
    onSubmit() {
      let user = window.sessionStorage.getItem("userId");
      this.form.pfpUrl = sessionStorage.getItem("pfpUrl");
      this.form.creator = user;
      this.form.createTime = new Date().getTime();
      this.form.updater = user;
      this.form.updateTime = new Date().getTime();
      this.postRequest("/skyline/createUser", this.form).then(resp => {
        if (resp.data.data) {
          this.$message.success("添加用户成功");
          setTimeout(function () {
            location.reload()
          }, 2000);
        } else {
          if (resp.data.status === "502") {
            this.$message.error(resp.data.message);
          } else {
            this.$message.error("添加用户失败");
          }
        }
      })
    },
    onCheck() {
      this.getRequest("/skyline/userInfo", this.searchForm).then(resp => {
        if (resp.data.data) {
          this.tableData = undefined;
          let data = [];
          data.push(resp.data.data);
          this.tableData = data;
        } else {
          this.$message.warning("查询用户账号不存在");
        }
      })
    },
    handleUnlock(index, row) {
      // 解锁用户
      let params = {userId: row.userId, state: 1};
      this.postRequest("/skyline/lock", params).then(resp => {
        if (resp.data.data) {
          this.$message.success("用户" + row.userId + "解锁成功");
          setTimeout(function () {
            location.reload()
          }, 2000);
        } else {
          this.$message.error(resp.data.message);
        }
      })
    },
    handleLock(index, row) {
      // 锁定用户
      let params = {userId: row.userId, state: 0};
      this.postRequest("/skyline/lock", params).then(resp => {
        if (resp.data.data) {
          this.$message.warning("用户" + row.userId + "锁定成功");
          setTimeout(function () {
            location.reload()
          }, 2000)
        } else {
          this.$message.error(resp.data.message);
        }
      })
    },
    handleReset(index, row) {
      // 锁定用户
      let params = {userId: row.userId};
      console.log("here");
      this.postRequest("/skyline/resetPassword", params).then(resp => {
        if (resp.data.data != null) {
          const h = this.$createElement;
          this.$notify({
            title: '重置密码',
            message: h('i', {style: 'color: teal'}, '用户' + row.userId + "的密码重置为：" + resp.data.data + ",请妥善保管！"),
            duration: 0
          });
        } else {
          this.$message.error(resp.data.message);
        }
      })
    },
    handleBeforeUpload(file) {
      if (!(file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/jpg' || file.type === 'image/jpeg')) {
        this.$notify.warning({
          title: '警告',
          message: '请上传格式为image/png, image/gif, image/jpg, image/jpeg的图片'
        })
      }
      let size = file.size / 1024 / 1024 / 2
      if (size > 2) {
        this.$notify.warning({
          title: '警告',
          message: '图片大小必须小于2M'
        })
      }
      let fd = new FormData();//通过form数据格式来传
      fd.append("picFile", file); //传文件
      this.postRequest("/skyline/pfpUpload", fd).then(resp => {
        sessionStorage.setItem("pfpUrl", resp.data);
      });
    },
    formatDate(row, column) {
      let date = new Date(parseInt(row.createTime));
      let Y = date.getFullYear() + '-';
      let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) + '-' : date.getMonth() + 1 + '-';
      let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
      let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
      let m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
      let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
      return Y + M + D + h + m + s;
    },
  }
}
</script>

<style scoped lang="scss">

.hide .el-upload--picture-card {
  display: none;
}

.el-form-item__label {
  text-align: justify;
}


.create-box {
  background-clip: padding-box;
  width: 1000px;
  margin: auto;
  padding: 20px;
  border: 1px solid #DCDFE6;
  border-radius: 5px;
  box-shadow: 0 0 30px #DCDFE6;
}

.white-space {
  white-space: pre
}
</style>