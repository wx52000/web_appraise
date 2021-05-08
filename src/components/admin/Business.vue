<template>
<div>
  <el-row style="background-color: #FFF; text-align: center">
      <el-row style="margin-left:-10px;text-align: center; align-content: center;">
        <el-col :span="24" style="line-height: 50px;font-size: 16px;font-weight: bold;color: #666;text-align: center ">
          初设前期项目管理
<!--          <i class="el-icon-document-copy" @click="excelDialog = true"></i>-->
        </el-col>
      </el-row>
  </el-row>
  <el-row style="margin-left:-10px; align-content: center;">
    <el-col  align="right">
      <el-button style="margin-right: 50px"  type="primary" @click="opennewActivity">新增项目</el-button>
    </el-col>
  </el-row>
  <el-table border :data="list" class="el-table"
            :row-class-name="tableRowClassName"
            :header-cell-style="{background:'#F5F5F5'}">
    <el-table-column prop="name" min-width="16%" label="活动名称" align="center">
    </el-table-column>
    <el-table-column prop="general" min-width="8" label="总负责人" align="center" style="word-break: break-all;">
    </el-table-column>
    <el-table-column prop="workday" min-width="8" label="总工时" align="center" style="word-break: break-all;">
    </el-table-column>
    <el-table-column prop="start_date" min-width="8" label="开始时间" align="center" style="word-break: break-all;">
    </el-table-column>
    <el-table-column prop="end_date" min-width="8" label="结束时间" align="center" style="word-break: break-all;">
    </el-table-column>
    <el-table-column prop="create_user" min-width="8" label="创建人" align="center" style="word-break: break-all;">
    </el-table-column>
    <el-table-column prop="create_date" min-width="8" label="创建时间" align="center" style="word-break: break-all;">
    </el-table-column>
    <el-table-column  min-width="20%" align="center">
      <template slot-scope="scope">
        <el-row>
          <el-col :span="12">
            <el-button
              size="mini"
              @click="openProject(scope.row)">活动管理</el-button>
          </el-col>
        </el-row>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog
    :visible.sync="visible_project"
    @close="closeDialog"
    width="70%">
    <el-container>
      <el-header style="background: #B3C0D1 ;color: #333; text-align: left;height:40px;" >
        <el-row>
          <el-col :span="8">{{visibleName}}</el-col>
        </el-row>
      </el-header>
      <el-form :model="newActivity" ref="newActivity">
        <el-main>
          <el-row>
            <el-col :span="12">
              <el-form-item label="活动名称" size="mini" label-width="80px">
                <el-input type="text"  v-model="newActivity.name" style="width: 80%" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="活动时间" size="mini" label-width="80px" >
                <el-date-picker
                  v-model="newActivity.date"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd"
                  size="mini">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="总负责人" size="mini" label-width="80px">
                <el-select v-model="newActivity.general" size="mini"
                           :filterable="true"  :remote="true"
                           :remote-method="remoteMethod"
                           :loading="nameLoading"
                           multiple
                           :multiple-limit="3"
                           placeholder="请输入人员姓名或工号">
                  <el-option
                    v-for="item in nameList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="总工时" size="mini" label-width="80px" >
                <el-input type="text"  v-model="newActivity.workday" style="width: 80%"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-tabs type="border-card">
            <el-tab-pane label="人员选择">
              <el-tree
                :data="userTree"
                ref="principal"
                @check-change="checkChangePrincipal"
                :default-checked-keys="newActivity.principal"
                show-checkbox
                placeholder="请输入人员名字"
                height='320px'
                node-key = "id"
                mode='transfer'
              >
                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ node.label }}</span>
                    <span>
                      <template v-if="node.childNodes.length === 0">
                            <el-select size="mini" style="width: 250px"
                                       v-model="data.group"
                                       multiple :multiple-limit="2"
                                       placeholder="请选择关联负责人"
                                       @change="((e) => selectGroup(e,data))"
                                       @visible-change="callback => groupCallback(callback,data)"
                                       @remove-tag="tagRemove">
                              <el-option
                                v-for="item in principalList"
                                :key="item.id"
                                :label="item.label"
                                :value="item.id">
                              </el-option>
                            </el-select>
                        <button size="mini" @click="openDesignerTree(data)">设计人员管理</button>
                      </template>
                    </span>
                 </span>
              </el-tree>
            </el-tab-pane>
            <el-tab-pane label="主设工时分配管理">
            </el-tab-pane>
            <el-tab-pane label="设计工时管理">
            </el-tab-pane>
          </el-tabs>
          <el-button  size="small " style="margin-right: 10%" @click="closeDialog()">取消</el-button>
          <el-button type="primary" size="small " style="margin-left: 10%" @click="submit">确定</el-button>
        </el-main>
      </el-form>
    </el-container>
  </el-dialog>
  <el-dialog
    :visible.sync="visible_designer"
    @close="closeDialogDesigner"
    width="35%">
        <el-main>
              <el-tree
                :data="userTree"
                ref="designer"
                :default-checked-keys="designer"
                show-checkbox
                placeholder="请输入人员名字"
                height='320px'
                node-key = "id"
              >
              </el-tree>
          <el-button  size="small " style="margin-right: 10%" @click="closeDialogDesigner">取消</el-button>
          <el-button type="primary" size="small " style="margin-left: 10%" @click="submitDesigner">确定</el-button>
        </el-main>
  </el-dialog>
  <news-dialog class="news" :is-show="isShow" @click.native="isShow = !isShow">
  </news-dialog>
</div>
</template>

<script>
import treeTransfer  from 'el-tree-transfer'
export default {
name: "Business",
  data(){
    return{
      id: "",
      pid: "",
      tid : "",
      isShow : false,
      list : [],
      visible_project : false,
      visible_designer : false,
      visibleName : "",
      newActivity : {
        principal_group : [],
        principalState : false,
        designer:[],
      },
      group : "",
      designer : [],
      nameList : [],
      nameLoading : true,
      userTree : [],
      groupItem : [],
      principalList : [],
    }
  },
  components:{
  treeTransfer
  },
  mounted() {
  this.getLogIn();
  },
  methods:{
    getLogIn() {
      let i = JSON.parse(sessionStorage.getItem("appraise"));
      this.id = i.id;
      this.pid = i.pid;
      this.tid = i.tid;
      this.getData();
    },
    getData(){
      this.$axios
      .post(this.$baseUrl + 'activity/query')
      .then(res => {this.list = res.data.data
      })
      .catch(res => (console.log(res.data)))
    },
    tableRowClassName({row, rowIndex}) {
      //把每一行的索引放进row
      row.index = rowIndex;
    },
    getSimpleCheckedNodes(store) {
      const checkedNodes = [];
      const traverse = function(node) {
        const childNodes = node.root ? node.root.childNodes : node.childNodes;
        childNodes.forEach(child => {
          if (child.checked || child.indeterminate) {
            if (child.checked && child.childNodes.length === 0) {
              checkedNodes.push(child.data);
            } else {
              traverse(child);
            }
          }
        });
      };
      traverse(store)
      return checkedNodes;
    },
    opennewActivity(){
      this.visible_project = true
      this.$axios
        .post(this.$baseUrl + 'user/userAllAndGroup',{},{headers:{id : 0}})
        .then(res => {this.userTree = res.data.data; })
        .catch(res => (console.log(res)));
    },
    openProject(row){
      this.newActivity.id = row.id;
      this.newActivity.name = row.name;
      this.newActivity.number = row.number
      this.newActivity.workday = row.workday;
      this.newActivity.projectId = row.pid;
      this.newActivity.date = row.date;
      this.$axios
        .post(this.$baseUrl + 'user/userAllAndGroup',{},{headers:{id : row.id,mode : 1}})
        .then(res => {this.userTree = res.data.data;
          this.$axios
            .post(this.$baseUrl + 'activity/queryById',{},{headers:{id : row.id}})
            .then(res => {this.newActivity.general = res.data.data.general;
              this.newActivity.principal = res.data.data.principal;
              this.newActivity.principal_group = res.data.data.principal_group
              this.principalList = this.getSimpleCheckedNodes(this.$refs.principal.store);
              this.$nextTick(function (){
                this.$refs.principal.setCheckedKeys(this.newActivity.principal);
                this.$forceUpdate()
              });
            })
            .catch(res => (console.log(res)));})
        .catch(res => (console.log(res)));
      this.visible_project = true;
    },
    openDesignerTree(data){
      this.group = data.id
      for (let i=0;i < this.newActivity.principal_group.length;i++){
        if (this.newActivity.principal_group[i].id.toString() === data.id.toString()){
          this.group = this.newActivity.principal_group[i].group
          break;
        }
      }
      for (let i = 0; i < this.newActivity.designer.length;i++){
        if (this.group === this.newActivity.designer[i].principal){
         this.designer = this.newActivity.designer[i].list
          break;
        }
      }
      this.visible_designer = true
    },
    checkChangePrincipal(){
      if (this.newActivity.principalState === false)
        this.newActivity.principalState = true;
      this.newActivity.principal = this.$refs.principal.getCheckedKeys(1)
      this.principalList = this.getSimpleCheckedNodes(this.$refs.principal.store)
    },
    //event下拉列表的值。 data选中子支的值
    selectGroup(event,data){
      let existIn = false
      let group = data.id
      //判断树中选中的主设人是否已于其他主设人组队
      for (let i = 0 ; i < this.newActivity.principal_group.length; i++){
        if (data.id.toString() === this.newActivity.principal_group[i].id.toString()) {
          group = this.newActivity.principal_group[i].group;
          existIn = true;
          break;
        }
      }
      // 如果已组队，则取出队伍号，判断是否有成员删除
      if (existIn){
        for (let i = 1 ; i < this.newActivity.principal_group.length; i++){
          let item1 = this.newActivity.principal_group[i]
          let exist = false;
            for (let j= 0 ; j < event.length ; j++) {
              if (event[j] === item1.id && group === item1.group) {
                exist = true;
                break;
              }
            }
            if (!exist) {
              if (item1.group === group) {
                this.newActivity.principal_group.splice(i, 1);
                i--;
              }
            }
        }
        // 去重插入
        event.forEach(item => {
          this.newActivity.principal_group.push2({
            id : item, group : group
          })
        })
      }
      if (!existIn){
        this.newActivity.principal_group.push2({id : data.id , group : group})
        event.forEach(item => {
          this.newActivity.principal_group.push2({
            id : item,group : group
          })
        })
      }
      this.$forceUpdate()
      console.log("selectGroup")
    },
    groupCallback(callback,data){
      if (callback){
        this.groupItem = data.group
      }else {
        data.group.forEach(item => {
          this.groupItem.splice(this.groupItem.indexOf(item),1)
        })
        data.group.forEach(item =>{
          for (let i=0 ; i< this.userTree.length;i++){
           let tree = this.userTree[i]
            let exist1 = false;
              for (let j=0; j < tree.children.length;j++){
                let node = tree.children[j]
                let exist2 = false;
                  for (let k=0; k< node.children.length ; k++){
                    let child = node.children[k]
                    if (child.id === item){
                      child.group.push2(data.id)
                      exist1 = true;
                      exist2 = true;
                      data.group.forEach(n => {
                        if (n !== item){
                          child.group.push2(n)
                        }
                      })
                      this.groupItem.forEach(n => {
                        child.group.splice(child.group.indexOf(n),1)
                      })
                      break;
                  }
                }
                  if (exist2)
                    break;
            }
              if (exist1)
                break;
         }
        })
        this.groupItem.forEach(item =>{
          for (let i=0 ; i< this.userTree.length;i++){
            let tree = this.userTree[i]
            let exist1 = false;
              for (let j=0; j < tree.children.length;j++){
                let node = tree.children[j]
                let exist2 = false;
                  for (let k=0; k< node.children.length ; k++){
                    let child = node.children[k]
                    if (child.id === item){
                      exist1 = true;
                      child.group = [];
                      break;
                    }
                  }
                  if (exist2)
                    break;
              }
              if (exist1)
                break;
          }
        })
        this.groupItem = [];
      }
      this.$forceUpdate();
      console.log("selectGroup")
    },
    tagRemove(){
      console.log("TagRemove")
      this.$forceUpdate()
    },
    remoteMethod(query) {
    if (query !== '') {
    this.nameLoading = true;
      this.$axios
        .post(this.$baseUrl + 'user/queryByName', {
            "name" : query
          }
        )
        .then(res => {
          if (res.data.data != null) {
            this.nameList = res.data.data
          }
          this.nameLoading = false;
        })
        .catch(res => (console.log(res.data)))
      } else {
          this.nameList = [];
      }
    },
    submit(){
      let date = new Date;
      let year = date.getFullYear();
      let month = date.getMonth()+1;
      let day = date.getDate();
      this.newActivity.creatDate = year  + "-" + month + "-" + day
      this.newActivity.creatUser = this.id
      this.newActivity.state = 0;
      this.$axios
        .post(this.$baseUrl + 'activity/setProject', this.newActivity)
        .then(res => {
          this.visible_project = false;
        })
        .catch(res => (console.log(res.data)))
    },
    submitDesigner() {
      for (let i = 0; i < this.newActivity.designer.length; i++) {
        if (this.newActivity.designer[i].principal === this.group) {
          this.newActivity.designer.splice(i, 1)
        }
      }
      if (this.$refs.designer.getCheckedKeys(1).length > 0) {
      this.newActivity.designer.push2({principal: this.group, list: this.$refs.designer.getCheckedKeys(1)})
      }
      this.visible_designer = false;
    },
    closeDialog(){
      this.getData();
      this.$nextTick(function (){
          this.$refs.principal.setCheckedKeys([]);
      });
      this.newActivity ={
        principal_group : [],
        principalState : false,
        designer:[],
      };
      this.visible_project=false;
    },
    closeDialogDesigner(){
      this.designer = [];
      this.group = "";
      this.$refs.designer.setCheckedKeys([]);
      this.visible_designer = false;
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
