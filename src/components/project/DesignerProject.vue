<template>
  <div>
    <el-form :model="form">
      <el-row>
        <!-- 列表 -->
        <el-row style="background-color: #FFF; text-align: center">
          <el-row>
            <el-row style="margin:0 auto;text-align: center; align-content: center">
              <el-col :span="24" style="line-height: 50px;font-size: 16px;font-weight: bold;color: #666;text-align: center ">
                每周汇报
              </el-col>
            </el-row>
            <el-table border :data="list" class="el-table" :header-cell-style="{background:'#F5F5F5'}"
                      :default-sort = "{prop: 'date', order: 'descending'}"
                      :row-key="getRowKeys"
                      :expand-row-keys="expands"
                      @row-click="clickRowHandle"
            >
              <el-table-column type="expand">
                <template  slot-scope="scope">
                  <el-form label-position="left" inline class="demo-table-expand">
                    <el-form-item label="设总">
                      <span>{{scope.row.general}}</span>
                    </el-form-item>
                    <el-form-item label="主设人">
                      <span>{{scope.row.principal}}</span>
                    </el-form-item>
                    <el-form-item label="互校人">
                      <span>{{scope.row.checker}}</span>
                    </el-form-item>
                    <el-form-item label="卷册状态">
                      <span>{{scope.row.state}}</span>
                    </el-form-item>
                  </el-form>
                </template>
              </el-table-column>
              <el-table-column prop="number" min-width="13%"  label="卷册号" sortable>
              </el-table-column>
              <el-table-column prop="volumeName" min-width="20%" label="卷册名称" sortable>
              </el-table-column>
              <el-table-column prop="projectName" min-width="20%" label="项目名称" sortable>
              </el-table-column>
              <el-table-column prop="workday" label="工时" min-width="6%" align="center"
                               sortable>
              </el-table-column>
              <el-table-column  min-width="11%" label="计划完成时间" sortable >
                <template slot-scope="scope">
                <span> {{timeConversion(scope.row.planned_publication_date)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"  min-width="9%" >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="openVolume(formId = scope.row.rollId)">卷册详情页面</el-button>
                </template>
              </el-table-column>
              <el-table-column
                align="center"  min-width="9%" >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="handleReport(scope.$index, scope.row)">每周汇报</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-row>
      </el-row>
    </el-form>
    <el-dialog
      id="report"
      :visible.sync="visible"
      width="40%">
      <div slot="title" >
        <span>每周汇报</span>
        <el-tooltip content="仅当状态为正在设计时需要填入，正在校审状态默认为100%" placement="top" @click.stop.prevent>
          <i class="el-icon-question" style="color: #d3d4d6"/>
        </el-tooltip>
      </div>
      <div style="width:100%;text-align:center">
        <el-form id="paw" :model="proportion" :rules="ruleValidate" label-width="100px" >
          <el-row>
            <el-col>
            <span>
              已完成比例:{{lastReport.proportion}}%
            </span>
            </el-col>
          </el-row>
          <el-row>
          <el-form-item prop="report" label="完成比例" >
            <el-input v-model="proportion.report" type="number"  autocomplete="off"
                      placeholder="本周完成比例" max="100">
            <template slot="append">%</template>
            </el-input>
          </el-form-item>
          </el-row>
          <el-row>
          <el-form-item prop="remark" label="备注" >
            <el-autocomplete
              class="inline-input"
              v-model="proportion.remarks"
              :fetch-suggestions="querySearch"
              placeholder="存在问题、延期原因等"
              autosize
              style="width: 100%"
            ></el-autocomplete>
          </el-form-item>
          </el-row>
          <el-button type="primary" @click="reporting" v-if="lastReport.state === 0" >确定</el-button>
        </el-form>
      </div>
    </el-dialog>
    <news-dialog class="news" :is-show="isShow" @click.native="isShow = !isShow">
    </news-dialog>
  </div>
</template>

<script>
export default {
  name: "DesignerProject",
  data(){
    const getMonthWeek = function ()
    {
      let currentDay = new Date();
      console.log(currentDay)
      // 获取该日期所在周的周六，如2019.5月的周六有4号、11号、18号、25号、31号
      let theSaturday = currentDay.getDate() + (6 - currentDay.getDay());
      return Math.ceil(theSaturday / 7);
    };
    const report = async(rule, value, callback) => {
      var regPos = /^\d+(\.\d+)?$/;
      if (value === null || value === '') {
        this.paw1Check = 1
        return callback(new Error('完成比例不能为空'));
      } else if (!regPos.test(value) || value > 100 || value < 0) {
        this.paw1Check = 1
        return callback(new Error('完成比例必须为正数，且小于100大于0'));
      } else {
        this.paw1Check = 0
        callback()
      }
    }
    return{
      getRowKeys(row) {
        return row.vid;
      },
      // 要展开的行，数值的元素是row的key值
      expands: [],
      id: "",
      pid: "",
      isShow : false,
      list: [],
      form: {},
      listIndex:0,
      meshRow:0,
      visible : false,
      proportion: {},
      reportCheck : 0,
      ruleValidate:{
        report: [
          { required: true, validator: report, trigger: 'blur' }
        ]
      },
      lastReport : {},
      reportVid : "",
      theMonth : new Date().getMonth() + 1,
      reasons : [],
    }
  },
  mounted() {
    this.getLogIn();
  },
  methods:{
    getLogIn() {
      let i = JSON.parse(sessionStorage.getItem("appraise"));
      this.id = i.id;
      this.pid = i.pid;
      this.getData();
    },
    getData() {
      this.$axios
        .post(this.$baseUrl + 'project/queryByDesigner',{
          "id" : this.id }
        )
        .then(res => {this.list = res.data.data})
        .catch(res => (console.log(res)));
    },
    clickRowHandle(row, column, event) {
      if (column.property !== undefined) {
        if (this.expands.includes(row.vid)) {
          this.expands = this.expands.filter(val => val !== row.vid);
        } else {
          this.expands.push(row.vid);
        }
      }
    },
    timeConversion(v){
      if (v !== undefined && v !== "") {
        if (!isNaN(v)) {
          let date = new Date(Number(v));
          let year = date.getFullYear();
          let month = date.getMonth() + 1;
          let day = date.getDate();
          return year + '-' + month + '-' + day;
        }else
          return v;
      } else
        return "";
    },
    getMonthByLong(v){
      if (v !== undefined && v !== "") {
        let date = new Date(v);
        return  date.getMonth()+1;
      }
    },
    getWeekByLong(v) {
      if (v !== undefined && v !== "") {
        let date = new Date(v);
        return date.get + 1;
      }
    },
    handleReport(v,w){
      this.proportion = {}
      this.reportVid = w.vid;
      this.$axios
        .post(this.$baseUrl + 'proportion/queryLastTime',{
            "volumeId" : w.vid,
            "userId" : this.id,
            "type" : 0,
          }
        )
        .then(res => {this.lastReport = res.data.data
          if (this.lastReport.state === 1){
            this.proportion.report = this.lastReport.proportion;
            this.proportion.remarks = this.lastReport.remarks;
          }
        })
        .catch(res => (console.log(res)));
      this.$nextTick(() =>{
        this.$forceUpdate();
        this.visible = true;
      })
    },
    reporting(){
      if (this.reportCheck === 0){
        this.$axios
          .post(this.$baseUrl + 'proportion/add',{
            "volumeId" : this.reportVid,
            "userId" : this.id,
            "proportion" : this.proportion.report,
            "remarks" : this.proportion.remarks,
            "type" : 0,
            }
          )
          .then(res => {
            if (res.data.code === 0){
              this.$message("操作成功")
              this.visible = false;
              }
          })
          .catch(res => (console.log(res)));
      }
    },
    openVolume(f){
      // window.open('http://zmis.zepdi.com.cn/Portal/Sys/Workflow/FormDetail.aspx?actionType=1&formId=' + f +
      window.open('http://zmis.zepdi.com.cn/Portal/EPMS/List/RollInfo/ContentMange.aspx?actionType=1&RollID=' + f)
    },
    querySearch(queryString, cb) {
      if (this.reasons.length === 0) {
        this.$axios
          .post(this.$baseUrl + 'reason/queryByType',{},{headers:{"type":0}}
          )
          .then(res => {
            this.reasons = res.data.data
            cb(this.reasons)
          })
          .catch(res => (console.log(res)));
      }else
        cb(this.reasons)
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
.el-table {
  margin-top:20px;
  width: 90% ;
  horiz-align: center;
  left: 5%;
  font-size: 12px;
  word-wrap: break-word;
}
</style>
