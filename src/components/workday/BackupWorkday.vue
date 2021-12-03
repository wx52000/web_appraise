<template>
  <div style="width:80%;text-align: center;margin-left: 10%">
    <el-row align="center" style="text-align: center;margin-top: 1%">
      <span style="font-size: 18px;">          <el-date-picker
        v-model="date"
        type="month"
        placeholder="选择月"
        format="yyyy-MM"
        value-format="yyyy-MM"
        style="width: 115px"
        @change="getData">
          </el-date-picker>设总管理及备用工时分配</span>
    </el-row>
    <el-form ref="form" :model="form"  style="width:80%;margin-top: 1%;margin-left: 10%">
      <el-row>
        <el-col :span="10" align="center">
          <el-form-item label="可用管理工时"  label-width="160px">
            <el-input v-model="form.musable" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="10" align="center">
          <el-form-item label="本月发放管理工时"
                        label-width="160px">
            <el-input v-model="form.manage" style="text-align: center" />
          </el-form-item>
        </el-col>
        <el-button type="primary" @click="manageSubmit">确认</el-button>
      </el-row>

      <el-row style="">
        <el-col :span="10" align="center">
          <el-form-item label="总备用工时"  label-width="160px">
            <el-input v-model="form.backup" disabled />
          </el-form-item>
        </el-col>
        <el-col :span="10" align="center">
          <el-form-item label="可用备用工时" label-width="160px">
            <el-input v-model="form.usable" style="text-align: center" disabled />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-for="(item,index) in form.tecWorkday" :key="index">
        <el-col :span="9">
          <el-form-item label="专业" style="white-space:nowrap" label-width="80px">
            <el-input v-model="item.name" type="text" disabled>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="比例" style="white-space:nowrap"
                         label-width="80px">
            <el-input v-model="item.ratio" oninput="value=value.replace(/[^\d.]/g,'')"
                      type="text" placeholder="请输入工时百分比"
                      @input="RatioHandle(item)" :disabled="disabled">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="工时数" style="white-space:nowrap;width: 80px">
            <el-input v-model="item.workday" oninput="value=value.replace(/[^\d.]/g,'')"
                      type="text"
                      @input="AmountHandle(item)" :disabled="disabled">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">确认</el-button>
        <el-button @click="reset()">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "BackupWorkday",
  data(){
    return{
      isShow : false,
      projectId : "",
      disabled : false,
      nowDate : "",
      date : "",
      form : {
        musable : 0,
        manage : 0,
        usable : "",
        tecWorkday : []
      },
      eventState : false
    }
  },
  computed:{
    usedAmount(){
      return this.form.tecWorkday.reduce((prev, cur) => {
        if (cur.workday !== undefined && cur.workday !== "") {
          return Number(prev) + Number(cur.workday);
        }else return prev
      },0)
    }
  },
  watch:{
    usedAmount(val, old){
      if (val !== undefined && val !== old && this.eventState !== true){
        this.form.usable += old - val
      }
    },
    date(val){
      if (val !== this.nowDate){
        this.disabled = true;
      }else {
        this.disabled = false;
      }
    }
  },
  mounted() {
    let date = new Date();
    this.date = date.getFullYear() + "-" + (Number(date.getMonth()) + 1).toString().padStart(2,0)
    this.nowDate = this.date;
    this.projectId = this.$route.query.project_id;
    this.getData();
  },
  methods:{
    AmountHandle(item){
      item.ratio = Math.round(item.workday/this.form.backup*1000)/10
    },
    RatioHandle(item){
      item.workday = this.form.backup*(item.ratio/100)
    },
    getData(){
      this.form.tecWorkday = [];
      this.$axios
        .post(this.$baseUrl + 'projectWorkDay/queryBackupWorkDay', {
          "id" : this.projectId,
          "date" : this.date,
        })
        .then(res => {
          this.form.musable = res.data.data.musable;
          this.form.manage = res.data.data.manage;
          this.form.backup = res.data.data.backup;
          this.form.usable = res.data.data.usable;
          this.eventState = true;
          res.data.data.workday.forEach(item => {
            if (item.workday === undefined || item.workday === ''){
              item.workday = 0
            }
            this.form.tecWorkday.push({name : item.name,ratio : item.workday/this.form.tec*100 || 0,
              workday : item.workday})
          })
          this.$nextTick(() =>{
            this.eventState = false;
          },100)
        })
        .catch(res => (console.log(res)));
    },
    manageSubmit(){
      if (this.form.usable >= 0) {
        this.$axios
          .post(this.$baseUrl + 'projectWorkDay/setManageWorkday', {
            "id": this.projectId,
            "workday" : this.form.manage,
            "type": 0,
            "date" : this.date
          })
          .then(res => {
            if (res.data.code === 0) {
              this.$message({
                message: '分配成功',
                type: 'success'
              });
            }
          })
          .catch(res => (console.log(res)));
      } else {
        this.$message({
          message: '工时分配超出上限',
          type: 'warning'
        });
      }
    },
    onSubmit(){
      if (this.form.usable >= 0) {
        this.$axios
          .post(this.$baseUrl + 'projectWorkDay/setBackupWorkDay', {
            "project_id": this.projectId,
            "list": this.form.tecWorkday,
            "type": this.type,
            "date" : this.date
          })
          .then(res => {
            if (res.data.code === 0) {
              this.$message({
                message: '分配成功',
                type: 'success'
              });
            }
          })
          .catch(res => (console.log(res)));
      } else {
        this.$message({
          message: '工时分配超出上限',
          type: 'warning'
        });
      }
    },
    reset(){
      this.getData();
    },
  }
}
</script>

<style scoped>
.el-input.is-disabled /deep/ .el-input__inner {
  background-color: white;
  color: #000000;
}
</style>
