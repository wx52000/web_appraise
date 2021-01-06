<template>
  <div id="main" align="center">
    <el-row>
      <!-- 列表 -->
      <el-row style="margin: 0px 20px 20px 20px;background-color: #FFF;">
        <el-row>
          <el-row style="margin:0 auto;text-align: center; align-content: center">
            <el-col :span="18" style="line-height: 50px;font-size: 16px;font-weight: bold;color: #666;text-align: center ">
              <span style="margin-left: 33%">{{month}}月个人评价详情表</span>
              <i class="el-icon-document-copy" @click="openDialog"></i>
            </el-col>
            <el-col :span="6">
              <template>
                <el-select v-model="month" placeholder="请选择" @change="selectData"
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
          <el-table border ref="table1" :data="list" style="width:85%"
                    :header-cell-style="this.CellStyleOne" :cell-style="this.CellStyleOne"
                    @filter-change="filterMethod"
                    @sort-change="changeSort">
            <el-table-column prop="gname" label="评价人"
                             sortable="custom" min-width="10%">
            </el-table-column>
            <el-table-column prop="sname" label="得分人"
                             sortable="custom" min-width="10%">
            </el-table-column>
            <el-table-column prop="technology" label="得分人专业" min-width="15%"
                             column-key="technology"
                             :filters="technologyList">
            </el-table-column>
            <el-table-column prop="department" label="得分人部门" min-width="30%"
                             column-key="department"
                             :filters="departmentList">
            </el-table-column>
            <el-table-column prop="designer" label="质量得分" min-width="9%">
            </el-table-column>
            <el-table-column prop="personal" label="进度得分" min-width="9%">
            </el-table-column>
            <el-table-column prop="coordinate" label="配合得分" min-width="9%">
            </el-table-column>
          </el-table>
        </el-row>
      </el-row>
    </el-row>
    <el-dialog :visible.sync="visible"
               width="60%"
               :before-close="closeDialog">
      <el-container>
        <el-header>
          <el-row>
            <el-col :span="8">
              <el-button type="primary" size="small " plain @click="downExcel">整体数据导出</el-button>
            </el-col>
            <el-col :span="8">
              <el-button type="primary" size="small " plain @click="openTransfer">指定人员导出</el-button>
            </el-col>
            <el-col :span="8">
              <el-switch
                v-model="mode"
                active-text="被打分人"
                inactive-text="打分人"
                active-value="1"
                inactive-value="0"
                @change="openTransfer"
              style="margin-top: 5%">
              </el-switch>
            </el-col>
          </el-row>
        </el-header>
        <el-main v-if="section">
            <tree-transfer
              :title="['人员选择','已选部门，人员']"
              placeholder="请输入人员名字"
              height='320px'
              :from_data="userAll"
              :to_data='toData'
              filter
              mode='transfer'

              @addBtn='add'
              @removeBtn='remove'
              >
            </tree-transfer>
              <el-button  size="small " style="margin-right: 10%" @click="closeDialog">取消</el-button>

              <el-button type="primary" size="small " style="margin-left: 10%" @click="downExcelPart">确定</el-button>
        </el-main>
      </el-container>
    </el-dialog>
  </div>
</template>

<script>
import treeTransfer  from 'el-tree-transfer'
export default {
  name: "Details",
  data() {
    return {
      id: "",
      nowDay: new Date().getDate(),
      month: new Date().getMonth() + 1,
      listMonth : [],
      pageIndex: 1,
      pageSize: 10,
      list: [],
      visible : false,
      technologyList:[],
      departmentList:[],
      selectName: "",
      selectType: "",
      queryByd:null,
      queryByt:null,
      userList : [],
      defaultProps: {
        children: 'value',
        label: 'text'
      },
      userAll : [],
      title:["人员选择","已选中"],
      section : false,
      toData : [],
      mode : 0, //0代表根据打分人下载，1代表根据被打分人下载
    }
  },
  components:{
    treeTransfer
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
      this.getData();
      this.getOtherData();
    },
    getData() {
      this.$axios
        .post(this.$baseUrl + 'userScore/query', {
          "id": this.id,
          "selectName" : this.selectName,
          "selectType" : this.selectType,
          "tIds": this.queryByt,
          "dIds" : this.queryByd,
          "thisMonth" : this.month
        })
        .then(res => (this.list = res.data.data))
        .catch(res => (console.log(res)));
    },
    getOtherData(){
      this.$axios
        .post(this.$baseUrl + 'technology/queryNotUser',{},{headers: {'id': this.id}})
        .then(res => {this.technologyList = res.data.data;
          this.technologyList = JSON.parse(JSON.stringify(this.technologyList).replace(/id/g,"value").replace(
            /name/g,"text"));})
        .catch(res => (console.log(res)));
      this.$axios
        .post(this.$baseUrl + 'department/queryNotUser',{},{headers: {'id': this.id}})
        .then(res => {this.departmentList = res.data.data;
          this.departmentList = JSON.parse(JSON.stringify(this.departmentList).replace(/id/g,"value").replace(
            /name/g,"text"));})
        .catch(res => (console.log(res)));
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
        else if (obj === "department"){
          this.queryByt = null;
          if (filter.department.length !== 0) {
            this.queryByd = filter.department
          }else {
            this.queryByd = null
          }
        }
      }
      this.getData()
    },

    changeSort(v){
      console.log(v.prop)
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
      this.getData()
    },
    downExcel() {
      this.$message.success("即将开始下载");
      window.location.href = this.$baseUrl + 'userScore/detail?month=' + this.month;
    },
    downExcelPart(){
      let users = [];
      this.toData.forEach((item,index) => {
        item.children.forEach((it,ind) =>{
          it.children.forEach((i,n) => {
            users.push(i)
          })
        })
      })
      console.log(users)
      this.$message.success("即将开始下载");
      this.$axios.post(this.$baseUrl + 'userScore/part', {
          list: users,
          mode: this.mode,
          month : this.month})
          .then(res => {
            window.location.href = this.$baseUrl + 'userScore/partDownload?fileName=' + res.data.data;
          })
          .catch(res => console.log(res)
      )
    },
    openDialog(){
      this.visible = true;
    },
    openTransfer(){
      this.toData=[];
      this.$axios
        .post(this.$baseUrl + 'user/userAll',{},{headers:{mode : this.mode}})
        .then(res => {this.userAll = res.data.data;})
        .catch(res => (console.log(res)));
      this.section = true;
    },
    closeDialog(){
      this.toData = [];
      this.section = false;
      this.visible = false;
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.$axios
            .post(this.$baseUrl + 'user/queryByName', {
                "name" : query
              }
            )
            .then(res => {
              if (res.data.data != null) {
                this.general = res.data.data
              }
            });
          this.loading = false;
        }, 200);
      } else {
        this.general = [];
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    add(formData,toData,obj){
      this.toData = toData;
    },
    remove(fromData,toData,obj){
      this.toData = toData;
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
    },
    selectData(){
      this.selectName = "";
      this.selectType =  "";
      this.queryByd = null;
      this.queryByt = null;
      this.$refs.table1.clearFilter()
      this.getData()
    }



  }
}
</script>

<style scoped>

</style>
