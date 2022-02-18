<template>
  <div align="center" style="width: 80%;margin-left: 10%">
  <el-row align="center" style="text-align: center;margin-top: 1%">
      <span style="font-size: 18px">项目总工时详情</span>
  </el-row>
  <el-form ref="form" :model="form" style="margin-top: 10px">
    <el-row>
      <el-col :span="8">
        <el-form-item label="总工时" label-width="100px">
          <el-input disabled v-model="form.num" size="mini" style=""
                    type="text" placeholder="请输入工时数量">
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="管理工时" label-width="100px">
          <el-input disabled v-model="form.manage" size="mini"
                    type="text" placeholder="请输入工时数量">
          </el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label= "备用工时" label-width="100px">
          <el-input disabled v-model="form.backup" size="mini"
                    type="text" placeholder="请输入工时数量">
          </el-input>
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
        label= "已用管理工时">
      </el-table-column>
      <el-table-column
        prop="volumeUsed"
        label= "已用卷册工时">
      </el-table-column>
      <el-table-column
        prop="backupUsed"
        label= "已用备用工时">
      </el-table-column>
    </el-table>
    <el-row>
    </el-row>

  </el-form>
</div>
</template>

<script>
export default {
name: "ProjectSumWorkday",
  data() {
  return{
    project_id : "",
    form : {},
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
  }
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
