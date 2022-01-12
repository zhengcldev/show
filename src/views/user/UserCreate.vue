<template>
  <el-form ref="form" :model="form" label-width="80px" label-position="left" style="border-right: 2px;"
           class="create-box">
    <el-form-item label="用户头像" label-width="70px">
      <el-upload ref="upload"
                 accept="image/png,image/gif,image/jpg,image/jpeg"
                 list-type="picture-card"
                 action=""
                 :limit=limitNum
                 :auto-upload="false"
                 :on-exceed="handleExceed"
                 :before-upload="handleBeforeUpload"
                 :on-preview="handlePictureCardPreview"
                 :on-remove="handleRemove"
                 :on-change="imgChange"
                 :file-list="fileList"
                 :class="{hide:hideUpload}">
        <i class="el-icon-plus"></i>
      </el-upload>
    </el-form-item>
    <el-form :inline="true">
      <el-form-item label="用 户 名" label-width="80px" required="true" class="white-space">
        <el-input style="width: 300px" v-model="form.userName"></el-input>
      </el-form-item>
      <el-form-item label="用户Id" required="true">
        <el-input style="width: 300px" v-model="form.userId"></el-input>
      </el-form-item>
    </el-form>
    <el-form-item label="性    别" required="true" label-width="80px" class="white-space">
      <el-radio v-model="form.sex" label="男">男</el-radio>
      <el-radio v-model="form.sex" label="女">女</el-radio>
    </el-form-item>
    <el-form-item label="联系地址" label-width="80px" style="width: 750px">
      <el-input v-model="form.address"></el-input>
    </el-form-item>
    <el-form :inline="true">
      <el-form-item label="电     话" label-width="80px" class="white-space">
        <el-input v-model="form.tel" style="width: 310px"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="form.email" style="width: 310px"></el-input>
      </el-form-item>
    </el-form>
    <el-form-item label="是否管理" required="true" label-width="80px">
      <el-radio v-model="form.isSupper" label="1">是</el-radio>
      <el-radio v-model="form.isSupper" label="0">否</el-radio>
    </el-form-item>
    <el-form-item label="  所属机构" label-width="70px" style="width: 750px" class="white-space">
      <el-input v-model="form.dept"></el-input>
    </el-form-item>
    <el-form-item label="  个人简介" label-width="70px" style="width: 750px" class="white-space">
      <el-input v-model="form.introduction"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: "UserCreate",
  data() {
    return {
      hideUpload: false,
      fileList:[],
      dialogImageUrl: '',
      dialogVisible: false,//图片预览弹窗
      formLabelWidth: '80px',
      limitNum: 1,
      dialogVisible2: false, //弹窗
      form: {
        pfpUrl: '',
        userName: '',
        userId: '',
        password: '123',
        sex: '',
        isSupper: '',
        creator: '',
        createTime: '',
        updater: '',
        updateTime: '',
        address: '',
        tel: '',
        email: '',
        dept: '',
        introduction: ''
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs.upload.submit();
      let user = window.sessionStorage.getItem("userId");
      this.form.pfpUrl=sessionStorage.getItem("pfpUrl");
      this.form.creator = user;
      this.form.createTime = new Date().getTime();
      this.form.updater = user;
      this.form.updateTime = new Date().getTime();
      console.log(this.form);
      this.postRequest("/skyline/createUser", this.form).then(resp => {
        if (resp.data.data) {
          this.$message.success("添加用户成功");
        } else {
          this.$message.error("添加用户失败");
        }
      })
    },
    handleSuccess(response, file, fileList) {
      // 这里可以打印出来看看  所需要的值
      console.log(response, file, fileList);
      this.form.phpUrl = response.data.pfpUrl;
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
        sessionStorage.setItem("pfpUrl",resp.data);
      });
    },
    // 文件超出个数限制时的钩子
    handleExceed() {
      this.$message.error("超出文件限制");
    },
    // 文件列表移除文件时的钩子
    handleRemove(file, fileList) {
      this.hideUpload = fileList.length >= this.limitNum;
      this.fileList.remove(file);
    },
    // 点击文件列表中已上传的文件时的钩子
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    imgChange(files, fileList) {
      this.hideUpload = fileList.length >= this.limitNum;
      if (fileList) {
        this.$refs.uploadElement.clearValidate();
      }
    }
  }
}
</script>

<style scoped lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.hide .el-upload--picture-card {
  display: none;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}

.el-form-item__label {
  text-align: justify;
}

.avatar {
  width: 120px;
  height: 120px;
  display: block;
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