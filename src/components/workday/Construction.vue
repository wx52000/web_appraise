<template>
<div>
  <el-row style="margin-top: 1%; margin-bottom: 1%">
    <el-col :span="16">
      <el-switch
        v-model="type"
        active-text="按项目"
        inactive-text="按卷册"
        @change="getData">
      </el-switch>
      <template>
        <el-date-picker
          v-model="showDate"
          type="daterange"
          value-format="yyyy-MM-dd"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          size = "mini"
          style="margin-right: 10%; margin-left: 5%"
          @change="getData">
        </el-date-picker>
      </template>
    </el-col>
    <el-col :span="8">
      <el-button size="mini" @click="openRatio">专业工时分配比例管理</el-button >
      <el-button size="mini" @click="openExcel">Excel 下载</el-button>
    </el-col>
  </el-row>
  <div v-if="type">
  <u-table key="projectList" use-virtual :row-height="28" border :data="projectList" class="u-table"
              :header-cell-style="{background:'#9ff9f9'}"
              :max-height=pageHeight
              size = "mini" :cell-style="this.CellStyleOne">
      <u-table-column prop="number" min-width="10%" label="项目编号" align="center"  >
      </u-table-column>
      <u-table-column prop="name" min-width="26%" label="项目名称" align="center">
      </u-table-column>
      <u-table-column prop="director" min-width="8%" label="主管设总" align="center"  >
      </u-table-column>
      <u-table-column prop="general" min-width="8" label="设总" align="center" style="word-break: break-all;">
      </u-table-column>
      <u-table-column prop="create_time" min-width="8%" label="开始时间" align="center">
      </u-table-column>
      <u-table-column prop="amount"  min-width="8%" label="参与卷册数"  align="center">
      </u-table-column>
      <u-table-column  min-width="20%" align="center">
        <template slot-scope="scope">
          <el-row>
            <el-col :span="12">
              <el-button
                size="mini"
                @click="openBackupWorkday(scope.row)">备用工时管理</el-button>
             </el-col>
            <el-col :span="12">
              <el-button
                size="mini"
                @click="openProject(scope.row)">项目主页</el-button>
           </el-col>
          </el-row>
        </template>
      </u-table-column>
    </u-table>
  </div>
  <div v-if="!type">
  <u-table key="volumeList" use-virtual :row-height="50" border :data="volumeList" class="u-table" :header-cell-style="{background: '#9fc5e8',color:'#000000'}"
                  :default-sort = "{prop: 'date', order: 'descending'}"
                  :row-key="getRowKeys"
                  size="mini"
                  :max-height=pageHeight
                  lazy
                  :cell-style="this.CellStyleOne"
                  :row-style="completeState">
          <u-table-column fixed prop="number" width="180"  label="卷册号" sortable>
          </u-table-column>
          <u-table-column prop="volumeName" width="220" label="卷册名称" sortable>
          </u-table-column>
          <u-table-column prop="state"  width="80" label="状态"
                           :filters="[{text:'尚未开展',value:'尚未开展'},{text:'正在设计',value:'正在设计'},
                            {text:'正在校审',value:'正在校审'},{text:'代送出版',value:'代送出版'},
                            {text:'正在出版',value:'正在出版'},{text:'代送业主',value:'代送业主'},
                            {text:'已完成',value:'已完成'},{text:'院交出',value:'院交出'}]"
                           :filter-method="filterHandler">
          </u-table-column>
          <u-table-column prop="scope" width="80" label="工时"  align="center"
                           sortable>
            <template slot-scope="scope">
              <el-input v-model.lazy="scope.row.workday" size="mini"
                        v-if="releasableStateFilter(scope.row)" @change="changeWorkday(scope.row)"></el-input>
              <el-input v-model.lazy="scope.row.workday" size="mini"
                        v-else disabled></el-input>
            </template>
          </u-table-column>
          <u-table-column prop="workday_state" width="100" label="工时状态"  align="center"
                           sortable>
            <template slot-scope="scope">
              <span>{{scope.row.workday_state | workdayStateFilter}}</span>
            </template>
          </u-table-column>
          <u-table-column prop="grant" width="120" label="已发放工时"  align="center"
                           sortable>
          </u-table-column>
          <u-table-column prop="reason" width="160" label="未按时完成原因"  align="center"
                          sortable>
            <template slot-scope="scope">
            <el-autocomplete
              class="inline-input"
              size="mini"
              v-model="scope.row.reason"
              :fetch-suggestions="querySearch"
              placeholder="请输入内容"
              v-if="scope.row.reasonState"
              @change.native="changeReason(scope.row)"
              @select="reasonHandle($event,scope.row)"
            ><template slot-scope="{item}">
              <span>{{item}}</span>
            </template>
            </el-autocomplete>
              <el-input v-model.lazy="scope.row.reason" size="mini"
                        v-else disabled></el-input>
            </template>
          </u-table-column>
          <u-table-column prop="shot_date" width="120"  label="出手日期" sortable>
          </u-table-column>
          <u-table-column prop="planned_shot_date" width="120"  label="计划出手日期" sortable>
          </u-table-column>
          <u-table-column prop="start_date" width="120"  label="开始日期" sortable>
          </u-table-column>
          <u-table-column prop="actual_publication_date" width="120" label="出版日期" sortable>
          </u-table-column>
          <u-table-column prop="planned_publication_date" width="120" label="计划出版日期" sortable>
          </u-table-column>
          <u-table-column prop="proofreading_date" width="120"  label="互交完成日期" sortable>
          </u-table-column>
          <u-table-column prop="complete_time" width="100"  label="完成日期" sortable>
          </u-table-column>
          <u-table-column prop="designer" width="100"  label="设计人"
                          :filters="designerList"
                          :filter-method="filterHandler">
          </u-table-column>
          <u-table-column prop="checker" width="100"  label="互校人"
                          :filters="checkerList"
                          :filter-method="filterHandler">
          </u-table-column>
          <u-table-column prop="principal" width="100"  label="主设人"
                          :filters="principalList"
                          :filter-method="filterHandler">
          </u-table-column>
          <u-table-column prop="projectName" width="220" label="项目名称"
                           :filters=volumeProject
                           :filter-method="filterHandler"/>
          <u-table-column prop="dep" width="100"  label="部门" sortable>
          </u-table-column>
          <u-table-column prop="tec" align="center" width="100" label="专业" sortable>
          </u-table-column>
          <u-table-column
            align="center" width="120" fixed="right">
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="openVolumeWorkday(scope.row)">工时发放管理</el-button>
            </template>
          </u-table-column>
        </u-table>
  </div>
  <el-dialog
    :visible.sync="visible_workday"
    @close="closeDialog"
    width="40%" v-if='visible_workday'>
    <el-container>
      <el-header align="left" style="margin-top: -30px">
        <el-row>
          <el-col :span="10" style="margin-top: -20px">
            <h4>{{nowDate}} 备用工时分配</h4>
          </el-col>
          <el-col :span="7">
            可用工时:<span style="color: #66b1ff">{{backup_usable}}</span>
          </el-col>
          <el-col :span="7">
            已用工时:<span style="color: #66b1ff">{{backup_used}}</span>
          </el-col>
        </el-row>
      </el-header>
        <el-main style="margin-top: -20px">
            <el-row>
              <el-col :span="12" style="font-weight: bold">
                设计人名称
              </el-col>
              <el-col :span="12" style="font-weight: bold">
                设计人获得工时
              </el-col>
            </el-row>
            <el-row v-for="(item,index) in workday" style="margin-top: 5px" :key="index">
              <el-col :span="12">
                {{item.name}}
              </el-col>
              <el-col :span="12">
                <el-input type="type" size="mini" style="width: 50%" v-model="item.workday"></el-input>
              </el-col>
            </el-row>
            <el-divider>
              <el-button type="text" @click="addItem">设计人员缺少，点此添加</el-button>
            </el-divider>
            <el-row v-for="(item,index) in workday_backup " style="margin-top: 5px" :key="index+'_workday'">
              <el-col :span="12">
                <el-select v-model="item.name" size="mini"
                           :filterable="true"  :remote="true"
                           :remote-method="remoteMethod"
                           :loading="nameLoading"
                           style="width: 50%"
                           @change="selectSubmit($event,index)"
                           placeholder="请输入人员姓名或工号">
                  <el-option
                    v-for="item in nameList"
                    :key="item.id"
                    :label="item.name"
                    :value="item">
                  </el-option></el-select>
              </el-col>
              <el-col :span="12">
                <el-input type="type" size="mini" style="width: 50%" v-model="item.workday"></el-input>
                <el-button icon="el-icon-remove-outline"
                           size="mini" circle @click="removeItem(index)"></el-button>
              </el-col>
            </el-row>
            <el-row style="margin-top: 20px">
          <el-button  size="small " style="margin-right: 10%" @click="closeDialog()">取消</el-button>
          <el-button type="primary" size="small " style="margin-left: 10%" @click="backupSubmit">确定</el-button>
            </el-row>
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
    title="专业工时分配比例"
    :visible.sync="ratioDialog"
    width="40%" style="text-align: center">
    <el-form :model="ratio" size="mini">
      <div v-for="item in ratio">
      <el-row>{{item.name}}</el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label-width="80px"
                         label="设计人"
                        prop="designer">
            <el-input v-model="item.designer" oninput="value=value.replace(/[^\d.]/g,'')"  >
              <template slot="append">
                %</template>
            </el-input>
          </el-form-item >
        </el-col>
          <el-col :span="12">
            <el-form-item label-width="80px"
                          label="互校人"
                          prop="checker">
              <el-input v-model="item.checker" oninput="value=value.replace(/[^\d.]/g,'')">
                <template slot="append">
                  %</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
              <el-form-item label-width="80px"
                           label="主设人"
                            prop="principal">
                <el-input v-model="item.principal" oninput="value=value.replace(/[^\d.]/g,'')">
                  <template slot="append">
                    %</template>
                </el-input>
              </el-form-item>
            </el-col>
              <el-col :span="12">
                <el-form-item label-width="80px"
                               label="组长"
                              prop="headman">
                  <el-input v-model="item.headman" oninput="value=value.replace(/[^\d.]/g,'')">
                    <template slot="append">
                      %</template>
                  </el-input>
                </el-form-item>
              </el-col>
        </el-row>
      </div>
        <el-form-item style="margin-left: -50px;text-align: center;margin-top: 20px">
          <el-button @click="ratioDialog = false">取消</el-button>
          <el-button @click="ratioSubmit" type="primary">确认</el-button>
        </el-form-item>
    </el-form>
  </el-dialog>
  <el-dialog
    title="卷册工时分配发放管理"
    :visible.sync="volume_workday_visible"
    width="60%" style="text-align: center">
    <el-form :model="volume_workday" :rules="rulesVolume" size="mini" :inline="true">
      <el-row>
        <el-col :span="12">
          <el-form-item label-width="160px"
                        style="margin-left: -50px" label="卷册工时:"
                        >
            <el-input v-model="volume_workday.workday" disabled class="input" oninput="value=value.replace(/[^\d.]/g,'')">
            </el-input>
          </el-form-item >
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="160px"
                        style="margin-left: -50px" label="已发放工时:"
                        >
            <el-input v-model="volume_workday.sumGrant" disabled class="input" oninput="value=value.replace(/[^\d.]/g,'')">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label-width="160px"
                        style="margin-left: -50px" label="可发放工时:"
                         >
            <el-input v-model="volume_workday.usable" disabled class="input" oninput="value=value.replace(/[^\d.]/g,'')">
            </el-input>
          </el-form-item >
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="160px"
                        style="margin-left: -50px" label="本次发放工时:"
                        prop="this_grant">
            <el-input v-model="volume_workday.grant" class="input" oninput="value=value.replace(/[^\d.]/g,'')">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
        <el-form-item label-width="160px"
                      style="margin-left: -50px" label="设计人所得比例:"
                      prop="designer">
          <el-input v-model="volume_workday.designer" class="input" oninput="value=value.replace(/[^\d.]/g,'')">
            <template slot="append">
              %</template>
          </el-input>
        </el-form-item >
        </el-col>
        <el-col :span="12">
        <el-form-item label-width="160px"
                      style="margin-left: -50px" label="互校人所得比例:"
                      prop="checker">
          <el-input v-model="volume_workday.checker" class="input" oninput="value=value.replace(/[^\d.]/g,'')">
            <template slot="append">
              %</template>
          </el-input>
        </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
        <el-form-item label-width="160px"
                      style="margin-left: -50px" label="主设人所得比例:"
                      prop="principal">
          <el-input v-model="volume_workday.principal" class="input" oninput="value=value.replace(/[^\d.]/g,'')">
            <template slot="append">
              %</template>
          </el-input>
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item label-width="160px"
                      style="margin-left: -50px" label="组长所得比例:"
                      prop="headman">
          <el-input v-model="volume_workday.headman" class="input" oninput="value=value.replace(/[^\d.]/g,'')">
            <template slot="append">
              %</template>
          </el-input>
        </el-form-item>
        </el-col>
        </el-row>
        <el-form-item style="margin-left: -50px;text-align: center;margin-top: 20px">
          <el-button @click="closeVolumeWorkday()">取消</el-button>
          <el-button @click="VolumeWorkdaySubmit" type="primary">确认</el-button>
        </el-form-item>
    </el-form>
  </el-dialog>
</div>
</template>

<script>

const workdayState =[
  {"type" : 0, name : "未发放"},
  {"type" : 1, name : "已发放"},
  {"type" : 2, name : "部分发放"}
]

const releasableState = [
  "正在设计",  "正在校审",  "待送出版",  "正在出版",
]

const reasonList = [
  "请假",  "出差",  "提资"
]

import virtualList  from 'vue-virtual-scroll-list'
export default {
name: "UserScore",
  components: { 'virtual-list': virtualList },
  data(){
    const ruleVolume = async(rule, value, callback) =>{
      let sum = 0;
      sum = Number(this.volume_workday.designer) + Number(this.volume_workday.checker)
        + Number(this.volume_workday.principal) + Number(this.volume_workday.headman)
      if (sum !== 100){
        this.ruledVolume = false;
        return callback(new Error("比例之和不能超出或低于100%"))
      }else{
        this.ruledVolume = true;
        return callback;
      }
    }
    const this_grant = async(rule, value, callback) =>{
      console.log(value)
      if (value > this.volume_workday.usable){
        this.ruledVolume = false;
        return  callback(new Error("本次发放工时不能高于可发放工时"))
      }else {
        this.ruledVolume  = true;
        return callback;
      }
    }
  return{
      getRowKeys(row){
        return row.id
      },
    type : true,
    pageHeight : document.body.clientHeight,
    nowDate : "",
    listMonth : [],
    volume_workday_visible : false,
    User :{},
    Tec : {},
    loading : true,
    projectList : [],
    volumeList : [],
    volumeProject : [],
    visible_score : false,
    visible_workday : false,
    visible_designer : false,
    workday : [],
    backup_used : "",
    backup_usable : "",
    workday_backup : [],
    volume_workday : {},
    nameLoading : true,
    nameList : [],
    excelDialog : false,
    showDate : [],
    downMonth : [],
    ratioDialog : false,
    ratio : [],
    ruledVolume : false,
    designerList : [],
    checkerList : [],
    principalList : [],
    rowData : "",
    rulesVolume: {
      this_grant:
        {validator:this_grant, trigger: 'change'},
      designer:
        {required: true, validator:ruleVolume, trigger: 'change'},
      principal:
        {required: true, validator:ruleVolume, trigger: 'change'},
      checker:
        {required: true, validator:ruleVolume, trigger: 'change'},
      headman:
        {required: true, validator:ruleVolume, trigger: 'change'},
    }
  }
  },
  filters:{
    workdayStateFilter(state){
      const s = workdayState.find(obj => obj.type === state)
      return s ? s.name : null;
    },
  },
  created() {
  //picker 初始化 需要赋值为yyyy-MM-dd格式，月份和日期需要补0，
    const a = new Date();
    const  end = a.getFullYear() + "-" + (Number(a.getMonth())+1).toString().padStart(2,0) + "-" + a.getDate().toString().padStart(2,0)
    const b = new Date(new Date().getTime()-3600*24*30*1000)
    const start =  b.getFullYear() + "-" + (Number(b.getMonth())+1).toString().padStart(2,0) + "-" + b.getDate().toString().padStart(2,0)
    this.nowDate = a.getFullYear() + "-" + (Number(a.getMonth()) + 1).toString().padStart(2,0)
    this.showDate = [start,end]
    this.downMonth = [start,end]
  },
  mounted() {
    this.getData();
  },
  methods: {
    dateDiff(sDate) {
      let date2 = new Date();
      let date1 = new Date(Date.parse(sDate.replace(/-/g,   "/")));
      let iDays = parseInt((date2.getTime()- date1.getTime()) /1000/60/60/24);
      return iDays;

    },
    completeState({row, rowIndex}) {
      if (row.planned_shot_date !== undefined && row.planned_shot_date !== "" &&
        (row.state === '正在设计' || row.state === '正在校审')) {
        let days = this.dateDiff(row.planned_shot_date)
        let rowBackground = {};
        if (-1 >= days >= -3){
          row.reasonState = true
          rowBackground.background = "#dede89";
          return rowBackground;
        }else if (days >= -1 ){
          row.reasonState = true
          rowBackground.background = "pink";
          return rowBackground;
        }
      }
    },
    rowClassName({row, rowIndex}) {
      //把每一行的索引放进row
      row.index = rowIndex;
    },
    releasableStateFilter(row){
      let s = releasableState.find(obj => obj === row.state)
      let f = row.principal.split(';').find(obj => obj === this.$parent.name)||
        this.$parent.name === row.general
      return s && f
    },
    querySearch(queryString, cb) {
      let results = queryString ? reasonList.filter( item =>
        item.toLowerCase().indexOf(queryString.toLowerCase()) === 0) : reasonList;
      cb(results);
    },
    reasonHandle(item,row){
      row.reason = item
    },
    changeReason(row){
      this.$axios
        .post(this.$baseUrl + 'volume/setReason', {
            "id": row.id,
            "reason" : row.reason
          }
        )
        .catch(res => (console.log(res)));
    },
    getData() {
    this.loading = false;
    if (!this.type) {
      this.$axios
        .post(this.$baseUrl + 'project/homepageVolume', {
            "id": this.id,
            "queryStart": this.showDate[0],
            "queryEnd": this.showDate[1]
          }
        )
        .then(res => {
          if (res.data.data.length>0) {
            this.volumeList = res.data.data
            this.volumeList.forEach(item => {
                item.old = item.workday
                this.volumeProject.push2({value: item.projectName, text: item.projectName});
                this.designerList.push2({value: item.designer, text: item.designer});
                this.checkerList.push2({value: item.checker, text: item.checker});
                this.principalList.push2({value: item.principal, text: item.principal})
              }
            )
          }else {
            this.volumeList = []
          }
        })
        .catch(res => (console.log(res)));
    }else {
      this.$axios
        .post(this.$baseUrl + 'project/homepageProject')
        .then(res => {
          if (res.data.data.length>0) {
            this.projectList = res.data.data
          }else {
            this.projectList = [];
          }
        })
        .catch(res => (console.log(res)));
    }
  },
    changeWorkday(row){
      this.$axios
        .post(this.$baseUrl + 'volume/setWorkday', {
          "id": row.id,
          "workday" : row.workday,
          "old" : row.old,
          "date" : this.nowDate,
          }
        )
        .then(res => {
          if (res.data.code === 0) {
            this.$notify.closeAll();
              this.$notify({
                title: row.projectName,
                type: 'info',
                dangerouslyUseHTMLString: true,
                message: "专业可用工时:" + (res.data.data.amount - res.data.data.used) +
                  " <br/> 专业已用工时:" + res.data.data.used
              })
            }
        })
        .catch(res => (console.log(res)));
    },
    openVolumeWorkday(row){
      this.rowData = row;
      this.$axios
        .post(this.$baseUrl + 'volume/queryVolumeWorkday', {
            "id": row.id,
          "date" : this.nowDate
          }
        )
        .then(res => {
          this.volume_workday = res.data.data
          this.volume_workday.old = res.data.data.workday
          this.volume_workday_visible = true
        })
        .catch(res => (console.log(res)));
    },
    closeVolumeWorkday(){
      this.volume_workday = {};
      this.volume_workday_visible = false;
    },
    VolumeWorkdaySubmit(){
      if (this.volume_workday.this_grant === ''){
        this.volume_workday.this_grant = 0;
      }
      if (this.ruledVolume) {
        this.$axios
          .post(this.$baseUrl + 'volume/setWorkdayHigh', {
              "id": this.volume_workday.id,
              "workday": this.volume_workday.workday,
              "grant" : this.volume_workday.grant,
              "principal" : this.volume_workday.principal,
              "designer" : this.volume_workday.designer,
              "checker" : this.volume_workday.checker,
              "headman" : this.volume_workday.headman,
              "date" : this.nowDate,
            }
          )
          .then(res => {
            if (res.data.code === 0) {
              this.volume_workday_visible = false
              this.$notify.closeAll();
              this.$notify({
                title: this.rowData.projectName,
                type: 'info',
                dangerouslyUseHTMLString: true,
                message: "专业可用工时:" + (res.data.data.amount - res.data.data.used) +
                  " <br/> 专业已用工时:" + res.data.data.used
              })
            }
          })
          .catch(res => (console.log(res)));
      }
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
    addItem(){
      this.workday_backup.push({name:"" ,workday : ""})
    },
    removeItem(index){
      this.workday_backup.splice(index,1)
    },
    openBackupWorkday(row){
        this.$axios
          .post(this.$baseUrl + 'project/queryHumanToBackup', {
            id : row.id,
            date : this.nowDate
          })
          .then(res => {
            this.backup_usable = res.data.data.amount
            this.backup_used = res.data.data.used
            this.workday = res.data.data.list
            this.visible_workday = true;
          })
          .catch(res => (console.log(res)));
    },
    selectSubmit(val,index){
      let s = this.workday.find( obj => {return obj.id === val.id})
      if (s === undefined) {
        this.workday_backup[index].id = val.id;
        this.workday_backup[index].name = val.name;
        console.log(this.workday_backup)
      }else {
        this.workday_backup[index].id = '';
        this.workday_backup[index].name = '';
        this.$message({
          type:"warning",
          message:"不能选择已存在的人员"
        })
      }
    },
    backupSubmit(){
      this.workday = this.workday.concat(this.workday_backup)
      let amount = this.workday.reduce((prev, cur) => {
        if (cur.workday !== undefined && cur.workday !== "") {
          return Number(prev) + Number(cur.workday);
        }else return prev
      },0)
      if (amount <= this.backup_usable) {
        this.$axios
          .post(this.$baseUrl + 'project/setWorkdayBackup', this.workday,
            {headers: {backupDate: this.nowDate}}
          )
          .then(res => {
            if (res.data.code === 0) {
              this.visible_workday = false;
              this.$message({
                type: "success",
                message: "备用工时发放成功"
              })
            }
          })
          .catch(res => (console.log(res)));
      }else {
        this.$message({
          type: "warning",
          message: "备用工时发放总数不得高于可用工时"
        })
      }
    },
    closeDialog(){
      this.workday = {
        list : []
      };
      this.workday_backup = []
      this.visible_workday = false
    },
    openExcel(){
      this.excelDialog = true;
    },
    openRatio(){
      this.$axios
        .post(this.$baseUrl + 'projectWorkDay/queryTecVolumeRatio')
        .then(res => {
          this.ratio = res.data.data;
          this.ratioDialog = true;
        })
        .catch(res => (console.log(res)));
    },
    ratioSubmit(){
      let ruled = true;
      this.ratio.forEach(item =>{
        let sum = (Number(item.designer) + Number(item.checker) + Number(item.principal) + Number(item.headman))
        if (sum !== 100){
          this.$message({
            type: "warning",
            message: "比例之和应为100"
          })
          ruled = false;
          return 0;
        }
      })
      if (ruled === true) {
        this.$axios
          .post(this.$baseUrl + 'projectWorkDay/setTecVolumeRatio',
            this.ratio)
          .then(res => {
            this.ratioDialog = false;
          })
          .catch(res => (console.log(res)));
      }
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
    remoteMethod(query) {
      if (query !== '') {
        this.nameLoading = true;
        setTimeout(() => {
          this.$axios
            .post(this.$baseUrl + 'user/queryByName', {
                "name" : query
              }
            )
            .then(res => {
              if (res.data.data != null) {
                this.nameList = res.data.data
              }
            });
          this.nameLoading = false;
        }, 200);
      } else {
        this.nameList = [];
      }
    },
  }
}
</script>

<style>
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
.el-tabs{
  margin-left: 2%;
  width: 96%;
}
.u-table {
  /*margin-left: 2%;*/
  /*width: 96%;*/
  horiz-align: center;
  font-size: 12px;
  word-wrap: break-word;
  margin-bottom: 10px;
}

    /deep/ .u-table__fixed-right {
      height: 100% !important;
    /*/ / 设置高优先，以覆盖内联样式*/
    }
    /deep/ .u-table__fixed {
      height: 100% !important;
    /*/ / 设置高优先，以覆盖内联样式*/
    }
  /deep/ .u-table th > .cell{
    text-align: center;
  }
  /deep/ .u-table .cell{
    text-align: center;
  }

  .input {
    width: 120px;
  }

.el-input.is-disabled /deep/ .el-input__inner {
  background-color: white;
  color: #000000;
}

</style>
