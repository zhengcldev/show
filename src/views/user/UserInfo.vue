<template>
  <el-descriptions title="用户信息" :column="2" border>
    <el-descriptions-item label="头像"><el-avatar :size="60" :src=userInfo.pfpUrl></el-avatar></el-descriptions-item>
    <el-descriptions-item label="用户名">{{userInfo.userName}}</el-descriptions-item>
    <el-descriptions-item label="用户id">{{userInfo.userId}}</el-descriptions-item>
    <el-descriptions-item label="性别">{{userInfo.sex}}</el-descriptions-item>
    <el-descriptions-item label="联系地址">{{userInfo.address}}</el-descriptions-item>
    <el-descriptions-item label="电话">{{userInfo.tel}}</el-descriptions-item>
    <el-descriptions-item label="邮箱">{{userInfo.email}}</el-descriptions-item>
    <el-descriptions-item label="所属机构">{{userInfo.dept}}</el-descriptions-item>
    <el-descriptions-item label="个人简介" label-class-name="my-label">{{userInfo.introduction}}</el-descriptions-item>
  </el-descriptions>
</template>

<script>
export default {
  name: 'UserInfo',
  data() {
    return {
      userInfo:[],
    }
  },
  created() {
    this.getUserInfo()
  },
  methods:{
    getUserInfo(){
      this.getRequest("/skyline/userInfo",{"userId":window.sessionStorage.getItem("userId")}).then(resp=>{
        if(resp.data.data){
          this.userInfo=resp.data.data;
        }
      })
    }
  }
}
</script>

<style lang="scss">
.my-label {
  height: 200px;
}
</style>
