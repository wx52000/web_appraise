<template>
  <div>
    <el-row style="background-color: #FFF; text-align: center">
      <el-row style="text-align: center; align-content: center;">
        <el-col :span="24" style="line-height: 50px;font-size: 16px;font-weight: bold;color: #666;text-align: center ">
          工时信息
          <i class="el-icon-document-copy" @click="downExcel()"></i>
        </el-col>
      </el-row>
    </el-row>
    <el-row style="text-align: right;margin-right: 60px">
    </el-row>
    <ux-grid ref="userTable" use-virtual border :data="workdayList" class="ux-table"
             :max-height=pageHeight
             size = "mini" :cell-style="this.CellStyleOne">
      <ux-table-column field="username" width="10%" fixed sortable title="工号" align="center"  >
      </ux-table-column>
      <ux-table-column field="name" width="10%" fixed sortable title="姓名" align="center"  >
      </ux-table-column>
      <ux-table-column field="tec" width="10%" fixed
                       :filters="tecList" :filter-method="filterHandler"
                       title="专业" align="center"  >
      </ux-table-column>
      <ux-table-column field="workday"  min-width="10%" sortable title="总工时" align="center">
      </ux-table-column>
      <ux-table-column field="volume_workday"  min-width="10%" sortable title="卷册工时" align="center"  >
      </ux-table-column>
      <ux-table-column field="task_workday" min-width="10%" sortable title="非卷册工时" align="center" style="word-break: break-all;">
      </ux-table-column>
      <ux-table-column field="manage" min-width="10%" sortable title="设总管理工时" align="center">
      </ux-table-column>
      <ux-table-column field="advance_workday" min-width="10%" sortable title="预发工时" align="center">
      </ux-table-column>
      <ux-table-column field="scientific" min-width="10%" sortable title="科技工时" align="center">
      </ux-table-column>
      <ux-table-column field="deduct" min-width="10%" sortable title="奖惩工时" align="center">
      </ux-table-column>
      <ux-table-column  width="200px" align="center"  fixed="right">
        <template slot="header" slot-scope="scope">
          <el-date-picker
            v-model="nowMonth"
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
      v-el-drag-dialog
      :visible.sync="visible"
      width="60%">
      <u-table key="logList" use-virtual :row-height="28" :data="logList" class="u-table"
               size = "mini" :border="false" :cell-style="this.CellStyleOne"
               height="360px">
        <u-table-column prop="pnum" min-width="10%" show-overflow-tooltip label="项目编号" align="center"  >
        </u-table-column>
        <u-table-column prop="pname" min-width="10%" show-overflow-tooltip label="项目名称" align="center"  >
        </u-table-column>
        <u-table-column prop="number" min-width="15%" show-overflow-tooltip label="任务编号" align="center" style="word-break: break-all;">
        </u-table-column>
        <u-table-column prop="name" min-width="15%" show-overflow-tooltip  label="任务名称" align="center" style="word-break: break-all;">
        </u-table-column>
        <u-table-column prop="handler" min-width="10%" label="主设人/发放人" align="center"  >
        </u-table-column>
        <u-table-column prop="workday" width="80px" label="工时数量" align="center">
        </u-table-column>
        <u-table-column prop="type" width="80px" label="类型" align="center"  >
          <template slot-scope="scope">
            <span>{{scope.row.type|typeFilter}}</span>
          </template>
        </u-table-column>
        <u-table-column prop="role" width="60px" label="角色" align="center"  >
          <template slot-scope="scope">
            <span>{{scope.row.role|roleFilter}}</span>
          </template>
        </u-table-column>
      </u-table>
    </el-dialog>
    <el-dialog
      v-el-drag-dialog
      title="当前未审核任务单"
      :visible.sync="notSubmitVisible"
      width="60%">
      <u-table key="logList" use-virtual :row-height="28" :data="notSubmitList" class="u-table"
               size = "mini" :border="false" :cell-style="this.CellStyleOne"
               height="360px">
        <u-table-column prop="pNumber" min-width="10%" show-overflow-tooltip label="项目编号" align="center"  >
        </u-table-column>
        <u-table-column prop="pName" min-width="10%" show-overflow-tooltip label="项目名称" align="center"  >
        </u-table-column>
        <u-table-column prop="general" min-width="10%" label="设总" align="center"  >
        </u-table-column>
        <u-table-column prop="number" min-width="15%" show-overflow-tooltip label="任务编号" align="center" style="word-break: break-all;">
        </u-table-column>
        <u-table-column prop="name" min-width="15%" show-overflow-tooltip  label="任务名称" align="center" style="word-break: break-all;">
        </u-table-column>
        <u-table-column prop="tec" min-width="10%" label="专业" align="center"  >
        </u-table-column>
        <u-table-column prop="workday" width="80px" label="工时数量" align="center">
        </u-table-column>
      </u-table>
    </el-dialog>
  </div>
</template>

<script>
const type = [{id :0, explain : "管理工时"},
  {id :1, explain : "备用工时"},
  {id :2, explain : "卷册工时"},
  {id :3, explain : "提前发放"},
  {id :4, explain : "提前发完成"},
  {id :5, explain : "奖惩工时"},
  {id :6, explain : "科技工时"},]
const role = [{id :0, explain : "设计"},
  {id :1, explain : "校核"},
  {id :2, explain : "主设"},
  {id :3, explain : "组长"},
  {id :5, explain : "设总"},]
export default {
  name: "managerWorkday",
  data(){
      return{
        visible : false,
        nowMonth : "",
        pageHeight : document.body.clientHeight-50,
        workdayList : [],
        logList : [],
        tecList : [],
        loading : false,
        notSubmitVisible : false,
        notSubmitList : [],
        newVisible : false,
      }
    },
    filters:{
      typeFilter(value){
        let  obj = type.find(value1 => {
          return value1.id === value
        })
        console.log(obj)
        return obj.explain
      },
      roleFilter(value){
        let  obj = role.find(value1 => {
          return value1.id === value
        })
        return obj.explain
      }
    },
    mounted(){
      this.$axios
        .post(this.$baseUrl + 'project/declareDay'
        )
        .then(res => {
          let day = res.data.data
          const c = new Date(new Date().getTime()-3600*24*day*1000)
          let month1 = c.getFullYear() + "-" + (Number(c.getMonth()) + 1).toString().padStart(2,0)
          this.nowMonth = month1
          this.getData()
        })
        .catch(res => (console.log(res)));

    },
    methods:{
      getData(){
        this.$axios
          .post(this.$baseUrl + 'project/notSubmitByManage')
          .then(res => {
            if (res.data.data.length > 0) {
              this.notSubmitList = res.data.data
              this.notSubmitVisible = true
            }
          })
          .catch(res => (console.log(res)));
        this.$axios
          .post(this.$baseUrl + 'user/workdayByManager', {},{headers:{queryDate: this.nowMonth}}
          )
          .then(res => {
            this.workdayList = res.data.data
            res.data.data.forEach(item =>{
              this.tecList.push2({value:item.tec,label:item.tec})
            })
            const column = this.$refs.userTable.getColumnByField('tec')
            // 修改筛选列表，并默认设置为选中状态
            this.$refs.userTable.setFilter(column,this.tecList)
            // 修改条件之后，需要手动调用 updateData 处理表格数据
            this.$refs.userTable.updateData()
          })
          .catch(res => (console.log(res)));
      },
      openLog(row){
        this.$axios
          .post(this.$baseUrl + 'user/workdayLog',{
            id : row.id,
            date : this.nowMonth
          })
          .then(res =>{
            this.logList = res.data.data;
            this.visible  = true
          })
          .catch(res => (console.log(res)));
      },
      filterHandler({value, row, column}){
        const property = column['property'];
        return row[property] === value;
      },
      remoteMethod(query) {
        if (query !== '') {
          this.nameLoading = true;
          setTimeout(() => {
            this.$axios
              .post(this.$baseUrl + 'user/queryByUserIdSameDep',{},
                {headers: {name : query}}
              )
              .then(res => {
                if (res.data.data != null) {
                  this.generalList = res.data.data
                }
              });
            this.nameLoading = false;
          }, 200);
        } else {
          this.nameList = [];
        }
      },
    downExcel(){
      // 工时日志
      let that = this;
      this.$message.success("即将开始下载");
      let xhr = new XMLHttpRequest();
      let u =  that.$baseUrl + 'projectExcel/userByManage?date=' + that.nowMonth
      xhr.open("get", u, true); // get、post都可
      xhr.responseType = "blob";  // 转换流
      xhr.setRequestHeader("Authorization", this.$storage.get("Authorization")); // token键值对
      xhr.onload = function() {
        if (this.status === 200) {
          let blob = this.response;
          let a = document.createElement("a")
          let url = window.URL.createObjectURL(blob)
          a.href = url
          a.download =  that.nowMonth + "工时日志表.xlsx"  // 文件名
          a.click()
          window.URL.revokeObjectURL(url)
        }
      }
      xhr.send();
    },
  }
}
</script>

<style scoped>

</style>
