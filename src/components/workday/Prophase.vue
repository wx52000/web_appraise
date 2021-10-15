<template>
  <div>
    <el-table key="virtualList" use-virtual :row-height="30" border :data="virtualList" class="el-table"
              :max-height="pageHeight"
              :header-cell-style="{background:'#ece4a7',color:'#000000'}"
              size="mini" v-if="!type"
              :cell-style="this.CellStyleOne">
          <el-table-column prop="number"  label="项目编号" align="center"  >
          </el-table-column>
          <el-table-column prop="name"   label="项目名称" align="center">
          </el-table-column>
          <el-table-column prop="general"   label="设总" align="center" style="word-break: break-all;">
          </el-table-column>
          <el-table-column prop="createUser"   label="创建人" align="center" style="word-break: break-all;">
          </el-table-column>
          <el-table-column prop="createDate"  label="创建时间" align="center" style="word-break: break-all;">
          </el-table-column>
          <el-table-column width="200px" align="center"  fixed="right">
            <template slot="header">
              <el-switch
                v-model="type"
                active-text="业务建设"
                inactive-text="可研项目"
                @change="getData">
              </el-switch>
            </template>
            <template  slot-scope="scope">
              <el-row>
                <el-button
                  size="mini"
                  @click="openProject(scope.row)">项目管理</el-button>
                <el-button :disabled="scope.row.role === 3"
                           size="mini"
                           @click="openWorkday(scope.row)">工时分配</el-button>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
    <el-table key="activityList" use-virtual :row-height="30" border :data="activityList" class="el-table"
              :max-height="pageHeight"
              :header-cell-style="{background:'#F5F5F5',color:'#000000'}"
              style="margin-left: 10px"
              :cell-style="this.CellStyleOne"
              size="mini" v-if="type">
          <el-table-column prop="number"   label="活动名称" align="center">
          </el-table-column>
          <el-table-column prop="name"   label="活动名称" align="center">
          </el-table-column>
          <el-table-column prop="general" label="总负责人" align="center" style="word-break: break-all;">
          </el-table-column>
          <el-table-column prop="start_date"   label="开始时间" align="center" style="word-break: break-all;">
          </el-table-column>
          <el-table-column prop="end_date"  label="结束时间" align="center" style="word-break: break-all;">
          </el-table-column>
          <el-table-column prop="createUser"  label="创建人" align="center" style="word-break: break-all;">
          </el-table-column>
          <el-table-column prop="createDate"  label="创建时间" align="center" style="word-break: break-all;">
          </el-table-column>
          <el-table-column width="200px" align="center"  fixed="right">
            <template slot="header">
              <el-switch
                v-model="type"
                active-text="业务建设"
                inactive-text="可研项目"
                @change="getData">
              </el-switch>
            </template>
            <template  slot-scope="scope">
              <el-row>
                <el-button
                           size="mini"
                           @click="openProject(scope.row)">项目管理</el-button>
                <el-button :disabled="scope.row.role === 3"
                           size="mini"
                           @click="openWorkday(scope.row)">工时分配</el-button>
              </el-row>
            </template>
          </el-table-column>
        </el-table>
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
                <el-input disabled v-model="form.number" oninput="value=value.replace(/[^\d.]/g,'')"  >
                </el-input>
              </el-form-item >
            </el-col>
            <el-col :span="12">
              <el-form-item label-width="120px" :label=formLabel.name>
                <el-input disabled v-model="form.name" oninput="value=value.replace(/[^\d.]/g,'')">
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
                           disabled
                           value-key="id"
                           :loading="nameLoading"
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
                <el-input disabled v-model="form.workday" oninput="value=value.replace(/[^\d.]/g,'')">
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
                disabled
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
                         size="mini" circle @click="addItemPrincipal(index)"></el-button>
              <el-button icon="el-icon-remove-outline"
                         size="mini" circle @click="removeItemPrincipal(index)"></el-button>
            </el-col>
          </el-row>
          <el-form-item style="margin-left: -50px;text-align: center;margin-top: 20px">
            <el-button @click=" closeDialog ">取消</el-button>
            <el-button @click="dialogSubmit" type="primary">确认</el-button>
          </el-form-item>
        </el-row>
      </el-form>
    </el-dialog>
    <el-dialog
      :visible.sync="visible_workday"
      @close="closeDialog"
      width="60%" v-if='visible_workday'>
      <el-container>
        <el-header align="left" style="margin-top: -30px">
          <el-row>
            <el-col :span="10" style="margin-top: -20px">
              <h4>工时分配</h4>
            </el-col>
            <el-col :span="7">
              可用工时:<span style="color: #66b1ff">{{usable}}</span>
            </el-col>
            <el-col :span="7">
              已用工时:<span style="color: #66b1ff">{{used}}</span>
            </el-col>
          </el-row>
        </el-header>
        <el-main>
          <el-row v-for="(item,index) in  workday" style="margin-top: 5px" :key="index+'_workday'">
            <el-col :span="12">
              姓名：<el-select v-model="item.name" size="mini"
                         :filterable="true"  :remote="true"
                         :remote-method="remoteMethod"
                         :loading="nameLoading"
                         style="width: 50%"
                            @change="selectUser($event,index)"
                         placeholder="请输入人员姓名或工号">
                <el-option
                  v-for="item in nameList"
                  :key="item.id"
                  :label="item.name"
                  :value="item">
                </el-option></el-select>
            </el-col>
            <el-col :span="12">
              工时：<el-input type="type" size="mini" style="width: 50%" v-model="item.workday"></el-input>
              <el-button icon="el-icon-circle-plus-outline"
                         size="mini" circle @click="addItem(index)"></el-button>
              <el-button icon="el-icon-remove-outline"
                         size="mini" circle @click="removeItem(index)"></el-button>
            </el-col>
          </el-row>
          <el-row style="margin-top: 20px">
            <el-button  size="small " style="margin-right: 10%" @click="closeDialog()">取消</el-button>
            <el-button type="primary" size="small " style="margin-left: 10%" @click="submit">确定</el-button>
          </el-row>
        </el-main>
      </el-container>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Prophase",
  data(){
    return {
      id: "",
      type : false,
      date : "",
      pageHeight: document.body.offsetHeight,
      nowDay: new Date().getDate(),
      month: " ",
      listMonth: [],
      visible : false,
      loading: true,
      virtualList: [],
      activityList: [],
      nameLoading: true,
      nameList: [],
      ratioDialog: false,
      ruled: false,
      title: "",
      formLabel : {},
      form : {
        number : "",
        name : "",
        workday : "",
        general : [],
        date : [],
        principal : [],
      },
      workdayNumber : 0,
      usable : "",
      used : "",
      visible_workday :false,
      workday : [],
      dialogId  : "",
    }
  },
  computed: {
    usableAmount() {
      console.log("*" * 20)
     this.usable = this.workdayNumber - this.workday.reduce((prev, cur) => {
        if (cur.workday !== undefined && cur.workday !== "") {
          return Number(prev) + Number(cur.workday);
        } else return prev
      }, 0)
    },
  },
  watch:{
    usableAmount(val, old){

    }
  },
  mounted() {
    let date = new Date();
    this.date = date.getFullYear() + "-" + (Number(date.getMonth()) + 1).toString().padStart(2,0) + "-"+ date.getDate().toString().padStart(2,0)
    this.month = date.getFullYear() + "-" + (Number(date.getMonth()) + 1).toString().padStart(2,0)
    this.getData();
  },
  methods:{
    getData() {
      this.loading = false;
      if (!this.type) {
        this.$axios
          .post(this.$baseUrl + 'virtual/queryByUser')
          .then(res => {
            this.virtualList = res.data.data
          })
          .catch(res => (console.log(res.data)))
      }else {
        this.$axios
          .post(this.$baseUrl + 'activity/queryByUser')
          .then(res => {
            this.activityList = res.data.data
          })
          .catch(res => (console.log(res.data)))
      }
    },
    filterHandler(value, row, column){
      const property = column['property'];
      return row[property] === value;
    },
    dialogSubmit(){
      this.form.createDate = this.date;
      this.$axios
        .post(this.$baseUrl + 'user/queryById'
        )
        .then(res => {
          this.form.createUser = res.data.data.name
          this.form.month = this.month
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
    openWorkday(row){
      if (!this.type) {
        this.$axios
          .post(this.$baseUrl + 'virtual/queryWorkday', {
              id: row.id,
              date: this.month
            })
          .then(res => {
            this.workday = [];
            this.dialogId = row.id;
            this.workdayNumber = res.data.data.used.workday;
            this.used = res.data.data.used.used;
            res.data.data.list.forEach(item =>{
              this.workday.push({id: item.id, name: item.name, workday : item.workday})
            })
            this.visible_workday = true;
          })
          .catch(res => (console.log(res)));
      }else {
        this.$axios
          .post(this.$baseUrl + 'activity/queryWorkday', {
            id: row.id,
            date: this.month
          })
          .then(res => {
            this.workday = [];
            this.dialogId = row.id;
            this.workdayNumber = res.data.data.used.workday;
            this.used = res.data.data.used.used;
            res.data.data.list.forEach(item =>{
              this.workday.push({id: item.id, name: item.name, workday : item.workday})
            })
            this.visible_workday = true;
          })
      }
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
            this.form = res.data.data
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
    selectPrincipal(val,index){
      this.form.principal[index].name = val.name;
      this.form.principal[index].id = val.id
    },
    selectUser(val,index){
      this.workday[index].name = val.name;
      this.workday[index].id = val.id
    },

    addItemPrincipal(){
      this.form.principal.push({name:""})

    },
    removeItemPrincipal(index){
      this.form.principal.splice(index,1)
    },
    addItem(){
      this.workday.push({name:""})
    },
    removeItem(index){
      this.workday.splice(index,1)
    },
    closeDialog(){
      this.visible = false;
      this.workday = [];
      this.form = {
        month : this.month
      };
      this.formLabel = {};
      this.dialogId = "";
    },
    submit(){
      if (this.usable >= 0) {
        if (!this.type) {
          this.$axios
            .post(this.$baseUrl + 'virtual/setWorkday', {
              id: this.dialogId,
              date: this.month,
              list: this.workday
            })
            .then(res => {
              if (res.data.code === 0) {
                this.$message({
                  type: "success",
                  message: "发放成功"
                })
                this.visible_workday = false;
              }
            })
            .catch(res => (console.log(res.data)))
        } else {
          this.$axios
            .post(this.$baseUrl + 'activity/setWorkday', {
              id: this.dialogId,
              date: this.month,
              list: this.workday
            })
            .then(res => {
              if (res.data.code === 0) {
                this.$message({
                  type: "success",
                  message: "发放成功"
                })
                this.visible_workday = false;
              }
            })
            .catch(res => (console.log(res.data)))
        }
      }else {
        this.$message({
          type: "error",
          message: "工时发放数量超出最大值"
        })
      }
    },
    openExcel(){
      this.excelDialog = true;
    },
    ratioSubmit(){
      if (this.ruled === true) {
        this.$axios
          .post(this.$baseUrl + 'projectWorkDay/setTecVolumeRatio',
            this.ratio)
          .then(res => {
            this.ratioDialog = false;
          })
          .catch(res => (console.log(res)));
      }else this.$message.error("比例总和不得超过100%")
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
.el-tabs{
  margin-left: 2%;
  width: 96%;
}
.u-table {
  /*margin-left: 2%;*/
  /*width: 96%;*/
  horiz-align: center;
  font-size: 12px;
  word-wrap: break-word;
  margin-bottom: 10px;
}

/deep/ .u-table__fixed-right {
  height: 100% !important;
  /*/ / 设置高优先，以覆盖内联样式*/
}
/deep/ .u-table__fixed {
  height: 100% !important;
  /*/ / 设置高优先，以覆盖内联样式*/
}
/deep/ .u-table th > .cell{
  text-align: center;
}
/deep/ .u-table .cell{
  text-align: center;
}

.input {
  width: 120px;
}

.el-input.is-disabled /deep/ .el-input__inner {
  background-color: white;
  color: #000000;
}
</style>
