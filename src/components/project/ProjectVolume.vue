<template>
  <div>
  <el-table border :data="volumeList" class="el-table"
            :header-cell-style="{background:'#F5F5F5' } "
            :row-class-name="tableRowClassName"
            :row-key="getRowKeys"
            :expand-row-keys="expands"
            @row-click="clickRowHandle"
            :default-sort = "{prop: 'date', order: 'descending'}"
            v-loading="volumeLoading">
    <el-table-column type="expand" >
      <template  slot-scope="scope">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="设计人：">
            <span>{{scope.row.designer}}</span>
          </el-form-item>
          <el-form-item label="互校人：">
            <span>{{scope.row.checker}}</span>
          </el-form-item>
          <el-form-item label="计划出手日期：">
            <span>{{scope.row.planned_shot_date}}</span>
          </el-form-item>
          <el-form-item label="出手日期：">
            <span>{{scope.row.shot_date}}</span>
          </el-form-item>
          <el-form-item label="互校人完成时间：">
            <span>{{scope.row.proofreading_date}}</span>
          </el-form-item>
          <el-form-item label="计划出版时间：">
            <span>{{scope.row.planned_publication_date}}</span>
          </el-form-item>
          <el-form-item label="实际最终出版时间：">
            <span>{{scope.row.actual_publication_date}}</span>
          </el-form-item>
          <el-form-item label="完成日期">
            <span>{{scope.row.complete_time}}</span>
          </el-form-item>
<!--          <el-form-item label="设计人本周完成比例：" >-->
<!--            <span>{{recordConversion(scope.row.designerList,0,0)}}%</span>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="备注：" >-->
<!--            <span>{{recordConversion(scope.row.designerList,0,1)}}</span>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="设计人上次完成比例：">-->
<!--            <span>{{recordConversion(scope.row.designerList,1,0)}}%</span>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="备注：">-->
<!--            <span>{{recordConversion(scope.row.designerList,1,1)}}</span>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="互校人本周完成比例：">-->
<!--            <span>{{recordConversion(scope.row.checkerList,0,0)}}%</span>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="备注：">-->
<!--            <span>{{recordConversion(scope.row.checkerList,0,1)}}</span>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="互校人上次完成比例：">-->
<!--            <span>{{recordConversion(scope.row.checkerList,1,0)}}%</span>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="备注：">-->
<!--            <span>{{recordConversion(scope.row.checkerList,1,1)}}</span>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="主设人本周完成比例：">-->
<!--            <span>{{recordConversion(scope.row.principalList,0,0)}}%</span>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="备注：">-->
<!--            <span>{{recordConversion(scope.row.principalList,0,1)}}</span>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="主设人上次完成比例：">-->
<!--            <span>{{recordConversion(scope.row.principalList,1,0)}}%</span>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="备注：">-->
<!--            <span>{{recordConversion(scope.row.principalList,1,1)}}</span>-->
<!--          </el-form-item>-->
        </el-form>
      </template>
    </el-table-column>
    <el-table-column prop="number" min-width="13  %" label="卷册号" sortable align="center"  >
    </el-table-column>
    <el-table-column prop="name" min-width="20" label="卷册名称" sortable align="center" style="word-break: break-all;">
    </el-table-column>
    <el-table-column prop="principal" label="主设人" min-width="6%" align="center"
                     :filters="principalList" :filter-method="filterHandler">
    </el-table-column>
    <el-table-column prop="designer" label="设计人" min-width="6%" align="center"
                     :filters="designerList" :filter-method="filterHandler">
    </el-table-column>
    <el-table-column prop="workday" label="工时" min-width="6%" align="center"
                     sortable>
    </el-table-column>
    <el-table-column prop="state" min-width="9%"  label="状态" align="center"
                     :filters="[{text:'尚未开展',value:'尚未开展'},{text:'正在设计',value:'正在设计'},
                          {text:'正在校审',value:'正在校审'},{text:'代送出版',value:'代送出版'},
                          {text:'正在出版',value:'正在出版'},{text:'代送业主',value:'代送业主'},
                          {text:'已完成交付设总',value:'已完成交付设总'},{text:'已完成交付业主',value:'已完成交付业主'}]"
                     :filter-method="filterHandler">
    </el-table-column>
    <el-table-column
      align="center"  min-width="24%" style="text-align: center">
      <template slot="header" slot-scope="scope">
        <el-date-picker
          v-model="pickerValue"
          type="daterange"
          align="right"
          size="mini"
          value-format="yyyy-MM-dd"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          @change="pickerEvent">
        </el-date-picker>
      </template>
      <template slot-scope="scope" style="text-align: center">
        <el-row>
<!--          <el-col :span="12">-->
<!--            <el-popover-->
<!--              placement="top-start"-->
<!--              width="300"-->
<!--              trigger="hover"-->
<!--              content="蓝色为设计人进度，红色为互校人进度，黄色为主设人进度。互校人填写进度后显示的为互校人进度，主设人填写后显示的为主设人进度">-->
<!--              <i slot="reference" class="el-icon-question"></i>-->
<!--            </el-popover>-->
<!--            <span-->
<!--              :style="displayColor(scope.row)" style="margin-right: 50%">-->
<!--                {{displayProgress(scope.row)}}</span>-->
<!--          </el-col>-->
          <el-col :span="12">
            <el-button
              size="mini"
              @click="openVolume1(formId = scope.row.rollId)">卷册详情页面</el-button>
          </el-col>
        </el-row>
      </template>
    </el-table-column>
  </el-table>
    <news-dialog class="news" :is-show="isShow" @click.native="isShow = !isShow">
    </news-dialog>
  </div>
</template>

<script>
export default {
  name: "ProjectVolume",
  data() {
    return {
      getRowKeys(row) {
        return row.id;
      },
      id: "",
      pid: "",
      tid : "",
      isShow : false,
      projectId : null,
      volumeList: [],
      expands: [],
      volumeLoading : true,
      principalList:[],
      designerList:[],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      pickerValue:null,
    }
  },
  mounted() {
    this.projectId = this.$route.query.project_id;
    this.getData()
  },
  methods: {
    getData(){
      this.$axios
        .post(this.$baseUrl + 'volume/queryByProjectId', {
          "id": this.projectId,
          "month" : new Date().getMonth()+1
        })
        .then(res => {
          this.volumeList = res.data.data;
          this.volumeLoading = false;
          this.volumeList.forEach((item)=>{
            this.principalList.push2({value:item.principal,text:item.principal});
            this.designerList.push2({value:item.designer,text:item.designer})
          })
        })
        .catch(res => (console.log(res)));
    },
    tableRowClassName({row, rowIndex}) {
      //把每一行的索引放进row
      row.index = rowIndex;
    },
    filterHandler(value, row, column){
      const property = column['property'];
      return row[property] === value;
    },
    clickRowHandle(row, column, event) {
      if (column.property !== undefined) {
        if (this.expands.includes(row.id)) {
          this.expands = this.expands.filter(val => val !== row.id);
        } else {
          this.expands.push(row.id);
        }
      }
    },
    displayColor(v){
      if (v.principalList !== undefined){
        return "color:#e3f42a"
      }else if (v.checkerList !== undefined){
        return "color:#e70821"
      }else if (v.designerList !== undefined){
        return "color:#1b08e7"
      }else
        return  null
    },
    pickerEvent(){
      this.$axios
        .post(this.$baseUrl + 'volume/queryByProjectId', {
            "id" : this.projectId,
            "month": new Date().getMonth()+1,
            "pickerDate" : this.pickerValue
          },
        )
        .then(res => {
          this.volumeList = res.data.data;
          this.volumeLoading = false;
        })
        .catch(res => (console.log(res)));
      this.volumeVisible = true
    },
    displayProgress(v){
      if (v.principalList !== undefined){
        return v.principalList.split("##")[0].split("$")[0]
      }else if (v.checkerList !== undefined){
        return v.checkerList.split("##")[0].split("$")[0]
      }else if (v.designerList !== undefined){
        return v.designerList.split("##")[0].split("$")[0]
      }else
        return  null
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
  horiz-align: center;
  font-size: 12px;
  word-wrap: break-word;
}
</style>
