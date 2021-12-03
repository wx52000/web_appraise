<template>
<div>
  <el-row style="background-color: #FFF; text-align: center">
      <el-row style="text-align: center; align-content: center;">
        <el-col :span="24" style="line-height: 50px;font-size: 16px;font-weight: bold;color: #666;text-align: center ">
          工时信息
        </el-col>
      </el-row>
  </el-row>
      <ux-grid use-virtual border :data="workdayList" class="ux-table"
           :max-height=pageHeight
           size = "mini" :cell-style="this.CellStyleOne">
        <ux-table-column field="username" width="100" fixed sortable title="工号" align="center"  >
        </ux-table-column>
        <ux-table-column field="name" width="100" fixed sortable title="姓名" align="center"  >
        </ux-table-column>
        <ux-table-column field="sum"  width="100" sortable title="总工时" align="center">
        </ux-table-column>
        <ux-table-column field="volumeSum"  width="100" sortable title="卷册工时" align="center"  >
        </ux-table-column>
        <ux-table-column field="virtualCount" width="100" sortable title="初设项目工时" align="center" style="word-break: break-all;">
        </ux-table-column>
        <ux-table-column field="activityCount" width="100" sortable title="其它项目工时" align="center">
        </ux-table-column>
        <ux-table-column field="designer" width="120" sortable title="卷册设计人工时" align="center">
        </ux-table-column>
        <ux-table-column field="checker" width="120" sortable title="卷册互校人工时" align="center">
        </ux-table-column>
        <ux-table-column field="principal" width="120" sortable title="卷册主设人工时" align="center">
        </ux-table-column>
        <ux-table-column field="headman" width="100" sortable title="卷册组长工时" align="center">
        </ux-table-column>
        <ux-table-column field="designer_high2" width="100" sortable title="提前发放工时" align="center">
        </ux-table-column>
        <ux-table-column field="workday_high" width="120" sortable title="提前发完成工时" align="center">
        </ux-table-column>
        <ux-table-column  width="200px" align="center"  fixed="right">
          <template slot="header" slot-scope="scope">
            <el-date-picker
              v-model="nowMoth"
              field="month"
              style="width: 160px"
              size="mini"
              type="month"
              @change="getData"
              format="yyyy-MM"
              value-format="yyyy-MM"
              placeholder="选择月">
            </el-date-picker>
          </template>
          <template slot-scope="scope">
            <el-row>
                <el-button
                  size="mini"
                  @click="openLog(scope.row)">工时详情 </el-button>
            </el-row>
          </template>
        </ux-table-column>
  </ux-grid>
  <el-dialog
    :visible.sync="visible"
    width="60%">
    <u-table key="logList" use-virtual :row-height="28" :data="logList" class="u-table"
             size = "mini" :border="false" :cell-style="this.CellStyleOne"
             height="360px">
      <u-table-column prop="principal" min-width="10%" label="主设人/发放人" align="center"  >
      </u-table-column>
      <u-table-column prop="workday" min-width="10%" label="工时数量" align="center">
      </u-table-column>
      <u-table-column prop="type" min-width="15%" label="工时类型" align="center"  >
        <template slot-scope="scope">
          <span>{{scope.row.type|typeFilter}}</span>
        </template>
      </u-table-column>
      <u-table-column prop="number" min-width="15%" label="卷册号/项目号" align="center" style="word-break: break-all;">
      </u-table-column>
    </u-table>
  </el-dialog>
</div>
</template>

<script>
const type = [{id :1, explain : "卷册工时"},
  {id :2, explain : "卷册提前发放"},
  {id :3, explain : "卷册发放剩余"},
  {id :4, explain : "备用工时"},
  {id :5, explain : "初设项目工时"},
  {id :6, explain : "其它项目工时"}]
export default {
name: "workday",
  data(){
  return{
    visible : false,
    nowMoth : "",
    pageHeight : document.body.clientHeight-50,
    workdayList : [],
    logList : [],
    }
  },
  filters:{
    typeFilter(value){
      let  obj = type.find(value1 => {
        return value1.id === value
      })
      return obj.explain
    }
  },
  mounted(){
    let  a = new Date();
    this.nowMoth = a.getFullYear() + "-" + (Number(a.getMonth()) + 1).toString().padStart(2,0)
  this.getData()
  },
  methods:{
    getData(){
      this.$axios
        .post(this.$baseUrl + 'user/workday', {},{headers:{queryDate: this.nowMoth}}
        )
        .then(res => {
          this.workdayList = res.data.data
        })
        .catch(res => (console.log(res)));
      },
    openLog(row){
      this.$axios
        .post(this.$baseUrl + 'user/workdayLog',{
          id : row.id,
          date : this.nowMoth
        })
        .then(res =>{
          this.logList = res.data.data;
          this.visible  = true
        })
        .catch(res => (console.log(res)));
    }

  }
}
</script>

<style scoped>

</style>
