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
      loading : false,
      newVolume : {},
      new_pid: null,
      newProject : {
        volumes : []
      },
      addProject : false,
      excelDialog : false,
      downMonth : "",
      volumeMonth:new Date().getMonth()+1,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      principalList:[],
      designerList:[],
      nowWeek : "",
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
    },
    openExcel(){
      const date = new Date();
      const end = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate();
      // const date1 = new Date();
      // date1.setTime(date1.getTime() - 3600 * 1000 * 24 * 30)
      // const start = date1.getFullYear() + "-" + (date1.getMonth()+1) + "-" + date1.getDate();
      this.downMonth = date.getFullYear() + "-" + (date.getMonth()+1)
      // this.downMonth = [start,end]
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
    "timeConversion"(v) {
      if (v !== undefined && v !== "") {
        if (!isNaN(v)) {
          let date = new Date(Number(v));
          let year = date.getFullYear();
          let month = date.getMonth() + 1;
          let day = date.getDate();
          return year + '-' + month + '-' + day;
        }else
          return v;
      } else
        return "";
    },
    recordConversion(v,i,n) {
      if (v != null && v!== "") {
        let recordOne = v.split("##")
        if ( recordOne.length !== 0) {
          if(i === 0 ){
            if (Number(recordOne[0].split("$")[2]) === Number(this.nowWeek)){
              return recordOne[i].split("$")[n]
            }else
              return null
          }else{
            if (Number(recordOne[0].split("$")[2]) === Number(this.nowWeek))
              if ( recordOne.length > 1)
                return recordOne[i].split("$")[n]
              else return null
            else return recordOne[0].split("$")[n]
          }
        }else {
          return null
        }
      }
    },
    displayProgress(v){
      if (v.principalList !== undefined){
        return v.principalList.split("##")[0].split("$")[0]
      }else if (v.checkerList !== undefined){
        return v.checkerList.split("##")[0].split("$")[0]
      }else if (v.designerList !== undefined){
        return v.designerList.split("##")[0].split("$")[0]
      }else
        return  null
    },
    displayColor(v){
      if (v.principalList !== undefined){
        return "color:#e3f42a"
      }else if (v.checkerList !== undefined){
        return "color:#e70821"
      }else if (v.designerList !== undefined){
        return "color:#1b08e7"
      }else
        return  null
    },
    confirmProject(){
      this.$confirm('确认将当前项目状态置于已完成', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() =>{
        this.$axios
          .post(this.$baseUrl + 'project/updState', {}, {"headers": {'id': this.new_pid}}
          )
          .then(res => {
            if (res.data.code === 0){
              this.$message("操作成功")
            }
          })
          .catch(res => (console.log(res)));
      }).catch()
    },
    tableRowClassName({row, rowIndex}) {
      //把每一行的索引放进row
      row.index = rowIndex;
    },
    "updProject"() {
      let projectUsers = [];
      let projectTec = [];
      for (let i = 0; i < this.project.tec.length; i++) {
        console.log(this.project.tec[i])
        projectTec.push(this.project.tec[i][0])
        projectUsers.push(this.project.tec[i][1])
      }
      this.$axios
        .post(this.$baseUrl + 'project/upd', {
          "id": this.project.id,
          "name": this.project.name,
          "projectUsers": projectUsers,
          "projectTec": projectTec,
          "general" : this.project.general,
        })
        .then(res => {
          if (res.data.code === 0)
            this.$message("操作成功")
          else this.$message.error("操作失败，请重试")
        })
        .catch(res => (console.log(res)));
    },
    "updVolume"() {
      let tec = this.volume.tec;
      if (typeof tec === "string") {
        tec = null
      }
      let designer = this.volume.designer;
      if (typeof designer === "string") {
        designer = null;
      }
      let checker = this.volume.checker;
      if (typeof checker === "string") {
        checker = null;
      }
      this.$axios
        .post(this.$baseUrl + 'volume/upd', {
          "id": this.volume.id,
          "number": this.volume.number,
          "name": this.volume.name,
          "grade": this.volume.grade,
          "tecId": tec,
          "plannedPublicationDate": this.volume.planned_publication_date,
          "actualPublicationDate": this.volume.actual_publication_date,
          "professionalDate": this.volume.professional_date,
          "withdrawalDate": this.volume.withdrawal_date,
          "shotDate": this.volume.shot_date,
          "completeDate": this.volume.complete_time,
          "designer": designer,
          "checker": checker
        })
        .then(res => {
          if (res.data.code === 0)
            this.$message("操作成功")
          else this.$message.error("操作失败，请重试")
        })
        .catch(res => (console.log(res)));
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
                this.general = res.data.data
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
    addVolumeMethod(){
      this.addVisible = true;
      this.$axios
        .post(this.$baseUrl + 'volume/add',{
          "pid" : this.new_pid,
          "number" : this.newVolume.number,
          "name" : this.newVolume.name,
          "grade" : this.newVolume.grade,
          "tecId" : this.newVolume.tec,
          "plannedPublicationDate" : this.newVolume.planned_publication_date,
          "professionalDate" : this.newVolume.professional_date,
          "withdrawalDate" : this.newVolume.withdrawal_date,
          "designer" : this.newVolume.designer,
          "checker" : this.newVolume.checker,
          "creator" : this.id,
        })
        .then(res => {if(res.data.code ===0)
          this.$message("操作成功")
        else this.$message.error("操作失败，请重试")})
        .catch(res => (console.log(res)));
    },
    handleAddPro(){
      this.$axios
        .post(this.$baseUrl + 'technology/queryToSelected')
        .then(res => {
          this.options = res.data.data
        })
        .catch(res => (console.log(res)));
      this.newProject = {
        volumes: [{
          number: "",
          name: '',
          grade:'',
          tec:'' ,
          designer: '',
          checker: '',
          professionalDate : '',
          withdrawalDate : '',
          plannedPublicationDate : ''
          }
        ]
      }
      this.addProject = true;
    },
    proHandler(){
      this.projectVisible = true;
      console.table(this.list)
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
