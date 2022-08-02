<template id="main" style="margin: 0 auto;width: 100%">
  <div>
  <div v-if="show && code !== 1001">
<!--  <div v-if="nowDay>=25&&nowDay<=29">-->
    <el-form :model="form">
      <el-row>
        <!-- 列表 -->
        <el-row style="background-color: #FFF; text-align: center">
          <el-row>
            <el-row style="margin:0 auto;text-align: center; align-content: center">
              <el-col :span="24" style="line-height: 50px;font-size: 16px;font-weight: bold;color: #666;text-align: center ">
                {{month}}月个人评分表
              </el-col>
            </el-row>
            <el-row style="margin:0 auto;text-align: center; align-content: center">
              <el-col :span="24" style="line-height: 10px;font-size: 12px;font-weight: bold;color: #666;text-align: center ">
                本月取值范围为{{min}}~{{max}}
              </el-col>
            </el-row>
            <el-row style="text-align: right">
              <el-col :span="24" style="text-align: right;">
                姓名/工号<el-input v-model="search" size="mini" style="width: 130px" ></el-input>
                <el-button type="primary" @click="searchMethod()"  size="mini">查询</el-button>
                <el-button size="mini" @click="reset()" style="margin-right: 10%">重置</el-button>
              </el-col>
              </el-row>
            <u-table border :data="list"
                     use-virtual :row-height="50"
                      v-loading="loading"
                     ref = "appraise"
                     size = "mini"
                     :max-height = "500"
                      element-loading-text="拼命加载中"
                      element-loading-spinner="el-icon-loading"
                      element-loading-background="rgba(0, 0, 0, 0.8)"
                      :header-cell-style="this.CellStyleOne" :cell-style="this.CellStyleOne"
                      :default-sort = "{prop: 'date', order: 'descending'}">
              <u-table-column prop="department" label="部门"
                               column-key="department" align="center"
                               :filters="departmentList" :filter-method="filterMethod" min-width="25%">
              </u-table-column>
              <u-table-column prop="technology" label="专业"
                               column-key="technology" align="center"
                               :filters="technologyList" :filter-method="filterMethod" min-width="10%">
              </u-table-column>
              <u-table-column prop="name" label="姓名" sortable min-width="10%" align="center">
              </u-table-column>
              <u-table-column prop="username" label="工号" sortable min-width="10%" align="center">
              </u-table-column>
              <u-table-column prop="scope" label="质量得分" min-width="10%" align="center">
                <template slot-scope="scope">
                  <el-autocomplete
                    :ref = "'designer' + scope.$index"
                    v-model="scope.row.designer"
                    type="text"
                    @blur="judge(scope.row.designer,'designer',scope.$index)"
                    oninput="value=value.replace(/[^\d.]/g,'')"
                    :fetch-suggestions="querySearch"
                    @select="appraise(scope.row)"
                    @change="appraise(scope.row)"
                  ></el-autocomplete>
                </template>
              </u-table-column>

              <u-table-column prop="scope" label="进度得分" min-width="10%" align="center">
                <template slot-scope="scope">
                  <el-autocomplete
                    :ref = "'personal' + scope.$index"
                    v-model="scope.row.personal"
                    type="text"
                    @blur="judge(scope.row.personal,'personal',scope.$index)"
                    oninput="value=value.replace(/[^\d.]/g,'')"
                    :fetch-suggestions="querySearch"
                    @select="appraise(scope.row)"
                    @change="appraise(scope.row)"
                  ></el-autocomplete>
                </template>
              </u-table-column>

              <u-table-column prop="scope" label="配合得分" min-width="10%" align="center">
                <template slot-scope="scope">
                  <el-autocomplete
                    :ref = "'coordinate' + scope.$index"
                    v-model="scope.row.coordinate"
                    type="text"
                    @blur="judge(scope.row.coordinate,'coordinate',scope.$index)"
                    oninput="value=value.replace(/[^\d.]/g,'')"
                    :fetch-suggestions="querySearch"
                    @select="appraise(scope.row)"
                    @change="appraise(scope.row)"
                  ></el-autocomplete>
                </template>
              </u-table-column>

            </u-table>
          </el-row>
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
  </div>
</template>

<script>
export default {
name: "Appraise",
  data() {
    return {
      id: "",
      code : 0,
      position: "",
      year: new Date().getFullYear(),
      nowDay: new Date().getDate(),
      month: new Date().getMonth() + 1,
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
      listData: [],
      tableData:[],
      technologyList:[],
      departmentList:[],
      selectName: "",
      selectType: "",
      queryByd:null,
      queryByt:null,
      sqlDate: "",
      search : "",
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
  mounted() {
    this.getData();
    this.getOtherData();
  },
  methods: {
    update(e) {
      this.$forceUpdate(e);
    },
    reset() {
      this.search = "";
      this.getData();
    },
    querySearch(queryString, cb) {
      cb(this.scoreList);
    },
    searchMethod(){
      let reg = RegExp(this.search.trim());
      this.list = this.list.filter( item =>{
         return reg.test(item.name) || reg.test(item.username)
      })
    },
    getData() {
      this.$axios
        .post(this.$baseUrl + 'user/queryToScore',
          {
            selectName :  this.serach
          })
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
    appraise(row) {
      console.log(row)
      this.$axios
        .post(this.$baseUrl + 'userScore/appraise',
          {
              scoreId : row.id,
              designer : row.designer,
              personal : row.personal,
              coordinate : row.coordinate,
              role : row.role
          })
        .then(res => {

        })
        .catch(res => (console.log(res)));
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
    changeState(v){
      this.list[v].state = false;
    },
    filterMethod(value, row, column){
        const property = column['property'];
        return row[property] === value;
    },

  }


}
</script>

<style scoped>
</style>
