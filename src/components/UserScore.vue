<template>
<div>
  <el-row style="margin-top: 3%">
    <el-col :span="12">
  <el-card class="box-card" style="width: 90%;margin-left: 5%">
    <div slot="header" class="clearfix">
    <span>个人得分</span>
  </div>

  <el-table border ref="table1" :data="listUser" style="width:90%;margin-left: 5%"
            v-loading.lock="loading"  element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            :header-cell-style="this.CellStyleOne" :cell-style="this.CellStyleOne">

    <el-table-column  label="月份" v-if="month != null || month != 0">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        <span style="margin-left: 10px">{{ scope.row.month }} 月</span>
      </template>
    </el-table-column>
    <el-table-column prop="designer" label="质量得分">
    </el-table-column>
    <el-table-column prop="personal" label="进度得分">
    </el-table-column>
    <el-table-column prop="coordinate" label="配合得分">
    </el-table-column>
    <el-table-column prop="score" label="平均得分">
    </el-table-column>
  </el-table>
  </el-card>
    </el-col>
    <el-col :span="12">
  <el-card class="box-card" style="width: 90%;margin-left: 5%">
    <div slot="header" class="clearfix">
      <span>专业得分</span>
    </div>
    <el-table border ref="table1" :data="listTec" style="width:90%;margin-left: 5%"
              v-loading.lock="loading"  element-loading-text="拼命加载中"
              element-loading-spinner="el-icon-loading"
              :header-cell-style="this.CellStyleOne" :cell-style="this.CellStyleOne">
      <el-table-column prop="month" label="月份" sortable="custom" v-if="month != null || month != 0">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.month }} 月</span>
        </template>
      </el-table-column>
      <el-table-column prop="designer" label="质量得分">
      </el-table-column>
      <el-table-column prop="personal" label="进度得分">
      </el-table-column>
      <el-table-column prop="coordinate" label="配合得分">
      </el-table-column>
      <el-table-column prop="score" label="平均得分">
      </el-table-column>
    </el-table>
  </el-card>
    </el-col>
  </el-row>
</div>
</template>

<script>
export default {
name: "UserScore",
  data(){
  return{
    id: "",
    pid: "",
    nowDay: new Date().getDate(),
    month: new Date().getMonth() + 1,
    listMonth : [],
    pageIndex: 1,
    pageSize: 10,
    listUser : [],
    listTec : [],
    loading : true,
  }
  },
  mounted() {
    this.getLogIn();
  },
  methods: {
    search() {
      this.getData();
    },
    reset() {
      this.pageIndex = 1;
      this.getData();
    },
    getLogIn() {
      let i = JSON.parse(sessionStorage.getItem("appraise"));
      this.id = i.id;
      this.pid = i.pid;
      this.getData();
    },
    getData() {
      this.$axios
        .post(this.$baseUrl + 'userScore/queryByScoreId', {
          "id": this.id,
        })
        .then(res => (this.listUser = res.data.data))
        .catch(res => (console.log(res)));
    this.$axios
      .post(this.$baseUrl + 'tecScore/queryByScoreId', {
        "id": this.id,
      })
      .then(res => (this.listTec = res.data.data))
      .catch(res => (console.log(res)));
    this.loading = false;
  },
  }
}
</script>

<style scoped>

</style>
