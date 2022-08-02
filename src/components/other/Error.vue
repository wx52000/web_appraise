<template>
<div style="text-align: center">
  <el-row>
  <h3>暂无权限</h3>
  </el-row>
  <el-row>
  <el-button type="text" @click="$router.go(-1)">返回上一级</el-button>
  </el-row>
</div>
</template>

<script>
export default {
name: "Error"
}
</script>

<style scoped>

</style>
