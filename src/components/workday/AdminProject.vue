<template>
  <div>
    <el-form >
      <el-row>
        <!-- 列表 -->
        <el-row style="background-color: #FFF; text-align: center">
          <el-row>
            <el-row style="margin-left:-10px;text-align: center; align-content: center;">
              <el-col :span="24" style="line-height: 50px;font-size: 16px;font-weight: bold;color: #666;text-align: center ">
                施工图工时管理
                <i class="el-icon-document-copy" @click="openExcel()"></i>
              </el-col>
            </el-row>
            <el-row style="margin-left:-10px; align-content: center;">
              <el-col  align="right">
                审核日:<el-input size="mini" @change="setDeclareDay" style="width: 60px" v-model="declareDay"></el-input>
                      <el-button style="margin-right: 50px"  type="primary" @click="openNewProject">新增项目</el-button>
                <el-button style="margin-right: 50px"  type="primary" @click="proHandler">抓取项目列表</el-button>
              </el-col>
            </el-row>

            <u-table border :data="list" class="u-table" :row-class-name="tableRowClassName"
                      :header-cell-style="{background:'#F5F5F5'}" :cell-style="this.CellStyleOne">
              <u-table-column prop="number" min-width="18%" label="项目编号" align="center"  >
              </u-table-column>
              <u-table-column prop="projectName" min-width="30%" label="项目名称" align="center">
              </u-table-column>
              <u-table-column prop="director" min-width="8%" label="主管设总" align="center"  >
              </u-table-column>
              <u-table-column prop="general" min-width="8" label="设总" align="center" style="word-break: break-all;">
              </u-table-column>
              <u-table-column prop="state" min-width="8%" label="项目状态" align="center">
              </u-table-column>
              <u-table-column prop="amount"  min-width="8%" label="卷册总数"  align="center">
              </u-table-column>
              <u-table-column  min-width="20%" align="center">
                <template slot-scope="scope">
                  <el-row>
                    <el-col :span="12">
                  <el-button
                    size="mini"
                    @click="openVolumeList(scope.row)">项目主页</el-button>
                    </el-col>
                    <el-col :span="12">
                  <el-button
                    size="mini"
                    @click="openVolume(scope.row.projectPhaseID)">卷册目录</el-button>
                    </el-col>
                  </el-row>
                </template>
              </u-table-column>
            </u-table>
          </el-row>
        </el-row>
      </el-row>
    </el-form>

    <el-dialog
        v-el-drag-dialog
      title="Excel导出"
      :visible.sync="excelDialog"
      width="40%" style="text-align: center">
      <el-row >
        <el-col :span="24" align="center">
        <el-date-picker
          v-model="downMonth"
          type="month"
          value-format="yyyy-MM"
          placeholder="选择月">
        </el-date-picker>
        </el-col>
      </el-row>
      <el-row align="center" style="margin-top: 20px">
        <el-button @click="downExcel()" style="width: 250px">各项目专业工时分配与使用下载</el-button>
      </el-row>
      <el-row align="center"style="margin-top: 20px">
        <el-button @click="downExcel1()" style="width: 250px">各项目个人完成卷册数量下载</el-button>
      </el-row>
      <el-row align="center" style="margin-top: 20px">
        <el-button @click="downExcel2()" style="width: 250px">各项目完成卷册信息下载</el-button>
      </el-row>
    </el-dialog>
    <el-dialog
        v-el-drag-dialog
      title="项目管理"
      :visible.sync="projectVisible"
      width="90%"
    >
      <el-row style="text-align: center">
        <el-col :span="16" >项目编号<el-input v-model="proNum" placeholder="项目编号须与院网项目门户中一致"
                                          style="width: 50%" ></el-input></el-col>
        <el-col :span="8" style="text-align: left;">
          <el-button type="primary" @click="addNumber()">添加</el-button>
        </el-col>
      </el-row>
      <u-table border :data="list" class="u-table"
                :header-cell-style="{background:'#F5F5F5' } "
                :row-class-name="tableRowClassName"
                :default-sort = "{prop: 'date', order: 'descending'}"
                >
        <u-table-column prop="number" min-width="13  %" label="项目号" sortable align="center"  >
        </u-table-column>
        <u-table-column prop="projectName" min-width="24" label="项目名称" sortable align="center" style="word-break: break-all;">
        </u-table-column>
        <u-table-column min-width="24" label="蜘蛛状态" sortable align="center">
          <template slot-scope="scope">
          <el-switch
            v-model="scope.row.spider"
            :active-value=0
            :inactive-value=1
            active-text="继续抓取"
            inactive-text="取消抓取"
            @change="spiderHandler(scope.row)">
          </el-switch>
          </template>
        </u-table-column>
      </u-table>
    </el-dialog >
    <el-dialog
        v-el-drag-dialog
  title="项目新增"
  :visible.sync="visible"
  width="60%" style="text-align: center"
  @close="closeDialog">
  <el-form :model="form" >
    <el-row>
      <el-row style="margin-right: 50px">
        <el-col :span="12">
          <el-form-item label-width="120px" label="项目编号">
            <el-input v-model="form.number"  >
            </el-input>
          </el-form-item >
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="120px" label="项目名称">
            <el-input v-model="form.name">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-right: 50px">
        <el-col :span="12">
          <el-form-item label-width="120px" label="设总">
            <el-select v-model="form.general"
                       :filterable="true"  :remote="true"
                       :remote-method="remoteMethod"
                       value-key="id"
                       :loading="nameLoading"
                       placeholder="请输入人员姓名或工号">
              <el-option
                v-for="(item,index) in form.generalList"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option></el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="120px" label="工时总数">
            <el-input v-model="form.workday" oninput="value=value.replace(/[^\d.]/g,'')">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
      <el-switch
        v-model="form.spider"
        active-text="关联"
        inactive-text="不关联"
        active-value=0
        inactive-value=1>
      </el-switch>
      </el-form-item>
      <el-form-item style="margin-left: -50px;text-align: center;margin-top: 20px">
        <el-button @click=" closeDialog ">取消</el-button>
        <el-button @click="dialogSubmit" type="primary">确认</el-button>
      </el-form-item>
    </el-row>
  </el-form>
</el-dialog>
  </div>
</template>

<script>
import storage from "../../store";

export default {
  "name": "AdminProject",
  "data"() {
    return {
      getRowKeys(row) {
        return row.id;
      },
      // 要展开的行，数值的元素是row的key值
      expands: [],
      id: "",
      pid: "",
      isShow : false,
      list: [],
      project: {
      },
      loading : false,
      nameLoading : null,
      volume: {},
      projectVisible:false,
      options: [],
      fileList : [],
      proNum:'',
      state: [
        {
          value: 0,
          label: "未完成"
        },
        {
          value: 1,
          label: "已完成"
        }
      ],
      general : [],
      newVolume : {},
      new_pid: null,
      newProject : {
        volumes : []
      },
      declareDay : null,
      addProject : false,
      excelDialog : false,
      downMonth : "",
      volumeMonth:new Date().getMonth()+1,
      principalList:[],
      designerList:[],
      nowWeek : "",
      visible : false,
      form : {
        number : "",
        name : "",
        workday : "",
        general : [],
        spider : 0,
      },
      tecList : [],
    }
  },
  mounted() {
    this.getData();
    this.nowWeek = this.getWeek()
  },
  methods: {
    getData() {
      this.$axios
        .post(this.$baseUrl + 'project/queryByAdmin', {
            "id": this.id
          }
        )
        .then(res => {
          this.list = res.data.data
        })
        .catch(res => (console.log(res)));
      this.$axios
        .post(this.$baseUrl + 'project/declareDay'
        )
        .then(res => {
          this.declareDay = res.data.data
        })
        .catch(res => (console.log(res)));
    },
    setDeclareDay(){
      this.$axios
        .post(this.$baseUrl + 'project/setDeclareDay',{},{headers:{day : this.declareDay}})
        .then(res => {
          if (res.data.code === 0){
            this.$message.success("操作成功")
          }
        })
        .catch(res => (console.log(res)));
    },
    openExcel(){
      const date = new Date();
      const end = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
      this.downMonth = date.getFullYear() + "-" + (date.getMonth()+1)
      this.excelDialog = true;
    },
    clickRowHandle(row, column, event) {
      if (column.property !== undefined) {
        if (this.expands.includes(row.id)) {
          this.expands = this.expands.filter(val => val !== row.id);
        } else {
          this.expands.push(row.id);
        }
      }
    },
    tableRowClassName({row, rowIndex}) {
      //把每一行的索引放进row
      row.index = rowIndex;
    },
    remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.$axios
            .post(this.$baseUrl + 'user/queryByName', {
              "name" : query
              }
            )
            .then(res => {
              if (res.data.data != null) {
                this.form.generalList = res.data.data
              }
          });
          this.loading = false;
        }, 200);
      } else {
        this.general = [];
      }
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
    proHandler(){
      this.projectVisible = true;
      console.table(this.list)
    },
    openNewProject(){
       this.form = {
        number : "",
        name : "",
        workday : "",
        general : [],
        spider : 0,
        generalList : [],
      };
        if ( this.tecList.length <= 0) {
          this.$axios
            .post(this.$baseUrl + 'technology/queryAll')
            .then(res => {
              this.tecList = res.data.data
            })
            .catch(res => (console.log(res.data)))
        }
      this.visible = true;
    },
    dialogSubmit(){
      this.$axios
        .post(this.$baseUrl + 'project/setProject',this.form)
        .then(res => {
        if (res.data.code === 0){
          this.closeDialog()
                }
              })
        .catch(res => (console.log(res.data)))
        },
    closeDialog(){
      this.visible = false;
      this.getData()
    },
    spiderHandler(r){
      console.log(r)
      this.$axios
        .post(this.$baseUrl + 'project/spider',{
          "id" : r.id,
          "spider" : r.spider
        })
        .then(res =>{this.getData()})
        .catch(res => (console.log(res)));
    },
    downExcel() {
      let that = this;
      this.$message.success("即将开始下载");
      let xhr = new XMLHttpRequest();
      let u =  this.$baseUrl + 'projectExcel/statisticAll?date=' + this.downMonth;
      xhr.open("get", u, true); // get、post都可
      xhr.responseType = "blob";  // 转换流
      xhr.setRequestHeader("Authorization", this.$storage.get("Authorization")); // token键值对
      xhr.onload = function() {
        if (this.status === 200) {
          let blob = this.response;
          let a = document.createElement("a")
          let url = window.URL.createObjectURL(blob)
          a.href = url
          a.download =  that.downMonth + "专业工时分配与使用表.xlsx"  // 文件名
          a.click()
          window.URL.revokeObjectURL(url)
        }
      }
    xhr.send();
      // window.location.href = this.$baseUrl + 'projectExcel/statisticAll?minDay=' + this.downMonth[0]+'&maxDay='+this.downMonth[1];
    },
     downExcel1() {
       let that = this;
       this.$message.success("即将开始下载");
       let xhr = new XMLHttpRequest();
       let u =  this.$baseUrl + 'projectExcel/everyoneAll?date=' + this.downMonth;
       xhr.open("get", u, true); // get、post都可
       xhr.responseType = "blob";  // 转换流
       xhr.setRequestHeader("Authorization", this.$storage.get("Authorization")); // token键值对
       xhr.onload = function() {
         if (this.status === 200) {
           let blob = this.response;
           let a = document.createElement("a")
           let url = window.URL.createObjectURL(blob)
           a.href = url
           a.download =  that.downMonth + "个人完成卷册数量表.xlsx"  // 文件名
           a.click()
           window.URL.revokeObjectURL(url)
         }
       }
       xhr.send();
    },
    downExcel2() {
      let that = this;
      this.$message.success("即将开始下载");
      let xhr = new XMLHttpRequest();
      let u =  this.$baseUrl + 'projectExcel/volumeAll?date=' + this.downMonth;
      xhr.open("get", u, true); // get、post都可
      xhr.responseType = "blob";  // 转换流
      xhr.setRequestHeader("Authorization", this.$storage.get("Authorization")); // token键值对
      xhr.onload = function() {
        if (this.status === 200) {
          let blob = this.response;
          let a = document.createElement("a")
          let url = window.URL.createObjectURL(blob)
          a.href = url
          a.download =  that.downMonth + "项目完成卷册表.xlsx"  // 文件名
          a.click()
          window.URL.revokeObjectURL(url)
        }
      }
      xhr.send();
    },
    addNumber(){
      this.$axios
        .post(this.$baseUrl + 'project/addNumber',{
          number : this.proNum
        })
        .then(res => {
          if (res.data.data.code === 0){
            this.$message({
              type: "success",
              message : "已成功添加"
            })
          }
          this.getData();
        })
        .catch(res => (console.log(res)));
    },
    openVolume(p){
      window.open('http://zmis.zepdi.com.cn/Portal/EPMS/List/RollInfo/RollEntityBill.aspx?' +
        'OrganizationId=' + p + '&secid=00000000-0000-0000-0000-000000000000&IsPortal=True')
    },
    openVolumeList(project){
      console.log(project)
      const href = this.$router.resolve(
        {
          path: "/projectMain",
          name: "projectMain",
          query:{
            "project_id" : project.id
          }
        }
      )
      window.open( href.href,project.id)
    },
    getWeek(){
      // date = formatTimebytype(date, 'yyyy-MM-dd');//将日期转换成yyyy-mm-dd格式
      // let YY = date.getFullYear() + '-';
      // let MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
      // let DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
      let date = new Date()

      let date2 = new Date(date.getFullYear(), 0, 1);
      let day1 = date.getDay();
      if (day1 === 0) day1 = 7;
      let day2 = date2.getDay();
      if (day2 === 0) day2 = 7;
      let d = Math.round((date.getTime() - date2.getTime() + (day2 - day1) * (24 * 60 * 60 * 1000)) / 86400000);
      //当周数大于52则为下一年的第一周
      if((Math.floor(d / 7)) === 52){
        return 52
      }
      else return (Math.floor(d / 7))
    },

  }
}
</script>

<style scoped>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 130px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.u-table {
  margin-top:20px;
  width: 100% ;
  horiz-align: center;
  left: 10%;
  font-size: 12px;
  word-wrap: break-word;
  margin-left: -10%;
}


</style>
