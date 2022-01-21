<template>
  <div id="main" align="center">
    <el-row>
      <!-- 列表 -->
      <el-row style="margin: 0px 20px 20px 20px;background-color: #FFF;">
        <el-row>
          <el-row style="margin:0 auto;text-align: center; align-content: center">
            <el-col :span="18" style="line-height: 50px;font-size: 16px;font-weight: bold;color: #666;text-align: center ">
              <span style="margin-left: 33%">第{{quarter}}季度个人评价详情表</span>
              <i class="el-icon-document-copy" @click="openDialog"></i>
            </el-col>
            <el-col :span="6">
              <template>
                <el-select v-model="quarterNumber" placeholder="请选择" @change="selectData"
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
          <u-table use-virtual :row-height="50" border ref="table1" :data="list"
                    :header-cell-style="this.CellStyleOne" :cell-style="this.CellStyleOne"
                    @sort-change="changeSort" size = "mini">
            <u-table-column prop="gname" label="评价人"
                             sortable="custom" min-width="10%">
            </u-table-column>
            <u-table-column prop="sname" label="得分人"
                             sortable="custom" min-width="10%">
            </u-table-column>
            <u-table-column prop="technology" label="得分人专业" min-width="15%"
                             column-key="technology"
                             :filters="technologyList"
                             :filter-method="filterMethod">
            </u-table-column>
            <u-table-column prop="department" label="得分人部门" min-width="30%"
                             column-key="department"
                             :filters="departmentList"
                             :filter-method="filterMethod">
            </u-table-column>
            <u-table-column prop="designer" label="质量得分" min-width="9%">
            </u-table-column>
            <u-table-column prop="personal" label="进度得分" min-width="9%">
            </u-table-column>
            <u-table-column prop="coordinate" label="配合得分" min-width="9%">
            </u-table-column>
          </u-table>
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
      isShow : false,
      quarter:"",
      quarterNumber : "",
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
    let quarter = ["一","二","三","四"]
    let quarterNumber = [3, 6, 9, 12 ]
    console.log(this.month)
    if (this.month%3 === 0){
      if (this.nowDay>=25){
        this.quarter = quarter[Math.floor(this.month/3)]
        this.quarterNumber = quarterNumber[Math.floor(this.month/3)]
      }else{
        if (this.month === 3){
          this.quarter = "四"
          this.quarterNumber = 12
        }else {
          this.quarter = quarter[Math.floor(this.month / 3) - 1]
          this.quarterNumber = quarterNumber[Math.floor(this.month / 3) - 1]
        }
      }
    }else{
      if (this.month<3){
        this.quarter = "四"
        this.quarterNumber = 12
      }else {
        this.quarter = quarter[Math.floor(this.month/3)-1]
        this.quarterNumber = quarterNumber[Math.floor(this.month/3)-1]
      }
    }
    console.log(this.quarterNumber)
    this.setListMonth();
    this.getData();
  },
  methods: {
    reset() {
      this.pageIndex = 1;
      this.getData();
    },
    getData() {
      this.$axios
        .post(this.$baseUrl + 'userScore/query', {
          "id": this.id,
          "selectName" : this.selectName,
          "selectType" : this.selectType,
          "tIds": this.queryByt,
          "dIds" : this.queryByd,
          "thisMonth" : this.quarterNumber
        })
        .then(res => {this.list = res.data.data
            this.list.forEach((item,index)=>{
              this.departmentList.push2({value:item.department,text:item.department})
              this.technologyList.push2({value:item.technology,text:item.technology})
            })})
        .catch(res => (console.log(res)));
    },
    filterMethod(value, row, column){
      const property = column['property'];
      return row[property] === value;
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
      window.location.href = this.$baseUrl + 'userScore/detail?month=' + this.quarterNumber;
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
          month : this.quarterNumber})
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
      let MonthData1 = { value : this.quarterNumber, label : "本季度"};
      let MonthData2 = {};
      let MonthData3 = {};
      if (this.quarterNumber >= 9){
        MonthData2 = {value : this.quarterNumber-3 , label : "上季度"}
        MonthData3 = {value : this.quarterNumber-6 , label : "上上季度"}
      }else if (this.quarterNumber === 6){
        MonthData2 = {value : 3 , label : "上季度"}
        MonthData3 = {value : 12 , label : "上上季度"}
      }else if (this.quarterNumber === 3){
        MonthData2 = {value : 12 , label : "上季度"}
        MonthData3 = {value : 9 , label : "上上季度"}
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
