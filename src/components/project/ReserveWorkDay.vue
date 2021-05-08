<template>
<div>
  <div style="float: left;width: 50%;border-right:solid 1px #000000;box-sizing: border-box" align="center">
    <span style="float: left;margin-left: 5%">主设人管理工时分配</span>
    <el-form ref="form" :model="form" :rules="rules" style="width:90%;margin-top: 10%">
      <el-row v-for="(item,index) in form.principalWorkday" :key="index">
        <el-col :span="9">
          <el-form-item style="white-space:nowrap" label-width="80px">
            <span>{{item.name}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="比例" style="white-space:nowrap"
                        :prop="'principalWorkday.'+index+'.ratio'"
                        :rules="rules.ratio" label-width="80px">
            <el-input v-model="item.ratio" oninput="value=value.replace(/[^\d.]/g,'')"
                      type="text" placeholder="请输入工时百分比">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item style="white-space:nowrap;width: 80px">
            <el-input v-model="item.ratio *principalWorkday/100" oninput="value=value.replace(/[^\d.]/g,'')"
                      type="text">
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
  <div style="float: right;width: 50%" align="center">
    <span style="float: left;margin-left: 5%">备用工时分配</span>
    <el-form ref="form1" :model="form1" :rules="rules" style="width:90%;margin-top: 10%">
      <el-row v-for="(item,index) in form1.reserve" :key="index">
        <el-col :span="9">
          <el-form-item label="专业" style="white-space:nowrap" label-width="80px">
            <el-input v-model="item.name" type="text">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="9">
          <el-form-item label="比例" style="white-space:nowrap"
                        :prop="'reserve.'+index+'.ratio'"
                        :rules="rules.ratio1" label-width="80px">
            <el-input v-model="item.ratio" oninput="value=value.replace(/[^\d.]/g,'')"
                      type="text" placeholder="请输入工时百分比">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item style="white-space:nowrap;width: 80px">
            <el-input v-model="item.ratio *reserveWorkday/100" oninput="value=value.replace(/[^\d.]/g,'')"
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
      const rule1 = async(rule, value, callback) =>{
        let sum = 0;
        this.form1.reserve.forEach(item => {
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
      const rule = async(rule, value, callback) =>{
        let sum = 0;
        this.form.principalWorkday.forEach(item => {
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
        principalWorkday : [
          {name : null,
          ratio : null}
        ]
      },
      form1 : {
        reserve : [
          {name : null,
          ratio :null}
        ]
      },
      principalWorkday : null,
      reserveWorkday : null,
      ruled : false,
      rules:{
        ratio : [{ required: true, validator: rule, trigger: 'blur' }],
        ratio1 : [{ required: true, validator: rule1, trigger: 'blur' }]
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
          res.data.data.workday.forEach(item =>{
            if (item.type === 2)
              this.principalWorkday = item.value;
            else if (item.type ===4)
              this.reserveWorkday = item.value;
          })
        })
        .catch(res => (console.log(res)));
      this.$axios
        .post(this.$baseUrl + 'projectWorkDay/queryReserveWorkday', {},
          {headers:{"id" : this.projectId}})
        .then(res => {
          this.form1.reserve = res.data.data
        })
        .catch(res => (console.log(res)));
      this.$axios
        .post(this.$baseUrl + 'project/queryPrincipal', {},
          {headers:{"id" : this.projectId}})
        .then(res => {
          this.form.principalWorkday = res.data.data
        })
        .catch(res => (console.log(res)));
    },
    onSubmit(){
      if (this.ruled === false) {
        this.$axios
          .post(this.$baseUrl + 'projectWorkDay/setUserWorkDay', {
            "project_id": this.projectId,
            "list": this.form.principalWorkday,
            "type" : 2
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
    onSubmit1(){
      if (this.ruled === false) {
        this.$axios
          .post(this.$baseUrl + 'projectWorkDay/setTecWorkDay', {
            "project_id": this.projectId,
            "list": this.form1.reserve,
            "type" : 4
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
