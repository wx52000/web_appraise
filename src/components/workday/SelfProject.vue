<template>
  <div>
    <el-row style="background-color: #FFF; text-align: center">
      <el-row style="text-align: center; align-content: center;">
        <el-col :span="24" style="line-height: 50px;font-size: 16px;font-weight: bold;color: #666;text-align: center ">
          个人创建项目管理
        </el-col>
      </el-row>
    </el-row>
    <el-row style="text-align: right;margin-right: 60px">
      <el-button size="mini" @click="openNewProject">新增项目申请</el-button>
    </el-row>
    <u-table use-virtual :row-height="28" border size="mini" :data="list.filter(data =>{
            return  !search || (data.number.toLowerCase().includes(search.toLowerCase())
            || data.projectName.toLowerCase().includes(search.toLowerCase()))})"
             class="u-table"
             :height="pageHeight"
             :header-cell-style="{background:'#F5F5F5'}" :cell-style="this.CellStyleOne">
      <u-table-column prop="number" sortable min-width="200px" show-overflow-tooltip label="项目编号" align="center"  >
      </u-table-column>
      <u-table-column prop="name" sortable min-width="300px" show-overflow-tooltip label="项目名称" align="center">
      </u-table-column>
      <u-table-column prop="office" sortable min-width="160px" show-overflow-tooltip label="部门" align="center">
      </u-table-column>
      <u-table-column prop="general" sortable width="100px" label="设总" align="center" style="word-break: break-all;">
      </u-table-column>
      <u-table-column prop="workday" sortable width="100px" label="发放工时" align="center" style="word-break: break-all;">
      </u-table-column>
      <u-table-column prop="type" sortable width="100px" label="类型" align="center" style="word-break: break-all;">
      </u-table-column>
      <u-table-column prop="check" sortable width="100px" label="审核状态" align="center" style="word-break: break-all;">
      </u-table-column>
      <u-table-column prop="date" sortable width="100px" label="时间" align="center">
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
              v-if="scope.row.isGeneral && scope.row.check.includes('回退')"
              @click="reApply(scope.row)">重新申报</el-button>
              <el-button
                size="mini"
                @click="openVolumeList(scope.row)">项目主页</el-button>
          </el-row>
        </template>
      </u-table-column>
    </u-table>
    <el-dialog
      v-el-drag-dialog
      title="新增项目"
      :visible.sync="newVisible"
      width="60%">
      <el-form ref="form" :model="newProject" label-width="130px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="部门">
              <el-select style="width: 100%"
                         @change="newProjectInit" value-key="id"
                         v-model="newProject.department" placeholder="请选择">
                <el-option
                  v-for="item in departmentList"
                  :key="item.id"
                  :label="item.name"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <template>
              <el-radio @change="newProjectInit" v-model="newProject.type" :label=0>有产值项目</el-radio>
              <el-radio @change="newProjectInit" v-model="newProject.type" :label=1>无产值项目</el-radio>
            </template>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="专业名称">
              <el-select ref="tec" style="width: 100%" v-model="newProject.tec"
                          placeholder="请选择" @focus="examineDep">
                <el-option
                  v-for="item in tecList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="相关专业">
              <el-input v-model="newProject.otherTec"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目名称">
              <el-input v-model="newProject.name" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项目编号" >
              <el-input v-model="newProject.number"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="newProject.type === 0">
          <el-col :span="12">
            <el-form-item label="发电总产值(万元)">
              <el-input v-model="newProject.money"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发电产值占比">
              <el-input v-model="newProject.ratio">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-if="newProject.type === 1">
          <el-col :span="12">
            <el-form-item label="申请工时数">
              <el-input v-model="newProject.workday"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" >
            <el-form-item label="外部门审核人">
              <el-select ref="otherHandler" style="width: 100%" :disabled="
              newProject.departmentId === undefined || newProject.departmentId === 1"
                         v-model="newProject.otherHandler" placeholder="请选择"
                          @focus="examineDep">
                <el-option
                  v-for="item in otherHandlerList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.username }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目阶段">
              <el-input v-model="newProject.stage"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划完成时间">
              <el-date-picker style="width: 100%"
                              v-model="newProject.plannedDate"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="工作范围">
              <el-select ref="scope"  @focus="examineDep"
                         v-model="newProject.scope"
                         multiple
                         style="width: 100%" placeholder="请选择">
                <el-option
                  v-for="item in ['设计','校审']"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注">
              <el-input v-model="newProject.note"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="本部审核人">
              <el-select ref="handler"  @focus="examineDep"
                         v-model="newProject.handlerNote" value-key="id"
                         style="width: 100%" placeholder="请选择">
                <el-option
                  v-for="item in handlerList"
                  :key="item.id"
                  :label="item.name"
                  :value="item"
                  :disabled="item.disabled === 1 ">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item size="large">
              <el-button type="primary" @click="newProjectSubmit">申报</el-button>
              <el-button @click="newVisible = false">取消</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import storage from "../../store";
import {resetRouter} from "../../router/index"

export default {
name: "SelfProject",
  data(){
    return{
      visible : false,
      manageRole : "",
      pageHeight : document.body.clientHeight-50,
      loading : false,
      newVisible : false,
      departmentList : [],
      list : [],
      search : "",
      tecList : [],
      generalList : [],
      handlerList : [],
      otherHandlerList : [],
      newProject : {
        department : "",
        type : 0,
        name : "",
        number : "",
        stage : "",
        money : "",
        ratio : "",
        otherHandler : "",
        tec : "",
        otherTec : "",
        scope : "",
        plannedDate : "",
        note : "",
        handlerNote : "",
      },
    }
  },
  mounted(){
    let menus = storage.get("menus")
    this.manageRole = menus.find(item =>{
      return item.router === "selfProject"
    });
    this.getData()
  },
  methods: {
    getData() {
      this.$axios
        .post(this.$baseUrl + 'project/queryBySelfCheck', this.newProject)
        .then(res => {
          this.list = res.data.data
        })
        .catch(res => (console.log(res)));
    },
    openVolumeList(project){
      console.log(project)
      const href = this.$router.resolve(
        {
          path: "/projectMain",
          name: "projectMain",
          query:{
            "project_id" : project.projectId
          }
        }
      )
      window.open( href.href,project.projectId)
    },
    openNewProject() {
      this.newProject = {
        department: "",
        type: 0,
        name: "",
        number: "",
        stage: "",
        money: "",
        ratio : "",
        otherHandler : "",
        tec: "",
        otherTec: "",
        scope: "",
        plannedDate: "",
        note: "",
        handler: "",
        handlerNote : "",
      };
      if (this.departmentList.length < 1) {
        this.$axios
          .post(this.$baseUrl + 'office/query', this.newProject)
          .then(res => {
            this.departmentList = res.data.data
          })
          .catch(res => (console.log(res)));
      }
      this.newVisible = true;
    },
    newProjectSubmit() {
      this.$axios
        .post(this.$baseUrl + 'project/setOtherProject', this.newProject)
        .then(res => {
          if (res.data.code === 0) {
            this.$message.success("操作成功")
            this.newVisible = false
            this.getData()

          }
        })
        .catch(res => (console.log(res)));
    },
    newProjectInit(){
      this.newProject.money = ""
      this.newProject.ratio = ""
      this.newProject.otherHandler = ""
      this.newProject.handler = ""
      this.changeDepartment()
    },
    changeDepartment() {
      if (this.newProject.department !== "") {
        this.newProject.abbreviate = this.newProject.department.abbreviate
        this.newProject.dep = this.newProject.department.name
        this.newProject.departmentId = this.newProject.department.id
      }
      this.loading = true;
      if (this.newProject.departmentId !== undefined && this.newProject.departmentId !== 1
        && this.newProject.type === 1) {
        this.$axios
          .post(this.$baseUrl + 'otherUser/queryUserByOffice',
            {}, {headers: {id: this.newProject.departmentId}})
          .then(res => {
            this.otherHandlerList = res.data.data
            this.loading = false;
          })
          .catch(res => (console.log(res)));
      }
      this.tecList = [];
        if (this.manageRole) {
          this.$axios
            .post(this.$baseUrl + 'technology/queryByUserId', this.newProject, {headers: {id: ""}})
            .then(res => {
              this.tecList = res.data.data;
              this.tecList.push({did: null, id: 999, list: null, name: "综合"})
            })
            .catch(res => (console.log(res)));
        }else {
          this.tecList.push({did: null, id: 999, list: null, name: "综合"})
        }
        this.handlerList = [];
        if(this.newProject.type === 1 && this.newProject.departmentId === 1) {
          this.$axios
            .post(this.$baseUrl + 'department/queryCheckerAndDep', {}, {headers: {type: 1}})
            .then(res => {
              this.handlerList = res.data.data
              if(this.newProject.handler !== undefined) {
                this.handlerList.forEach(item => {
                  if (item.id === this.newProject.handler) {
                    this.newProject.handlerNote = item
                  }
                })
              }
            })
            .catch(res => console.log(res))
        }else {
          this.$axios
            .post(this.$baseUrl + 'project/getCheckerList', {}, {headers: {type: 1}})
            .then(res => {
              this.handlerList = res.data.data
              if(this.newProject.handler !== undefined) {
                this.handlerList.forEach(item => {
                  if (item.id === this.newProject.handler) {
                    this.newProject.handlerNote = item
                  }
                })
              }
            })
            .catch(res => console.log(res))
        }
    },
    reApply(row){
      this.$axios
        .post(this.$baseUrl + 'project/querySelfPbyId', {
          id : row.id,
          typeTab : row.typeTab
        }, )
        .then(res => {
          this.newProject = res.data.data
          this.newVisible = true
          console.log(this.newProject)
          if (this.departmentList.length < 1) {
            this.$axios
              .post(this.$baseUrl + 'office/query', this.newProject)
              .then(res => {
                this.departmentList = res.data.data
                this.departmentList.forEach( item =>{
                  if (item.id === this.newProject.departmentId){
                    this.newProject.department = item
                    this.changeDepartment()
                  }
                })
              })
              .catch(res => (console.log(res)));
          }else {
            this.departmentList.forEach( item => {
              if (item.id === this.newProject.departmentId) {
                this.newProject.department = item
                this.changeDepartment()
              }
            })
          }
        })
        .catch(res => console.log(res))
    },
    examineDep(event){
      if (this.newProject.departmentId === undefined){
        this.$message.warning("请先选择部门")
        this.$refs.tec.blur()
        this.$refs.handler.blur()
      }
    },
    filterHandler({value, row, column}) {
      const property = column['property'];
      return row[property] === value;
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
    remoteMethod(query) {
      if (query !== '') {
        this.nameLoading = true;
        setTimeout(() => {
          this.$axios
            .post(this.$baseUrl + 'user/queryByUserIdSameDep', {},
              {headers: {name: query}}
            )
            .then(res => {
              if (res.data.data != null) {
                this.generalList = res.data.data
              }
            });
          this.nameLoading = false;
        }, 200);
      } else {
        this.nameList = [];
      }
    },
  }
}
</script>

<style scoped>

</style>
