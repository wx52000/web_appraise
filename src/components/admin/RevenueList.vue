<template>
<div>
  <el-row style="background-color: #FFF; text-align: center">
    <el-row style="text-align: center; align-content: center;">
      <el-col :span="24" style="line-height: 50px;font-size: 16px;font-weight: bold;color: #666;text-align: center ">
        营业收入
      </el-col>
    </el-row>
  </el-row>
  <el-row >
    <el-col >编号/名称
      <el-input v-model="search"
                size="mini" style="width: 50%" ></el-input></el-col>
  </el-row>
  <ux-grid ref="userTable" use-virtual border :data="list.filter(data =>{
            return  !search || (data.code != null && data.code.toLowerCase().includes(search.toLowerCase()))
            || (data.name != null && data.name.toLowerCase().includes(search.toLowerCase()))})" class="ux-table"
           :max-height=pageHeight
           :row-style="incomeCompareToToValue"
           size = "mini" :cell-style="this.CellStyleOne">
    <ux-table-column
      type="index"
      align="center"
      width="50">
    </ux-table-column>
    <ux-table-column field="code" width="120px" fixed sortable title="编号" align="center"  >
    </ux-table-column>
    <ux-table-column field="name" width="180px" fixed sortable title="名称" align="center"  >
    </ux-table-column>
    <ux-table-column field="money" width="100px" fixed title="总营收"
                     :filters="depList" :filter-method="filterHandler" align="center"  >
    </ux-table-column>
    <ux-table-column field="depMoney" width="100px" fixed title="发电营收"
                     :filters="tecList" :filter-method="filterHandler" align="center"  >
    </ux-table-column>
    <ux-table-column field="moneyRatio"  min-width="120px" sortable title="营收比例(%)" align="center">
    </ux-table-column>
    <ux-table-column field="value"  min-width="100px" sortable title="总产值" align="center"  >
    </ux-table-column>
    <ux-table-column field="depValue" min-width="100px" sortable title="发电产值" align="center" style="word-break: break-all;">
    </ux-table-column>
    <ux-table-column field="valueRatio" min-width="120px" sortable title="产值比例(%)" align="center">
    </ux-table-column>
    <ux-table-column field="contractValue" min-width="100px" sortable title="合同金额" align="center">
    </ux-table-column>
    <ux-table-column field="contractValueEstimate" min-width="120px" sortable title="合同预计金额" align="center">
    </ux-table-column>
    <ux-table-column  width="180px" align="center"  fixed="right">
      <template slot-scope="scope">
        <el-row>
          <el-button
            size="mini"
            @click="openIncome(scope.row)">营收主页</el-button>
        </el-row>
      </template>
    </ux-table-column>
  </ux-grid>
</div>
</template>

<script>
export default {
name: "RevenueList",
  data(){
  return {
    pageHeight: document.body.clientHeight,
    list : [],
    search : "",
    }
  },
  mounted() {
  this.getData()
  },
  methods:{
    getData() {
      this.$axios
        .post(this.$baseUrl + 'income/query',)
        .then(res => {this.list = res.data.data;})
        .catch(res => (console.log(res)));
    },
    incomeCompareToToValue({row, rowIndex}) {
      // console.log("rowStyle")
      // console.log(row)
      if (row.depMoney !== row.depValue ) {
        let rowBackground = {};
        rowBackground.color = "#FF0000";
        return rowBackground
      }
    },
    openIncome(row){
      let href =
        "http://zmis.zepdi.com.cn/Portal/Sys/Workflow/FormDetail.aspx?actionType=1&formId=229&actInstId=" +
        row.activity_instance_id +
        "&wfInstId=" +
        row.process_instance_id
      window.open( href,row.id)
    }
  }
}
</script>

<style scoped>

</style>
