<template>
  <div id="main" style="height: 100vh">
    <el-container style="height: 100%">
      <!-- 左 -->
      <el-aside width="20%" heigth="100%" >
        <!-- logo名字 -->
        <el-row @click.native="back()" style="padding: 10px 0 0 20px ; text-align: center">
          <el-col :span="24">
            <el-row style="margin-top: 35px;text-align: center;color: #000000;font-size: 16px;font-weight: bold;">发电工程公司综合管理
            </el-row>
          </el-col>
        </el-row>
        <!-- 导航 -->
        <el-row style="margin-top: 10px; ">
          <el-menu  default-active="1" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" >
            <el-menu-item index="home/workday" @click="toPage('/home/workday')">
              工时信息
            </el-menu-item>
            <el-menu-item index="home/revenueList" @click="toPage('/home/revenueList')">
              营收信息
            </el-menu-item>
            <el-menu-item index="/home/adminProject" @click="toPage('/home/adminProject')">项目管理
            </el-menu-item>
            <el-menu-item index="/home/adminScientific" @click="toPage('/home/adminScientific')">科技项目
            </el-menu-item>
            <el-menu-item index="/home/projectRole"
                          @click="toPage(toPage('/home/projectRole'))">角色任务
            </el-menu-item>
            <el-submenu index="2">
              <template slot="title">
                <el-row >生产任务</el-row>
              </template>
            <el-menu-item-group>
              <el-menu-item class="nav2" index="/home/projectProgress"
                            @click="toPage('/home/projectProgress')">项目列表
              </el-menu-item>
              <el-menu-item class="nav2" index="/home/tecProgress"
                            @click="toPage('/home/tecProgress')">专业列表
              </el-menu-item>
            </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <el-row >个人评价</el-row>
              </template>
              <el-menu-item-group>
                <el-menu-item class="nav2" index="2-1" @click="toPage('/home/perScore')">整体数据
                </el-menu-item>
                <el-menu-item class="nav2" index="2-2" @click="toPage('/home/perDetails')">数据详情
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="4">
              <template slot="title">
                <el-row >专业评价</el-row>
              </template>
              <el-menu-item-group>
                <el-menu-item class="nav2" index="3-1" @click="toPage('/home/tecScore')">整体数据
                </el-menu-item>
                <el-menu-item class="nav2" index="3-2" @click="toPage('/home/tecDetails')">数据详情
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>

            <el-submenu index="5">
              <template slot="title">
                <el-row >系统管理</el-row>
              </template>
              <el-menu-item-group>
                <el-menu-item class="nav2" index="4-1" @click="toPage('/home/personal')">人员管理
                </el-menu-item>
                <el-menu-item class="nav2" index="4-2" @click="toPage('/home/department')">部门管理
                </el-menu-item>
                <el-menu-item class="nav2" index="4-3" @click="toPage('/home/appraiseManage')">评价管理
                </el-menu-item>
                <el-menu-item class="nav2" index="4-4" @click="toPage('/home/roleManage')">权限管理
                </el-menu-item>
                <el-menu-item class="nav2" index="4-5" @click="toPage('/home/checkerManage')">审核管理
                </el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-row>
      </el-aside>
      <!-- 顶 -->
      <el-container>
        <el-header height="40px" >
          <el-row style="margin: 15px 0; font-size:15px;color: #999;">
            <el-dropdown trigger="click" style = "float: right;width:100px;margin-right: 6%">
              <el-row >
                <span style="font-family:'FontAwesome',serif;"></span>
                <span style="font-family:'微软雅黑',serif;font-size:15px;color: #000000"> {{name}} </span>
                <span style="font-family:'FontAwesome',serif;font-size:12px;"></span>
              </el-row>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native=logOut()>退出登录</el-dropdown-item>
                <el-dropdown-item @click.native=logApp()>返回个人信息</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-row>
        </el-header>
        <!-- 主 -->
        <el-main style="padding: 0; height: 100%;">
          <router-view v-if ="isRouterAlive" />
        </el-main>
      </el-container>
    </el-container>
      <news class="news"/>
  </div>
</template>

<script>
import {resetRouter} from "../../router";

export default {
name: "Home",
  provide () {    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      logIn: true,
      checkInPage: false,
      id: "",
      pid : "",
      name: "",
      level: "",
      isRouterAlive: true,
      list: [],
    }
  },
  mounted() {
    this.getLogIn();
  },
  methods: {handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    getLogIn() {
      this.$axios
        .post(this.$baseUrl + 'user/queryById'
        )
        .then(res => {
          this.name = res.data.data.name;
          this.pid = res.data.data.pid
          })
        .catch(res => (console.log(res)));
    },
    logOut() {
      resetRouter();
      this.$storage.removeAll();
      this.$router.push('/login')
    },
    logApp() {
      this.$router.replace("/");
      this.getLogIn();
    },
    back() {
      this.$router.push('/home/main');
    },
    toPage(path){
      this.$router.replace(path);
    },
    reload () {
      this.isRouterAlive = false;            //先关闭，
      this.$nextTick(function () {
        this.isRouterAlive = true;         //再打开
      })
    },
  }
}
</script>

<style scoped>


.nav2 {
  margin-left: 36px;
  /*padding-left: 30px;*/
}
</style>
