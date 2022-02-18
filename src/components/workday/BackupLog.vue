<template>
  <div class="block">
    <el-row>
    <span class="demonstration">日志范围</span>
    <el-date-picker
      v-model="date"
      size="mini"
      type="daterange"
      @change="getData"
      value-format="yyyy-MM-dd"
      range-separator="至"
      start-placeholder="开始月份"
      end-placeholder="结束月份">
    </el-date-picker>
    </el-row>
  <u-table use-virtual :row-height="28" border :data="list" class="u-table"
           :header-cell-style="{background:'#F5F5F5' }"
           :default-sort = "{prop: 'date', order: 'descending'}"
           v-loading="loading" size = "mini">
    <u-table-column prop="user" label="操作人" min-width="6%" align="center"
    >
    </u-table-column>
    <u-table-column prop="designer" label="设计" min-width="6%" align="center"
    >
    </u-table-column>
    <u-table-column prop="checker" label="校核" min-width="6%" align="center"
                    sortable>
    </u-table-column>
    <u-table-column prop="principal" label="主设" min-width="6%" align="center" sortable>
    </u-table-column>
    <u-table-column prop="headman" label="组长" min-width="6%" align="center"
    >
    </u-table-column>
    <u-table-column prop="designer_workday" label="设计工时" min-width="6%" align="center"
                    sortable>
    </u-table-column>
    <u-table-column prop="checker_workday" label="校核工时" min-width="6%" align="center" sortable>
    </u-table-column>
    <u-table-column prop="principal_workday" label="主设工时" min-width="6%" align="center"
    >
    </u-table-column>
    <u-table-column prop="headman_workday" label="组长工时" min-width="6%" align="center"
                    sortable>
    </u-table-column>
    <u-table-column prop="time" min-width="9%"  label="操作时间" align="center" sortable>
    </u-table-column>
  </u-table>
  </div>
</template>

<script>
export default {
  name: "WorkdayLog",
  data(){
    return {
      loading : false,
      list : [],
      typeList : [],
      users : [],
      date : '',
      projectId : "",
    }
  },

  mounted() {
    const a = new Date();
    const  end = a.getFullYear() + "-" + (Number(a.getMonth())+1).toString().padStart(2,0) + "-" + a.getDate().toString().padStart(2,0)
    const b = new Date(new Date().getTime()-3600*24*30*1000)
    const start =  b.getFullYear() + "-" + (Number(b.getMonth())+1).toString().padStart(2,0) + "-" + b.getDate().toString().padStart(2,0)
    this.date = [start,end]
    this.projectId = this.$route.query.project_id;
    this.getData()
  },
  methods : {
    getData(){
      this.$axios
        .post(this.$baseUrl + 'volume/queryBackupWorkdayLog', {
          id : this.projectId,
          min : this.date[0],
          max : this.date[1]
        })
        .then(res => {
          this.list = res.data.data
        })
        .catch(res => (console.log(res)));
    }
  },
}
</script>

<style scoped>

</style>
