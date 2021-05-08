<template>
<div>
  <div style="float: left;width: 50%;border-right:solid 1px #000000;box-sizing: border-box" align="center">
    <span style="float: left;margin-left: 5%">项目工时管理</span>
  <el-form ref="form" :model="form" style="width:70%;margin-top: 7%">
    <el-form-item label="项目名称" label-width="80px">
      <el-input v-model="form.project.name"></el-input>
    </el-form-item>
    <el-form-item label="项目编号" style="white-space:nowrap" label-width="80px">
      <el-input v-model="form.project.number"></el-input>
    </el-form-item>
      <el-row v-for="(item,index) in form.workday" :key="index">
        <el-col :span="11">
          <el-form-item label="类型" style="white-space:nowrap" label-width="80px">
          <el-select v-model="item.type" placeholder="请选择公式分配类型">
            <el-option label="主设人管理工时" :value="2"></el-option>
            <el-option label="卷册设计工时" :value="3"></el-option>
            <el-option label="备用工时" :value="4"></el-option>
          </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="工时" style="white-space:nowrap" label-width="80px">
          <el-input label="工时" v-model="item.value" oninput="value=value.replace(/[^\d.]/g,'')"
                    type="text" placeholder="请输入工时数量">
          </el-input>
          </el-form-item>
        </el-col>
          <el-col :span="4" style="margin-top: 8px">
            <el-button size="mini" icon="el-icon-circle-plus-outline" circle
                       @click="addDomain"></el-button>
            <el-button size="mini" icon="el-icon-remove-outline" circle
                       @click.prevent="removeDomain(item)"></el-button>
          </el-col>
      </el-row>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">确认</el-button>
      <el-button @click="reset()">重置</el-button>
    </el-form-item>
  </el-form>
  </div>
  <div style="float: right;width: 50%" align="center">
    <span style="float: left;margin-left: 5%">设计工时管理</span>
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
                      type="text" placeholder="请输入工时百分比">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item style="white-space:nowrap;width: 80px">
            <el-input v-model="item.ratio *designerWorkday/100" oninput="value=value.replace(/[^\d.]/g,'')"
                      type="text">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item>
        <el-button type="primary" @click="onSubmit1">确认</el-button>
        <el-button @click="reset()">重置</el-button>
      </el-form-item>
    </el-form>
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
          return callback(new Error("比例不能超出100%"))
        }else{
          this.ruled = false;
          return callback;
        }
      }
    return{
      isShow : false,
      projectId : "",
      form : {
        project : {},
        workday : []
      },
      form1 : {
        tecWorkday : [
          {name : null,
          ratio :null}
        ]
      },
      designerWorkday : null,
      ruled : false,
      rules:{
        ratio : [{ required: true, validator: rule, trigger: 'blur' }]
      }
    }
  },
  mounted() {
    this.projectId = this.$route.query.project_id;
    this.getData();
  },
  methods:{
    getData(){
      this.$axios
        .post(this.$baseUrl + 'projectWorkDay/queryWorkDay', {},
          {headers:{"id" : this.projectId}})
        .then(res => {
          this.form.project = res.data.data.project;
          this.form.workday = res.data.data.workday;
          this.form1.tecWorkday = res.data.data.tecWorkday;
          this.form.workday.forEach(item =>{
            if (item.type === 3)
              this.designerWorkday = item.value;
          })
        })
        .catch(res => (console.log(res)));
    },
    onSubmit(){
      this.$axios
        .post(this.$baseUrl + 'projectWorkDay/setProWorkDay', {
          "project_id" : this.projectId,
          "list" : this.form.workday
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
        this.$axios
          .post(this.$baseUrl + 'projectWorkDay/setTecWorkDay', {
            "project_id": this.projectId,
            "list": this.form1.tecWorkday,
            "type" : 3
          })
          .then(res => {
            this.$message({
              message: '比例修改成功',
              type: 'success'
            });
          })
          .catch(res => (console.log(res)));
      }else
        this.$message({
          message: '比例不能超出100%',
          type: 'warning'
        });
    },
    reset(){
      this.getData();
    },
    addDomain() {
      if (this.form.workday.length < 3){
        this.form.workday.push({
          name: "",
          value : "",
        })
      }else
        this.$message({
          message: '工时分配类型最多为三种',
          type: 'warning'
        });
    },
    removeDomain(item) {
      let index = this.form.workday.indexOf(item);
      if (index !== -1) {
        this.form.workday.splice(index, 1)
      }
    },
  }
}
</script>

<style scoped>

</style>
