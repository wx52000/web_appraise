<template>
    <div style="width:80%;text-align: center;margin-left: 10%">
      <el-row align="center" style="text-align: center;margin-top: 1%">
        <span style="font-size: 18px;">专业工时分配</span>
      </el-row>
          <el-form ref="form" :model="form"  style="width:80%;margin-top: 1%;margin-left: 10%">
            <el-row style="width: 80%">
              <el-col :span="12" align="center">
            <el-form-item label="总专业工时" style="white-space:nowrap;width: 60%" label-width="120">
              <el-input v-model="form.tec" disabled />
            </el-form-item>
              </el-col>
              <el-col :span="12" align="center">
                <el-form-item label="可用专业工时"
                              style="white-space:nowrap;width: 60%" label-width="120">
                  <el-input v-model="form.usable" class="remarks" style="text-align: center;" disabled/>
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
<!--                <el-form-item label="比例" style="white-space:nowrap"-->
<!--                              :prop="'tecWorkday.'+index+'.ratio'"-->
<!--                               label-width="80px">-->
                <el-form-item label="比例" style="white-space:nowrap"
                              label-width="80px">
                  <el-input v-model="item.ratio" oninput="value=value.replace(/[^\d.]/g,'')"
                            type="text" placeholder="请输入工时百分比"
                            @input="RatioHandle(item)">
                    <template slot="append">%</template>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="工时数" style="white-space:nowrap;width: 80px">
                  <el-input v-model="item.workday" oninput="value=value.replace(/[^\d.]/g,'')"
                            type="text"
                            @input="AmountHandle(item)" v-if="">
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
  name: "MajorWorkday",
  data(){
    return{
      isShow : false,
      disabled : false,
      projectId : "",
      form : {
        usable : "",
        tecWorkday : []
      },
      designerWorkday : null,
    }
  },
  computed:{
    usableAmount(){
      this.form.usable = this.form.tec -  this.form.tecWorkday.reduce((prev, cur) => {
        if (cur.workday !== undefined && cur.workday !== "") {
          return Number(prev) + Number(cur.workday);
        }else return prev
      },0)
    }
  },
  watch:{
    usableAmount(val, old){
    }
  },
  mounted() {
    this.projectId = this.$route.query.project_id;
    this.getData();
  },
  methods:{
    AmountHandle(item){
      item.ratio = Math.round(item.workday/this.form.tec*1000)/10
    },
    RatioHandle(item){
      item.workday = this.form.tec*(item.ratio/100)
    },
    getData(){
      this.form.tecWorkday = [];
      this.$axios
        .post(this.$baseUrl + 'projectWorkDay/queryMajorWorkDay', {},
          {headers:{"id" : this.projectId}})
        .then(res => {
          this.form.tec = res.data.data.major;
          this.form.usable = res.data.data.major;
          res.data.data.workday.forEach(item => {
            if (item.amount === undefined || item.amount === ''){
              item.amount = 0
            }
            this.form.tecWorkday.push({name : item.name,ratio : item.amount/this.form.tec*100 || 0,
              workday : item.amount})
          })
        })
        .catch(res => (console.log(res)));
    },
    onSubmit(){
      if (this.form.usable >= 0) {
        this.$axios
          .post(this.$baseUrl + 'projectWorkDay/setTecWorkDay', {
            "project_id": this.projectId,
            "list": this.form.tecWorkday,
            "type": this.type
          })
          .then(res => {
            this.$message({
              message: '修改成功',
              type: 'success'
            });
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

