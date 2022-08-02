<template>
<div>
  <el-row style="background-color: #FFF; text-align: center">
    <el-row style="text-align: center; align-content: center;">
      <el-col :span="24" style="line-height: 50px;font-size: 16px;font-weight: bold;color: #666;text-align: center ">
        <el-date-picker
          v-model="month"
          type="month"
          value-format="yyyy-MM"
          size="mini"
          style="width: 120px"
          @change="getData"
          placeholder="选择月">
        </el-date-picker>计划出图
      </el-col>
    </el-row>
  </el-row>
  <u-table use-virtual :row-height="28" border :data="list" class="u-table"
           :height="pageHeight"
           size="mini"
           :default-sort = "{prop: 'date', order: 'descending'}"
           v-loading="loading">
    <u-table-column
      type="index"
      fixed
      align="center"
      width="50">
    </u-table-column>
    <u-table-column prop="pnumber" fixed width="200px" label="项目编号" sortable align="center"  >
    </u-table-column>
    <u-table-column prop="pname" :filters="projectList" :filter-method="filterHandler"
                    width="200px" label="项目名称" align="center" style="word-break: break-all;">
    </u-table-column>
    <u-table-column prop="number" width="200px" label="卷册号" sortable align="center"  >
    </u-table-column>
    <u-table-column prop="name" width="200px" label="卷册名称" sortable align="center" style="word-break: break-all;">
    </u-table-column>
    <u-table-column prop="tec" label="专业" width="160px" align="center"
                    :filters="tecList" :filter-method="filterHandler">
    </u-table-column>
    <u-table-column prop="designer" width="80px" label="设计" sortable align="center" style="word-break: break-all;">
    </u-table-column>
    <u-table-column prop="checker" width="80px" label="校核" sortable align="center" style="word-break: break-all;">
    </u-table-column>
    <u-table-column prop="principal" width="80px" label="主设" sortable align="center" style="word-break: break-all;">
    </u-table-column>
    <u-table-column prop="headman" width="80px" label="组长" sortable align="center" style="word-break: break-all;">
    </u-table-column>
    <u-table-column prop="planned_publication_date" width="120px" label="计划出版时间" sortable align="center" style="word-break: break-all;">
    </u-table-column>
    <u-table-column prop="actual_publication_date" width="120px" label="实际出版时间" sortable align="center" style="word-break: break-all;">
    </u-table-column>
    <u-table-column prop="state" width="100px"  label="状态" align="center"
                    :filters="[{text:'尚未开展',value:'尚未开展'},{text:'正在设计',value:'正在设计'},
                          {text:'正在校审',value:'正在校审'},{text:'待送出版',value:'待送出版'},
                          {text:'正在出版',value:'正在出版'},{text:'待送业主',value:'待送业主'},
                          {text:'已完成',value:'已完成'},{text:'院交出',value:'院交出'}]"
                    :filter-method="filterHandler">
    </u-table-column>
  </u-table>
</div>
</template>

<script>
export default {
name: "PlannedPublicTask",
  data() {
  return{
    pageHeight : document.body.scrollHeight,
    loading : false,
    list : [],
    projectList : [],
    tecList : [],
    month : "",
  }
  },
  mounted() {
    let date = new Date()
    this.month = date.getFullYear() + "-" + (Number(date.getMonth()) +1).toString().padStart(2,0)
    this.getData();
  },
  methods:{
    getData(){
      this.tecList = [];
      this.projectList = [];
      this.$axios
        .post(this.$baseUrl + 'volume/queryPlannedPublic', {},{headers: {queryMonth : this.month}})
        .then(res => {
          if (res.data.data !== null) {
            this.list = res.data.data;
            this.list.forEach((item) => {
              this.projectList.push2({value: item.pname, text: item.pname})
              this.tecList.push2({value: item.tec, text: item.tec});
            })
            console.log(this.projectList)
          }
        })
        .catch(res => (console.log(res)));
    },
    filterHandler(value, row, column){
      const property = column['property'];
      return row[property] === value;
    },
  }

}
</script>

<style scoped>

</style>
