<template>
<div>
  <el-descriptions class="margin-top" title="个人信息" style="margin-left: 4%" :column="5">
    <el-descriptions-item label="姓名"><span>{{information.name}}</span></el-descriptions-item>
    <el-descriptions-item label="专业"><span>{{information.tec}}</span></el-descriptions-item>
    <el-descriptions-item label="部门" :span="2"><span>{{information.dep}}</span></el-descriptions-item>
    <el-descriptions-item label="月份">          <el-date-picker
      v-model="nowMonth"
      field="month"
      style="width: 160px"
      size="mini"
      type="month"
      @change="getData"
      format="yyyy-MM"
      value-format="yyyy-MM"
      placeholder="选择月">
    </el-date-picker></el-descriptions-item>
    <el-descriptions-item label="本月总工时">
      <span>{{information.workday}}</span>
    </el-descriptions-item>
    <el-descriptions-item label="卷册工时">
      <span>{{information.volume_workday}}</span>
    </el-descriptions-item>
    <el-descriptions-item label="非卷册工时">
      <span>{{information.task_workday}}</span>
    </el-descriptions-item>
    <el-descriptions-item label="设总管理">
      <span>{{information.manage}}</span>
    </el-descriptions-item>
    <el-descriptions-item label="科技工时">
      <span>{{information.scientific}}</span>
    </el-descriptions-item>
  </el-descriptions>
  <el-row>
      <el-card :body-style="{ padding: '0px',height : '360px' }">
        <div slot="header" style="display: table;content:'';clear: both" >
          <span>本月获得工时详情</span>
        </div>
        <u-table key="logList" use-virtual :row-height="28" :data="logList" class="u-table"
                 size = "mini" :border="false" :cell-style="this.CellStyleOne"
                 height="360px">
          <u-table-column prop="pnum" sortable min-width="10%" label="项目编号" align="center"  >
          </u-table-column>
          <u-table-column prop="pname" sortable min-width="10%" label="项目名称" align="center"  >
          </u-table-column>
          <u-table-column prop="number" sortable min-width="15%" label="任务编号" align="center" style="word-break: break-all;">
          </u-table-column>
          <u-table-column prop="name" sortable min-width="15%" label="任务名称" align="center" style="word-break: break-all;">
          </u-table-column>
          <u-table-column prop="handler" sortable min-width="10%" label="主设人/发放人" align="center"  >
          </u-table-column>
          <u-table-column prop="workday" sortable min-width="10%" label="工时数量" align="center">
          </u-table-column>
          <u-table-column prop="type" sortable min-width="15%" label="类型" align="center"  >
            <template slot-scope="scope">
              <span>{{scope.row.type|typeFilter}}</span>
            </template>
          </u-table-column>
          <u-table-column prop="role" sortable min-width="15%" label="角色" align="center"  >
            <template slot-scope="scope">
              <span>{{scope.row.role|roleFilter}}</span>
            </template>
          </u-table-column>
        </u-table>
      </el-card>
  </el-row>
</div>
</template>

<script>
const type = [{id :0, explain : "管理工时"},
  {id :1, explain : "备用工时"},
  {id :2, explain : "卷册工时"},
  {id :3, explain : "提前发放"},
  {id :4, explain : "提前发完成"},
  {id :6, explain : "科技工时"},]
const role = [{id :0, explain : "设计"},
  {id :1, explain : "校核"},
  {id :2, explain : "主设"},
  {id :3, explain : "组长"},
  {id :5, explain : "设总"},]
export default {
name: "Self",
  data(){
  return{
    information:{
      name : ""
    },
    nowMonth : null,
    logList : [],
    }
  },
  filters:{
    typeFilter(value){
      let  obj = type.find(value1 => {
        return value1.id === value
        })
      return obj.explain
    },
    roleFilter(value){
      let  obj = role.find(value1 => {
        return value1.id === value
      })
      return obj.explain
    }
  },
  mounted() {
    let a = new Date();
    this.$axios
      .post(this.$baseUrl + 'project/declareDay'
      )
      .then(res => {
        let day = res.data.data
        const c = new Date(new Date().getTime()-3600*24*day*1000)
        let month1 = c.getFullYear() + "-" + (Number(c.getMonth()) + 1).toString().padStart(2,0)
        this.nowMonth = month1
        this.getData()
      })
      .catch(res => (console.log(res)));
  },
  methods:{
    getData() {
      this.$axios
        .post(this.$baseUrl + 'user/information',{},{headers :{queryDate: this.nowMonth}})
        .then(res =>{
          this.information = res.data.data
          this.$forceUpdate();
        })
        .catch(res => (console.log(res)));
      this.$axios
        .post(this.$baseUrl + 'user/workdayLogById',{},{headers :{queryDate : this.nowMonth}})
        .then(res =>{
          this.logList = res.data.data
          console.log(this.logList)
        })
        .catch(res => (console.log(res)));
    },
  },
}
</script>

<style scoped>
.u-table {
  /*margin-left: 2%;*/
  /*width: 96%;*/
  horiz-align: center;
  font-size: 12px;
  word-wrap: break-word;
  margin-bottom: 10px;
}
</style>
