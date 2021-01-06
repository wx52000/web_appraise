<template>
  <div id="main" align="center">
    <el-row>
      <!-- 列表 -->
      <el-row style="margin: 0 20px 20px 20px;background-color: #FFF;">
        <el-row>
            <el-row style="margin:0 auto;text-align: center; align-content: center">
              <el-col :span="18" style="line-height: 50px;font-size: 16px;font-weight: bold;color: #666;text-align: center ">
                <span style="margin-left: 33%">{{month}}月专业评价汇总表</span>
                <i v-if="pid==1" class="el-icon-document-copy" @click="downExcel"></i>
              </el-col>
              <el-col :span="6">
                <template>
                  <el-select v-model="month" placeholder="请选择" @change="getData"
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
          <el-table border :data="list" style="width:85%"
                    :header-cell-style="this.CellStyleOne" :cell-style="this.CellStyleOne">

            <el-table-column prop="department" label="部门">
            </el-table-column>
            <el-table-column prop="technology" label="专业">
            </el-table-column>
            <el-table-column prop="score" label="平均评分">
            </el-table-column>


          </el-table>
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
      nowDay: new Date().getDate(),
      month: new Date().getMonth() + 1,
      listMonth : [],
      pageIndex: 1,
      pageSize: 10,
      list: []

    }
  },
  mounted() {
    if (this.nowDay < this.startDay) {
      if (this.month === 1) {
        this.month = 12
      } else {
        this.month = --this.month;
      }
    }
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
      this.pid = i.pid
      this.getData();
    },
    getData() {
      this.$axios
        .post(this.$baseUrl + 'tecScore/queryScore', {
          "id" : this.id,
          "thisMonth"  : this.month
        },)
        .then(res => (this.list = res.data.data))
        .catch(res => (console.log(res)));
    },
    downExcel() {
      this.$message.success("即将开始下载");
      window.location.href = this.$baseUrl + 'tecScore/excel?id=' + this.id +"&month=" + this.month;
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
    }


  }

}
</script>

<style scoped>

</style>
