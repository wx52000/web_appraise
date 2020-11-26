<template>
  <div id="main" align="center">
    <el-row>
      <!-- 列表 -->
      <el-row style="margin: 0 20px 20px 20px;background-color: #FFF;">
        <el-row>
          <el-row style="margin:0 auto;text-align: center; align-content: center">
            <el-col :span="18" style="line-height: 50px;font-size: 16px;font-weight: bold;color: #666;text-align: center ">
              <span style="margin-left: 33%">{{month}}月个人评价汇总表</span>
              <i v-if="pid==1" class="el-icon-document-copy" @click="downExcel"></i>
            </el-col>
            <el-col :span="6">
              <template>
                <el-select v-model="month" placeholder="请选择" @change="selectData"
                           style="width: 60%;margin-top: 10px" size="mini">
                  <el-option
                    v-for="item in listMonth"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    <span style="float: left">{{ item.label }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.value }}月</span>
                  </el-option>
                </el-select>
              </template>
            </el-col>
          </el-row>
          <div>
          <el-table border ref="table1" :data="list" style="width:85%"
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
      nowDay: new Date().getDate(),
      month: new Date().getMonth() + 1,
      listMonth : [],
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
    if (this.nowDay < this.startDay)
      this.month = --this.month;
    this.setListMonth();
    this.getLogIn();
  },
  methods: {
    search() {
      this.getData();
    },
    reset() {

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
          "dIds" : this.queryByd,
          "thisMonth"  : this.month
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
      window.location.href = this.$baseUrl + 'userScore/personExcel?id=' + this.id + "&month=" + this.month;
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
        else if (obj === "department"){
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
    setListMonth(){
      let MonthData1 = { value : this.month , label : "本月"};
      let MonthData2 = {};
      let MonthData3 = {};
      if (this.month === 1){
        MonthData2 = {value : 12 , label : "上月"}
        MonthData3 = {value : 11 , label : "上上月"}
      }else if (this.month === 2){
        MonthData2 = {value : 1 , label : "上月"}
        MonthData3 = {value : 12 , label : "上上月"}
      }else {
        MonthData2 = {value : this.month-1 , label : "上月"}
        MonthData3 = {value : this.month-2 , label : "上上月"}
      }
      this.listMonth.push(MonthData1);
      this.listMonth.push(MonthData2);
      this.listMonth.push(MonthData3);
    },
    selectData(){
      this.selectName = "";
      this.selectType =  "";
      this.queryByd = null;
      this.queryByt = null;
      this.$refs.table1.clearFilter()
      this.getData()
    }

  }
}
</script>

<style scoped>

</style>
