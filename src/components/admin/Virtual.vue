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
      <el-button style="margin-right: 50px"  type="primary" @click="openNewProject">新增项目</el-button>
    </el-col>
  </el-row>
  <el-table border :data="list" class="el-table"
            :row-class-name="tableRowClassName"
            :header-cell-style="{background:'#F5F5F5'}">
    <el-table-column prop="number" min-width="16%" label="项目编号" align="center"  >
    </el-table-column>
    <el-table-column prop="name" min-width="22%" label="项目名称" align="center">
    </el-table-column>
    <el-table-column prop="general" min-width="8" label="设总" align="center" style="word-break: break-all;">
    </el-table-column>
    <el-table-column prop="workday" min-width="8" label="总工时" align="center" style="word-break: break-all;">
    </el-table-column>
    <el-table-column prop="creatUser" min-width="8" label="创建人" align="center" style="word-break: break-all;">
    </el-table-column>
    <el-table-column prop="creatDate" min-width="8" label="创建时间" align="center" style="word-break: break-all;">
    </el-table-column>
    <el-table-column  min-width="20%" align="center">
      <template slot-scope="scope">
        <el-row>
          <el-col :span="12">
            <el-button
              size="mini"
              @click="openProject(scope.row)">项目管理</el-button>
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
      <el-form :model="newProject" ref="newProject">
        <el-main>
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目名称" size="mini" label-width="80px">
                <el-input type="text"  v-model="newProject.name" style="width: 80%" ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目编号" size="mini" label-width="80px" >
                <el-input type="text"  v-model="newProject.number" style="width: 80%"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="设总" size="mini" label-width="80px">
                <el-select v-model="newProject.general" size="mini"
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
                <el-input type="text"  v-model="newProject.workday" style="width: 80%"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-tabs type="border-card"  @tab-click="handleClick">
            <el-tab-pane label="人员选择">
              <el-tree
                :data="userTree"
                ref="principal"
                @check-change="checkChangePrincipal"
                :default-checked-keys="newProject.principal"
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
                                       placeholder="请选择关联主设人"
                                       @change="((e) => selectGroup(e,data))"
                                       @visible-change="callback => groupCallback(callback,data)">
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
              <el-row>
                <el-col :span="8" style="font-weight: bold">
                  主设人名称
                </el-col>
                <el-col :span="8" style="font-weight: bold">
                  主设人可分配工时
                </el-col>
                <el-col :span="8" style="font-weight: bold">
                  主设人获得工时
                </el-col>
              </el-row>
              <el-row v-for="(item,index) in principalData" style="margin-top: 5px" :key="index">
                <el-col :span="8">
                  {{item.name}}
                </el-col>
                <el-col :span="8">
                  <el-input type="type" size="mini" style="width: 50%" v-model="item.manage_workday"></el-input>
                </el-col>
                <el-col :span="8">
                  <el-input type="type" size="mini" style="width: 50%" v-model="item.workday"></el-input>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane >
              <template slot="label">
                <el-dropdown :hide-on-click="false" @command="handleCommand"  trigger="click">
                  <span class="el-dropdown-link">
                   设计工时管理 <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(item,index) in newProject.designer" :key="index"
                    :command="index">{{item.name}}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
              <el-row>
                <el-col :span="12" style="font-weight: bold">
                  设计让名称
                </el-col>
                <el-col :span="12" style="font-weight: bold">
                  主设人获得工时
                </el-col>
              </el-row>
              <el-row v-for="(item,index) in designerData.list" style="margin-top: 5px" :key="index">
                <el-col :span="12">
                  {{item.name}}
                </el-col>
                <el-col :span="12">
                  <el-input type="type" size="mini" style="width: 50%" v-model="item.workday"></el-input>
                </el-col>
              </el-row>
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
name: "Virtual",
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
      newProject : {
        principal_group : [],
        principalState : false,
        designer:[],
      },
      group : "",
      groupName : "",
      // 用于设计人树显示
      designer : [],
      // 用于工时
      designerData : {},
      principalData : [],
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
      .post(this.$baseUrl + 'virtual/query')
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
    openNewProject(){
      this.visible_project = true
      this.$axios
        .post(this.$baseUrl + 'user/userAllAndGroup',{},{headers:{id : 0}})
        .then(res => {this.userTree = res.data.data; })
        .catch(res => (console.log(res)));
    },
    openProject(row){
      this.newProject.id = row.id
      this.newProject.name = row.name;
      this.newProject.number = row.number
      this.newProject.workday = row.workday;
      this.newProject.projectId = row.pid;
      this.newProject.creatUser = row.creatUser
      this.newProject.creatDate = row.creatDate
      this.$axios
        .post(this.$baseUrl + 'user/userAllAndGroup',{},{headers:{id : row.id,mode : 0}})
        .then(res => {this.userTree = res.data.data;
          this.$axios
            .post(this.$baseUrl + 'virtual/queryById',{},{headers:{id : row.id}})
            .then(res => {this.newProject.general = res.data.data.general;
              this.newProject.principal = res.data.data.principal;
              this.newProject.principal_group = res.data.data.principal_group
              this.newProject.designer = res.data.data.designer
              this.principalList = this.getSimpleCheckedNodes(this.$refs.principal.store);
              this.$nextTick(function (){
                this.$refs.principal.setCheckedKeys(this.newProject.principal);
                this.$forceUpdate()
              });
            })
            .catch(res => (console.log(res)));})
        .catch(res => (console.log(res)));
      this.visible_project = true;
    },
    openDesignerTree(data){
      this.group = data.id
      this.groupName = data.label
      for (let i=0;i < this.newProject.principal_group.length;i++){
        if (this.newProject.principal_group[i].id.toString() === data.id.toString()){
          this.group = this.newProject.principal_group[i].group
          break;
        }
      }
      for (let i = 0; i < this.newProject.designer.length;i++){
        if (this.group.toString() === this.newProject.designer[i].principal.toString()){
         this.designer = this.newProject.designer[i].list
          this.$nextTick(function (){
            this.$refs.designer.setCheckedKeys(this.designer)
          })
          break;
        }
      }
      this.visible_designer = true
    },
    checkChangePrincipal(){
      if (this.newProject.principalState === false)
        this.newProject.principalState = true;
      this.newProject.principal = this.$refs.principal.getCheckedKeys(1)
      this.principalList = this.getSimpleCheckedNodes(this.$refs.principal.store)
    },
    //event下拉列表的值。 data选中子支的值
    selectGroup(event,data){
      let existIn = false
      let group = data.id
      //判断树中选中的主设人是否已于其他主设人组队
      for (let i = 0 ; i < this.newProject.principal_group.length; i++){
        if (data.id.toString() === this.newProject.principal_group[i].id.toString()) {
          group = this.newProject.principal_group[i].group;
          existIn = true;
          break;
        }
      }
      // 如果已组队，则取出队伍号，判断是否有成员删除
      if (existIn){
        for (let i = 1 ; i < this.newProject.principal_group.length; i++){
          let item1 = this.newProject.principal_group[i]
          let exist = false;
            for (let j= 0 ; j < event.length ; j++) {
              if (event[j] === item1.id && group === item1.group) {
                exist = true;
                break;
              }
            }
            if (!exist) {
              if (item1.group === group) {
                this.newProject.principal_group.splice(i, 1);
                i--;
              }
            }
        }
        // 去重插入
        event.forEach(item => {
          this.newProject.principal_group.push2({
            id : item, group : group
          })
        })
      }
      if (!existIn){
        this.newProject.principal_group.push2({id : data.id , group : group})
        event.forEach(item => {
          this.newProject.principal_group.push2({
            id : item,group : group
          })
        })
      }
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
      if (this.newProject.creatUser === undefined) {
        this.newProject.creatUser = this.id
        let date = new Date;
        let year = date.getFullYear();
        let month = date.getMonth()+1;
        let day = date.getDate();
        this.newProject.creatDate = year  + "-" + month + "-" + day
      }
      if (this.principalData.length > 0)
        this.newProject.principalData = this.principalData
      this.designerDataRemoval();
      this.$axios
        .post(this.$baseUrl + 'virtual/setProject', this.newProject)
        .then(res => {
          this.visible_project = false;
        })
        .catch(res => (console.log(res.data)))
    },
    designerDataRemoval(){
      if (this.newProject.designerData !== undefined) {
        for (let i = 0; i < this.newProject.designerData.length; i++) {
          if (this.newProject.designerData[i].principal === this.designerData.principal) {
            this.newProject.designerData.splice(i, 1)
          }
        }
      }
        if (this.designerData.principal !== undefined) {
          this.newProject.designerData = [];
          this.newProject.designerData.push2(this.designerData)
        }
    },
    submitDesigner() {
      for (let i = 0; i < this.newProject.designer.length; i++) {
        if (this.newProject.designer[i].principal === this.group) {
          this.newProject.designer.splice(i, 1)
        }
      }

      if (this.$refs.designer.getCheckedKeys(1).length > 0) {
      this.newProject.designer.push2({principal: this.group,name : this.groupName, list: this.$refs.designer.getCheckedKeys(1)})
      }
      this.visible_designer = false;
    },
    closeDialog(){
      this.getData();
      this.$nextTick(function (){
          this.$refs.principal.setCheckedKeys([]);
      });
      this.newProject ={
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
    },
    handleClick(tab,event){
      //主设工时分配
      if (tab.paneName === "1"){
        this.$axios
          .post(this.$baseUrl + 'virtual/principalWorkday', {
              "id" : this.newProject.id,
            "list" : this.newProject.principal
            }
          )
          .then(res => {
            if (res.data.data != null) {
              this.principalData = res.data.data
            }
          })
          .catch(res => (console.log(res.data)))
      }else if (tab.paneName === "2") {
        // 设计工时分配
        if (this.designerData.principal === undefined) {
          this.$axios
            .post(this.$baseUrl + 'virtual/designerWorkday', {
                "id": this.newProject.id,
                 "principal" : this.newProject.designer[0].principal,
                "list": this.newProject.designer[0].list
              }
            )
            .then(res => {
              if (res.data.data != null) {
                this.designerData = {"principal" : this.newProject.designer[0].principal,
                  "list" : res.data.data}
              }
            })
            .catch(res => (console.log(res.data)))
        }
      }
    },
    handleCommand(command){
      this.designerDataRemoval();
      this.$axios
        .post(this.$baseUrl + 'virtual/designerWorkday', {
            "id" : this.newProject.id,
            "principal" : this.newProject.designer[command].principal,
            "list" : this.newProject.designer[command].list
          }
        )
        .then(res => {
          if (res.data.data != null) {
            this.designerData = {"principal" : this.newProject.designer[command].principal,
            "list" : res.data.data}
          }
        })
        .catch(res => (console.log(res.data)))
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
