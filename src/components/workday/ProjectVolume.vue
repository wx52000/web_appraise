<template>
  <div>
  <u-table use-virtual :row-height="28" border :data="volumeList" class="u-table"
            :height="pageHeight"
            :header-cell-style="{background:'#F5F5F5' } "
            :row-class-name="tableRowClassName"
            :row-key="getRowKeys"
           showBodyOverflow="title"
           showHeaderOverflow="title"
           :data-changes-scroll-top="false"
            :expand-row-keys="expands"
            @row-click="clickRowHandle"
            :default-sort = "{prop: 'date', order: 'descending'}"
            v-loading="volumeLoading">
    <u-table-column type="expand" >
      <template  slot-scope="scope">
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="设计：">
            <span>{{scope.row.designer}}</span>
          </el-form-item>
          <el-form-item label="校核：">
            <span>{{scope.row.checker}}</span>
          </el-form-item>
          <el-form-item label="主设：">
            <span>{{scope.row.principal}}</span>
          </el-form-item>
          <el-form-item label="组长：">
            <span>{{scope.row.headman}}</span>
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
    <u-table-column prop="type" width="100px"
                    :filters="[{text:'卷册',value:'卷册'},{text:'管理',value:'管理'},
                            {text:'备用',value:'备用'},{text:'设总备用',value:'设总备用'},{text:'设总管理',value:'设总管理'}]"
                    :filter-method="filterHandler"
                    label="类型" align="center"  >
    </u-table-column>
    <u-table-column prop="number" min-width="13  %" label="卷册号" sortable align="center"  >
    </u-table-column>
    <u-table-column prop="name" min-width="20" label="卷册名称" sortable align="center" style="word-break: break-all;">
    </u-table-column>
    <u-table-column prop="tec" label="专业" min-width="6%" align="center"
                     :filters="tecList" :filter-method="filterHandler">
    </u-table-column>
    <u-table-column prop="workday" label="工时" width="100px" align="center"
                     sortable>
    </u-table-column>
    <u-table-column prop="workday_state" label="工时状态" width="120px" align="center"
                    :filters="[{text:'未发放',value:0},{text:'已发放',value:1},
                          {text:'部分发放',value:2}]"
                    :filter-method="filterHandler">
    </u-table-column>
    <u-table-column prop="grant" label="已预发工时" width="140px" align="center"
                    sortable>
    </u-table-column>
    <u-table-column prop="state" width="100px"  label="状态" align="center"
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
      pageHeight : document.body.scrollHeight,
      id: "",
      pid: "",
      tid : "",
      isShow : false,
      projectId : null,
      volumeList: [],
      tecList : [],
      expands: [],
      volumeLoading : true,
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
            this.tecList.push2({value:item.tec,text:item.tec});
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
