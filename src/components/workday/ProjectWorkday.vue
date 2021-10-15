<template>
  <div align="center" style="width: 80%;margin-left: 10%">
    <el-row align="center" style="text-align: center;margin-top: 1%">
      <span style="font-size: 18px;">项目工时管理</span>
    </el-row>
  <el-form ref="form" :model="form" style="width:60%;margin-top: 1%">
    <el-form-item label="项目名称" label-width="100px">
      <el-input v-model="$parent.project.name" disabled></el-input>
    </el-form-item>
    <el-form-item label="项目编号" style="white-space:nowrap" label-width="100px">
      <el-input v-model="$parent.project.number" disabled></el-input>
    </el-form-item>
    <el-form-item label="设总管理工时" style="white-space:nowrap" label-width="100px">
      <el-input label="设总管理工时" v-model="form.manage" oninput="value=value.replace(/[^\d.]/g,'')"
                type="text" placeholder="请输入工时数量">
      </el-input>
    </el-form-item>
    <el-form-item label="专业工时" style="white-space:nowrap" label-width="100px">
      <el-input label="专业工时" v-model="form.tec" oninput="value=value.replace(/[^\d.]/g,'')"
                type="text" placeholder="请输入工时数量">
      </el-input>
    </el-form-item>
    <el-form-item label="备用工时" style="white-space:nowrap" label-width="100px">
      <el-input label="备用工时" v-model="form.backup" oninput="value=value.replace(/[^\d.]/g,'')"
                type="text" placeholder="请输入工时数量">
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">确认</el-button>
      <el-button @click="reset()">重置</el-button>
    </el-form-item>
  </el-form>
</div>
</template>

<script>
export default {
  name: "WorkDayManage",
    data(){
    return{
      isShow : false,
      projectId : "",
      form : {},
    }
  },
  mounted() {
    this.projectId = this.$route.query.project_id;
    this.getData();
  },
  methods:{
    getData(){
      this.$axios
        .post(this.$baseUrl + 'projectWorkDay/queryProjectWorkDay', {},
          {headers:{"id" : this.projectId}})
        .then(res => { this.form = res.data.data})
        .catch(res => (console.log(res)));
    },
    onSubmit(){
      this.$axios
        .post(this.$baseUrl + 'projectWorkDay/setProWorkDay', {
          "project_id" : this.projectId,
          "manage" : this.form.manage,
          "tec" : this.form.tec,
          "backup" : this.form.backup
        })
        .then(res => {
          this.$message({
            message: '修改成功',
            type: 'success'
          });
        })
        .catch(res => (console.log(res)));
    },
    reset(){
      this.getData();
    },
  }
}
</script>

<style scoped>
.el-input.is-disabled /deep/ .el-input__inner {
  background-color: white;
  color: #000000;
}
</style>
