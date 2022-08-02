<template>
<div>
  <el-row style="margin:0 auto;text-align: center; align-content: center">
    <el-col :span="24" style="line-height: 50px;font-size: 16px;font-weight: bold;color: #666;text-align: center ">
      角色任务表
    </el-col>
  </el-row>
  <el-row >
    <el-col >姓名/工号
      <el-input v-model="search"
                size="mini" style="width: 50%" ></el-input></el-col>
  </el-row>
  <u-table use-virtual :row-height="28" border size="mini" :data="list.filter(data =>{
            return  !search || (data.username.toLowerCase().includes(search.toLowerCase())
            || data.name.toLowerCase().includes(search.toLowerCase()))})"
           class="u-table"
           :height="pageHeight"
           showBodyOverflow="title"
           showHeaderOverflow="title"
           :data-changes-scroll-top="false"
           :header-cell-style="{background:'#F5F5F5'}" :cell-style="this.CellStyleOne">
    <u-table-column
      type="index"
      align="center"
      width="50">
    </u-table-column>
    <u-table-column prop="username" sortable width="90px" show-overflow-tooltip label="工号" align="center"  >
    </u-table-column>
    <u-table-column prop="name" sortable width="90px" show-overflow-tooltip label="姓名" align="center">
    </u-table-column>
    <u-table-column prop="dep" sortable width="180px" label="部门"  align="center">
    </u-table-column>
    <u-table-column prop="tec" sortable width="120px" label="专业"  align="center">
    </u-table-column>
    <u-table-column prop="general" sortable min-width="90px" label="作为设总"  align="center">
      <template slot-scope="scope">
        <el-button
          size="mini" type="text"
          @click="getGeneral(scope.row)">{{scope.row.general}}</el-button>
      </template>
    </u-table-column>
    <u-table-column prop="principal" sortable min-width="90px" label="作为主设" align="center"
                    style="word-break: break-all;">
      <template slot-scope="scope">
        <el-button
          size="mini" type="text"
          @click="getPrincipal(scope.row)">{{scope.row.principal}}</el-button>
      </template>
    </u-table-column>
    <u-table-column prop="headman" sortable min-width="90px" label="作为组长"  align="center">
      <template slot-scope="scope">
        <el-button
          size="mini" type="text"
          @click="getHeadman(scope.row)">{{scope.row.headman}}</el-button>
      </template>
    </u-table-column>
    <u-table-column prop="checker" sortable min-width="90px" label="作为校核"  align="center">
      <template slot-scope="scope">
        <el-button
          size="mini" type="text"
          @click="getChecker(scope.row)">{{scope.row.checker}}</el-button>
      </template>
    </u-table-column>
    <u-table-column prop="designer" sortable min-width="90px" label="作为设计" align="center"
                    style="word-break: break-all;">
      <template slot-scope="scope">
        <el-button
          size="mini" type="text"
          @click="getDesigner(scope.row)">{{scope.row.designer}}</el-button>
      </template>
    </u-table-column>
  </u-table>
  <el-dialog
    :title="title"
    v-el-drag-dialog
    :visible.sync="dialogVisible"
    width="68%">
    <u-table use-virtual :row-height="28" border size="mini" :data="listData"
             class="u-table"
             :height="pageHeight"
             showBodyOverflow="title"
             showHeaderOverflow="title"
             :data-changes-scroll-top="false"
             :header-cell-style="{background:'#F5F5F5'}" :cell-style="this.CellStyleOne">
      <u-table-column prop="number" sortable min-width="100px" show-overflow-tooltip label="工号" align="center"  >
      </u-table-column>
      <u-table-column prop="name" sortable min-width="180px" show-overflow-tooltip label="姓名" align="center">
      </u-table-column>
      <u-table-column v-if="tableState" prop="tec" sortable width="180px" label="专业"  align="center">
      </u-table-column>
      <u-table-column prop="workday" sortable width="100px" label="总工时"  align="center">
      </u-table-column>
      <u-table-column prop="used" sortable width="100px" label="已用工时"  align="center">
      </u-table-column>
      <u-table-column prop="have" sortable width="100px" label="剩余工时" align="center"
                      style="word-break: break-all;">
      </u-table-column>
    </u-table>
  </el-dialog>
  <el-dialog
    :title="title"
    v-el-drag-dialog
    :visible.sync="visible"
    width="68%">
    <u-table use-virtual :row-height="28" border size="mini" :data="listData"
             class="u-table"
             :height="pageHeight"
             showBodyOverflow="title"
             showHeaderOverflow="title"
             :data-changes-scroll-top="false"
             :header-cell-style="{background:'#F5F5F5'}" :cell-style="this.CellStyleOne">
      <u-table-column prop="pNumber" sortable min-width="100px" show-overflow-tooltip label="项目号" align="center"  >
      </u-table-column>
      <u-table-column prop="pName" sortable min-width="180px" show-overflow-tooltip label="项目名称" align="center">
      </u-table-column>
      <u-table-column prop="number" sortable min-width="100px" show-overflow-tooltip label="卷册号" align="center"  >
      </u-table-column>
      <u-table-column prop="name" sortable min-width="180px" show-overflow-tooltip label="卷册名" align="center">
      </u-table-column>
      <u-table-column prop="workday" sortable width="100px" label="工时"  align="center">
      </u-table-column>
      <u-table-column prop="state" sortable width="100px" label="设计状态"  align="center">
      </u-table-column>
      <u-table-column prop="start_date" sortable width="100px" label="开始时间"  align="center">
      </u-table-column>
      <u-table-column prop="planned_publication_date" sortable width="100px" label="计划出版时间"  align="center">
      </u-table-column>
      <u-table-column prop="general" sortable width="100px" label="设总"  align="center">
      </u-table-column>
      <u-table-column prop="principal" sortable width="100px" label="主设"  align="center">
      </u-table-column>
      <u-table-column prop="designer" sortable width="100px" label="设计"  align="center">
      </u-table-column>
      <u-table-column prop="checker" sortable width="100px" label="校核"  align="center">
      </u-table-column>
    </u-table>
  </el-dialog>
</div>
</template>

<script>
export default {
name: "ProjectRole",
  data(){
  return{
    list : [],
    pageHeight : document.body.scrollHeight,
    search : "",
    listData : [],
    dialogVisible : false,
    visible : false,
    tableState : false,
    title: "",
  }
  },
  mounted() {
  this.getData()
  },
  methods:{
    getData(){
      this.$axios
        .post(this.$baseUrl + 'user/manageProjectRole'
        )
        .then(res => {
          this.list = res.data.data
        })
        .catch(res => (console.log(res)));
    },
    getGeneral(row){
      this.title="设总任务"
      this.listData = []
      this.tableState = false
      this.$axios
        .post(this.$baseUrl + 'user/projectGeneral',{},{headers :{ id : row.id}}
        )
        .then(res => {
          this.listData = res.data.data
          this.dialogVisible = true
        })
        .catch(res => (console.log(res)));
    },
    getPrincipal(row){
      this.title="主设任务"
      this.listData = []
      this.tableState = true
      this.$axios
        .post(this.$baseUrl + 'user/projectPrincipal',{},{headers :{ id : row.id}}
        )
        .then(res => {
          this.listData = res.data.data
          this.dialogVisible = true
        })
        .catch(res => (console.log(res)));
    },
    getHeadman(row){
      this.title="组长校核任务"
      this.listData = []
      this.tableState = true
      this.$axios
        .post(this.$baseUrl + 'user/volumeHeadman',{},{headers :{ id : row.id}}
        )
        .then(res => {
          this.listData = res.data.data
          this.visible = true
        })
        .catch(res => (console.log(res)));
    },
    getChecker(row){
      this.title="校核任务"
      this.listData = []
      this.tableState = true
      this.$axios
        .post(this.$baseUrl + 'user/volumeChecker',{},{headers :{ id : row.id}}
        )
        .then(res => {
          this.listData = res.data.data
          this.visible = true
        })
        .catch(res => (console.log(res)));
    },
    getDesigner(row){
      this.title="设计任务"
      this.listData = []
      this.tableState = true
      this.$axios
        .post(this.$baseUrl + 'user/volumeDesigner',{},{headers :{ id : row.id}}
        )
        .then(res => {
          this.listData = res.data.data
          this.visible = true
        })
        .catch(res => (console.log(res)));
    }
  }
}
</script>

<style scoped>

</style>
