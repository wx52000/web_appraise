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
              <el-button type="primary" size="mini" style="text-align: center; " @click="getWeight" >权重管理</el-button>
            </el-col>
          </el-row >
        <el-row style="width: 100%;text-align: center;">
        <template>
          <ux-grid ref="userTable" key="userlist" use-virtual v-loading="loading"
                   :max-height=pageHeight
                   :edit-config="{trigger: 'click', mode: 'cell'}"
                   element-loading-text="拼命加载中"
                   element-loading-spinner="el-icon-loading"
                   border :data="list" style="margin-top: 5px"
                   size="mini"
                   :default-sort = "{prop: 'date', order: 'descending'}"
                   :header-cell-style="this.CellStyleOne" :cell-style="this.CellStyleOne">
            <ux-table-column
              field = "name"
              sortable
              title="姓名"
              align="center"
              width="15%"
            >
            </ux-table-column>
            <ux-table-column
              field = "username"
              sortable
              title="工号"
              align="center"
              width="15%"
              >
            </ux-table-column>
            <ux-table-column
              field="technology"
              title="专业"
              align="center"
              column-key="technology"
              :filters="technology"
              :filter-method="filterMethod"
              width="20%"
              >
            </ux-table-column>
            <ux-table-column
              field="department"
              title="部门"
              align="center"
              column-key="department"
              :filters="department"
              :filter-method="filterMethod"
              width="30%"
              >
            </ux-table-column>
            <ux-table-column
              fixed="right"
              title="操作"
              width="20%"
            align="center">
              <template slot-scope="scope">
                <el-button
                  @click="handle(scope.row)"
                  type="text"
                  size="small">
                  管理
                </el-button>
              </template>
            </ux-table-column>
          </ux-grid>
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
    <el-drawer
      title="评价权重管理"
      :visible.sync="weightVisible"
      direction="rtl"
      width="60%">
      <el-form id="weight">
        <template>
          <el-tabs v-model="weightPage" @tab-click="weightTabClick" style="margin-left: 10px">
            <el-tab-pane
              :key="item.id"
              v-for="(item, index) in weightTabs"
              :label="item.name"
              :name="item.name"
            >
              <el-table
                :data="weightList"
                style="width: 100%">
                <el-table-column
                  prop="name"
                  name="职位名称"
                  width="180">
                </el-table-column>
                <el-table-column
                  name="权重"
                  width="180">
                  <template slot-scope="scope">
                    <el-input v-model="scope.row.weight" width="100%" style="text-align: center"></el-input>
                  </template>
                </el-table-column>
              </el-table>
              <el-button type="primary" @click="setWeight">确认</el-button>
            </el-tab-pane>
          </el-tabs>
        </template>
      </el-form>
    </el-drawer>
  </div>
</template>

<script>
export default {
  inject:['reload'],
  name: "Manage",
  data() {
    return {
      id: "",
      pageHeight : document.body.clientHeight,
      month: new Date().getMonth() + 1,
      loading: true,
      isShow : false,
      visible : false,
      rangeVisible : false,
      weightVisible : false,
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
      weightPage: "主任",
      weightTabs :[
        {id:2, name : "主任"},
        {id:3, name : "经理"},
        {id:4, name : "设总"},
        {id:5, name : "主设人"},
        {id:6, name : "设计人"},
      ],
      weightList : [],
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    reset() {
      this.search1 = "";
      this.search2 = "";
      this.getData();
    },
    getData() {
      this.$axios
        .post(this.$baseUrl + 'user/query', {
          "name" : this.search1,
          "username" : this.search2,
        },)
        .then(res => {this.list = res.data.data;
          this.loading  =false;
        this.list.forEach(item => {
          this.department.push2({value : item.department,label : item.department});
          this.technology.push2({value : item.technology,label : item.technology});
        })
          this.$refs.userTable.setFilter(this.$refs.userTable.getColumnByField('department'),this.department)
          this.$refs.userTable.setFilter(this.$refs.userTable.getColumnByField('technology'),this.technology)
          this.$refs.userTable.updateData()
        })
        .catch(res => (console.log(res)));
    },
    filterMethod({value, row, column}){
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
    weightTabClick(tab,event){
      this.$axios
        .post(this.$baseUrl + 'position/queryByWeight',{},
          {headers : {"id" :this.weightTabs[tab.index].id}})
        .then(res => (this.weightList = res.data.data))
        .catch(res => (console.log(res)));
    },
    getWeight() {
      this.$axios
        .post(this.$baseUrl + 'position/queryByWeight',{},
          {headers : {"id" : 2}})
        .then(res => {
          this.weightList = res.data.data;
          this.weightVisible = true
          console.log(this.weightList)
        })
        .catch(res => (console.log(res)));
    },
    setWeight() {
      this.$axios
        .post(this.$baseUrl + 'position/update', this.weightList
        )
        .then(res => (this.weightVisible = false))
        .catch(res => (console.log(res)));
      this.weightVisible = true
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
