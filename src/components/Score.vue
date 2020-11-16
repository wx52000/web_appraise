<template>
  <div id="main" align="center">
    <el-row>
      <!-- 列表 -->
      <el-row style="margin: 0 20px 20px 20px;background-color: #FFF;">
        <el-row>
          <el-row style="margin:0 auto;text-align: center; align-content: center">
            <el-col :span="24" style="line-height: 50px;font-size: 16px;font-weight: bold;color: #666;text-align: center ">
              {{month}}月个人评价汇总表

              <i v-if="pid==1" class="el-icon-document-copy" @click="downExcel"></i>
            </el-col>
          </el-row>
          <div>
          <el-table border :data="list" style="width:85%"
                    v-loading.lock="loading"  element-loading-text="拼命加载中"
                    element-loading-spinner="el-icon-loading"
                    :header-cell-style="this.CellStyleOne" :cell-style="this.CellStyleOne"
                    @filter-change="filterMethod"
                    @sort-change="changeSort">

            <el-table-column prop="name" label="姓名" sortable="custom">
            </el-table-column>
            <el-table-column prop="technology" label="专业"
                             column-key="technology"
                             :filters="technologyList">
            </el-table-column>
            <el-table-column prop="department" label="部门"
                             column-key="department"
                             :filters="departmentList">
            </el-table-column>
            <el-table-column prop="score" label="平均评分">
            </el-table-column>


          </el-table>
          </div>
        </el-row>
      </el-row>
    </el-row>
  </div>
</template>

<script>
export default {
name: "Score",
  data() {
    return {
      id: "",
      pid: "",
      month: new Date().getMonth() + 1,
      search1: "",
      search2: "",
      search3: "",
      search4: "",
      search5: "",
      pageIndex: 1,
      pageSize: 10,
      list: [],
      loading : true,
      technologyList:[],
      departmentList:[],
      selectName: "",
      selectType: "",
      queryByd:null,
      queryByt:null

    }
  },
  mounted() {
    this.getLogIn();
    // this.getData();
  },
  methods: {
    search() {
      this.getData();
    },
    reset() {
      this.search1 = "";
      this.search2 = "";
      this.pageIndex = 1;
      this.getData();
    },
    getLogIn() {
      let i = JSON.parse(sessionStorage.getItem("appraise"));
      this.id = i.id;
      this.pid = i.pid;
      this.getData();
      this.getOtherData();
    },
    getData() {
      this.$axios
        .post(this.$baseUrl + 'userScore/queryScore', {
          "id": this.id,
          "selectName" : this.selectName,
          "selectType" : this.selectType,
          "tIds": this.queryByt,
          "dIds" : this.queryByd
        })
        .then(res => (this.list = res.data.data))
        .catch(res => (console.log(res)));
      this.loading = false;
    },
    getOtherData(){
      this.$axios
        .post(this.$baseUrl + 'technology/queryNotUser',{},{headers: {'id': this.id}})
        .then(res => {this.technologyList = res.data.data;
          this.technologyList = JSON.parse(JSON.stringify(this.technologyList).replace(/id/g,"value").replace(
            /name/g,"text"));})
        .catch(res => (console.log(res)));
      this.$axios
        .post(this.$baseUrl + 'department/queryNotUser',{},{headers: {'id': this.id}})
        .then(res => {this.departmentList = res.data.data;
          this.departmentList = JSON.parse(JSON.stringify(this.departmentList).replace(/id/g,"value").replace(
            /name/g,"text"));})
        .catch(res => (console.log(res)));
    },
    downExcel() {
      this.$message.success("即将开始下载");
      window.location.href = this.$baseUrl + 'userScore/personExcel?id=' + this.id;
    },
    filterMethod(filter){
      for (let obj in filter){
        if (obj === "technology") {
          this.queryByd = null;
          if (filter.technology.length !== 0) {
            this.queryByt = filter.technology
          }else {
            this.queryByt = null
          }

        }
        else {
          this.queryByt = null;
          if (filter.department.length !== 0) {
            this.queryByd = filter.department
          }else {
            this.queryByd = null
          }
        }
      }
      this.getData()
    },

    changeSort(v){
      if(v.order == null){
        this.selectName = "";
        this.selectType = ""
      }else if(v.order === "ascending"){
        this.selectName = v.prop
        this.selectType = ""
      }else if(v.order === "descending"){
        this.selectName = v.prop
        this.selectType = 1
      }
      this.getData()
    },





  }
}
</script>

<style scoped>

</style>
