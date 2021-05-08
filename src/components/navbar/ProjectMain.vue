<template>
<div>
  <div style="width: 75%;margin-top: 10px;">
  <el-row style="font-size: x-large;font-family: 'Helvetica Neue';margin-top: 25px;margin-left: 25%"
          align="center">{{this.project.name}}</el-row>
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
      <el-menu-item index="/projectMain/project"
                    @click="toPage('/projectMain/project')">项目详情</el-menu-item>
      <el-menu-item index="/projectMain/projectVolume"
                    @click="toPage('/projectMain/projectVolume')">卷册列表</el-menu-item>
      <el-submenu index="2">
        <template slot="title">项目工时管理</template>
        <el-menu-item index="/projectMain/workDayManage"
                      @click="toPage('/projectMain/workDayManage')">项目及设计工时管理</el-menu-item>
        <el-menu-item index="/projectMain/reserveWorkDay"
                      @click="toPage('/projectMain/reserveWorkDay')">主设人及备用工时管理</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
  <div style="position:absolute;right: 0;top:15px;width: 25%;">
  <el-card shadow="always" >
    <el-row style="margin-top: -5px">
      <el-col :span="8" style="text-align: center">
        项目编号
      </el-col>
      <el-col :span="16" style="text-align: center">
        {{project.number}}
      </el-col>
    </el-row>
    <el-row >
      <el-col :span="8" style="text-align: center">
        设总
      </el-col>
      <el-col :span="16" style="text-align: center">
        {{project.general}}
      </el-col>
    </el-row>
    <el-row style="margin-bottom: -5px">
      <el-col :span="8" style="text-align: center">
        卷册数
      </el-col>
      <el-col :span="16" style="text-align: center">
        {{project.count}}
      </el-col>
    </el-row>
  </el-card>
  </div>
  <div>
    <router-view/>
  </div>

</div>
</template>

<script>
export default {
name: "ProjectMain",
  data(){
  return{
    id: "",
    pid: "",
    tid : "",
    projectId : "",
    activeIndex : "/projectMain/project",
    project : {},
    }
  },
  mounted() {
  this.getLogIn()
  },
  methods:{
    getLogIn() {
      let i = JSON.parse(sessionStorage.getItem("appraise"));
      if (i == null) {
        this.$message.error("请登录！");
        setTimeout(function () { window.location.href = "/" }, 1000)
      } else
      {
        this.logIn = true;
        this.id = i.id;
        this.name = i.name;
        this.pid = i.pid;
      }
      this.getParams();
    },
    getParams() {
      // 取到路由带过来的参数
      this.projectId = this.$route.query.project_id;
      this.$axios.post(this.$baseUrl + "project/queryById",
        {},{headers: {id : this.projectId}})
        .then(res => {this.project = res.data.data;})
        .catch(res => console.log(res.data))
    },

    toPage(path) {
      this.$router.replace(
        {
          path:path,
          query:{
            "project_id" : this.projectId
          }
        }
      );
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>

<style scoped>

</style>
