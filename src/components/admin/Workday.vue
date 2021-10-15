<template>
<div>
  <el-row style="background-color: #FFF; text-align: center">
      <el-row style="text-align: center; align-content: center;">
        <el-col :span="24" style="line-height: 50px;font-size: 16px;font-weight: bold;color: #666;text-align: center ">
          工时信息
        </el-col>
      </el-row>
  </el-row>

      <u-table key="workdayList" use-virtual :row-height="28" border :data="workdayList" class="u-table"
           :max-height=pageHeight
           size = "mini" :cell-style="this.CellStyleOne">
    <u-table-column prop="number" min-width="12%" label="姓名" align="center"  >
    </u-table-column>
    <u-table-column prop="name" min-width="10%" label="总工时" align="center">
    </u-table-column>
    <u-table-column prop="director" min-width="10%" label="卷册工时" align="center"  >
    </u-table-column>
    <u-table-column prop="general" min-width="10" label="初设项目工时" align="center" style="word-break: break-all;">
    </u-table-column>
    <u-table-column prop="create_time" min-width="10%" label="业务建设工时" align="center">
    </u-table-column>
    <u-table-column  width="200px" align="center">
      <template slot="header" slot-scope="scope">
        <el-date-picker
          v-model="value2"
          type="month"
          style="width: 160px"
          size="mini"
          placeholder="选择月">
        </el-date-picker>
      </template>
      <template slot-scope="scope">
        <el-row>
            <el-button
              size="mini"
              @click="">工时详情 </el-button>
        </el-row>
      </template>
    </u-table-column>
  </u-table>
</div>
</template>

<script>
export default {
name: "workday",
  data(){
  return{
    pageHeight : document.body.clientHeight,
    workdayList : [],
    }
  }
}
</script>

<style scoped>

</style>
