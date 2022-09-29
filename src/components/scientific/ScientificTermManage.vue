<template>
<div>
  <el-row style="margin: 5px 0 5px 0">
    <el-col :span="12">
    <el-input v-model="search"
              size="mini" style="width: 50%;" placeholder="项名\负责人"></el-input>
    </el-col>
    <el-col :span="12">
      <el-button size="mini" @click="getLeader" v-if="$parent.scientific.generalRole">负责人管理</el-button>
      <el-button size="mini" @click="openTerm" v-if="$parent.scientific.generalRole">工时发放</el-button>
      <el-button size="mini" @click="openApply" v-if="$parent.scientific.principalRole">工时申请</el-button>
    </el-col>
  </el-row>
  <el-row>
    <ux-grid use-virtual
             :max-height=pageHeight
             border :data="list.filter((data) =>{
              return !search
              || (data.name !== undefined && data.name.toLowerCase().includes(search.toLowerCase()))
              || (data.leader !== undefined && data.leader.toLowerCase().includes(search.toLowerCase()))})" style="margin-top: 5px"
             size="mini"
             :default-sort = "{prop: 'date', order: 'descending'}">
      <ux-table-column
        type="index"
        width="50">
      </ux-table-column>
      <ux-table-column field="name" title="项名称\事由"  min-width="150px" sortable align="center">
      </ux-table-column>
      <ux-table-column field="workday" title="工时"  min-width="80px" sortable align="center">
      </ux-table-column>
      <ux-table-column field="plan_workday" title="申请工时"  min-width="80px" sortable align="center">
      </ux-table-column>
      <ux-table-column field="plan_complete_date" title="计划完成时间"  min-width="100px" sortable align="center">
      </ux-table-column>
      <ux-table-column field="complete_date" title="完成时间"  min-width="100px" sortable align="center">
      </ux-table-column>
      <ux-table-column field="leaderName" title="负责人"  min-width="100px" sortable align="center">
      </ux-table-column>
      <ux-table-column field="creatorName" title="创建人"  min-width="100px" sortable align="center">
      </ux-table-column>
      <ux-table-column  title="审核状态"  min-width="100px" sortable align="center">
        <template slot-scope="scope">
          <span>{{scope.row | checkFilter}}</span>
        </template>
      </ux-table-column>
      <ux-table-column title="操作"  min-width="180px" align="center">
        <template slot-scope="scope">
          <el-row>
            <el-button size="mini" @click="openTermFiles(scope.row)">附件列表</el-button>
            <el-button v-if="scope.row.principal && (scope.row.apply === 0 ||scope.row.check !== 0)" size="mini" @click="openCheck(scope.row)">发送审核</el-button>
          </el-row>
        </template>
      </ux-table-column>
    </ux-grid>
  </el-row>
    <el-dialog
      v-el-drag-dialog
      title="负责人管理"
      :visible.sync="leaderVisible"
      width="30%">
      <el-form size="mini">
        <el-row v-for="(item,index) in leaderList" :key="index" style="white-space: normal">
          <el-col :span="21">
            <el-form-item label="负责人" value-key="id" label-width="60px">
              <el-select size="mini" v-model="item.name" style="width: 80%;"
                         :filterable="true"  :remote="true"
                         :remote-method="(e) => remoteMethod(e,index)"
                         @change="setLeader(item)"
                         placeholder="请输入人员姓名或工号">
                <el-option
                  v-for="(i) in selectList"
                  :key="i.id"
                  :label="i.name"
                  :value="i.id">
                  <span style="float: left">{{ i.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ i.username }}</span>
                </el-option></el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
          <el-button size="mini" v-if="!item.state" circle icon="el-icon-remove-outline" @click="delLeader(index,item)"/>
          </el-col>
        </el-row>
        <el-divider content-position="center">
          <el-button  type="text" @click="addLeader()">点此添加负责人</el-button></el-divider>
      </el-form>
    </el-dialog>
    <el-dialog
      v-el-drag-dialog
      title="工时发放"
      :visible.sync="termVisible"
      width="60%">
      <el-form size="mini" label-width="100px">
        <el-row>
          <el-col :span="12">
        <el-form-item label="发放事由" >
          <el-input v-model="term.name" size="mini">
          </el-input>
        </el-form-item>
          </el-col>
          <el-col :span="12">
              <el-form-item label="负责人" >
                <el-select size="mini" v-model="term.leader">
                  <el-option
                    v-for="(i) in leaderList"
                    :key="i.id"
                    :label="i.name"
                    :value="i.id">
                  </el-option></el-select>
              </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="剩余工时" >
              <el-input v-model="term.surplus" disabled size="mini">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工时数"  >
              <el-input v-model="term.workday" size="mini">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button size="mini"  @click="termVisible = false">
          取消
        </el-button>
        <el-button size="mini"  @click="setTerm">
          新增项并发放
        </el-button>
      </el-form>
    </el-dialog>
    <el-dialog
      v-el-drag-dialog
      title="工时申请"
      :visible.sync="applyVisible"
      width="60%">
      <el-form size="mini" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="成果子项内容" >
              <el-input v-model="apply.name" size="mini">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划完成时间" >
              <el-date-picker
                v-model="apply.plan_date"
              type="date"
              style="width: 100%"
              placeholder="选择日期"
              value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="附件"  >
            <el-upload
              ref="upload"
              :headers="headers"
              :action="this.$baseUrl + 'scientificLeader/uploadFile'"
              :data = "{ id : apply.id, projectId : projectId}"
              :auto-upload="false"
              multiple>
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工时数"  >
              <el-input v-model="apply.plan_workday" size="mini">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-button size="mini"  @click="applyVisible = false">
          取消
        </el-button>
        <el-button size="mini"  @click="setApply(0)">
          新增项
        </el-button>
        <el-button size="mini"  @click="setApply(1)">
          新增项并申请
        </el-button>
      </el-form>
    </el-dialog>
  <el-dialog
    title="发送审核"
    :visible.sync="checkVisible"
    width="40%">
    <el-form size="mini" label-width="100px">
      <el-row>
          <el-form-item label="新增附件"  >
            <el-upload
              ref="fileUpload"
              drag
              :headers="headers"
              :action="this.$baseUrl + 'scientificLeader/uploadFile'"
              :data = "{ id : fileMap.termId, projectId : projectId}"
              :auto-upload="false"
              multiple>
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </el-upload>
          </el-form-item>
      </el-row>
      <el-button size="mini"  @click="checkVisible = false">
        取消
      </el-button>
      <el-button size="mini"  @click="uploadFile">
        文件上传
      </el-button>
      <el-button size="mini"  @click="setToCheck">
        上传文件并发送审核
      </el-button>
    </el-form>
  </el-dialog>
  <el-dialog
    title="文件列表"
    :visible.sync="fileVisible"
    width="60%">
    <ux-grid use-virtual
             :max-height=pageHeight
             border :data="fileMap.files_list"
             size="mini"
             :default-sort = "{prop: 'date', order: 'descending'}">
      <ux-table-column
        type="index"
        align="center"
        width="50px">
      </ux-table-column>
      <ux-table-column field="name" title="项名称"  min-width="150px" sortable align="center">
      </ux-table-column>
      <ux-table-column field="upload_user" title="上传人"  min-width="80px" sortable align="center">
      </ux-table-column>
      <ux-table-column field="upload_date" title="上传时间"  min-width="80px" sortable align="center">
      </ux-table-column>
      <ux-table-column title="操作"  min-width="180px" align="center">
        <template slot-scope="scope">
          <el-row>
            <el-button size="mini" @click="downloadFile(scope.row)">下载附件</el-button>
          </el-row>
        </template>
      </ux-table-column>
    </ux-grid>
  </el-dialog>
</div>
</template>

<script>
export default {
name: "ScientificWorkdayManage",
  data(){
  return{
    pageHeight : document.body.clientHeight,
    projectId : 4122,
    list : [],
    search : "",
    leaderVisible : false,
    leaderList : [],
    selectList : [],
    termVisible : false,
    term : {
      name : "",
      leader : "",
      workday : "",
    },
    applyVisible : false,
    apply : {
      id : "",
      name : "",
      plan_workday : "",
      plan_date : "",
    },
    fileVisible : false,
    fileMap : {
      termId : "",
      files_list : []
    },
    checkVisible : false,
  }
  },
  computed: {
    headers () {
      return {
        "Authorization": this.$storage.get("Authorization")
      }
    },
  },
  filters : {
      checkFilter(row){
        if (row.check === 1){
          return  "审核通过"
        }else {
          if (row.apply === 1){
            return  "待审核"
          }else {
            return "未发送审核"
          }
        }
      }
  },
  mounted() {
    this.projectId = this.$route.query.scientific_id;
    this.getData()
  },
  methods :{
    getData(){
      this.$axios
        .post(this.$baseUrl + 'scientificLeader/queryTerm', {},{headers : {projectId : this.projectId}}
        )
        .then(res => {
          this.list = res.data.data
        });
    },
    openTermFiles(row){
      this.$axios
        .post(this.$baseUrl + 'scientificLeader/queryFilesByTerm', {},
          {headers : {id : row.id}})
        .then(res => {
          if (res.data.code === 0) {
            // if (res.data.data !== undefined && res.data.data.length > 0) {
              this.fileMap.files_list = res.data.data
              this.fileMap.termId = row.id
              this.fileVisible = true
            // }else {
            //   this.$message.warning("暂无附件")
            // }
          }
        });
    },
    openCheck(row){
      this.fileMap.termId = row.id
      this.fileMap.row = row
      this.checkVisible = true
    },
    uploadFile(){
      this.$nextTick(() => {
        this.$refs.fileUpload.submit();
        this.checkVisible = false
      })
    },
    setToCheck(){
      this.$axios
        .post(this.$baseUrl + 'scientificLeader/setToCheck', {},
          {headers : {id : this.fileMap.termId}}
        )
        .then(res => {
          if (res.data.code === 0) {
            this.$message.success("操作成功")
            this.fileMap.row.apply = 1
            this.checkVisible = false
            this.$nextTick(() => {
              this.$refs.fileUpload.submit();
            })
          }
        });
    },
    openApply(){
      this.apply = {
        name : "",
        plan_workday : "",
        plan_date : "",
      }
      this.applyVisible = true
      this.$nextTick(() => {
        this.$refs.upload.clearFiles();
      })
    },
    setApply(val){
      this.$axios
        .post(this.$baseUrl + 'scientificLeader/addTermByLeader', {
            projectId: this.projectId,
            name: this.apply.name,
            plan_workday: this.apply.plan_workday,
            plan_complete_date : this.apply.plan_date,
            apply : val
          }
        )
        .then(res => {
          if (res.data.code === 0) {
            this.$message.success("操作成功")
            this.$set(this.apply,"id",res.data.data.id);
            this.$nextTick(() => {
              this.$refs.upload.submit();
            })
            this.applyVisible = false
          }
        });
    },
    openTerm(){
      this.term = {
        name : "",
        leader : "",
        workday : "",
      }
      this.$axios
        .post(this.$baseUrl + 'scientificLeader/querySurplus', {}, {headers :{ id : this.projectId}}
        )
        .then(res => {
          this.term.surplus = res.data.data
          this.$forceUpdate()
        });
      this.$axios
        .post(this.$baseUrl + 'scientificLeader/queryLeader', {}, {headers :{ id : this.projectId}}
        )
        .then(res => {
          this.leaderList = res.data.data
          this.termVisible = true
        });
    },
    setTerm(){
      if (this.term.workday > this.term.surplus){
        return this.$message.warning("工时数超出")
      }
      this.$axios
        .post(this.$baseUrl + 'scientificLeader/addTermByGeneral', {
            projectId: this.projectId,
            name: this.term.name,
            id  : this.term.leader,
            workday: this.term.workday,
          }
        )
        .then(res => {
          if (res.data.code === 0) {
            this.$message.success("操作成功")
            this.termVisible = false
          }
        });
    },
    getLeader(){
      this.leaderList = [];
      this.$axios
        .post(this.$baseUrl + 'scientificLeader/queryLeader', {}, {headers :{ id : this.projectId}}
        )
        .then(res => {
          this.leaderList = res.data.data
          this.leaderVisible = true
        });
    },
    setLeader(item){
      this.$axios
        .post(this.$baseUrl + 'scientificLeader/setLeader', {
          id : item.id,
          projectId: this.projectId,
          leader: item.name
          }
        )
        .then(res => {
          this.$message.success("操作成功")
          item.id = res.data.data.id
        });
    },
    addLeader(){
      this.leaderList.push({name : ""})
    },
    delLeader(index,item){
      this.$axios
        .post(this.$baseUrl + 'scientificLeader/delLeader', {}, {headers :{ id : item.id}}
        )
        .then(res => {
          this.$message.success("操作成功")
          this.leaderList.splice(index,1)
        });
    },
    remoteMethod(query,index) {
      this.selectList = [];
      if (query !== '') {
        setTimeout(() => {
          this.$axios
            .post(this.$baseUrl + 'user/queryByName', {
                "name" : query
              }
            )
            .then(res => {
              this.selectList = res.data.data
            });
        }, 200);
      } else {
        this.nameList = [];
      }
    },
    downloadFile(row){
      this.$message.success("即将开始下载");
      this.$axios.post(this.$baseUrl + 'scientificLeader/downFiles',{
        id : row.id},{responseType: 'blob'}).then(res => {
        let {data, headers} = res
        const fileName = headers['content-disposition'].replace(/\w+;filename=(.*)/, '$1')
        let blob = new Blob([data], {type: headers['content-type']})
        let a = document.createElement("a")
        let url = window.URL.createObjectURL(blob)
        a.href = url
        a.download = decodeURI(fileName)  // 文件名
        a.click()
        window.URL.revokeObjectURL(url)
      })
        .catch(res => {
          console.log(res);
        });// token键值对
    }
  }
}
</script>

<style scoped>

</style>
