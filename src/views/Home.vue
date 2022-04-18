<template>
  <div>
    <el-container class="content">
      <el-aside style="width: 200px;height: 780px">
        <div class="welcome"><i class="el-icon-monitor"></i> 轮廓算法演示系统</div>
        <el-menu :default-openeds="['1','2']" background-color="#1c213f" text-color="#fff">
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-menu"></i>用户管理</template>
            <el-menu-item-group>
              <el-menu-item index="1-1" class="el-icon-user" @click="getUserInfo"> 个人信息</el-menu-item>
              <el-menu-item index="1-2" class="el-icon-crop" @click="userPassword"> 修改密码</el-menu-item>
              <el-menu-item index="1-3" class="el-icon-setting" v-if="this.symbol" @click="userCreate"> 编辑用户</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-s-operation"></i>算法展示</template>
            <el-menu-item-group>
              <el-menu-item index="2-1" class="el-icon-s-opportunity" @click="algorithmInfo"> 查看论文</el-menu-item>
              <el-menu-item index="2-2" class="el-icon-s-data" v-if="this.symbol" @click="datasetInfo"> 编辑数据</el-menu-item>
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
                      {{ item.name }}
                    </el-breadcrumb-item>
                  </el-breadcrumb>
                </div>
              </el-breadcrumb>
            </el-col>

            <el-col :span="6">
              <img src="https://www.ncut.edu.cn/images/logo2.png"
                   height="50px" width="200px" alt="图片消失了">
            </el-col>
            <el-col :span="1">
              <el-avatar style="margin-top: 18px;margin-right: -300px" shape="square" :size="25"
                         :src=userInfo.pfpUrl></el-avatar>
            </el-col>
            <el-col :span="2">
              <div></div>
              <div class="name">欢迎您,{{ this.name }} {{ this.userName }}
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
      symbol: false,
      name: '',
      fit: 'fill',
      userInfo: [],
      url: require("/public/Image/NCUT/logo.png"),
      logForm: {
        id: '',
        userInfo: '',
        updatePwd: '',
        editUser: '',
        readPaper: '',
        editData: '',
        algoRuntime: '',
        algoOffline: ''
      }
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    //this.isSupper = window.sessionStorage.getItem("isSupper");
    this.isSupper = this.$cookies.get("isSupper");

    if ("true" === this.isSupper) {
      this.symbol = true;
      this.name = "管理员";
    } else {
      this.name = "用户";
    }
    console.log(this.name);
    this.getUserName();
    this.getBreadcrumb();
  },
  methods: {
    clearSymbol() {
      this.logForm.algoRuntime = '';
      this.logForm.editUser = '';
      this.logForm.updatePwd = '';
      this.logForm.algoOffline = '';
      this.logForm.userInfo = '';
      this.logForm.editData = '';
      this.logForm.readPaper = '';
    },
    getBreadcrumb() {
      //$route.matched一个数组 包含当前路由的所有嵌套路径片段的路由记录
      this.levelList = this.$route.matched.filter(item => item.name)
    },
    getUserName() {
      //let userId = window.sessionStorage.getItem("userId");
      let userId = this.$cookies.get("userId");
      this.getRequest('/skyline/userInfo', {"userId": userId}).then(resp => {
        if (resp.data.data) {
          this.userInfo = resp.data.data;
          this.userName = resp.data.data.userName;
        }
      })
    },
    algorithmRun() {
      //标志位，任意给一个数
      this.clearSymbol();
      this.logForm.algoRuntime = "0";
      //日志id
      //this.logForm.id=window.sessionStorage.getItem("id");
      this.logForm.id = this.$cookies.get("id");
      this.postRequest("/skyline/updateLog", this.logForm);
      this.$router.push({name: "实时运行"});
    },
    algorithmInfo() {
      //标志位，任意给一个数
      this.clearSymbol();
      this.logForm.readPaper = "0";
      //日志id
      //this.logForm.id=window.sessionStorage.getItem("id");
      this.logForm.id = this.$cookies.get("id");
      this.postRequest("/skyline/updateLog", this.logForm);
      this.$router.push({name: "查看论文"});
    },
    algorithmOffline() {
      //标志位，任意给一个数
      this.clearSymbol();
      this.logForm.algoOffline = "0";
      //日志id
      //this.logForm.id=window.sessionStorage.getItem("id");
      this.logForm.id = this.$cookies.get("id");
      this.postRequest("/skyline/updateLog", this.logForm);
      this.$router.push({name: "离线运行"});
    },
    datasetInfo() {
      //标志位，任意给一个数
      this.clearSymbol();
      this.logForm.editData = "0";
      //日志id
      //this.logForm.id=window.sessionStorage.getItem("id");
      this.logForm.id = this.$cookies.get("id");
      this.postRequest("/skyline/updateLog", this.logForm);
      this.$router.push({name: "编辑数据"});
    },
    getUserInfo() {
      //标志位，任意给一个数
      this.clearSymbol();
      this.logForm.userInfo = "0";
      //日志id
      //this.logForm.id=window.sessionStorage.getItem("id");
      this.logForm.id = this.$cookies.get("id");
      this.postRequest("/skyline/updateLog", this.logForm);
      this.$router.push({name: "个人信息"});
    },
    userPassword() {
      //标志位，任意给一个数
      this.clearSymbol();
      this.logForm.updatePwd = "0";
      //日志id
      //this.logForm.id=window.sessionStorage.getItem("id");
      this.logForm.id = this.$cookies.get("id");
      this.postRequest("/skyline/updateLog", this.logForm);
      this.$router.push({name: "修改密码"});
    },
    userUpdate() {
      this.$router.push({name: "UserUpdate"});
    },
    userCreate() {
      //标志位，任意给一个数
      this.clearSymbol();
      this.logForm.editUser = "0";
      //日志id
      //this.logForm.id=window.sessionStorage.getItem("id");
      this.logForm.id = this.$cookies.get("id");
      this.postRequest("/skyline/updateLog", this.logForm);
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

.name {
  margin-right: -350px;
  font-size: 15px;
}
</style>
