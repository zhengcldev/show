<template>
  <div>
    <el-container class="content">
      <el-aside style="width: 200px">
        <div class="welcome"><i class="el-icon-monitor"></i> 轮廓算法演示系统</div>
        <el-menu :default-openeds="['1','2']" background-color="#1c213f" text-color="#fff">
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-user"></i>个人信息管理</template>
            <el-menu-item-group>
              <el-menu-item index="1-1" @click="userInfo">个人信息</el-menu-item>
              <el-menu-item index="1-2" @click="userPassword">修改密码</el-menu-item>
              <el-menu-item index="1-3" @click="">完善信息</el-menu-item>
              <el-menu-item index="1-4" v-if="isSupper" @click="">创建用户</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-s-operation"></i>算法展示</template>
            <el-menu-item-group>
              <el-menu-item index="2-1" @click="algorithmInfo">算法介绍</el-menu-item>
              <el-menu-item index="2-2" @click="datasetInfo">数据集介绍</el-menu-item>
              <el-menu-item index="2-3" @click="algorithmRun">运行算法</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header style="text-align: right; font-size: 12px">
          <div style="margin-right: 15px">欢迎您,{{this.userName}}
          <el-dropdown>
            <i class="el-icon-setting"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="userInfo">用户中心</el-dropdown-item>
              <el-dropdown-item @click.native="goLogin">退出登陆</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          </div>
        </el-header>

        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data(){
    return{
      userName:'',
      isSupper:'',
    }
  },
  created() {
    this.isSupper=window.sessionStorage.getItem("isSupper");
    this.getUserName();
  },
  methods: {
    getUserName(){
      let userId=window.sessionStorage.getItem("userId");
      this.getRequest('/skyline/userInfo',{"userId":userId}).then(resp=>{
        if(resp.data.data){
          this.userName=resp.data.data.userName;
        }
      })
    },
    algorithmRun() {
      this.$router.push({name: "AlgorithmRun"});
    },
    algorithmInfo() {
      this.$router.push({name: "AlgorithmInfo"});
    },
    datasetInfo() {
      this.$router.push({name: "DatasetInfo"});
    },
    userInfo() {
      this.$router.push({name: "UserInfo"});
    },
    userPassword() {
      this.$router.push({name: "UserPassword"});
    },
    goLogin() {
      this.$router.replace('/login');
    }

  }
}
</script>

<style lang="scss">
.el-header {
  background-color: #DCDFE6;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
  background-color: #1c213f;
  width: 200px;
}
.content {
  height: calc(100vh - 90px);
}
.welcome {
  font-size: 15px;
  color: #fff;
  text-align: center;
  height: 60px;
  line-height: 60px;
  font-weight: bold;
}
</style>
