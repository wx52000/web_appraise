<template>
<div style="width: 88%;text-align: center;margin-left: 6%" >
  <el-descriptions class="margin-top"
                   title="个人信息" style="margin-left: 6%" :column="4">
    <template slot="extra">
      <el-button type="text" size="mini" @click="openPaw">密码修改</el-button>
      <el-button type="text" size="mini" @click="signOut">退出登录</el-button>
    </template>
    <el-descriptions-item label="姓名"><span>{{information.name}}</span></el-descriptions-item>
    <el-descriptions-item label="工号"><span>{{information.username}}</span></el-descriptions-item>
    <el-descriptions-item label="部门" :span="2"><span>{{information.office}}</span></el-descriptions-item>
  </el-descriptions>
  <el-card>
  <el-table
    :data="list"
    style="text-align: center;">
    <el-table-column type="expand">
      <template slot-scope="props">
        <div>
        <el-form label-position="left" inline class="demo-table-expand">
          <el-form-item label="专业名称">
            <span>{{ props.row.tec }}</span>
          </el-form-item>
          <el-form-item label="相关专业">
            <span>{{ props.row.otherTec }}</span>
          </el-form-item>
          <el-form-item label="工作范围">
            <span>{{ props.row.scope }}</span>
          </el-form-item>
          <el-form-item label="计划完成时间">
            <span>{{ props.row.plannedDate }}</span>
          </el-form-item>
          <el-form-item label="项目阶段">
            <span>{{ props.row.stage }}</span>
          </el-form-item>
          <el-form-item label="备注">
            <span>{{ props.row.note }}</span>
          </el-form-item>
        </el-form>
        </div>
      </template>
    </el-table-column>
    <el-table-column
      label="项目编号"
      prop="number">
    </el-table-column>
    <el-table-column
      label="项目名称"
      prop="name">
    </el-table-column>
    <el-table-column
      label="设总"
      prop="general">
    </el-table-column>
      <el-table-column
        label="申请工时数"
        prop="workday">
    </el-table-column>
    <el-table-column  width="200px" align="center" fixed="right">
      <template slot-scope="scope">
        <el-row>
          <el-col :span="12">
            <el-button
              size="mini"
              @click="setCheck(scope.row,2)">回退</el-button>
          </el-col>
          <el-col :span="12">
            <el-button
              size="mini"
              @click="setCheck(scope.row,1)">通过</el-button>
          </el-col>
        </el-row>
      </template>
    </el-table-column>
  </el-table>
  </el-card>
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
        <el-button type="primary" @click="this.visible = false" v-if="this.pawWindow">确定</el-button>
        <el-button type="primary" @click="updPaw">确定</el-button>
      </el-form>
    </div>
  </el-dialog>
</div>
</template>

<script>
import {resetRouter} from "../../router";

export default {
name: "OtherCheck",
  data(){
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
    information : {},
    list : [],
    search : "",
    visible : false,
    paw : {
      paw1 :"",
      paw2 :""
    },
    pawWindow : false,
    ruleValidate: {
      paw1: [
        { required: true, validator: pawRule1, trigger: 'blur' }
      ],
      paw2: [
        { required: true, validator: pawRule2, trigger: 'blur' }
      ]
    }
  }
  },
  mounted() {
  this.getData()
  },
  methods : {
    cardStyle(){
      console.log(document.body.scrollHeight)
      return
    },
    getData() {
      this.$axios
        .post(this.$baseUrl + 'otherUser/queryById')
        .then(res => {
          this.information = res.data.data
          if (this.information.paw_state !== 1){
            this.visible = true;
          }
        })
        .catch(res => (console.log(res)));
      this.$axios
        .post(this.$baseUrl + 'otherUser/queryCheckList')
        .then(res => {
          this.list = res.data.data
        })
        .catch(res => (console.log(res)));
    },
    setCheck(row,check) {
      this.$axios
        .post(this.$baseUrl + 'otherUser/setCheck',{
          id : row.id,
          check : check
        })
        .then(res => {
          this.getData()
          this.$message.success("操作成功")
        })
        .catch(res => (console.log(res)));
    },
    signOut(){
      resetRouter();
      this.$storage.removeAll();
      this.$router.push('/login')
    },
    openPaw(){
      this.pawWindow = true;
      this.visible = true;
    },
    updPaw() {
      if (this.paw1Check === 0 && this.paw2Check === 0) {
        this.$axios
          .post(this.$baseUrl + "otherUser/setPaw", {
            "paw": this.paw.paw2
          })
          .then(res => {
            if (res.data.code === 0) {
              this.$message("密码修改成功，请重新登录");
              setTimeout(function () {
                window.location.href = "http://10.136.238.22:8080/#/login"
              }, 500)

            }
          })
          .catch(res => console.log(res))
      } else {
        this.$message.error("密码输入有误")
        return 0;
      }
    },
  }
}
</script>

<style scoped>

</style>
