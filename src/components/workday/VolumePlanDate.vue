<template>
  <div>
    <el-row style="margin-top: 5px">
      <el-col :span="18">
      <el-input type="text" v-model="search" placeholder="请输入需要查询卷册的名称或编号" size="mini"
      style=" width: 60%"/>

      <el-button size="mini" @click="getSearchDate">查询</el-button>
        <el-button size="mini" @click="() => {this.search = '';this.list = [];this.getSuccessData() }">重置</el-button>
      </el-col>
      <el-button size="mini" @click="visible = true">上传</el-button>
    </el-row>
    <ux-grid ref="staffList" key="list" use-virtual
             :max-height=pageHeight
             border :data="list" style="margin-top: 5px"
             size="mini"
             :default-sort = "{prop: 'date', order: 'descending'}">
      <ux-table-column
        type="index"
        align="center"
        width="50">
      </ux-table-column>
      <ux-table-column field="number" title="卷册编号" min-width="180px" sortable align="center">
      </ux-table-column>
      <ux-table-column field="name" title="卷册名称"  min-width="180px" sortable align="center">
      </ux-table-column>
      <ux-table-column title="计划出版时间" fixed="right"  min-width="120px" align="center">
        <template slot-scope="scope">
          <el-date-picker
            v-model="scope.row.plannedPublictionDate"
            style="width: 160px"
            size="mini"
            type="date"
            @change="setPlannedPublictDate(scope.row)"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            placeholder="计划出版时间">
          </el-date-picker>
        </template>
      </ux-table-column>
    </ux-grid>
    <el-dialog
      title="计划时间导入"
      v-el-drag-dialog
      :visible.sync="visible"
      width="40%">
      <el-upload
        class="upload-demo"
        drag
        with-credentials
        :headers="headers"
        :on-success="getSuccessData"
        :action="this.$baseUrl + 'volume/setPlanDate'"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传excel文件</div>
      </el-upload>
    </el-dialog>
    <el-dialog
      v-el-drag-dialog
      :visible.sync="notHaveVisible"
      width="40%">
      <u-table  use-virtual :row-height="28"
               :max-height=pageHeight
               border :data="notHaveList"
               size="mini">
        <u-table-column
          type="index"
          align="center"
          width="50">
        </u-table-column>
        <u-table-column prop="number" label="卷册编号" min-width="180px" sortable align="center">
        </u-table-column>
      </u-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
name: "VolumePlanDate",
  data(){
  return {
    pageHeight : document.body.clientHeight,
    search : "",
    visible : false,
    list : [],
    notHaveVisible : false,
    notHaveList : []
  }
  },
  computed: {
    headers () {
      return {
        "Authorization": this.$storage.get("Authorization")
      }
    }
  },
  mounted() {
  this.getData();
  },
  methods :{
    getSuccessData(response, file, fileList){
      if (response.code === 0 && response.data !== null){
        this.notHaveList = response.data
        this.notHaveVisible = true
      }
      this.getData()
    },
    getData(){
      this.list = [];
      this.$axios
        .post(this.$baseUrl + 'volume/queryTodayEntryPlan')
        .then(res => {
          if (res.data.code === 0) {
            this.list = res.data.data
          }
        })
        .catch(res => (console.log(res)));
    },
    getSearchDate(){
      this.list = [];
      this.$axios
        .post(this.$baseUrl + 'volume/queryPlannedPublicDate',{},
          {headers : {search : this.search}})
        .then(res => {
          this.list = res.data.data
        })
        .catch(res => (console.log(res)));
    },
    setPlannedPublictDate(row){
      this.$axios
        .post(this.$baseUrl + 'volume/setSinglePlanDate',row,)
        .then(res => {
          this.$message.success("操作成功")
        })
        .catch(res => (console.log(res)));
    }
  }
}
</script>

<style scoped>

</style>
