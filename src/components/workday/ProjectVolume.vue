<template>
  <div>
  <u-table use-virtual :row-height="28" border :data="volumeList" class="u-table"
            :header-cell-style="{background:'#F5F5F5' } "
            :row-class-name="tableRowClassName"
            :row-key="getRowKeys"
            :expand-row-keys="expands"
            @row-click="clickRowHandle"
            :default-sort = "{prop: 'date', order: 'descending'}"
            v-loading="volumeLoading">
    <u-table-column type="expand" >
      <template  slot-scope="scope">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="设计人：">
            <span>{{scope.row.designer}}</span>
          </el-form-item>
          <el-form-item label="校核人：">
            <span>{{scope.row.checker}}</span>
          </el-form-item>
          <el-form-item label="计划出手日期：">
            <span>{{scope.row.planned_shot_date}}</span>
          </el-form-item>
          <el-form-item label="出手日期：">
            <span>{{scope.row.shot_date}}</span>
          </el-form-item>
          <el-form-item label="校核人完成时间：">
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
        </el-form>
      </template>
    </u-table-column>
    <u-table-column prop="number" min-width="13  %" label="卷册号" sortable align="center"  >
    </u-table-column>
    <u-table-column prop="name" min-width="20" label="卷册名称" sortable align="center" style="word-break: break-all;">
    </u-table-column>
    <u-table-column prop="principal" label="主设人" min-width="6%" align="center"
                     :filters="principalList" :filter-method="filterHandler">
    </u-table-column>
    <u-table-column prop="designer" label="设计人" min-width="6%" align="center"
                     :filters="designerList" :filter-method="filterHandler">
    </u-table-column>
    <u-table-column prop="designer" label="校核人" min-width="6%" align="center"
                    :filters="checkerList" :filter-method="filterHandler">
    </u-table-column>
    <u-table-column prop="workday" label="工时" min-width="6%" align="center"
                     sortable>
    </u-table-column>
    <u-table-column prop="workday" label="工时状态" min-width="6%" align="center"
                    :filters="[{text:'未发放',value:0},{text:'已发放',value:1},
                          {text:'部分发放',value:2}]"
                    :filter-method="filterHandler">
    </u-table-column>
    <u-table-column prop="state" min-width="9%"  label="状态" align="center"
                     :filters="[{text:'尚未开展',value:'尚未开展'},{text:'正在设计',value:'正在设计'},
                          {text:'正在校审',value:'正在校审'},{text:'待送出版',value:'待送出版'},
                          {text:'正在出版',value:'正在出版'},{text:'待送业主',value:'待送业主'},
                          {text:'已完成',value:'已完成'},{text:'院交出',value:'院交出'}]"
                     :filter-method="filterHandler">
    </u-table-column>
  </u-table>
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
      checkerList: [],
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
            this.designerList.push2({value:item.designer,text:item.designer});
            this.checkerList.push2({value:item.checker, text: item.checker});
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
.u-table {
  horiz-align: center;
  font-size: 12px;
  word-wrap: break-word;
}
</style>
