<template>
  <div>
    <el-row style="margin:0 auto;text-align: center; align-content: center">
      <el-col :span="24" style="line-height: 50px;font-size: 16px;font-weight: bold;color: #666;text-align: center ">
        中国能建评价管理
      </el-col>
    </el-row>
        <el-form id="user">
          <el-row>
            <el-col :span="5" >姓名<el-input size="mini" v-model="search1" @keyup.enter.native="getData" style="width: 50%" ></el-input></el-col>
            <el-col :span="5" >工号<el-input size="mini" v-model="search2" @keyup.enter.native="getData" style="width: 50%" ></el-input></el-col>
            <el-col :span="4" style="text-align: right;">
              <el-button type="primary" size="mini" @click="search()">查询</el-button>
              <el-button size="mini" @click="reset()">重置</el-button>
            </el-col>
            <el-col :span="10">
            <el-button type="primary" size="mini" style="text-align: center; " @click="getRange" >评价取值范围管理</el-button>
              <el-button type="primary" size="mini" style="text-align: center; " @click="getRangeDate" >评价时间管理</el-button>
            </el-col>
          </el-row >
        <el-row style="width: 100%;text-align: center;">
        <template>
          <el-table
            ref="multipleTable"
            :data="list"
            tooltip-effect="dark"
            style="width: 90%;left: 5%"
            :row-key="getRowKeys"
            :default-sort = "{prop: 'date', order: 'descending'}"
            >
            <el-table-column
              prop="name"
              sortable
              label="姓名"
            >
            </el-table-column>
            <el-table-column
              prop="username"
              sortable
              label="工号"
              >
            </el-table-column>
            <el-table-column
              prop="technology"
              label="专业"
              column-key="technology"
              :filters="technology"
              :filter-method="filterMethod"
              >
            </el-table-column>
            <el-table-column
              prop="department"
              label="部门"
              column-key="department"
              :filters="department"
              :filter-method="filterMethod"
              >
            </el-table-column>
            <el-table-column
              fixed="right"
              label="操作"
              width="120">
              <template slot-scope="scope">
                <el-button
                  @click="handle(scope.row)"
                  type="text"
                  size="small">
                  管理
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        </el-row>
      </el-form>
    <el-dialog
      :visible.sync="visible"
      @close="closeDialog"
      width="70%">
      <el-row style="text-align: right">
        <el-switch
          v-model="grade"
          active-text="可打分"
          inactive-text="不可打分"
          :active-value = 1
          inactive-value = 0
          @change="gradeChange">
        </el-switch>
      </el-row>
            <el-tabs type="border-card">
                <el-tree
                  :data="userTree"
                  ref="userAppraise"
                  @check-change=""
                  @close="closeDialog"
                  :default-checked-keys="userAppraise"
                  show-checkbox
                  height='320px'
                  node-key = "id"
                >
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ node.label }}</span>
                    <span v-if="node.childNodes.length === 0">
                      <template>
                        <el-radio-group v-model="node.state" @change="handleRadio(node)">
                          <el-radio :label="undefined">不做操作</el-radio>
                          <el-radio :label="0">可打分</el-radio>
                          <el-radio :label="1">不可打分</el-radio>
                        </el-radio-group>
                      </template>
                    </span>
                 </span>
                </el-tree>
            </el-tabs>
    </el-dialog>
    <el-dialog
      title="评价取值范围管理"
      :visible.sync="rangeVisible"
      width="60%">
      <el-form id="range">
        <el-row>
          <el-col :span="8" >最小值<el-input v-model="min" style="width: 50%" ></el-input></el-col>
          <el-col :span="8" >最大值<el-input v-model="max" style="width: 50%" ></el-input></el-col>
          <el-col :span="8" style="text-align: right;">
            <el-button type="primary" @click="rangeUpd">确定</el-button>
            <el-button @click="rangeReset">重置</el-button>
          </el-col>
        </el-row >
      </el-form>
    </el-dialog>
    <el-dialog
      title="评价时间范围管理"
      :visible.sync="rangeDateVisible"
      width="60%">
      <el-form id="rangeDate">
        <el-row>
          <el-col :span="8" >开始日期<el-input v-model="startDay" style="width: 50%" ></el-input></el-col>
          <el-col :span="8" >结束日期<el-input v-model="endDay" style="width: 50%" ></el-input></el-col>
          <el-col :span="8" style="text-align: right;">
            <el-button type="primary" @click="rangeDateUpd">确定</el-button>
            <el-button @click="rangeReset">重置</el-button>
          </el-col>
        </el-row >
      </el-form>
    </el-dialog>
    <news-dialog class="news" :is-show="isShow" @click.native="isShow = !isShow">
    </news-dialog>
  </div>
</template>

<script>
export default {
  inject:['reload'],
  name: "Manage",
  data() {
    return {
      id: "",
      month: new Date().getMonth() + 1,
      isShow : false,
      visible : false,
      rangeVisible : false,
      rangeDateVisible : false,
      min: "",
      max : "",
      startDay : "",
      endDay : "",
      list : [],
      department: [],
      technology: [],
      pageIndex : 1,
      totalSize : 0,
      search1 : '',
      search2 : '',
      userTree : [],
      userAppraise : [],
      rowId : null,
      grade : 0,
    }
  },
  mounted() {
    this.getLogIn();
    // this.getData();
  },
  methods: {
    reset() {
      this.search1 = "";
      this.search2 = "";
      this.getData();
    },
    getLogIn() {
      let i = JSON.parse(sessionStorage.getItem("appraise"));
      this.id = i.id;
      this.getData();
    },
    getData() {
      this.$axios
        .post(this.$baseUrl + 'user/query', {
          "pageIndex" : 1,
          "pageSize" : 10000,
          "name" : this.search1,
          "username" : this.search2,
        },)
        .then(res => {this.list = res.data.data.list;
        this.list.forEach(item => {
          this.department.push2({value : item.department,text : item.department});
          this.technology.push2({value : item.technology,text : item.technology})
        })
        })
        .catch(res => (console.log(res)));
    },
    filterMethod(value, row, column){
      const property = column['property'];
      return row[property] === value;
    },
    getRowKeys(row) {
      return row.id;   //指定row-key的一个标识
    },
    handle(row){
      this.grade = row.grade
      console.log(this.grade)
      this.rowId = row.id;
        this.$axios
          .post(this.$baseUrl + 'user/userAllAndState',{},{headers:{id : row.id}})
          .then(res => {this.userTree = res.data.data; })
          .catch(res => (console.log(res)));
      this.$axios
        .post(this.$baseUrl + 'user/queryScoreList',{
          "id" : row.id,
          "name" : row.name,
          "did" : row.did,
          "tid" : row.tid,
        },)
        .then(res => {this.userAppraise = res.data.data;
        this.visible = true
        })
        .catch(res => (console.log(res)));
    },
    gradeChange(){
        this.$axios
          .post(this.$baseUrl + 'user/upd', {
            id : this.rowId,
            grade : this.grade
          })
          .then(res => {
            this.$message("权限修改成功")
          })
          .catch(res => (console.log(res)));
    },
    closeDialog(){
      this.userAppraise = [];
      this.rowId = null;
      this.$nextTick(function (){
        this.$refs.userAppraise.setCheckedKeys([]);
      });
      this.visible = false
      this.getData()
    },
    handleRadio(node){
      this.$axios
        .post(this.$baseUrl + 'scoreManage/handle',{
          scoreId : this.rowId,
          scoredId : node.data.id,
          state : node.state
        },)
        .then(res => {this.userAppraise = res.data.data;
          this.visible = true
        })
        .catch(res => (console.log(res)));
    },
    getRange() {
      this.$axios
        .post(this.$baseUrl + 'range/query')
        .then(res => (this.min = res.data.data.min,
          this.max = res.data.data.max))
        .catch(res => (console.log(res)));
      this.rangeVisible = true
    },
    rangeReset(){
      this.$axios
        .post(this.$baseUrl + 'range/query')
        .then(res => (this.min = res.data.data.min,
          this.max = res.data.data.max))
        .catch(res => (console.log(res)));
    },
    rangeUpd(){
      this.$axios
        .post(this.$baseUrl + 'range/update',{
          "id" : 1,
          "min" : this.min,
          "max" : this.max
        })
        .then(res => {this.$message("修改成功")})
        .catch(res => (console.log(res)));
      this.rangeVisible = false;
    },
    getRangeDate() {
      this.$axios
        .post(this.$baseUrl + 'range/queryDate')
        .then(res => (this.endDay = res.data.data.end,
          this.startDay = res.data.data.start))
        .catch(res => (console.log(res)));
      this.rangeDateVisible = true
    },
    rangeResetDate(){
      this.$axios
        .post(this.$baseUrl + 'range/queryDate')
        .then(res => (this.endDay = res.data.data.end,
          this.startDay = res.data.data.start))
        .catch(res => (console.log(res)));
    },
    rangeDateUpd(){
      this.$axios
        .post(this.$baseUrl + 'range/updateDate',{
          "id" : 1,
          "min" : this.endDay,
          "max" : this.startDay
        })
        .then(res => {this.$message("修改成功")})
        .catch(res => (console.log(res)));
      this.rangeDateVisible = false;
    },
    }
  }
</script>

<style scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>
