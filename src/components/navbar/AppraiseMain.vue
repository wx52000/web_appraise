<template>
  <div>
    <div>
  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
    <el-menu-item index="/appraiseMain/showProject" @click="toPage('/appraiseMain/showProject')">卷册查询</el-menu-item>
    <el-submenu index="2" >
    <template slot="title" >我的评价</template>
    <el-menu-item index="/appraiseMain/appraise" @click="toPage('/appraiseMain/appraise')">个人评价</el-menu-item>
    <el-menu-item index="/appraiseMain/tecAppraise" @click="toPage('/appraiseMain/tecAppraise')">专业评价</el-menu-item>
    </el-submenu>
      <el-menu-item index="/appraiseMain/construction" @click="toPage('/appraiseMain/construction')">施工图项目</el-menu-item>
    <el-menu-item index="/appraiseMain/prophase" @click="toPage('/appraiseMain/prophase')">前期项目和其它项目</el-menu-item>
<!--      <el-menu-item v-if="position !== null && position.indexOf(`1`) != -1" index="/appraiseMain/headmanProject" @click="toPage('/appraiseMain/headmanProject')">组长管理</el-menu-item>-->
<!--    <el-menu-item index="/home/main" @click="toPage('/home/main')"-->
<!--                  style="float: right" v-if="pid == 1">系统管理</el-menu-item>-->
    <el-menu-item  style="float: right" >
      <span style="color: #dd6161">欢迎使用:</span>
      <span style="color: #e6a23c">{{name}}</span>
      <el-dropdown  @command="handleCommand">
        <i class="el-icon-setting" style="margin-bottom: 5px"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-if="showadmin > 0"
          command="1">管理员管理</el-dropdown-item>
            <el-dropdown-item
                              command="2">个人信息页面</el-dropdown-item>
          <el-dropdown-item>退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-menu-item>
  </el-menu>
    </div>
    <div>
      <router-view/>
    </div>
    <el-dialog
      id="pawDialog"
      title="密码修改"
      :visible.sync="visible"
      width="40%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :showClose="false"
      >
      <div style="width:100%;text-align:center" @keyup.enter="updPaw">
      <el-form id="paw" :model="paw" :rules="ruleValidate" label-width="100px"  >
        <el-form-item prop="paw1" label="新密码"  style="width: 60%; padding-left: 15%">
          <el-input pro v-model="paw.paw1" type="password"  autocomplete="off"
                    placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item prop="paw2" label="确认密码" style="width: 60%; padding-left: 15%">
          <el-input v-model="paw.paw2"  type="password"  autocomplete="off"
                          placeholder="请再次输入新密码"  ></el-input>
        </el-form-item>
            <el-button type="primary" @click="updPaw " >确定</el-button>
      </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>

const power_id = [1,2,3]

export default {
  name: "AppraiseMain",
  data() {
    const pawRule1 = async(rule, value, callback) => {
      if (value.length < 6) {
        this.paw1Check = 1
        return callback(new Error('密码不能少于6位！'));
      } else if (value.length > 16) {
        this.paw1Check = 1
        return callback(new Error('密码最长不能超过16位！'));
      } else {
        this.paw1Check = 0
        callback()
      }
    }
    const pawRule2 = async(rule, value, callback) => {
      if (value.length < 1) {
        this.paw2Check = 1
        return callback(new Error('重复密码不能为空！'));
      } else if(this.paw.paw1 !== this.paw.paw2){
        this.paw2Check = 1
        return callback(new Error('两次输入密码不一致！'));
      }else{
        this.paw2Check = 0
        callback()
      }
    };
    return {
      logIn : false,
      activeIndex: '1',
      visible : false ,
      id : "",
      name : "",
      pid : "",
      showadmin : 0,
      position : "",
      grade : "",
      paw : {
        paw1 :"",
        paw2 :""
      },
      paw1Check : 0,
      paw2Check : 1,
      ruleValidate: {
        paw1: [
          { required: true, validator: pawRule1, trigger: 'blur' }
        ],
        paw2: [
          { required: true, validator: pawRule2, trigger: 'blur' }
        ]
      }
    };
  },
  mounted() {
    this.getLogIn()
    this.activeIndex = this.$route.path
  },
  methods: {
    getLogIn() {
      this.$axios
        .post(this.$baseUrl + 'user/queryById'
        )
        .then(res => {
          this.name = res.data.data.name;
        this.pid = res.data.data.pid
          this.showadmin = power_id.find(obj =>{
            return obj === this.pid;
          })
          if (res.data.data.pawState === 0) {
            this.visible = true;
          }
        })
        .catch(res => (console.log(res)));
    },

    handleCommand(command){
      if (command === "1"){
        this.$router.push('/home')
      }else if (command === "2"){
        this.activeIndex = "";
        this.$router.replace('/appraiseMain/self')
      }else {
        this.$storage.removeAll();
        this.$router.push('/login')
      }
    },
    toPage(path) {
      this.$router.replace(path);
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    updPaw(){
      if (this.paw1Check ===0 && this.paw2Check ===0 ) {
        this.$axios
          .post(this.$baseUrl + "user/paw", {
            "id": this.id,
            "paw": this.paw.paw2
          })
          .then(res => {
            if (res.data.code === 0) {
              this.$message("密码修改成功，请重新登录");
              setTimeout(function () { window.location.href = "/#/login" }, 1000)

            }
          })
          .catch(res => console.log(res))

      }else {
        this.$message.error("密码输入有误")
        return 0;
      }
    },
  }
}

</script>

<style scoped>
.el-menu-demo{
  text-align: center;
}
</style>
