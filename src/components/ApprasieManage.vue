<template>
  <div>
    <el-row style="margin:0 auto;text-align: center; align-content: center">
      <el-col :span="24" style="line-height: 50px;font-size: 16px;font-weight: bold;color: #666;text-align: center ">
        中国能建评价管理
      </el-col>
    </el-row>
    <el-row style="text-align: right">
      <el-button type="primary" style="height: 40px;text-align: center; margin-right: 13%" @click="appraiseVisible = true" >Excel导入</el-button>
      <el-button type="primary" style="height: 40px;text-align: center; " @click="getRange" >评价取值范围管理</el-button>
    </el-row>
    <el-row style="text-align: left;height: 100%;padding-left: 10%">
      <el-tabs tab-position="left" v-model="value" @tab-click="getTec(value)"
      style="margin-left: -100px">
        <el-tab-pane
          v-for="(item, index) in department"
          :key="item.id"
          :label="item.name"
          :name="item.id.toString()" >
          <el-tabs   v-model="tecValue" @tab-click="getGrade(tecValue)">
            <el-tab-pane
              v-for="tec in technology"
              :key="tec.id "
              :label="tec.name"
              :name="tec.id.toString()">
                  <template>
                    <el-table
                      :data="grade"
                      style="width: 100%"
                      height="500">
                      <el-table-column
                        label="工号"
                        prop="username">
                      </el-table-column>
                      <el-table-column
                        label="姓名"
                        prop="name">
                      </el-table-column>
                      <el-table-column>
                        <template slot-scope="scope">
                          <el-button
                            @click="getUser(scope.row.id)"
                            type="text"
                            size="small">
                            管理
                          </el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </template>
            </el-tab-pane>
          </el-tabs>
        </el-tab-pane>
      </el-tabs>
    </el-row>

    <el-dialog
      title="评价管理"
      :visible.sync="visible"
      width="60%"
      @close="dialogClose">
        <el-form id="user">
          <el-row>
            <el-col :span="8" >姓名<el-input v-model="search1" style="width: 50%" ></el-input></el-col>
            <el-col :span="8" >工号<el-input v-model="search2" style="width: 50%" ></el-input></el-col>
            <el-col :span="8" style="text-align: right;">
              <el-button type="primary" @click="search()">查询</el-button>
              <el-button @click="reset()">重置</el-button>
            </el-col>
          </el-row >
        <el-row style="width: 100%;text-align: center;">
        <template>
          <el-table
            ref="multipleTable"
            :data="user"
            tooltip-effect="dark"
            style="width: 90%;left: 5%"
            :row-key="getRowKeys"
            @select="handleSelectionChange"
            @filter-change="filterMethod">
            <el-table-column
              type="selection"
              width="55"
              :reserve-selection="true"
            >
            </el-table-column>
            <el-table-column
              prop="name"
              label="姓名"
            >
            </el-table-column>
            <el-table-column
              prop="username"
              label="工号"
              >
            </el-table-column>
            <el-table-column
              prop="technology"
              label="专业"
              :filters="technologyList"
              column-key="technology"
              >
            </el-table-column>
            <el-table-column
              prop="department"
              label="部门"
              :filters="departmentList"
              column-key="department"
              >
            </el-table-column>
          </el-table>
          <el-row style="padding: 5px 0;text-align: right;">
            <el-pagination @current-change="changeIndex" @size-change="changeSize" :current-page="pageIndex"
                           :page-sizes="[20,50,100]"
                           layout="total, prev, sizes, pager, next, jumper" :total="totalSize" :page-size="pageSize">
            </el-pagination>
          </el-row>
          <div style="margin-top: 20px">
            <el-row style="margin-top: 10px">
              <el-button @click="visible = false">取 消</el-button>
              <el-button type="primary" @click="scoreAdd">确 定</el-button>
            </el-row>
          </div>
        </template>
        </el-row>
      </el-form>
    </el-dialog>
    <el-dialog
      title="上传管理"
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
    <el-dialog title="Excel导入" :visible.sync="appraiseVisible" width="500px" style="padding:0;" @close="appraiseVisible = false">
      <el-row>
        <el-col :span="14">
          <span>打分人与被打分人上传</span>
      <el-upload
        style="margin-top: 10px"
        class="upload-demo"
        ref="upload"
        action="1111"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList"
        multiple
        :limit="2"
        :auto-upload="false"
        :on-change="getFile">
        <el-button slot="trigger" size="small" type="primary">点击上传</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">请同时上传打分人和被打分人文件，且被打分文件名称中包含“被打分”，打分人名称中不包含</div>
      </el-upload>
        </el-col>
        <el-col :span="10">
          <span>设总被打分人上传</span>
      <el-upload
        style="margin-top: 10px"
        class="upload-demo"
        ref="upload"
        :action="this.$baseUrl + 'excel/amongExcel'"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :file-list="fileList">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传excel文件</div>
      </el-upload>
        </el-col>
      </el-row>
    </el-dialog>
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
      department: [],
      technology: [],
      grade: [],
      score: [],
      visible : false,
      visibleId : "",
      appraiseVisible : false,
      value:"",
      search1: "",
      search2: "",
      tecValue: "",
      pageIndex: 1,
      pageSize: 20,
      totalSize : 0,
      list: [],
      user : [],
      multipleSelection: [],
      systemState : "",
      addAppraise: [],
      delAppraise: [],
      range:{},
      rangeVisible : false,
      min: "",
      max: "",
      fileList : [],
      files : [],
      technologyList:[],
      departmentList:[],
      queryByd : null,
      queryByt : null,
      selectObj : [],
      columnData : []

    }
  },
  mounted() {
    this.getLogIn();
    // this.getData();
  },
  methods: {
    search() {
      this.getUser(this.visibleId);
    },
    reset() {
      this.search1 = "";
      this.search2 = "";
      this.pageIndex = 1;
      this.getUser(this.visibleId);
    },
    getLogIn() {
      let i = JSON.parse(sessionStorage.getItem("appraise"));
      this.id = i.id;
      this.getData();
    },
    getData() {
      this.$axios
        .post(this.$baseUrl + 'department/query', {},)
        .then(res => {this.department = res.data.data
          this.departmentList = JSON.parse(JSON.stringify(this.department).replace(/id/g,"value").replace(
            /name/g,"text"));
        })
        .catch(res => (console.log(res)));
      this.$axios
        .post(this.$baseUrl + 'userScore/queryScore', {}, {headers: {'id': this.id}})
        .then(res => (this.list = res.data.data))
        .catch(res => (console.log(res)));
      this.$axios
        .post(this.$baseUrl + 'technology/query',{},{headers: {"id": ""}})
        .then(res => {this.technologyList = res.data.data;
          this.technologyList = JSON.parse(JSON.stringify(this.technologyList).replace(/id/g,"value").replace(
            /name/g,"text"));})
    },
    getTec(v) {
      this.$axios
        .post(this.$baseUrl + 'technology/query', {}, {headers: {"id": v}})
        .then(res => (this.technology = res.data.data))
        .catch(res => (console.log(res)));
    },
    getGrade(v) {
      this.$axios
        .post(this.$baseUrl + 'user/queryByTid', {}, {headers: {"id": v}})
        .then(res => (this.grade = res.data.data))
        .catch(res => (console.log(res)));
    },
    getScore(v) {
      this.$axios
        .post(this.$baseUrl + 'userScore/selectByGradeId', {
          "id" : v.id
        })
        .then(res => (this.score = res.data.data))
        .catch(res => (console.log(res)));
    },
    getUser(v) {
      if (v != null)
      this.visibleId = v ;

      this.$axios
        .post(this.$baseUrl + 'user/queryNotScore', {
          "id": this.visibleId,
          "name": this.search1,
          "username": this.search2,
          "pageIndex" : this.pageIndex,
          "pageSize" : this.pageSize,
          "tIds": this.queryByt,
          "dIds" : this.queryByd

        })
        .then(res => {this.user = res.data.data.list;
          this.totalSize = res.data.data.total;
          this.toggleSelection(this.user);
        })
        .catch(res => (console.log(res)));
      this.visible = true
    },
    scoreAdd() {
      this.$axios
        .post(this.$baseUrl + 'gradeScore/manage', {
          "gradeId" : this.visibleId,
          "addScoreId" : this.addAppraise,
          "delScoreId" : this.delAppraise
        })
        .then( res => {
          if ( res.data.code === 0)
            alert("操作成功");
          else
            alert("添加失败，请稍后重试或联系管理员")
        })
        .catch(res => (console.log(res)));
      this.reload();
    },
    handleSelectionChange(arr,row) {
        // 判断存数据数组是否为空,进而进行删除和添加的判断
      if (row .selected === 0 ) {
        if (this.addAppraise.length > 0) {
          let state = false;
          for (let i = 0 ; i < this.addAppraise.length ; i++) {
            if (this.addAppraise[i] === row.id) {
              this.addAppraise.splice(i, 1)
              state = true;
            }
          }
          if(state === false)
            this.addAppraise.push(row.id)
        }else
          this.addAppraise.push(row.id)
      }else if(this.systemState === true) {
        if (this.delAppraise.length > 0) {
          let state = false;
          for (let i = 0; i < this.delAppraise.length; i++) {
            if (this.delAppraise[i] === row.id) {
              this.delAppraise.splice(i, 1)
              state = true;
            }
          }
          if (state === false)
            this.delAppraise.push(row.id)
        }else
          this.delAppraise.push(row.id)
      }
      console.log(this.addAppraise + "addAppraise")
      console.log(this.delAppraise + "delAppraise")
    },
    toggleSelection(data) {
      this.systemState = false;
      if (data.length) {
        this.$nextTick(function() {
          data.forEach(item => {
            //如果数据中的selected !== 0的话 让这一列选中
            if (item.selected !== 0) {
              //multipleTable 是这个表格的ref属性 true为选中状态
              this.$refs.multipleTable.toggleRowSelection(item, true);
            }
          })
        })
      }
      this.systemState = true;
    },
    dialogClose(){
      this.$refs.multipleTable.clearSelection();
      this.addAppraise = [];
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
        .then(res => (this.min = res.data.data.min,
          this.max = res.data.data.max))
        .catch(res => (console.log(res)));
      this.$message("修改成功");
      this.rangeVisible = false;
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
    submitUpload() {
      if (0 === this.files.length) {
        this.$message({
          type: 'info',
          message: '请选择要上传的文件'
        });
        return;
      }
      var formData = new FormData();
      // for (var i = 0 ; i < this.files.length ; i++){
      //   formData.append("file" , this.files[i].row)
      // }
      this.files.forEach((file) => {
        formData.append('file', file.raw)
      })
      this
        .$axios
        .post(this.$baseUrl + 'excel/personalExcel',formData,{headers: {"Content-Type": "multipart/form-data"}})
        .then(res => {
          if(res.data.code === 0){
            this.$message("上传成功")
          }else {
           this.$message.error("上传失败，请重试")
          }

      }
    )
    },
    changeIndex(v) {

      this.pageIndex = v;
      this.getUser()
    },
    changeSize(v) {
      this.addAppraise = [];
      this.$refs.multipleTable.clearSelection();
      this.pageSize = v;
      this.getUser()
    },
    filterMethod(filter){
      for (let obj in filter){
        if (obj === "technology") {
          this.queryByd = null;
          this.queryByt = filter.technology
        }
        else {
          this.queryByt = null;
          this.queryByd = filter.department
        }
      }
      this.getUser()
    },
    getRowKeys(row) {
      return row.id;   //指定row-key的一个标识
    },

    }


  }
</script>

<style scoped>

</style>
