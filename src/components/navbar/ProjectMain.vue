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

      <el-submenu index="/workday/" v-if="show">
        <template slot="title">工时分配</template>
        <el-menu-item index="/projectMain/projectWorkday"
                      @click="toPage('/projectMain/projectWorkday')">项目工时分配</el-menu-item>
        <el-menu-item index="/projectMain/majorWorkday"
                      @click="toPage('/projectMain/majorWorkday')">专业工时分配</el-menu-item>
        <el-menu-item index="/projectMain/backupWorkday"
                      @click="toPage('/projectMain/backupWorkday')">备用工时分配</el-menu-item>
      </el-submenu>
      <el-submenu index="/log/" v-if="show">
      <template slot="title">工时日志</template>
      <el-menu-item index="/projectMain/WorkdayLog"
                    @click="toPage('/projectMain/WorkdayLog')">专业工时日志</el-menu-item>
      <el-menu-item index="/projectMain/BackupLog"
                    @click="toPage('/projectMain/BackupLog')">备用工时日志</el-menu-item>
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

const roleList = [ "1","2" ,"3"]

export default {
name: "ProjectMain",
  data(){
  return{
    name: "",
    pid: "",
    state : "",
    projectId : "",
    activeIndex : "/projectMain/project",
    project : {},
    show : false,
    }
  },
  mounted() {
    this.getParams();
    this.getLogIn();
    this.activeIndex = this.$route.path
  },
  methods:{
    getLogIn() {
      this.$axios
        .post(this.$baseUrl + 'user/queryById'
        )
        .then(res => {this.name = res.data.data.name;
          this.pid = res.data.data.pid
          this.state = res.data.data.state})
        .catch(res => (console.log(res)));
    },
    getParams() {
      // 取到路由带过来的参数
      this.projectId = this.$route.query.project_id;
      this.$axios.post(this.$baseUrl + "project/queryById",
        {},{headers: {id : this.projectId}})
        .then(res => {this.project = res.data.data;
        this.show = res.data.data.show
          this.$nextTick(() =>{
            console.log(this.project)
            document.title = this.project.name
          },10)})
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
