<template>
  <div>
    <el-badge :value="list.length" :max="99"  >
      <el-button circle icon="el-icon-chat-square" class="item" @click.native="isShow = !isShow"></el-button>
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
      <el-row align="center" slot="title" style="margin-left: 125px">
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
            <div v-if="scope.row.type === 0 || scope.row.type === 1">
              <el-form label-position="left" size="mini">
                <el-row v-for="(item,index) in scope.row.list" :key="index">
                    <el-form-item>
                      <span>{{ item.tec }} : {{ item.workday }}</span>
                    </el-form-item>
                </el-row>
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
                <el-form-item label="管理工时">
                  <span>{{ scope.row.manage }}</span>
                </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="10">
                <el-form-item label="备用工时">
                  <span>{{ scope.row.backup }}</span>
                </el-form-item>
                  </el-col>
                  <el-col :span="10">
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
                <el-row v-for="(item,index) in scope.row.list" :key="index+'4'">
                  <el-form-item >
                    <span>{{ item.number }} - {{ item.name }} : 总工时{{ item.workday }}
                    设计：{{ item.designer }}， 校核：{{ item.checker }}，
                      主设：{{ item.principal }}， 组长：{{ item.headman }}</span>
                  </el-form-item>
                </el-row>
              </el-form>
            </div>
            <div v-if="scope.row.type === 5">
              <span>申报工时月份: </span><span style="font-weight: bold">{{scope.row.submit_date}}</span>
              <u-table key="list5" use-virtual :row-height="30"
                      :data="scope.row.list" size="mini"
                       height="180" :show-header="false">
                <u-table-column
                  fixed
                width="96px">
                  <template slot-scope="scope">
                    <el-button size="mini" @click="openDeduct(scope.row)">工时管控</el-button>
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
              </u-table>
            </div>
          </template>
        </u-table-column>
        <u-table-column
          label="审核类型"
          width="100px"
          prop="type">
          <template slot-scope="scope">
            <span>
            {{scope.row.type | typeFilter}}
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
  {id : 5, name : "工时报审"},]

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
      const s = typeList.find(obj => obj.id === val)
      return s.name
    }
  },
  mounted() {
    this.getNews()
    },
  methods:{
    // getCount(){
    //   this.$axios
    //     .post(this.$baseUrl + "news/count",{},{headers:{id:this.id}})
    //     .then(res => {
    //       this.count  = res.data.data
    //       this.$forceUpdate
    //     })
    //     .catch( res => console.log(res))
    // },
    getNews(){
      this.$axios
        .post(this.$baseUrl + "news/query",{})
        .then(res => {
          this.list = res.data.data
          this.logSelection = true;
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
        this.$message.warning("未选审核项")
      }
        this.$axios
          .post(this.$baseUrl + "news/check",this.multipleSelection,{headers :{ check :1}})
          .then(res => {
            if(res.data.code === 0){
              this.getNews();
            this.$message.success("审核通过成功")
            this.isShow = false;
            }
                        })
          .catch( res => console.log(res))
    },
    CheckerCancel(row){
      if (this.multipleSelection.length === 0){
        this.$message.warning("未选审核项")
      }
        this.$axios
        .post(this.$baseUrl + "news/check",this.multipleSelection,{headers : {check : 2}})
        .then(res => {
          if(res.data.code === 0){
            this.getNews();
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
            if (res.data.data !== undefined && res.data.data !== null){
              des = res.data.data.designer;
              che = res.data.data.checker;
              pri = res.data.data.principal;
              he = res.data.data.headman;
            }
            console.log("aaa")
            if (row.designerWorkday !== undefined && row.designerWorkday !== 0){
              this.deductForm.deduct.push({roleId : 0, role : "设计", name : row.designer,
                userId : row.designerId, usable : row.designerWorkday, number : des, reason : ""})
            }
            if (row.checkerWorkday !== undefined && row.checkerWorkday !== 0){
              this.deductForm.deduct.push({roleId : 1, role : "校核", name : row.checker,
                userId : row.checkerId, usable : row.checkerWorkday, number : che, reason : ""})
            }
            if (row.principalWorkday !== undefined && row.principalWorkday !== 0){
              this.deductForm.deduct.push({roleId : 2, role : "主设", name : row.principal,
                userId : row.principalId, usable : row.principalWorkday, number : pri, reason : ""})
            }
            if (row.headmanWorkday !== undefined && row.headmanWorkday !== 0){
              this.deductForm.deduct.push({roleId : 3, role : "组长", name : row.headman,
                userId : row.headmanId, usable : row.headmanWorkday, number : he, reason : ""})
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
  }
}
</script>

<style>
.mZIndex{
  z-index:3000 !important;
}
</style>
