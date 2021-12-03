<template>
<div>
  <el-descriptions class="margin-top" title="个人信息" style="margin-left: 4%" :column="4">
    <el-descriptions-item label="姓名"><span>{{information.name}}</span></el-descriptions-item>
    <el-descriptions-item label="专业"><span>{{information.technology}}</span></el-descriptions-item>
    <el-descriptions-item label="部门" :span="2"><span>{{information.department}}</span></el-descriptions-item>
    <el-descriptions-item label="本月总工时">
      <span>{{information.workday}}</span>
    </el-descriptions-item>
    <el-descriptions-item label="卷册工时">
      <span>{{information.volume}}</span>
    </el-descriptions-item>
    <el-descriptions-item label="前期项目工时">
      <span>{{information.virtual}}</span>
    </el-descriptions-item>
    <el-descriptions-item label="其它项目工时">
      <span>{{information.activity}}</span>
    </el-descriptions-item>
  </el-descriptions>
  <el-row>
    <el-col :span="12">
      <el-card :body-style="{ padding: '0px',height : '360px' }">
        <div slot="header" style="display: table;content:'';clear: both" >
          <span>本月获得工时详情</span>
        </div>
        <u-table key="logList" use-virtual :row-height="28" :data="logList" class="u-table"
                 size = "mini" :border="false" :cell-style="this.CellStyleOne"
                 height="360px">
          <u-table-column prop="principal" min-width="10%" label="主设人/发放人" align="center"  >
          </u-table-column>
          <u-table-column prop="workday" min-width="10%" label="工时数量" align="center">
          </u-table-column>
          <u-table-column prop="type" min-width="15%" label="工时类型" align="center"  >
            <template slot-scope="scope">
              <span>{{scope.row.type|typeFilter}}</span>
            </template>
          </u-table-column>
          <u-table-column prop="number" min-width="15%" label="卷册号/项目号" align="center" style="word-break: break-all;">
          </u-table-column>
        </u-table>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card class="box-card" :body-style="{ padding: '0px',height : '360px' }">
        <div slot="header" style="display: table;content:'';clear: both">
          <span>个人工时记录表</span>
        </div>
        <div ref="myChart" id="myChart" align="center" style="width: 100%;height:100%;">
        </div>
      </el-card>
    </el-col>
  </el-row>
</div>
</template>

<script>
const type = [{id :1, explain : "卷册工时"},
  {id :2, explain : "卷册提前发放"},
  {id :3, explain : "卷册发放剩余"},
  {id :4, explain : "备用工时"},
  {id :5, explain : "初设项目工时"},
  {id :6, explain : "其它项目工时"}]
export default {
name: "Self",
  data(){
  return{
    information:{
      name : ""
    },
    logList : [],
    }
  },
  filters:{
    typeFilter(value){
      let  obj = type.find(value1 => {
        return value1.id === value
        })
      return obj.explain
    }
  },
  mounted() {
    this.getData()
  },
  methods:{
    getData() {
      this.$axios
        .post(this.$baseUrl + 'user/information')
        .then(res =>{
          let data = res.data.data;
          console.log(data)
          this.information.name = data.user.name;
          this.information.technology = data.user.technology;
          this.information.department = data.user.department;
          data.backup = this.$myMethod.nullTo0(data.backup)
          this.information.volume = Number(data.volume.designer) + Number(data.backup) +
            Number(data.volume.checker) + Number(data.volume.principal) + Number(data.volume.headman);
          data.activity = this.$myMethod.nullTo0(data.activity);
          data.virtual = this.$myMethod.nullTo0(data.virtual);
          console.log(data.virtual)
          this.information.workday = Number(this.information.volume) + Number(data.virtual) + Number(data.activity)
          this.information.virtual = data.virtual
          this.information.activity = data.activity
          console.log(this.information)
        })
        .catch(res => (console.log(res)));
      this.$axios
        .post(this.$baseUrl + 'user/workdayLogById')
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
