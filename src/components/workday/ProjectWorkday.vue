<template xmlns:el-="http://www.w3.org/1999/html">
  <div align="center" style="width: 90%;margin-left: 5%">
    <el-row align="center" style="text-align: center;margin-top: 1%">
      <span style="float: left;position: relative; margin-left: 30%">
      <span style="font-size: 18px;margin-left: 150px">初始工时分配</span>
        <span style="font-size: 12px;">-{{form.check | checkFilter}}</span>
      </span>
    </el-row>
    <el-row style="text-align: right">
      <el-button @click="openTecList" size="mini" style="margin-left: 10px">专业管理</el-button>
      <el-button @click="newTask" size="mini" style="margin-left: 10px">备用工时分配</el-button>
      <el-button @click="openNewForm" size="mini" style="margin-left: 10px">额外工时申请</el-button>
      <el-button @click="openDeduct" size="mini" style="margin-left: 10px">工时扣除</el-button>
    </el-row>
  <el-form ref="form" :model="form" style="margin-top: 1%">
    <div style="width:70%;">
    <el-form-item label="项目名称" label-width="100px">
      <el-input v-model="$parent.project.name" disabled></el-input>
    </el-form-item>
      <el-row>
        <el-col :span="12">
    <el-form-item label="项目编号" label-width="100px">
      <el-input v-model="$parent.project.number" disabled></el-input>
    </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同金额" label-width="100px">
            <el-input v-model="form.money" style="width: 60%">
              <template slot="append">万</template>
            </el-input>
            <el-button size="mini" v-if="!disabled" @click="setMoney">确认</el-button>
          </el-form-item>
        </el-col>

      </el-row>
    <el-form-item label="项目总工时" label-width="100px" style="text-align: left">
      <el-input label="项目总工时" :disabled="numDisabled"
                style="width: 80%;" v-model="form.num" oninput="value=value.replace(/[^\d.]/g,'')"
                type="text" placeholder="请输入工时数量">
      </el-input>
      <el-button size="mini" v-if="!this.numDisabled" :disabled="this.form.check === 1" @click="onSubmitTotal">确认</el-button>
    </el-form-item>
    <el-form-item label="总备用工时" label-width="100px" style="text-align: left">
      <el-input label="总备用工时" disabled v-model="form.backup" oninput="value=value.replace(/[^\d.]/g,'')"
                type="text" placeholder="请输入工时数量" style="width: 50%">
      </el-input><span class="text">备用工时只可发到专业，不可发到人</span>
    </el-form-item>
    <el-form-item label="总管理工时" label-width="100px" style="text-align: left">
      <el-input label="管理工时" :disabled="disabled"  v-model="form.manage" oninput="value=value.replace(/[^\d.]/g,'')"
                type="text" placeholder="请输入工时数量" style="width: 50%">
      </el-input><span class="text">管理工时只可发给设总自己，不可发给其余人</span>
    </el-form-item>
    <el-row>
            <el-col :span="8" align="center">
    <el-form-item label="总专业工时" label-width="100px">
      <el-input label="总专业工时" :disabled="disabled" v-model="form.tec" oninput="value=value.replace(/[^\d.]/g,'')"
                type="text" placeholder="请输入工时数量">
      </el-input>
          </el-form-item>
            </el-col>
      <el-col :span="8" align="center">
        <el-form-item label="已分配工时比例"
                         label-width="120px">
          <el-input :value.trim = "usedRatio" class="remarks" style="text-align: center;" disabled/>
        </el-form-item>
      </el-col>
      <el-col :span="8" align="center">
                <el-form-item label="可分配专业工时"
                              label-width="120px">
                  <el-input :value.trim = "usableAmount" class="remarks" style="text-align: center;" disabled/>
                </el-form-item>
              </el-col>
    </el-row>
    </div>
    <div style="width: 80%;margin-left: 5%">
            <el-row v-for="(item,index) in form.tecWorkday" :key="index">
              <el-col :span="10">
                <el-form-item label="专业名称" style="white-space:nowrap" label-width="120px">
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
              <el-col :span="7">
                <el-form-item label="所占专业工时比例" style="width: 280px"
                              label-width="180px">
                  <el-input v-model="item.ratio" size="mini" oninput="value=value.replace(/[^\d.]/g,'')"
                            type="text" placeholder="请输入工时百分比"
                            style="width: 80px"
                            @input="RatioHandle(item,form)">
                  </el-input>%
                </el-form-item>
              </el-col>
              <el-col :span="7">
                <el-form-item label="工时数" label-width="60px" style="width: 140px">
                  <el-input v-model="item.workday" size="mini" oninput="value=value.replace(/[^\d.]/g,'')"
                            type="text"
                            style="width: 80px"
                            @input="AmountHandle(item,form)">
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
    </div>
    <el-form-item v-if="!disabled && form.check !== 1">
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
        <el-row>
          <el-col :span="12">
            <el-form-item label="申请总工时" style="white-space:nowrap" label-width="100px">
              <el-input  :disabled="newForm.check === 1" v-model="newForm.num" oninput="value=value.replace(/[^\d.]/g,'')"
                        type="text" placeholder="请输入工时数量">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="事由" style="white-space:nowrap" label-width="100px">
              <el-input  :disabled="newForm.check === 1" v-model="newForm.reason"
                         type="text" placeholder="请输入工时申请原因">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="管理工时" style="white-space:nowrap" label-width="100px">
              <el-input  label="设总管理工时" :disabled="newForm.check === 1"  v-model="newForm.manage" oninput="value=value.replace(/[^\d.]/g,'')"
                         type="text" placeholder="请输入工时数量">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备用工时"  style="white-space:nowrap" label-width="100px">
              <el-input  label="备用工时" disabled v-model="newForm.backup" oninput="value=value.replace(/[^\d.]/g,'')"
                         type="text" placeholder="请输入工时数量">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12" align="center">
            <el-form-item label="专业工时" label-width="100px">
              <el-input label="专业工时" :disabled="newForm.check === 1" v-model="newForm.tec" oninput="value=value.replace(/[^\d.]/g,'')"
                        type="text" placeholder="请输入工时数量">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" align="center">
            <el-form-item label="可用专业工时" label-width="100px">
              <el-input :value.trim = "usableNewAmount" class="remarks" style="text-align: center;" disabled/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row  >
        </el-row>
        <el-row v-for="(item,index) in newForm.tecWorkday" :key="index">
          <el-col :span="10">
            <el-form-item label="专业名称" label-width="120px">
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
          <el-col :span="7">
            <el-form-item label="所占比例"
                          label-width="120px">
              <el-input v-model="item.ratio" size="mini" oninput="value=value.replace(/[^\d.]/g,'')"
                        type="text" placeholder="请输入工时百分比"
                        style="width: 60px" :disabled="newForm.check === 1"
                        @input="RatioHandle(item,newForm)">
              </el-input>
              %
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="工时数" style="white-space:nowrap;width: 80px">
              <el-input v-model="item.workday" size="mini" oninput="value=value.replace(/[^\d.]/g,'')"
                        type="text" :disabled="newForm.check === 1"
                        style="width: 60px"
                        @input="AmountHandle(item,newForm)">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
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
    <el-dialog
      v-el-drag-dialog
      :visible.sync="deductVisible"
      width="60%">
      扣除记录选择:<el-select v-model="deductForm.id" placeholder="请选择" size="mini">
      <el-option
        v-for="item in deductList"
        :key="item.id"
        :label="item.reason"
        :value="item.id">
        <span style="float: left">{{ item.handler_time }}</span>
        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.reason}}</span>
      </el-option>
    </el-select>
      <el-button size="mini" @click="openDeduct">重置</el-button>
      <el-button size="mini" type="primary" @click="deductLogSubmit" >确认</el-button>
      <el-form :model="deductForm" size="mini" label-width="100px" style="margin-top: 10px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="专业">
              <el-select v-model="deductForm.tec" @change="getUsable()" style="width: 160px" placeholder="请选择" size="mini">
                <el-option
                  v-for="item in form.tecWorkday"
                  :key="item.name"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="总工时">
              <el-input style="width: 160px" disabled v-model="deductForm.num"></el-input>
            </el-form-item>
          </el-col>
          </el-row>
        <el-row>
          <el-col :span="12">
              <el-form-item label="可扣管理工时">
                <el-input style="width: 160px" disabled v-model="deductForm.manageUsable"></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="扣除管理工时">
              <el-input style="width: 160px"  v-model="deductForm.manage"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="可扣卷册工时">
              <el-input style="width: 160px" disabled v-model="deductForm.volumeUsable"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="扣除卷册工时">
              <el-input style="width: 160px" v-model="deductForm.volume"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="可扣备用工时">
              <el-input style="width: 160px" disabled v-model="deductForm.backupUsable"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="扣除备用工时">
              <el-input style="width: 160px" v-model="deductForm.backup"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
            <el-form-item label="原因">
              <el-input style="width: 520px" v-model="deductForm.reason"></el-input>
            </el-form-item>
        </el-row>
        <el-row style="text-align: center">
          <el-button size="mini" @click="deductVisible = false">取消</el-button>
          <el-button size="mini" type="primary" @click="deductSubmit" >确认</el-button>
        </el-row>
      </el-form>
    </el-dialog>
    <el-dialog
      v-el-drag-dialog
      title="专业管理"
      :visible.sync="tecVisible"
      width="60%"
      @close="getData">
      <span style="font-size: 13px">专业选择主设人后自动更新，无需确定按钮。</span>
      <el-form size="mini" label-width="100px" >
      <el-row v-for="(item,index) in tecList" :key="index">
        <el-col :span="11">
          <el-form-item label="专业名称" style="white-space:nowrap" label-width="60px">
            <el-select size="mini" v-model="item.tec" :disabled="item.type === 1">
              <el-option
                v-for="item in technologyList"
                :key="item.id"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="主设人" value-key="id" label-width="60px">
            <el-select size="mini" v-model="item.principal" style="width: 100%;"
                       :filterable="true"  :remote="true"
                       :remote-method="(e) => remoteMethod(e,index,tecList)"
                       value-key="id" multiple
                       @change="setPrincipal(item)"
                       placeholder="请输入人员姓名或工号">
              <el-option
                v-for="(i,index) in item.principalList"
                :key="i.id"
                :label="i.name"
                :value="i.id">
                <span style="float: left">{{ i.name }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{ i.username }}</span>
              </el-option></el-select>
          </el-form-item>
        </el-col>
        <el-col :span="2" v-if="item.type === 0">
          <el-button style="margin-top : 8px" size="mini" circle icon="el-icon-remove-outline" @click="delTecWorkday(index,item)"/>
        </el-col>
      </el-row>
      <el-divider content-position="center">
      <el-button  type="text" @click="addTecWorkday()">专业缺少，点此添加</el-button></el-divider>
      </el-form>
    </el-dialog>
    <el-dialog
      v-el-drag-dialog
      :close-on-click-modal="false"
      :visible.sync="taskVisible"
      title="新增任务"
      width="60%" style="text-align: center">
      <el-form :model="task" size="mini" label-width="140px" label-position="right">
        <el-row style="margin-left: -50px">
          <el-col :span="12">
            <el-form-item label="项目名称:">
              <el-input disabled v-model="task.project" class="input" style="width: 100%;">
              </el-input>
            </el-form-item >
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="任务类型:">
              <el-radio-group v-model="task.type" @change="getUasble">
                <el-radio :label=1>备用</el-radio>
                <el-tooltip class="item" effect="dark" content="管理工时当前只可分给设总，且每月发放一次，以完成时间月份为准" placement="top">
                <el-radio :label=0>管理</el-radio>
                </el-tooltip>
              </el-radio-group>
            </el-form-item >
          </el-col>
        </el-row>
        <el-row  style="margin-left: -50px" v-if="task.type===1">
          <el-col :span="12">
            <el-form-item label="部门:">
              <el-select v-model="task.dep" placeholder="请选择" @change="selectDep" style="width: 100%;">
                <el-option
                  v-for="item in taskDep"
                  :key="item.dep"
                  :label="item.dep"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item >
          </el-col>
          <el-col :span="12">
            <el-form-item label="专业:">
              <el-select v-model="task.tec" placeholder="请选择" @change="getUasble" style="width: 100%;">
                <el-option
                  v-for="item in taskTec"
                  :key="item.tec"
                  :label="item.tec"
                  :value="item.tec">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-left: -50px">
          <el-col :span="12">
            <el-form-item label="任务编号:">
              <el-input disabled v-model="task.number" class="input" style="width: 100%;">
              </el-input>
            </el-form-item >
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务名称:">
              <el-input v-model="task.name" class="input" style="width: 100%;">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-left: -50px">
          <el-col :span="12">
            <el-form-item label="可用工时:">
              <el-input v-model="task.usable" class="input" disabled style="width: 100%;">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务工时:">
              <el-input  v-model="task.workday" class="input" oninput="value=value.replace(/[^\d.]/g,'')" style="width: 100%;">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row style="margin-left: -50px" v-if="task.type === 0">
          <el-col :span="12">
            <el-form-item
              label="计划结束时间:"
              prop="principal" >
              <el-date-picker style="width: 100%;"
                              v-model="task.planned_end"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label="结束时间:"
              prop="headman">
              <el-date-picker style="width: 100%;"
                              v-model="task.end"
                              type="date"
                              value-format="yyyy-MM-dd"
                              placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
          <el-button @click="taskVisible = false">取消</el-button>
          <el-button @click="taskSubmit" type ="primary">
          <span>确认</span></el-button>`
        </span>
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
        money : 0,
        num : 0,
        manage: 0,
        tec : 0,
        backup : 0,
        tecWorkday : []
      },
      tecVisible : false,
      tecList : [],
      technologyList : [],
      disabled: true,
      visible : false,
      applyList : [],
      newForm : {
        id : "",
        num : 0,
        reason : "",
        manage: 0,
        tec : 0,
        backup : 0,
        tecWorkday : []
      },
      deductVisible : false,
      deductForm : {
        tec : "",
        num : 0,
        manage: 0,
        volume : 0,
        backup : 0,
        reason : ""
      },
      checkerList : [],
      deductList : [],
      taskVisible : false,
      taskDep : [],
      taskTec : [],
      task : {
        project  : "",
        proNumber  : "",
        pid : this.projectId,
        number : "",
        name : "",
        type : 1,
        workday : 0,
        usable : 0,
        dep : "",
        tec : "",
        planned_end : "",
        end : "",
        principal : ""
      },
    }
  },
  filters:{
    checkFilter(val){
      if (val === 0){
        return "待审核"
      }else if (val === 1){
                return "审核通过"
      }
            else if (val === 2){
                return "被回退"
      }
           else if (val === 4){
                return "草稿"
      }
           else {
             return "未填写"
      }
    }
  },
  computed:{
    usableAmount(){
        return (Number(this.form.tec) * 1000  -  this.form.tecWorkday.reduce((prev, cur) => {
          if (cur.workday !== undefined && cur.workday !== "") {
            return (Number(prev)*1000 + Number(cur.workday)*1000)/1000;
          }else return prev},0) * 1000)/1000
    },
    usableNewAmount(){
      return (Number(this.newForm.tec) * 1000 -  this.newForm.tecWorkday.reduce((prev, cur) => {
        if (cur.workday !== undefined && cur.workday !== "") {
          return (Number(prev)*1000 + Number(cur.workday)*1000)/1000;
        }else return prev},0) * 1000)/1000
    },
    usedRatio(){
      return (this.form.tecWorkday.reduce((prev, cur) => {
        if (cur.ratio !== undefined && cur.ratio !== "") {
          return (Number(prev)*1000 + Number(cur.ratio)*1000)/1000;
        }else return prev},0) ).toFixed(3)
    }
  },
  watch:{
    form:{
      handler:(newVal,oldVal) =>{
        newVal.backup = (newVal.num * 1000 - newVal.manage * 1000 - newVal.tec *1000)/1000
      },
      deep : true
    },
    newForm:{
      handler:(newVal,oldVal) =>{
        newVal.backup = (newVal.num * 1000 - newVal.manage * 1000 - newVal.tec *1000)/1000
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
      this.form = {
          money : 0,
          form : 0,
          num : 0,
          manage: 0,
          tec : 0,
          backup : 0,
          tecWorkday : []
      };
      this.$axios
        .post(this.$baseUrl + 'projectWorkday/queryProjectWorkday', {},
          {headers:{"id" : this.projectId}})
        .then(res => {
          if(this.name === this.$parent.project.general) {
          // || !res.data.data.exist
            if (res.data.data.list.length === 0 ) {
              let str = "";
              if (res.data.data.list.length === 0) {
                str = "该项目主设人暂未设定，请指定主设人"
              }
              if (!res.data.data.exist) {
                str = "该项目存在专业主设人暂未设定，是否前往指定"
              }
              this.$confirm(str, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.openTecList();
              }).catch(() => {
              });
            }
          } this.form.money = res.data.data.money
            this.form.num = res.data.data.num;
            this.form.backup = res.data.data.backup;
            this.form.manage = res.data.data.manage;
            this.form.tec = res.data.data.tec;
            this.form.check = res.data.data.check
          this.form.checkerId = res.data.data.checkerId
          res.data.data.list.forEach(item => {
            if (item.amount === undefined || item.amount === ''){
              item.amount = 0
            }
            this.form.tecWorkday.push({project_id : item.project_id,
              name : item.tec,ratio : item.amount/this.form.tec*100 || 0,
              workday : item.amount},)
          })
          if (this.name === res.data.data.general){
            this.disabled = false
          }
        })
        .catch(res => (console.log(res)));
        this.$axios
        .post(this.$baseUrl + 'project/getCheckerListByProjectId',{},{headers : {id : this.projectId}})
        .then(res => {
          this.checkerList = res.data.data
        })
        .catch( res => console.log(res))
    },
    setMoney(){
      this.$axios
          .post(this.$baseUrl + 'project/setMoney',
              {
                id : this.projectId,
                money : this.form.money
              })
          .then(res => {
            if (res.data.code === 0){
              this.$message.success("操作成功")
            }
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
    openTecList(){
      this.tecList = [];
      this.$axios
        .post(this.$baseUrl + 'project/queryTecById',{},{headers :{id : this.projectId}})
        .then(res => {
          if (res.data.code === 0){
            res.data.data.forEach(item =>{
              let p = [];
              if (item.list !== undefined) {
                item.list.forEach(i => {
                  p.push(i.id);
                })
              }
              this.tecList.push( {id : item.project_id, tec : item.tec,
                principal : p, principalList : item.list, type : item.type} )
            })
            this.tecVisible = true;
          }
        })
        .catch( res => console.log(res))
    },
    onSubmitTotal(){
      if (this.form.num !==  null && this.form.num !==  "") {
        this.$axios
          .post(this.$baseUrl + 'projectWorkday/setProWorkdayTotal', {
            "project_id": this.projectId,
            "num": this.form.num,
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
        this.$message.warning("不能为空")
      }
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
      if (this.form.tec < 0 || this.form.manage<0 || this.form.backup<0){
        this.$message({
          message: '工时不能小于0',
          type: 'error'
        });
        return  0;
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
                message: '操作成功',
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
              "reason" : this.newForm.reason,
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
    remoteMethod(query,index,tecList) {
      if (query !== '') {
        setTimeout(() => {
          this.$axios
            .post(this.$baseUrl + 'user/queryByName', {
                "name" : query
              }
            )
            .then(res => {
              if (res.data.data != null) {
                this.$set(tecList[index],'principalList',res.data.data)
              }
            });

        }, 200);
      } else {
        this.nameList = [];
      }
    },
    setPrincipal(item){
        if (item.tec !== undefined && item.tec !== "") {
          this.$axios
            .post(this.$baseUrl + 'projectWorkday/setPrincipal', {
              projectId : this.projectId,
              tec: item.tec,
              principal: item.principal,
              type: item.type,
            })
            .then(res => {
              if (res.data.code === 0) {
                this.$message.success("操作成功")
              }
            })
            .catch(res => {
              console.log(res)
            })
        } else {
          item.principal = "";
          this.$message.warning("请先选择专业")
        }
    },
    addTecWorkday(){
      this.tecList.push({name:"",principal: "", type : 0,})
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
    delTecWorkday(index,item){
        this.$axios
          .post(this.$baseUrl + 'projectWorkday/delTec', {
            id: this.projectId,
            tec: item.tec
          })
          .then(res => {
            if (res.data.code === 0){
              this.tecList.splice(index,1)
              this.$message.success("操作成功")
            }
          })
          .catch(res => {
            console.log(res)
          })
    },
    reset(){
      this.getData();
    },
    openNewForm(){
      this.newForm = {
        addId : null,
        id : "",
        num : 0,
        reason : "",
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
      this.form.tecWorkday.forEach(item => {
        if (item.amount === undefined || item.amount === ''){
          item.amount = 0
        }
        this.newForm.tecWorkday.push({project_id : item.project_id,
          name : item.name,ratio :  0, workday : 0,},)
      })
    },
    selectAddId(){
      if (this.newForm.addId != null) {
        this.$axios
          .post(this.$baseUrl + 'projectWorkday/queryNewWorkdayByAddId', {},
            {headers: {"id": this.newForm.addId}})
          .then(res => {
            this.newForm.num = res.data.data.num;
            this.newForm.reason = res.data.data.reason;
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
        reason : "",
          manage: 0,
          tec : 0,
          backup : 0,
          tecWorkday : []
      }
    },
    openDeduct(){
      this.deductForm = {
          tec : "",
          manage: 0,
          volume : 0,
          backup : 0,
          reason : ""
      };
        this.$axios
          .post(this.$baseUrl + 'deduct/queryLog',{},{headers: {id : this.projectId}})
          .then(res => {
            this.deductList = res.data.data;
            this.deductVisible = true;
          })
          .catch(res => console.log(res))
    },
    getUsable(){
      this.$axios
        .post(this.$baseUrl + 'project/queryUsableByTec',{
          id : this.projectId,
          tec : this.deductForm.tec
        })
        .then(res => {
          let resDate = res.data.data;
          this.deductForm.num  = resDate.amount;
          this.deductForm.manageUsable  = resDate.manageUsable;
          this.deductForm.volumeUsable  = resDate.volumeUsable;
          this.deductForm.backupUsable  = resDate.backupUsable;
          this.$forceUpdate();
        })
        .catch(res => console.log(res))
    },
    deductSubmit(){
      this.$axios
        .post(this.$baseUrl + 'deduct/add',{
          id : this.projectId,
          tec : this.deductForm.tec,
          manage : this.deductForm.manage,
          volume : this.deductForm.volume,
          backup : this.deductForm.backup,
          reason : this.deductForm.reason,
          manageUsable : this.deductForm.manageUsable,
          volumeUsable : this.deductForm.volumeUsable,
          backupUsable : this.deductForm.backupUsable,
          num : this.deductForm.num
        })
        .then(res => {
          if (res.data.code === 0){
            this.$message.success("操作成功")
            this.deductVisible = false;
          }
        })
        .catch(res => console.log(res))
    },
    deductLogSubmit(){
      this.$axios
        .post(this.$baseUrl + 'deduct/queryLogId',{}, {headers: {id : this.deductForm.id}})
        .then(res => {
          if (res.data.code === 0){
            this.deductForm.num  = "NAN"
            this.deductForm.manageUsable  = "NAN"
            this.deductForm.volumeUsable  = "NAN"
            this.deductForm.backupUsable  = "NAN"
            this.deductForm = res.data.data
          }
        })
        .catch(res => console.log(res))
    },
    newTask(){
      this.task = {
        project  : this.$parent.project.name,
        proNumber  : this.$parent.project.number,
        pid : this.projectId,
        number : "",
        name : "",
        type : 1,
        workday : 0,
        usable : 0,
        dep : "",
        tec : "",
        planned_end : "",
        end : "",
        principal : this.$parent.name,
      };
      this.getTec()
      this.getUasble()
      this.taskVisible = true
    },
    getUasble(){
      this.task.usable = 0;
      this.$axios
        .post(this.$baseUrl + 'projectWorkday/queryWorkdayByGeneral',{
          id : this.task.pid,
          proNumber : this.task.proNumber,
          type : this.task.type
        })
        .then(res => {
          if(res.data.code === 0){
            this.task.check = res.data.data.check;
            this.task.number = res.data.data.number
            if (this.task.type === 1){
              this.task.usable = this.$myMethod.nullTo0(res.data.data.backup) - this.$myMethod.nullTo0(res.data.data.backupUsed)
            }else {
              this.task.usable = this.$myMethod.nullTo0(res.data.data.manage) - this.$myMethod.nullTo0(res.data.data.manageUsed)
            }
            console.log(this.task.usable)
            if(this.task.check !== 1){
              this.$message.warning("工时分配暂未审核或分配被组长回退，新建任务工时暂不能发放")
            }
            this.$forceUpdate
          }
        })
        .catch(res => (console.log(res)));
    },
    taskSubmit(){
      if (this.task.type === 0){
        if (this.task.end === undefined || this.task.end === ''){
          this.$message.warning("请选择结束时间，管理工时发放日期以结束时间月份为准")
          return ;
        }
      }
        this.$axios
          .post(this.$baseUrl + 'projectWorkday/setWorkdayByGeneral',this.task,)
          .then(res => {
            if(res.data.code === 0 || res.data.code === 560){
              this.taskVisible = false;
              this.$message.success("新增任务成功")
            }
          })
          .catch(res => (console.log(res)));
    },
    getTec(){
      this.$axios
        .post(this.$baseUrl + 'department/queryByProjectAll',{},{headers : {id : this.projectId}})
        .then(res => {
          res.data.data.forEach(item => {
            this.taskDep.push2(item)
          })
        })
        .catch(res => (console.log(res)));
    },
    selectDep(val){
      this.task.dep = val.dep
      this.taskTec = val.list
      this.$forceUpdate
    },
  }
}
</script>

<style scoped>
.el-input.is-disabled /deep/ .el-input__inner {
  background-color: white;
  color: #000000;
}

.text {
  color: #e6a23c;
}
</style>
