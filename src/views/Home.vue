<template>
  <div>
    <el-container class="content">
      <el-aside style="width: 200px;height: 780px">
        <div class="welcome"><i class="el-icon-monitor"></i> 轮廓算法演示系统</div>
        <el-menu :default-openeds="['1','2']" background-color="#1c213f" text-color="#fff">
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-menu"></i>用户管理</template>
            <el-menu-item-group>
              <el-menu-item index="1-1" class="el-icon-user" @click="userInfo"> 个人信息</el-menu-item>
              <el-menu-item index="1-2" class="el-icon-crop" @click="userPassword"> 修改密码</el-menu-item>
              <el-menu-item index="1-3" class="el-icon-setting" v-if="isSupper" @click="userCreate"> 编辑用户</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-s-operation"></i>算法展示</template>
            <el-menu-item-group>
              <el-menu-item index="2-1" class="el-icon-s-opportunity" @click="algorithmInfo"> 查看论文</el-menu-item>
              <el-menu-item index="2-2" class="el-icon-s-data" v-if="isSupper" @click="datasetInfo"> 编辑数据</el-menu-item>
              <el-menu-item index="2-3" class="el-icon-data-analysis" @click="algorithmRun"> 实时运行</el-menu-item>
              <el-menu-item index="2-4" class="el-icon-data-board" @click="algorithmOffline"> 离线运行</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <el-header style="text-align: right; font-size: 12px;">
          <el-row>


            <el-col :span="8">
              <el-breadcrumb separator="/">
                <div class="bread">
                  <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item v-for="item in levelList" :key="item.path">
                      {{item.name}}
                    </el-breadcrumb-item>
                  </el-breadcrumb>
                </div>
              </el-breadcrumb>
            </el-col>

            <el-col :span="8">

            </el-col>

            <el-col :span="8">
              <div class="name">欢迎您,{{ this.userName }}
                <el-dropdown>
                  <i class="el-icon-setting"></i>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="userInfo">用户中心</el-dropdown-item>
                    <el-dropdown-item @click.native="goLogin">退出登陆</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </el-col>
          </el-row>
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
  data() {
    return {
      userName: '',
      isSupper: '',
      levelList: null,
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    this.isSupper = window.sessionStorage.getItem("isSupper");
    this.getUserName();
    this.getBreadcrumb();
  },
  methods: {
    getBreadcrumb() {
      //$route.matched一个数组 包含当前路由的所有嵌套路径片段的路由记录
      let matched = this.$route.matched.filter(item => item.name)
      this.levelList = matched
    },
    getUserName() {
      let userId = window.sessionStorage.getItem("userId");
      this.getRequest('/skyline/userInfo', {"userId": userId}).then(resp => {
        if (resp.data.data) {
          this.userName = resp.data.data.userName;
        }
      })
    },
    algorithmRun() {
      this.$router.push({name: "实时运行"});
    },
    algorithmInfo() {
      this.$router.push({name: "查看论文"});
    },
    algorithmOffline() {
      this.$router.push({name: "离线运行"});
    },
    datasetInfo() {
      this.$router.push({name: "编辑数据"});
    },
    userInfo() {
      this.$router.push({name: "个人信息"});
    },
    userPassword() {
      this.$router.push({name: "修改密码"});
    },
    userUpdate() {
      this.$router.push({name: "UserUpdate"});
    },
    userCreate() {
      this.$router.push({name: "编辑用户"});
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

.bread {
  margin-top: 20px;
  font-size: 15px;
  font-weight: bold;
}
.name{
  margin-right: -350px;
  font-size: 15px;
}
</style>
