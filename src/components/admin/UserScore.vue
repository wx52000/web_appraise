<template>
<div>
  <el-row  style="margin-top: 10px;text-align: right">
    <el-button v-if="position.indexOf('11') !== -1"
               size="mini" @click="openRatio">专业工时分配比例管理</el-button>
    <el-button size="mini" @click="openExcel">Excel 下载</el-button>
    <el-button size="mini" style="margin-right: 50px" @click="openScore">本季度评价得分</el-button>
  </el-row>
    <el-tabs tab-position="left" style="margin-bottom: 30px;margin-top: 20px">
      <el-tab-pane label="设总项目管理"
                   v-if="projectList.length !== 0">
    <el-table border :data="projectList" class="el-table"
              :header-cell-style="{background:'#9ff9f9'}"
              size = "mini">
      <el-table-column prop="number" min-width="18%" label="项目编号" align="center"  >
      </el-table-column>
      <el-table-column prop="projectName" min-width="30%" label="项目名称" align="center">
      </el-table-column>
      <el-table-column prop="director" min-width="8%" label="主管设总" align="center"  >
      </el-table-column>
      <el-table-column prop="general" min-width="8" label="设总" align="center" style="word-break: break-all;">
      </el-table-column>
      <el-table-column prop="state" min-width="8%" label="项目状态" align="center">
      </el-table-column>
      <el-table-column prop="amount"  min-width="8%" label="卷册总数"  align="center">
      </el-table-column>
      <el-table-column  min-width="20%" align="center">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="12">
              <el-button
                size="mini"
                @click="openProject(scope.row)">卷册详情</el-button>
            </el-col>
            <el-col :span="12">
              <el-button
                size="mini"
                @click="openVolumeList(scope.row.projectPhaseID)">卷册目录</el-button>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
    </el-table>
      </el-tab-pane>
      <el-tab-pane label="施工图卷册">
        <el-table border :data="volumeList" class="el-table" :header-cell-style="{background:'#1a80ef',color:'#000000'}"
                  :default-sort = "{prop: 'date', order: 'descending'}"
                  :row-key="getRowKeys"
                  :max-height="pageHeight"
                  size="mini"
                  lazy
                  :load="load"
                  :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
          <el-table-column fixed prop="number" width="200"  label="卷册号" sortable>
          </el-table-column>
          <el-table-column prop="volumeName" width="220" label="卷册名称" sortable>
          </el-table-column>
          <el-table-column prop="workday" width="80" label="工时"  align="center"
                           sortable>
          </el-table-column>
          <el-table-column prop="state"  width="80" label="状态"
                           :filters="[{text:'尚未开展',value:'尚未开展'},{text:'正在设计',value:'正在设计'},
                            {text:'正在校审',value:'正在校审'},{text:'代送出版',value:'代送出版'},
                            {text:'正在出版',value:'正在出版'},{text:'代送业主',value:'代送业主'},
                            {text:'已完成交付设总',value:'已完成交付设总'},{text:'已完成交付业主',value:'已完成交付业主'}]"
                           :filter-method="filterHandler">
          </el-table-column>
          <el-table-column prop="projectName" width="220" label="项目名称"
                           :filters=volumeProject
                           :filter-method="filterHandler">
          </el-table-column>
          <el-table-column prop="planned_shot_date" width="120"  label="计划出手日期" sortable>
          </el-table-column>
          <el-table-column prop="planned_publication_date" width="120" label="计划出版日期" sortable>
          </el-table-column>
          <el-table-column prop="proofreading_date" width="120"  label="互交完成日期" sortable>
          </el-table-column>
          <el-table-column prop="complete_time" width="100"  label="完成日期" sortable>
          </el-table-column>
          <el-table-column prop="dep" width="90"  label="部门" sortable>
          </el-table-column>
          <el-table-column prop="tec" align="center" width="100" label="专业" sortable>
          </el-table-column>
          <el-table-column
            align="center" width="120" fixed="right">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="openVolume(formId = scope.row.rollId)">卷册详情页面</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    <el-tab-pane label="初设可研工时">
      <el-table border :data="virtualList" class="el-table"
                :max-height="pageHeight"
                :row-class-name="rowClassName"
                :header-cell-style="{background:'#ece4a7',color:'#000000'}"
                size="mini">
        <el-table-column prop="number"  label="项目编号" align="center"  >
        </el-table-column>
        <el-table-column prop="name"   label="项目名称" align="center">
        </el-table-column>
        <el-table-column prop="workday"   label="可分配工时" align="center" style="word-break: break-all;">
        </el-table-column>
        <el-table-column prop="workday"  label="已分配工时" align="center" style="word-break: break-all;">
        </el-table-column>
        <el-table-column prop="general"   label="设总" align="center" style="word-break: break-all;">
        </el-table-column>
        <el-table-column  align="center"  fixed="right">
          <template  slot-scope="scope">
            <el-row>
                <el-button :disabled="scope.row.role === 3"
                           size="mini"
                           @click="openVirtual(scope.row)">工时分配</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    <el-tab-pane label="业务建设工时">
      <el-table border :data="activityList" class="el-table"
                :max-height="pageHeight"
                :row-class-name="rowClassName"
                :header-cell-style="{background:'#F5F5F5',color:'#000000'}"
                style="margin-left: 10px"
                size="mini">
        <el-table-column prop="name"   label="活动名称" align="center">
        </el-table-column>
        <el-table-column prop="workday"  label="可分配工时" align="center" style="word-break: break-all;">
        </el-table-column>
        <el-table-column prop="workday"  label="已分配工时" align="center" style="word-break: break-all;">
        </el-table-column>
        <el-table-column prop="general" label="总负责人" align="center" style="word-break: break-all;">
        </el-table-column>
        <el-table-column prop="start_date"   label="开始时间" align="center" style="word-break: break-all;">
        </el-table-column>
        <el-table-column prop="end_date"  label="结束时间" align="center" style="word-break: break-all;">
        </el-table-column>
        <el-table-column  align="center"  fixed="right">
          <template  slot-scope="scope">
            <el-row>
                <el-button :disabled="scope.row.role === 3"
                           size="mini"
                           @click="openActivity(scope.row)">工时分配</el-button>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-tab-pane>
    </el-tabs>
  <el-dialog
   :visible.sync="visible_score"
    v-if="visible_score"
    width="30%">
      <el-collapse >
        <el-collapse-item  style="text-align: left" name="1">
          <template slot="title">
            <span >本季度个人得分:</span>
            <span style="font-weight: bold">{{User.score}}</span>
          </template>
          <div>质量平均得分：{{User.designer}}</div>
          <div>进度平均得分：{{User.personal}}</div>
          <div>配合平均得分：{{User.coordinate}}</div>
        </el-collapse-item>
        <el-collapse-item  v-if="Tec.score !== undefined" style="text-align: left" name="2">
          <template slot="title">
            <span>本季度专业得分:{{Tec.score}}</span>
          </template>
          <div>质量平均得分：{{Tec.designer}}</div>
          <div>进度平均得分：{{Tec.personal}}</div>
          <div>配合平均得分：{{Tec.coordinate}}</div>
        </el-collapse-item>
      </el-collapse>
  </el-dialog>
  <el-dialog
    :visible.sync="visible_workday"
    @close="closeDialog"
    width="70%" v-if='visible_workday'>
    <el-container>
        <el-main>
          <el-form :model="workday" ref="workday">
              <el-row>
                <el-col :span="12" style="font-weight: bold">
                  设计人名称
                </el-col>
                <el-col :span="12" style="font-weight: bold">
                  设计人获得工时
                </el-col>
              </el-row>
              <el-row v-for="(item,index) in workday.list" style="margin-top: 5px" :key="index">
                <el-col :span="12">
                  {{item.name}}
                </el-col>
                <el-col :span="12">
                  <el-input type="type" size="mini" style="width: 50%" v-model="item.workday"></el-input>
                </el-col>
              </el-row>
          <el-button  size="small " style="margin-right: 10%" @click="closeDialog()">取消</el-button>
          <el-button type="primary" size="small " style="margin-left: 10%" @click="submit">确定</el-button>
          </el-form>
        </el-main>
    </el-container>
  </el-dialog>
  <el-dialog
    title="Excel导出"
    :visible.sync="excelDialog"
    width="40%" style="text-align: center">
    <el-row >
      <el-col :span="24" align="center">
        <template>
          <el-date-picker
            v-model="downMonth"
            type="daterange"
            value-format="yyyy-MM-dd"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </template>
      </el-col>
    </el-row>
    <el-row align="center" style="margin-top: 20px">
      <el-button @click="downExcel1()" style="width: 250px">共完成卷册汇总</el-button>
    </el-row>
    <el-row align="center"style="margin-top: 20px">
      <el-button @click="downExcel()" style="width: 250px">施工图共获得工时</el-button>
    </el-row>
  </el-dialog>
  <el-dialog
    title="工时分配比例"
    :visible.sync="ratioDialog"
    width="40%" style="text-align: center">
    <el-form :model="ratio" :rules="rules" >
      <el-row>
      <el-form-item label-width="160px"
                    style="margin-left: -50px" label="设计人所得比例:"
                    prop="designer">
        <el-input v-model="ratio.designer" oninput="value=value.replace(/[^\d.]/g,'')"  >
          <template slot="append">
            %</template>
        </el-input>
      </el-form-item >
        <el-form-item label-width="160px"
                      style="margin-left: -50px" label="互校人所得比例:"
                      prop="checker">
          <el-input v-model="ratio.checker" oninput="value=value.replace(/[^\d.]/g,'')">
            <template slot="append">
              %</template>
          </el-input>
        </el-form-item>
        <el-form-item label-width="160px"
                      style="margin-left: -50px" label="主设人所得比例:"
                      prop="principal">
          <el-input v-model="ratio.principal" oninput="value=value.replace(/[^\d.]/g,'')">
            <template slot="append">
              %</template>
          </el-input>
        </el-form-item>
        <el-form-item label-width="160px"
                      style="margin-left: -50px" label="组长所得比例:"
                      prop="headman">
          <el-input v-model="ratio.headman" oninput="value=value.replace(/[^\d.]/g,'')">
            <template slot="append">
              %</template>
          </el-input>
        </el-form-item>
        <el-form-item style="margin-left: -50px;text-align: center">
          <el-button @click="ratioDialog = false">取消</el-button>
          <el-button @click="ratioSubmit" type="primary">确认</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-dialog>
  <news-dialog class="news" :is-show="isShow" @click.native="isShow = !isShow">
  </news-dialog>
</div>
</template>

<script>
export default {
name: "UserScore",
  data(){
    const rule = async(rule, value, callback) =>{
      let sum = 0;
      sum = Number(this.ratio.designer) + Number(this.ratio.checker)
        + Number(this.ratio.principal) + Number(this.ratio.headman)
      console.log(sum)
      if (sum > 100){
        this.ruled = true;
        return callback(new Error("比例之和不能超出100%"))
      }else{
        this.ruled = false;
        return callback;
      }
    }
  return{
    getRowKeys(row) {
      return row.id;
    },
    id: "",
    pid: "",
    tid : "",
    position : "",
    pageHeight : document.body.offsetHeight,
    isShow : false,
    nowDay: new Date().getDate(),
    month: new Date().getMonth() + 1,
    listMonth : [],
    pageIndex: 1,
    pageSize: 10,
    User :{},
    Tec : {},
    loading : true,
    projectList : [],
    volumeList : [],
    volumeProject : [],
    visible_score : false,
    visible_workday : false,
    virtualList : [],
    activityList : [],
    visible_designer : false,
    workday : {
      list : []
    },
    excelDialog : false,
    downMonth : [],
    ratioDialog : false,
    ratio : {},
    ruled : false,
    rules: {
      designer:
        {required: true, validator:rule, trigger: 'change'},
      principal:
        {required: true, validator:rule, trigger: 'change'},
      checker:
        {required: true, validator:rule, trigger: 'change'},
      headman:
        {required: true, validator:rule, trigger: 'change'},

    }
  }
  },
  mounted() {
    this.getLogIn();
  },
  methods: {
    search() {
      this.getData();
    },
    reset() {
      this.pageIndex = 1;
      this.getData();
    },
    rowClassName({row, rowIndex}) {
      //把每一行的索引放进row
      row.index = rowIndex;
    },
    getLogIn() {
      let i = JSON.parse(sessionStorage.getItem("appraise"));
      this.id = i.id;
      this.pid = i.pid;
      this.tid = i.tid;
      this.position = i.position
      this.getData();
    },
    getData() {
    this.loading = false;
      this.$axios
        .post(this.$baseUrl + 'project/homepage',{
          "id" : this.id }
        )
        .then(res => {this.volumeList = res.data.data
          this.volumeList.forEach(item => {
            this.volumeProject.push2({value : item.projectName,text : item.projectName})
            }
          )
        })
        .catch(res => (console.log(res)));
      this.$axios
        .post(this.$baseUrl + 'virtual/homepage',{},{headers:{id : this.id}})
        .then(res => {this.virtualList = res.data.data
        })
        .catch(res => (console.log(res.data)))
      this.$axios
        .post(this.$baseUrl + 'activity/homepage',{},{headers:{id : this.id}})
        .then(res => {this.activityList = res.data.data
        })
        .catch(res => (console.log(res.data)))
      this.$axios
        .post(this.$baseUrl + 'project/queryByGeneral', {
            "id": this.id
          }
        )
        .then(res => {
          this.projectList = res.data.data
        })
        .catch(res => (console.log(res)));
  },
    load(tree, treeNode, resolve) {
      debugger
      this.$axios
        .post(this.$baseUrl + 'volume/queryByNumber',{
          "id" : this.id,
          "number" : tree.number}
        )
        .then(res => {
          resolve(res.data.data)
        })
        .catch(res => (console.log(res)));
      console.log(tree)
    },
    openScore(){
      this.visible_score = true
      this.$axios
        .post(this.$baseUrl + 'userScore/queryByScoreId', {
          "id": this.id,
        })
        .then(res => {
          if (res.data.data !== null)
            this.User = res.data.data
        })
        .catch(res => (console.log(res)));
      this.$axios
        .post(this.$baseUrl + 'tecScore/queryByScoreId', {
          "id": this.id,
        })
        .then(res => {
          if (res.data.data !== null)
            this.Tec = res.data.data})
        .catch(res => (console.log(res)));
    },
    openVolumeList(p){
      window.open('http://zmis.zepdi.com.cn/Portal/EPMS/List/RollInfo/RollEntityBill.aspx?' +
        'OrganizationId=' + p + '&secid=00000000-0000-0000-0000-000000000000&IsPortal=True')
    },
    openVolume(f){
      window.open('http://zmis.zepdi.com.cn/Portal/EPMS/List/RollInfo/ContentMange.aspx?actionType=1&RollID=' + f)
    },
    filterHandler(value, row, column){
      const property = column['property'];
      return row[property] === value;
    },
    openProject(project){
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
    openVirtual(row){
      if(row.role === 1){
        const href = this.$router.resolve(
          {
            path: "/virtualManage",
            name: "virtualManage",
            query:{
              "id" : row.id,
            }
          }
        )
        window.open( href.href,row.id)
      }else if (row.role === 2) {
        this.workday.type = 0;
        this.workday.id = row.id;
        this.$axios
          .post(this.$baseUrl + 'virtual/workdayByGroup', {}, {headers: {id: row.id, uid: this.id}})
          .then(res => {
            this.workday.list = res.data.data
            this.visible_workday = true;
          })
          .catch(res => (console.log(res)));
      }
    },
    openActivity(row){
      if (row.role === 1){
        const href = this.$router.resolve(
          {
            path: "/businessManage",
            name: "businessManage",
            query:{
              "id" : row.id,
            }
          }
        )
        window.open( href.href,row.id)
      }else if (row.role === 2) {
        this.workday.type = 1;
        this.workday.id = row.id;
        this.$axios
          .post(this.$baseUrl + 'activity/workdayByGroup', {}, {headers: {id: row.id, uid: this.id}})
          .then(res => {
            this.workday.list = res.data.data
            this.visible_workday = true;
          })
          .catch(res => (console.log(res)));
      }
    },
    closeDialog(){
      this.workday = {
        list : []
      };
    },
    submit(){
       if (this.workday.type === 0){
         this.$axios
           .post(this.$baseUrl + 'virtual/setDesignerWorkday',
             this.workday.list, {headers: {id: this.workday.id}})
           .then(res => {
             this.visible_workday = false;
           })
           .catch(res => (console.log(res)));
       }else if (this.workday.type === 1) {
         this.$axios
           .post(this.$baseUrl + 'activity/setDesignerWorkday',
             this.workday.list, {headers: {id: this.workday.id}})
           .then(res => {
             this.visible_workday = false;
           })
           .catch(res => (console.log(res)));
       }
    },
    openExcel(){
      const date = new Date();
      const end = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
      const date1 = new Date();
      date1.setTime(date1.getTime() - 3600 * 1000 * 24 * 30)
      const start = date1.getFullYear() + "-" + (date1.getMonth()+1) + "-" + date1.getDate();
      this.downMonth = [start,end]
      this.excelDialog = true;
    },
    openRatio(){
      this.$axios
        .post(this.$baseUrl + 'projectWorkDay/queryTecVolumeRatio',
          {},{headers: {id: this.tid}})
        .then(res => {
          this.ratio = res.data.data;
          this.ratioDialog = true;
        })
        .catch(res => (console.log(res)));
    },
    ratioSubmit(){
      if (this.ruled === true) {
        this.$axios
          .post(this.$baseUrl + 'projectWorkDay/setTecVolumeRatio',
            this.ratio)
          .then(res => {
            this.ratioDialog = false;
          })
          .catch(res => (console.log(res)));
      }else this.$message.error("比例总和不得超过100%")
    },
    downExcel(){
      this.$message.success("即将开始下载");
      window.location.href = this.$baseUrl + 'projectExcel/personal?minDay='
        + this.downMonth[0]+'&maxDay='+this.downMonth[1] + '&id=' + this.id;
    },
    downExcel1(){
      this.$message.success("即将开始下载");
      window.location.href = this.$baseUrl + 'projectExcel/personalVolume?minDay='
        + this.downMonth[0]+'&maxDay='+this.downMonth[1] + '&id=' + this.id;
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
  margin-left: 2%;
  width: 96%;
  horiz-align: center;
  font-size: 12px;
  word-wrap: break-word;
  margin-bottom: 10px;
}
  /deep/ .el-table th > .cell{
    text-align: center;
  }
  /deep/ .el-table .cell{
    text-align: center;
  }
</style>
