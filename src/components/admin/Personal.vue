<template>
  <div>
    <el-row style="margin:0 auto;text-align: center; align-content: center">
      <el-col :span="24" style="line-height: 50px;font-size: 16px;font-weight: bold;color: #666;text-align: center ">
        人员管理表
      </el-col>
    </el-row>
    <el-row style="text-align: right" >
        <el-col :span="4" >姓名
          <el-input v-model="search1" @keyup.enter.native="getData" size="mini" style="width: 50%" ></el-input></el-col>
        <el-col :span="4" >工号
          <el-input v-model="search2" @keyup.enter.native="getData" size="mini"   style="width: 50%" ></el-input></el-col>
        <el-col :span="4" style="text-align: right;">
          <el-button type="primary" size="mini" @click="getData">查询</el-button>
          <el-button  size="mini"  @click="reset()">重置</el-button>
        </el-col>
      <el-col :span="3" style="text-align: left;">
      <el-button style="text-align: center; margin-left: 30px"
                 @click="handleOpenAdd" size="mini" v-permission="'user:add'">人员添加</el-button>
      </el-col>
      <el-col :span="2" >
        <el-upload
          class="upload-demo"
          ref="upload"
          :action="this.$baseUrl + 'excel/userExcel'"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList">
          <el-button size="mini" type="primary"
                     style="text-align: center; ">
            人员上传</el-button>
        </el-upload>
      </el-col>
    </el-row>
    <el-row style="text-align: center">
    <ux-grid ref="userTable" key="userlist" use-virtual v-loading="loading"
             :max-height=pageHeight
             :edit-config="{trigger: 'click', mode: 'cell'}"
             element-loading-text="拼命加载中"
             element-loading-spinner="el-icon-loading"
             border :data="list" style="margin-top: 5px"
             size="mini"
             :default-sort = "{prop: 'date', order: 'descending'}"
             :header-cell-style="this.CellStyleOne" :cell-style="this.CellStyleOne">
      <ux-table-column field="name" title="姓名" width="12%" sortable align="center">
      </ux-table-column>
      <ux-table-column field="username" title="工号"  width="12%" sortable align="center">
      </ux-table-column>
      <ux-table-column field="technology" title="专业" width="20%"
                       :filters="technologyList"
                      :filter-method="filterHandler" edit-render align="center">
        <template v-slot:edit="scope">
          <el-select size="mini" v-model="scope.row.technology"  @change="upd(scope.row)">
            <el-option
              v-for="item in technologyList"
              :key="item.id"
              :label="item.label"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
      </ux-table-column>
      <ux-table-column field="department" title="部门" width="26%"
      :filters="departmentList" :filter-method="filterHandler" edit-render align="center">
        <template v-slot:edit="scope">
          <el-select size="mini" v-model="scope.row.department"  @change="upd(scope.row)">
            <el-option
              v-for="item in departmentList"
              :key="item.id"
              :label="item.label"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
      </ux-table-column>
      <ux-table-column field = "position" title="职位" width="12%"
                       :filters="positionList"
                      :filter-method="filterHandler" edit-render align="center">
        <template v-slot:edit="scope">
          <el-select size="mini" v-model="scope.row.position"  @change="upd(scope.row)" >
            <el-option
              v-for="item in positionList"
              :key="item.id"
              :label="item.label"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
      </ux-table-column>
      <ux-table-column
        fixed="right"
        title="操作"
        width="18%" align="center">
        <template slot-scope="scope">
          <el-popconfirm
            confirm-button-text='好的'
            cancel-button-text='不用了'
            icon="el-icon-info"
            icon-color="red"
            title="确定要为这个用户重置密码吗？"
            @confirm="pwdReset(scope.row)">
            <el-button
              type="text"
              slot="reference"
              size="small">
              密码重置
            </el-button>
          </el-popconfirm>
        <el-popconfirm
          confirm-button-text='好的'
          cancel-button-text='不用了'
          icon="el-icon-info"
          icon-color="red"
          title="确定要删除这个用户吗？"
          style="margin-left: 8px"
          @confirm="deleteRow(scope.row,scope.rowIndex)">
          <el-button
            type="text"
            slot="reference"
            size="small">
            删除
          </el-button>
          </el-popconfirm>
        </template>
      </ux-table-column>
    </ux-grid>
    </el-row>
    <el-dialog
      title="人员新增"
      v-el-drag-dialog
      :visible.sync="addVisible"
      width="50%">
      <el-form id="add" style="text-align: left" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label-width="80px" label="姓名">
              <el-input v-model="add.name" ></el-input>
            </el-form-item>
        </el-col>
          <el-col :span="12">
            <el-form-item label-width="80px" label="工号">
              <el-input v-model="add.username"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label-width="80px" label="部门">
            <template>
              <el-select v-model="add.did" placeholder="请选择" @change="getTecSelect">
                <el-option
                  v-for="item in departmentList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="80px" label="专业">
            <template>
              <el-select v-model="add.tid" placeholder="请选择" @change="$forceUpdate">
                <el-option
                  v-for="item in technology"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row >
          <el-col :span="12">
            <el-form-item label-width="80px" label="职位">
            <template>
              <el-select v-model="add.pid" placeholder="请选择">
                <el-option
                  v-for="item in positionList"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="text-align: right;">
            <el-form-item>
            <el-button @click="addVisible = false" size="mini">取 消</el-button>
            <el-button type="primary" @click="addPer" size="mini">确 定</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>

</template>

<script>
export default {
  inject:['reload'],
  name: "personal",
  data() {
    return {
      id: "",
      isShow : false,
      pageHeight : document.body.clientHeight,
      month: new Date().getMonth() + 1,
      search1: "",
      search2: "",
      loading: true,
      visible : false,
      addVisible: false,
      list: [],
      add:{},
      fileList : [],
      technology:[],
      positionList : [],
      technologyList:[],
      departmentList:[],
    }
  },
  mounted() {
    this.$axios
      .post(this.$baseUrl + 'department/query', {},)
      .then(res => {
        res.data.data.forEach(item => {
          this.departmentList.push2({label: item.name, value: item.name, id : item.id})
        })
        this.$refs.userTable.setFilter(this.$refs.userTable.getColumnByField('department'),this.departmentList)
        this.$refs.userTable.updateData()
      })
      .catch(res => (console.log(res)));
    this.$axios
      .post(this.$baseUrl + 'technology/query',{},{headers: {id : 0}})
      .then(res => {
        res.data.data.forEach(item =>{
          this.technologyList.push2({label : item.name, value : item.name,id : item.id})
        })
        this.$refs.userTable.setFilter(this.$refs.userTable.getColumnByField('technology'),this.technologyList)
        this.$refs.userTable.updateData()
      })
    this.$axios
      .post(this.$baseUrl + 'position/query',{},{headers: {"id": ""}})
      .then(res => {
        res.data.data.forEach(item => {
          this.positionList.push2({label: item.name, value: item.name,id : item.id})
        })
        this.$refs.userTable.setFilter(this.$refs.userTable.getColumnByField('position'),this.positionList)
        this.$refs.userTable.updateData()
      })
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
          "id" : this.id,
          "name" : this.search1,
          "username" : this.search2,
          "selectName" : this.selectName,
          "selectType" : this.selectType,
        },)
        .then(res => {this.list = res.data.data;
        this.totalSize = res.data.data.total})
        .catch(res => (console.log(res)));
      this.$nextTick(function() {
        this.loading = false;
      })

    },
    deleteRow(row,index){
      this.$axios
        .post(this.$baseUrl + 'user/del', {},{headers:{id:row.id}})
        .then(res =>{
          if(res.data.code === 0){
            this.list.splice(index,1);
            this.$message.success("操作成功")
          }
        })
        .catch(res => (console.log(res)));
    },
    updRow(){
      this.$axios
        .post(this.$baseUrl + 'user/upd', this.upd)
        .then(res => {this.visible = false;
        this.getUser(1)
        })
        .catch(res => (console.log(res)));
      if (this.upd.position !== this.positionupd){
        this.$axios
          .post(this.$baseUrl + 'userPosition/add',
            {
              "id" : this.upd.id,
              "userPosition" : this.upd.position
            })
          .then()
          .catch(res => (console.log(res)));
      }
    },
    filterHandler({value, row, column}){
      const property = column['property'];
      return row[property] === value;
    },
    upd(row){
      this.$axios
        .post(this.$baseUrl + 'user/upd',
          {
            id : row.id,
            pid : row.position,
            tid : row.technology,
            did : row.department
          })
        .then(
          res =>{
            this.getData()
          }
        )
        .catch(res => (console.log(res)));
    },
    pwdReset(row){
      this.$axios
        .post(this.$baseUrl + 'user/pwdReset', {},
          {headers:{id : row.id}})
        .then(res => {
          if (res.data.date.code === 0){
            this.$message.success("密码重置成功")
          }
        })
        .catch(res => (console.log(res)));
    },
    removeDomain(item) {
      var index = this.upd.position.indexOf(item)
      if (index !== -1) {
        this.upd.position.splice(index, 1)
      }
      this.$axios.post(this.$baseUrl + 'userPosition/del',{},
        {headers:{"id" : item.id}})
      .then()
      .catch(res => (console.log(res)))
    },
    addDomain() {
      this.upd.position.push({
        id: '',
        name: '',
        department_id: null,
        dep: null
      });
    },
    addPer(){
      // alert(this.upd.pid)
      if (this.add.did === undefined || this.add.pid === undefined || this.add.tid === undefined){
        alert("选择有误，请重新选择")
      }
      this.$axios
        .post(this.$baseUrl + 'user/add', this.add)
        .then(res =>{
          if(res.data.code === 0){
            this.getData();
            this.addVisible = false;
            this.$message.success("添加成功")
          }})
        .catch(res => (console.log(res)));
    },
    handleOpenAdd() {
      this.add = {};
      this.addVisible = true;
    },
    getTecSelect(){
      this.$axios
        .post(this.$baseUrl + 'technology/query', {},{headers:{"id" : this.add.did}})
        .then(res => (this.technology = res.data.data))
        .catch(res => (console.log(res)));
    },
    getTecSelect1(){
      this.$axios
        .post(this.$baseUrl + 'technology/query', {},{headers:{"id" : this.upd.did}})
        .then(res => (this.technology = res.data.data))
        .catch(res => (console.log(res)));
    },
    depSelect(v){
      this.upd.did = v ;
      this.getTecSelect1();
    },
    tecSelect(v){
      this.$forceUpdate();
      this.upd.tid = v;
    },
    getUser(v){
        this.$axios
        .post(this.$baseUrl + 'user/query', {
          "id" : this.id,
          "name" : this.search1,
          "username" : this.search2,
        },)
        .then(res => (this.list = res.data.data.list,this.totalSize = res.data.data.total))
        .catch(res => (console.log(res)));
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    getFile(file , fl) {
      var excelName = file.name;
      var idx = excelName.lastIndexOf(".");
      if (idx !== -1){
        var ext = excelName.substr(idx+1).toUpperCase();
        ext = ext.toLowerCase( );
        if (ext!== 'xlsx'){

        }else {
          this.files.push(file)
        }
      }
    },
  }
}
</script>

<style scoped>
.hidden {
  width: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
