<template>
  <div style="width: 60%;margin-left: 20%">
    <el-container style="width: 100%;margin-top: 20px">
        <el-main style="width: 100%">
          <el-form :model="virtual" ref="virtual">
          <el-row>
            <el-col :span="12">
              <el-form-item label="项目名称" size="mini" label-width="80px">
                <el-input type="text"  v-model="virtual.name" style="width: 80%"
                :disabled="virtual.name !== undefined"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="项目编号" size="mini" label-width="80px" >
                <el-input type="text"  v-model="virtual.number" style="width: 80%"
                          :disabled="virtual.number !== undefined"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="设总" size="mini" label-width="80px">
                <el-select v-model="virtual.general" size="mini"
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
                <el-input type="text"  v-model="virtual.workday" style="width: 80%"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-tabs type="border-card"  @tab-click="handleClick">
            <el-tab-pane label="人员选择">
              <el-tree
                :data="userTree"
                ref="principal"
                @check-change="checkChangePrincipal"
                :default-checked-keys="virtual.principal"
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
                        <button size="mini" @click.prevent="openDesignerTree(data)">设计人员管理</button>
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
                    <el-dropdown-item v-for="(item,index) in virtual.designer" :key="index"
                                      :command="index">{{item.name}}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
              <el-row>
                <el-col :span="12" style="font-weight: bold">
                  设计人名称
                </el-col>
                <el-col :span="12" style="font-weight: bold">
                  设计人获得工时
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
          <el-button  size="small " style="margin-right: 10%" @click="this.getData">重置</el-button>
          <el-button type="primary" size="small " style="margin-left: 10%" @click="submit">确定</el-button>
          </el-form>
        </el-main>
    </el-container>
    <div>
  <el-dialog
    v-if="visible_designer"
    :visible.sync="visible_designer"
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
      <el-button type="primary" size="small " style="margin-left: 10%" @click="submitDesigner">确定</el-button>
    </el-main>
  </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
name: "VirtualManage",
  data(){
  return{
    id: "",
    virtual : {
      general : "",
      workday : null,
      principal_group : [],
      principalState : false,
      designer:[],
    },
    nameList : [],
    nameLoading : true,
    visible_designer : false,
    visibleName : "",
    userTree : [],
    groupItem : [],
    principalList : [],
    designer : [],
    designerData : {},
    principalData : [],
    group : "",
    groupName : "",
  }
  },
  mounted() {
    let i = JSON.parse(sessionStorage.getItem("appraise"));
    this.id = i.id;
    this.pid = i.pid;
    this.tid = i.tid;
  this.virtual.id  = this.$route.query.id;
  this.getData();
  },
  methods : {
    getData(){
      this.$axios
        .post(this.$baseUrl + 'user/userAllAndGroup',{},{headers:{id :this.virtual.id,mode : 0}})
        .then(res => {
          this.userTree = res.data.data;
          console.log(this.virtual)
          if (Number(this.virtual.id) !== 0) {
            this.$axios
              .post(this.$baseUrl + 'virtual/queryById', {}, {headers: {id: this.virtual.id}})
              .then(res => {
                this.virtual.general = res.data.data.general;
                this.virtual.name = res.data.data.virtual.name;
                this.virtual.number = res.data.data.virtual.number;
                this.virtual.workday = res.data.data.virtual.workday;
                this.virtual.principal = res.data.data.principal;
                this.virtual.principal_group = res.data.data.principal_group
                this.virtual.designer = res.data.data.designer
                this.principalList = this.getSimpleCheckedNodes(this.$refs.principal.store);
                this.$nextTick(function () {
                  this.$refs.principal.setCheckedKeys(this.virtual.principal);
                  this.$forceUpdate()
                });
              })
              .catch(res => (console.log(res)));
          }
        })
        .catch(res => (console.log(res)));
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
    checkChangePrincipal(){
      if (this.virtual.principalState === false)
        this.virtual.principalState = true;
      this.virtual.principal = this.$refs.principal.getCheckedKeys(1)
      this.principalList = this.getSimpleCheckedNodes(this.$refs.principal.store)
    },
    //event下拉列表的值。 data选中子支的值
    selectGroup(event,data){
      let existIn = false
      let group = data.id
      //判断树中选中的主设人是否已于其他主设人组队
      for (let i = 0 ; i < this.virtual.principal_group.length; i++){
        if (data.id.toString() === this.virtual.principal_group[i].id.toString()) {
          group = this.virtual.principal_group[i].group;
          existIn = true;
          break;
        }
      }
      // 如果已组队，则取出队伍号，判断是否有成员删除
      if (existIn){
        for (let i = 1 ; i < this.virtual.principal_group.length; i++){
          let item1 = this.virtual.principal_group[i]
          let exist = false;
          for (let j= 0 ; j < event.length ; j++) {
            if (event[j] === item1.id && group === item1.group) {
              exist = true;
              break;
            }
          }
          if (!exist) {
            if (item1.group === group) {
              this.virtual.principal_group.splice(i, 1);
              i--;
            }
          }
        }
        // 去重插入
        event.forEach(item => {
          this.virtual.principal_group.push2({
            id : item, group : group
          })
        })
      }
      if (!existIn){
        this.virtual.principal_group.push2({id : data.id , group : group})
        event.forEach(item => {
          this.virtual.principal_group.push2({
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
    handleClick(tab,event){
      //主设工时分配
      if (tab.paneName === "1"){
        this.$axios
          .post(this.$baseUrl + 'activity/principalWorkday', {
              "id" : this.virtual.id,
              "list" : this.virtual.principal
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
            .post(this.$baseUrl + 'activity/designerWorkday', {
                "id": this.virtual.id,
                "principal" : this.virtual.designer[0].principal,
                "list": this.virtual.designer[0].list
              }
            )
            .then(res => {
              if (res.data.data != null) {
                this.designerData = {"principal" : this.virtual.designer[0].principal,
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
        .post(this.$baseUrl + 'activity/designerWorkday', {
            "id" : this.virtual.id,
            "principal" : this.virtual.designer[command].principal,
            "list" : this.virtual.designer[command].list
          }
        )
        .then(res => {
          if (res.data.data != null) {
            this.designerData = {"principal" : this.virtual.designer[command].principal,
              "list" : res.data.data}
          }
        })
        .catch(res => (console.log(res.data)))
    },
    openDesignerTree(data){
      this.group = data.id
      this.groupName = data.label
      for (let i=0;i < this.virtual.principal_group.length;i++){
        if (this.virtual.principal_group[i].id.toString() === data.id.toString()){
          this.group = this.virtual.principal_group[i].group
          break;
        }
      }
      this.visible_designer = true
      for (let i = 0; i < this.virtual.designer.length;i++){
        if (this.group.toString() === this.virtual.designer[i].principal.toString()){
          this.designer = this.virtual.designer[i].list
          // this.$nextTick(function (){
          //   this.$refs.designer.setCheckedKeys(this.designer)
          // })
          break;
        }
      }
    },
    submit(){
      if (Number(this.virtual.id) === 0 ){
        this.virtual.id  = null
      }
      if (this.virtual.createUser === undefined) {
        this.virtual.createUser = this.id
        let date = new Date;
        let year = date.getFullYear();
        let month = date.getMonth()+1;
        let day = date.getDate();
        this.virtual.createDate = year  + "-" + month + "-" + day
      }
      if (this.principalData.length > 0)
        this.virtual.principalData = this.principalData
      this.designerDataRemoval();
      this.$axios
        .post(this.$baseUrl + 'virtual/setProject', this.virtual)
        .then(res => {
          this.visible_project = false;
        })
        .catch(res => (console.log(res.data)))
    },
    designerDataRemoval(){
      if (this.virtual.designerData !== undefined) {
        for (let i = 0; i < this.virtual.designerData.length; i++) {
          if (this.virtual.designerData[i].principal === this.designerData.principal) {
            this.virtual.designerData.splice(i, 1)
          }
        }
      }
      if (this.designerData.principal !== undefined) {
        this.virtual.designerData = [];
        this.virtual.designerData.push2(this.designerData)
      }
    },
    submitDesigner() {
      for (let i = 0; i < this.virtual.designer.length; i++) {
        if (this.virtual.designer[i].principal === this.group) {
          this.virtual.designer.splice(i, 1)
        }
      }
      if (this.$refs.designer.getCheckedKeys(1).length > 0) {
        this.virtual.designer.push2({principal: this.group,name : this.groupName, list: this.$refs.designer.getCheckedKeys(1)})
      }
      this.visible_designer = false;
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
