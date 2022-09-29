<template>
<div>
  <el-row style="font-size: x-large;font-family: 'Helvetica Neue';margin-top: 25px;text-align: center"
          align="center"><span>{{scientific.name}}</span></el-row>
  <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal">
    <el-menu-item index="scientificMain/scientificTermManage" @click="toPage('/scientificMain/scientificTermManage')">项工时管理</el-menu-item>
    <el-menu-item index="scientificMain/scientificWorkdayManage" @click="toPage('/scientificMain/scientificWorkdayManage')">个人工时管理</el-menu-item>
  </el-menu>
  <div>
    <router-view/>
  </div>
</div>
</template>

<script>
export default {
name: "ScientificMain",
  data(){
  return{
    activeIndex : "",
    projectId : "",
    scientific :{},
  }
  },
  mounted() {
    this.projectId = this.$route.query.scientific_id;
    this.getData()
  },
  methods :{
    getData(){
      this.$axios
        .post(this.$baseUrl + 'scientific/queryById',{},{headers : {id : this.projectId}}
        )
        .then(res => {
          this.scientific = res.data.data
        })
        .catch(res => (console.log(res)));
    },
    toPage(path) {
      this.$router.replace(
        {
          path:path,
          query:{
            "scientific_id" : this.projectId
          }
        }
      );
    },
  }

}
</script>

<style scoped>

</style>
