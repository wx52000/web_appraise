<template>
<div>
  <div style="float: left;width: 50%;border-right:solid 1px #000000;box-sizing: border-box" align="center">
    <span style="float: left;margin-left: 5%">项目工时管理</span>
  <el-form ref="form" :model="form" style="width:70%;margin-top: 7%">
    <el-form-item label="项目名称" label-width="100px">
      <el-input v-model="form.project.name"></el-input>
    </el-form-item>
    <el-form-item label="项目编号" style="white-space:nowrap" label-width="100px">
      <el-input v-model="form.project.number"></el-input>
    </el-form-item>
    <el-form-item label="设总管理工时" style="white-space:nowrap" label-width="100px">
      <el-input label="设总管理工时" v-model="form.manage" oninput="value=value.replace(/[^\d.]/g,'')"
                type="text" placeholder="请输入工时数量">
      </el-input>
    </el-form-item>
    <el-form-item label="专业工时" style="white-space:nowrap" label-width="100px">
      <el-input label="专业工时" v-model="form.tec" oninput="value=value.replace(/[^\d.]/g,'')"
                type="text" placeholder="请输入工时数量">
      </el-input>
    </el-form-item>
    <el-form-item label="备用工时" style="white-space:nowrap" label-width="100px">
      <el-input label="备用工时" v-model="form.backup" oninput="value=value.replace(/[^\d.]/g,'')"
                type="text" placeholder="请输入工时数量">
      </el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">确认</el-button>
      <el-button @click="reset()">重置</el-button>
    </el-form-item>
  </el-form>
  </div>
  <div style="float: right;width: 50%" align="center">
    <el-tabs type="card" @tab-click="handleClick" value="tec">
      <el-tab-pane :label="item.label" :name="item.name" v-for="(item,index) in [{label : '专业工时',name : 'tec'},
      {label : '备用工时',name : 'backup'}]" :key="index">
    <el-form ref="form1" :model="form1" :rules="rules" style="width:90%;margin-top: 7%">
      <el-row v-for="(item,index) in form1.tecWorkday" :key="index">
        <el-col :span="9">
          <el-form-item label="专业" style="white-space:nowrap" label-width="80px">
            <el-input v-model="item.name" type="text">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="比例" style="white-space:nowrap"
                        :prop="'tecWorkday.'+index+'.ratio'"
                        :rules="rules.ratio" label-width="80px">
            <el-input v-model="item.ratio" oninput="value=value.replace(/[^\d.]/g,'')"
                      type="text" placeholder="请输入工时百分比"
                      @input="dataHandle(item)">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item style="white-space:nowrap;width: 80px">
            <el-input v-model="item.workday" oninput="value=value.replace(/[^\d.]/g,'')"
                      type="text"
                      @input="RatioHandle(item)">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" @click="onSubmit1">确认</el-button>
        <el-button @click="reset()">重置</el-button>
      </el-form-item>
    </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
  <news-dialog class="news" :is-show="isShow" @click.native="isShow = !isShow">
  </news-dialog>
</div>
</template>

<script>
export default {
  name: "WorkDayManage",
    data(){
      const rule = async(rule, value, callback) =>{
        let sum = 0;
        this.form1.tecWorkday.forEach(item => {
          if (!Number.isNaN(Number(item.ratio)))
            sum += Number(item.ratio)
        })
        console.log(sum)
        if (sum > 100){
          this.ruled = true;
          return callback(new Error("比例之和不能超出100%"))
        }else{
          this.ruled = false;
          return callback;
        }
      }
    return{
      isShow : false,
      projectId : "",
      form : {
        project : {
        },
        manage : 0,
        tec : 0,
        backup : 0
      },
      form1 : {
        tecWorkday : []
      },
      designerWorkday : null,
      ruled : false,
      rules:{
        ratio : [{ required: true, validator: rule, trigger: 'change' }]
      },
      type : 1,
    }
  },
  mounted() {
    this.projectId = this.$route.query.project_id;
    this.getData();
  },
  methods:{
    dataHandle(item){
      item.workday = item.ratio *this.designerWorkday/100
    },
    RatioHandle(item){
      item.ratio = (item.workday*100)/this.designerWorkday
    },
    getData(){
      this.$axios
        .post(this.$baseUrl + 'projectWorkDay/queryWorkDay', {},
          {headers:{"id" : this.projectId}})
        .then(res => {
          this.form.project = res.data.data.project;
          this.form.manage = res.data.data.workday.manage;
          this.form.tec = res.data.data.workday.tec;
          this.form.backup = res.data.data.workday.backup
              this.designerWorkday = this.form.tec;
          res.data.data.tecWorkday.forEach(item => {
            this.form1.tecWorkday.push({name : item.name,ratio : item.ratio,
              workday : item.ratio *this.designerWorkday/100})
          })
        })
        .catch(res => (console.log(res)));
    },
    onSubmit(){
      this.$axios
        .post(this.$baseUrl + 'projectWorkDay/setProWorkDay', {
          "project_id" : this.projectId,
          "manage" : this.form.manage,
          "tec" : this.form.tec,
          "backup" : this.form.backup
        })
        .then(res => {
          this.$message({
            message: '请求已发送给管理员',
            type: 'success'
          });
        })
        .catch(res => (console.log(res)));
    },
    onSubmit1(){
      if (this.ruled === false) {
        if (this.type === 1) {
          this.$axios
            .post(this.$baseUrl + 'projectWorkDay/setTecWorkDay', {
              "project_id": this.projectId,
              "list": this.form1.tecWorkday,
              "type": this.type
            })
            .then(res => {
              this.$message({
                message: '比例修改成功',
                type: 'success'
              });
            })
            .catch(res => (console.log(res)));
        }else {
          this.$axios
            .post(this.$baseUrl + 'projectWorkDay/setBackupWorkDay', {
              "project_id": this.projectId,
              "list": this.form1.tecWorkday,
              "type": this.type
            })
            .then(res => {
              this.$message({
                message: '比例修改成功',
                type: 'success'
              });
            })
            .catch(res => (console.log(res)));
        }
      }else
        this.$message({
          message: '比例不能超出100%',
          type: 'warning'
        });
    },
    reset(){
      this.getData();
    },
    handleClick(tab, event) {
      if (tab.name === "tec"){
        this.type = 1;
        this.designerWorkday = this.form.tec;
        this.form1.tecWorkday = [];
        this.$axios
          .post(this.$baseUrl + 'projectWorkDay/queryTecWorkDay', {},
            {headers:{"id" : this.projectId}})
          .then(res => {
            res.data.data.forEach(item => {
              this.form1.tecWorkday.push({name : item.name,ratio : item.ratio,
                workday : item.ratio *this.designerWorkday/100})
            })
          })
          .catch(res => (console.log(res)));
      }else if (tab.name === "backup"){
        this.type = 2;
        this.designerWorkday = this.form.backup;
        this.form1.tecWorkday = [];
        this.$axios
          .post(this.$baseUrl + 'projectWorkDay/queryReserveWorkday', {},
            {headers:{"id" : this.projectId}})
          .then(res => {
            res.data.data.forEach(item => {
              this.form1.tecWorkday.push({name : item.name,ratio : (item.workday/this.designerWorkday)*100,
                workday : item.workday})
            })
          })
          .catch(res => (console.log(res)));
      }
      console.log(this.form1.tecWorkday)
    }
  }
}
</script>

<style scoped>

</style>
