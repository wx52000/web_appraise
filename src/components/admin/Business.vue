<template>
<div>
  <el-row style="background-color: #FFF; text-align: center">
      <el-row style="margin-left:-10px;text-align: center; align-content: center;">
        <el-col :span="24" style="line-height: 50px;font-size: 16px;font-weight: bold;color: #666;text-align: center ">
          初设前期项目管理
<!--          <i class="el-icon-document-copy" @click="excelDialog = true"></i>-->
        </el-col>
      </el-row>
  </el-row>
  <el-row style="margin-left:-10px; align-content: center;">
    <el-col  align="right">
      <el-button style="margin-right: 50px"  type="primary" @click="openNewActivity">新增项目</el-button>
    </el-col>
  </el-row>
  <el-table border :data="list" class="el-table"
            :row-class-name="tableRowClassName"
            :header-cell-style="{background:'#F5F5F5'}">
    <el-table-column prop="name" min-width="16%" label="活动名称" align="center">
    </el-table-column>
    <el-table-column prop="general" min-width="8" label="总负责人" align="center" style="word-break: break-all;">
    </el-table-column>
    <el-table-column prop="workday" min-width="8" label="总工时" align="center" style="word-break: break-all;">
    </el-table-column>
    <el-table-column prop="start_date" min-width="8" label="开始时间" align="center" style="word-break: break-all;">
    </el-table-column>
    <el-table-column prop="end_date" min-width="8" label="结束时间" align="center" style="word-break: break-all;">
    </el-table-column>
    <el-table-column prop="createUser" min-width="8" label="创建人" align="center" style="word-break: break-all;">
    </el-table-column>
    <el-table-column prop="createDate" min-width="8" label="创建时间" align="center" style="word-break: break-all;">
    </el-table-column>
    <el-table-column  min-width="20%" align="center">
      <template slot-scope="scope">
        <el-row>
          <el-col :span="12">
            <el-button
              size="mini"
              @click="openProject(scope.row)">活动管理</el-button>
          </el-col>
        </el-row>
      </template>
    </el-table-column>
  </el-table>

  <news-dialog class="news" :is-show="isShow" @click.native="isShow = !isShow">
  </news-dialog>
</div>
</template>

<script>
import treeTransfer  from 'el-tree-transfer'
export default {
name: "Business",
  data(){
    return{
      id: "",
      pid: "",
      tid : "",
      isShow : false,
      list : [],

    }
  },
  components:{
  treeTransfer
  },
  mounted() {
  this.getLogIn();
  },
  methods:{
    getLogIn() {
      let i = JSON.parse(sessionStorage.getItem("appraise"));
      this.id = i.id;
      this.pid = i.pid;
      this.tid = i.tid;
      this.getData();
    },
    getData(){
      this.$axios
      .post(this.$baseUrl + 'activity/query')
      .then(res => {this.list = res.data.data
      })
      .catch(res => (console.log(res.data)))
    },
    tableRowClassName({row, rowIndex}) {
      //把每一行的索引放进row
      row.index = rowIndex;
    },
    openNewActivity(){
      const href = this.$router.resolve(
        {
          path: "/virtualManage",
          name: "virtualManage",
          query:{
            "id" : 0,
          }
        }
      )
      window.open( href.href)
    },
    openProject(row){
      const href = this.$router.resolve(
        {
          path: "/businessManage",
          name: "businessManage",
          query:{
            "id" : row.id,
          }
        }
      )
      window.open( href.href,row.id)
    },
  }
}
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
