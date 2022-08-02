<template>
  <div>
    <el-badge :value="count" :max="99"  >
      <el-button circle icon="el-icon-chat-square" class="item" @click.native="openNews"></el-button>
    </el-badge>
<el-dialog
      v-el-drag-dialog
    :visible.sync="isShow"
    width= "80%"
    :close-on-click-modal="false"
    :append-to-body="true"
    z-index="1000"
    style="text-align:center"
    @open="getNews"
    center>
    <template>
      <el-row align="center" style="text-align: center;margin-top: -20px;margin-bottom: 10px">
        审核日志:<el-date-picker
                      v-model="nowMoth"
                      field="month"
                      size="mini"
                      type="month"
                      format="yyyy-MM"
                      value-format="yyyy-MM"
                      placeholder="选择月">
          </el-date-picker>
        <el-button size="mini" @click="getNewsLog">确认</el-button>
        <el-button size="mini" @click="getNews">重置</el-button>
      </el-row>
      <u-table
        key="list" use-virtual :row-height="30"
        :data="list"
        height="400px"
        :row-style="tableRowClassName"
        @selection-change="handleSelectionChange"
        :close-on-click-model="false">
        <u-table-column
          type="expand" width="30">
          <template slot-scope="scope" style="margin-left: 60px">
            <div>
            <div v-if="scope.row.type === 0 || scope.row.type === 1">
              <el-form label-position="left" size="mini">
                <u-table key="list1" use-virtual :row-height="30"
                         :data="scope.row.list" size="mini"
                         height="180">
                  <u-table-column
                    label="专业"
                    width="180px"
                    fixed
                    show-overflow-tooltip
                    prop="tec">
                  </u-table-column>
                  <u-table-column
                    label="工时数量"
                    width="200px"
                    show-overflow-tooltip
                    prop="workday">
                  </u-table-column>
                </u-table>
              </el-form>
            </div>
            <div v-if="scope.row.type === 2">
              <el-form label-position="left" size="mini">
                <el-row>
                  <el-col :span="10">
                <el-form-item label="任务:">
                  <span>{{ scope.row.tnumber  }} - {{ scope.row.tname }}</span>
                </el-form-item>
                  </el-col>
                <el-form-item label="专业:" size="mini">
                  <span>{{ scope.row.tec }}</span>
                </el-form-item>
                </el-row>
                <el-row>
                  <el-col :span="10">
                <el-form-item label="申请工时:" size="mini">
                  <span>{{ scope.row.apply }}</span>
                </el-form-item>
                  </el-col>
                  <el-col :span="10">
                <el-form-item label="确认工时:" size="mini">
                  <input v-model="scope.row.workday" size="mini" style="width: 100px"></input>
                </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
            <div v-if="scope.row.type === 3">
              <el-form label-position="left" size="mini">
                <el-row>
                  <el-col :span="10">
                <el-form-item label="专业名称">
                  <span>{{ scope.row.tec }}</span>
                </el-form-item>
                  </el-col>
                  <el-col :span="10">
                <el-form-item label="总工时">
                  <span>{{ scope.row.workday }}</span>
                </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item label="管理工时">
                      <span>{{ scope.row.manage }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                <el-form-item label="备用工时">
                  <span>{{ scope.row.backup }}</span>
                </el-form-item>
                  </el-col>
                  <el-col :span="8">
                <el-form-item label="卷册工时">
                  <span>{{ scope.row.volume }}</span>
                </el-form-item>
                  </el-col>
                </el-row>
                    <el-row>
                      <el-col :span="10">
                <el-form-item label="设计比例">
                  <span>{{ scope.row.designer }}</span>
                </el-form-item>
                      </el-col>
                      <el-col :span="10">
                <el-form-item label="校核比例">
                  <span>{{ scope.row.checker }}</span>
                </el-form-item>
                      </el-col>
                    </el-row>
                        <el-row>
                          <el-col :span="10">
                <el-form-item label="主设比例">
                  <span>{{ scope.row.principal }}</span>
                </el-form-item>
                          </el-col>
                          <el-col :span="10">
                <el-form-item label="组长比例">
                  <span>{{ scope.row.headman }}</span>
                </el-form-item>
                          </el-col>
                        </el-row>
              </el-form>
            </div>
            <div v-if="scope.row.type === 4">
              <el-form label-position="left" size="mini">
                  <u-table key="list4" use-virtual :row-height="30"
                           :data="scope.row.list" size="mini"
                           height="180">
                    <u-table-column
                      label="编号"
                      width="180px"
                      fixed
                      show-overflow-tooltip
                      prop="number">
                    </u-table-column>
                    <u-table-column
                      label="名称"
                      width="200px"
                      show-overflow-tooltip
                      prop="name">
                    </u-table-column>
                    <u-table-column
                      label="总工时"
                      prop="workday">
                    </u-table-column>
                    <u-table-column
                      label="设计"
                      prop="designer">
                    </u-table-column>
                    <u-table-column
                      label="校核"
                      prop="checker">
                    </u-table-column>
                    <u-table-column
                      label="主设"
                      prop="principal">
                    </u-table-column>
                    <u-table-column
                      label="组长"
                      prop="headman">
                    </u-table-column>
                  </u-table>
              </el-form>
            </div>
            <div v-if="scope.row.type === 5 || scope.row.type === 6 ">
              <span>申报工时月份: </span><span style="font-weight: bold">{{scope.row.submit_date}}</span>
              <u-table key="list5" use-virtual :row-height="30"
                       show-summary
                       :summary-method="arraySpanMethod"
                      :data="scope.row.list" size="mini"
                       height="180">
                <u-table-column
                  fixed
                  v-if="scope.row.type === 5"
                width="96px">
                  <template slot-scope="scope">
                    <el-button size="mini" @click="openDeduct(scope.row)">工时奖惩</el-button>
                  </template>
                </u-table-column>
                <u-table-column
                  label="编号"
                  width="180px"
                  fixed
                  show-overflow-tooltip
                  prop="number">
                </u-table-column>
                <u-table-column
                  label="名称"
                  width="200px"
                  show-overflow-tooltip
                  prop="name">
                </u-table-column>
                <u-table-column
                  label="总工时"
                  prop="workday">
                </u-table-column>
                <u-table-column
                  label="设计"
                  prop="designer">
                </u-table-column>
                <u-table-column
                  label="设计工时"
                  prop="designerWorkday">
                </u-table-column>
                <u-table-column
                  label="校核"
                  prop="checker">
                </u-table-column>
                <u-table-column
                  label="校核工时"
                  prop="checkerWorkday">
                </u-table-column>
                <u-table-column
                  label="主设"
                  prop="principal">
                </u-table-column>
                <u-table-column
                  label="主设工时"
                  prop="principalWorkday">
                </u-table-column>
                <u-table-column
                  label="组长"
                  prop="headman">
                </u-table-column>
                <u-table-column
                  label="组长工时"
                  prop="headmanWorkday">
                </u-table-column>
                <u-table-column prop="type" sortable width="120px" label="工时类型" align="center">
                  <template slot-scope="scope">
                    <span>{{scope.row|workdayTypeFilter}}</span>
                  </template>
                </u-table-column>
                <u-table-column prop="advance" sortable width="120px" label="是否预发" align="center">
                  <template slot-scope="scope">
                    <span>{{scope.row.advance|advanceFilter}}</span>
                  </template>
                </u-table-column>
              </u-table>
            </div>
              <div v-if="scope.row.type === 7">
                <el-descriptions title="项目信息" :column="2">
                  <el-descriptions-item label="项目编号">{{scope.row.number}}</el-descriptions-item>
                  <el-descriptions-item label="项目名称">{{scope.row.name}}</el-descriptions-item>
                  <el-descriptions-item label="设总">{{scope.row.handler}}</el-descriptions-item>
                  <el-descriptions-item label="设计阶段">{{scope.row.stage}}</el-descriptions-item>
                  <el-descriptions-item label="工作范围">{{scope.row.scope}}</el-descriptions-item>
                  <el-descriptions-item v-if="scope.row.typeNote !== 0 && scope.row.typeNote !==3" label="申请工时数">
                    <span>{{scope.row.workday}}</span>
                  </el-descriptions-item>
                  <el-descriptions-item label="专业名称">{{scope.row.tec}}</el-descriptions-item>
                  <el-descriptions-item label="相关专业">{{scope.row.otherTec}}</el-descriptions-item>
                  <el-descriptions-item label="计划完成时间">{{scope.row.plannedDate}}</el-descriptions-item>
                  <el-descriptions-item label="发电总产值" v-if="scope.row.typeNote ===0 || scope.row.typeNote ===3">
                    {{scope.row.money}}</el-descriptions-item>
                  <el-descriptions-item label="发电产值占比" v-if="scope.row.typeNote ===0 || scope.row.typeNote ===3">
                    {{scope.row.ratio}}</el-descriptions-item>
                  <el-descriptions-item label="院网抓取发电产值" v-if="scope.row.typeNote ===0 || scope.row.typeNote ===3">
                    {{scope.row.netMoney}}</el-descriptions-item>
                  <el-descriptions-item label="院网抓取比例" v-if="scope.row.typeNote ===0 || scope.row.typeNote ===3">
                    {{scope.row.netRatio}}</el-descriptions-item>
                  <el-descriptions-item label="备注">{{scope.row.note}}</el-descriptions-item>
                  <el-descriptions-item :span="2" v-if="scope.row.typeNote ===0 || scope.row.typeNote ===3" label="工时">
                    <input type="text" v-model="scope.row.workday"></input></el-descriptions-item>
                </el-descriptions>
              </div>
              <div v-if="scope.row.type === 8" >
                <el-descriptions :title="'项目信息'+ index" :column="2" :key="index" v-for="(item,index) in scope.row.list">
                  <el-descriptions-item label="项目编号">{{item.number}}</el-descriptions-item>
                  <el-descriptions-item label="项目名称">{{item.name}}</el-descriptions-item>
                  <el-descriptions-item label="设总">{{item.handler}}</el-descriptions-item>
                  <el-descriptions-item label="设计阶段">{{item.stage}}</el-descriptions-item>
                  <el-descriptions-item label="专业名称">{{item.tec}}</el-descriptions-item>
                  <el-descriptions-item label="相关专业">{{item.otherTec}}</el-descriptions-item>
                  <el-descriptions-item label="工作范围">{{item.scope}}</el-descriptions-item>
                  <el-descriptions-item label="计划完成时间">{{item.plannedDate}}</el-descriptions-item>=
                  <el-descriptions-item label="发电产值">{{item.money}}</el-descriptions-item>
                  <el-descriptions-item label="发电产值占比">{{item.ratio}}</el-descriptions-item>
                  <el-descriptions-item label="院网抓取产值">{{item.netMoney}}</el-descriptions-item>
                  <el-descriptions-item label="院网抓取占比">{{item.netRatio}}</el-descriptions-item>
                  <el-descriptions-item label="备注">{{item.note}}</el-descriptions-item>
                  <el-descriptions-item label="工时数"><input type="text" v-model="item.workday"></input></el-descriptions-item>
                </el-descriptions>
              </div>
              <div v-else></div>
            </div>
          </template>
        </u-table-column>
        <u-table-column
          label="审核类型"
          width="100px"
          prop="type">
          <template slot-scope="scope">
            <span>
            {{scope.row | typeFilter}}
            </span>
          </template>
        </u-table-column>
        <u-table-column
          label="发起人"
          width="100px"
          prop="handler">
        </u-table-column>
        <u-table-column
          label="专业"
          width="100px"
          prop="tec">
        </u-table-column>
        <u-table-column
          label="项目编号"
          width="100"
          prop="number" show-overflow-tooltip>
        </u-table-column>
          <u-table-column
          label="项目名称"
          prop="name" show-overflow-tooltip>
        </u-table-column>
        <el-table-column
          fixed="right"
          type="selection"
          :selectable="selectable"
          width="30"
          v-if="logSelection"/>
      </u-table>
    </template>
        <span slot="footer" v-if="logSelection">
          <el-button @click="CheckerCancel">回退</el-button>
          <el-button @click="CheckerConfirm" type ="primary">通过</el-button>
        </span>
  </el-dialog>
    <el-dialog
      v-el-drag-dialog
      title="进度质量管控"
      :visible.sync="deductVisible"
      width= "50%"
      :close-on-click-modal="false"
      :append-to-body="true"
      z-index="1000"
      style="text-align:center"
      center>
      <el-form :model="deductForm" label-width="80px">
        <el-row style="text-align: center">
          <span style="font-size: 12px;color: #dd6161">工时调整时，正数为奖励工时，负数为惩罚工时，惩罚工时数量不得高于可扣工时</span>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="任务编号">
              <el-input v-model="deductForm.number" disabled size="mini"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务名称">
              <el-input v-model="deductForm.name" disabled size="mini"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-for="(item,index) in deductForm.deduct" :key="index">
          <el-col :span="6">
            <el-form-item :label="item.role">
              <el-input v-model="item.name" disabled size="mini"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="可扣工时">
              <el-input v-model="item.usable" disabled size="mini"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="奖罚数量">
              <el-input v-model="item.number" size="mini"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="原因">
              <el-input v-model="item.reason" size="mini"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row align="center" style="text-align: center">
          <el-button size="mini" @click="deductVisible = false">取消</el-button>
          <el-button size="mini" @click="deductSubmit()" type="primary">确认</el-button>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
const typeList = [{id : 0, name : "项目工时"},
{id : 1, name : "工时申请"},
{id : 2, name : "设总备用"},
{id : 3, name : "专业工时"},
  {id : 4, name : "卷册工时"},
  {id : 5, name : "工时审核"},
  {id : 6, name : "回退审核"},
  {id : 7, name : "无产值项目"},
  {id : 8, name : "有产值项目"}]

export default {
name: "news",
  props: {
  },
  data(){
    return{
      getRowKeys(row) {
        return row.id;
      },
      expands : [],
      id : "",
      name : "",
      nowMoth : null,
      isShow: false,
      count : 0,
      list: [],
      multipleSelection : [],
      logSelection : true,
      deductForm :{
        deduct : [],
      },
      deductVisible : false,
    }
  },
  watch:{
  },
  filters:{
    typeFilter(val){
      const s = typeList.find(obj => obj.id === val.type)
      if (val.type === 7){
        if (val.typeNote === 0){
          return  "有产值项目"
        }else if (val.typeNote === 3) {
          return  "有产值项目"
        }
      }
      return s.name
    },
    advanceFilter(value){
      if (value){
        return "预发"
      }else {
        return "非预发"
      }
    },
    workdayTypeFilter(value){
      if (value.task){
        if (value.type){
          return "备用"
        }else {
          return  "管理"
        }
      }else {
        if (value.type){
          return "备用"
        }else {
          return  "卷册"
        }
      }

    },
  },
  mounted() {
    const timer = setInterval(()=>{
      // 这里调用调用需要执行的方法，1为自定义的参数，由于特殊的需求它将用来区分，定时器调用和手工调用，然后执行不同的业务逻辑
      this.getCount()
    }, 180000) // 每两秒执行1次
    // 通过$once来监听定时器，在beforeDestroy钩子可以被清除
    this.$once('hook:beforeDestroy',()=>{
      // 在页面销毁时，销毁定时器
      clearInterval(timer)
    })
    this.getCount()
    },
  methods:{
    getCount(){
      this.$axios
        .post(this.$baseUrl + "news/count",{},{headers:{id:this.id}})
        .then(res => {
          this.count  = res.data.data
          this.$forceUpdate()
        })
        .catch( res => console.log(res))
    },
    getNews(){
      this.$axios
        .post(this.$baseUrl + "news/query",{})
        .then(res => {
          this.list = res.data.data
          this.logSelection = true;
        })
        .catch( res => console.log(res))
    },
    openNews(){
      this.$axios
        .post(this.$baseUrl + "news/query",{})
        .then(res => {
          this.list = res.data.data
          this.logSelection = true;
          this.isShow = !this.isShow
          console.log(isShow)
        })
        .catch( res => console.log(res))
    },
    getNewsLog(){
      this.$axios
        .post(this.$baseUrl + "news/queryLog",{},{headers:{queryDate : this.nowMoth}})
        .then(res => {
          this.list = res.data.data
          this.logSelection = false
        })
        .catch( res => console.log(res))
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    CheckerConfirm(row) {
      if (this.multipleSelection.length === 0){
        return this.$message.warning("未选审核项")
      }
        this.$axios
          .post(this.$baseUrl + "news/check",this.multipleSelection,{headers :{ check :1}})
          .then(res => {
            if(res.data.code === 0){
              this.getCount();
              this.$message.success("审核通过成功")
              this.isShow = false;
            }
                        })
          .catch( res => console.log(res))
    },
    CheckerCancel(row){
      if (this.multipleSelection.length === 0){
        return this.$message.warning("未选审核项")
      }
        this.$axios
        .post(this.$baseUrl + "news/check",this.multipleSelection,{headers : {check : 2}})
        .then(res => {
          if(res.data.code === 0){
            this.getCount();
            this.$message.success("审核回退成功")
            this.isShow = false;
          }
        })
        .catch( res => console.log(res))
    },
    clickRowHandle(row, column, event) {
      if (column.property !== undefined) {
        this.expands.push(row);
      }
    },
    tableRowClassName({row, rowIndex}){
      if (row.result) {
        return  { backgroundColor: "#F0E68C" };
      }
      return '';
    },
    selectable(row,index){
      return !row.result
    },
    openDeduct(row){
      this.deductForm = {
        projectId : row.project_id,
        taskId : row.task_id,
        number : row.number,
        name : row.name,
        tec : row.tec,
        date : row.date,
        type : row.task,
        deduct : [],
      };
      this.$axios
        .post(this.$baseUrl + "taskDeduct/queryLogById",this.multipleSelection,{headers : {id : row.task_id}})
        .then(res => {
          if(res.data.code === 0){
            let des = 0;
            let che = 0;
            let pri = 0;
            let he = 0;
            let desReason = "";
            let cheReason = "";
            let priReason = "";
            let heaReason = "";
            if (res.data.data !== undefined && res.data.data !== null){
              des = res.data.data.designer;
              che = res.data.data.checker;
              pri = res.data.data.principal;
              he = res.data.data.headman;
              desReason = res.data.data.desReason
              cheReason = res.data.data.cheReason
              priReason = res.data.data.priReason
              heaReason = res.data.data.heaReason
            }
            console.log("aaa")
            if (row.designerWorkday !== undefined && row.designerWorkday !== 0){
              this.deductForm.deduct.push({roleId : 0, role : "设计", name : row.designer,
                userId : row.designerId, usable : row.designerWorkday*20/100, number : des, reason : desReason})
            }
            if (row.checkerWorkday !== undefined && row.checkerWorkday !== 0){
              this.deductForm.deduct.push({roleId : 1, role : "校核", name : row.checker,
                userId : row.checkerId, usable : row.checkerWorkday*20/100, number : che, reason : cheReason})
            }
            if (row.principalWorkday !== undefined && row.principalWorkday !== 0){
              this.deductForm.deduct.push({roleId : 2, role : "主设", name : row.principal,
                userId : row.principalId, usable : row.principalWorkday*20/100, number : pri, reason : priReason})
            }
            if (row.headmanWorkday !== undefined && row.headmanWorkday !== 0){
              this.deductForm.deduct.push({roleId : 3, role : "组长", name : row.headman,
                userId : row.headmanId, usable : row.headmanWorkday*20/100, number : he, reason : heaReason})
            }
            this.deductVisible = true;
          }
        })
        .catch( res => console.log(res))

    },
    deductSubmit(){
      let bool = true;
      this.deductForm.deduct.forEach(item =>{
        if (Number(item.usable) < (-Number(item.number))){
          bool = false;
        }
      })
      if (bool) {
        this.$axios
          .post(this.$baseUrl + "taskDeduct/add", this.deductForm,)
          .then(res => {
            if (res.data.code === 0) {
              this.$message.success("操作成功")
              this.deductVisible = false;
            }
          })
          .catch(res => console.log(res))
      }else {
        this.$message.warning("惩罚工时不得高于可扣工时")
      }
    },
    arraySpanMethod({  columns, data }) {
      const means = [] // 合计
      columns.forEach((column, columnIndex) => {
        if (columnIndex === 0) {
          means.push('合计')
        } else {
          const values = data.map(item => Number(item[column.property]));
          // 合计
          if (!values.every(value => isNaN(value))) {
            means[columnIndex] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return (prev * 100 + curr * 100)/100;
              } else {
                return prev;
              }
            }, 0);
            // 改变了ele的合计方式，扩展了合计场景
            // 你以为就只有上面这样玩吗？错啦，你还可以自定义样式哦
            // means[columnIndex] = '<span style="color: red">' + means[columnIndex] + '元</span>'
            means[columnIndex] = means[columnIndex].toFixed(2)
          } else {
            means[columnIndex] = '';
          }
        }
      })
      // 返回一个二维数组的表尾合计(不要平均值，你就不要在数组中添加)
      return [means]
    },
  }
}
</script>

<style>
.mZIndex{
  z-index:3000 !important;
}
</style>
