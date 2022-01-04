<template>
  <div>
    <el-container class="content">
      <el-aside>
        <el-menu :default-openeds="['1','2']">
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-message"></i>个人信息管理</template>
            <el-menu-item-group>
              <el-menu-item index="1-1" @click="userInfo">个人信息</el-menu-item>
              <el-menu-item index="1-2" @click="userPassword">修改密码</el-menu-item>
              <el-menu-item index="1-3" @click="goLogin">退出登陆</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-message"></i>算法展示</template>
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
          <el-dropdown>
            <i class="el-icon-setting" style="margin-right: 15px"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>用户中心</el-dropdown-item>
              <el-dropdown-item>退出登陆</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <span>{{ $route.params.name }}</span>
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
  methods: {
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
      this.$router.push({name: "Login"});
    }

  }
}
</script>

<style lang="scss">
.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}

.el-aside {
  color: #333;
  width: 200px;
}
.content {
  height: calc(100vh - 90px);
}
</style>
