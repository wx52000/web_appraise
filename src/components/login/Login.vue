<template id="main">
  <div style="height: 100vh;text-align: center ;margin: auto" @keyup.enter="logIn" >
    <div style="top: 50%;left:50%;position: absolute;margin-top: -130px;margin-left: -125px">
            <el-row style="line-height: 50px;font-size: 16px;font-weight: bold;color: #999;">用户登录 / USER
              LOGIN</el-row>
            <el-row style="padding: 0 0 15px 0;">
              <el-input type="text" clearable v-model="username" placeholder="请输入用户名"
                        prefix-icon="el-icon-user" style="width: 250px"></el-input>
            </el-row>
            <el-row style="padding: 0 0 15px 0;">
              <el-input type="password" clearable show-password v-model="password" placeholder="请输入登录密码"
                        prefix-icon="el-icon-lock" style="width: 250px" ></el-input>
            </el-row>
            <el-row>
              <el-button type="primary" style="width: 240px;height: 50px; text-align: center" @click="logIn()">登 录
              </el-button>
            </el-row>
      <el-link style="top: 90%" @click="down" > 请使用360浏览器急速内核，点击下载</el-link>
    </div>
    <canvas id="mySpace">
    </canvas>
  </div>
</template>

<script>
import myBackGroundImg from '../../assets/js/backGroundImg/myBackGroundImg'
export default{
  name: 'Login',
  data() {
    return {
      username: "",
      password: "",
    }
  },
  mounted() {
    myBackGroundImg.setBackGroundImg();
  },
  methods: {
    logIn() {
      if (this.name === "") {
        this.$message.error("请输入用户名称")
      } else if (this.password === "") {
        this.$message.error("请输入登录密码")
      } else {
        this.$axios
          .post(this.$baseUrl + "login",{
            username : this.username,
            paw : this.password,
          })
          .then(res => {
            let userToken = 'Bearer ' + res.data.data.access_token;
            let refresh_token = res.data.data.refresh_token;
            let userString = decodeURIComponent(escape(window.atob(userToken.split('.')[1].replace(/-/g, "+").replace(/_/g, "/"))))
            let role = JSON.parse(userString).authorities[0].trim()
            this.$storage.set('Authorization',userToken);
            this.$storage.set('refresh_token', refresh_token);
            this.$storage.set('role',role)
            if (role !== "外部门"){
            this.$axios
              .post(this.$baseUrl + "position/queryByRoleId",{})
            .then(data => {
              this.$storage.set('menus', data.data.data.menus);
              this.$storage.set('button',data.data.data.button);
              this.$router.replace('/')
            })
              .catch(res => {
              console.log(res)})
            }else {
              this.$router.replace('otherCheck')
            }
              })
            .catch(res => {
            console.log(res)
          });
      }
    },
    down(){
      this.$message.success("即将开始下载");
      window.location.href = this.$baseUrl + 'down/down360';
    }
  }
}
</script>

<style scoped>

</style>
