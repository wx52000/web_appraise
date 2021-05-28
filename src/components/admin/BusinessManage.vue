<template>
  <div style="width: 60%;margin-left: 20%">
    <el-container>
        <el-main style="margin-top: 20px">
          <el-form :model="activity" ref="activity">
          <el-row>
            <el-col :span="12">
              <el-form-item label="活动名称" size="mini" label-width="80px">
                <el-input type="text"  v-model="activity.name" style="width: 80%"
                          :disabled="activity.name !== undefined"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="活动时间" size="mini" label-width="80px" >
                <el-date-picker
                  v-model="activity.date"
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
                <el-select v-model="activity.general" size="mini"
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
                <el-input type="text"  v-model="activity.workday" style="width: 80%"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-tabs type="border-card"  @tab-click="handleClick">
            <el-tab-pane label="人员选择" >
              <el-tree
                :data="userTree"
                ref="principal"
                @check-change="checkChangePrincipal"
                :default-checked-keys="activity.principal"
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
                        <button size="mini" @click.prevent="openDesignerTree(data)">设计人员管理</button>
                      </template>
                    </span>
                 </span>
              </el-tree>
            </el-tab-pane>
            <el-tab-pane label="管理工时分配">
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
                   参与人员工时 <i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="(item,index) in activity.designer" :key="index"
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
          <el-button  size="small " style="margin-right: 10%" @click="closeDialog()">取消</el-button>
          <el-button type="primary" size="small " style="margin-left: 10%" @click="submit">确定</el-button>
          </el-form>
        </el-main>
    </el-container>
  <el-dialog
    v-if="visible_designer"
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
  </div>
</template>

<script>
export default {
name: "BusinessManage",
  data(){
  return{
    id : "",
    visible_designer : false,
    visibleName : "",
    activity : {
      general  : "",
      workday : null,
      date : [],
      principal_group : [],
      principalState : false,
      designer:[],
    },
    group : "",
    groupName : "",
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
  mounted() {
    let i = JSON.parse(sessionStorage.getItem("appraise"));
    this.id = i.id;
    this.activity.id  = this.$route.query.id;
    this.getData()
  },
  methods : {
  getData(){
      this.$axios
        .post(this.$baseUrl + 'user/userAllAndGroup',{},{headers:{id : this.activity.id,mode : 1}})
        .then(res => {this.userTree = res.data.data;
          this.$axios
            .post(this.$baseUrl + 'activity/queryById',{},{headers:{id : this.activity.id}})
            .then(res => {
              this.activity.general = res.data.data.general;
            this.activity.name = res.data.data.activity.name;
            this.activity.workday = res.data.data.activity.workday;
            this.activity.date = [];
            this.activity.date.push(res.data.data.activity.start_date);
            this.activity.date.push(res.data.data.activity.end_date);
              this.activity.principal = res.data.data.principal;
              this.activity.principal_group = res.data.data.principal_group
              this.activity.designer = res.data.data.designer
              this.principalList = this.getSimpleCheckedNodes(this.$refs.principal.store);
              this.$nextTick(function (){
                this.$refs.principal.setCheckedKeys(this.activity.principal);
                this.$forceUpdate()
              });
            })
            .catch(res => (console.log(res)));})
        .catch(res => (console.log(res)));
      this.visible_project = true;
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
    openDesignerTree(data){
      this.group = data.id
      this.groupName = data.label
      for (let i=0;i < this.activity.principal_group.length;i++){
        if (this.activity.principal_group[i].id.toString() === data.id.toString()){
          this.group = this.activity.principal_group[i].group
          break;
        }
      }
      for (let i = 0; i < this.activity.designer.length;i++){
        if (this.group === this.activity.designer[i].principal){
          this.designer = this.activity.designer[i].list
          break;
        }
      }
      this.visible_designer = true
    },
    checkChangePrincipal(){
      if (this.activity.principalState === false)
        this.activity.principalState = true;
      this.activity.principal = this.$refs.principal.getCheckedKeys(1)
      this.principalList = this.getSimpleCheckedNodes(this.$refs.principal.store)
    },
    //event下拉列表的值。 data选中子支的值
    selectGroup(event,data){
      let existIn = false
      let group = data.id
      //判断树中选中的主设人是否已于其他主设人组队
      for (let i = 0 ; i < this.activity.principal_group.length; i++){
        if (data.id.toString() === this.activity.principal_group[i].id.toString()) {
          group = this.activity.principal_group[i].group;
          existIn = true;
          break;
        }
      }
      // 如果已组队，则取出队伍号，判断是否有成员删除
      if (existIn){
        for (let i = 1 ; i < this.activity.principal_group.length; i++){
          let item1 = this.activity.principal_group[i]
          let exist = false;
          for (let j= 0 ; j < event.length ; j++) {
            if (event[j] === item1.id && group === item1.group) {
              exist = true;
              break;
            }
          }
          if (!exist) {
            if (item1.group === group) {
              this.activity.principal_group.splice(i, 1);
              i--;
            }
          }
        }
        // 去重插入
        event.forEach(item => {
          this.activity.principal_group.push2({
            id : item, group : group
          })
        })
      }
      if (!existIn){
        this.activity.principal_group.push2({id : data.id , group : group})
        event.forEach(item => {
          this.activity.principal_group.push2({
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
      if (this.activity.createUser === undefined) {
        this.activity.createUser = this.id
        let date = new Date;
        let year = date.getFullYear();
        let month = date.getMonth()+1;
        let day = date.getDate();
        this.activity.createDate = year  + "-" + month + "-" + day
        this.activity.state = 0;
      }
      if (this.principalData.length > 0) {
        this.activity.principalData = this.principalData
      }
      this.designerDataRemoval();
      this.$axios
        .post(this.$baseUrl + 'activity/setProject', this.activity)
        .then(res => {
          this.visible_project = false;
        })
        .catch(res => (console.log(res.data)))
    },
    designerDataRemoval(){
      if (this.activity.designerData !== undefined) {
        for (let i = 0; i < this.activity.designerData.length; i++) {
          if (this.activity.designerData[i].principal === this.designerData.principal) {
            this.activity.designerData.splice(i, 1)
          }
        }
      }
      if (this.designerData.principal !== undefined) {
        this.activity.designerData = [];
        this.activity.designerData.push2(this.designerData)
      }
    },
    submitDesigner() {
      for (let i = 0; i < this.activity.designer.length; i++) {
        if (this.activity.designer[i].principal === this.group) {
          this.activity.designer.splice(i, 1)
        }
      }
      if (this.$refs.designer.getCheckedKeys(1).length > 0) {
        this.activity.designer.push2({principal: this.group,name : this.groupName, list: this.$refs.designer.getCheckedKeys(1)})
      }
      this.visible_designer = false;
    },
    closeDialog(){
      this.getData();
      // this.$nextTick(function (){
      //     this.$refs.principal.setCheckedKeys([]);
      // });
      this.activity ={
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
          .post(this.$baseUrl + 'activity/principalWorkday', {
              "id" : this.activity.id,
              "list" : this.activity.principal
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
                "id": this.activity.id,
                "principal" : this.activity.designer[0].principal,
                "list": this.activity.designer[0].list
              }
            )
            .then(res => {
              if (res.data.data != null) {
                this.designerData = {"principal" : this.activity.designer[0].principal,
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
            "id" : this.activity.id,
            "principal" : this.activity.designer[command].principal,
            "list" : this.activity.designer[command].list
          }
        )
        .then(res => {
          if (res.data.data != null) {
            this.designerData = {"principal" : this.activity.designer[command].principal,
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
