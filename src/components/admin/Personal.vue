<template>
  <div>
    <el-row style="margin:0 auto;text-align: center; align-content: center">
      <el-col :span="24" style="line-height: 50px;font-size: 16px;font-weight: bold;color: #666;text-align: center ">
        中国能建人员管理表
      </el-col>
    </el-row>
    <el-row style="text-align: right" >
        <el-col :span="4" >姓名<el-input v-model="search1" @keyup.enter.native="search" size="mini" style="width: 50%" ></el-input></el-col>
        <el-col :span="4" >工号<el-input v-model="search2" @keyup.enter.native="search" size="mini"   style="width: 50%" ></el-input></el-col>
        <el-col :span="4" style="text-align: right;">
          <el-button type="primary" size="mini" @click="search()">查询</el-button>
          <el-button  size="mini"  @click="reset()">重置</el-button>
        </el-col>
      <el-col :span="3" style="text-align: left;">
      <el-button style="text-align: center; margin-left: 30px"
                 @click="handleOpenAdd" size="mini">人员添加</el-button>
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
      <el-button type="primary" size="mini" style="text-align: center; " @click="getWeight" >权重管理</el-button>
    </el-row>
    <el-row style="text-align: center">
    <el-table v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
              border :data="list" style="width:85%;margin-left: 7.5%"
              :default-sort = "{prop: 'date', order: 'descending'}"
              @filter-change="filterMethod"
              @sort-change="changeSort"
              :header-cell-style="this.CellStyleOne" :cell-style="this.CellStyleOne">

      <el-table-column prop="name" label="姓名" min-width="12%"
      sortable="custom">
      </el-table-column>
      <el-table-column prop="username" label="工号" min-width="12%"
      sortable="custom">
      </el-table-column>
      <el-table-column prop="technology" label="专业" min-width="16%"
              :filters="technologyList"
              column-key="technology">
      </el-table-column>
      <el-table-column prop="department" label="部门" min-width="45 %"
      :filters="departmentList" column-key="department">
      </el-table-column>
      <el-table-column prop="power" label="管理权限" min-width="12.5%">
      </el-table-column>
      <el-table-column label="职位" min-width="12.5%"
                       :filters="position"
                       column-key="position">
        <template slot-scope="scope">
          <el-tooltip class="hidden" effect="dark" :content=scope.row.position placement="top">
            <span>{{scope.row.position}}</span>
          </el-tooltip>
        </template>
      </el-table-column>
<!--      <el-table-column  label="评价权限" min-width="12.5%">-->
<!--        <template slot-scope="scope">-->
<!--          <span v-if="scope.row.grade === 0">-->
<!--            <i class="el-icon-close"/>-->
<!--          </span>-->
<!--          <span v-else>-->
<!--            <i class="el-icon-check"></i>-->
<!--          </span>-->
<!--        </template>-->
<!--      </el-table-column>-->
      <el-table-column
        fixed="right"
        label="操作"
        width="120">
        <template slot-scope="scope">
          <el-button
            @click="handleOpenUpd(scope.$index)"
            type="text"
            size="small">
            修改
          </el-button>
          <el-popconfirm
            title="确定要删除这个用户吗？" @onConfirm="deleteRow(scope.$index)">
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
      <el-row style="padding: 5px 0px;text-align: right;">
        <el-pagination @current-change="changeIndex" @size-change="changeSize" :current-page="pageIndex"
                       :page-sizes="[5,10,20,30]"
                       layout="total, prev, sizes, pager, next, jumper" :total="totalSize" :page-size="pageSize">
        </el-pagination>
      </el-row>
    </el-row>
    <el-dialog
      title="人员修改"
      :visible.sync="visible"
      width="50%"
      :before-close="handleClose">
      <el-form id="upd">
        <el-row style="text-align: left">
          <el-col :span="12">姓&nbsp;名&nbsp;<el-input v-model="upd.name" style="width: 50%" :readonly = "true"></el-input></el-col>
          <el-col :span="12">工&nbsp;号&nbsp;<el-input v-model="upd.username" style="width: 50%" :readonly= "true"></el-input></el-col>
        </el-row>
        <el-row style="margin-top: 10px; text-align: left">
          <el-col :span="12">部&nbsp;门&nbsp;
            <template>
              <el-select v-model="upd.department" placeholder="请选择" @change="depSelect(upd.department)">
                <el-option
                  v-for="item in department"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
          </el-col>
          <el-col :span="12">专&nbsp;业&nbsp;
          <template>
            <el-select v-model="upd.technology" placeholder="请选择" @change="tecSelect(upd.technology)">
              <el-option
                v-for="item in technology"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px; text-align: left">
            <el-col :span="12">管理权限
              <template>
                <el-select v-model="upd.power" placeholder="请选择" style="width: 60%"  @change="upd.pid = upd.power">
                  <el-option
                    v-for="item in power"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </template>
            </el-col>
        </el-row>
        <el-row>
          <el-col :span="20"><el-divider>职位</el-divider></el-col>
          <el-col :span="4" style="margin-top: 10px">
            <el-button size="mini" icon="el-icon-circle-plus-outline" circle
                    @click="addDomain"></el-button> </el-col>
        </el-row>
        <el-row v-for="(item,index) in upd.position" :key="index" style="margin-top: 10px; text-align: left">
          <el-col :span="12">职位管理&nbsp;
            <template>
              <el-select v-model="item.name" placeholder="请选择" style="width: 60%" @change="item.position = item.name">
                <el-option
                  v-for="item in position"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
          </el-col>
          <el-col :span="12">职位部门
            <template>
              <el-select v-model="item.dep" placeholder="请选择" style="width: 60%" @change="item.depId = item.dep">
                <el-option
                  v-for="item in departmentList"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value">
                </el-option>
              </el-select>
            </template>
            <el-button size="mini" icon="el-icon-remove-outline" circle
                       @click.prevent="removeDomain(item)"></el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-row style="margin-top: 10px">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="updRow">确 定</el-button>
      </el-row>
    </el-dialog>
    <el-dialog
      title="人员新增"
      :visible.sync="addVisible"
      width="50%"
      :before-close="handleClose">
      <el-form id="add" style="text-align: left">
        <el-row>
          <el-col :span="12">姓&nbsp;名&nbsp;<el-input v-model="add.name" style="width: 50%" ></el-input></el-col>
          <el-col :span="12">工&nbsp;号&nbsp;<el-input v-model="add.username" style="width: 50%" ></el-input></el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="12">部&nbsp;门&nbsp;
            <template>
              <el-select v-model="add.did" placeholder="请选择" @change="getTecSelect">
                <el-option
                  v-for="item in department"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
          </el-col>
          <el-col :span="12">专&nbsp;业&nbsp;
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
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">管理权限&nbsp;
            <template>
              <el-select v-model="add.pid" placeholder="请选择" style="width: 60%" >
                <el-option
                  v-for="item in power"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
          </el-col>
<!--          <el-col :span="12" style="margin-top: 8px">评价权限-->
<!--            <el-switch-->
<!--              v-model="add.grade"-->
<!--              active-color="#112ddf"-->
<!--              inactive-color="#737791"-->
<!--              :active-value = "1"-->
<!--              :inactive-value = "0">-->
<!--            </el-switch>-->
<!--          </el-col>-->
        </el-row>
        <el-row>
          <el-col :span="12">职位管理&nbsp;
            <template>
              <el-select v-model="add.pid" placeholder="请选择" style="width: 60%" >
                <el-option
                  v-for="item in power"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
          </el-col>
          <!--          <el-col :span="12" style="margin-top: 8px">评价权限-->
          <!--            <el-switch-->
          <!--              v-model="add.grade"-->
          <!--              active-color="#112ddf"-->
          <!--              inactive-color="#737791"-->
          <!--              :active-value = "1"-->
          <!--              :inactive-value = "0">-->
          <!--            </el-switch>-->
          <!--          </el-col>-->
        </el-row>
      </el-form>
      <el-row style="margin-top: 10px">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addPer">确 定</el-button>
      </el-row>x
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
                  label="职位名称"
                  width="180">
                </el-table-column>
                <el-table-column
                  label="权重"
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
    <news-dialog class="news" :is-show="isShow" @click.native="isShow = !isShow">
    </news-dialog>
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
      month: new Date().getMonth() + 1,
      search1: "",
      search2: "",
      loading: true,
      pageIndex: 1,
      pageSize: 10,
      totalSize: 0,
      visible : false,
      addVisible: false,
      weightVisible: false,
      list: [],
      upd :{},
      add:{},
      power: [],
      department:[],
      position : [],
      positionupd : [],
      fileList : [],
      technology:[],
      technologyList:[],
      departmentList:[],
      selectName: "",
      selectType: "",
      queryByd : null,
      queryByt : null,
      queryByP : null,
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
    this.getLogIn();
  },
  methods: {
    search() {
      this.getData();
    },
    reset() {
      this.search1 = "";
      this.search2 = "";
      this.pageIndex = 1;
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
          "id" : this.id,
          "pageIndex" : this.pageIndex,
          "pageSize" : this.pageSize,
          "name" : this.search1,
          "username" : this.search2,
          "selectName" : this.selectName,
          "selectType" : this.selectType,
          "tIds": this.queryByt,
          "dIds" : this.queryByd,
          "pIds" : this.queryByP
        },)
        .then(res => {this.list = res.data.data.list;
        this.totalSize = res.data.data.total})
        .catch(res => (console.log(res)));
      this.$nextTick(function() {
        this.loading = false;
      })
            this.$axios
        .post(this.$baseUrl + 'department/query', {},)
        .then(res => {this.department = res.data.data
          this.departmentList = JSON.parse(JSON.stringify(this.department).replace(/id/g,"value").replace(
            /name/g,"text"));
        })
        .catch(res => (console.log(res)));
      this.$axios
        .post(this.$baseUrl + 'technology/query',{},{headers: {"id": ""}})
        .then(res => {this.technologyList = res.data.data;
          this.technologyList = JSON.parse(JSON.stringify(this.technologyList).replace(/id/g,"value").replace(
            /name/g,"text"));})
      this.$axios
        .post(this.$baseUrl + 'position/query',{},{headers: {"id": ""}})
        .then(res => {this.position = res.data.data;
          this.position = JSON.parse(JSON.stringify(this.position).replace(/id/g,"value").replace(
            /name/g,"text"));})
    },
    deleteRow(v){
      this.$axios
        .post(this.$baseUrl + 'user/del', {},{headers:{id:this.list[v].id}})
        .then()
        .catch(res => (console.log(res)));
      this.reload();
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
        .then()
        .catch(res => (console.log(res)));
      this.reload();
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
      this.upd = [];
    },
    handleOpenUpd(v) {
      this.$axios
        .post(this.$baseUrl + 'user/queryToupd', {}, {headers:{"id" : this.list[v].id}})
        .then(res => {this.upd = res.data.data;
        this.positionupd.push(this.upd.position);
        console.table(res.data+ "data");
          this.visible = true;})
        .catch(res => (console.log(res)));
      this.getSelect();
    },
    handleOpenAdd() {
      this.addVisible = true;
      this.getSelect();
    },
    getSelect(){
      this.$axios
        .post(this.$baseUrl + 'power/query', {},)
        .then(res => (this.power = res.data.data))
        .catch(res => (console.log(res)));
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
    changeIndex(v) {
      this.pageIndex = v;
      this.getUser(v);
    },
    changeSize(v) {
      this.pageSize = v;
      this.getUser(v);
    },
    filterMethod(filter){
      console.log(filter)
      for (let obj in filter){
        if (obj === "technology") {
          this.queryByd = null;
          if (filter.technology.length !== 0) {
            this.queryByt = filter.technology
            this.selectName = 't.name'
          }else {
            this.queryByt = null
            this.selectName = ""
          }
        }
        else if (obj === "position"){
          this.queryByt = null;
          if (filter.position.length !== 0) {
            this.queryByP = filter.position
            this.selectName = 'pt.id'
          }else {
            this.queryByP = null
            this.selectName = ""
          }
        }
        else {
          this.queryByt = null;
          if (filter.department.length !== 0) {
            this.queryByd = filter.department
            this.selectName = 'd.name'
          }else {
            this.queryByd = null
            this.selectName = ""
          }
        }
      }
      this.getUser(filter)
    },
    changeSort(v){

      if(v.order == null){
        this.selectName = "";
        this.selectType = ""
      }else if(v.order === "ascending"){
        this.selectName = v.prop
        this.selectType = ""
      }else if(v.order === "descending"){
        console.log("aaaa")
        this.selectName = v.prop
        this.selectType = 1
      }
      this.getUser(v)
    },
    getUser(v){
        this.$axios
        .post(this.$baseUrl + 'user/query', {
          "id" : this.id,
          "pageIndex" : this.pageIndex,
          "pageSize" : this.pageSize,
          "name" : this.search1,
          "username" : this.search2,
          "selectName" : this.selectName,
          "selectType" : this.selectType,
          "tIds": this.queryByt,
          "dIds" : this.queryByd,
          "pIds" : this.queryByP
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
    weightTabClick(tab,event){
      this.$axios
        .post(this.$baseUrl + 'position/queryByWeight',{},
          {headers : {"id" :this.weightTabs[tab.index].id}})
        .then(res => (this.weightList = res.data.data))
        .catch(res => (console.log(res)));
    },
    getWeight() {
      this.weightVisible = true
      this.$axios
        .post(this.$baseUrl + 'position/queryByWeight',{},
          {headers : {"id" : 2}})
        .then(res => (this.weightList = res.data.data))
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
.hidden {
  width: 30px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
