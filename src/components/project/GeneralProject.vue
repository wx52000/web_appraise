<template>
  <div>
    <el-form >
      <el-row>
        <!-- 列表 -->
        <el-row style="background-color: #FFF; text-align: center">
          <el-row>
            <el-row style="margin:0 auto;text-align: center; align-content: center">
              <el-col :span="24" style="line-height: 50px;font-size: 16px;font-weight: bold;color: #666;text-align: center ">
                项目管理
              </el-col>
            </el-row>
            <el-table border :data="list" class="el-table" :row-class-name="tableRowClassName"
            :header-cell-style="{background:'#F5F5F5'}">
                <el-table-column prop="number" min-width="24%" label="项目编号" align="center"  >
                </el-table-column>
              <el-table-column prop="projectName" min-width="28%" label="项目名称" align="center">
              </el-table-column>
              <el-table-column prop="director" min-width="8%" label="主管设总" align="center"  >
              </el-table-column>
              <el-table-column prop="general" min-width="8" label="设总" align="center" style="word-break: break-all;">
              </el-table-column>
              <el-table-column prop="state" min-width="8%" label="项目状态" align="center">
              </el-table-column>
              <el-table-column prop="amount"  min-width="8%" label="卷册总数"  align="center">
              </el-table-column>
              <el-table-column
                align="center"  min-width="10%" >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="openVolumeList(scope.row.id)">卷册详情</el-button>
                </template>
              </el-table-column>
              <el-table-column
                align="center"  min-width="10%" >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="openVolume(scope.row.projectPhaseID)">卷册目录</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-row>
      </el-row>
    </el-form>
    <el-dialog
      title="操作页面"
      :visible.sync="dialogVisible"
      width="60%">
      <el-container>
        <el-header style="background: #B3C0D1 ;color: #333; text-align: left;height:40px;padding-top: 10px" >
          <el-row>
            <el-col :span="8">项目管理</el-col>
          </el-row>
        </el-header>
        <el-form :model="project">
        <el-main>
          <el-form-item label="项目名称" style="width: 80%">
            <el-input type="text"  v-model="project.name" style="width: 80%"></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="12">
          <el-form-item label="相关专业" style="text-align: left">
          <el-cascader :props="props" :options="options" v-model="project.tec"
                       style="margin-left: 20px"  :filterable="true"></el-cascader>
          </el-form-item>
          </el-col>
          </el-row>
          <el-button type="primary" size="mini" @click="updProject" round style="margin-left: 80%">确 定</el-button>
        </el-main>
        </el-form>
        <el-header style="background: #B3C0D1 ;color: #333; text-align: left;height:40px;padding-top: 10px" >
          <el-row>
            <el-col :span="8">卷册管理</el-col>
            <el-col :span="16" align="right">
              <el-button type="primary" size="mini"   @click="" plain>新增卷册</el-button>
            </el-col>
          </el-row>
        </el-header>
        <el-form :model="volume">
        <el-main>
          <el-carousel height="500px" :autoplay=false>
            <el-carousel-item>
          <el-form-item label="卷册号" style="width: 80%; ">
            <el-input type="text"  v-model="volume.number" style="width: 80%;margin-left: 15px"></el-input>
          </el-form-item>
          <el-form-item label="卷册名称" style="width: 80%">
            <el-input type="text"  v-model="volume.name" style="width: 80%"></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="卷册等级" >
                <el-input type="number" inline  v-model="volume.grade" style="width: 50%;margin-right: 26px"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="专业" >
                <el-select v-model="volume.tec" placeholder="请选择"  style="width: 50%;margin-left: 15px" @change="getUserByTec">
                  <el-option
                    v-for="item in tecList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="设计人" >
                <el-select v-model="volume.designer" filterable  placeholder="请选择"  style="width: 50%;margin-left: -15px">
                  <el-option
                    v-for="item in userList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="互校人">
                <el-select v-model="volume.checker"  filterable placeholder="请选择"  style="width: 50%">
                  <el-option
                    v-for="item in userList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="计划出版时间">
                <el-date-picker
                  v-model="volume.planned_publication_date"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="timestamp"
                  placeholder="选择日期" style="width: 50%;margin-left:  -60px">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="实际出版时间">
                <el-date-picker
                  v-model="volume.actual_publication_date"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="timestamp"
                  placeholder="选择日期" style="width: 50%;margin-left:  -45px">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="接收对外专业资料时间" style="margin-left: -15px" >
                <el-date-picker
                  v-model="volume.professional_date"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="timestamp"
                  placeholder="选择日期" style="width: 50%">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="对外提资时间">
                <el-date-picker
                  v-model="volume.withdrawal_date"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="timestamp"
                  placeholder="选择日期" style="width: 50%;margin-left:  -45px">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="出手日期" >
                <el-date-picker
                  v-model="volume.shot_date"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="timestamp"
                  placeholder="选择日期" style="width: 50%;margin-left:  -30px">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="完成日期">
                <el-date-picker
                  v-model="volume.complete_time"
                  type="date"
                  format="yyyy-MM-dd"
                  value-format="timestamp"
                  placeholder="选择日期" style="width: 50%;margin-left:  -15px">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
              <el-button type="primary" size="mini" @click="updVolume"  round style="margin-left: 80%">确 定</el-button>
            </el-carousel-item>
          </el-carousel>
        </el-main>
        </el-form>
      </el-container>
    </el-dialog>
    <el-dialog
      title="卷册详情"
      :visible.sync="volumeVisible"
      width="90%"
      @close="closeDialog()"
      >
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
                <span>{{timeConversion(scope.row.planned_shot_date)}}</span>
              </el-form-item>
              <el-form-item label="出手日期：">
                <span>{{timeConversion(scope.row.shot_date)}}</span>
              </el-form-item>
              <el-form-item label="互校人完成时间：">
                <span>{{timeConversion(scope.row.proofreading_date)}}</span>
              </el-form-item>
              <el-form-item label="计划出版时间：">
                <span>{{timeConversion(scope.row.planned_publication_date)}}</span>
              </el-form-item>
              <el-form-item label="实际最终出版时间：">
                <span>{{timeConversion(scope.row.actual_publication_date)}}</span>
              </el-form-item>
              <el-form-item label="完成日期">
                <span>{{timeConversion(scope.row.complete_time)}}</span>
              </el-form-item>
              <el-form-item label="设计人本周完成比例：" >
                <span>{{recordConversion(scope.row.designerList,0,0)}}%</span>
              </el-form-item>
              <el-form-item label="备注：" >
                <span>{{recordConversion(scope.row.designerList,0,1)}}</span>
              </el-form-item>
              <el-form-item label="设计人上次完成比例：">
                <span>{{recordConversion(scope.row.designerList,1,0)}}%</span>
              </el-form-item>
              <el-form-item label="备注：">
                <span>{{recordConversion(scope.row.designerList,1,1)}}</span>
              </el-form-item>
              <el-form-item label="互校人本周完成比例：">
                <span>{{recordConversion(scope.row.checkerList,0,0)}}%</span>
              </el-form-item>
              <el-form-item label="备注：">
                <span>{{recordConversion(scope.row.checkerList,0,1)}}</span>
              </el-form-item>
              <el-form-item label="互校人上次完成比例：">
                <span>{{recordConversion(scope.row.checkerList,1,0)}}%</span>
              </el-form-item>
              <el-form-item label="备注：">
                <span>{{recordConversion(scope.row.checkerList,1,1)}}</span>
              </el-form-item>
              <el-form-item label="主设人本周完成比例：">
                <span>{{recordConversion(scope.row.principalList,0,0)}}%</span>
              </el-form-item>
              <el-form-item label="备注：">
                <span>{{recordConversion(scope.row.principalList,0,1)}}</span>
              </el-form-item>
              <el-form-item label="主设人上次完成比例：">
                <span>{{recordConversion(scope.row.principalList,1,0)}}%</span>
              </el-form-item>
              <el-form-item label="备注：">
                <span>{{recordConversion(scope.row.principalList,1,1)}}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="number" min-width="13  %" label="卷册号" sortable align="center"  >
        </el-table-column>
        <el-table-column prop="name" min-width="20" label="卷册名称" sortable align="center" style="word-break: break-all;">
        </el-table-column>
        <el-table-column prop="principal" label="主设人" min-width="6%" align="center"
                         :filters="principalList" :filter-method="filterHandler1">
        </el-table-column>
        <el-table-column prop="designer" label="设计人" min-width="6%" align="center"
                         :filters="designerList" :filter-method="filterHandler1">
        </el-table-column>
        <el-table-column prop="workday" label="工时" min-width="6%" align="center"
                         sortable>
        </el-table-column>
        <el-table-column prop="state" min-width="9%"  label="状态" align="center"
                         :filters="[{text:'尚未开展',value:'尚未开展'},{text:'正在设计',value:'正在设计'},
                          {text:'正在校审',value:'正在校审'},{text:'代送出版',value:'代送出版'},
                          {text:'正在出版',value:'正在出版'},{text:'代送业主',value:'代送业主'},
                          {text:'已完成交付设总',value:'已完成交付设总'},{text:'已完成交付业主',value:'已完成交付业主'}]"
                         :filter-method="filterHandler1">
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
              <el-col :span="12">
                <el-popover
                  placement="top-start"
                  width="300"
                  trigger="hover"
                  content="蓝色为设计人进度，红色为互校人进度，黄色为主设人进度。互校人填写进度后显示的为互校人进度，主设人填写后显示的为主设人进度">
                  <i slot="reference" class="el-icon-question"></i>
                </el-popover>
                <span
                  :style="displayColor(scope.row)" style="margin-right: 50%">
                {{displayProgress(scope.row)}}</span>
              </el-col>
              <el-col :span="12">
                <el-button
                  size="mini"
                  @click="openVolume1(formId = scope.row.rollId)">卷册详情页面</el-button>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <news-dialog class="news" :is-show="isShow" @click.native="isShow = !isShow">
    </news-dialog>
  </div>
</template>

<script>
export default {
  "name": "GeneralProject",
  "data"() {
    return {
      getRowKeys(row) {
        return row.id;
      },
      // 要展开的行，数值的元素是row的key值
      expands: [],
      id: "",
      pid: "",
      isShow : false,
      list: [],
      project: {},
      volume: {},
      volumeList : [],
      tecList: [],
      userList: [],
      listIndex: 0,
      meshRow: 0,
      dialogVisible: false,
      options: [],
      props: {
        checkStrictly: true,
        multiple: true,
        value: 'id',
        label: 'name',
        children: 'list'
      },
      state: [
        {
          value: 0,
          label: "未完成"
        },
        {
          value: 1,
          label: "已完成"
        }
      ],
      volumeLoading : true,
      volumeVisible:false,
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
      openId : '',
      pickerValue:null,
      principalList:[],
      designerList:[],
      nowWeek : "",
    }
  },
  "mounted"() {
    this.getLogIn();
    this.nowWeek = this.getWeek()
  },
  "methods": {
    "getLogIn"() {
      let i = JSON.parse(sessionStorage.getItem("appraise"));
      this.id = i.id;
      this.pid = i.pid;
      this.getData();
    },
    "getData"() {
      this.$axios
        .post(this.$baseUrl + 'project/queryByGeneral', {
            "id": this.id
          }
        )
        .then(res => {
          this.list = res.data.data
        })
        .catch(res => (console.log(res)));
    },
    "timeConversion"(v) {
      if (v !== undefined && v !== "") {
        if (!isNaN(v)) {
          let date = new Date(Number(v));
          let year = date.getFullYear();
          let month = date.getMonth() + 1;
          let day = date.getDate();
          return year + '-' + month + '-' + day;
        }else
          return v;
      } else
        return "";
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
    recordConversion(v,i,n) {
      if (v != null && v!== "") {
        let recordOne = v.split("##")
        if ( recordOne.length !== 0) {
          if(i === 0 ){
            if (Number(recordOne[0].split("$")[2]) === Number(this.nowWeek)){
              return recordOne[i].split("$")[n]
            }else
              return null
          }else{
            if (Number(recordOne[0].split("$")[2]) === Number(this.nowWeek))
              if ( recordOne.length > 1)
                return recordOne[i].split("$")[n]
              else return null
            else return recordOne[0].split("$")[n]
          }
        }else {
          return null
        }
      }
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
    tableRowClassName({row, rowIndex}) {
      //把每一行的索引放进row
      row.index = rowIndex;
    },
    "handleEdit"(v, w) {

      this.$axios
        .post(this.$baseUrl + 'project/queryById', {}, {"headers": {'id': w.pid}}
        )
        .then(res => {
          this.project = res.data.data
        })
        .catch(res => (console.log(res)));
      this.$axios
        .post(this.$baseUrl + 'volume/queryById', {}, {"headers": {'id': w.vid}}
        )
        .then(res => {
          this.volume = res.data.data
        })
        .catch(res => (console.log(res)));
      this.dialogVisible = true;
      this.$axios
        .post(this.$baseUrl + 'technology/queryToSelected')
        .then(res => {
          this.options = res.data.data
        })
        .catch(res => (console.log(res)));
      this.$axios
        .post(this.$baseUrl + 'projectTec/query', {}, {"headers": {'id': w.pid}}
        )
        .then(res => {
          this.tecList = res.data.data
        })
        .catch(res => (console.log(res)));
      this.$axios
        .post(this.$baseUrl + 'user/queryByTec', {}, {"headers": {'id': w.tid}}
        )
        .then(res => {
          this.userList = res.data.data
        })
        .catch(res => (console.log(res)));
    },

    "updProject"() {
      let projectUsers = [];
      let projectTec = [];
      console.log(this.project.tec.length)
      for (let i = 0; i < this.project.tec.length; i++) {
        console.log(this.project.tec[i])
        projectTec.push(this.project.tec[i][0])
        projectUsers.push(this.project.tec[i][1])
      }
      this.$axios
        .post(this.$baseUrl + 'project/upd', {
          "id": this.project.id,
          "name": this.project.name,
          "projectUsers": projectUsers,
          "projectTec": projectTec
        })
        .then(res => {
          if (res.data.code === 0)
            this.$message("操作成功")
          else this.$message.error("操作失败，请重试")
        })
        .catch(res => (console.log(res)));
    },
    "updVolume"() {
      let tec = this.volume.tec;
      if (typeof tec === "string") {
        tec = null
      }
      let designer = this.volume.designer;
      if (typeof designer === "string") {
        designer = null;
      }
      let checker = this.volume.checker;
      if (typeof checker === "string") {
        checker = null;
      }
      this.$axios
        .post(this.$baseUrl + 'volume/upd', {
          "id": this.volume.id,
          "number": this.volume.number,
          "name": this.volume.name,
          "grade": this.volume.grade,
          "tecId": tec,
          "plannedPublicationDate": this.volume.planned_publication_date,
          "actualPublicationDate": this.volume.actual_publication_date,
          "professionalDate": this.volume.professional_date,
          "withdrawalDate": this.volume.withdrawal_date,
          "shotDate": this.volume.shot_date,
          "completeDate": this.volume.complete_time,
          "designer": designer,
          "checker": checker
        })
        .then(res => {
          if (res.data.code === 0)
            this.$message("操作成功")
          else this.$message.error("操作失败，请重试")
        })
        .catch(res => (console.log(res)));
    },
    getUserByTec(v){
      this.$axios
        .post(this.$baseUrl + 'user/queryByTec', {}, {"headers": {'id': v}}
        )
        .then(res => {
          this.userList = res.data.data;
          this.$forceUpdate();
        })
        .catch(res => (console.log(res)));
    },
    openVolume(p){
      window.open('http://zmis.zepdi.com.cn/Portal/EPMS/List/RollInfo/RollEntityBill.aspx?' +
        'OrganizationId=' + p + '&secid=00000000-0000-0000-0000-000000000000&IsPortal=True')
    },
    openVolumeList(id){
      this.openId = id;
      this.$axios
        .post(this.$baseUrl + 'volume/queryByProjectId', {
          "id": id,
          "month" : new Date().getMonth()+1
        })
        .then(res => {
          this.volumeList = res.data.data;
          this.volumeLoading = false;
          this.volumeList.forEach((item,index)=>{
            this.principalList.push2({value:item.principal,text:item.principal});
            this.designerList.push2({value:item.designer,text:item.designer})
          })
        })
        .catch(res => (console.log(res)));
      // const href =  this.$router.resolve({
      //   path:"",
      //   params:{
      //
      // }
      // })
      // window.open(href.href,"black")
      this.volumeVisible = true
    },
    filterHandler(value, row, column) {
      // console.log(column)
      // const property = column['property'];
      return row['pid'] === value;
    },
    filterHandler1(value, row, column){
      const property = column['property'];
      return row[property] === value;
    },
    openVolume1(f){
      // window.open('http://zmis.zepdi.com.cn/Portal/Sys/Workflow/FormDetail.aspx?actionType=1&formId=' + f +
      window.open('http://zmis.zepdi.com.cn/Portal/EPMS/List/RollInfo/ContentMange.aspx?actionType=1&RollID=' + f)
    },
    pickerEvent(){
      this.$axios
        .post(this.$baseUrl + 'volume/queryByProjectId', {
            "id" : this.openId,
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
    closeDialog(){
      this.volumeLoading =true;
      this.pickerValue = null;
      this.openId = '';
      console.log("close"+ this.pickerValue)
    },
    getWeek(){
      // date = formatTimebytype(date, 'yyyy-MM-dd');//将日期转换成yyyy-mm-dd格式
      // let YY = date.getFullYear() + '-';
      // let MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      // let DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
      let date = new Date()

      let date2 = new Date(date.getFullYear(), 0, 1);
      let day1 = date.getDay();
      if (day1 === 0) day1 = 7;
      let day2 = date2.getDay();
      if (day2 === 0) day2 = 7;
      let d = Math.round((date.getTime() - date2.getTime() + (day2 - day1) * (24 * 60 * 60 * 1000)) / 86400000);
      //当周数大于52则为下一年的第一周
      if((Math.floor(d / 7)) === 52){
        return 52
      }
      else return (Math.floor(d / 7))
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
  margin-top:20px;
  width: 95% ;
  horiz-align: center;
  left: 2.5%;
  font-size: 12px;
  word-wrap: break-word;
}


</style>
