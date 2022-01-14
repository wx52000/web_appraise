<template>
  <div>
    <el-row style="margin:-15px auto;text-align: center; align-content: center;">
      <el-col :span="24"
              style="line-height: 50px;font-size: 16px;font-weight: bold;color: #666;text-align: center">
        发电工程公司综合系统
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        已评价人数：{{user1.length}}
      </el-col>
      <el-col :span="6">
        未评价人数：{{user2.length}}
      </el-col>
      <el-col :span="6">
        未被评价人数：{{user3.length}}
      </el-col>
      <el-col :span="6">
        专业未评价人数：{{user4.length}}
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" style="margin-top: 30px">
        <el-card class="box-card" style="width: 80%;margin-left: 10%;" body-style="height : 100px">
          <div slot="header">
            <span>已评价人员名单</span>
            <el-button style="float:right;margin-left: -20%"
                       type="text" @click="downExcel('已评价人员名单',1)">excel导出</el-button>
          </div>
          <div v-for="u in user1.slice(0,5)" :key="u.id" style="margin-top: -5px">
            {{u.name}}
          </div>
          <el-button style="position: absolute;bottom :5px;margin-left: -3%"
                     type="text" @click="openDialog(user1,'已评价人员名单',1)">查看更多</el-button>
        </el-card>
      </el-col>
      <el-col :span="12" style="margin-top: 30px">
        <el-card class="box-card" style="width: 80%;margin-left: 10%" body-style="height : 100px">
          <div slot="header" >
            <span>未评价人员名单</span>
            <el-button style="float:right;margin-left: -20%"
                       type="text" @click="downExcel('未评价人员名单',2)">excel导出</el-button>
          </div>
          <div v-for="u in user2.slice(0,5)" :key="u.id" style="margin-top: -5px">
            {{u.name}}
          </div>
          <el-button style="position: absolute;bottom :5px;margin-left: -3%"
                     type="text" @click="openDialog(user2,'未评价人员名单',2)">查看更多</el-button>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" style="margin-top: 30px">
        <el-card class="box-card" style="width: 80%;margin-left: 10%" body-style="height : 100px">
          <div slot="header">
            <span>未被评价人员名单</span>
            <el-button style="float:right;margin-left: -20%"
                       type="text" @click="downExcel('未被评价人员名单',3)">excel导出</el-button>
          </div>
          <div v-for="u in user3.slice(0,5)" :key="u.id" style="margin-top: -5px">
            {{u.name}}
          </div>
          <el-button style="position: absolute;bottom :5px;margin-left: -3%"
                     type="text" @click="openDialog(user3,'未被评价人员名单',3)">查看更多</el-button>
        </el-card>
      </el-col>
      <el-col :span="12" style="margin-top: 30px">
        <el-card class="box-card" style="width: 80%;margin-left: 10%" body-style="height : 100px">
          <div slot="header">
            <span>专业未评价人员名单</span>
            <el-button style="float:right;margin-left: -20%"
                       type="text" @click="downExcel('专业未评价人员名单',4)">excel导出</el-button>
          </div>
          <div v-for="u in user4.slice(0,5)" :key="u.id" style="margin-top: -5px">
            {{u.name}}
          </div>
          <el-button style="position: absolute;bottom :5px;margin-left: -3%"
                     type="text" @click="openDialog(user4,'专业未评价人员名单',4)">查看更多</el-button>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog :visible.sync="visible"
               width="60%"
               :title="dialogTitle"
               :before-close="closeDialog"
    >
      <template>
        <el-table
          :data="user"
          style="width: 100%"
          :header-cell-style="this.CellStyleOne" :cell-style="this.CellStyleOne"
          @filter-change="filterMethod"
          @sort-change="changeSort">
          <el-table-column
            prop="name"
            label="姓名"
            width="180"
            sortable="custom">
          </el-table-column>
          <el-table-column
            prop="username"
            label="工号"
            sortable="custom">
          </el-table-column>
          <el-table-column
            prop="department"
            label="部门"
            column-key="department"
            :filters="departmentList">
          </el-table-column>
          <el-table-column
            prop="technology"
            label="专业"
            column-key="technology"
            :filters="technologyList">
          </el-table-column>
        </el-table>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
name: "Main.vue",
  data(){
  return {
    login:false,
    id : "",
    name : "",
    user :[],
    user1 : [],
    user2 : [],
    user3 : [],
    user4 : [],
    visible : false,
    dialogIndex : "",
    dialogTitle : "",
    technologyList:[],
    departmentList:[],
    selectName: "",
    selectType: "",
    queryByd:null,
    queryByt:null
  }
  },
  mounted() {
    this.getData1()
    this.getData2()
    this.getData3()
    this.getData4()
  },
  methods: {
    getData1() {
      this.$axios
        .post(this.$baseUrl + 'user/queryAppraise', {
          "selectName" : this.selectName,
          "selectType" : this.selectType,
          "tIds": this.queryByt,
          "dIds" : this.queryByd
        })
        .then(res => {
          this.user1 = res.data.data
          if (this.dialogIndex !== '')
            this.user = this.user1
        })
        .catch(res => {
          console.error(res)
        })
    },
    getData2() {
      this.$axios
        .post(this.$baseUrl + 'user/queryNotAppraise', {
          "selectName" : this.selectName,
          "selectType" : this.selectType,
          "tIds": this.queryByt,
          "dIds" : this.queryByd
        })
        .then(res => {
          this.user2 = res.data.data
          if (this.dialogIndex !== '')
            this.user = this.user2
        })
        .catch(res => {
          console.error(res)
        })
    },
    getData3() {
      this.$axios
        .post(this.$baseUrl + 'user/queryNotScored', {
          "selectName" : this.selectName,
          "selectType" : this.selectType,
          "tIds": this.queryByt,
          "dIds" : this.queryByd
        })
        .then(res => {
          this.user3 = res.data.data
          if (this.dialogIndex !== '')
            this.user = this.user3
        })
        .catch(res => {
          console.error(res)
        })
    },
    getData4(){
      this.$axios
        .post(this.$baseUrl + 'user/queryNotTecApp',{
          "selectName" : this.selectName,
          "selectType" : this.selectType,
          "tIds": this.queryByt,
          "dIds" : this.queryByd
        })
        .then(res => {
          this.user4 = res.data.data
          if (this.dialogIndex !== '')
            this.user = this.user4
        })
        .catch(res => {console.error(res)})
    },
    openDialog(v,w,x){
      this.user = v;
      this.dialogTitle = w;
      this.visible = true;
      this.dialogIndex = x;
      this.user.forEach((item,index)=>{
        this.departmentList.push2({value:item.department,text:item.department})
        this.technologyList.push2({value:item.technology,text:item.technology})
      })
    },
    closeDialog(){
      this.user = [];
      this.dialogTitle = "";
      this.visible = false;
      if (this.dialogIndex === 1){
        this.getData1()
      }else if (this.dialogIndex === 2) {
        this.getData2()
      }else if(this.dialogIndex === 3){
        this.getData3()
      }else if (this.dialogIndex === 4){
        this.getData4()
      }
      this.technologyList = [];
      this.technologyList = [];
      this.dialogIndex = "";
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
        else {
          this.queryByt = null;
          if (filter.department.length !== 0) {
            this.queryByd = filter.department
          }else {
            this.queryByd = null
          }
        }
      }
      if (this.dialogIndex === 1){
        this.getData1()
      }else if (this.dialogIndex === 2) {
        this.getData2()
      }else if(this.dialogIndex === 3){
        this.getData3()
      }else if (this.dialogIndex === 4){
        this.getData4()
      }
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
      if (this.dialogIndex === 1){
        this.getData1()
      }else if (this.dialogIndex === 2) {
        this.getData2()
      }else if(this.dialogIndex === 3){
        this.getData3()
      }else if (this.dialogIndex === 4){
        this.getData4()
      }
    },
    downExcel(v, w) {
      this.$message.success("即将开始下载");
      window.location.href = this.$baseUrl + 'user/excel?name=' +v +'&type=' + w;
    },
  }
}
</script>

<style scoped>

</style>
