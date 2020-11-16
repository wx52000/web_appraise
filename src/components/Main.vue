<template>
  <div>
    <el-row style="margin:-15px auto;text-align: center; align-content: center;">
      <el-col :span="24"
              style="line-height: 50px;font-size: 16px;font-weight: bold;color: #666;text-align: center">
        发电工程公司综合系统
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        已评价人数：{{user1.length}}
      </el-col>
      <el-col :span="6">
        未评价人数：{{user2.length}}
      </el-col>
      <el-col :span="6">
        未被评价人数：{{user3.length}}
      </el-col>
      <el-col :span="6">
        专业未评价人数：{{user4.length}}
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" style="margin-top: 30px">
        <el-card class="box-card" style="width: 80%;margin-left: 10%;" body-style="height : 100px">
          <div slot="header">
            <span>已评价人员名单</span>
          </div>
          <div v-for="u in user1.slice(0,5)" :key="u.id" style="margin-top: -5px">
            {{u.name}}
          </div>
          <el-button style="position: absolute;bottom :5px;margin-left: -3%"
                     type="text">查看更多</el-button>
        </el-card>
      </el-col>
      <el-col :span="12" style="margin-top: 30px">
        <el-card class="box-card" style="width: 80%;margin-left: 10%" body-style="height : 100px">
          <div slot="header" >
            <span>未评价人员名单</span>
          </div>
          <div v-for="u in user2.slice(0,5)" :key="u.id" style="margin-top: -5px">
            {{u.name}}
          </div>
          <el-button style="position: absolute;bottom :5px;margin-left: -3%"
                     type="text">查看更多</el-button>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" style="margin-top: 30px">
        <el-card class="box-card" style="width: 80%;margin-left: 10%" body-style="height : 100px">
          <div slot="header">
            <span>未被评价人员名单</span>
          </div>
          <div v-for="u in user3.slice(0,5)" :key="u.id" style="margin-top: -5px">
            {{u.name}}
          </div>
          <el-button style="position: absolute;bottom :5px;margin-left: -3%"
                     type="text">查看更多</el-button>
        </el-card>
      </el-col>
      <el-col :span="12" style="margin-top: 30px">
        <el-card class="box-card" style="width: 80%;margin-left: 10%" body-style="height : 100px">
          <div slot="header">
            <span>专业未评价人员名单</span>
          </div>
          <div v-for="u in user4.slice(0,5)" :key="u.id" style="margin-top: -5px">
            {{u.name}}
          </div>
          <el-button style="position: absolute;bottom :5px;margin-left: -3%"
                     type="text">查看更多</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
name: "Main.vue",
  data(){
  return {
    login:false,
    id : "",
    name : "",
    user1 : [],
    user2 : [],
    user3 : [],
    user4 : [],
  }
  },
  mounted() {
    this.getLogIn()
  },
  methods: {
    getLogIn() {
      let i = JSON.parse(sessionStorage.getItem("appraise"));
      if (i == null) {
        this.$message.error("请登录！");
        setTimeout(function () { window.location.href = "/"; }, 1000)
      } else
      {
        this.logIn = true;
        this.id = i.id;
        this.name = i.name;
      }
      this.getData()
    },
    getData(){
      this.$axios
        .post(this.$baseUrl + 'user/queryAppraise',{})
        .then(res => {
          this.user1 = res.data.data
        })
        .catch(res => {console.error(res)})
      this.$axios
      .post(this.$baseUrl + 'user/queryNotAppraise',{})
      .then(res => {
        this.user2 = res.data.data
      })
      .catch(res => {console.error(res)})
      this.$axios
        .post(this.$baseUrl + 'user/queryNotScored',{})
        .then(res => {
          this.user3 = res.data.data
        })
        .catch(res => {console.error(res)})
      this.$axios
        .post(this.$baseUrl + 'user/queryNotTecApp',{})
        .then(res => {
          this.user4 = res.data.data
        })
        .catch(res => {console.error(res)})
    }
  }
}
</script>

<style scoped>

</style>
