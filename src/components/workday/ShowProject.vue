<template>
  <div>
    <div>
      <el-row style="text-align: center; align-content: center;margin-top: 1%">
        <el-col :span="18">
          人员:<el-select v-model="name" size="mini"
                        :filterable="true"  :remote="true"
                        :remote-method="remoteMethod"
                        :loading="nameLoading"
                       style="width: 20%;margin-left: 1%;margin-right: 15%"
                      placeholder="请输入人员姓名或工号">
                    <el-option
                    v-for="item in nameList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
        </el-option></el-select>
          卷册:<el-input v-model="volume" size="mini"
                        style="width: 20%;margin-left: 1%;" placeholder="请输入卷册名或卷册号">
        </el-input>
          <el-button  size="mini" style="margin-left: 15%"  type="primary" @click="getData">查询</el-button>
        </el-col>
      </el-row>
      <el-table border size="mini" :data="list" class="el-table" :header-cell-style="{background:'#F5F5F5'}"
                :default-sort = "{prop: 'date', order: 'descending'}"
      >
        <el-table-column prop="number" min-width="13%"  label="卷册号" sortable>
        </el-table-column>
        <el-table-column prop="name" min-width="20%" label="卷册名称" sortable>
        </el-table-column>
        <el-table-column prop="projectName" min-width="20%" label="项目名称"
                         :filters="queryProjectList" :filter-method="filterHandler1">
        </el-table-column>
        <el-table-column prop="state" min-width="9%"  label="状态" align="center"
                         :filters="[{text:'尚未开展',value:'尚未开展'},{text:'正在设计',value:'正在设计'},
                          {text:'正在校审',value:'正在校审'},{text:'代送出版',value:'代送出版'},
                          {text:'正在出版',value:'正在出版'},{text:'代送业主',value:'代送业主'},
                          {text:'已完成交付设总',value:'已完成交付设总'},{text:'已完成交付业主',value:'已完成交付业主'}]"
                         :filter-method="filterHandler1">
        </el-table-column>
        <el-table-column prop="general" min-width="11%" label="设总" sortable>
        </el-table-column>
        <el-table-column prop="principal" min-width="11%" label="主设人" sortable>
        </el-table-column>
        <el-table-column prop="designer" min-width="11%" label="设计人" sortable>
        </el-table-column>
        <el-table-column prop="checker" min-width="11%" label="互校人" sortable >
        </el-table-column>
        <el-table-column
          align="center"  min-width="13%" >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="openVolume(formId = scope.row.rollId)">卷册详情页面</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="项目管理"
      :visible.sync="projectVisible"
      width="90%"
    >
      <el-table border :data="list" class="el-table"
                :header-cell-style="{background:'#F5F5F5' } "
                :row-class-name="tableRowClassName"
                :default-sort = "{prop: 'date', order: 'descending'}"
      >
        <el-table-column prop="number" min-width="13  %" label="项目号" sortable align="center"  >
        </el-table-column>
        <el-table-column prop="projectName" min-width="24" label="项目名称" sortable align="center" style="word-break: break-all;">
        </el-table-column>
      </el-table>
    </el-dialog>
    <news-dialog class="news" :is-show="isShow" @click.native="isShow = !isShow">
    </news-dialog>
  </div>
</template>

<script>
export default {
name: "ShowProject",
  data(){
  return{
    isShow : false,
    list: [],
    projectVisible:false,
    name:"",
    volume:"",
    nameList:[],
    projectList:[],
    nameLoading:true,
    queryProjectList : [],
    }
  },
  mounted() {
  },
  methods:{
    getData() {
      this.$axios
        .post(this.$baseUrl + 'volume/query', {
          "user" : this.name,
          "volume" : this.volume}
        )
        .then(res => {
          this.list = res.data.data
          this.list.forEach((item,index) =>{
            this.queryProjectList.push2({value:item.projectName,text:item.projectName})
          })
        })
        .catch(res => (console.log(res)));
    },
    tableRowClassName({row, rowIndex}) {
      //把每一行的索引放进row
      row.index = rowIndex;
    },
    remoteMethod(query) {
      if (query !== '') {
        this.nameLoading = true;
        setTimeout(() => {
          this.$axios
            .post(this.$baseUrl + 'user/queryByName', {
                "name" : query
              }
            )
            .then(res => {
              if (res.data.data != null) {
                this.nameList = res.data.data
              }
            });
          this.nameLoading = false;
        }, 200);
      } else {
        this.nameList = [];
      }
    },
    openVolume(f){
      // window.open('http://zmis.zepdi.com.cn/Portal/Sys/Workflow/FormDetail.aspx?actionType=1&formId=' + f +
      window.open('http://zmis.zepdi.com.cn/Portal/EPMS/List/RollInfo/ContentMange.aspx?actionType=1&RollID=' + f)
    },
    filterHandler1(value, row, column){
      const property = column['property'];
      return row[property] === value;
    },
  }
}
</script>

<style scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 130px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.el-table {
  margin-top:20px;
  width: 90% ;
  horiz-align: center;
  left: 5%;
  font-size: 12px;
  word-wrap: break-word;
}
</style>
