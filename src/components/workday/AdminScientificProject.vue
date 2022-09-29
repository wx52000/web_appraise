<template>
  <div>
    <el-form >
      <el-row>
        <!-- 列表 -->
        <el-row style="background-color: #FFF; text-align: center">
          <el-row>
            <el-row style="margin-left:-10px;text-align: center; align-content: center;">
              <el-col :span="24" style="line-height: 50px;font-size: 16px;font-weight: bold;color: #666;text-align: center ">
                项目管理
                <i class="el-icon-document-copy" @click="openExcel()"></i>
              </el-col>
            </el-row>
            <el-row style="margin-left:-10px; align-content: center;">
                      <el-button style="margin-right: 20px" size="mini" type="primary" v-permission="'project:add'" @click="openNewProject">新增项目</el-button>
            </el-row>
            <div>
            <u-table use-virtual :row-height="28" border size="mini" :data="list.filter(data =>{
            return  !search || (data.number.toLowerCase().includes(search.toLowerCase())
            || data.projectName.toLowerCase().includes(search.toLowerCase())
             || data.general.toLowerCase().includes(search.toLowerCase())
              || data.state === search) })"
                     class="u-table" :row-class-name="tableRowClassName"
                     :row-style="projectError"
                     :height="pageHeight"
                     showBodyOverflow="title"
                     showHeaderOverflow="title"
                     :data-changes-scroll-top="false"
                     show-summary
                     :summary-method="arraySpanMethod"
                     :header-cell-style="{background:'#F5F5F5'}" :cell-style="this.CellStyleOne">
              <u-table-column
                type="index"
                align="center"
                width="50">
              </u-table-column>
              <u-table-column prop="number" sortable min-width="120px" show-overflow-tooltip label="项目编号" align="center"  >
              </u-table-column>
              <u-table-column prop="projectName" sortable min-width="210px" show-overflow-tooltip label="项目名称" align="center">
                <template slot-scope="scope" >
                  <el-button type="text" @click="getChildren(scope.row)"
                             v-if="scope.row.type === 2" size="mini">{{scope.row.projectName}}</el-button>
                  <span v-else>{{scope.row.projectName}}</span>
                </template>
              </u-table-column>
              <u-table-column prop="workday" sortable width="70px" label="总工时"  align="center">
              </u-table-column>
              <u-table-column prop="used" sortable width="80px" label="已用工时"  align="center">
              </u-table-column>
              <u-table-column prop="have" sortable width="80px" label="可用工时"  align="center">
              </u-table-column>
              <u-table-column prop="general" sortable width="80px" label="设总" align="center" style="word-break: break-all;">
              </u-table-column>
              <u-table-column  width="180px" align="center" fixed="right">
                <template slot-scope="scope" slot="header">
                  <el-input  size="mini" v-model="search"
                             placeholder="请输入需要查询的项目编号或项目名称" />
                </template>
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
                    @click="openProject(scope.row)" v-permission="'project_update'">修改</el-button>
                    </el-col>
                  </el-row>
                </template>
              </u-table-column>
            </u-table>
            </div>
          </el-row>
        </el-row>
      </el-row>
    </el-form>
    <el-dialog
        v-el-drag-dialog
      title="项目管理"
      :visible.sync="projectVisible"
      width="90%"
    >
      <u-table use-virtual :row-height="28" border size="mini" :data="completeList.filter(data =>{
            return  !search1 || (data.number.toLowerCase().includes(search1.toLowerCase())
            || data.projectName.toLowerCase().includes(search.toLowerCase()))})"
               class="u-table" :row-class-name="tableRowClassName"
               :row-style="projectError"
               :height="pageHeight"
               show-summary
               :summary-method="arraySpanMethod"
               :header-cell-style="{background:'#F5F5F5'}" :cell-style="this.CellStyleOne">
      <u-table-column prop="number" sortable width="200px" show-overflow-tooltip label="项目编号" align="center"  >
      </u-table-column>
      <u-table-column prop="projectName" sortable width="260px" show-overflow-tooltip label="项目名称" align="center">
      </u-table-column>
      <u-table-column prop="workday" sortable width="100px" label="总工时"  align="center">
      </u-table-column>
      <u-table-column prop="used" sortable width="100px" label="已用工时"  align="center">
      </u-table-column>
      <u-table-column prop="have" sortable width="100px" label="可用工时"  align="center">
      </u-table-column>
      <u-table-column prop="general" sortable width="100px" label="设总" align="center" style="word-break: break-all;">
      </u-table-column>
      <u-table-column prop="state" sortable width="100px" label="状态" align="center">
      </u-table-column>
      <u-table-column  width="200px" align="center" fixed="right">
        <template slot-scope="scope" slot="header">
          <el-input  size="mini" v-model="search"
                     placeholder="请输入需要查询的项目编号或项目名称" />
        </template>
        <template slot-scope="scope">
          <el-row>
              <el-button
                size="mini"
                @click="openVolumeList(scope.row)">项目主页</el-button>
          </el-row>
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
            <el-input size="mini" v-model="form.number" style="width: 100%">
            </el-input>
          </el-form-item >
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="120px" label="项目名称">
            <el-input size="mini" v-model="form.name">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="margin-right: 50px">
        <el-col :span="12">
          <el-form-item label-width="120px" label="设总">
            <el-select v-model="form.general" size="mini"
                       :filterable="true"  :remote="true"
                       :remote-method="(e) => remoteMethod(e,form)"
                       @change="(e) => selectGeneral(e,form)"
                       value-key="id"
                       style="width: 100%"
                       :loading="nameLoading"
                       placeholder="请输入人员姓名或工号">
              <el-option
                v-for="(item,index) in form.generalList"
                :key="item.id"
                :label="item.name"
                :value="item">
                <span style="float: left">{{ item.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.username }}</span>
              </el-option></el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="120px" label="工时总数" size="mini">
            <el-input v-model="form.workday" oninput="value=value.replace(/[^\d.]/g,'')">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="10">
        <el-form-item>
          <el-switch
            v-model="form.spider"
            active-text="关联"
            inactive-text="不关联"
            :active-value = "0"
            :inactive-value= "1" >
          </el-switch>
        </el-form-item>
        </el-col>
        <el-col :span="12">
        <el-form-item style="margin-left: -50px;text-align: center">
          <el-button @click="closeDialog" size="mini">取消</el-button>
          <el-button @click="dialogSubmit" size="mini" type="primary">确认</el-button>
        </el-form-item>
        </el-col>
      </el-row>
    </el-row>
  </el-form>
</el-dialog>
    <el-dialog
      v-el-drag-dialog
      title="修改项目"
      :visible.sync="updateVisible"
      width="60%" style="text-align: center"
      >
      <el-form :model="project" >
        <el-row>
          <el-row style="margin-right: 50px">
            <el-col :span="12">
              <el-form-item label-width="120px" label="项目编号">
                <el-input size="mini" v-model="project.number" style="width: 100%">
                </el-input>
              </el-form-item >
            </el-col>
            <el-col :span="12">
              <el-form-item label-width="120px" label="项目名称">
                <el-input size="mini" v-model="project.name">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="margin-right: 50px">
            <el-col :span="12">
              <el-form-item label-width="120px" label="设总">
                <el-select v-model="project.general" size="mini"
                           :filterable="true"  :remote="true"
                           :remote-method="(e) => remoteMethod(e,project)"
                           value-key="id"
                           style="width: 100%"
                           :loading="nameLoading"
                           @change="(e) => selectGeneral(e,form)"
                           placeholder="请输入人员姓名或工号">
                  <el-option
                    v-for="(item,index) in project.generalList"
                    :key="item.name"
                    :label="item.name"
                    :value="item">
                    <span style="float: left">{{ item.name }}</span>
                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.username }}</span>
                  </el-option></el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label-width="120px" label="工时总数" size="mini">
                <el-input v-model="project.workday" :disabled="project.workdayState !== 0" oninput="value=value.replace(/[^\d.]/g,'')">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="10">
              <el-form-item>
                <el-switch
                  v-model="project.spider"
                  active-text="关联"
                  inactive-text="不关联"
                  :active-value = "0"
                  :inactive-value = "1">
                </el-switch>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item style="margin-left: -50px;text-align: center">
                <el-button @click="renewError"
                           style="color: #13ce66;border-color: #13ce66" size="mini" circle icon="el-icon-refresh"></el-button>
                <el-button @click="closeUpdateDialog" size="mini">取消</el-button>
                <el-button @click="updateSubmit" size="mini" type="primary">确认</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import storage from "../../store";

export default {
  "name": "AdminScientificProject",
  "data"() {
    return {
      getRowKeys(row) {
        return row.id;
      },
      pageHeight : document.body.scrollHeight,
      // 要展开的行，数值的元素是row的key值
      expands: [],
      id: "",
      search : "",
      search1 : "",
      list: [],
      completeList :[],
      loading : false,
      nameLoading : null,
      volume: {},
      childrenVisible : false,
      children : [],
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
      declareDay : null,
      excelDialog : false,
      downMonth : "",
      volumeMonth:new Date().getMonth()+1,
      nowWeek : "",
      visible : false,
      form : {
        number : "",
        name : "",
        workday : "",
        general : [],
        spider : 0,
      },
      updateVisible : false,
      project: {
        number : "",
        name : "",
        workday : "",
        general : [],
        spider : 0,
      },
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
    remoteMethod(query,data) {
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
                data.generalList = res.data.data
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
      this.visible = true;
    },
    dialogSubmit(){
      if (this.form.general === null || this.form.general === ''){
        return this.$message.warning("请选择设总")
      }
      this.$axios
        .post(this.$baseUrl + 'project/setProject',{
          number : this.form.number,
          name : this.form.name,
          general  : this.form.general.name,
          generalId  : this.form.generalId,
          workday : this.form.workday,
          spider : this.form.spider,
        })
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
    openProject(row){
      this.project = {
        id : row.id,
        number : row.number,
        name : row.projectName,
        workday : row.workday,
        workdayState : row.workdayState,
        general : row.general,
        generalId : row.generalId,
        spider : row.spider,
        generalList : [],
      }
      this.updateVisible = true;
    },
    selectGeneral(v,data){
      data.generalId = v.id
    },
    updateSubmit(){
      if (this.form.general === null || this.form.general === ''){
        return this.$message.warning("请选择设总")
      }
      this.$axios
        .post(this.$baseUrl + 'project/renewProject',{
          project_id : this.project.id,
          number : this.project.number,
          name : this.project.name,
          general  : this.project.general.name,
          generalId  : this.project.generalId,
          num : this.project.workday,
          spider : this.project.spider,
      })
        .then(res => {
          if (res.data.code === 0){
            this.$message.success("操作成功")
            this.closeUpdateDialog();
          }
        })
        .catch(res => (console.log(res.data)))
    },
    closeUpdateDialog(){
      this.updateVisible = false;
      // this.getData()
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
    // openVolume(p){
    //   window.open('http://zmis.zepdi.com.cn/Portal/EPMS/List/RollInfo/RollEntityBill.aspx?' +
    //     'OrganizationId=' + p + '&secid=00000000-0000-0000-0000-000000000000&IsPortal=True')
    // },
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
    arraySpanMethod({  columns, data }) {
      const means = [] // 合计
      columns.forEach((column, columnIndex) => {
        if (columnIndex === 0) {
          means.push('合计')
        } else {
          const values = data.map(item => Number(item[column.property]));
          // 合计
          if (!values.every(value => isNaN(value))) {
            means[columnIndex] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return (prev * 100 + curr * 100)/100;
              } else {
                return prev;
              }
            }, 0);
            // 改变了ele的合计方式，扩展了合计场景
            // 你以为就只有上面这样玩吗？错啦，你还可以自定义样式哦
            // means[columnIndex] = '<span style="color: red">' + means[columnIndex] + '元</span>'
            means[columnIndex] = means[columnIndex].toFixed(2)
          } else {
            means[columnIndex] = '';
          }
        }
      })
      // 返回一个二维数组的表尾合计(不要平均值，你就不要在数组中添加)
      return [means]
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
