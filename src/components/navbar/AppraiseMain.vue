<template>
  <div>
    <div>
  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
    <el-menu-item index="/appraiseMain/showProject" @click="toPage('/appraiseMain/showProject')">卷册查询</el-menu-item>
    <el-submenu index="2" >
    <template slot="title" >评价</template>
    <el-menu-item index="/appraiseMain/appraise" @click="toPage('/appraiseMain/appraise')">个人评价</el-menu-item>
    <el-menu-item index="/appraiseMain/tecAppraise" @click="toPage('/appraiseMain/tecAppraise')">专业评价</el-menu-item>
    </el-submenu>
      <el-menu-item index="/appraiseMain/construction" @click="toPage('/appraiseMain/construction')">项目列表</el-menu-item>
<!--      <el-menu-item v-if="position !== null && position.indexOf(`1`) != -1" index="/appraiseMain/headmanProject" @click="toPage('/appraiseMain/headmanProject')">组长管理</el-menu-item>-->
<!--    <el-menu-item index="/home/main" @click="toPage('/home/main')"-->
<!--                  style="float: right" v-if="pid == 1">系统管理</el-menu-item>-->
    <el-menu-item index="/appraiseMain/selfProject"
                  @click="toPage('/appraiseMain/selfProject')"
    >项目申请</el-menu-item>
    <el-menu-item v-if="volumePlanRole" index="/appraiseMain/volumePlanDate"
                  @click="toPage('/appraiseMain/volumePlanDate')"
    >计划录入</el-menu-item>
    <el-submenu index="3" v-if="managerRole || departmentProgress">
      <template slot="title" >
        部门管理
      </template>
        <el-menu-item v-if="managerRole" index="/appraiseMain/managerWorkday"
                      @click="toPage('/appraiseMain/managerWorkday')"
                      >部门工时</el-menu-item>
        <el-menu-item v-if="departmentProgress" class="nav2" index="/appraiseMain/manageProgress"
                      @click="toPage(toPage('/appraiseMain/manageProgress'))">生产任务
        </el-menu-item>
      <el-menu-item v-if="departmentProgress" class="nav2" index="/appraiseMain/manageProjectRole"
                    @click="toPage(toPage('/appraiseMain/manageProjectRole'))">角色任务
      </el-menu-item>
    </el-submenu>
    <el-menu-item  style="float: right" >
      <el-tooltip style="text-align: center;" effect="dark" content="更新日志" placement="top">
        <i class="el-icon-document" style="margin-right: 10px" @click="getLog"></i>
      </el-tooltip>
      <span style="color: #dd6161">欢迎使用:</span>
      <span style="color: #e6a23c">{{name}}</span>
      <el-dropdown >
          <i class="el-icon-setting"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
          command="1" v-if="showAdmin" @click.native="home">管理员管理</el-dropdown-item>
          <el-dropdown-item
                              command="2" @click.native="self">个人信息页面</el-dropdown-item>
          <el-dropdown-item
            command="4" @click.native="projectListManage()">项目列表管理</el-dropdown-item>
          <el-dropdown-item
            command="3" @click.native="replacePassword">密码修改</el-dropdown-item>
          <el-dropdown-item @click.native="signOut">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-menu-item>
  </el-menu>
    </div>
    <div>
      <router-view/>
    </div>
    <el-dialog
      id="pawDialog"
      title="密码修改"
      :visible.sync="visible"
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :showClose="false"
      >
      <div style="width:100%;text-align:center" @keyup.enter="updPaw">
        <el-row style="margin-bottom: 10px"><span>为开展好网络安全加固工作，请把密码改为强密码</span></el-row>
      <el-form id="paw" :model="paw" :rules="ruleValidate" label-width="100px"  >
        <el-form-item prop="paw1" label="新密码"  style="width: 60%; padding-left: 15%">
          <el-input pro v-model="paw.paw1" type="password"  autocomplete="off"
                    placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item prop="paw2" label="确认密码" style="width: 60%; padding-left: 15%">
          <el-input v-model="paw.paw2"  type="password"  autocomplete="off"
                          placeholder="请再次输入新密码"  ></el-input>
        </el-form-item>
            <el-button type="primary" @click="updPaw " >确定</el-button>
      </el-form>
      </div>
    </el-dialog>
    <el-dialog
      title="系统更新日志"
      v-el-drag-dialog
      :visible.sync="logVisible"
      width="60%"
    >
      <el-table key="list"
               :max-height=height
               border :data="log"
               size="mini"
               :default-sort = "{prop: 'date', order: 'descending'}">
        <el-table-column prop="date" label="更新时间"  width="120px" sortable align="center">
        </el-table-column>
        <el-table-column prop="log" label="更新内容" align="center">
          <template slot-scope="scope">
            <span style="white-space: pre-wrap;">{{scope.row.log}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      v-el-drag-dialog
      title="卷册人员重名确认"
      :visible.sync="sameNameVisible"
      width="80%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-row style="font-size: 14px;color: #dd6161">该列表中卷册表示在系统中存在重名人员参与卷册，请选择实际参与人员</el-row>
      <u-table key="list" use-virtual :row-height="28" :data="list" class="u-table"
               size = "mini" :border="false" :cell-style="this.CellStyleOne"
               height="360px">
        <u-table-column prop="pnumber" min-width="15%" show-overflow-tooltip  label="项目编号" align="center" style="word-break: break-all;">
        </u-table-column>
        <u-table-column prop="pname" min-width="15%" show-overflow-tooltip  label="项目名称" align="center" style="word-break: break-all;">
        </u-table-column>
        <u-table-column prop="number" min-width="15%" show-overflow-tooltip  label="任务编号" align="center" style="word-break: break-all;">
        </u-table-column>
        <u-table-column prop="name" min-width="15%" show-overflow-tooltip  label="任务名称" align="center" style="word-break: break-all;">
        </u-table-column>
        <u-table-column prop="designer" min-width="15%" show-overflow-tooltip  label="设计" align="center" style="word-break: break-all;">
          <template slot-scope="scope" >
            <el-select v-model="scope.row.designerId" placeholder="请选择" style="width: 100px"
                        size="mini" @focus="getUser(scope.row,'designer')"  :loading="loading"
                       @change="sameNameInsert(scope.row)" v-if="scope.row.sameDesigner === 1">
              <el-option
                v-for="item in scope.row.designerList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.username }}</span>
              </el-option>
            </el-select>
            <span v-else>{{scope.row.designer}}</span>
          </template>
        </u-table-column>
        <u-table-column prop="checker" min-width="15%" show-overflow-tooltip  label="校核" align="center" style="word-break: break-all;">
          <template slot-scope="scope">
            <el-select v-model="scope.row.checkerId" placeholder="请选择" style="width: 100px"
                        size="mini" @change="sameNameInsert(scope.row)"  v-if="scope.row.sameChecker=== 1"
                       @focus="getUser(scope.row,'checker')"  :loading="loading">
              <el-option
                v-for="item in scope.row.checkerList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.username }}</span>
              </el-option>
            </el-select>
            <span v-else>{{scope.row.checker}}</span>
          </template>
        </u-table-column>
        <u-table-column prop="principal" min-width="15%" show-overflow-tooltip  label="主设" align="center" style="word-break: break-all;">
          <template slot-scope="scope" >
            <el-select v-model="scope.row.principalId" placeholder="请选择" style="width: 100px"
                       size="mini" @change="sameNameInsert(scope.row)" v-if="scope.row.samePrincipal === 1"
                       @focus="getUser(scope.row,'principal')"  :loading="loading">
              <el-option
                v-for="item in scope.row.principalList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.username }}</span>
              </el-option>
            </el-select>
            <span v-else>{{scope.row.principal}}</span>
          </template>
        </u-table-column>
        <u-table-column prop="headman" min-width="15%" show-overflow-tooltip  label="组长" align="center" style="word-break: break-all;">
          <template slot-scope="scope" >
            <el-select v-model="scope.row.headmanId" placeholder="请选择" style="width: 100px"
                       size="mini" @change="sameNameInsert(scope.row)" v-if="scope.row.sameHeadman === 1"
                       @focus="getUser(scope.row,'headman')"  :loading="loading">
              <el-option
                v-for="item in scope.row.headmanList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.username }}</span>
              </el-option>
            </el-select>
            <span v-else>{{scope.row.headman}}</span>
          </template>
        </u-table-column>
      </u-table>
    </el-dialog>
    <el-drawer
      title="管理项目列表"
      size ="40%"
      :visible.sync="drawer"
      >
      <u-table use-virtual :row-height="28" border :data="projectList"
               :height = "height"
               :default-sort = "{prop: 'date', order: 'descending'}"
               v-loading="loading" size = "mini">
        <u-table-column prop="number" min-width="13%" label="项目编号" sortable align="center"  >
        </u-table-column>
        <u-table-column prop="name" min-width="20" label="项目名称" sortable align="center" style="word-break: break-all;">
        </u-table-column>
        <u-table-column prop="name" label="状态" min-width="6%" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.show"
              active-value = "1"
              inactive-value = "0"
              @change="setShow(scope.row)"
              active-color="#13ce66"
              inactive-color="#ff4949">
            </el-switch>
          </template>
        </u-table-column>
      </u-table>
    </el-drawer>
      <news class="news"/>
    <el-dialog
      title="近10日计划完成卷册"
      v-el-drag-dialog
      :visible.sync="recentlyVisible"
      width="80%">
      <u-table use-virtual :row-height="28" border size="mini" :data="listData"
               class="u-table"
               :height="height"
               showBodyOverflow="title"
               showHeaderOverflow="title"
               :data-changes-scroll-top="false"
               :header-cell-style="{background:'#F5F5F5'}" :cell-style="this.CellStyleOne">
        <u-table-column
          type="index"
          align="center"
          width="50">
        </u-table-column>
        <u-table-column prop="pNumber" sortable min-width="100px" show-overflow-tooltip label="项目编号" align="center"  >
        </u-table-column>
        <u-table-column prop="pName" min-width="180px"
                        :filters="filtersList"
                        :filter-method="filterHandler"
                        show-overflow-tooltip label="项目名" align="center">
        </u-table-column>
        <u-table-column prop="number" sortable min-width="100px" show-overflow-tooltip label="卷册号" align="center"  >
        </u-table-column>
        <u-table-column prop="name" sortable min-width="180px" show-overflow-tooltip label="卷册名" align="center">
        </u-table-column>
        <u-table-column prop="state" sortable min-width="180px" show-overflow-tooltip label="卷册状态" align="center">
        </u-table-column>
        <u-table-column prop="start_date" sortable width="100px" label="开始时间"  align="center">
        </u-table-column>
        <u-table-column prop="planned_publication_date" sortable width="100px" label="计划出版时间"  align="center">
        </u-table-column>
        <u-table-column prop="principal" sortable width="100px" label="主设"  align="center">
        </u-table-column>
        <u-table-column prop="headman" sortable width="100px" label="组长"  align="center">
        </u-table-column>
        <u-table-column prop="designer" sortable width="100px" label="设计"  align="center">
        </u-table-column>
        <u-table-column prop="checker" sortable width="100px" label="校核"  align="center">
        </u-table-column>
      </u-table>
    </el-dialog>
  </div>
</template>

<script>

import storage from "../../store";
import {resetRouter} from "../../router/index"

const testPassword =
  /((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))(?!^.*[\u4E00-\u9FA5].*$)^\S{8,16}$/
// const testPassword =/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)(?=.*?[<>!#@*&$%^()/~`\\=_\?+-.])[a-zA-Z\d<>!#@*&$%^()\?/~`\\=_+-.]*$/;
export default {
  name: "AppraiseMain",
  data() {
    const pawRule1 = async(rule, value, callback) => {
      if (value.length < 8) {
        this.paw1Check = 1
        return callback(new Error('密码不能少于8位！'));
      } else if (value.length > 16) {
        this.paw1Check = 1
        return callback(new Error('密码最长不能超过16位！'));
      } else if (!testPassword.test(value)){
        this.paw1Check = 1
        return callback(new Error('请包含大小写，数字和特殊字符组合'));
      } else {
        this.paw1Check = 0
        callback()
      }
    }
    const pawRule2 = async(rule, value, callback) => {
      if (value.length < 1) {
        this.paw2Check = 1
        return callback(new Error('重复密码不能为空！'));
      } else if(this.paw.paw1 !== this.paw.paw2){
        this.paw2Check = 1
        return callback(new Error('两次输入密码不一致！'));
      }else{
        this.paw2Check = 0
        callback()
      }
    };
    return {
      height : document.body.scrollHeight,
      logIn : false,
      activeIndex: '1',
      visible : false ,
      loading : true,
      id : "",
      name : "",
      pid : "",
      showAdmin : 0,
      position : "",
      grade : "",
      paw : {
        paw1 :"",
        paw2 :""
      },
      log : [],
      logVisible : false,
      list : [],
      listData: [],
      filtersList : [],
      recentlyVisible : false,
      drawer: false,
      projectList : [],
      sameNameVisible : false,
      managerRole : false,
      departmentProgress : false,
      volumePlanRole : false,
      paw1Check : 0,
      paw2Check : 1,
      ruleValidate: {
        paw1: [
          { required: true, validator: pawRule1, trigger: 'change' }
        ],
        paw2: [
          { required: true, validator: pawRule2, trigger: 'change' }
        ]
      }
    };
  },
  mounted() {
    let menus = storage.get("menus")
    this.managerRole = menus.find(item =>{
      return item.router === "managerWorkday"
    });
    this.departmentProgress = menus.find(item =>{
      return item.router === "manageProgress"
    });
    this.volumePlanRole = menus.find(item =>{
      return item.router === "volumePlanDate"
    });
    this.showAdmin = menus.length > 0 && menus.find(item =>{
      return item.router === "workday"
    });
    this.getLogIn()
    this.getData()
    this.getRecently10Day()
    setInterval(()=>{
      if (new Date().getHours() === 12){
        this.getRecently10Day()
      }
    },3600000)
    this.activeIndex = this.$route.path
  },
  methods: {
    getLogIn() {
      this.$axios
        .post(this.$baseUrl + 'user/queryById'
        )
        .then(res => {
          this.name = res.data.data.name;
          this.pid = res.data.data.pid
          if (res.data.data.pawState === 0) {
            this.visible = true;
          }
        })
        .catch(res => (console.log(res)));
    },
    getData() {
      this.$axios
        .post(this.$baseUrl + 'project/sameName')
        .then(res => {
          if (res.data.data.length > 0) {
            this.list = res.data.data
            this.sameNameVisible = true;
          }
        })
        .catch(res => (console.log(res)));
    },
    getRecently10Day(){
      this.$axios
        .post(this.$baseUrl + 'volume/queryRecently10Day')
        .then(res => {
          if (res.data.data.length > 0) {
            this.listData = res.data.data
            this.recentlyVisible = true;
          }
        })
        .catch(res => (console.log(res)));
    },
    getLog(){
      this.$axios
        .post(this.$baseUrl + 'systemLog',)
        .then(res => {
          this.log = res.data.data
          this.logVisible = true
        },);
    },
    getUser(row, t) {
      console.log(t+"List")
      setTimeout(() => {
        this.loading = true;
        this.$axios
          .post(this.$baseUrl + 'user/queryByName', {
              "name": row[t]
            }
          )
          .then(res => {
              row[t+'List'] = res.data.data
              this.$forceUpdate()
              this.loading = false;
          },);
      }, 100);
    },
    sameNameInsert(row){
      this.$axios
        .post(this.$baseUrl + 'project/sameNameInsert', {
          id : row.id,
          designerId : row.designerId,
          checkerId : row.checkerId,
          principalId : row.principalId,
          headmanId : row.headmanId
        })
        .then(res => {
          if (res.data.code === 0) {
            this.$message.success("操作成功")
          }
        })
        .catch(res => (console.log(res)));
    },
    home(){
      this.$router.push('/home')
    },
    projectListManage(){
      this.drawer = true
      this.loading = true;
      this.$axios
        .post(this.$baseUrl + 'project/PersonalProject')
        .then(res => {
            this.projectList = res.data.data
            this.loading = false;
        })
        .catch(res => (console.log(res)));
    },
    setShow(row){
      this.$axios
        .post(this.$baseUrl + 'project/setShowProject',{
          id : row.id,
          show : row.show
        })
        .then(res => {
          if (res.data.code === 0){
            this.$message.success("操作成功")
          }
        })
        .catch(res => (console.log(res)));
    },
    self(){
      this.activeIndex = "";
      this.$router.replace('/appraiseMain/self')
    },
    replacePassword(){
      this.visible = true
    },
    signOut(){
      resetRouter();
      this.$storage.removeAll();
      this.$router.push('/login')
    },
    toPage(path) {
      this.$router.replace(path);
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    updPaw() {
      if (this.paw1Check === 0 && this.paw2Check === 0) {
        this.$axios
          .post(this.$baseUrl + "user/paw", {
            "id": this.id,
            "paw": this.paw.paw2
          })
          .then(res => {
            if (res.data.code === 0) {
              this.$message("密码修改成功，请重新登录");
              setTimeout(function () {
                window.location.href = "http://10.136.238.22:8080/#/login"
              }, 500)

            }
          })
          .catch(res => console.log(res))

      } else {
        this.$message.error("密码输入有误")
        return 0;
      }
    },
  }
}

</script>

<style scoped>
.el-menu-demo{
  text-align: center;
}
</style>
