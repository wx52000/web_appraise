<template>
<div align="center" style="text-align: center">
    <el-row style="text-align: right">
      <el-date-picker
        v-model="month"
        size="mini"
        type="month"
        value-format="yyyy-MM"
        @change="getData"
        style="margin-right: 10%;margin-bottom: 5px;margin-top: 5px"
        placeholder="选择月">
      </el-date-picker>
    </el-row>
  <u-table :row-height="28" border ref="list" size="mini" :data="list"
           :max-height="pageHeight"
           showBodyOverflow="tooltip"
           showHeaderOverflow="title"
           show-summary
           :summary-method="arraySpanMethod"
           :data-changes-scroll-top="false"
           :header-cell-style="{background:'#F5F5F5'}" :cell-style="this.CellStyleOne">
    <u-table-column
      type="index"
      align="center"
      width="50">
    </u-table-column>
    <u-table-column prop="tec" sortable
                    width="120px" show-overflow-tooltip label="专业名称" align="center"  >
    </u-table-column>
    <u-table-column prop="allZero" min-width="100px" sortable label="零版图数量"  align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="getProgressVolume(scope, '零版图', 1, 0)">{{scope.row.allZero}}</el-button>
      </template>
    </u-table-column>
    <u-table-column prop="completeZero" min-width="100px" sortable label="零版图完成数量"  align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="getProgressVolume(scope,'完成零版图', 1, 2)">{{scope.row.completeZero}}</el-button>
      </template>
    </u-table-column>
    <u-table-column prop="incompleteZero" min-width="100px" sortable label="未完成零版图"  align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="getProgressIncompleteVolume(scope)">{{scope.row.incompleteZero}}</el-button>
      </template>
    </u-table-column>
    <u-table-column prop="completeRatio" min-width="100px" sortable label="完成比例"  align="center">
      <template slot-scope="scope">
        <span>{{Number(scope.row.completeRatio*100).toFixed(2) + "%"}}</span>
      </template>
    </u-table-column>
    <u-table-column prop="zeroNowComplete" min-width="100px" sortable label="本月零版图完成"  align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="getProgressVolume(scope,'本月完成零版图', 1, 1)">{{scope.row.zeroNowComplete}}</el-button>
      </template>
    </u-table-column>
    <u-table-column prop="plan0" min-width="100px" sortable label="本月零版图计划完成"  align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="getPlanVolume(scope,'本月完成零版图', 1)">{{scope.row.plan0}}</el-button>
      </template>
    </u-table-column>
    <u-table-column prop="upNowComplete" min-width="100px" sortable label="本月升版图完成"  align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="getProgressVolume(scope,'本月升版图完成', 2, 1)">{{scope.row.upNowComplete}}</el-button>
      </template>
    </u-table-column>
    <u-table-column prop="plan1" min-width="100px" sortable label="本月升版图计划完成"  align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="getPlanVolume(scope,'本月升办图计划完成', 2)">{{scope.row.plan1}}</el-button>
      </template>
    </u-table-column>
    <u-table-column prop="allNowComplete" min-width="100px" sortable label="本月完成数量"  align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="getProgressVolume(scope,'本月完成', 0, 1)">{{scope.row.allNowComplete}}</el-button>
      </template>
    </u-table-column>
  </u-table>
  <el-dialog
    :title="title"
    v-el-drag-dialog
    :visible.sync="visible"
    width="80%">
    <u-table border size="mini" :data="listData"
             class="u-table"
             :height="pageHeight"
             showBodyOverflow="title"
             showHeaderOverflow="title"
             :data-changes-scroll-top="false"
             :header-cell-style="{background:'#F5F5F5'}" :cell-style="this.CellStyleOne">
      <u-table-column
        type="index"
        align="center"
        width="50">
      </u-table-column>
      <u-table-column prop="number" sortable min-width="100px" show-overflow-tooltip label="卷册号" align="center"  >
      </u-table-column>
      <u-table-column prop="name" sortable min-width="180px" show-overflow-tooltip label="卷册名" align="center">
      </u-table-column>
      <u-table-column prop="workday" sortable width="100px" label="工时"  align="center">
      </u-table-column>
      <u-table-column prop="start_date" sortable width="100px" label="开始时间"  align="center">
      </u-table-column>
      <u-table-column prop="planned_publication_date" sortable width="100px" label="计划出版时间"  align="center">
      </u-table-column>
      <u-table-column prop="actual_publication_date" sortable width="100px" label="出版时间"  align="center">
      </u-table-column>
      <u-table-column prop="principal" sortable width="100px" label="主设"  align="center">
      </u-table-column>
      <u-table-column prop="designer" sortable width="100px" label="设计"  align="center">
      </u-table-column>
      <u-table-column prop="checker" sortable width="100px" label="校核"  align="center">
      </u-table-column>
    </u-table>
  </el-dialog>
</div>
</template>

<script>
export default {
name: "ProjectProgressDetails",
  data(){
  return {
    pageHeight : document.body.clientHeight,
    list : [],
    title : "",
    projectId : "",
    visible : false,
    listData : [],
    month : "",
  }
  },
  mounted() {
    this.projectId = this.$route.query.project_id;
    let a = new Date()
    this.month = a.getFullYear() + "-" + (Number(a.getMonth()) + 1).toString().padStart(2,0)
    this.getData();
  },
  methods : {
    getData() {
      this.$axios
        .post(this.$baseUrl + 'project/projectProgressById', {
            id: this.projectId,
            date: this.month,
            type: 0
          },
        )
        .then(res => {
          this.list = res.data.data
        })
        .catch(res => (console.log(res)));
    },
    getProgressVolume(scope, name, type, state) {
      this.listData = []
      this.title = scope.row.tec + name
      this.$axios
        .post(this.$baseUrl + 'project/progressVolume', {
            date: this.month,
            type: type,
            id: this.projectId,
            state: state,
            tec: scope.row.tec
          },
        )
        .then(res => {
          this.listData = res.data.data
          this.visible = true
        })
        .catch(res => (console.log(res)));
    },
    getPlanVolume(scope, name, type){
      this.listData = []
      this.title = scope.row.tec + name
      this.$axios
        .post(this.$baseUrl + 'project/planVolume', {
            date: this.month,
            type: type,
            id: this.projectId,
            tec: scope.row.tec
          },
        )
        .then(res => {
          this.listData = res.data.data
          this.visible = true
        })
        .catch(res => (console.log(res)));
    },
    getProgressIncompleteVolume(scope, name) {
      this.listData = []
      this.title = scope.row.tec + "未完成图纸"
      this.$axios
        .post(this.$baseUrl + 'project/progressIncompleteVolume', {
            id: this.projectId,
            tec: scope.row.tec
          },
        )
        .then(res => {
          this.listData = res.data.data
          this.visible = true
        })
        .catch(res => (console.log(res)));
    },
    arraySpanMethod({columns, data}) {
      const means = [] // 合计
      columns.forEach((column, columnIndex) => {
        if ( columnIndex === 1 ) {
          means.push('合计')
        }else if (columnIndex === 5) {
          means[columnIndex] = ""
        }
        else {
          const values = data.map(item => Number(item[column.property]));
          // 合计
          if (!values.every(value => isNaN(value))) {
            means[columnIndex] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return (prev * 100 + curr * 100) / 100;
              } else {
                return prev;
              }
            }, 0);
            // 改变了ele的合计方式，扩展了合计场景
            // 你以为就只有上面这样玩吗？错啦，你还可以自定义样式哦
            // means[columnIndex] = '<span style="color: red">' + means[columnIndex] + '元</span>'
            means[columnIndex] = this.keepTwoDecimal(means[columnIndex])
          } else {
            means[columnIndex] = '';
          }
        }
      })// 返回一个二维数组的表尾合计(不要平均值，你就不要在数组中添加)
      console.log(means)
      return [means]
    },
    keepTwoDecimal(num) {
    let result = parseFloat(num);
    if (isNaN(result)) {
      alert('传递参数错误，请检查！');
      return false;
    }
    result = Math.round(num * 100) / 100;
    return result;
    },
  }
}
</script>

<style scoped>
</style>
