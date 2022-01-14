<template>
  <div id="main" align="center">
    <el-row>
      <!-- 列表 -->
      <el-row style="margin: 0 20px 20px 20px;background-color: #FFF;">
        <el-row>
            <el-row style="margin:0 auto;text-align: center; align-content: center">
              <el-col :span="18" style="line-height: 50px;font-size: 16px;font-weight: bold;color: #666;text-align: center ">
                <span style="margin-left: 33%">第{{quarter}}季度专业评价汇总表</span>
                <i v-if="pid==1" class="el-icon-document-copy" @click="downExcel"></i>
              </el-col>
              <el-col :span="6">
                <template>
                  <el-select v-model="quarterNumber" placeholder="请选择" @change="getData"
                             style="width: 40%;margin-top: 10px" size="mini">
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
          <u-table use-virtual :row-height="50" border  :data="list"
                    :header-cell-style="this.CellStyleOne" :cell-style="this.CellStyleOne"
          size = "mini">

            <u-table-column prop="department" label="部门">
            </u-table-column>
            <u-table-column prop="technology" label="专业">
            </u-table-column>
            <u-table-column prop="score" label="平均评分">
            </u-table-column>


          </u-table>
        </el-row>
      </el-row>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "TecScore",
  data() {
    return {
      id: "",
      pid: "",
      quarter:"",
      isShow : false,
      quarterNumber : "",
      nowDay: new Date().getDate(),
      month: new Date().getMonth() + 1,
      listMonth : [],
      pageIndex: 1,
      pageSize: 10,
      list: []

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
    this.getData();
  },
  methods: {
    reset() {
      this.pageIndex = 1;
      this.getData();
    },
    getData() {
      this.$axios
        .post(this.$baseUrl + 'tecScore/queryScore', {
          "id" : this.id,
          "thisMonth"  : this.quarterNumber
        },)
        .then(res => (this.list = res.data.data))
        .catch(res => (console.log(res)));
    },
    downExcel() {
      this.$message.success("即将开始下载");
      window.location.href = this.$baseUrl + 'tecScore/excel?id=' + this.id +"&month=" + this.quarterNumber;
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


  }

}
</script>

<style scoped>

</style>
