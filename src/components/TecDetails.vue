<template>

  <div id="main" align="center">
    <el-row>
      <!-- 列表 -->
      <el-row style="margin: 0px 20px 20px 20px;background-color: #FFF;">
        <el-row>
          <el-row style="margin:0 auto;text-align: center; align-content: center">
            <el-col :span="24" style="line-height: 50px;font-size: 16px;font-weight: bold;color: #666;text-align: center ">
              {{month}}月评价详细信息表
            </el-col>
          </el-row>
          <el-table border :data="list" style="width:85%"
                    :header-cell-style="this.CellStyleOne" :cell-style="this.CellStyleOne"
                    @filter-change="filterMethod"
                    @sort-change="changeSort">
            <el-table-column prop="name" label="评价人"
                             sortable="custom" min-width="10%">
            </el-table-column>

            <el-table-column prop="technology" label="专业" min-width="15%"
                             column-key="technology"
                             :filters="technologyList">
            </el-table-column>
            <el-table-column prop="department" label="部门" min-width="35%"
                             column-key="department"
                             :filters="departmentList">
            </el-table-column>
            <el-table-column prop="designer" label="质量得分" min-width="10%">
            </el-table-column>
            <el-table-column prop="personal" label="进度得分" min-width="10%">
            </el-table-column>
            <el-table-column prop="coordinate" label="配合得分" min-width="10%">
            </el-table-column>





          </el-table>
        </el-row>
      </el-row>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "tecDetails",
  data() {
    return {
      id: "",
      month: new Date().getMonth() + 1,
      search1: "",
      search2: "",
      search3: "",
      search4: "",
      search5: "",
      pageIndex: 1,
      pageSize: 10,
      list: [],
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
      this.search3 = "";
      this.search4 = "";
      this.search5 = "";
      this.pageIndex = 1;
      this.getData();
    },
    getLogIn() {
      let i = JSON.parse(sessionStorage.getItem("appraise"));
      this.id = i.id;
      this.getData();
      this.getOtherData();
    },
    getData() {
      this.$axios
        .post(this.$baseUrl + 'tecScore/query', {
          "id": this.id,
          "selectName" : this.selectName,
          "selectType" : this.selectType,
          "tIds": this.queryByt,
          "dIds" : this.queryByd
        })
        .then(res => (this.list = res.data.data))
        .catch(res => (console.log(res)));
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
      console.log(v.prop)
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
