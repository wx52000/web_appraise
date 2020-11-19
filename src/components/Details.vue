<template>
  <div id="main" align="center">
    <el-row>
      <!-- 列表 -->
      <el-row style="margin: 0px 20px 20px 20px;background-color: #FFF;">
        <el-row>
          <el-row style="margin:0 auto;text-align: center; align-content: center">
            <el-col :span="24" style="line-height: 50px;font-size: 16px;font-weight: bold;color: #666;text-align: center ">
              {{month}}月评价详细信息表
              <i class="el-icon-document-copy" @click="openDialog"></i>
            </el-col>
          </el-row>
          <el-table border :data="list" style="width:85%"
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
            <el-col :span="12">
              <span>下载月份选择</span>
              <template>
                <el-select v-model="value" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" plain @click="downExcel">整体数据导出</el-button>
            </el-col>
            <el-col :span="6">
              <el-button type="primary" plain @click="openTransfer">指定人员导出</el-button>
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
              <el-button type="primary" style="margin-right: 10%" @click="closeDialog">取消</el-button>

              <el-button type="primary" style="margin-left: 10%" @click="">确定</el-button>
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
      month: new Date().getMonth() + 1,
      search1: "",
      search2: "",
      search3: "",
      search4: "",
      search5: "",
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
    }
  },
  components:{
    treeTransfer
  },
  mounted() {
    this.getLogIn();
    // this.getData();
  },
  methods: {
    search() {
      this.getData();
    },
    reset() {
      this.search1 = "";
      this.search2 = "";
      this.search3 = "";
      this.search4 = "";
      this.search5 = "";
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
          "dIds" : this.queryByd
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
        else {
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
      window.location.href = this.$baseUrl + 'userScore/detail';
    },
    openDialog(){
      this.visible = true;
    },
    openTransfer(){
      this.$axios
        .post(this.$baseUrl + 'user/userAll')
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

  }
}
</script>

<style scoped>

</style>
