<template>
  <div align="center" style="width: 80%;margin-left: 10%">
  <el-row align="center" style="text-align: center;margin-top: 1%">
      <span style="font-size: 18px">项目总工时详情</span>
  </el-row>
  <el-form ref="form" :model="form" style="margin-top: 10px">
    <el-row>
      <el-col :span="6">
        <el-form-item label="总工时" label-width="100px">
          <el-input disabled v-model="form.num" size="mini" style="width: 120px"
                    type="text" placeholder="请输入工时数量">
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="管理工时" label-width="100px">
          <el-input disabled style="width: 120px" v-model="form.manage" size="mini"
                    type="text" placeholder="请输入工时数量">
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label= "备用工时" label-width="100px">
          <el-input disabled style="width: 120px" v-model="form.backup" size="mini"
                    type="text" placeholder="请输入工时数量">
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="5">
       <el-form-item label= "考核工时" label-width="100px">
          <el-input disabled style="width: 120px" v-model="form.deduct" size="mini"
                    type="text" placeholder="请输入工时数量">
          </el-input>
       </el-form-item>
      </el-col>
      <el-col :span="1">
        <el-form-item >
        <el-button size="mini" @click="openDeductLog">记录</el-button>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="卷册工时"  label-width="100px">
          <el-input disabled v-model="form.tec" size="mini"
                    type="text" placeholder="请输入工时数量">
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="已用管理工时" label-width="100px">
          <el-input disabled v-model="form.manageUsed" size="mini"
                    type="text" placeholder="请输入工时数量">
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label= "已用备用工时" label-width="100px">
          <el-input disabled v-model="form.backupUsed" size="mini"
                    type="text" placeholder="请输入工时数量">
          </el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-table
      :data="form.list"
      size="mini"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="专业"
        width="180">
      </el-table-column>
      <el-table-column
        prop="amount"
        label="工时总数"
        width="180">
      </el-table-column>
      <el-table-column
        prop="used"
        label="已发工时"
        width="180">
      </el-table-column>
      <el-table-column
        prop="manage"
        label= "管理工时">
      </el-table-column>
      <el-table-column
        prop="volume"
        label= "卷册工时">
      </el-table-column>
      <el-table-column
        prop="backup"
        label= "备用工时">
      </el-table-column>
      <el-table-column
        prop="manageUsed"
        label= "已用管理">
      </el-table-column>
      <el-table-column
        prop="volumeUsed"
        label= "已用卷册">
      </el-table-column>
      <el-table-column
        prop="backupUsed"
        label= "已用备用">
      </el-table-column>
      <el-table-column fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" @click="openTecWorkdayLog(scope.row)">记录</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
    </el-row>
  </el-form>

    <el-dialog
      v-el-drag-dialog
      :visible.sync="tecWorkdayLogVisible"
      width="50%" style="text-align: center"
      title="工时记录">
      <u-table key="tecWorkdayLog" use-virtual :row-height="30"
               :data="tecWorkdayLog" size="mini"
               max-height="180">
        <u-table-column
          label="时间"
          show-overflow-tooltip
          prop="time">
        </u-table-column>
        <u-table-column
          label="数量"
          show-overflow-tooltip
          prop="amount">
        </u-table-column>
        <u-table-column
          label="原因"
          show-overflow-tooltip
          prop="reason">
        </u-table-column>
      </u-table>
    </el-dialog>
    <el-dialog
      v-el-drag-dialog
      :visible.sync="deductVisible"
      width="66%" style="text-align: center"
      title="考核记录">
      <u-table key="deductLog" use-virtual :row-height="30"
               :data="deductLog" size="mini"
               max-height="300">
        <u-table-column
          label="任务编号"
          show-overflow-tooltip
          prop="number">
        </u-table-column>
        <u-table-column
          label="任务名称"
          show-overflow-tooltip
          prop="name">
        </u-table-column>
        <u-table-column
          label="人员\专业"
          show-overflow-tooltip
          prop="user">
        </u-table-column>
        <u-table-column
          label="工时数量"
          show-overflow-tooltip
          prop="workday">
        </u-table-column>
        <u-table-column
          label="原因"
          show-overflow-tooltip
          prop="reason">
        </u-table-column>
        <u-table-column
          label="类型"
          show-overflow-tooltip
          prop="type">
        </u-table-column>
      </u-table>
    </el-dialog>
</div>
</template>

<script>
export default {
name: "ProjectSumWorkday",
  data() {
  return{
    projectId : "",
    form : {},
    tecWorkdayLogVisible : false,
    tecWorkdayLog : [],
    deductVisible : false,
    deductLog : [],
    }
  },
  mounted() {
  this.projectId = this.$route.query.project_id;
  this.getData();
  },
  methods :{
  getData(){
    this.$axios
      .post(this.$baseUrl + 'projectWorkday/queryProjectSumWorkday', {},
        {headers:{"id" : this.projectId}})
      .then(res => {
        this.form = res.data.data
      })
      .catch(res => (console.log(res)));
  },
    openTecWorkdayLog(row){
      this.tecWorkdayLog = [];
      this.$axios
        .post(this.$baseUrl + 'projectWorkday/queryProjectTecWorkdayLog',{
          id : this.projectId,
          tec : row.name
        })
        .then(res => {
          if (res.data.code === 0){
            this.tecWorkdayLog = res.data.data
            this.tecWorkdayLogVisible = true;
          }
        })
        .catch(res => (console.log(res)));
    },
    openDeductLog(row){
      this.tecWorkdayLog = [];
      this.$axios
        .post(this.$baseUrl + 'deduct/queryLogByProject',{},
          {headers : {id : this.projectId}})
        .then(res => {
          if (res.data.code === 0){
            this.deductLog = res.data.data
            this.deductVisible = true;
          }
        })
        .catch(res => (console.log(res)));
    },
  },
}
</script>

<style scoped>
.el-input.is-disabled /deep/ .el-input__inner {
  background-color: white;
  color: #000000;
}
.el-input{
  width: 160px;
}
</style>
