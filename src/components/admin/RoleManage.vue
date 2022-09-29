<template>
<div>
  <el-row style="margin:0 auto;text-align: center; align-content: center">
    <el-col :span="24" style="line-height: 50px;font-size: 16px;font-weight: bold;color: #666;text-align: center ">
      权限管理
    </el-col>
  </el-row>
  <el-row style="text-align: right" >
      <el-button style="text-align: center; margin-left: 30px" size="mini" v-permission="'role:add'"
                 @click="() =>{this.roleName = '';this.addVisible = true}">新增角色</el-button>
  </el-row>
  <el-table key="list" use-virtual :data="list" class="u-table"
           size = "mini" :border="false" :cell-style="this.CellStyleOne"
           height="360px">
    <el-table-column prop="name" width="160px"  label="角色名称" align="center"  >
    </el-table-column>
    <el-table-column  label="权限" align="center"  >
        <template slot-scope="scope">
          <el-tag size="mini" v-for="(item,index) in menusToList(scope.row.menus)" :key="index"
          style="margin-left: 5px">
            {{item}}</el-tag>
        </template>
    </el-table-column>
    <el-table-column width="180px" label="操作" align="center"  >
      <template slot-scope="scope">
        <el-button type="text"
                   @click="openUpdate(scope.row)" v-permission="'role:update'" size="mini">修改</el-button>
        <el-popconfirm
          confirm-button-text='好的'
          cancel-button-text='不用了'
          icon="el-icon-info"
          v-permission="'role:del'"
          icon-color="red"
          title="确定要删除这个角色吗？"
          style="margin-left: 8px"
          @confirm="delRole(scope.row)">
          <el-button
            type="text"
            slot="reference"
            size="small">
            删除
          </el-button>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <el-dialog
    title="权限修改"
    :visible.sync="updateVisible"
    width="50%">
    <el-form id="add" style="text-align: left" size="mini">
        <el-checkbox-group v-model="menusList"  size="mini">
          <el-row style="margin-bottom: 10px">
            <el-checkbox @change="handleCheckAllChangeSales($event,'0', '12')" label="工时信息" border></el-checkbox>
          </el-row>
          <el-row style="margin-bottom: 10px">
          <el-checkbox @change="handleCheckAllChangeSales($event,'0', '10')"label="项目管理" border></el-checkbox>
          </el-row>
            <el-row style="margin-bottom: 10px">
              <el-checkbox-group v-model="buttonList" size="mini" style="margin-left: 30px">
                <el-checkbox @change="handleCheckAllChangeSales($event,'1', '1')" label="申报日期修改" ></el-checkbox>
                <el-checkbox @change="handleCheckAllChangeSales($event,'1', '2')" label="新增项目" ></el-checkbox>
                <el-checkbox @change="handleCheckAllChangeSales($event,'1', '4')" label="项目管理(列表)" ></el-checkbox>
              </el-checkbox-group>
            </el-row>
          <el-row style="margin-bottom: 10px">
            <el-checkbox @change="handleCheckAllChangeSales($event,'0', '16')"label="角色任务" border></el-checkbox>
            <el-checkbox @change="handleCheckAllChangeSales($event,'0', '11')"label="计划任务" border></el-checkbox>
          </el-row>
          <el-row style="margin-bottom: 10px">
            <el-checkbox @change="handleCheckAllChangeSales($event,'0', '18')" label="生产任务-项目列表" border></el-checkbox>
            <el-checkbox @change="handleCheckAllChangeSales($event,'0', '19')" label="生产任务-专业列表" border></el-checkbox>
          </el-row>
          <el-row style="margin-bottom: 10px">
            <el-checkbox @change="handleCheckAllChangeSales($event,'0', '8')" label="个人评价-整体数据" border></el-checkbox>
            <el-checkbox @change="handleCheckAllChangeSales($event,'0', '9')" label="个人评价-详细数据" border></el-checkbox>
          </el-row>
          <el-row style="margin-bottom: 10px">
            <el-checkbox @change="handleCheckAllChangeSales($event,'0', '5')" label="专业评价-整体数据" border></el-checkbox>
            <el-checkbox @change="handleCheckAllChangeSales($event,'0', '6')" label="专业评价-详细数据" border></el-checkbox>
          </el-row>
          <el-row style="margin-bottom: 10px">
          <el-checkbox @change="handleCheckAllChangeSales($event,'0', '4')" label="系统管理-人员管理" border></el-checkbox>
          </el-row>
          <el-row style="margin-bottom: 10px">
            <el-checkbox-group v-model="buttonList" size="size" style="margin-left: 30px">
              <el-checkbox @change="handleCheckAllChangeSales($event,'1', '3')" label="人员添加" ></el-checkbox>
            </el-checkbox-group>
          </el-row>
          <el-row style="margin-bottom: 10px">
          <el-checkbox @change="handleCheckAllChangeSales($event,'0', '3')" label="系统管理-部门管理" border></el-checkbox>
          </el-row>
          <el-row style="margin-bottom: 10px">
          <el-checkbox @change="handleCheckAllChangeSales($event,'0', '2')" label="系统管理-评价管理" border></el-checkbox>
          </el-row>
          <el-row style="margin-bottom: 10px">
            <el-checkbox-group v-model="buttonList" size="size" style="margin-left: 30px">
              <el-checkbox @change="handleCheckAllChangeSales($event,'1', '5')" label="评价取值范围管理" ></el-checkbox>
              <el-checkbox @change="handleCheckAllChangeSales($event,'1', '6')" label="评价时间管理" ></el-checkbox>
              <el-checkbox @change="handleCheckAllChangeSales($event,'1', '7')" label="权重管理" ></el-checkbox>
              <el-checkbox @change="handleCheckAllChangeSales($event,'1', '8')" label="个人评价管理" ></el-checkbox>
            </el-checkbox-group>
          </el-row>
          <el-checkbox style="margin-bottom: 10px" @change="handleCheckAllChangeSales($event,'0', '1')" label="系统管理-权限管理" border></el-checkbox>
          <el-row style="margin-bottom: 10px">
            <el-checkbox-group v-model="buttonList" size="size" style="margin-left: 30px">
              <el-checkbox @change="handleCheckAllChangeSales($event,'1', '9')" label="新增角色" ></el-checkbox>
              <el-checkbox @change="handleCheckAllChangeSales($event,'1', '10')" label="修改角色" ></el-checkbox>
              <el-checkbox @change="handleCheckAllChangeSales($event,'1', '11')" label="删除角色" ></el-checkbox>
            </el-checkbox-group>
          </el-row>
          <el-checkbox style="margin-bottom: 10px" @change="handleCheckAllChangeSales($event,'0', '14')" label="部门工时数据" border></el-checkbox>
          <el-checkbox style="margin-bottom: 10px" @change="handleCheckAllChangeSales($event,'0', '21')" label="部门生产任务" border></el-checkbox>
          <el-row style="margin-bottom: 10px">
            <el-checkbox-group v-model="buttonList" size="size" style="margin-left: 30px">
              <el-checkbox @change="handleCheckAllChangeSales($event,'1', '12')" label="新增外部门项目" ></el-checkbox>
            </el-checkbox-group>
          </el-row>
          <el-checkbox style="margin-bottom: 10px" @change="handleCheckAllChangeSales($event,'0', '15')" label="项目申请" border></el-checkbox>
      </el-checkbox-group>
    </el-form>
  </el-dialog>
  <el-dialog
    title="角色新增"
    :visible.sync="addVisible">
    <el-row>
      <el-col :span="20" style="line-snap: inherit">
      角色名称
        <el-input v-model="roleName" style="width: 80%" size="mini"
                  type="text" placeholder="请输入角色名"></el-input>
      </el-col>
      <el-col :span="4">
      <el-button type="primary" @click="newRole()" size="mini">确认</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</div>
</template>

<script>
export default {
name: "RoleManage",
  data(){
  return{
    list : [],
    roleId : "",
    updateVisible : false,
    menusList : [],
    buttonList : [],
    roleName : "",
    addVisible : false,
  }
  },

  mounted() {
    this.getData()
  },
  methods:{
    getData(){
      this.$axios
        .post(this.$baseUrl + 'position/queryRoleMenus'
        )
        .then(res => {
          this.list = res.data.data
        })
        .catch(res => (console.log(res)));
    },
    openUpdate(row){
      this.roleId = "";
      this.menusList = [];
      this.buttonList = [];
      this.$axios
        .post(this.$baseUrl + 'position/queryRole',{},
          {headers: {id : row.id}}
        )
        .then(res => {
          this.roleId = row.id
          this.menusList = res.data.data.menus;
          this.buttonList = res.data.data.button;
          this.updateVisible = true;
        })
        .catch(res => (console.log(res)));
    },
    handleCheckAllChangeSales(e,type,id){
      this.$axios
        .post(this.$baseUrl + 'position/setRoleMenus',{
          roleId : this.roleId,
          elementId : id,
          type : type,
          state : e
          },
        )
        .then(res => {
          this.$message.success("操作成功")
        })
        .catch(res => (console.log(res)));
    },
    newRole(){
      this.$axios
        .post(this.$baseUrl + 'position/newRole',{},{headers : {"roleName" : this.name}}
        )
        .then(res => {
          this.$message.success('操作成功');
          this.getData();
          this.addVisible = false;
        })
        .catch(res => (console.log(res)));
    },
    delRole(row){
      this.$axios
        .post(this.$baseUrl + 'position/delRole',{},
          {headers: {id : row.id}}
        )
        .then(res => {
          this.$message.success('操作成功');
          this.getData();
        })
        .catch(res => (console.log(res)));
    },
    menusToList(val){
      return (val || "").split("、")
    }
  },
}
</script>

<style scoped>

</style>
