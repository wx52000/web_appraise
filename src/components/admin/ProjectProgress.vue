<template>
<div>
  <el-row style="text-align: center; align-content: center;">
    <el-col :span="24" style="line-height: 50px;font-size: 16px;font-weight: bold;color: #666;text-align: center ">
      生产任务-项目
    </el-col>
  </el-row>
  <el-row>
    <el-col :span="16">
      项目编号/项目名<el-input style="width: 50%" v-model="search" size="mini" placeholder="请输入内容"></el-input>
    </el-col>
    <el-col :span="8">
    <el-date-picker
      v-model="month"
      type="month"
      value-format="yyyy-MM"
      @change="getData"
      size="mini"
      placeholder="选择月">
    </el-date-picker>
    </el-col>
  </el-row>
  <u-table use-virtual :row-height="28" border size="mini" :data="list.filter(data =>{
            return  !search || data.number.toLowerCase().includes(search.toLowerCase())
            || data.name.toLowerCase().includes(search.toLowerCase())})"
           class="u-table"
           :height="pageHeight"
           showBodyOverflow="tooltip"
           showHeaderOverflow="title"
           :data-changes-scroll-top="false"
           :header-cell-style="{background:'#F5F5F5'}" :cell-style="this.CellStyleOne">
    <u-table-column
      type="index"
      align="center"
      width="50">
    </u-table-column>
    <u-table-column prop="number" sortable
                    width="120px" show-overflow-tooltip label="项目编号" align="center"  >
    </u-table-column>
    <u-table-column prop="name" sortable width="160px" show-overflow-tooltip label="项目名" align="center">
    </u-table-column>
    <u-table-column prop="allZero" min-width="80px" label="所有零版图"  align="center">
    </u-table-column>
    <u-table-column prop="completeZero" min-width="80px" label="已完成零版图"  align="center">
    </u-table-column>
    <u-table-column  min-width="80px" label="完成比例"  align="center">
      <template slot-scope="scope">
        <span>{{Number(scope.row.comRatio * 100).toFixed(2) + '%'}}</span>
      </template>
    </u-table-column>
    <u-table-column prop="incompleteZero" min-width="80px" label="未完成零版图"  align="center">
    </u-table-column>
    <u-table-column prop="nowMonthZero" min-width="80px" label="完成零版"  align="center">
    </u-table-column>
    <u-table-column prop="nowMonthUp" min-width="80px" label="完成升版"  align="center">
    </u-table-column>
    <u-table-column  min-width="100px" label="操作"  align="center">
      <template slot-scope="scope">
        <el-button size="mini" @click="openVolumeList(scope.row)">项目主页</el-button>
      </template>
    </u-table-column>
  </u-table>
</div>
</template>

<script>
export default {
  name: "ProjectProgress",
  data() {
    return {
      pageHeight : document.body.scrollHeight-30,
      list : [],
      dialogVisible : false,
      title : "",
      visible : false,
      listData : [],
      search : "",
      month : ""
    }
  },
  mounted() {
    let a = new Date()
    this.month = a.getFullYear() + "-" + (Number(a.getMonth()) + 1).toString().padStart(2,0)
    this.getData();
  },
  methods: {
    arraySpanMethod({ row, column, rowIndex, columnIndex }){
      if (columnIndex === 0 || columnIndex === 1){
        if (rowIndex % 3 === 0) {
          return {
            rowspan: 3,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    getData() {
      this.$axios
        .post(this.$baseUrl + 'project/projectProgress',{
          date : this.month,
          type : 0
          },
        )
        .then(res => {
          this.list = res.data.data
        })
        .catch(res => (console.log(res)));
    },
    openVolumeList(project){
      console.log(project)
      const href = this.$router.resolve(
        {
          path: "/projectMain",
          name: "projectMain",
          query:{
            "project_id" : project.id
          }
        }
      )
      window.open( href.href,project.id)
    },
  }
}
</script>

<style scoped>

</style>
