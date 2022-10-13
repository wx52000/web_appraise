<template>
  <div>
    <el-row style="margin-top: 5px" v-if="$parent.scientific.principalRole">
      <el-col :span="8">
        <el-button size="mini" @click="openNewTask()">工时发放</el-button>
      </el-col>
      <el-col :span="8">
        审核人
        <el-select v-model="checker" placeholder="请选择" style="width: 160px" size="mini"
                   @change="selectChecker">
          <el-option
            v-for="item in checkerList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-col>
        <el-col :span="8" style="text-align: center">
          申报月份<el-select  v-model="declareDate" placeholder="请选择" size="mini" style="width: 160px">
          <el-option
            v-for="item in declareMonth"
            :key="item"
            :label="item"
            :value="item">
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row>
      <ux-grid use-virtual
               :max-height=pageHeight
               border :data="list" style="margin-top: 5px"
               size="mini"
               :default-sort = "{prop: 'date', order: 'descending'}">
        <ux-table-column
          type="index"
          width="50">
        </ux-table-column>
        <ux-table-column field="number" title="发放流水号"  min-width="80px" sortable align="center">
        </ux-table-column>
        <ux-table-column field="name" title="发放事由"  min-width="150px" sortable align="center">
        </ux-table-column>
        <ux-table-column field="workday" title="工时"  min-width="80px" sortable align="center">
        </ux-table-column>
        <ux-table-column field="userName" title="获得者"  min-width="100px" sortable align="center">
        </ux-table-column>
        <ux-table-column field="creator" title="创建人"  min-width="100px" sortable align="center">
        </ux-table-column>
        <ux-table-column field="createDate" title="创建时间"  min-width="100px" sortable align="center">
        </ux-table-column>
        <ux-table-column  title="工时状态"  min-width="100px" sortable align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.submit === 0 && scope.row.checkRole" size="mini" @click="submitTask(scope.row)">发送审核</el-button>
            <span v-else>{{scope.row |submitFilter}}</span>
          </template>
        </ux-table-column>
      </ux-grid>
    </el-row>
    <el-dialog
      v-el-drag-dialog
      title="工时发放"
      :visible.sync="taskVisible"
      width="60%">
      <el-form size="mini" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="发放流水号" >
              <el-input v-model="task.number" disabled size="mini">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发放事由" >
              <el-input v-model="task.name" size="mini">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="剩余工时" >
              <el-input v-model="task.surplus" disabled size="mini">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工时总数"  >
              <el-input :value.trim="taskWorkdaySum" disabled size="mini">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-for="(item,index) in task.list" :key="index" style="white-space: normal">
          <el-col :span="11">
            <el-form-item label="负责人" value-key="id" label-width="60px">
              <el-select size="mini" v-model="item.user" style="width: 80%;"
                         :filterable="true"  :remote="true"
                         :remote-method="(e) => remoteMethod(e,index)"
                         placeholder="请输入人员姓名或工号">
                <el-option
                  v-for="(i) in selectList"
                  :key="i.id"
                  :label="i.name"
                  :value="i.id">
                  <span style="float: left">{{ i.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ i.username }}</span>
                </el-option></el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="工时" value-key="id" label-width="60px">
              <el-input v-model="item.workday" size="mini">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button v-if="index !== 0" size="mini" circle icon="el-icon-remove-outline" @click="delUser(index,item)"/>
          </el-col>
        </el-row>
        <el-divider content-position="center">
          <el-button  type="text" @click="addUser()">点此补充人员</el-button></el-divider>
        <el-button size="mini"  @click="taskVisible = false">
          取消
        </el-button>
        <el-button size="mini"  @click="setNewTask()">
          新增
        </el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "ScientificWorkdayManage",
  data(){
    return{
      pageHeight : document.body.clientHeight,
      projectId : "",
      list : [],
      task : {
        list : [],
      },
      declareDate : "",
      declareMonth : [],
      taskVisible : false,
      selectList : [],
      checker : "",
      checkerList : [],
    }
  },
  filters :{
    submitFilter(row){
      if (row.submit === 1){
        return  "待审核"
      }
      if (row.submit === 2){
        return "审核通过"
      }
    }
  },
  computed :{
    taskWorkdaySum(){
      return this.task.list.reduce((prev,cur) =>{
        if (cur.workday !== undefined && cur.workday !== "") {
          return Number(prev) + Number(cur.workday)
        }else return prev},0)
    }
  },
  mounted() {
    this.projectId = this.$route.query.scientific_id;
    console.log(this.checker)
    const a = new Date();
    let nowMonth = a.getFullYear() + "-" + (Number(a.getMonth()) + 1).toString().padStart(2,0)
    this.$axios
      .post(this.$baseUrl + 'project/declareDay'
      )
      .then(res => {
        let day = res.data.data
        const c = new Date(new Date().getTime()-3600*24*day*1000)
        let month1 = c.getFullYear() + "-" + (Number(c.getMonth()) + 1).toString().padStart(2,0)
        this.declareMonth.push2(month1);
        this.declareMonth.push2(nowMonth);
        this.declareDate = month1
      })
      .catch(res => (console.log(res)));
    this.getData()
  },
  methods : {
    getData(){
      this.$axios
        .post(this.$baseUrl + 'scientificTask/queryTask',
          {}, {headers :{ id : this.projectId}}
        )
        .then(res => {
          this.list = res.data.data
        });
      this.$axios
        .post(this.$baseUrl + 'project/getCheckerList', {}, {headers: {type: 0}})
        .then(res => {
          this.checkerList = res.data.data
          this.checker = this.$parent.scientific.checker
          this.$forceUpdate()
        })
        .catch(res => console.log(res))
    },
    selectChecker() {
      this.$axios
        .post(this.$baseUrl + 'scientificLeader/setLeaderChecker',
          {
            id: this.projectId,
            checker: this.checker.id,
            submitDate : this.declareDate
          }
        )
        .then(res => {
          this.$message.success("操作成功")
        });
    },
    submitTask(row){
      this.$axios
        .post(this.$baseUrl + 'scientificTask/taskSubmit',
          {
            id: row.id,
            checker: this.checker
          }
        )
        .then(res => {
          row.submit = 1

          this.$message.success("操作成功")
        });
    },
    openNewTask(){
      this.task = {
       name : "",
       list : [ { user : "", workday : 0}]
      }
      this.$axios
        .post(this.$baseUrl + 'scientificTask/querySurplus',
          {}, {headers :{ id : this.projectId}}
        )
        .then(res => {
          this.task.projectId = this.projectId
          this.task.scientifidLeaderId = res.data.data.id
          this.task.number = res.data.data.number
          this.task.surplus = res.data.data.surplus
          this.taskVisible = true
        });
    },
    setNewTask(){
      this.$axios
        .post(this.$baseUrl + 'scientificTask/addTask',
        this.task)
        .then(res => {
          this.taskVisible = false
          this.$message.success("操作成功")
        });
    },
    addUser(){
      this.task.list.push({user : "",workday : 0})
    },
    delUser(index,item){
      this.task.list.splice(index,1)
    },
    remoteMethod(query,index) {
      this.selectList = [];
      if (query !== '') {
        setTimeout(() => {
          this.$axios
            .post(this.$baseUrl + 'user/queryByName', {
                "name" : query
              }
            )
            .then(res => {
              this.selectList = res.data.data
            });
        }, 200);
      } else {
        this.nameList = [];
      }
    },
  }
}
</script>

<style scoped>

</style>
