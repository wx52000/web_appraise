<template>
<div>
  <el-descriptions class="margin-top" title="个人信息" style="margin-left: 4%" :column="5">
    <el-descriptions-item label="姓名"><span>{{information.name}}</span></el-descriptions-item>
    <el-descriptions-item label="专业"><span>{{information.technology}}</span></el-descriptions-item>
    <el-descriptions-item label="部门" :span="2"><span>{{information.department}}</span></el-descriptions-item>
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
      <span>{{information.volume}}</span>
    </el-descriptions-item>
    <el-descriptions-item label="非卷册工时">
      <span>{{information.task}}</span>
    </el-descriptions-item>
    <el-descriptions-item label="设总管理">
      <span>{{information.manage}}</span>
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
          <u-table-column prop="pnum" min-width="10%" label="项目编号" align="center"  >
          </u-table-column>
          <u-table-column prop="pname" min-width="10%" label="项目名称" align="center"  >
          </u-table-column>
          <u-table-column prop="number" min-width="15%" label="任务编号" align="center" style="word-break: break-all;">
          </u-table-column>
          <u-table-column prop="name" min-width="15%" label="任务名称" align="center" style="word-break: break-all;">
          </u-table-column>
          <u-table-column prop="handler" min-width="10%" label="主设人/发放人" align="center"  >
          </u-table-column>
          <u-table-column prop="workday" min-width="10%" label="工时数量" align="center">
          </u-table-column>
          <u-table-column prop="type" min-width="15%" label="类型" align="center"  >
            <template slot-scope="scope">
              <span>{{scope.row.type|typeFilter}}</span>
            </template>
          </u-table-column>
          <u-table-column prop="role" min-width="15%" label="角色" align="center"  >
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
  {id :4, explain : "提前发完成"},]
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
    this.nowMonth = a.getFullYear() + "-" + (Number(a.getMonth()) + 1).toString().padStart(2,0)
    this.getData()
  },
  methods:{
    getData() {
      this.$axios
        .post(this.$baseUrl + 'user/information',{},{headers :{queryDate: this.nowMonth}})
        .then(res =>{
          let data = res.data.data;
          console.log(data)
          this.information.name = data.user.name;
          this.information.technology = data.user.technology;
          this.information.department = data.user.department;
          data.backup = this.$myMethod.nullTo0(data.backup)
          this.information.volume = (Number(data.volume.designer) + Number(data.backup) +
            Number(data.volume.checker) + Number(data.volume.principal) + Number(data.volume.headman)).toFixed(2);
          data.task = this.$myMethod.nullTo0(data.task) + this.$myMethod.nullTo0(data.advance);
          data.manage = this.$myMethod.nullTo0(data.manage);
          console.log(data.virtual)
          this.information.workday = (Number(this.information.volume) + Number(data.task) + Number(data.manage)).toFixed(2)
          this.information.task = data.task
          this.information.manage = data.manage
          console.log(this.information)
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
