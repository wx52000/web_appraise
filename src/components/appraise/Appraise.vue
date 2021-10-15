<template id="main" style="margin: 0 auto;width: 100%">
  <div v-if="show && code !== 1001">
<!--  <div v-if="nowDay>=25&&nowDay<=29">-->
    <el-form :model="form">
      <el-row>
        <!-- 列表 -->
        <el-row style="background-color: #FFF; text-align: center">
          <el-row>
            <el-row style="margin:0 auto;text-align: center; align-content: center">
              <el-col :span="24" style="line-height: 50px;font-size: 16px;font-weight: bold;color: #666;text-align: center ">
                中国能建{{month}}月个人评分表
              </el-col>
            </el-row>
            <el-row style="margin:0 auto;text-align: center; align-content: center">
              <el-col :span="24" style="line-height: 10px;font-size: 12px;font-weight: bold;color: #666;text-align: center ">
                本月取值范围为{{min}}~{{max}}
              </el-col>
            </el-row>
            <el-row style="text-align: right">
              <el-col :span="24" style="text-align: right;">
                姓名/工号<el-input v-model="search1" size="mini" style="width: 130px" ></el-input>
                <el-button type="primary" @click="search()"  size="mini">查询</el-button>
                <el-button size="mini" @click="reset()" style="margin-right: 10%">重置</el-button>
              </el-col>
              </el-row>
            <u-table border :data="list"
                     use-virtual :row-height="50"
                      v-loading="loading"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0.8)"
                      :header-cell-style="this.CellStyleOne" :cell-style="this.CellStyleOne"
                      style="margin-top:20px;width: 80% ;horiz-align: center; left: 10% ; "
                      :default-sort = "{prop: 'date', order: 'descending'}">
              <u-table-column prop="department" label="部门"
                               column-key="department"
                               :filters="departmentList" :filter-method="filterMethod" min-width="25%">
              </u-table-column>
              <u-table-column prop="technology" label="专业"
                               column-key="technology"
                               :filters="technologyList" :filter-method="filterMethod" min-width="10%">
              </u-table-column>
              <u-table-column prop="name" label="姓名" sortable min-width="10%">
              </u-table-column>
              <u-table-column prop="username" label="工号" sortable min-width="10%">
              </u-table-column>
              <u-table-column prop="scope" label="质量得分" min-width="10%">
                <template slot-scope="scope">
                  <el-autocomplete
                    :ref = "'designer' + scope.$index"
                    v-model="scope.row.designer"
                    type="text"
                    @blur="judge(scope.row.designer,'designer',scope.$index)"
                    oninput="value=value.replace(/[^\d.]/g,'')"
                    :fetch-suggestions="querySearch"
                  ></el-autocomplete>
                </template>
              </u-table-column>

              <u-table-column prop="scope" label="进度得分" min-width="10%">
                <template slot-scope="scope">
                  <el-autocomplete
                    :ref = "'personal' + scope.$index"
                    v-model="scope.row.personal"
                    type="text"
                    @blur="judge(scope.row.personal,'personal',scope.$index)"
                    oninput="value=value.replace(/[^\d.]/g,'')"
                    :fetch-suggestions="querySearch"
                  ></el-autocomplete>
                </template>
              </u-table-column>

              <u-table-column prop="scope" label="配合得分" min-width="10%" >
                <template slot-scope="scope">
                  <el-autocomplete
                    :ref = "'coordinate' + scope.$index"
                    v-model="scope.row.coordinate"
                    type="text"
                    @blur="judge(scope.row.coordinate,'coordinate',scope.$index)"
                    oninput="value=value.replace(/[^\d.]/g,'')"
                    :fetch-suggestions="querySearch"
                  ></el-autocomplete>
                </template>
              </u-table-column>

            </u-table>
          </el-row>
        </el-row>
        <el-row style="padding: 20px 0 0 0;text-align: center;">
          <el-button type="primary" @click="appraise">确认评价</el-button>
        </el-row>
      </el-row>
    </el-form>
  </div>
  <div v-else-if="show && code === 1001">
    <el-card class="box-card" shadow="hover"
             style="position:absolute;top:45%;
    width: 25%;height: 15.28%;margin-left: 37.64%;background-color:#acb2b9">
      <div>
        暂无打分权限，请联系管理员确认是否拥有打分权限
      </div>
    </el-card>
  </div>
  <div v-else>
    <el-card class="box-card" shadow="hover"
    style="position:absolute;top:45%;
    width: 25%;height: 15.28%;margin-left: 37.64%;background-color:#acb2b9">
      <div>
        系统暂时不可打分，请在每年3，6，9，12月份的{{startDay}}日到次月{{endDay}}日进行打分。
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
name: "Appraise",
  data() {
    return {
      id: "",
      name : "",
      pid: "",
      tid : "",
      did : "",
      code : 0,
      position: "",
      year: new Date().getFullYear(),
      nowDay: new Date().getDate(),
      month: new Date().getMonth() + 1,
      search1: "",
      min: "",
      max: "",
      show: false,
      isRouterAlive : true,
      list: [],
      loading : true,
      form: {},
      startDay : 25,
      endDay : 10,
      appraiseData: {},
      pageIndex: 1,
      pageSize: 20,
      totalSize: 0,
      listData: [],
      tableData:[],
      technologyList:[],
      departmentList:[],
      selectName: "",
      selectType: "",
      queryByd:null,
      queryByt:null,
      sqlDate: "",
      scoreList : [
        {value : "1.05", text : 1.05},
        {value : "1.03", text : 1.03},
        {value : "1.00", text : 1.00},
        {value : "0.98", text : 0.98},
        {value : "0.95", text : 0.95},
        {value : "0.90", text : 0.90},
        {value : "0.85", text : 0.85},],
    }
  },
  provide(){
    return{
      reload:this.reload
    }
  },
  created() {
    this.getLogIn();
  },
  mounted() {
  },
  methods: {
    update(e) {
      this.$forceUpdate(e);
    },
    search() {
      this.getData();
    },
    reset() {
      this.search1 = null;
      this.getData();
    },
    querySearch(queryString, cb) {
      cb(this.scoreList);
    },
    getLogIn() {
      let i = JSON.parse(sessionStorage.getItem("appraise"));
      this.id = i.id;
      this.pid = i.pid;
      this.name = i.name;
      this.tid = i.tid;
      this.did = i.did;
      this.position = i.position;
      this.getData();
      this.getOtherData();
      console.log(this.position)
    },
    getData() {
      this.$axios
        .post(this.$baseUrl + 'user/queryToScore', {
          "id" : this.id,
          "name" : this.name,
          "did" : this.did,
          "tid" : this.tid,
          "sqlDate" : this.sqlDate,
          "pageIndex" : this.pageIndex,
          "pageSize" : this.pageSize,
          "selectName" : this.search1,
        },)
        .then(res => {
          this.code = res.data.code;
          this.loading = false;
          res.data.data.forEach((item,index)=>{
            if (item.designer !== undefined ){
              item.designer = item.designer.toString();
            }
            if (item.personal !== undefined ){
              item.personal = item.personal.toString();
            }
            if (item.coordinate !== undefined ){
              item.coordinate = item.coordinate.toString();
            }
            this.list.push(item);
            this.departmentList.push2({value:item.department,text:item.department})
            this.technologyList.push2({value:item.technology,text:item.technology})
          })
        })
        .catch(res => (console.log(res)));
        this.$axios
          .post(this.$baseUrl + 'range/queryDate')
          .then(res => {
            this.endDay = res.data.data.end;
            this.startDay = res.data.data.start;
            if (this.month%3 === 0){
              if (this.nowDay >= this.startDay){
                this.show=true
                if ((this.month - 2) > 0){
                  this.sqlDate =this.year + "-" +  (this.month-2) + "-" + 1
                }else {
                  this.year = -- this.year
                  this.sqlDate = this.year + "-" + (this.month + 9) + "-" + 1
                }
              }
            }else if(this.month%3 === 1) {
              if (this.nowDay <= this.endDay) {
                this.show = true
                if ((this.month - 3) > 0) {
                  this.sqlDate = this.year + "-" + (this.month - 3) + "-" + 1
                } else {
                  this.year = --this.year
                  this.sqlDate = this.year + "-" + (this.month + 8) + "-" + 1
                }
              }
            }
          })
          .catch(res => (console.log(res)));
    },
    getOtherData(){
      this.$axios
        .post(this.$baseUrl + 'range/query')
        .then(res => {this.max = res.data.data.max ;
          this.min = res.data.data.min})
        .catch(res => (console.log(res)));
    },
    appraise() {
      this.listData = [];
      let e = 0;
      this.tableData.forEach((data)=>{
        if (data.pageIndex === this.pageIndex){
          data.list = this.list;
          e = 1;
          return 0;
        }
      })
      if (e === 0){
        let tData = {pageIndex:this.pageIndex , list:this.list}
        this.tableData.push(tData)
      }
      this.tableData.forEach(data =>{
        data.list.forEach(table =>{
          if (table.designer !=null || table.personal != null || table.coordinate!= null){
            let  role = null;
            if (this.position === null || this.position === undefined)
              role = table.role;
            else {
              // role = this.position;
              if (this.position !==  undefined) {
                role = this.position.split(",")[0]
              }
            }
            let userScore = {
              gradeId: this.id,
              scoreId: table.id,
              designer: table.designer,
              personal: table.personal,
              coordinate: table.coordinate,
              date : new Date().getTime(),
              role : role
            };
            this.listData.push(userScore);
          }
        })
      })
      this.$axios
        .post(this.$baseUrl + 'userScore/appraise', this.listData)
        .then(res => {
          if (0 === res.data.code) {
            this.reload();
              this.$message.success("操作成功")
            this.tableData = [];
            this.getData();
          } else {
            alert(("操作失败，请重试"))
          }
        })
        .catch(res => (console.log(res)));
    },
    changeDesigner(row){

    },
    judge(v,w,n) {
      if ( v !== null && v !== '') {
        if (v < this.min || v > this.max) {
          this.$refs[w + n].focus();
          this.$message.error("输入的值不在范围内，请重新输入");
        }
      }

    },
    reload(){
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    },
    changeIndex(v) {
      if (this.tableData.length === 0){
        let tData = {pageIndex:this.pageIndex , list:this.list};
        this.tableData.push(tData);
        this.pageIndex = v;
        this.getData();
      }else {
        let e = 0; //用于判断tableData 中有没有当前页数据
        let x = 0; //用于判断tableData 中有没有跳转页数据
        this.tableData.forEach((data) =>{
          //判断数据中是否有数据
          if(data.pageIndex === this.pageIndex) {
            data.list = this.list;
            e = 1;
          }
        })
        this.tableData.forEach((data) =>{
          if (data.pageIndex === v) {
            this.list = data.list;
            this.pageIndex = v;
            x = 1;
            return 0;
          }
        })
        if (e === 0) {
          let tData = {pageIndex: this.pageIndex, list: this.list}
          this.tableData.push(tData);
        }
        if (x === 0){
            this.pageIndex = v;
            this.getData();
          }
      }
      console.log(this.tableData)
    },
    changeSize(v) {
      this.tableData = null;
      this.pageSize = v;
      this.pageIndex = 1;
      this.getData();
    },
    changeState(v){
      this.list[v].state = false;
    },
    filterMethod(value, row, column){
        const property = column['property'];
        return row[property] === value;
    },

    changeSort(v){
      this.search1 = null
      this.appraise()
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
  }


}
</script>

<style scoped>
</style>
