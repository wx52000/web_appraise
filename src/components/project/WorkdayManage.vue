<template>
<div>
      <el-form label-width="120px" size="mini"
               style="margin-top: 15px;width: 90%;margin-left: 5%;text-align: left" label-position="right">
        <el-row>
          <el-col :span="6">
            <el-form-item label="专业" label-width="80px">
            <el-select v-model="workdayData.tec" placeholder="请选择" style="width: 160px" value-key="tec" size="mini"
                       @change="selectTec">
              <el-option
                v-for="item in workdayDateList"
                :key="item.tec"
                :label="item.tec"
                :value="item">
              </el-option>
            </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="总工时数量" label-width="100px">
            <span style="color: #66b1ff">{{workdayData.num}}</span>
            <el-button size="mini" style="text-align: center;font-size: 10px;padding: 2.5px"
                       type="primary" @click="openTecWorkdayLog">记录</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="100px" label="已分配工时数">
            <el-tooltip class="item" effect="dark" content="已分配工时计算方式为分配到任务的工时" placement="top">
              <span style="color: #66b1ff">{{workdayData.used}}</span>
            </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label-width="100px" label="工时分配状态">
              <span style="color: #66b1ff">-{{workdayData.tecCheck|checkFilter}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <div style="margin-left: 5%">
        <el-row >
          <el-col :span="6" >
            <el-form-item label="已分配管理工时">
              <span class="usedSpan">
                {{workdayData.manageUsed}}
              </span>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="管理工时数量">
              <el-input
                size = "mini"
                oninput="value=value.replace(/[^\d.]/g,'')"
                v-model="workdayData.manage"
                style="width: 50%"
                placeholder="请输入内容"
              >
              </el-input>
            </el-form-item>
          </el-col>
            <el-col :span="8">
              <el-form-item label-width="200px" label="管理工时所占总工时比例">
              <el-input
                size = "mini"
                oninput="value=value.replace(/[^\d.]/g,'')"
                v-model="workdayData.manageRatio"
                style="width: 50%"
                placeholder="请输入内容"
              ></el-input>%
            </el-form-item>
          </el-col>
        </el-row>
          <el-row >
            <el-col :span="6" >
              <el-form-item label="已分配卷册工时">
              <span class="usedSpan">
                {{workdayData.volumeUsed}}
              </span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="卷册工时数量">
                <el-input
                  size = "mini"
                  oninput="value=value.replace(/[^\d.]/g,'')"
                  v-model="workdayData.volume"
                  style="width: 50%"
                  placeholder="请输入内容"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="200px" label="卷册工时所占总工时比例">
                <el-input
                  size = "mini"
                  oninput="value=value.replace(/[^\d.]/g,'')"
                  v-model="workdayData.volumeRatio"
                  style="width: 50%"
                  placeholder="请输入内容"
                ></el-input>%
              </el-form-item>
            </el-col>
          </el-row>
          <el-row >
            <el-col :span="6" >
              <el-form-item label="已分配备用工时">
              <span class="usedSpan">
                {{workdayData.backupUsed}}
              </span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="备用工时数量">
                <el-tooltip class="item" effect="dark" content="此处为自动调整，使得备用工时 + 卷册工时 + 管理工时 = 总工时" placement="top">
                <el-input
                  size = "mini"
                  disabled
                  oninput="value=value.replace(/[^\d.]/g,'')"
                  :value.trim = "backupUable"
                  style="width: 50%"
                  placeholder="请输入内容"
                >
                </el-input>
                </el-tooltip>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="200px" label="备用工时所占总工时比例">
                <el-input
                  size = "mini"
                  disabled
                  oninput="value=value.replace(/[^\d.]/g,'')"
                  v-model="workdayData.backupRatio"
                  style="width: 50%"
                  placeholder="请输入内容"
                ></el-input>%
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div>
        <el-row >
        <el-col :span="6" >
          <el-form-item label="设计" style="margin-left:-60px">
            <el-input v-model="workdayData.designer" size="mini" style="width: 50%"
                      oninput="value=value.replace(/[^\d.]/g,'')"  >
            </el-input>%
          </el-form-item>
        </el-col>
        <el-col :span="6" >
          <el-form-item label="校核">
            <el-input v-model="workdayData.checker" size="mini" style="width: 50%"
                      oninput="value=value.replace(/[^\d.]/g,'')">
            </el-input>
            %
          </el-form-item>
        </el-col>
          <el-col :span="6" >
            <el-form-item label="主设">
              <el-input v-model="workdayData.principal" size="mini" style="width:50%"
                        oninput="value=value.replace(/[^\d.]/g,'')">
              </el-input>%
            </el-form-item>
          </el-col>
          <el-col :span="6" >
            <el-form-item label="组长">
              <el-tooltip class="item" effect="dark" content="该比例只对卷册生效" placement="top">
              <el-input v-model="workdayData.headman" size="mini" style="width: 50%" disabled
                        oninput="value=value.replace(/[^\d.]/g,'')">
              </el-input>
              </el-tooltip>
              %
            </el-form-item>
          </el-col>
        </el-row>
        </div>
      </el-form>
      <ux-grid use-virtual border :data="workdayData.list" class="ux-table"
               :max-height=300
               size = "mini" :cell-style="this.CellStyleOne">
        <ux-table-column field="number" min-width="100px" fixed sortable title="任务编号" align="center"  >
        </ux-table-column>
        <ux-table-column field="name" min-width="200px" fixed sortable title="任务名称" align="center"  >
          <template slot-scope="scope">
            <span v-if="scope.row.tips" style="font-weight: bold">{{scope.row.name}}</span>
            <span v-else>{{scope.row.name}}</span>
          </template>
        </ux-table-column>
        <ux-table-column field="designer" min-width="80px" fixed sortable title="设计" align="center"  >
        </ux-table-column>
        <ux-table-column field="checker" min-width="80px" fixed sortable title="校核" align="center"  >
        </ux-table-column>
        <ux-table-column field="workday"  min-width="100px" sortable title="工时" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.workday" size="mini" :disabled="scope.row.submit === 1 || scope.row.submit === 2" oninput="value=value.replace(/[^\d.]/g,'')"></el-input>
          </template>
        </ux-table-column>
      </ux-grid>
      <el-row >
        已分配卷册工时
        <el-tooltip class="item" effect="dark" content="已分配卷册工时所有分配至卷册的工时总和" placement="top">
        <el-input disabled :value.trim="volumeUsed" size="mini" style="width: 80px;margin-right: 80px"></el-input>
        </el-tooltip>
        审核人
        <el-select v-model="workdayData.checkerId" placeholder="请选择" style="width: 100px" size="mini"
                   @change="selectChecker">
          <el-option
            v-for="item in checkerList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-button size="mini" @click="distributeConfirm(4)">保存
        </el-button>
        <el-button type="primary" size="mini" @click="distributeConfirm(0)">报审
        </el-button>
      </el-row>
  <el-dialog
    v-el-drag-dialog
    :visible.sync="tecWorkdayLogVisible"
    width="50%" style="text-align: center"
    title="工时记录">
    <u-table key="tecWorkdayLog" use-virtual :row-height="30"
             :data="tecWorkdayLog" size="mini"
             height="180">
      <u-table-column
        label="时间"
        show-overflow-tooltip
        prop="time">
      </u-table-column>
      <u-table-column
        label="数量"
        show-overflow-tooltip
        prop="amount">
      </u-table-column>
      <u-table-column
        label="原因"
        show-overflow-tooltip
        prop="reason">
      </u-table-column>
    </u-table>
  </el-dialog>
</div>
</template>

<script>
export default {
name: "WorkdayManage",
  data(){
  return {
    projectId : 0,
    workdayData: {
      tec: "",
      num: 0,
      used: 0,
      manage: 0,
      volume: 0,
      usedManage: 0,
      todayManage: 0,
      designer: 75,
      checker: 10,
      principal: 8,
      headman: 7,
      manageRatio: 0,
      volumeRatio: 0,
      backupRatio: 0,
      list : [],
    },
    workdayDateList : [],
    checkerList : [],
    tecWorkdayLogVisible : false,
    tecWorkdayLog : [],
    }
  },
  watch : {
    workdayData: {
      handler(newVal, oldVal) {
        newVal.headman = 100 - Number(newVal.designer) - Number(newVal.checker) - Number(newVal.principal)
        newVal.manageRatio = (this.$myMethod.nullTo0(newVal.manage) / newVal.num) * 100;
        newVal.volumeRatio = (this.$myMethod.nullTo0(newVal.volume) / newVal.num) * 100;
        newVal.backupRatio = (this.backupUable / newVal.num) * 100
      },
      deep: true
    },
  },
  computed : {
    backupUable(){
      return (Number(this.workdayData.num)*1000 - Number(this.workdayData.manage)*1000 - Number(this.workdayData.volume)*1000)/1000
    },
    volumeUsed(){
      return this.workdayData.list.reduce((prev, cur) => {
        if (cur.workday !== undefined && cur.workday !== "") {
          return (Number(prev)*1000 + Number(cur.workday)*1000)/1000
        }
      },0)
    }
  },
  filters :{
    checkFilter(val){
      if (val === 0){
        return "待审核"
      }
      else if (val === 1){
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
    },
  },
  mounted() {
    this.projectId = this.$route.query.project_id;
    this.workdayDistribute()
  },
  methods :{
    workdayDistribute() {
      this.workdayData = {
        tec: "",
        num: 0,
        used: 0,
        manage: 0,
        volume: 0,
        usedManage: 0,
        todayManage: 0,
        designer: 75,
        checker: 10,
        principal: 8,
        headman: 7,
        manageRatio: 0,
        volumeRatio: 0,
        backupRatio: 0,
        list : [],
      }
      this.$axios
        .post(this.$baseUrl + 'project/queryDistribute', {
          id: this.projectId,
          date: this.nowDate
        })
        .then(res => {
          this.workdayDateList = res.data.data;
          this.workdayData.id = this.projectId
          this.workdayData.tec = res.data.data[0].tec
          this.workdayData.num = res.data.data[0].amount
          this.workdayData.volumeUsed = res.data.data[0].volumeUsed;
          this.workdayData.manageUsed = res.data.data[0].manageUsed;
          this.workdayData.backupUsed = res.data.data[0].backupUsed;
          this.workdayData.manage = res.data.data[0].manage
          this.workdayData.volume = res.data.data[0].volume
          this.workdayData.check = res.data.data[0].check
          this.workdayData.tecCheck = res.data.data[0].tecCheck
          this.workdayData.designer = res.data.data[0].designer
          this.workdayData.checker = res.data.data[0].checker
          this.workdayData.principal = res.data.data[0].principal
          this.workdayData.headman = res.data.data[0].headman
          this.workdayData.checkerId = res.data.data[0].checkerId
          // this.workdayData.completeUsed = res.data.data[0].completeUsed
          this.workdayData.list = res.data.data[0].list
          this.workdayData.used = (Number(res.data.data[0].backupUsed) * 1000 + Number(res.data.data[0].manageUsed) * 1000
            + Number(res.data.data[0].volumeUsed) * 1000) / 1000
        })
        .catch(res => (console.log(res)));
      this.$axios
        .post(this.$baseUrl + 'project/getCheckerList', {}, {headers: {type: 0}})
        .then(res => {
          this.checkerList = res.data.data
        })
        .catch(res => console.log(res))
    },
    selectTec(val){
      this.workdayData.tec = val.tec
      this.workdayData.num = val.amount
      this.workdayData.volumeUsed = val.volumeUsed;
      this.workdayData.manageUsed = val.manageUsed;
      this.workdayData.backupUsed = val.backupUsed;
      this.workdayData.manage =  val.manage
      this.workdayData.volume =  val.volume;
      this.workdayData.check = val.check;
      this.workdayData.tecCheck = val.tecCheck;
      this.workdayData.designer = val.designer
      this.workdayData.checker = val.checker
      this.workdayData.principal = val.principal
      this.workdayData.headman = val.headman
      this.workdayData.checkerId = val.checkerId
      // this.workdayData.completeUsed = val.completeUsed
      this.workdayData.list = val.list
      this.workdayData.used = (Number( val.backupUsed)*1000 + Number( val.manageUsed)*1000
        + Number(val.volumeUsed) *1000)/1000
    },
    distributeConfirm(val){
      if (this.workdayData.tecCheck === 0|| this.workdayData.tecCheck === 1){
        this.$confirm('此操作会覆盖上一次申报, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.distributeSubmit(val)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      }else {
        this.distributeSubmit(val)
      }
    },
    distributeSubmit(val){
      if (val === 0) {
        if (this.workdayData.check === 2) {
          this.$message.warning("设总分配专业工时被主任回退，请稍后重试")
          return 0;
        }
        if (!(Number(this.workdayData.volume) >= 0 && Number(this.workdayData.manage) >=0 &&
          Number(this.workdayData.volume) + Number(this.workdayData.manage) <= Number(this.workdayData.num))){
          this.$message.warning("工时数量应大于等于0，工时总和应等于总工时数量")
          return 0;
        }
        if (this.workdayData.checkerId === undefined) {
          this.$message.warning("请选择审核人")
          return 0;
        }
        let t = ['designer','checker','principal', 'headman'];
        let ratioSum = 0;
        t.forEach( item =>{
          ratioSum += Number(this.workdayData[item])
        })
        if (Number(ratioSum) !== 100){
          this.$message.warning("专业比例和为100")
          return 0;
        }
      }
      // if (this.volumeUsed > (Number(this.workdayData.volume) - Number(this.workdayData.completeUsed))){
      if (this.volumeUsed > (Number(this.workdayData.volume))){
        this.$message.warning("卷册分配工时超出上限，请修改")
        return 0;
      }
      if(this.workdayData.check === 1){
        this.$axios
          .post(this.$baseUrl + 'project/distributeTecWorkday',{
              id : this.workdayData.id,
              tec : this.workdayData.tec,
              manage : this.workdayData.manage,
              volume : this.workdayData.volume,
              designer : this.workdayData.designer,
              checker : this.workdayData.checker,
              principal : this.workdayData.principal,
              headman : this.workdayData.headman,
              list : this.workdayData.list,
              check : val
            },
          )
          .then(res => {
            if (res.data.code === 0) {
              let s = "申报成功，请联系组长审核"
              if (val === 4){
                s = "保存成功"
              }
              this.$message({
                type: "success",
                message: s
              })
            }
          })
          .catch(res => (console.log(res)));
      }else{
        this.$message.warning("设总分配专业工时暂未被上级审核，请稍后重试")
      }
    },
    selectChecker(val){
      this.workdayData.checkerId = val
      this.$forceUpdate();
      this.$axios
        .post(this.$baseUrl + 'project/setTecChecker',
          {
            id : this.workdayData.id,
            tec : this.workdayData.tec,
            checker : this.workdayData.checkerId
          })
        .then(res => {
          if (res.data.code === 0){
            this.$message.success("操作成功")
          }
        })
        .catch( res => console.log(res))
    },
    openTecWorkdayLog(){
      this.tecWorkdayLog = [];
      this.$axios
        .post(this.$baseUrl + 'projectWorkday/queryProjectTecWorkdayLog',{
          id : this.workdayData.id,
          tec : this.workdayData.tec
        })
        .then(res => {
          if (res.data.code === 0){
            this.tecWorkdayLog = res.data.data
            this.tecWorkdayLogVisible = true;
          }
        })
        .catch(res => (console.log(res)));
    },
  }
}
</script>

<style scoped>
.el-form-item{
  font-weight: bold;
}
.usedSpan {
  color: #e6a23c;
}
</style>
