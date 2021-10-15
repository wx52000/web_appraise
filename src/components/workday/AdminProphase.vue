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
      <el-button style="margin-right: 50px"  type="primary" @click="openNewProject">新增项目</el-button>
    </el-col>
  </el-row>
  <u-table key="vList" use-virtual :row-height="30"
            border :data="vList" class="u-table"
           v-if="!type"
            :header-cell-style="{background:'#F5F5F5'}"
           :cell-style="this.CellStyleOne">
    <u-table-column prop="number" min-width="16%" label="项目编号" align="center"  >
    </u-table-column>
    <u-table-column prop="name" min-width="22%" label="项目名称" align="center">
    </u-table-column>
    <u-table-column prop="general" min-width="8" label="设总" align="center" style="word-break: break-all;">
    </u-table-column>
    <u-table-column prop="workday" min-width="8" label="总工时" align="center" style="word-break: break-all;">
    </u-table-column>
    <u-table-column prop="createUser" min-width="8" label="创建人" align="center" style="word-break: break-all;">
    </u-table-column>
    <u-table-column prop="createDate" min-width="8" label="创建时间" align="center" style="word-break: break-all;">
    </u-table-column>
    <u-table-column  min-width="20" align="center">
      <template slot="header">
        <el-switch
          v-model="type"
          active-text="业务建设"
          inactive-text="可研项目"
          @change="getData()">
        </el-switch>
      </template>
      <template slot-scope="scope">
        <el-row style="text-align: center">
            <el-button
              size="mini"
              @click="openProject(scope.row)">项目管理</el-button>
        </el-row>
      </template>
    </u-table-column>
  </u-table>
  <u-table key="bList" use-virtual :row-height="30"
            border :data="bList" class="u-table"
            v-if="type"
            :cell-style="this.CellStyleOne"
            :header-cell-style="{background:'#F5F5F5'}">
    <u-table-column prop="name" min-width="16%" label="活动名称" align="center">
    </u-table-column>
    <u-table-column prop="general" min-width="8" label="总负责人" align="center" style="word-break: break-all;">
    </u-table-column>
    <u-table-column prop="workday" min-width="8" label="总工时" align="center" style="word-break: break-all;">
    </u-table-column>
    <u-table-column prop="start_date" min-width="8" label="开始时间" align="center" style="word-break: break-all;">
    </u-table-column>
    <u-table-column prop="end_date" min-width="8" label="结束时间" align="center" style="word-break: break-all;">
    </u-table-column>
    <u-table-column prop="createUser" min-width="8" label="创建人" align="center" style="word-break: break-all;">
    </u-table-column>
    <u-table-column prop="createDate" min-width="8" label="创建时间" align="center" style="word-break: break-all;">
    </u-table-column>
    <u-table-column  min-width="20" align="center">
      <template slot="header">
        <el-switch
          v-model="type"
          active-text="业务建设"
          inactive-text="可研项目"
          @change="getData()">
        </el-switch>
      </template>
      <template slot-scope="scope">
        <el-row style="text-align: center">
            <el-button
              size="mini"
              @click="openProject(scope.row)">活动管理</el-button>
        </el-row>
      </template>
    </u-table-column>
  </u-table>
  <el-dialog
  :title=title
  :visible.sync="visible"
  width="60%" style="text-align: center"
  @close="closeDialog">
  <el-form :model="form" >
    <el-row>
      <el-row style="margin-right: 50px">
        <el-col :span="12">
          <el-form-item label-width="120px" :label=formLabel.number>
            <el-input :disabled="disabled" v-model="form.number" oninput="value=value.replace(/[^\d.]/g,'')"  >
            </el-input>
          </el-form-item >
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="120px" :label=formLabel.name>
            <el-input :disabled="disabled" v-model="form.name" oninput="value=value.replace(/[^\d.]/g,'')">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-right: 50px">
        <el-col :span="12">
          <el-form-item label-width="120px" :label= formLabel.general>
            <el-select v-model="form.general"
                       :filterable="true"  :remote="true"
                       :remote-method="remoteMethod"
                       multiple
                       value-key="id"
                       :loading="nameLoading"
                       @change="selectGeneral($event)"
                       placeholder="请输入人员姓名或工号">
              <el-option
                v-for="(item,index) in nameList"
                :key="item.id"
                :label="item.name"
                :value="item">
              </el-option></el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="120px" :label=formLabel.workday>
            <el-input v-model="form.workday" oninput="value=value.replace(/[^\d.]/g,'')">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label= "活动开始结束时间" style="margin-left: 15px" label-width="160px" v-if="formLabel.date">
      <template>
          <el-date-picker
            style="margin-left: -80px"
            v-model="form.date"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
      </template>
      </el-form-item>
      <el-row v-for="(item,index) in form.principal " style="margin-top: 5px" :key="index ">
        <el-col :span="12">
          {{formLabel.principal}}<el-select v-model="item.name" size="mini"
                     :filterable="true"  :remote="true"
                     :remote-method="remoteMethod"
                     :loading="nameLoading"
                     style="width: 50%"
                     placeholder="请输入人员姓名或工号"
                      @change="selectPrincipal($event,index)">
            <el-option
              v-for="item in nameList"
              :key="item.id"
              :label="item.name"
              :value="item">
            </el-option></el-select>
        </el-col>
        <el-col :span="12">
          可分配工时:<el-input type="type" size="mini" style="width: 50%" v-model="item.workday"></el-input>
          <el-button icon="el-icon-circle-plus-outline"
                     size="mini" circle @click="addItem(index)"></el-button>
          <el-button icon="el-icon-remove-outline"
                     size="mini" circle @click="removeItem(index)"></el-button>
        </el-col>
      </el-row>
      <el-form-item style="margin-left: -50px;text-align: center;margin-top: 20px">
        <el-button @click=" closeDialog ">取消</el-button>
        <el-button @click="dialogSubmit" type="primary">确认</el-button>
      </el-form-item>
    </el-row>
  </el-form>
</el-dialog>
</div>
</template>

<script>
export default {
name: "Virtual",
  data(){
    return{
      id: "",
      type : false,
      date : "",
      month : "",
      vList : [],
      bList : [],
      disabled : false,
      visible : false,
      title : "",
      nameLoading : false,
      nameList : [],
      formLabel : {},
      form : {
        number : "",
        name : "",
        workday : "",
        general : [],
        date : [],
        principal : [],
      }
  }
  },
  mounted() {
    let date = new Date();
    this.date = date.getFullYear() + "-" + (Number(date.getMonth()) + 1).toString().padStart(2,0) +"-" + date.getDate().toString().padStart(2,0);
    this.month = date.getFullYear() + "-" + (Number(date.getMonth()) + 1).toString().padStart(2,0);
    this.getData();
  },
  methods:{
    getData(){
      if (!this.type) {
        this.$axios
          .post(this.$baseUrl + 'virtual/query')
          .then(res => {
            this.vList = res.data.data
          })
          .catch(res => (console.log(res.data)))
      }else {
        this.$axios
          .post(this.$baseUrl + 'activity/query')
          .then(res => {this.bList = res.data.data
          })
          .catch(res => (console.log(res.data)))
      }
    },
    dialogSubmit(){
      this.form.createDate = this.date;
      this.$axios
        .post(this.$baseUrl + 'user/queryById'
        )
        .then(res => {
          this.form.createUser = res.data.data.name
          if (this.type){
            this.$axios
              .post(this.$baseUrl + 'activity/setActivity',this.form)
              .then(res => {
                if (res.data.code === 0){
                  this.closeDialog()
                }
              })
              .catch(res => (console.log(res.data)))
          }else {
            this.$axios
              .post(this.$baseUrl + 'virtual/setProject',this.form)
              .then(res => {
                if (res.data.code === 0){
                  this.closeDialog()
                }
              })
              .catch(res => (console.log(res.data)))
          }
        })
        .catch(res => (console.log(res)));
      console.log(this.form)
    },
    openProject(row){
      this.disabled = true;
      if (!this.type) {
        this.$axios
          .post(this.$baseUrl + 'virtual/queryById',{
            id : row.id,
            month : this.month
          })
          .then(res =>{
            this.form = res.data.data;
            this.form.month = this.month;
            res.data.data.general.forEach(item =>{
            this.nameList.push2(item)
            })
          })
          .catch(res => (console.log(res.data)))
      }else {
        this.$axios
          .post(this.$baseUrl + 'activity/queryById', {}, {headers : {id : row.id}})
          .then(res => {
            this.form = res.data.data
            res.data.data.general.forEach(item =>{
              this.nameList.push2(item)
            })
          })
          .catch(res => (console.log(res.data)))
      }
      this.openNewProject()
      this.visible = true;
    },
    openNewProject(){
        if (!this.type) {
          this.title = "新增可研项目"
          this.formLabel = {
            number : "项目编号",
            name : "项目名称",
            workday : "项目工时",
            general : "项目设总",
            principal : "项目主设人:",
            date : false,
          }
        }else {
          this.title = "新增业务建设"
          this.formLabel = {
            number : "活动编号",
            name : "活动名称",
            workday : "活动工时",
            general : "活动主管",
            principal : "活动管理员:",
            date : true,
          }
        }
        this.visible = true;
    },
    closeDialog(){
      this.disabled = false;
      this.formLabel = {};
      this.form  = {
        number : "",
        name : "",
        workday : "",
        general : [],
        date : [],
        principal : [],
        month : this.month,
      };
      this.visible = false;
      this.getData()
    },
    addItem(index){
      this.form.principal.push({name : "", workday : 0})
    },
    removeItem(index){
      this.form.principal.splice(index,1)
    },
    selectGeneral(val) {
      val.forEach(item => {
        this.form.principal.push2({id : item.id , name : item.name})
      })
    },
    selectPrincipal(val,index){
      this.form.principal[index].name = val.name;
      this.form.principal[index].id = val.id
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

.el-input.is-disabled /deep/ .el-input__inner {
  background-color: white;
  color: #000000;
}
</style>
