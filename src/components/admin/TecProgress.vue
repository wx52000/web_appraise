<template>
<div>
  <el-row style="text-align: center; align-content: center;">
    <el-col :span="24" style="line-height: 50px;font-size: 16px;font-weight: bold;color: #666;text-align: center ">
      生产任务-专业
    </el-col>
  </el-row>
  <el-row >
    <el-col :span="12" style="text-align: left;">
      <el-radio-group v-model="show" style="margin-left: 10%">
      <el-radio :label="2">显示完成</el-radio>
      <el-radio :label="1">显示计划</el-radio>
      <el-radio :label="3">全显</el-radio>
    </el-radio-group></el-col>
    <el-col :span="12" style="text-align: right;">
      <el-date-picker
        v-model="year"
        type="year"
        value-format="yyyy"
        @change="getData"
        size="mini"
        style="margin-right: 20%"
        placeholder="选择年">
      </el-date-picker>
    </el-col>
  </el-row>
  <u-table :row-height="28" border size="mini" :data="list"
           :max-height="pageHeight"
           showBodyOverflow="tooltip"
           showHeaderOverflow="title"
           :data-changes-scroll-top="false"
           show-summary
           :summary-method="arraySpanMethod"
           :header-cell-style="{background:'#F5F5F5'}" :cell-style="backgroundStyle">
    <u-table-column
      type="index"
      align="center"
      width="50">
    </u-table-column>
    <u-table-column prop="tec" sortable
                    :filters="tecList"
                    :filter-method="filterHandler"
                    width="100px" show-overflow-tooltip label="专业" align="center"  >
    </u-table-column>
    <u-table-column prop="type"
                    :filters="[{text:'零版',value:0},{text:'升版',value:1}]"
                    :filter-method="filterHandler"
                    width="60px" show-overflow-tooltip label="类型" align="center"  >
      <template slot-scope="scope">
        <span>{{scope.row.type | typeFilter}}</span>
      </template>
    </u-table-column>
    <u-table-column v-if="show !== 1" prop="1" min-width="50px" label="1" sortable  align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="getTecVolumeCompleteByDate(scope,1)">{{scope.row['1']}}</el-button>
      </template>
    </u-table-column>
    <u-table-column v-if="show !== 2" prop="plan1" min-width="60px" sortable label="1月计划"  align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="getTecVolumePlanCompleteByDate(scope,'01')">{{scope.row.plan1}}</el-button>
      </template>
    </u-table-column>
    <u-table-column v-if="show !== 1" prop="2" min-width="50px" sortable label="2"  align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="getTecVolumeCompleteByDate(scope,1)">{{scope.row['2']}}</el-button>
      </template>
    </u-table-column>
    <u-table-column v-if="show !== 2" prop="plan2" min-width="60px" sortable label="2月计划"  align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="getTecVolumePlanCompleteByDate(scope,'02')">{{scope.row.plan2}}</el-button>
      </template>
    </u-table-column>
    <u-table-column v-if="show !== 1" prop="3" min-width="50px" sortable label="3"  align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="getTecVolumeCompleteByDate(scope,1)">{{scope.row['3']}}</el-button>
      </template>
    </u-table-column>
    <u-table-column v-if="show !== 2" prop="plan3" min-width="60px" sortable label="3月计划"  align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="getTecVolumePlanCompleteByDate(scope,'03')">{{scope.row.plan3}}</el-button>
      </template>
    </u-table-column>
    <u-table-column v-if="show !== 1" prop="4" min-width="50px" sortable label="4"  align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="getTecVolumeCompleteByDate(scope,1)">{{scope.row['4']}}</el-button>
      </template>
    </u-table-column>
    <u-table-column v-if="show !== 2" prop="plan4" min-width="60px" sortable label="4月计划"  align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="getTecVolumePlanCompleteByDate(scope,'04')">{{scope.row.plan4}}</el-button>
      </template>
    </u-table-column>
    <u-table-column v-if="show !== 1" prop="5" min-width="50px" sortable label="5"  align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="getTecVolumeCompleteByDate(scope,1)">{{scope.row['5']}}</el-button>
      </template>
    </u-table-column>
    <u-table-column v-if="show !== 2" prop="plan5" min-width="60px" sortable label="5月计划"  align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="getTecVolumePlanCompleteByDate(scope,'05')">{{scope.row.plan5}}</el-button>
      </template>
    </u-table-column>
    <u-table-column v-if="show !== 1" prop="6" min-width="50px" sortable label="6"  align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="getTecVolumeCompleteByDate(scope,1)">{{scope.row['6']}}</el-button>
      </template>
    </u-table-column>
    <u-table-column v-if="show !== 2" prop="plan6" min-width="60px" sortable label="6月计划"  align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="getTecVolumePlanCompleteByDate(scope,'06')">{{scope.row.plan6}}</el-button>
      </template>
    </u-table-column>
    <u-table-column v-if="show !== 1" prop="7" min-width="50px" sortable label="7"  align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="getTecVolumeCompleteByDate(scope,1)">{{scope.row['7']}}</el-button>
      </template>
    </u-table-column>
    <u-table-column v-if="show !== 2" prop="plan7" min-width="60px" sortable label="7月计划"  align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="getTecVolumePlanCompleteByDate(scope,'07')">{{scope.row.plan7}}</el-button>
      </template>
    </u-table-column>
    <u-table-column v-if="show !== 1" prop="8" min-width="50px" sortable label="8"  align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="getTecVolumeCompleteByDate(scope,1)">{{scope.row['8']}}</el-button>
      </template>
    </u-table-column>
    <u-table-column v-if="show !== 2" prop="plan8" min-width="60px" sortable label="8月计划"  align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="getTecVolumePlanCompleteByDate(scope,'08')">{{scope.row.plan8}}</el-button>
      </template>
    </u-table-column>
    <u-table-column v-if="show !== 1" prop="9" min-width="50px" sortable label="9"  align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="getTecVolumeCompleteByDate(scope,1)">{{scope.row['9']}}</el-button>
      </template>
    </u-table-column>
    <u-table-column v-if="show !== 2" prop="plan9" min-width="60px" sortable label="9月计划"  align="center">
    <template slot-scope="scope">
      <el-button size="mini" type="text" @click="getTecVolumePlanCompleteByDate(scope,'09')">{{scope.row.plan9}}</el-button>
    </template>
  </u-table-column>

    <u-table-column v-if="show !== 1" prop="10" min-width="50px" sortable label="10"  align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="getTecVolumeCompleteByDate(scope,1)">{{scope.row['10']}}</el-button>
      </template>
    </u-table-column>
    <u-table-column v-if="show !== 2" prop="plan10" min-width="60px" sortable label="10月计划"  align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="getTecVolumePlanCompleteByDate(scope,'10')">{{scope.row.plan10}}</el-button>
      </template>
    </u-table-column>
    <u-table-column v-if="show !== 1" prop="11" min-width="50px" sortable label="11"  align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="getTecVolumeCompleteByDate(scope,1)">{{scope.row['11']}}</el-button>
      </template>
    </u-table-column>
    <u-table-column v-if="show !== 2" prop="plan11" min-width="60px" sortable label="11月计划"  align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="getTecVolumePlanCompleteByDate(scope,'11')">{{scope.row.plan11}}</el-button>
      </template>
    </u-table-column>
    <u-table-column v-if="show !== 1" prop="12" min-width="50px" sortable label="12"  align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="getTecVolumeCompleteByDate(scope,1)">{{scope.row['12']}}</el-button>
      </template>
    </u-table-column>
    <u-table-column v-if="show !== 2" prop="plan12" min-width="60px" sortable label="12月计划"  align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="getTecVolumePlanCompleteByDate(scope,'12')">{{scope.row.plan12}}</el-button>
      </template>
    </u-table-column>
    <u-table-column v-if="show !== 1" prop="avg" min-width="60px" sortable label="月均"  align="center">
    </u-table-column>
    <u-table-column v-if="show !== 1" prop="num" min-width="60px" sortable label="合计"  align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="getTecVolumeCompleteByDate(scope,2)">{{scope.row.num}}</el-button>
      </template>
    </u-table-column>
    <u-table-column v-if="show !== 1" prop="incomplete" min-width="60px" sortable label="存量"  align="center">
      <template slot-scope="scope">
        <el-button size="mini" type="text" @click="getTecVolumeInComplete(scope)">{{scope.row.incomplete}}</el-button>
      </template>
    </u-table-column>
    <u-table-column v-if="show !== 1" prop="rate" min-width="60px" sortable label="去化时间"  align="center">
    </u-table-column>
  </u-table>
  <el-dialog
    :title="title"
    v-el-drag-dialog
    :visible.sync="visible"
    width="80%">
    <u-table use-virtual :row-height="28" border size="mini" :data="listData"
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
      <u-table-column prop="pNumber" sortable min-width="120px" label="项目编号" align="center"  >
      </u-table-column>
      <u-table-column prop="pName" min-width="180px"
                      :filters="filtersList"
                      :filter-method="filterHandler"
                      label="项目名" align="center">
      </u-table-column>
      <u-table-column prop="number" sortable min-width="140px" label="卷册号" align="center"  >
      </u-table-column>
      <u-table-column prop="name" sortable min-width="180px"  label="卷册名" align="center">
      </u-table-column>
      <u-table-column prop="workday" sortable width="100px" label="工时"  align="center">
      </u-table-column>
      <u-table-column prop="start_date" sortable width="100px" label="开始时间"  align="center">
      </u-table-column>
      <u-table-column prop="actual_publication_date" sortable width="100px" label="实际出版时间"  align="center">
      </u-table-column>
      <u-table-column prop="planned_publication_date" sortable width="100px" label="计划出版时间"  align="center">
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
const typeName = [{type : 0, name : "零版"},
  {type : 1, name : "升版"},]
export default {
name: "TecProgress",
  data(){
  return {
    show : 2,
    pageHeight : document.body.scrollHeight-30,
    list : [],
    dialogVisible : false,
    title : "",
    visible : false,
    listData : [],
    year : "",
    filtersList : [],
    tecList : [],
  }
  },
  filters: {
    typeFilter(value) {
      let obj = typeName.find(value1 => {
        return value1.type === value
      })
      return obj.name
    },
  },
  mounted() {
    this.year = new Date().getFullYear().toString()
    this.getData()
  },
  methods:{
    getData(){
      this.$axios
        .post(this.$baseUrl + 'volume/tecProgress',{
            year : this.year,
          },
        )
        .then(res => {
          this.list = res.data.data
          this.list.forEach(item =>{
            this.tecList.push2({text: item.tec, value : item.tec})
          })
        })
        .catch(res => (console.log(res)));
    },
    getTecVolumeCompleteByDate(scope,state){
      let date = this.year
      if (scope.column.label !== "合计"){
        date = this.year + "-" + scope.column.label.padStart(2,0)
      }
      this.$axios
        .post(this.$baseUrl + 'volume/tecVolumeCompleteByDate',{
            date : date,
            tec : scope.row.tec,
            state : state,
            type : scope.row.type
          },
        )
        .then(res => {
          this.listData = res.data.data
          let map = new Map();
          this.filtersList = []
          this.listData.forEach( item =>{
            if (map.get(item.pName) === undefined || map.get(item.pName) === null){
              map.set(item.pName,1);
            }else {
              map.set(item.pName,map.get(item.pName)+1)
            }
          })
          map.forEach((v,k) =>{
            this.filtersList.push2({text: k + "("+ v + ")", value : k})
          })
          this.visible = true
        })
        .catch(res => (console.log(res)));
    },
    backgroundStyle({ row, column, rowIndex, columnIndex }) {
      if (column.label === Number(new Date().getMonth() + 1).toString() ||
        column.label === Number(new Date().getMonth() + 1) + "月计划") {
        return 'background:#FFFFCD;'
      }
    },
    getTecVolumePlanCompleteByDate(scope,month){
        let date = this.year + "-" + month
      this.$axios
        .post(this.$baseUrl + 'volume/tecVolumePlanCompleteByDate',{
            tec : scope.row.tec,
            type : scope.row.type,
            date : date
          },
        )
        .then(res => {
          this.listData = res.data.data
          let map = new Map();
          this.filtersList = []
          this.listData.forEach( item =>{
            if (map.get(item.pName) === undefined || map.get(item.pName) === null){
              map.set(item.pName,1);
            }else {
              map.set(item.pName,map.get(item.pName)+1)
            }
          })
          map.forEach((v,k) =>{
            this.filtersList.push2({text: k + "("+ v + ")", value : k})
          })
          this.visible = true
        })
        .catch(res => (console.log(res)));
    },
    getTecVolumeInComplete(scope){
      this.$axios
        .post(this.$baseUrl + 'volume/tecVolumeInCompleteByDate',{
            tec : scope.row.tec,
            type : scope.row.type
          },
        )
        .then(res => {
          this.listData = res.data.data
          let map = new Map();
          this.filtersList = []
          this.listData.forEach( item =>{
            if (map.get(item.pName) === undefined || map.get(item.pName) === null){
              map.set(item.pName,1);
            }else {
              map.set(item.pName,map.get(item.pName)+1)
            }
          })
          map.forEach((v,k) =>{
            this.filtersList.push2({text: k + "("+ v + ")", value : k})
          })
          this.visible = true
        })
        .catch(res => (console.log(res)));
    },
    arraySpanMethod({  columns, data }) {
      const means = [] // 合计
      columns.forEach((column, columnIndex) => {
        if (columnIndex === 0) {
          means.push('合计')
        }else if(columnIndex === 18) {

        }else {
          const values = data.map(item => Number(item[column.property]));
          // 合计
          if (!values.every(value => isNaN(value))) {
            means[columnIndex] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            // 改变了ele的合计方式，扩展了合计场景
            // 你以为就只有上面这样玩吗？错啦，你还可以自定义样式哦
            // means[columnIndex] = '<span style="color: red">' + means[columnIndex] + '元</span>'
            means[columnIndex] = means[columnIndex]
          } else {
            means[columnIndex] = '';
          }
        }
      })
      // 返回一个二维数组的表尾合计(不要平均值，你就不要在数组中添加)
      return [means]
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },

  }
}
</script>
