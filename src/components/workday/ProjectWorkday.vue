<template xmlns:el-="http://www.w3.org/1999/html">
  <div align="center" style="width: 80%;margin-left: 10%">
    <el-row align="center" style="text-align: center;margin-top: 1%">
      <el-col :span="20" ><span style="font-size: 18px;margin-left: 150px">项目工时分配</span>
        <span style="font-size: 12px;">-{{form.check | checkFilter}}</span></el-col>
      <el-button @click="openNewForm" size="mini" style="float: right"> 额外工时申请</el-button>
    </el-row>
  <el-form ref="form" :model="form" style="width:70%;margin-top: 1%">
    <el-form-item label="项目名称" label-width="100px">
      <el-input v-model="$parent.project.name" disabled></el-input>
    </el-form-item>
    <el-form-item label="项目编号" style="white-space:nowrap" label-width="100px">
      <el-input v-model="$parent.project.number" disabled></el-input>
    </el-form-item>
    <el-form-item label="项目总工时" style="white-space:nowrap" label-width="100px">
      <el-input label="项目总工时" :disabled="numDisabled"  v-model="form.num" oninput="value=value.replace(/[^\d.]/g,'')"
                type="text" placeholder="请输入工时数量">
      </el-input>
    </el-form-item>
    <el-form-item label="总备用工时"  style="white-space:nowrap" label-width="100px">
      <el-input label="总备用工时" disabled v-model="form.backup" oninput="value=value.replace(/[^\d.]/g,'')"
                type="text" placeholder="请输入工时数量">
      </el-input>
    </el-form-item>
    <el-form-item label="总管理工时" style="white-space:nowrap" label-width="100px">
      <el-input label="总管理工时" :disabled="disabled"  v-model="form.manage" oninput="value=value.replace(/[^\d.]/g,'')"
                type="text" placeholder="请输入工时数量">
      </el-input>
    </el-form-item>
    <el-row>
            <el-col :span="11" align="center">
    <el-form-item label="总专业工时" label-width="100px">
      <el-input label="总专业工时" :disabled="disabled" v-model="form.tec" oninput="value=value.replace(/[^\d.]/g,'')"
                type="text" placeholder="请输入工时数量">
      </el-input>
          </el-form-item>
            </el-col>
      <el-col :span="12" align="center">
                <el-form-item label="可用专业工时"
                              style="white-space:nowrap;width: 60%" label-width="120">
                  <el-input :value.trim = "usableAmount" class="remarks" style="text-align: center;" disabled/>
                </el-form-item>
              </el-col>
    </el-row>
     <el-row  >
            </el-row>
            <el-row v-for="(item,index) in form.tecWorkday" :key="index">
              <el-col :span="6">
                <el-form-item label="专业" style="white-space:nowrap" label-width="60px">
                    <el-select size="mini" v-model="item.name" :disabled="item.type === 1"  @change="upd(scope.row)">
                                <el-option
                                  v-for="item in technologyList"
                                  :key="item.id"
                                  :label="item.name"
                                  :value="item.name">
                                </el-option>
                              </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5" v-if="item.type === 0">
                <el-form-item label="主设人" value-key="id" label-width="60px">
                  <el-select size="mini" v-model="item.principal" style="width: 100%;"
                            :filterable="true"  :remote="true"
                            :remote-method="(e) => remoteMethod(e,index,form)"
                            value-key="id"
                            placeholder="请输入人员姓名或工号">
                    <el-option
                      v-for="(item,index) in item.principalList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option></el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="比例"
                              label-width="60px" style="text-align: center">
                  <el-input v-model="item.ratio" size="mini" oninput="value=value.replace(/[^\d.]/g,'')"
                            type="text" placeholder="请输入工时百分比"
                            style="width: 60px"
                            @input="RatioHandle(item,form)">
                  </el-input>%
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="工时数" style="white-space:nowrap;width: 80px">
                  <el-input v-model="item.workday" size="mini" oninput="value=value.replace(/[^\d.]/g,'')"
                            type="text"
                            style="width: 60px"
                            @input="AmountHandle(item,form)">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="2" v-if="item.type === 0">
              <el-button style="margin-top : 8px" size="mini" circle icon="el-icon-remove-outline" @click="delTecWorkday(index)"/>
              </el-col>
            </el-row>
                <el-divider content-position="center">
                  <el-button  type="text" @click="addTecWorkday()">专业缺少，点此添加</el-button></el-divider>
    <el-form-item v-if="!disabled">
      审核人
      <el-select v-model="form.checkerId" placeholder="请选择" style="width: 100px" size="mini"
                 @change="selectChecker">
        <el-option
          v-for="item in checkerList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
      <el-button  @click="onSubmit(4)" >保存</el-button>
      <el-button type="primary" @click="onSubmit(0)">报审</el-button>
      <el-button @click="reset()">重置</el-button>
    </el-form-item>
  </el-form>
    <el-dialog
      v-el-drag-dialog
      :visible.sync="visible"
    width="80%">
      申请记录选择:<el-select v-model="newForm.addId" placeholder="请选择" size="mini">
        <el-option
          v-for="item in applyList"
          :key="item.id"
          :label="item.date"
          :value="item.id">
          <span style="float: left">{{ item.date }}</span>
          <span style="float: right; color: #8492a6; font-size: 13px">{{ item.check | checkFilter }}</span>
        </el-option>
      </el-select>
      <el-button style="margin-left: 10%"  @click="selectAddId" type="primary" size="mini"> 确认 </el-button>
      <el-form ref="form" :model="newForm" style="width:70%;margin-top: 1%">
        <el-form-item label="申请总工时" style="white-space:nowrap" label-width="100px">
          <el-input  :disabled="newForm.check === 1" v-model="newForm.num" oninput="value=value.replace(/[^\d.]/g,'')"
                    type="text" placeholder="请输入工时数量">
          </el-input>
        </el-form-item>
        <el-form-item label="备用工时"  style="white-space:nowrap" label-width="100px">
          <el-input  label="备用工时" disabled v-model="newForm.backup" oninput="value=value.replace(/[^\d.]/g,'')"
                    type="text" placeholder="请输入工时数量">
          </el-input>
        </el-form-item>
        <el-form-item label="管理工时" style="white-space:nowrap" label-width="100px">
          <el-input  label="设总管理工时" :disabled="newForm.check === 1"  v-model="newForm.manage" oninput="value=value.replace(/[^\d.]/g,'')"
                    type="text" placeholder="请输入工时数量">
          </el-input>
        </el-form-item>
        <el-row>
          <el-col :span="11" align="center">
            <el-form-item label="专业工时" label-width="100px">
              <el-input label="专业工时" :disabled="newForm.check === 1" v-model="newForm.tec" oninput="value=value.replace(/[^\d.]/g,'')"
                        type="text" placeholder="请输入工时数量">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" align="center">
            <el-form-item label="可用专业工时"
                          style="white-space:nowrap;width: 60%" label-width="120">
              <el-input :value.trim = "usableNewAmount" class="remarks" style="text-align: center;" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row  >
        </el-row>
        <el-row v-for="(item,index) in newForm.tecWorkday" :key="index">
          <el-col :span="6">
            <el-form-item label="专业" label-width="60px">
              <el-select size="mini" v-model="item.name"  :disabled="item.type === 1 || newForm.check === 1"  @change="upd(scope.row)">
                <el-option
                  v-for="item in technologyList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5" v-if="item.type === 0">
            <el-form-item label="主设人" value-key="id" label-width="60px">
              <el-select v-model="item.principal" style="width: 100%;"
                         :filterable="true"  :remote="true"
                         size="mini" :disabled="newForm.check === 1"
                         :remote-method="(e) => remoteMethod(e,index,newForm)"
                         value-key="id"
                         placeholder="请输入人员姓名或工号">
                <el-option
                  v-for="(item,index) in item.principalList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option></el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="比例"
                          label-width="60px">
              <el-input v-model="item.ratio" size="mini" oninput="value=value.replace(/[^\d.]/g,'')"
                        type="text" placeholder="请输入工时百分比"
                        style="width: 60px" :disabled="newForm.check === 1"
                        @input="RatioHandle(item,newForm)">
              </el-input>
              %
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工时数" style="white-space:nowrap;width: 80px">
              <el-input v-model="item.workday" size="mini" oninput="value=value.replace(/[^\d.]/g,'')"
                        type="text" :disabled="newForm.check === 1"
                        style="width: 60px"
                        @input="AmountHandle(item,newForm)">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="2" v-if="item.type === 0">
            <el-button style="margin-top : 8px" :disabled="newForm.check === 1" size="mini"  circle icon="el-icon-remove-outline" @click="delTecWorkday(index)"/>
          </el-col>
        </el-row>
        <el-divider content-position="center">
          <el-button  type="text" :disabled="newForm.check === 1" @click="addNewTecWorkday()">专业缺少，点此添加</el-button></el-divider>
        <el-form-item v-if="!(newForm.check === 1)">
          审核人
          <el-select v-model="form.checkerId" placeholder="请选择" style="width: 100px" size="mini"
                     @change="selectChecker">
            <el-option
              v-for="item in checkerList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-button  @click="newOnSubmit(4)">保存</el-button>
          <el-button type="primary"  @click="newOnSubmit(0)">报审</el-button>
          <el-button @click="newReset()">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
</div>
</template>

<script>
export default {
  name: "WorkDayManage",
    data(){
    return{
      name : "",
      numDisabled : true,
      isShow : false,
      projectId : "",
      form : {
        num : 0,
        manage: 0,
        tec : 0,
        backup : 0,
        tecWorkday : []
      },
      technologyList : [],
      disabled: true,
      visible : false,
      applyList : [],
      newForm : {
        id : "",
        num : 0,
        manage: 0,
        tec : 0,
        backup : 0,
        tecWorkday : []
      },
      checkerList : [],
    }
  },
  filters:{
    checkFilter(val){
      if (val === 0){
        return "待审核"
      }
            if (val === 1){
                return "审核通过"
      }
            if (val === 2){
                return "被回退"
      }
            if (val === 4){
                return "草稿"
      }
    }
  },
  computed:{
    usableAmount(){
        return this.form.tec -  this.form.tecWorkday.reduce((prev, cur) => {
          if (cur.workday !== undefined && cur.workday !== "") {
            return Number(prev) + Number(cur.workday);
          }else return prev},0)
    },
    usableNewAmount(){
      return this.newForm.tec -  this.newForm.tecWorkday.reduce((prev, cur) => {
        if (cur.workday !== undefined && cur.workday !== "") {
          return Number(prev) + Number(cur.workday);
        }else return prev},0)
    },
  },
  watch:{
    form:{
      handler:(newVal,oldVal) =>{
        newVal.backup = newVal.num - newVal.manage - newVal.tec
      },
      deep : true
    },
    newForm:{
      handler:(newVal,oldVal) =>{
        newVal.backup = newVal.num - newVal.manage - newVal.tec
      },
      deep : true
    }
  },
  created() {
      this.$axios
        .post(this.$baseUrl + 'user/queryById'
        )
        .then(res => {
          this.name = res.data.data.name;
          if (res.data.data.pid === 1 || res.data.data.pid === 3){
            this.numDisabled = false
          }
             this.getData();
        })
        .catch(res => (console.log(res)));
    this.projectId = this.$route.query.project_id;
  },
  methods:{
    AmountHandle(item,form){
      item.ratio = Math.round(item.workday/form.tec*1000)/10
    },
    RatioHandle(item,form){
      item.workday = form.tec*(item.ratio/100)
    },
    getData(){
      this.$axios
        .post(this.$baseUrl + 'projectWorkday/queryProjectWorkday', {},
          {headers:{"id" : this.projectId}})
        .then(res => {
            this.form.num = res.data.data.num;
            this.form.backup = res.data.data.backup;
            this.form.manage = res.data.data.manage;
            this.form.tec = res.data.data.tec;
            this.form.check = res.data.data.check
          this.form.checkerId = res.data.data.checkerId
          if (this.name === res.data.data.general){
            this.disabled = false
          }
        })
        .catch(res => (console.log(res)));
      this.$axios
        .post(this.$baseUrl + 'projectWorkday/queryMajorWorkday', {},
          {headers:{"id" : this.projectId}})
        .then(res => {
          res.data.data.workday.forEach(item => {
            if (item.amount === undefined || item.amount === ''){
              item.amount = 0
            }
            this.form.tecWorkday.push({project_id : item.project_id,
              name : item.name,ratio : item.amount/this.form.tec*100 || 0,
              workday : item.amount, principal : item.principalId, type:item.type,
               principalList : [{id : item.principalId,name: item.principal}]},)
          })
          console.log(this.form)
        })
        .catch(res => (console.log(res)));
        this.$axios
        .post(this.$baseUrl + 'project/getCheckerList',{},{headers : {type : 1}})
        .then(res => {
          this.checkerList = res.data.data
        })
        .catch( res => console.log(res))
    },
    selectChecker(val){
      this.form.checkerId = val
      this.$forceUpdate();
      this.$axios
        .post(this.$baseUrl + 'project/setChecker',
          {
            id : this.projectId,
            checker : this.form.checkerId
          })
        .then(res => {
          if (res.data.code === 0){
            this.$message.success("操作成功")
          }
        })
        .catch( res => console.log(res))
    },
    onSubmit(val){
      if (this.form.checkerId === undefined){
        this.$message.error("请选择审核人")
        return  0
      }
      if (val === 0) {
        if (Number(this.usableAmount) !== 0) {
          this.$message({
            message: '专业工时需一次发完',
            type: 'error'
          });
          return  0;
        }
      }
      if (this.form.num !==  null && this.form.num !==  "") {
        this.$axios
          .post(this.$baseUrl + 'projectWorkday/setProWorkday', {
            "project_id": this.projectId,
            "num": this.form.num,
            "manage": this.form.manage,
            "tec": this.form.tec,
            "backup": this.form.backup,
            check : val,
            tecWorkday : this.form.tecWorkday
          })
          .then(res => {
            if (res.data.code === 0) {
              this.$message({
                message: '修改成功',
                type: 'success'
              });
            }
          })
          .catch(res => (console.log(res)));
      }else {
        this.$message({
          message: '总工时不能为空',
          type: 'warning'
        });
      }
    },
    newOnSubmit(val){
      if (this.form.num !==  null && this.form.num !==  "") {
        if (val === 0) {
          console.log(this.usableNewAmount)
          if (Number(this.usableNewAmount) !== 0) {
            this.$message({
              message: '专业工时需一次发完',
              type: 'error'
            });
            return  0;
          }
        }
          this.$axios
            .post(this.$baseUrl + 'projectWorkday/setNewProWorkday', {
              "addId" : this.newForm.addId,
              "project_id": this.projectId,
              "num": this.newForm.num,
              "manage": this.newForm.manage,
              "tec": this.newForm.tec,
              "backup": this.newForm.backup,
              check : val,
              tecWorkday : this.newForm.tecWorkday
            })
            .then(res => {
              if (res.data.code === 0) {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                });
                if (val === 0) {
                  this.visible = false;
                }
              }
            })
            .catch(res => (console.log(res)));
      }else {
        this.$message({
          message: '总工时不能为空',
          type: 'warning'
        });
      }
    },
    remoteMethod(query,index,form) {
      console.log(index)
      if (query !== '') {
        setTimeout(() => {
          this.$axios
            .post(this.$baseUrl + 'user/queryByName', {
                "name" : query
              }
            )
            .then(res => {
              if (res.data.data != null) {
                this.$set(form.tecWorkday[index],'principalList',res.data.data)
              }
              console.log(form.tecWorkday)
            });

        }, 200);
      } else {
        this.nameList = [];
      }
    },
    addTecWorkday(){
      this.form.tecWorkday.push({name:"",principal: "", ratio : 0,workday : 0, type : 0})
      if(this.technologyList.length === 0){
          this.$axios
      .post(this.$baseUrl + 'technology/query',{},{headers: {id : 0}})
      .then(res => {
        res.data.data.forEach(item =>{
          this.technologyList.push2(item)
        })
      })
      }
    },
    delNewTecWorkday(index){
      this.form.tecWorkday.splice(index,1)
    },
    addNewTecWorkday(){
      this.newForm.tecWorkday.push({name:"",principal: "", ratio : 0,workday : 0, type : 0})
      if(this.technologyList.length === 0){
        this.$axios
          .post(this.$baseUrl + 'technology/query',{},{headers: {id : 0}})
          .then(res => {
            res.data.data.forEach(item =>{
              this.technologyList.push2(item)
            })
          })
      }
    },
    delTecWorkday(index){
      this.newForm.tecWorkday.splice(index,1)
    },

    reset(){
      this.getData();
    },
    openNewForm(){
      this.newForm = {
        addId : null,
        id : "",
        num : 0,
        manage: 0,
        tec : 0,
        backup : 0,
        tecWorkday : []
      };
      this.$axios
        .post(this.$baseUrl + 'projectWorkday/queryNewWorkday',{},{headers: {id : this.projectId}})
        .then(res => {
          this.applyList = res.data.data;
          this.visible = true;
        })
      .catch(res => console.log(res))
      this.$axios
        .post(this.$baseUrl + 'projectWorkday/queryMajorWorkday', {},
          {headers:{"id" : this.projectId}})
        .then(res => {
          res.data.data.workday.forEach(item => {
            if (item.amount === undefined || item.amount === ''){
              item.amount = 0
            }
            this.newForm.tecWorkday.push({project_id : item.project_id,
              name : item.name,ratio :  0,
              workday : 0, principal : item.principalId, type:item.type,
              principalList : [{id : item.principalId,name: item.principal}]},)
          })
          console.log(this.form)
        })
        .catch(res => (console.log(res)));
    },
    selectAddId(){
      if (this.newForm.addId != null) {
        this.$axios
          .post(this.$baseUrl + 'projectWorkday/queryNewWorkdayByAddId', {},
            {headers: {"id": this.newForm.addId}})
          .then(res => {
            this.newForm.num = res.data.data.num;
            this.newForm.backup = res.data.data.backup;
            this.newForm.manage = res.data.data.manage;
            this.newForm.tec = res.data.data.tec;
            this.newForm.check = res.data.data.check;
            this.newForm.tecWorkday = [];
            res.data.data.list.forEach(item => {
              if (item.amount === undefined || item.amount === ''){
                item.amount = 0
              }
              this.newForm.tecWorkday.push({project_id : item.project_id,
                name : item.name,ratio : item.workday/this.newForm.tec*100 || 0,
                workday : item.workday, principal : item.principalId, type:item.type,
                principalList : [{id : item.principalId,name: item.principal}]},)
            })
            if (this.name === res.data.data.general) {
              this.disabled = false
            }
          })
          .catch(res => (console.log(res)));
      }
    },
    newReset(){
      this.newForm = {
        addId : null,
        id : "",
          num : 0,
          manage: 0,
          tec : 0,
          backup : 0,
          tecWorkday : []
      }
    }
  }
}
</script>

<style scoped>
.el-input.is-disabled /deep/ .el-input__inner {
  background-color: white;
  color: #000000;
}
</style>
