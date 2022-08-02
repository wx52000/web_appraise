<template>
<div>
  <el-row style="margin:0 auto;text-align: center; align-content: center">
    <el-col :span="24" style="line-height: 50px;font-size: 16px;font-weight: bold;color: #666;text-align: center ">
      审核角色管理
    </el-col>
  </el-row>
  <el-tabs type="card" @tab-click="clickTab">
    <el-tab-pane label="组长审核角色管理" >
      <el-row style="text-align: right">
        <el-button style="margin-right: 10%" size="mini" @click="">添加</el-button>
      </el-row>
      <u-table use-virtual :row-height="28" border size="mini" :data="list"
               class="u-table"
               :height="pageHeight"
               :header-cell-style="{background:'#F5F5F5'}" :cell-style="this.CellStyleOne">
        <u-table-column prop="name" sortable  show-overflow-tooltip label="姓名" align="center">
        </u-table-column>
        <u-table-column  label="操作"  align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="delChecker(scope.row, 0)">删除</el-button>
          </template>
        </u-table-column>
      </u-table>
    </el-tab-pane>
    <el-tab-pane label="主任审核角色管理">
      <el-row style="text-align: right">
        <el-button style="margin-right: 10%" size="mini" @click="">添加</el-button>
      </el-row>
      <u-table use-virtual :row-height="28" border size="mini" :data="list"
               class="u-table"
               :height="pageHeight"
               :header-cell-style="{background:'#F5F5F5'}" :cell-style="this.CellStyleOne">
        <u-table-column prop="name" sortable  show-overflow-tooltip label="姓名" align="center">
        </u-table-column>
        <u-table-column  label="操作"  align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="delChecker(scope.row, 1)">删除</el-button>
          </template>
        </u-table-column>
      </u-table>
    </el-tab-pane>
    <el-tab-pane label="主管审核角色管理">
      <u-table use-virtual :row-height="28" border size="mini" :data="list"
               class="u-table"
               :height="pageHeight"
               :header-cell-style="{background:'#F5F5F5'}" :cell-style="this.CellStyleOne">
        <u-table-column prop="name" sortable  show-overflow-tooltip label="姓名" align="center">
        </u-table-column>
        <u-table-column  label="操作"  align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="delChecker(scope.row,1)">删除</el-button>
          </template>
        </u-table-column>
      </u-table>
    </el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
export default {
name: "CheckerManage",
  data(){
  return{
    list :[],
    pageHeight : document.body.clientHeight,
    loading : false,
  }
  },
  mounted() {
  this.getData()
  },
  methods:{
    getData(){
      this.$axios
        .post(this.$baseUrl + 'project/getCheckerList',{},{headers : {type : 0}}
        )
        .then(res => {
          this.list = res.data.data
          this.loading = false
        })
        .catch(res => (console.log(res)));
    },
    clickTab(tab,event){
      this.loading = true
      this.list = []
      if (Number(tab.index)  === 0){
        this.$axios
          .post(this.$baseUrl + 'project/getCheckerList',{},{headers : {type : 0}}
          )
          .then(res => {
            this.list = res.data.data
            this.loading = false
          })
          .catch(res => (console.log(res)));
      }else if (Number(tab.index)  === 1){
        this.$axios
          .post(this.$baseUrl + 'project/getCheckerList',{},{headers : {type : 1}}
          )
          .then(res => {
            this.list = res.data.data
            this.loading = false
          })
          .catch(res => (console.log(res)));
      }else if (Number(tab.index) === 2){
        this.$axios
          .post(this.$baseUrl + 'project/getCheckerList',{},{headers : {type : 1}}
          )
          .then(res => {
            this.list = res.data.data
            this.loading = false
          })
          .catch(res => (console.log(res)));
      }
    },
    delChecker(row, type){
      this.$axios
        .post(this.$baseUrl + 'checker/del',{
          id : row.id,
          type : type
          })
        .then(res => {
          this.$message.success("操作成功")
          this.clickTab({index : type}, null)
        })
        .catch(res => (console.log(res)));
    }
  }
}
</script>

<style scoped>

</style>
