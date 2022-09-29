<template>
<div>
  <ux-grid ref="uxGrid" key="projectList" use-virtual border :data="projectList" class="ux-table"
                @expand-change="toggleExpandChangeEvent"           @row-click="clickRowHandle"
              size = "mini" :header-cell-style="{color:'#000000'}">
      <ux-table-column type="expand" width="50" align="center">
        <template v-slot:content="{ row, rowIndex }">
          <template>
          </template>
        </template>
      </ux-table-column>
      <ux-table-column field="number" sortable  min-width="10%" title="项目编号" align="center"  >
      </ux-table-column>
      <ux-table-column field="name" sortable min-width="26%" title="项目名称" align="center">
        <template slot-scope="scope" >
          <el-button type="text" @click="getChildren(scope.row)"
                     v-if="scope.row.type === 2" size="mini">{{scope.row.name}}</el-button>
          <span v-else>{{scope.row.name}}</span>
        </template>
      </ux-table-column>
      <ux-table-column field="director" sortable width="80" title="主管总工" align="center"  >
      </ux-table-column>
      <ux-table-column field="general" sortable width="80" title="设总" align="center" style="word-break: break-all;">
      </ux-table-column>
      <ux-table-column field="create_time" sortable width="120" title="开始时间" align="center">
      </ux-table-column>
      <ux-table-column field="amount"  width="100" title="申报任务数"  align="center">
        <template slot-scope="scope" v-if="scope.row.principal === 1">
          <el-button size="mini" style="width: 60px" type="primary"
                     @click="openDeclareLog(scope.row.id)">{{scope.row.amount}}</el-button>
        </template>
      </ux-table-column>
      <ux-table-column  width="120px" align="center">
        <template slot-scope="scope">
          <el-row>
              <el-button
                size="mini"
                v-if="scope.row.show === 1 ||scope.row.principal === 1"
                @click="openProject(scope.row)">项目主页</el-button>
          </el-row>
        </template>
      </ux-table-column>
    </ux-grid>
  <el-dialog
    v-el-drag-dialog
    :visible.sync="declareLogVisible"
    :close-on-click-modal="false"
    width="80%" style="text-align: center">
    <el-row align="center" style="margin-bottom: 15px;margin-top: -30px">
      <el-date-picker
        v-model="showMonth"
        field="month"
        style="width: 160px"
        size="mini"
        type="month"
        @change="openDeclareLog(declareLog.id)"
        format="yyyy-MM"
        value-format="yyyy-MM"
        placeholder="选择月">
      </el-date-picker>
      <el-select v-model="declareLog.tec" placeholder="请选择" style="width: 100px" value-key="index" size="mini">
        <el-option
          v-for="(item,index) in declareLog.data"
          :key="index"
          :label="item.tec"
          :value="index">
        </el-option>
      </el-select>
      申报日志
    </el-row>
    <ux-grid use-virtual border :data="declareLog.data[declareLog.tec].list" class="ux-table"
             :max-height=pageHeight
             size = "mini" :cell-style="this.CellStyleOne">
      <ux-table-column field="number" width="10%" fixed sortable title="任务编号" align="center"  >
      </ux-table-column>
      <ux-table-column field="name" width="10%" fixed sortable title="任务名称" align="center"  >
      </ux-table-column>
      <ux-table-column field="submitState" min-width="10%" sortable title="任务状态" align="center">
      </ux-table-column>
      <ux-table-column field="workday"  min-width="10%" sortable title="总工时" align="center">
      </ux-table-column>
      <ux-table-column field="designer"  min-width="10%" sortable title="设计" align="center"  >
      </ux-table-column>
      <ux-table-column field="checker" min-width="10%" sortable title="校核" align="center" style="word-break: break-all;">
      </ux-table-column>
      <ux-table-column field="principal" min-width="10%" sortable title="主设" align="center">
      </ux-table-column>
      <ux-table-column field="headman" min-width="10%" sortable title="组长" align="center">
      </ux-table-column>
      <ux-table-column field="type" min-width="10%" sortable title="工时类型" align="center">
        <template slot-scope="scope">
          <span>{{scope.row|workdayTypeFilter}}</span>
        </template>
      </ux-table-column>
      <ux-table-column field="advance" min-width="10%" sortable title="是否预发" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.advance|advanceFilter}}</span>
        </template>
      </ux-table-column>
      <ux-table-column fixed="right" width="100px" title="" align="center">
        <template slot-scope="scope">
          <el-button size="mini" @click="setbackOff(scope.row)" :disabled="scope.row.submit_date !== declareMonth[0]">申请回退</el-button>
        </template>
      </ux-table-column>
    </ux-grid>
  </el-dialog>
  <el-dialog
    v-el-drag-dialog
    :visible.sync="childrenVisible"
    width="66%" style="text-align: center"
    title="子项目列表">
    <u-table key="tecWorkdayLog" use-virtual :row-height="30"
             :data="children" size="mini"
             height="180">
      <u-table-column
        label="编号"
        show-overflow-tooltip
        prop="number">
      </u-table-column>
      <u-table-column
        label="名称"
        show-overflow-tooltip
        prop="name">
      </u-table-column>
      <u-table-column
        label="阶段"
        show-overflow-tooltip
        prop="stage">
      </u-table-column>
      <u-table-column
        label="范围"
        show-overflow-tooltip
        prop="scope">
      </u-table-column>
      <u-table-column
        label="产值"
        show-overflow-tooltip
        prop="money">
      </u-table-column>
      <u-table-column
        label="比例"
        show-overflow-tooltip
        prop="ratio">
      </u-table-column>
      <u-table-column
        label="专业"
        show-overflow-tooltip
        prop="tec">
      </u-table-column>
      <u-table-column
        label="其他专业"
        show-overflow-tooltip
        prop="other_tec">
      </u-table-column>
    </u-table>
  </el-dialog>
</div>
</template>

<script>

const workdayState =[
  {"type" : 0, name : "未发放"},
  {"type" : 1, name : "已发放"},
  {"type" : 2, name : "部分发放"}
]

const releasableState = [
  "正在设计",  "正在校审",  "尚未开展", "尚未确定",
]

const reasonList = [
  "请假",  "出差",  "提资"
]

const stateColor = [{state : "未填报", color : "#000000"},
  {state : "未审核", color : "#ADD8E6"},
  {state : "未申报", color : "#FFFF00"},
  {state : "已申报", color : "#CAFF70"},
  {state : "已发放", color : "#00FF7F"},
  {state : "申报被拒", color : "#EE6363"},]

import virtualList  from 'vue-virtual-scroll-list'
import chinapy from '@/assets/js/chinapy.js'
import News from '../other/News.vue'
export default {
name: "UserScore",
  components: { 'virtual-list': virtualList },
  data(){
  return{
      getRowKeys(row){
        return row.id
      },
    pageHeight : document.body.scrollHeight,
    nowDate : "",
    menuVisible : false,
    delMenu : false,
    updMenu : false,
    declareVisible : false,
    declareConfirmVisible : false,
    currentParentRow : null,
    currentRow : null,
    volume_workday_visible : false,
    loading : true,
    projectList : [],
    volumeList : [],
    volumeProject : [],
    visible_workday : false,
    workdayDateList : [],
    multipleSelection : [],
    workdayData : {
      tec : "",
      num : 0,
      used : 0,
      manage : 0,
      volume : 0,
      usedManage : 0,
      todayManage : 0,
      designer : 0,
      checker : 0,
      principal : 0,
      headman : 0,
      manageRatio : 0,
      volumeRatio : 0,
      backupRatio : 0
    },
    volume_workday : {
      spider : 0,
      ratio : 0,
      designerNum : 0.00,
      checkerNum : 0.00,
      principalNum : 0.00,
      headmanNum : 0.00
    },
    nameLoading : true,
    nameList : [],
    showDate : [],
    downMonth : [],
    ratioVisible : false,
    rowData : "",
    volumeType : [{id: 0, name : "卷册"},{id: 1, name : "备用"}],
    typeList:[{id: 0, name : "管理"},{id: 1, name : "备用"}],
    taskProject : [],
    taskActivity : "任务新增",
    taskInActivity : "申请备用",
    taskType : true,
    checkerList : [],
    childrenVisible : false,
    children : [],
    taskTypeShow : false,
    user : {
        id : null,
        tec : null,
        tecList : [],
        declareDate : null,
        list : [],
        log : []
    },
    userVisible : false,
    logVisible : false,
    showMonth : "",
    declareMonth : [],
    declareUserList : [],
    declareLogVisible : false,
    declareLog : {
        tec : 0,
        data : [
          {list : []}
        ]
    },
  }
  },
  filters:{
    workdayTypeFilter(value){
      if (value.task){
        if (value.type){
          return "备用"
        }else {
          return  "管理"
        }
      }else {
        if (value.type){
          return "备用"
        }else {
          return  "卷册"
        }
      }

    },
    advanceFilter(value){
      if (value){
        return "预发"
      }else {
        return "非预发"
      }
    },
  },
  computed:{
    pickerOptions() {
      let that = this
      return {
        disabledDate(time) {
          const year = time.getFullYear()
          let month = (Number(time.getMonth()) + 1).toString().padStart(2,0)
          const ym = year + '-' + month
        return !(ym === that.nowDate && time.getTime() <= new Date().getTime())
        }
      }
    },
    volumeUsed(){
      return this.workdayData.list.reduce((prev, cur) => {
        if (cur.workday !== undefined && cur.workday !== "") {
          return (Number(prev)*1000 + Number(cur.workday)*1000)/1000
        }
      },0)
    }
  },
  watch :{
    workdayData:{
      handler( newVal, oldVal){
        newVal.headman = 100 - Number(newVal.designer) - Number(newVal.checker) - Number(newVal.principal)
        newVal.manageRatio = (newVal.manage / newVal.num) * 100;
        newVal.volumeRatio = (newVal.volume / newVal.num) * 100;
        newVal.backupRatio = (this.backupUable / newVal.num) * 100
      },
      deep : true
    },
  },
  created() {
  //picker 初始化 需要赋值为yyyy-MM-dd格式，月份和日期需要补0，
    const a = new Date();
    const  end = a.getFullYear() + "-" + (Number(a.getMonth())+1).toString().padStart(2,0) + "-" + a.getDate().toString().padStart(2,0)
    const b = new Date(new Date().getTime()-3600*24*30*1000)
    const start =  b.getFullYear() + "-" + (Number(b.getMonth())+1).toString().padStart(2,0) + "-" + b.getDate().toString().padStart(2,0)
    this.nowDate = a.getFullYear() + "-" + (Number(a.getMonth()) + 1).toString().padStart(2,0)
    let nowMonth = a.getFullYear() + "-" + (Number(a.getMonth()) + 1).toString().padStart(2,0)
    this.showDate = [start,end]
    this.downMonth = [start,end]
    this.$axios
      .post(this.$baseUrl + 'project/declareDay'
      )
      .then(res => {
        let day = res.data.data
        const c = new Date(new Date().getTime()-3600*24*day*1000)
        let month1 = c.getFullYear() + "-" + (Number(c.getMonth()) + 1).toString().padStart(2,0)
        this.showMonth = month1;
        this.declareMonth.push2(month1);
        this.declareMonth.push2(nowMonth);
      })
      .catch(res => (console.log(res)));
  },
  mounted() {
    this.getData();
  },
  methods: {
    rightClick(row, column, event, rowParent) {
      this.menuVisible = false // 先把模态框关死，目的是 第二次或者第n次右键鼠标的时候 它默认的是true
      this.delMenu = false
      this.updMenu = false
      if (row.principalRole === 1) {
        if (row.submit === 0 || row.submit === 3) {
          if (row.spider && ( row.state === "尚未开展" || row.state === "尚未确定")) {
            this.delMenu = true
          }
          if (row.spider === 0){
            this.delMenu = true
          }
          if (row.spider) {
            this.updMenu = true
          }
          if (this.delMenu || this.updMenu) {
            this.menuVisible = true // 显示模态窗口，跳出自定义菜单栏
            event.preventDefault() //关闭浏览器右键默认事件
            this.currentParentRow = rowParent
            this.currentRow = row
            let menu = document.querySelector('#rightMenu');
            this.styleMenu(menu)
          }
        }
      }
    },
    foo() {
      // 取消鼠标监听事件 菜单栏
      this.menuVisible = false
      document.removeEventListener('click', this.foo) // 关掉监听，
    },
    styleMenu(menu) {
      if (event.clientX > 1800) {
        menu.style.left = event.clientX - 100 + 'px'
      } else {
        menu.style.left = event.clientX + 1 + 'px'
      }
      document.addEventListener('click', this.foo) // 给整个document新增监听鼠标事件，点击任何位置执行foo方法
      if (event.clientY > 700) {
        menu.style.top = event.clientY - 30 + 'px'
      } else {
        menu.style.top = event.clientY - 10 + 'px'
      }
    },
    dateDisabled(time){
      return time.getTime > Date.now && time>Date.getMonth()
    },
    dateDiff(sDate) {
      let date2 = new Date();
      let date1 = new Date(Date.parse(sDate.replace(/-/g,   "/")));
      let iDays = parseInt((date2.getTime()- date1.getTime()) /1000/60/60/24);
      return iDays;
    },
    getChildren(row){
      this.$axios.
      post(this.$baseUrl + 'project/queryChildren',{
        id : row.id,
        type : row.type})
        .then( res => {
          if ( res.data.code === 0){
          this.children = res.data.data;
          this.childrenVisible = true}
        })
        .catch(res => console.log(res))
    },
    completeState({row, rowIndex}) {
      // console.log("rowStyle")
      // console.log(row)
      // if (row.workday_state !== undefined) {
      //   let rowBackground = {};
      //   let obj = stateColor.find(value => {
      //     return value.state === row.workday_state
      //   })
      //   rowBackground.color = obj.color;
      //   return rowBackground
      // }
    },
    clickRowHandle(row, column, event) {
      if(!row.expanded){
      if (column.property !== undefined && column.property !== "amount") {
        if (row.type !== 2 && column.property !== "name") {
          row.loading = true;
          this.$axios
            .post(this.$baseUrl + 'project/queryTaskByUser', {
              id: row.id,
              queryStart: this.showDate[0],
              queryEnd: this.showDate[1]
            })
            .then(res => {
              if (res.data.data != undefined) {
                let depList = [], tecList = [], designerList = [],
                  principalList = [], checkerList = [];
                this.$nextTick(() => {
                  res.data.data.forEach(item => {
                    item.general = row.general
                    item.old = item.workday
                  })
                  this.$set(row, 'list', res.data.data)
                  row.expanded = true;
                  this.$refs.uxGrid.setRowExpand([row], true)
                  row.loading = false
                }, 0)
              }
            })
            .catch(res => (console.log(res.data)))
        }
      }
      }else{
        row.expanded = false;
        this.$refs.uxGrid.setRowExpand([row],false)
      }
    },
    releasableStateFilterSum(row,type, highRow){
      if (row.principalRole === 1) {
        if (type) {
          if (row.spider === 1) {
            if (row.submit === 1 || row.submit === 2) {
              return true;
            } else return false;
          } else {
            return true;
          }
        } else {
          if (row.spider === 0) {
            if (row.submit === 1 || row.submit === 2) {
              return true;
            } else return false;
          } else {
            return true;
          }
        }
      }else{
        return true;
      }
    },
    querySearch(queryString, cb) {
      let results = queryString ? reasonList.filter( item =>
        item.toLowerCase().indexOf(queryString.toLowerCase()) === 0) : reasonList;
      cb(results);
    },
    reasonHandle(item,row){
      row.reason = item
    },

    changeReason(row){
      this.$axios
        .post(this.$baseUrl + 'volume/setReason', {
            "id": row.id,
            "reason" : row.reason
          }
        )
        .catch(res => (console.log(res)));
    },
      getData() {
      this.loading = false;
        this.$axios
          .post(this.$baseUrl + 'project/homepageProject')
          .then(res => {
            if (res.data.data.length>0) {
              this.projectList = res.data.data;
            }else {
              this.projectList = [];
            }
          })
          .catch(res => (console.log(res)));
    },
    toggleExpandChangeEvent ({ row, expanded }) {
      row.loading = true;
      if(expanded){
      this.$axios
        .post(this.$baseUrl + 'project/queryTaskByUser',{
          id : row.id,
          queryStart : this.showDate[0],
          queryEnd : this.showDate[1]
        })
        .then(res => {
          if(res.data.data !== undefined){
            let depList =[], tecList =[], designerList = [],
            principalList = [], checkerList = [];
          this.$nextTick( () => {
            res.data.data.forEach(item =>{
              item.general = row.general
              item.old = item.workday
            })
            this.$set(row,'list',res.data.data)
            setTimeout(() =>{
                          console.log(this.$refs['grid'+row.id])
            },1)

            row.loading = false
          },0)
          }
              })
              .catch(res => (console.log(res.data)))
      }
    },
    filterHandler({value, row, column}){
      const property = column['property'];
      return row[property] === value;
    },
    openProject(project){
      let href
      if (project.mode) {
        href = this.$router.resolve(
          {
            path: "/scientificMain",
            name: "scientificMain",
            query:{
              "scientific_id" : project.id
            }
          }
        )
      }else {
        let path = "/projectMain";
        if (project.principal) {
          path = "/projectMain/projectProgressDetails"
        }
        href = this.$router.resolve(
          {
            path: path,
            query: {
              "project_id": project.id
            }
          }
        )
      }
      window.open( href.href,project.id)
    },
    closeDialog(){
      this.workdayData = {
            tec : "",
            num : 0,
            used : 0,
            manage : 0,
            volume : 0,
            usedManage : 0,
            todayManage : 0,
    }
      this.visible_workday = false
    },
    getTec(val){
      this.task.proNumber = val.number
      this.task.pid = val.id
    this.taskDep = [];
    this.taskTec = [];
    this.task.dep = "";
    this.task.tec = "";
      if(!this.taskType && this.task.show){
        this.$axios
          .post(this.$baseUrl + 'department/queryByProjectAll',{},{headers : {id : val.id}})
          .then(res => {
            if(res.data.code === 0){
              this.taskDep = res.data.data
            }
          })
          .catch(res => (console.log(res)));

      }else{
      }
    },
    newTask(val){
      this.task = {
      project : val,
      pid : val.id,
      number : "",
      name : "",
      type : 1,
      workday : 0,
      dep : "",
      tec : "",
      usable : 0,
      planned_end : "",
      end : "",
      principal : this.$parent.name,
      designer : null,
      checker : null,
      headman  : null,
      principal_workday : 0,
      designer_workday : 0,
      checker_workday : 0,
      headman_workday : 0,
      show : val.show};
    if(val.show){
      this.task.designer = this.$parent.name
      this.taskInActivity = "设总发放";
      this.taskType = false;
      this.getUasble();
    }else {
      this.taskType = true;
      this.taskInActivity = "申请备用";
    }
      // this.taskTypeShow = false;
      this.taskTypeShow = true;
      // 只有登陆人即是设总又是主设人才可
    if(val.show && val.principal){
      // this.taskTypeShow = true;
      this.taskTypeShow = false;
      this.taskType = false
    }
    this.taskPrincipal = [];
    if(this.taskType){
      this.projectList.forEach(item =>{
        if(item.principal){
          this.taskProject.push2(item)
        }
    })
    }else{
            this.projectList.forEach(item =>{
              if(item.show){
                this.taskProject.push2(item)
              }
            })
      }
    this.$forceUpdate();
    this.taskVisible = true
    this.getTec(val)
    },
    taskTypeChange(val){
      if(val){
        this.task.designer = null;
      }else{
        this.task.designer = this.$parent.name;
      }
      this.task.number = "";
      this.task.dep  = "";
      this.task.type = 1;
      this.task.tec = "";
      this.task.workday = 0;
      this.task.usable = 0;
      this.getTec(this.task.project)
    },
    openDeclareLog(id){
      this.declareLog = {
        tec : 0,
        data : [
          {list : []}
        ]
      };
      this.$axios
        .post(this.$baseUrl + 'project/declareLog',{
          id : id,
          date : this.showMonth,
        })
        .then(res => {
          if (res.data.code === 0){
            this.declareLog.tec = 0;
            this.declareLog.id = id;
            this.declareLog.data = res.data.data
            this.declareLogVisible = true
          }
        })
        .catch(res => (console.log(res)));
    },
    setbackOff(row){
      this.$axios
        .post(this.$baseUrl + 'project/backOff',{
          id : row.id,
          date : row.submit_date,
          task : row.task,
          advance : row.advance,
        })
        .then(res => {
          if (res.data.code === 0){
            this.$message.success("操作成功")
          }
        })
        .catch(res => (console.log(res)));
    },
    downExcel(){
      // 工时日志
      let that = this;
      this.$message.success("即将开始下载");
      let xhr = new XMLHttpRequest();
      let u =  this.$baseUrl + 'projectExcel/userByPrincipal?date='
        + this.showMonth+'&id=' + that.user.id;
      xhr.open("get", u, true); // get、post都可
      xhr.responseType = "blob";  // 转换流
      xhr.setRequestHeader("Authorization", this.$storage.get("Authorization")); // token键值对
      xhr.onload = function() {
        if (this.status === 200) {
          let blob = this.response;
          let a = document.createElement("a")
          let url = window.URL.createObjectURL(blob)
          a.href = url
          a.download =  that.user.proName + "工时汇总表.xlsx"  // 文件名
          a.click()
          window.URL.revokeObjectURL(url)
        }
      }
      xhr.send();
    },
    downExcel1(){
      let that = this;
      this.$message.success("即将开始下载");
      let xhr = new XMLHttpRequest();
      let u =  this.$baseUrl + 'projectExcel/personalVolume?minDay='
        + this.downMonth[0]+'&maxDay='+this.downMonth[1] + '&id=' + this.id;
      xhr.open("get", u, true); // get、post都可
      xhr.responseType = "blob";  // 转换流
      xhr.setRequestHeader("Authorization", this.$storage.get("Authorization")); // token键值对
      xhr.onload = function() {
        if (this.status === 200) {
          let blob = this.response;
          let a = document.createElement("a")
          let url = window.URL.createObjectURL(blob)
          a.href = url
          a.download =  that.$parent.name + "完成卷册信息表.xlsx"  // 文件名
          a.click()
          window.URL.revokeObjectURL(url)
        }
      }
      xhr.send();
    },
    remoteMethod(query) {
      if (query !== '') {
        this.nameLoading = true;
        setTimeout(() => {
          this.$axios
            .post(this.$baseUrl + 'user/queryByName', {
                "name" : query
              }
            )
            .then(res => {
              if (res.data.data != null) {
                this.nameList = res.data.data
              }
            });
          this.nameLoading = false;
        }, 200);
      } else {
        this.nameList = [];
      }
    },
  }
}
</script>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 130px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.el-tabs{
  margin-left: 2%;
  width: 96%;
}
.ux-table {
  /*margin-left: 2%;*/
  /*width: 96%;*/
  horiz-align: center;
  font-size: 12px;
  word-wrap: break-word;
  margin-bottom: 10px;
}

    /deep/ .ux-table__fixed-right {
      height: 100% !important;
    /*/ / 设置高优先，以覆盖内联样式*/
    }
    /deep/ .ux-table__fixed {
      height: 100% !important;
    /*/ / 设置高优先，以覆盖内联样式*/
    }
  /deep/ .ux-table th > .cell{
    text-align: center;
  }
  /deep/ .ux-table .cell{
    text-align: center;
  }

  .input {
    width: 50%;
  }

.el-input.is-disabled /deep/ .el-input__inner {
  background-color: white;
  color: #000000;
}

.contextmenu__item {
  display: block;
  line-height: 34px;
  text-align: center;
}
.contextmenu__item:not(:last-child) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.menu {
  position: absolute;
  background-color: #fff;
  width: 100px;
  /*height: 106px;*/
  font-size: 12px;
  color: #444040;
  border-radius: 4px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  border-radius: 3px;
  border: 1px solid rgba(0, 0, 0, 0.15);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
  white-space: nowrap;
  z-index: 1000;
}
.contextmenu__item:hover {
  cursor: pointer;
  background: #66b1ff;
  border-color: #66b1ff;
  color: #fff;
}

</style>
