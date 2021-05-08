<template>
  <div>
    <el-row style="margin:0 auto;text-align: center; align-content: center">
      <el-col :span="24" style="line-height: 50px;font-size: 16px;font-weight: bold;color: #666;text-align: center ">
        中国能建评价管理
      </el-col>
    </el-row>
        <el-form id="user">
          <el-row>
            <el-col :span="8" >姓名<el-input size="mini" v-model="search1" style="width: 50%" ></el-input></el-col>
            <el-col :span="8" >工号<el-input size="mini" v-model="search2" style="width: 50%" ></el-input></el-col>
            <el-col :span="8" style="text-align: right;">
              <el-button type="primary" size="mini" @click="search()">查询</el-button>
              <el-button size="mini" @click="reset()">重置</el-button>
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
      @close=""
      width="70%">
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
            <el-button  size="small " style="margin-right: 10%" @click="closeDialog">取消</el-button>
            <el-button type="primary" size="small " style="margin-left: 10%" @click="submit">确定</el-button>
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
      this.getUser(this.visibleId);
    },
    getLogIn() {
      let i = JSON.parse(sessionStorage.getItem("appraise"));
      this.id = i.id;
      this.getData();
    },
    getData() {
      this.$axios
        .post(this.$baseUrl + 'user/queryAppriseAll', {},)
        .then(res => {this.list = res.data.data;
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
    submit(){

    },
    closeDialog(){
      this.userAppraise = [];
      this.rowId = null;
      this.$nextTick(function (){
        this.$refs.userAppraise.setCheckedKeys([]);
      });
      this.visible = false
    },
    handleRadio(node){
      console.log(node)
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
    }

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
