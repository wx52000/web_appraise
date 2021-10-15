<template>
  <div id="main" align="center">
    <el-row>
      <!-- 列表 -->
      <el-row style="margin: 0 20px 20px 20px;background-color: #FFF;">
        <el-row>
          <el-row style="margin:0 auto;text-align: center; align-content: center">
            <el-col :span="18" style="line-height: 50px;font-size: 16px;font-weight: bold;color: #666;text-align: center ">
              <span style="margin-left: 33%">第{{quarter}}季度个人评价汇总表</span>
              <i v-if="pid==1" class="el-icon-document-copy" @click="downExcel"></i>
            </el-col>
            <el-col :span="6">
              <template>
                <el-select v-model="quarterNumber" placeholder="请选择" @change="selectData"
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
                    @sort-change="changeSort">

            <el-table-column prop="name" label="姓名" sortable="custom">
            </el-table-column>
            <el-table-column prop="technology" label="专业"
                             column-key="technology"
                             :filters="technologyList"
                             :filter-method="filterMethod">
            </el-table-column>
            <el-table-column prop="department" label="部门"
                             column-key="department"
                             :filters="departmentList"
                             :filter-method="filterMethod">
            </el-table-column>
            <el-table-column prop="score" label="平均评分">
            </el-table-column>


          </el-table>
          </div>
        </el-row>
      </el-row>
    </el-row>
    <news-dialog class="news" :is-show="isShow" @click.native="isShow = !isShow">
    </news-dialog>
  </div>
</template>

<script>
export default {
name: "Score",
  data() {
    return {
      id: "",
      pid: "",
      isShow : false,
      quarter:"",
      quarterNumber : "",
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
    let quarter = ["一","二","三","四"]
    let quarterNumber = [3, 6, 9, 12 ]
    if (this.month%3 === 0){
      if (this.nowDay>=25){
        this.quarter = quarter[Math.floor(this.month/3)]
        this.quarterNumber = quarterNumber[Math.floor(this.month/3)]
      }else{
        if (this.month === 3){
          this.quarter = "四"
          this.quarterNumber = 12
        }else {
          this.quarter = quarter[Math.floor(this.month / 3) - 1]
          this.quarterNumber = quarterNumber[Math.floor(this.month / 3) - 1]
        }
      }
    }else{
      if (this.month<3){
        this.quarter = "四"
        this.quarterNumber = 12
      }
      this.quarter = quarter[Math.floor(this.month/3)-1]
      this.quarterNumber = quarterNumber[Math.floor(this.month/3)-1]
    }
    this.setListMonth();
    this.getData()
  },
  methods: {
    reset() {

      this.pageIndex = 1;
      this.getData();
    },
    getData() {
      this.$axios
        .post(this.$baseUrl + 'userScore/queryScore', {
          "id": this.id,
          "selectName" : this.selectName,
          "selectType" : this.selectType,
          "tIds": this.queryByt,
          "dIds" : this.queryByd,
          "thisMonth"  : this.quarterNumber
        })
        .then(res => {this.list = res.data.data;
          this.list.forEach((item,index)=>{
            this.departmentList.push2({value:item.department,text:item.department})
            this.technologyList.push2({value:item.technology,text:item.technology})
          })
        })
        .catch(res => (console.log(res)));
      this.loading = false;
    },
    downExcel() {
      this.$message.success("即将开始下载");
      window.location.href = this.$baseUrl + 'userScore/personExcel?id=' + this.id + "&month=" + this.quarterNumber;
    },
    filterMethod(value, row, column){
      const property = column['property'];
      return row[property] === value;
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
      let MonthData1 = { value : this.quarterNumber, label : "本季度"};
      let MonthData2 = {};
      let MonthData3 = {};
      if (this.quarterNumber >= 9){
        MonthData2 = {value : this.quarterNumber-3 , label : "上季度"}
        MonthData3 = {value : this.quarterNumber-6 , label : "上上季度"}
      }else if (this.quarterNumber === 6){
        MonthData2 = {value : 3 , label : "上季度"}
        MonthData3 = {value : 12 , label : "上上季度"}
      }else if (this.quarterNumber === 3){
        MonthData2 = {value : 12 , label : "上季度"}
        MonthData3 = {value : 9 , label : "上上季度"}
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
      this.list = [];
      this.getData()
    }

  }
}
</script>

<style scoped>

</style>
